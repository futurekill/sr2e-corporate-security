// Generate the Corporate Security Handbook actors: the 18 security personnel
// (npc, p.106-121) and the VTOLs and drone (vehicle, p.86-89). Archetypes are in
// gen-archetypes.mjs. Stat blocks come from tools/data/personnel.json, transcribed
// from page renders. Mapping follows the system's core contacts generator: a
// parenthesised figure is a `mod` on the printed base, Reaction's `mod` lands the
// derived value (floor((Q+I)/2) of the VALUES) on the printed number, and
// Initiative dice are the printed total. Starred, decking/rigging-only figures
// stay in the bio. Spells that exist in the system's core spell compendium are
// embedded (copied, Force set); the rest are listed in the bio.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { idFor, STATS, writePack } from "./lib.mjs";

const DATA = JSON.parse(readFileSync("tools/data/personnel.json", "utf8"));
const CORE = "../sr2e-foundryvtt/packs-src";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const slug = (n) => n.toLowerCase().replace(/['’.:]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** The system's core spells, by name (lower-case). */
const CORE_SPELLS = new Map();
if (existsSync(`${CORE}/spells`)) for (const f of readdirSync(`${CORE}/spells`)) {
  if (!f.endsWith(".json")) continue;
  const d = JSON.parse(readFileSync(`${CORE}/spells/${f}`, "utf8"));
  CORE_SPELLS.set(d.name.toLowerCase(), d);
}

const ACTIVE = new Set(["armed combat", "biotech", "car", "computer", "conjuring", "demolitions", "electronics", "etiquette",
  "firearms", "gunnery", "interrogation", "leadership", "negotiation", "sorcery", "stealth", "unarmed combat",
  "vectored thrust vehicles", "vectored thrust", "rotorcraft", "remote operations"]);
function skillCategory(name, special) {
  if (special) return "special";
  if (/\(b\/r\)/i.test(name)) return "build_repair";
  return ACTIVE.has(name.replace(/\s*\(.*$/, "").trim().toLowerCase()) ? "active" : "knowledge";
}
const skillItem = (owner, name, rating, category) => ({
  _id: idFor("csh-skill", `${owner}:${name}`), name, type: "skill", img: "icons/svg/book.svg",
  system: { category, rating, linkedAttribute: "intelligence", allocated: null, ratingsFinalized: true,
    concentration: { name: "", rating: 0 }, specialization: { name: "", rating: 0 }, description: "" },
  effects: [], flags: {}, _stats: STATS, folder: null, sort: 0, ownership: { default: 0 }
});
function spellItems(owner, spells = {}) {
  const items = [], missing = [];
  for (const [name, force] of Object.entries(spells)) {
    // An "(Extended)" variant has its own rules (wider area, different drain), so
    // the plain core spell is not a stand-in for it: list it for the GM instead.
    const core = /\(extended\)/i.test(name) ? null : CORE_SPELLS.get(name.toLowerCase());
    if (!core) { missing.push(`${name} ${force}`); continue; }
    const s = structuredClone(core);
    delete s._key; delete s.folder;
    items.push({ ...s, _id: idFor("csh-spell", `${owner}:${name}`), name, system: { ...s.system, force }, sort: 0 });
  }
  return { items, missing };
}

// Every printed stat must land somewhere: fail the build if one is dropped.
const KNOWN = new Set(["name", "page", "pr", "race", "attrs", "magic", "magicType", "boosted", "conditional", "dice", "pools",
  "skills", "skillsBoosted", "special", "powers", "cyber", "bioware", "spells", "gear", "note", "bodyIndex", "blurb"]);
for (const c of [...DATA.contacts, ...DATA.archetypes]) {
  const extra = Object.keys(c).filter(k => !KNOWN.has(k));
  if (extra.length) throw new Error(`${c.name}: unmapped field(s) ${extra.join(", ")}`);
  for (const k of ["body", "quickness", "strength", "charisma", "intelligence", "willpower", "essence", "reaction"])
    if (typeof c.attrs?.[k] !== "number") throw new Error(`${c.name}: attribute ${k} missing`);
}

function contactActor(c, archetype = false) {
  const _id = idFor(archetype ? "csh-archetypes" : "csh-contacts", c.name), a = c.attrs, boost = c.boosted ?? {};
  const val = (k) => boost[k] ?? a[k];
  const attr = (k) => ({ base: a[k], mod: val(k) - a[k], value: val(k), racial: 0 });
  const { items: spells, missing } = spellItems(c.name, c.spells);
  const items = [
    ...Object.entries(c.skills ?? {}).map(([n, r]) => skillItem(c.name, n, r, skillCategory(n, false))),
    ...Object.entries(c.special ?? {}).map(([n, r]) => skillItem(c.name, n, r, skillCategory(n, true))),
    ...spells
  ];
  const [lo] = (c.pr || "0").split("-").map(Number);
  const list = (label, arr) => arr?.length ? `<p><strong>${label}:</strong> ${esc(arr.join("; "))}</p>` : "";
  const bio = [
    `<p>${esc(c.blurb)}</p>`,
    Object.keys(boost).length ? `<p><strong>Augmented (applied):</strong> ${esc(Object.entries(boost).map(([k, v]) => `${k} ${a[k]} (${v})`).join(", "))}.</p>` : "",
    c.conditional ? `<p><strong>When jacked in:</strong> ${esc(c.conditional)}</p>` : "",
    c.skillsBoosted ? `<p><strong>Skills:</strong> ${esc(c.skillsBoosted)}</p>` : "",
    c.note ? `<p><strong>Note:</strong> ${esc(c.note)}</p>` : "",
    c.pools ? `<p><strong>Dice Pools (printed):</strong> ${esc(c.pools)}</p>` : "",
    list("Physical adept talents", c.powers), list("Bioware", c.bioware), list("Cyberware", c.cyber),
    c.bodyIndex ? `<p><strong>Body Index:</strong> ${c.bodyIndex}</p>` : "",
    missing.length ? `<p><strong>Grimoire II spells</strong> (not in any compendium yet — add them by hand): ${esc(missing.join(", "))}.</p>` : "",
    c.magicType === "full_magician" ? "<p>The book doesn't print this magician's tradition; it's set to hermetic. Change it if you like.</p>" : "",
    `<p><strong>Gear:</strong> ${esc(c.gear ?? "As appropriate.")}</p>`,
    c.pr ? `<p><strong>Professional Rating:</strong> ${c.pr}${c.pr.includes("-") ? ` (the sheet stores ${lo}; the book prints a range)` : ""}</p>` : "",
    archetype ? "<p><strong>Archetype.</strong> A ready-to-play character in the book's stat-block form: values here are exactly as printed (the book gives only total Essence, not a per-implant breakdown). To play one, make a character and copy these numbers, cyberware and gear across.</p>" : "",
    `<p><em>Corporate Security Handbook p.${c.page}.</em></p>`
  ].filter(Boolean).join("\n");
  const img = existsSync(`assets/contact_portraits/${slug(c.name)}.webp`)
    ? `modules/sr2e-corporate-security/assets/contact_portraits/${slug(c.name)}.webp` : "icons/svg/mystery-man.svg";
  return {
    _id, name: c.name, type: "npc", img,
    system: {
      biography: bio, race: c.race ?? "human", professionalRating: lo,
      body: attr("body"), quickness: attr("quickness"), strength: attr("strength"),
      charisma: attr("charisma"), intelligence: attr("intelligence"), willpower: attr("willpower"),
      essence: { value: a.essence, max: 6 },
      reaction: { mod: val("reaction") - Math.floor((val("quickness") + val("intelligence")) / 2) },
      initiative: { base: 0, dice: c.dice ?? 1, mod: 0 },
      ...(c.magic ? { magic: { value: c.magic, max: c.magic, type: c.magicType ?? "full_magician",
        tradition: c.magicType === "full_magician" ? "hermetic" : "none" } } : {}),
      // NPCs don't derive Magic Pool, so write it: Sorcery for a full magician (SR2 p.84).
      ...(c.magicType === "full_magician" ? { dicePools: { magic: { value: c.skills?.Sorcery ?? 0, max: c.skills?.Sorcery ?? 0 } } } : {}),
      ...(c.bodyIndex ? { bodyIndex: { value: c.bodyIndex } } : {})
    },
    items, effects: [], flags: {}, folder: null, sort: 0, _stats: STATS, ownership: { default: 0 },
    prototypeToken: { name: c.name, actorLink: false, disposition: archetype ? 1 : -1, texture: { src: img }, lockRotation: true }
  };
}

/* ── Vehicles (p.86-89) ───────────────────────────────────────────────────── */
function vehicle(name, page, s, notes, mods = []) {
  const _id = idFor("csh-vehicles", name);
  const img = existsSync(`assets/vehicle_portraits/${slug(name)}.webp`)
    ? `modules/sr2e-corporate-security/assets/vehicle_portraits/${slug(name)}.webp` : "icons/svg/car.svg";
  return {
    _id, name, type: "vehicle", img,
    system: { skill: "", acceleration: 0, sensor: 0, autonav: 0, conditionMonitor: { value: 0, max: 10 }, ...s,
      notes: `<p>${notes}</p><p><em>Corporate Security Handbook p.${page}.</em></p>` },
    items: [], effects: [], flags: {}, folder: null, sort: 0, _stats: STATS, ownership: { default: 0 },
    prototypeToken: { name, actorLink: false, disposition: 0, texture: { src: img }, lockRotation: false }
  };
}
const DEALER = "Divide the Availability target number by 3 (round up) for the mercenary contact known as the Dealer (Fields of Fire p.81).";
const VEHICLES = [
  vehicle("Ares TR-55T Traveler VTOL", 86, { vehicleType: "vectored_thrust", handling: 5, speed: 170, body: 3, armor: 0, signature: 3, pilot: 3,
    seating: "Twin bucket seats + 20 bucket seats", cargo: 30, cost: 500000, availability: "50/25 days" },
    `Tilt-wing VTOL, the most popular TR-55: smooth, even lift and descent for short-distance commuters, five more passengers than its rivals. Speed 170/350 (cruise/maximum; the sheet holds the cruise figure). Acceleration is not printed. Access 1 + 1 standard. Economy 1.2 km per liter (VTOL: 0.75 km/liter). Fuel IC/1,600 liters. Storage 10 CF storage + 20 CF cargo. Landing/Takeoff VTOL/STOL. Street Index 2. ${DEALER} Options (CSH Vehicle Options pack): Rigger Control System 10,000¥ (6 CF), Wet Bar/Steward Area 2,500¥ (5 CF).`),
  vehicle("Ares TR-55E \"President's Edition\" Executive VTOL", 87, { vehicleType: "vectored_thrust", handling: 5, speed: 170, body: 3, armor: 0, signature: 3, pilot: 3,
    seating: "Twin bucket seats + 9 executive bucket seats", cargo: 20, cost: 650000, availability: "65/65 days" },
    `Twin bucket seats in a separated cockpit for the pilots and deluxe leather lounge seats for nine. Speed 170/350 (cruise/maximum; the sheet holds the cruise figure). Acceleration is not printed. Access 1 + 1 standard. Economy 1.2 km per liter (VTOL: 0.75 km/liter). Fuel IC/1,520 liters. Storage 10 CF storage + 10 CF cargo. Landing/Takeoff VTOL/STOL. Street Index 2. ${DEALER} Options: Full Communications Suite 5,000¥ (2 CF), Wet Bar 1,000¥ (2), Lavatory 10,000¥ (4), Kitchenette 8,000¥ (4), Entertainment System 5,000¥ (2), Rigger Control System 10,000¥ (6).`),
  vehicle("Ares TR-55C Cargoliner VTOL", 88, { vehicleType: "vectored_thrust", handling: 5, speed: 170, body: 4, armor: 9, signature: 3, pilot: 3,
    seating: "Twin bucket seats + 12 folding bench", cargo: 60, cost: 550000, availability: "55/55 days" },
    `Armored, extra-rugged TR-55 for paramilitary and military forces, search and rescue (it hovers stably) and hard-to-reach cargo; a ventral hatch and a winch lifting up to one metric ton. Speed 170/350 (cruise/maximum; the sheet holds the cruise figure). Acceleration is not printed. Access 1 + 1 standard. Economy 1.0 km per liter (VTOL: 0.5 km/liter). Fuel IC/1,600 liters. Storage 10 CF storage + 50 CF cargo (75 CF if the seats are folded/removed). Landing/Takeoff VTOL/STOL. Street Index 2. ${DEALER} Options: Rigger Control System 12,000¥ (6 CF), Rear Access Ramp 25,000¥ (15 CF; access up to 4, capacity drops to 8 CF storage + 35 CF cargo).`),
  vehicle("Ares Sentinel Drone", 89, { vehicleType: "drone", handling: 5, speed: 0, body: 4, armor: 12, signature: 8, pilot: 3, sensor: 5,
    seating: "0", cargo: 0, cost: 40000, availability: "GM's discretion" },
    `Immobile zone-control drone ("drone" in name only — a gun emplacement run through a drone interface). Speed N/A; Store N/A; Economy N/A. Power 2 PF. Operational duration: building supplied/unlimited; backup battery 2 hours. Setup/breakdown N/A. Sensor package Security II (5). Integrated thermographic and pulse-radar security sensors; compatible with Ares Security International's Fiber-Optic Observation Network, with one optical port; remote control standard, direct neural control optional; accepts closed-circuit simsense (CCSS) protocols. Indoor model (ceiling-mounted): badge proximity interrogation system (CSH p.30), Neuro-Stun VII gas delivery, and a firmpoint for any Ares Sentinel weapons pod; 6 points of recoil compensation. Fully weatherproofed outdoor model (platform or pole): +10,000¥, normally without the gas system. Not generally available on the street.`),
  vehicle("Ares Sentinel \"P\" Series Drone", 90, { vehicleType: "drone", handling: 5, speed: 10, body: 4, armor: 12, signature: 6, pilot: 3, sensor: 4,
    seating: "0", cargo: 0, cost: 60000, availability: "GM's discretion" },
    `Semi-mobile Sentinel that runs a fixed patrol circuit on a monorail-style track (EMMA™ electromagnetic movement and articulation), drawing power from the track; on power failure, safety clamps grip the track and it switches to its internal battery. Economy N/A; Power 2 PF; Store N/A. Operational duration: building supplied/unlimited; backup battery 2 hours. Setup/breakdown N/A. Sensor package Security I (4). Indoor model: badge proximity interrogation system (CSH p.30) and a firmpoint for any Ares Sentinel weapons pod; 4 points of recoil compensation. Weatherproofed outdoor model +10,000¥. Track 100¥ per metre (10 cm wide; walls, ceilings, fence tops; connects to building power). Not normally available on the street.`),
  vehicle("Ares Guardian Drone", 91, { vehicleType: "vectored_thrust", handling: 4, speed: 30, body: 4, armor: 12, signature: 6, pilot: 3, sensor: 4,
    seating: "0", cargo: 20, cost: 75000, availability: "8/8 days" },
    `Free-ranging vectored-thrust Sentinel, small enough for indoors and sturdy enough for outdoors. Handling 4/6 (the sheet holds the first figure; the second is printed as given). Speed 30/60 (cruise/maximum). Store 20 CF. Economy 5 km per PF; Power 30 PF. Operational duration: battery, 2 hours. Setup/breakdown 3 minutes. Sensor package Security I (4). Street Index 2. Its micro-turret accepts any Ares Sentinel weapons pod, with rear attachments for external tanks and compressed air for the Ares Cascade™ delivery system (built-in storage for two 100-shot canisters, DMSO gel and the chemical reserve). An additional 3 CF is available for vehicle control gear or other electronic options.`)
];

/** Check a built actor carries every printed value it was given. */
function assertMapped(c, d) {
  const s = d.system, bio = s.biography, want = { ...c.attrs, ...(c.boosted ?? {}) };
  const fail = (m) => { throw new Error(`${c.name}: ${m}`); };
  for (const k of ["body", "quickness", "strength", "charisma", "intelligence", "willpower"]) if (s[k].value !== want[k]) fail(`${k}`);
  if (s.essence.value !== c.attrs.essence) fail("essence");
  if (Math.floor((want.quickness + want.intelligence) / 2) + s.reaction.mod !== want.reaction) fail("reaction");
  if (s.initiative.dice !== (c.dice ?? 1)) fail("initiative dice");
  if (c.magic && s.magic?.value !== c.magic) fail("magic");
  if (c.bodyIndex && s.bodyIndex?.value !== c.bodyIndex) fail("bodyIndex");
  const named = new Set(d.items.map(i => i.name));
  for (const n of [...Object.keys(c.skills ?? {}), ...Object.keys(c.special ?? {})]) if (!named.has(n)) fail(`skill ${n}`);
  for (const n of Object.keys(c.spells ?? {})) if (!named.has(n) && !bio.includes(n)) fail(`spell ${n}`);
  for (const k of ["conditional", "skillsBoosted", "note", "pools", "gear"]) if (c[k] && !bio.includes(esc(c[k]))) fail(k);
  for (const k of ["powers", "cyber", "bioware"]) for (const x of c[k] ?? []) if (!bio.includes(esc(x))) fail(`${k}: ${x}`);
  return d;
}

writePack("csh-contacts", DATA.contacts.map(c => assertMapped(c, contactActor(c, false))), "actors");
writePack("csh-archetypes", DATA.archetypes.map(c => assertMapped(c, contactActor(c, true))), "actors");
writePack("csh-vehicles", VEHICLES, "actors");
