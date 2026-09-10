/**
 * Seeds the Sale catalog (site_settings key "sale_catalog_ids") with an
 * initial 20 products that have images, if the catalog is currently empty.
 *
 * Usage: node scripts/seed-sale-catalog.js
 */
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

function loadEnv(file) {
  const env = {};
  if (!fs.existsSync(file)) return env;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
  return env;
}

const env = loadEnv(path.join(__dirname, "..", ".env.local"));
if (!process.env.PGHOST && !env.PGHOST && !process.env.DATABASE_URL && !env.DATABASE_URL) {
  console.error("Missing PG* / DATABASE_URL configuration");
  process.exit(1);
}

const pool = new Pool({
  host: process.env.PGHOST || env.PGHOST,
  port: Number(process.env.PGPORT || env.PGPORT || 5432),
  database: process.env.PGDATABASE || env.PGDATABASE,
  user: process.env.PGUSER || env.PGUSER,
  password: process.env.PGPASSWORD || env.PGPASSWORD,
  connectionString: process.env.DATABASE_URL || env.DATABASE_URL,
});

const KEY = "sale_catalog_ids";
const LEGACY_KEY = "sell_catalog_ids";

async function upsertSetting(key, value) {
  await pool.query(
    `INSERT INTO site_settings (key, value, description)
     VALUES ($1, $2, $3)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, description = EXCLUDED.description`,
    [
      key,
      value,
      "Product ids shown on the /sale page and in the Meta Catalog CSV feed (/sale.csv)",
    ]
  );
}

async function main() {
  console.log("=== Seed Sale catalog ===");

  // Prefer existing sale_catalog_ids; fall back to migrating sell_catalog_ids
  for (const key of [KEY, LEGACY_KEY]) {
    const { rows } = await pool.query("SELECT value FROM site_settings WHERE key = $1", [key]);

    let existing = [];
    try {
      existing = rows[0]?.value ? JSON.parse(rows[0].value) : [];
    } catch {
      existing = [];
    }

    if (Array.isArray(existing) && existing.length > 0) {
      if (key === LEGACY_KEY) {
        await upsertSetting(KEY, JSON.stringify(existing));
        console.log(`Migrated ${existing.length} products from sell → sale catalog.`);
      } else {
        console.log(`Sale catalog already has ${existing.length} products. Skipping seed.`);
      }
      await pool.end();
      return;
    }
  }

  const { rows: candidates } = await pool.query(
    'SELECT id, title, category, images, stock FROM products ORDER BY created_at DESC LIMIT 100'
  );

  const withImages = candidates.filter(
    (p) =>
      Array.isArray(p.images) &&
      p.images.length > 0 &&
      (p.stock === null || p.stock === undefined || p.stock > 0)
  );

  const byCategory = {};
  for (const p of withImages) {
    (byCategory[p.category] = byCategory[p.category] || []).push(p);
  }

  const seed = [];
  const categories = Object.keys(byCategory);
  let i = 0;
  while (seed.length < 20) {
    let added = false;
    for (const cat of categories) {
      if (seed.length >= 20) break;
      const item = byCategory[cat][i];
      if (item) {
        seed.push(item);
        added = true;
      }
    }
    if (!added) break;
    i++;
  }

  if (seed.length === 0) {
    console.log("No products with images found. Nothing to seed.");
    await pool.end();
    return;
  }

  const ids = seed.map((p) => p.id);
  await pool.query(
    `INSERT INTO site_settings (key, value, description)
     VALUES ($1, $2, $3)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, description = EXCLUDED.description`,
    [
      KEY,
      JSON.stringify(ids),
      "Product ids shown on the /sale page and in the Meta Catalog CSV feed (/sale.csv)",
    ]
  );

  console.log(`Seeded ${seed.length} products into the Sale catalog:`);
  seed.forEach((p) => console.log(`  - [${p.category}] ${p.title}`));
  console.log("Done.");
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
