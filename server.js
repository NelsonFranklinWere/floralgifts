/**
 * Production Node.js entry point (no `next start` wrapper).
 * Uses Next.js standalone output when available, otherwise falls back to getRequestHandler.
 */
const http = require("http");
const path = require("path");
const fs = require("fs");
const { parse } = require("url");

const port = Number(process.env.PORT) || 3000;
const hostname = process.env.HOSTNAME || "0.0.0.0";

const standaloneDir = path.join(__dirname, ".next", "standalone");
const standaloneServer = path.join(standaloneDir, "server.js");

if (fs.existsSync(standaloneServer)) {
  process.chdir(standaloneDir);
  require(standaloneServer);
} else {
  const next = require("next");
  const app = next({ dev: false, dir: __dirname, hostname, port });
  const handle = app.getRequestHandler();

  app.prepare().then(() => {
    http
      .createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
      })
      .listen(port, hostname, () => {
        console.log(`Floral Whispers Node server ready on http://${hostname}:${port}`);
      });
  });
}
