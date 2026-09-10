/**
 * Reconcile pending orders that have a Pesapal tracking ID against live Pesapal.
 * Marks FAILED when Pesapal reports failed; PAID when completed.
 *
 * Usage: node scripts/reconcile-pesapal-pending.js
 */
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

function loadEnv(file) {
  const env = {};
  if (!fs.existsSync(file)) return env;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
  return env;
}

const env = {
  ...loadEnv(path.join(__dirname, "..", ".env.local")),
  ...process.env,
};

const pool = new Pool({
  host: env.PGHOST,
  port: env.PGPORT ? Number(env.PGPORT) : undefined,
  database: env.PGDATABASE,
  user: env.PGUSER,
  password: env.PGPASSWORD,
  connectionString: env.DATABASE_URL,
});

async function getToken() {
  const isProd = (env.PESAPAL_ENV || "sandbox") === "production";
  const baseUrl = isProd
    ? "https://pay.pesapal.com/v3"
    : "https://cybqa.pesapal.com/pesapalv3";
  const res = await fetch(`${baseUrl}/api/Auth/RequestToken`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      consumer_key: env.PESAPAL_CONSUMER_KEY,
      consumer_secret: env.PESAPAL_CONSUMER_SECRET,
    }),
  });
  const data = await res.json();
  if (!res.ok || !data.token) throw new Error(JSON.stringify(data));
  return { token: data.token, baseUrl };
}

async function checkStatus(baseUrl, token, orderTrackingId) {
  const res = await fetch(
    `${baseUrl}/api/Transactions/GetTransactionStatus?orderTrackingId=${encodeURIComponent(orderTrackingId)}`,
    { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
  );
  return res.json();
}

function mapStatus(data) {
  const code = data?.status_code ?? data?.payment_status_code;
  const desc = String(data?.payment_status_description || data?.status || "").toUpperCase();
  if (code === 1 || desc === "COMPLETED" || desc.includes("COMPLETE") || desc === "SUCCESS") {
    return "paid";
  }
  if (code === 2 || code === 3 || desc === "FAILED" || desc === "REVERSED") {
    return "failed";
  }
  return "pending";
}

async function main() {
  if (!env.PGHOST && !env.DATABASE_URL) {
    throw new Error("Missing PG* / DATABASE_URL configuration");
  }
  if (!env.PESAPAL_CONSUMER_KEY || !env.PESAPAL_CONSUMER_SECRET) {
    throw new Error("Missing Pesapal credentials");
  }

  const { rows: pending } = await pool.query(
    `SELECT id, status, payment_method, total_amount, customer_name,
            pesapal_order_tracking_id, created_at
       FROM orders
      WHERE status = 'pending' AND pesapal_order_tracking_id IS NOT NULL`
  );

  console.log(`Pending with Pesapal tracking: ${pending.length}`);
  if (!pending.length) {
    await pool.end();
    return;
  }

  const { token, baseUrl } = await getToken();
  let paid = 0;
  let failed = 0;
  let stillPending = 0;

  for (const o of pending) {
    const data = await checkStatus(baseUrl, token, o.pesapal_order_tracking_id);
    const next = mapStatus(data);
    const conf = data?.confirmation_code || null;
    const method = data?.payment_method || null;
    console.log(
      `${o.id.slice(0, 8)} ${o.customer_name} → Pesapal: ${data?.payment_status_description || data?.status} (${next})`
    );

    if (next === "pending") {
      stillPending++;
      continue;
    }

    const updates = {
      status: next,
      updated_at: new Date().toISOString(),
    };
    if (conf) updates.pesapal_confirmation_code = conf;
    if (method) updates.pesapal_payment_method = method;

    try {
      await pool.query(
        `UPDATE orders
            SET status = $1,
                updated_at = $2,
                pesapal_confirmation_code = COALESCE($3, pesapal_confirmation_code),
                pesapal_payment_method = COALESCE($4, pesapal_payment_method)
          WHERE id = $5 AND status = 'pending'`,
        [next, updates.updated_at, conf, method, o.id]
      );
    } catch (updErr) {
      console.error("  update failed:", updErr.message);
      continue;
    }
    if (next === "paid") paid++;
    else failed++;
  }

  console.log(`\nDone. paid=${paid} failed=${failed} still_pending=${stillPending}`);
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
