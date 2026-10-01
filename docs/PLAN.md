# Plan: sr2e-corporate-security content module
_Round 3 — revised after Codex rounds 1–3_

## Goal
A new, optional Foundry V13 content module, `sr2e-corporate-security`, that packages
the Corporate Security Handbook (FASA 7118) for the sr2e system. A GM decides per
world whether to use it. It ships the book's game content as compendia: the
catalog's gear, weapons, drugs and vehicles, the security contacts and archetypes,
the Goose totem and the new adept powers, and GM reference journals. Its astral
mechanics (astral walls, projection forms, fat-bacteria zones) already live in the
system (unreleased; ships as sr2e 0.102.0, docs/PLAN-astral-barriers.md); the
module supplies the content those mechanics act on.

**Release order:** sr2e 0.102.0 first (astral + contact portraits, already on
main), then this module at 0.1.0 with `minimum: 0.102.0`.

## Source facts (verified from renders)
- The PDF is image-only (no text layer): every value is read from rendered pages.
- **Page offset varies.** Colour plates are counted in the folio: the catalog runs
  book p.67-73 then p.81-89 (p.74-80 are full-page plates). Cite BOOK pages.
- **Catalog (Ares Fall 2055, p.67-89).** The stat-bearing entries are:
  - SuperSquirt II (p.67), Cascade rifle (p.68), ELD-AR assault rifle (p.69),
    FAB-NG netgun, standard and large, plus extra nets (p.70);
  - Individualized Biometric Safety, plus its cyber modification (p.71);
  - portable security lighting: low-wattage, active IR and UV, each as a
    flashlight, a top/underbarrel mount or a floodlight (9 entries, p.72);
  - maglocks Type I-IV and biometric (p.73);
  - gamma-scopolamine (p.81);
  - FAB-1 canisters and coolant/feeding vats (p.82), FAB-UV aerosols and
    freezers (p.83);
  - the Bacterial Containment Grid components: release control, conduits and a
    portable dispenser (p.84);
  - TR-55T Traveler, TR-55E Executive and TR-55C Cargoliner VTOLs, with options
    (p.86-88);
  - the Ares Sentinel drone (p.89).
- **GM Information (p.90-105):**
  - security levels and Overall Security Level;
  - device ratings and maglock rules (p.100);
  - fiber-optic image links: spells through cameras at +1 TN per 500 m, drain +2
    per 500 m, max 2,500 m, no conjuring (p.102);
  - fat bacteria, FAB-UV and the netgun (p.103-104);
  - the Astral Patrol Modifier table (p.103);
  - the Goose totem and two adept powers (Extended Missile Parry, Enhanced
    Perception).
- **Security Personnel (p.106-121):** 18 contacts, each with a portrait illustration.
- **Archetypes (p.121-124):** Freelance Executive Protection Specialist (troll),
  Freelance Magical Security Consultant, Freelance Security Rigger, and Security
  System Design Engineer (dwarf).
- **Overlap to avoid:** the core system already ships a generic Maglock and Maglock
  Passkey; Shadowtech ships the Ares Squirt and DMSO. This module adds only what the
  book adds, and its SuperSquirt II / Cascade notes point at the Shadowtech DMSO
  rules rather than duplicating them.

## Approach

### 1. Repo scaffold (mirrors sr2e-shadowtech / sr2e-street-samurai-catalog)
- Repository `sr2e-corporate-security` (GitHub, SSH remote), with module.json
  depending on sr2e ≥ 0.102.0 (the astral release), Foundry 13.
- Copied tooling: build-packs and extract-packs from **sr2e-queen-euphoria**, which
  split and re-nest JournalEntry pages as well as actor items and effects (the
  Shadowtech copies don't). validate-packs is rewritten to read each pack's
  document type from module.json and check per type (Item: type+system; Actor:
  type+system+items; JournalEntry: pages). set-art, art-todo and the eslint config
  are copied. Grep the copies for leftover module names and fail if any remain.
- CI: lint + validate on push; tag-driven release packaging with the established
  excludes (`_work`, `.DS_Store`, docs/dev files).
- Docs: CLAUDE.md, QA-PLAN.md, CHANGELOG.md, README.

### 2. Compendia (generated from per-type generator scripts, ids sha1-stable)
| Pack | Type | Content |
|---|---|---|
| `csh-weapons` | Item | SuperSquirt II, Cascade, ELD-AR, FAB-NG standard and large |
| `csh-ammo` | Item | FAB-NG nets (standard, large); ELD-AR paint rounds and gelcoat kit; DMSO reservoir clips |
| `csh-gear` | Item | IBS (gear) and its cyber modification (a `cyberware` item: Essence and cost as printed), 9 lighting items, maglocks I-IV and biometric, FAB-1/FAB-UV products, BCG components, gamma-scopolamine |
| `csh-vehicles` | Actor (vehicle) | TR-55T, TR-55E, TR-55C, Sentinel (indoor; the outdoor model as a note) |
| `csh-vehicle-mods` | Item (vehicle_mod) | the TR-55 options that no existing pack covers (wet bar/steward area, lavatory, kitchenette, entertainment system, rear access ramp). The Rigger Control System and Full Communications Suite are compared with Rigger 2's entries during generation; where Rigger 2 has the same item, the vehicle's notes point to it rather than duplicate it (Rigger 2 stays an optional dependency, so the notes carry the CF and cost too). |
| `csh-contacts` | Actor (npc) | the 18 security personnel |
| `csh-archetypes` | Actor (character) | the 4 archetypes |
| `csh-adept-powers` | Item (adept_power) | Extended Missile Parry, Enhanced Perception |
| `csh-journals` | JournalEntry | GM reference (below) |

Folder: "Corporate Security Handbook" in the compendium sidebar.

### 3. Specific modelling decisions
- **Gamma-scopolamine** uses the system's drug model (flags.sr2e.drug, as
  Shadowtech's gen-drugs does): 10D Stun, immediate, injected. The drug engine
  applies EVERY item effect at dosing (it ignores `disabled`, drugs.mjs:757) and
  can't schedule a later phase. So the item carries no aftermath effect. The
  hour-long "truth serum" aftermath (Willpower −2, minimum 1) is a manual step the
  GM journal and the item notes describe: when the paralysis hour ends, the GM
  adds a Willpower −2 effect to the actor and removes it after an hour. The
  paralysis-by-stun-level and dose scaling (Availability and time +1 per 3 doses)
  are in notes. No system change.
- **Maglocks** are gear with `rating`; cost is per rating (75/100/150/250 × rating,
  350 × rating biometric), so the item models cost per rating like the core rated
  gear does. Biometric +2 to bypass is in the notes.
- **FAB products**: gear with notes linking to the system's fat-bacteria zone (how
  to draw one). No new mechanic.
- **VTOLs and drones**: vehicle actors in the Rigger 2 module's shape, mapped to
  `VehicleData` exactly: Handling → `handling`; cruise speed → `speed` (one
  integer; the max speed goes into notes); B/A → `body`/`armor`; Sig →
  `signature`; APilot → `pilot`; seating → `seating`; storage and cargo →
  `cargo`; load → `load`; availability → `availability`. Each option's printed
  flat CF goes straight into the vehicle_mod's authored `system.cfConsumed`.
  Economy, fuel, access, landing profile and the Dealer availability note go into
  notes, because VehicleData has no field for them. The generator asserts every
  printed number lands in a field or in notes. The Sentinel (immobile, speed
  N/A) is speed 0; check the vehicle sheet renders speed 0 in Foundry.
- **The Goose totem**: registered into `CONFIG.SR2E.totems` by a module esmodule in
  `Hooks.once("setup")` with Grimoire's shape check (label, environment,
  spellBonus/Penalty, conjuringBonus, read from the render).
- **Adept powers**: adept_power items with the printed Power Point cost and level
  structure.
- **Contacts and archetypes**: stat blocks as printed (SR2), with **separate
  mappings**: npcs follow the core contact generator (`gen-core-contacts.mjs`),
  whose base/`mod` scheme lands derived values (Reaction, augmented attributes) on
  the printed numbers; archetype characters follow the core sample runners'
  shape, with cyberware as real items so augmentation derives. A Quench check
  compares every prepared attribute, Reaction and initiative dice with the
  printed block. Portraits are made
  the same way as the core contact portraits: book illustration crops as Codex
  imagegen references, a per-contact setting, 1024 px webp, sheet + token.
  Generators pick portraits up by file, so re-running never un-wires them.

### 4. The FAB-NG netgun: content now, automation in a follow-up system plan
Rules (p.103): a hit forces an Astral Reaction test against TN 5 (standard net) or
8 (large); a standard net fired at a large target lowers it to 3. A victim escapes
with more than twice the attacker's successes, −1 die per turn entangled; if
twice the attacker's successes exceeds all the dice the victim could roll, no
escape is possible.

Codex round 1 showed that automating this properly touches a lot of the system:
- the attack card would have to record the target TOKEN (an astral form shares
  its actor with the body);
- netguns would have to branch off the damage path;
- the GM or target owner has authority over statuses;
- Karma rerolls would have to be reconciled, and clicks made idempotent;
- immobilization can't depend on the optional movement limiter;
- the entanglement lifecycle needs designing.

That is its own system feature. So:
- **In this module:** the two netguns and their nets ship as data. Their notes
  and the GM journal give the procedure as printed (p.103):
  1. Fire normally and keep the attack successes. **Ignore the damage card the
     system posts** (damage is "Special"; a net does no damage).
  2. The victim makes an Astral Reaction test: TN 5 (standard net) or 8 (large);
     a standard net against a large target is TN 3. The GM decides "large".
  3. A failure means entangled. The victim is immobile and can take no action.
  4. Escape: once per Combat Turn, roll Astral Reaction dice plus available
     Astral Pool dice, at −1 per turn already entangled, and get MORE than twice
     the attacker's successes. If twice the attacker's successes EXCEEDS the
     victim's total dice, no escape is possible. When they're exactly equal,
     escape is allowed by the text but needs every die to succeed and then one
     more, so it's impossible in practice; the journal says so explicitly.
  - **Marker:** Foundry's "Restrained" status is a VISUAL REMINDER only. Statuses
    sit on the actor, so a linked body and its astral form both show it, and it
    doesn't stop movement. The GM notes which token is netted, stops it moving
    by hand, and removes the status on escape or when projection ends.
- **Follow-up:** `docs/PLAN-astral-netgun.md` in the system, planned and reviewed on
  its own. It covers token-scoped targets, a dedicated non-damage card,
  authority, Karma reconciliation and the lifecycle. The module's netguns then
  gain the weapon flag in a later version.

### 5. GM journals (original paraphrase, page-cited, no verbatim text)
- Security levels and the Overall Security Level, the device rating tables and
  maglock bypass.
- Fiber-optic spellcasting.
- The Astral Patrol Modifier table.
- Using fat bacteria in Foundry: drawing zones and barrier walls, FAB-UV searches,
  linking to the system's tools.
- Skipped hardware (control centers, CCSS, decryption and emulation modules, drone
  storage, weapons pods): covered as reference text, not items.

### 6. Art
Item icons and vehicle portraits through the same Codex imagegen workflow as the
other modules (art-todo → prompts → set-art), 512 px item icons and 1024 px
actor portraits. Contacts and archetypes are based on the book's own illustrations.
Generate in batches; review with the user before wiring.

### 7. Tests and release
- `npm run validate` (structure per document type) and lint, in CI.
- A generator self-check: every printed stat row maps to a field or note.
- Quench, run from the system's test world with the module enabled:
  - actor stat fidelity (the prepared values equal the printed blocks);
  - the Goose totem is registered;
  - dosing gamma-scopolamine causes no immediate Willpower change, and adding and
    removing the manual aftermath effect restores the original value;
  - journal import works;
  - the vehicle sheets render.
- **Release order:** sr2e 0.102.0 (with its Unreleased astral and portrait work),
  then module 0.1.0 with `minimum: 0.102.0`.

## Key decisions & tradeoffs
- **The netgun ships manual first.** Automation is a separate, reviewed system
  feature, and it applies only to the FAB netgun: SSC's net guns are physical
  weapons, not astral ones.
- **Gamma-scopolamine and FAB stay data-only** where the system already has the
  model (drugs, FAB zones).
- **Archetypes are characters, contacts are npcs,** as in the core packs.
- **Facility hardware is not items,** per the user's call: journal reference only.

## Risks / open questions
- **Transcribed from p.104:**
  - **Goose:** +2 dice detection spells, +1 die combat spells; wilderness: +2
    conjuring wind spirits; urban: +2 conjuring field spirits; +1 penalty on all
    Surprise Tests. Environment open fields / parks.
  - **Extended Missile Parry:** 1.5 points; extends Missile Parry (Grimoire II
    p.34) to someone the adept is protecting, up to 3 m away.
  - **Enhanced Perception:** extra dice for Perception Tests: .25 per +1 up to ½
    racial-maximum Intelligence, .5 per +1 up to the racial maximum, 1 per +1 up to
    1.5 × the racial maximum. `AdeptPowerData` prices only `pointCost × level`, so
    it ships as THREE tier items: "Enhanced Perception (to ½ racial max Int)" at .25
    per level, "(to racial max)" at .5, "(to 1.5 × racial max)" at 1. Each tier's
    notes say how many levels it may hold for the character's metatype; the
    racial limit is checked by hand.
  - The Goose's two environments map to the system's totem shape: environment
    "any", with the conjuring bonus noted, since a totem has one environment key.
- The vehicle actor schema for VTOLs (Handling 5, Speed 170/350, Sig, APilot,
  seating, storage, economy, VTOL landing) has to fit the Rigger-2 vehicle model.
  Unrepresentable fields go into notes.
- The Sentinel is immobile ("drone" in name only). As a vehicle actor with Speed
  N/A, it's a turret; check that the vehicle sheet tolerates Speed 0.
- **Dependencies:** Shadowtech (DMSO) and Rigger 2 stay optional. Every note that
  points at them also carries the needed numbers, so the module reads standalone.
- The image-generation quota: 18+4 portraits plus ~30 icons plus 4 vehicle images,
  done in batches across quota windows.

## Out of scope
The fiction (history, The Curtain), Matrix security systems beyond reference text,
and facility-level automation (security level calculators).
