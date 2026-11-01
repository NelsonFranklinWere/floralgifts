import { promises as fs } from "fs";
import path from "path";

/**
 * Resolve writable public/ subdirs for both normal and Next standalone cwd.
 * Standalone server.js chdirs into `.next/standalone`, so `process.cwd()/public`
 * is NOT the site-root `public/` that nginx (and older assets) use.
 */
export function resolvePublicUploadDirs(...relativeParts: string[]): string[] {
  const cwd = process.cwd();
  const dirs = new Set<string>();
  dirs.add(path.join(cwd, "public", ...relativeParts));

  // .next/standalone → site root is ../..
  if (cwd.replace(/\\/g, "/").includes("/.next/standalone")) {
    dirs.add(path.join(cwd, "..", "..", "public", ...relativeParts));
  } else {
    // Also cover the case where cwd is site root but standalone public exists
    dirs.add(path.join(cwd, ".next", "standalone", "public", ...relativeParts));
  }

  return [...dirs];
}

export async function writePublicUpload(
  relativeParts: string[],
  filename: string,
  data: Buffer,
): Promise<string[]> {
  const dirs = resolvePublicUploadDirs(...relativeParts);
  const written: string[] = [];
  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true });
    const full = path.join(dir, filename);
    await fs.writeFile(full, data);
    written.push(full);
  }
  return written;
}
