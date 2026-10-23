# Changelog

## 0.2.2 — 2026-10-23

### Fixed
- **Implants arrive installed, so buying them in play runs the cybersurgery.** The IBS cyberhand mount were
  stored as uninstalled spares, so the Buy dialog skipped the surgery (sr2e 0.108+) and the implant
  didn't count (Essence) until someone ticked Installed. A spare is still possible:
  untick Installed. Re-import an item to pick this up.

## 0.2.1 — 2026-10-19

### Fixed
- **The Executive Protection Mage's Spell Barrier drains ((F / 2) + 1)M,** the Grimoire's
  corrected value. A copy already in your world keeps the old one; import it again.

## 0.2.0 — 2026-10-16

### Changed
- **FAB-NG netguns are automated** with sr2e 0.105 or later: a hit posts a net card the target resists from, and a net that holds pins the astral form until it escapes (token HUD). The item notes and the Magical Security journal say how.

### Added
- **The magicians' Grimoire II spells are on their sheets now,** instead of listed in
  their bios to add by hand: Stun Bolt, Stunball, Wrecker, Influence, Blast Barrier,
  Bullet Barrier, Spell Barrier and Detect Enemies (Extended Range), at the book's
  Force. They come from the Grimoire module's new spell pack, copied in, so you don't
  need that module enabled. Characters already in your world keep their old sheets;
  import them again from the compendium to get the spells.

## 0.1.1 — 2026-10-16

### Fixed
- **Ares ELD-AR Assault Rifle range brackets**: 15/40/100/250 m (assault rifle, SR2E Weapon Range Table p.88), not 25/100/250/500. The module had copied the core compendium's wrong values, fixed in sr2e 0.103.2. With sr2e 0.104.2 or later, copies already in your world are corrected automatically when it loads (unless you edited the range by hand).

## 0.1.0 — 2026-10-01

### Added — the Corporate Security Handbook (FASA 7118)
- **Weapons:**
  - Ares SuperSquirt II, Cascade rifle, ELD-AR assault rifle;
  - the BacteriTech FAB-NG netgun (standard and large), with the astral-netting
    procedure in its notes.
- **Ammunition:** FAB nets and feeding canisters, ELD-AR paint rounds and the
  gelcoat kit, reservoir clips.
- **Security gear:**
  - the Individualized Biometric Safety, and its cyberhand version;
  - nine portable security lights (low-wattage, active IR, UV);
  - Ares maglocks Type I–IV and biometric;
  - FAB-1 and FAB-UV canisters, vats, freezers and aerosols;
  - Bacterial Containment Grid components;
  - Sentinel weapons pods I–IV;
  - gamma-scopolamine.
- **Vehicles & drones:** the Ares TR-55T, TR-55E and TR-55C VTOLs, the Sentinel,
  Sentinel "P" and Guardian drones, and the TR-55 options.
- **Security personnel:** 18 stat-blocked NPCs (executive protection, magical
  security, guards, deckers, riggers and more), plus 4 archetypes.
- **Magic:** the Goose totem, and the Extended Missile Parry and Enhanced
  Perception adept powers.
- **GM reference journals:**
  - security levels and the Overall Security Level;
  - device ratings, wire and sensors, maglock and scanner bypass, rigger combat;
  - astral patrols, living walls and fat bacteria (with how to set them up with
    the system's astral walls and fat-bacteria zones), FAB-UV searches, the
    netgun, fiber-optic spellcasting.
