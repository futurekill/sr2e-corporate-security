# Shadowrun 2E: Corporate Security Handbook

A Foundry VTT V13 module bringing *Corporate Security Handbook* (FASA 7118) to the [Shadowrun 2nd Edition system](https://github.com/futurekill/sr2e-foundryvtt) (`sr2e`). Security gear, fat bacteria and the BacteriTech netgun, Ares VTOLs and drones, security personnel and archetypes, the Goose totem, new adept powers, and GM reference journals.

## Contents

| Pack | Contents |
|---|---|
| CSH Weapons | 5 items |
| CSH Ammunition | 8 items |
| CSH Security Gear | 34 items |
| CSH Adept Powers | 4 items |
| CSH Vehicle Options | 10 items |
| CSH VTOLs & Drones | 6 actors |
| CSH Security Personnel | 18 actors |
| CSH Archetypes | 4 actors |
| CSH GM Reference | 3 journals |

## Notes

- **Fat bacteria** use the system's astral walls and fat-bacteria zones (sr2e 0.102.0): paint a zone with the *Fat bacteria* Region behaviour, or flag a wall as an astral barrier.
- **The FAB-NG netgun** ships with a manual procedure in its notes and the GM journal; automating it is planned for the system.
- **Gamma-scopolamine's** truth-serum aftermath is a manual GM step.
- **Facility hardware** (central control systems, drone storage) is reference text in the journals, not items.
- Spells that aren't in the core spell compendium (the Grimoire II ones) are listed in each magician's bio.

## Requirements

- Foundry VTT V13
- The `sr2e` system, version 0.102.0 or later

## Installation

In Foundry, **Add-on Modules → Install Module**, and paste this manifest URL:

```
https://github.com/futurekill/sr2e-corporate-security/releases/latest/download/module.json
```

Then enable it in your world (**Game Settings → Manage Modules**).

## Development

`packs-src/` (one JSON file per document) is the source of truth. `packs/` is built from it, gitignored, and rebuilt by the release workflow.

```bash
npm install
npm run generate        # regenerate packs-src/ from tools/data
npm run build-packs     # packs-src/ JSON -> packs/ LevelDB (close Foundry first)
npm run extract-packs   # pull edits made in Foundry back to packs-src/
npm run validate        # pre-flight checks on the pack sources
npm run lint
```

To release: add a `## X.Y.Z — date` section to `CHANGELOG.md` (the release notes come from it), bump `module.json`, then tag and push `vX.Y.Z`.

## Copyright

*Corporate Security Handbook* and *Shadowrun* are © FASA and their rights holders. This is a fan-made, non-commercial module for personal table use by owners of the book. Journals are original summaries with page references, not book text.
