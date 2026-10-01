// Shared by the generators.
import { writeFileSync, readFileSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { createHash } from "node:crypto";
export const idFor = (pack, s) => createHash("sha1").update(`${pack}:${s}`).digest("hex").slice(0, 16);
export const STATS = { coreVersion: "13.351", systemId: "sr2e", systemVersion: "0.102.0", createdTime: 1790000000000,
  modifiedTime: 1790000000000, lastModifiedBy: null, compendiumSource: null, duplicateSource: null, exportSource: null };
const safe = (n) => n.replace(/[^A-Za-z0-9]+/g, "_").replace(/^_|_$/g, "");
const keepImg = (path, fallback) => {
  if (!existsSync(path)) return fallback;
  try { return JSON.parse(readFileSync(path, "utf8")).img ?? fallback; } catch (e) { return fallback; }
};

/** Write a whole pack: removes files no longer generated, keeps art. */
export function writePack(pack, docs, collection = "items") {
  const dir = `packs-src/${pack}`;
  mkdirSync(dir, { recursive: true });
  const keep = new Set();
  for (const d of docs) {
    const file = `${dir}/${safe(d.name)}_${d._id}.json`;
    keep.add(file.split("/").pop());
    d.img = keepImg(file, d.img);
    d._key = `!${collection}!${d._id}`;
    writeFileSync(file, JSON.stringify(d, null, 2) + "\n");
  }
  for (const f of readdirSync(dir)) if (f.endsWith(".json") && !keep.has(f)) rmSync(`${dir}/${f}`);
  console.log(`${pack}: ${docs.length}`);
}

