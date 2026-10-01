# QA plan — sr2e-corporate-security

## Automated
- `npm run lint` and `npm run validate` (CI, on every push).

## In Foundry (module enabled, sr2e ≥ 0.102.0)
- [ ] The "Corporate Security Handbook" compendium folder shows 9 packs; every
      document opens without errors (92 documents).
- [ ] **Stat fidelity:** each Security Personnel and Archetype actor's prepared
      attributes, Reaction, Initiative dice, Essence and Magic equal the printed
      block (p.106–124).
- [ ] **Goose totem:** shows in a shaman's totem list, with +2 detection / +1
      combat spell dice.
- [ ] **Gamma-scopolamine:** dosing an actor posts the 10D Stun resistance and does
      NOT change Willpower. Adding the journal's Willpower −2 effect by hand and
      deleting it restores the value.
- [ ] **FAB gear:** following a FAB-1 canister's notes (a Fat bacteria zone region,
      walls set to "Fat bacteria") holds an astral form to normal speed and blocks
      it at the walls.
- [ ] **FAB-NG netgun:** an attack posts the usual cards; following the journal
      procedure by hand works.
- [ ] **Vehicles:** all six vehicle sheets render, including the Sentinel at speed 0.
