// Inject Corporate Security Handbook (FASA 7118) content into the SR2E system.
//
// The Goose totem is system config, not a droppable item, so it extends
// CONFIG.SR2E.totems at setup in the same shape the core totems use, after the
// system has defined the table (Grimoire's register script does the same).
// Corporate Security Handbook p.104.

const CSH_TOTEMS = {
  // Goose: +2 dice detection spells, +1 die combat spells. As a wilderness totem,
  // +2 conjuring wind spirits; as an urban totem, +2 conjuring field spirits. The
  // totem shape has one environment and one conjuring table, so both domains are
  // listed; the shaman uses the one that fits where they work. Disadvantage: easily
  // startled and honks loudly when surprised — +1 penalty on all Surprise Tests
  // (roleplay/GM, as for the core totems). Favoured: open fields / parks.
  goose: { label: "Goose", environment: "any",
    spellBonus: { detection: 2, combat: 1 }, spellPenalty: {},
    conjuringBonus: { wind: 2, field: 2 } }
};

Hooks.once("setup", () => {
  const totems = CONFIG.SR2E?.totems;
  if (!totems) { console.warn("sr2e-corporate-security | CONFIG.SR2E.totems missing — is the sr2e system active?"); return; }
  const shape = ["label", "environment", "spellBonus", "spellPenalty", "conjuringBonus"];
  for (const [key, t] of Object.entries(CSH_TOTEMS)) {
    if (!shape.every(k => k in t)) { console.error(`sr2e-corporate-security | totem ${key} is missing a field`); continue; }
    if (!totems[key]) totems[key] = t;
  }
});
