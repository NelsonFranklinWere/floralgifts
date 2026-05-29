import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const lockPath = path.join(root, ".next", "dev", "lock");

function killPort(port) {
  try {
    const out = execSync(`netstat -ano | findstr :${port}`, { encoding: "utf8" });
    const pids = new Set();
    for (const line of out.split("\n")) {
      if (!line.includes("LISTENING")) continue;
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && /^\d+$/.test(pid)) pids.add(pid);
    }
    for (const pid of pids) {
      try {
        execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
        console.log(`Stopped process ${pid} on port ${port}`);
      } catch {
        /* ignore */
      }
    }
  } catch {
    /* no process on port */
  }
}

killPort(3000);
killPort(3001);

if (fs.existsSync(lockPath)) {
  fs.unlinkSync(lockPath);
  console.log("Removed .next/dev/lock");
}

console.log("Done. Start the app with: npm run dev");
