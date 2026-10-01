// Generate the Corporate Security Handbook items (FASA 7118) into packs-src.
// Every number was read from the RENDERED catalog pages (the PDF is image-only):
// the Ares Fall 2055 catalog, book p.67–73 and p.81–89 (p.74–80 are colour
// plates), and GM Information p.103–104. Cite BOOK pages.
//
// An existing file's `img` is KEPT, so re-running never un-wires art.
// Re-run, then `npm run build-packs`.
import { idFor, STATS, writePack } from "./lib.mjs";

const base = (pack, name, type, img, system, extra = {}) => ({
  _id: idFor(pack, name), name, type, img, system, effects: [], flags: {}, folder: null, sort: 0,
  _stats: STATS, ownership: { default: 0 }, ...extra
});

// SR2E range bands (core p.94).
const RANGE = {
  lightPistol: { short: 5, medium: 15, long: 30, extreme: 50 },
  smg: { short: 10, medium: 40, long: 80, extreme: 150 },
  assault: { short: 25, medium: 100, long: 250, extreme: 500 }
};
const NOT_PRINTED = "Legality is not printed in the catalog.";

/* ── Weapons (p.67–70) ─────────────────────────────────────────────────────── */
const weapon = (name, s) => base("csh-weapons", name, "weapon", "icons/svg/sword.svg", {
  weaponType: "firearm", skill: "firearms", damageType: "physical", reach: 0, recoilComp: 0,
  smartgunCompatible: false, strengthMin: 0, legality: "", equipped: false, accessories: [], ...s
});
const WEAPONS = [
  weapon("Ares SuperSquirt II", {
    damageCode: "Special", concealability: 7, firingModes: { ss: false, sa: true, bf: false, fa: false },
    ammo: { current: 20, max: 20, type: "cartridge" }, ranges: RANGE.lightPistol, weight: 2, cost: 800,
    availability: "9/14 days", streetIndex: 1.5,
    notes: `Light pistol. The improved Ares Squirt: the DMSO gel reservoir is now a removable clip, beside a second, parallel clip holding the chemical, and it carries twice the original's shots (20). Silent and recoilless compressed air; a hit delivers the compound through the skin, so damage is the compound's. Extra reservoir clips 10¥; the grip's CO₂ canister recharges for 50¥. May be drone-mounted; accepts no top-, barrel- or underbarrel accessories. DMSO lets a compound act on contact (Shadowtech p.89). ${NOT_PRINTED} Corporate Security Handbook p.67.`
  }),
  weapon("Ares Cascade Rifle", {
    damageCode: "Special", concealability: 4, firingModes: { ss: false, sa: true, bf: false, fa: false },
    ammo: { current: 60, max: 60, type: "cartridge" }, ranges: RANGE.smg, weight: 5.5, cost: 1800,
    availability: "12/14 days", streetIndex: 2,
    notes: `Chemical-delivery rifle with a selectable nozzle. STREAM mode: SMG ranges (as set here). SPRAY mode: treat as a shotgun with a fixed choke of 2 (SR2 p.95 spread patterns), with Power reduction applied to the chemical. Ammo 60 as printed in the stat line; the footnote says the DMSO gel reservoir "is good for 100 shots" — the book disagrees with itself, the stat line is used. A second clip holds the chemical; extra reservoir clips 20¥; the stock's CO₂ canister recharges for 50¥. May be drone-mounted; accepts top- and underbarrel accessories, not barrel. ${NOT_PRINTED} Corporate Security Handbook p.68.`
  }),
  weapon("Ares ELD-AR Assault Rifle", {
    damageCode: "4L", damageType: "stun", concealability: 4, firingModes: { ss: false, sa: true, bf: true, fa: false },
    ammo: { current: 50, max: 50, type: "regular" }, ranges: RANGE.assault, weight: 4.5, cost: 950,
    availability: "9/7 days", streetIndex: 2,
    notes: `Encapsulated Liquid Delivery assault rifle (50-round clip). Standard ammunition is gel-coated paint or marking rounds, damage 4L Stun (as set here); special rounds can carry other contents and do damage by their contents. Compressed-gas, negligible recoil: treat as having a sound suppressor. The stock's air canister refills for 50¥. May be drone-mounted; accepts top- and underbarrel accessories, not barrel. ${NOT_PRINTED} Corporate Security Handbook p.69.`
  }),
  ...[["Standard", 3, 4.5, 1500, 4, "human-sized or smaller targets"], ["Large", 2, 5, 2500, 5, "orks and trolls; fires both net sizes"]].map(([size, conceal, wt, cost, si, use]) =>
    weapon(`BacteriTech FAB-NG Netgun (${size})`, {
      damageCode: "Special", concealability: conceal, firingModes: { ss: false, sa: true, bf: false, fa: false },
      ammo: { current: 4, max: 4, type: "net" }, ranges: RANGE.lightPistol, weight: wt, cost, availability: "8/14 days", streetIndex: si,
      notes: `<p>A Williams Technologies netgun modified by BacteriTech to catch ASTRAL targets: its net of hollow polymer tubes is filled with FAB-1 fat bacteria. For ${use}. The first trigger primes a net (forcing FAB-1 in from the holding vat); a primed net stays active 6–8 hours; each net fires once. Needs a self-contained feeding canister (1,000¥ per 4 standard nets, 1,500¥ per 4 large). Ranges are not printed: the light-pistol bands of the base Williams netgun are used. May be drone-mounted; top- and underbarrel accessories only. ${NOT_PRINTED} Corporate Security Handbook p.70.</p>
<p><strong>Resolving a hit (by hand, p.103).</strong> Keep the attack's successes and <em>ignore the damage card</em> — a net does no damage.</p>
<ol><li>The victim makes an <strong>Astral Reaction Test</strong> against TN 5 (standard net) or 8 (large net); a standard net used against a large target drops to TN 3.</li>
<li>If it fails, the victim is entangled: immobile and unable to take any action.</li>
<li>To escape it rolls once per Combat Turn — Astral Reaction dice plus all its available Astral Pool dice, −1 for every turn already entangled — and must get <strong>more than twice</strong> the attacker's successes.</li>
<li>If twice the attacker's successes <strong>exceeds</strong> the victim's total dice, no escape is possible (and if they're equal, escape needs every die plus one more — impossible in practice).</li></ol>
<p>Foundry's "Restrained" status works as a reminder, but it sits on the actor (a body and its astral form both show it) and doesn't stop movement: note which token is netted and hold it still by hand.</p>`
    }))
];

/* ── Ammunition (p.67–70) ──────────────────────────────────────────────────── */
const ammo = (name, s) => base("csh-ammo", name, "ammo", "icons/svg/target.svg", {
  quantity: 1, damageModifier: 0, armorModifier: 0, damageType: "", armorCalc: "standard", ...s
});
const AMMO = [
  ammo("FAB-NG Net (Standard)", { ammoType: "net", cost: 300, streetIndex: 4,
    notes: "One additional FAB-1 net shot for the FAB-NG netgun. Concealability 7, Weight 0.5, Availability 8/14 days. Resolve hits by the netgun's procedure (TN 5; 3 against a large target). Corporate Security Handbook p.70." }),
  ammo("FAB-NG Net (Large)", { ammoType: "net", cost: 500, streetIndex: 5,
    notes: "One additional large FAB-1 net shot; only the large FAB-NG fires it. Concealability 5, Weight 0.75, Availability 8/14 days. Astral Reaction TN 8 to avoid. Corporate Security Handbook p.70." }),
  ammo("FAB-NG Feeding Canister (4 Standard Nets)", { ammoType: "net", cost: 1000, streetIndex: 4,
    notes: "The self-contained FAB-1 feeding canister the netgun needs: enough for 4 standard nets. Corporate Security Handbook p.70." }),
  ammo("FAB-NG Feeding Canister (4 Large Nets)", { ammoType: "net", cost: 1500, streetIndex: 5,
    notes: "The self-contained FAB-1 feeding canister for 4 large nets. Corporate Security Handbook p.70." }),
  ammo("ELD-AR Paint Rounds (10)", { ammoType: "regular", quantity: 10, cost: 5, damageType: "stun", streetIndex: 2,
    notes: "Gel-coated rounds filled with biodegradable paint or another marking agent, 5¥ per package of 10. Damage 4L Stun. Corporate Security Handbook p.69." }),
  ammo("ELD-AR Gelcoat Filling Kit", { ammoType: "regular", cost: 300, streetIndex: 2,
    notes: "Kit for making ELD-AR gelcoat rounds with special fillings, 300¥. Such rounds may cause damage based on their contents (the GM's call by filling). Corporate Security Handbook p.69." }),
  ammo("SuperSquirt II Reservoir Clip", { ammoType: "cartridge", cost: 10, streetIndex: 1.5,
    notes: "Extra DMSO gel reservoir clip for the Ares SuperSquirt II (20 shots), 10¥. Corporate Security Handbook p.67." }),
  ammo("Cascade Reservoir Clip", { ammoType: "cartridge", cost: 20, streetIndex: 2,
    notes: "Extra DMSO gel reservoir clip for the Ares Cascade, 20¥. Corporate Security Handbook p.68." })
];

/* ── Gear (p.71–73, 81–84) ─────────────────────────────────────────────────── */
const gear = (name, s) => base("csh-gear", name, "gear", "icons/svg/item-bag.svg", {
  category: "security", rating: 0, quantity: 1, weight: 0, legality: "", equipped: false, concealability: 0,
  weaponAccessory: false, linkedWeaponId: "", combatTnMod: 0, accessoryRecoilComp: 0, requiresSmartgun: false, ...s
});

const LIGHTS = [];
for (const [, label, rows, note] of [
  ["low", "Low-Wattage", [["Always", 10, 1], ["2/24 hrs", 100, 1], ["Always", 150, 1]],
    "Lets low-light vision (natural or enhanced) see clearly to 20 m (flashlight, barrel mount) or 100 m (floodlight); to normal vision it's only faint indirect light."],
  ["ir", "Active Infrared", [["4/48 hrs", 100, 2], ["6/48 hrs", 250, 2], ["5/48 hrs", 350, 2]],
    "Lets thermographic vision (natural or enhanced) see clearly to 20 m (flashlight, barrel mount) or 100 m (floodlight); no effect on normal vision."],
  ["uv", "Ultraviolet", [["4/4 days", 200, 2], ["6/4 days", 500, 2], ["8/4 days", 750, 2]],
    "Used with FAB-UV: range 5 m (flashlight, barrel mount) or 35 m (floodlight). In Foundry, switch on the fat-bacteria zone's \"UV lights on\" while it's lit, so the GM can search it (CSH p.103). No effect on normal vision."]
]) {
  ["Flashlight", "Top/Underbarrel Mount", "Portable Floodlight"].forEach((form, i) => {
    const [avail, cost, si] = rows[i];
    LIGHTS.push(gear(`${label} ${form}`, { cost, availability: avail, streetIndex: si, weaponAccessory: i === 1,
      notes: `Ares portable security lighting, long-life lithium batteries. ${note} ${NOT_PRINTED} Corporate Security Handbook p.72.` }));
  });
}

const MAGLOCKS = [
  ["Type I", "1–3", 1, 75, "Rating/2 days", 0.75, "Better than the strongest padlock at close to a padlock's price."],
  ["Type II", "4–6", 4, 100, "Rating/3 days", 1, "Tougher; for a corporation's common areas."],
  ["Type III", "7–9", 7, 150, "Rating/3.5 days", 1.25, "For higher-security areas or those covered by closed-circuit simsense."],
  ["Type IV", "10", 10, 250, "Rating/4 days", 1.5, "Top-level security."]
].map(([t, range, r, per, avail, si, desc]) => gear(`Ares Maglock (${t})`, {
  rating: r, costPerRating: per, cost: per * r, availability: avail, streetIndex: si,
  notes: `Rating ${range}; ${per}¥ × Rating. ${desc} Above Type I they carry a lithium backup battery good for a year (Type I: five years). A PANICBUTTON™ hookup is available for all but Type I. Bypass rules: core SR2 and CSH p.100. ${NOT_PRINTED} Corporate Security Handbook p.73.`
}));
MAGLOCKS.push(gear("Ares Biometric Maglock", { rating: 7, costPerRating: 350, cost: 2450, availability: "Rating/5 days", streetIndex: 2,
  notes: `Comes in Type III or Type IV configurations (Rating 7–10); 350¥ × Rating. Add 2 to its effective rating against any attempt to bypass it (CSH p.100). ${NOT_PRINTED} Corporate Security Handbook p.73.` }));

const FAB = [];
for (const [vol, can, vat] of [["50 m³", 3000, 2500], ["500 m³", 25000, 20000], ["5,000 m³", 200000, 175000]]) {
  FAB.push(gear(`FAB-1 Canister (${vol})`, { category: "general", cost: can, availability: "GM's discretion", streetIndex: 0,
    notes: `<p>Fat bacteria, strain 1 (BacteriTech™): ${vol} of genetically engineered, massive bacteria. Pumped into an enclosed space until the air is a "soup", it stops astral movement as an ivy-covered wall does. Shipped in coolant/feeding vats; once out of the vat FAB-1 begins to die and can't be reused. Not generally available on the street (Availability at the GM's discretion; no Street Index printed).</p><p><strong>In Foundry:</strong> draw a Region over the flooded space and add the system's <em>Fat bacteria zone</em> behaviour (FAB-1): astral forms inside are held to normal astral speed and astral perception there is +4 (CSH p.103). For FAB-filled walls, set the walls' Astral barrier to "Fat bacteria".</p><p>Corporate Security Handbook p.82.</p>` }));
  FAB.push(gear(`FAB-1 Coolant/Feeding Vat (${vol})`, { category: "general", cost: vat, availability: "GM's discretion", streetIndex: 0,
    notes: `The pressurized coolant/feeding vat a ${vol} FAB-1 canister ships and is stored in. Not generally available on the street. Corporate Security Handbook p.82.` }));
}
for (const [vol, aero, frz] of [["50 m³", 5000, 10000], ["500 m³", 45000, 50000]]) {
  FAB.push(gear(`FAB-UV Aerosol (${vol})`, { category: "general", cost: aero, availability: "GM's discretion", streetIndex: 0,
    notes: `<p>BacteriTech™ FAB-Ultraviolet: glows under ultraviolet light. Lightly flood an area you suspect an astral intruder has entered, then light it with UV: the intruder displaces the glowing bacteria and casts a revealing "shadow". It lives three to four hours once released. Shipped frozen; once out of the freezer it begins to die and can't be reused. The 5,000 m³ canister can take underbarrel mounts for the FAB-Netgun.</p><p><strong>In Foundry:</strong> add a <em>Fat bacteria zone</em> behaviour with strain FAB-UV; when the UV lights are on, the GM runs the search from the behaviour's settings (Perception TN 6, +1 per 50 m², −1 per two searchers; CSH p.103).</p><p>Corporate Security Handbook p.83.</p>` }));
  FAB.push(gear(`FAB-UV Freezer (${vol})`, { category: "general", cost: frz, availability: "GM's discretion", streetIndex: 0,
    notes: `Sub-zero freezer storage for ${vol} of FAB-UV aerosol until needed. Corporate Security Handbook p.83.` }));
}
const BCG = [
  ["CerebroTech Computerized Release Control", 5000, "The control unit of a Bacterial Containment Grid. When an astral intruder is detected inside the protected area, the on-site security magician activates it and it releases FAB-1 into the double-layered exterior walls, doors and windows, trapping the intruder inside."],
  ["Pressurized Release Conduit", 5000, "One is required for each FAB-1 canister in a Bacterial Containment Grid."],
  ["Portable FAB Dispenser (50 m³)", 7000, "A portable unit dispensing 50 m³ of FAB-1."]
].map(([name, cost, desc]) => gear(name, { cost, availability: "GM's discretion", streetIndex: 0,
  notes: `<p>${desc} Ares Security International and BacteriTech™ design and build the grid; construction is by estimate. Not normally available on the street (Availability at the GM's discretion).</p><p><strong>In Foundry:</strong> set the protected area's walls, doors and windows to Astral barrier "Fat bacteria" and draw a Fat bacteria zone over it once the grid fires (CSH p.103).</p><p>Corporate Security Handbook p.84.</p>` }));

// Ares Sentinel weapons pods (p.92): modular weapon units for Sentinel and Guardian drones.
const PODS = [
  ["I", "Ares Squirt II (40 shots) and Defiance Super Shock (20)", "5/1 week", 3000],
  ["II", "Ares Viper Slivergun (75) and Narcoject Pistol (20)", "6/1 week", 3500],
  ["III", "HK227-S (150) and Narcoject Rifle (20)", "6/2 weeks", 5000],
  ["IV", "Ares MP-LMG (500) and Ares Cascade™ (twin compressed-gas canisters, up to 200 shots; recharge 100¥)", "8/2 weeks", 7500]
].map(([n, weapons, avail, cost]) => gear(`Ares Sentinel Weapons Pod ${n}`, { cost, availability: avail, streetIndex: 2, weaponAccessory: false,
  notes: `Modular weapon unit for Ares Sentinel and Guardian drones, which recalibrate their inertial compensators and targeting for each weapon automatically. Installed: ${weapons}.${n === "IV" ? " Guardian drones only." : ""} Removing and installing a pod are each a Complex Action (two to change one). Only Ares Sentinel and Guardian drones accept pods without major hardware and firmware work. Add the weapons themselves to the drone from the weapon compendia. ${NOT_PRINTED} Corporate Security Handbook p.92.` }));

const IBS = gear("Individualized Biometric Safety (IBS)", { cost: 2250, weight: 0.1, availability: "3/36 hrs", streetIndex: 1.5, weaponAccessory: true,
  notes: `A biometric palm reader fitted to a weapon's grip and linked to its internal safety: unless the scanned palm matches the owner's, the safety stays locked and the weapon is inert. Compatible with most smartlink/smartgun technology. To change owners, burn new firmware onto an optical chip (blank chips 50¥, programmed at a computer repair shop or facility). Owners with a cyberhand use the IBS cyber modification instead. ${NOT_PRINTED} Corporate Security Handbook p.71.` });

const GAMMA = base("csh-gear", "Gamma-Scopolamine", "gear", "icons/svg/pill.svg", {
  category: "drug", rating: 0, quantity: 1, streetIndex: 3, weight: 0, cost: 300, availability: "8/2 weeks", legality: "",
  equipped: false, concealability: 0, weaponAccessory: false, linkedWeaponId: "", combatTnMod: 0, accessoryRecoilComp: 0,
  requiresSmartgun: false,
  notes: `<p>Neuromuscular blocking agent derived from the nightshade toxin (C₁₇H₂₁NO₅); it blocks the uptake of acetylcholine. Rating 10D Stun, Speed Immediate, Vector Injected, 300¥/dose, Availability 8/2 weeks, Street Index 3. ${NOT_PRINTED}</p>
<p>It takes effect immediately: dizziness, dilated pupils, loss of speech, delirium and paralysis. A Deadly stun wound means full paralysis. For lesser damage, apply an additional +2 to all the modifiers for that stun wound (a Serious stun wound: +5 to all target numbers, −5 to Initiative). The full effects last one hour.</p>
<p><strong>After the hour</strong> the residue acts as a truth serum for an additional hour: Willpower −2 (to a minimum of 1). The system applies a drug's effects at dosing, so this is a manual step — when the paralysis hour ends, the GM adds a Willpower −2 effect to the actor and removes it an hour later.</p>
<p>For every 3 doses ordered, add 1 to the Availability and 1 day to its base time. Corporate Security Handbook p.81.</p>`
}, { flags: { sr2e: { drug: { key: "gamma-scopolamine", damage: { power: 10, level: "D", type: "stun" }, repeatMinutes: 0,
  duration: { minutes: 60 }, addiction: null, tolerance: 0, strength: 0,
  notes: "Paralysis by stun level: Deadly = full paralysis; otherwise +2 more to that wound's modifiers. The truth-serum hour after (Willpower −2, min 1) is added by the GM by hand (Corporate Security Handbook p.81).",
  absorb: 0, stimulant: false, overload: false, tn: null, activatesPump: false, noRepeat: false, limitsPump: false } } } });

const IBS_CYBER = base("csh-gear", "Individualized Biometric Safety (Cyber Modification)", "cyberware", "icons/svg/item-bag.svg", {
  location: "bodyware", grade: "standard", essenceCost: 0, rating: 1, cost: 800, availability: "3/36 hrs", streetIndex: "1.5",
  legality: "", installed: false, notes: `The IBS for owners with a cyberarm or cyberhand: mounted in the cyberhand, it holds a pass-chip that links to the weapon's IBS. No Essence cost is printed (it modifies an existing cyberhand). Corporate Security Handbook p.71.`
});

/* ── Adept powers (p.104) ──────────────────────────────────────────────────── */
const power = (name, s) => base("csh-adept-powers", name, "adept_power", "icons/svg/aura.svg", {
  level: 1, attributeMods: { body: 0, quickness: 0, strength: 0, reaction: 0 }, ...s
});
const POWERS = [
  power("Extended Missile Parry", { pointCost: 1.5, maxLevel: 1,
    description: "<p>Like Missile Parry (Grimoire II p.34), but the adept can extend it to an individual they are protecting, up to 3 meters away.</p>",
    notes: "Cost 1.5 points. For executive-protection adepts. Corporate Security Handbook p.104." }),
  ...[["½ racial maximum Intelligence", 0.25], ["the racial maximum Intelligence", 0.5], ["1.5 × racial maximum Intelligence", 1]].map(([cap, cost], i) =>
    power(`Enhanced Perception (Tier ${i + 1})`, { pointCost: cost, maxLevel: 9,
      description: `<p>Additional dice for Perception Tests: +1 per level. This tier covers a Perception bonus that keeps the adept's total at or below ${cap}, at ${cost} point per +1.</p>`,
      notes: `Enhanced Perception is priced in three bands (p.104): .25 per +1 up to ½ the racial maximum Intelligence, .5 per +1 up to the racial maximum, 1 per +1 up to 1.5 × the racial maximum. The system prices a power as cost × level, so each band is its own item — buy the levels that fall in each band; the racial limit is checked by hand. Corporate Security Handbook p.104.` }))
];

/* ── Vehicle options (p.86–88) ─────────────────────────────────────────────── */
const mod = (name, cost, cf, note) => base("csh-vehicle-mods", name, "vehicle_mod", "icons/svg/upgrade.svg", {
  modType: "general", rating: 0, cost, designPoints: 0, dpPerLevel: 0, dpTable: [], cfConsumed: cf, cfPerLevel: 0, cfTable: [],
  loadReduction: 0, loadPerLevel: 0, loadTable: [], installed: false, notes: note
});
const MODS = [
  mod("Wet Bar/Steward Area (TR-55T)", 2500, 5, "TR-55T Traveler option: 2,500¥, 5 CF. Corporate Security Handbook p.86."),
  mod("Rigger Control System (TR-55T)", 10000, 6, "TR-55T Traveler option: 10,000¥, 6 CF. (Rigger 2 also has rigger adaptation; this is the catalog's priced option.) Corporate Security Handbook p.86."),
  mod("Full Communications Suite (TR-55E)", 5000, 2, "TR-55E Executive option: 5,000¥, 2 CF. Corporate Security Handbook p.87."),
  mod("Wet Bar (TR-55E)", 1000, 2, "TR-55E Executive option: 1,000¥, 2 CF. Corporate Security Handbook p.87."),
  mod("Lavatory (TR-55E)", 10000, 4, "TR-55E Executive option: 10,000¥, 4 CF. Corporate Security Handbook p.87."),
  mod("Kitchenette (TR-55E)", 8000, 4, "TR-55E Executive option: 8,000¥, 4 CF. Corporate Security Handbook p.87."),
  mod("Entertainment System (TR-55E)", 5000, 2, "TR-55E Executive option: 5,000¥, 2 CF. Corporate Security Handbook p.87."),
  mod("Rigger Control System (TR-55E)", 10000, 6, "TR-55E Executive option: 10,000¥, 6 CF. Corporate Security Handbook p.87."),
  mod("Rigger Control System (TR-55C)", 12000, 6, "TR-55C Cargoliner option: 12,000¥, 6 CF. Corporate Security Handbook p.88."),
  mod("Rear Access Ramp (TR-55C)", 25000, 15, "TR-55C Cargoliner option: 25,000¥, 15 CF. Adds access (up to a total of 4) but reduces capacity to 8 CF storage + 35 CF cargo. Corporate Security Handbook p.88.")
];

writePack("csh-weapons", WEAPONS);
writePack("csh-ammo", AMMO);
writePack("csh-gear", [IBS, IBS_CYBER, ...LIGHTS, ...MAGLOCKS, GAMMA, ...FAB, ...BCG, ...PODS]);
writePack("csh-adept-powers", POWERS);
writePack("csh-vehicle-mods", MODS);
