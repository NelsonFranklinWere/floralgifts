#!/usr/bin/env node
/** Copy static assets into Next.js standalone bundle for `node server.js`. */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const standalone = path.join(root, ".next", "standalone");
const standaloneNext = path.join(standalone, ".next");

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

if (!fs.existsSync(standalone)) {
  console.warn("[prepare-standalone] No .next/standalone — skip (run next build first).");
  process.exit(0);
}

copyDir(path.join(root, "public"), path.join(standalone, "public"));
copyDir(path.join(root, ".next", "static"), path.join(standaloneNext, "static"));
console.log("[prepare-standalone] public + static copied into standalone bundle.");
