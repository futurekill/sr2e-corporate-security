// Validate packs-src against module.json: every declared pack exists, every file
// is JSON with a 16-char _id, a matching _key, a name, and the fields its
// DOCUMENT TYPE needs (read from the manifest, not assumed). Ids are unique.
import { readFileSync, readdirSync, existsSync } from "node:fs";

const manifest = JSON.parse(readFileSync("module.json", "utf8"));
const COLLECTION = { Item: "items", Actor: "actors", JournalEntry: "journal" };
const ITEM_TYPES = ["skill", "weapon", "armor", "spell", "cyberware", "bioware", "gear", "program", "adept_power",
  "contact", "lifestyle", "ammo", "focus", "vehicle_mod", "race", "tradition", "quality"];
const ACTOR_TYPES = ["character", "npc", "vehicle", "spirit", "ic", "host"];
const errors = [];
const ids = new Set();
let count = 0;

for (const pack of manifest.packs) {
  const dir = `packs-src/${pack.name}`;
  if (!existsSync(dir)) { errors.push(`${pack.name}: no packs-src directory`); continue; }
  const files = readdirSync(dir).filter(f => f.endsWith(".json"));
  if (!files.length) errors.push(`${pack.name}: empty`);
  for (const f of files) {
    const at = `${pack.name}/${f}`;
    let d;
    try { d = JSON.parse(readFileSync(`${dir}/${f}`, "utf8")); } catch (e) { errors.push(`${at}: bad JSON`); continue; }
    count++;
    if (!/^[A-Za-z0-9]{16}$/.test(d._id ?? "")) errors.push(`${at}: _id must be 16 alphanumerics`);
    if (ids.has(d._id)) errors.push(`${at}: duplicate _id ${d._id}`);
    ids.add(d._id);
    if (d._key !== `!${COLLECTION[pack.type]}!${d._id}`) errors.push(`${at}: _key should be !${COLLECTION[pack.type]}!${d._id}`);
    if (!d.name) errors.push(`${at}: no name`);
    if (pack.type === "Item") {
      if (!ITEM_TYPES.includes(d.type)) errors.push(`${at}: unknown item type ${d.type}`);
      if (!d.system) errors.push(`${at}: no system`);
    } else if (pack.type === "Actor") {
      if (!ACTOR_TYPES.includes(d.type)) errors.push(`${at}: unknown actor type ${d.type}`);
      if (!d.system || !Array.isArray(d.items)) errors.push(`${at}: needs system and items[]`);
      for (const it of d.items ?? []) if (!/^[A-Za-z0-9]{16}$/.test(it._id ?? "")) errors.push(`${at}: embedded item ${it.name} bad _id`);
    } else if (pack.type === "JournalEntry") {
      if (!Array.isArray(d.pages) || !d.pages.length) errors.push(`${at}: needs pages[]`);
      for (const p of d.pages ?? []) if (!/^[A-Za-z0-9]{16}$/.test(p._id ?? "") || !p.text?.content) errors.push(`${at}: page ${p.name} needs _id and text`);
    }
    if (typeof d.img === "string" && d.img.startsWith(`modules/${manifest.id}/`) && !existsSync(d.img.replace(`modules/${manifest.id}/`, "")))
      errors.push(`${at}: img missing on disk: ${d.img}`);
  }
}
if (errors.length) { console.error(errors.join("\n")); console.error(`${errors.length} problem(s)`); process.exit(1); }
console.log(`All packs valid: ${count} documents in ${manifest.packs.length} packs.`);
