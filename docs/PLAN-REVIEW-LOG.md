# Plan Review Log: sr2e-corporate-security
Started 2026-10-01. MAX_ROUNDS=5.

## Round 1 — Codex
Concrete issues requiring revision:

- **Escape mechanics contradict the plan’s own rules:** “more than twice the attacker’s successes” becomes a TN in the implementation bullets. **Fix:** keep TN 5/8/3 separate from the required success count, explicitly define the −1/turn penalty, and resolve the equality boundary for impossible escape.
- **Attack cards lose token identity:** `item.mjs:1329` stores an actor UUID; linked astral forms share their actor with the body, while `isOnAstralPlane` reads token flags. **Fix:** capture the target TokenDocument UUID when attacking and evaluate its `flags.sr2e` through the existing helper.
- **“Large target” has no defined source:** `{tn, largeTn}` cannot select the exception without a size decision. **Fix:** add an explicit target-size choice, persist it on the card, and avoid inferring physical size from artwork dimensions.
- **Status authority is unspecified:** attackers generally cannot modify enemy actors, and defenders generally cannot update attacker-authored messages (`sr2e.mjs:1948–1978`). **Fix:** require target ownership or GM authority for resolution and reuse the outcome-message/author-side card-closing pattern.
- **Repeat clicks and Karma changes are unhandled:** existing ranged cards reconcile successes and reject stale resolution dialogs. **Fix:** add persistent resolution receipts, concurrent-click protection, and Karma reconciliation before applying entanglement.
- **Adding a button leaves normal damage resolution active:** the ranged path unconditionally builds a damage card, including for weapons with `damageCode: "Special"`. **Fix:** branch flagged netguns into a dedicated nondamaging resolution card.
- **A zero movement cap does not immobilize reliably:** `movement.mjs:63` bypasses limits outside combat, outside the active turn, and when the default-off setting is disabled. **Fix:** enforce entanglement independently of the optional movement-budget gate, with an explicit GM override.
- **Entanglement lifecycle is missing:** a round number alone cannot identify combat, prevent repeated escape attempts, or handle projection ending and token deletion. **Fix:** define token-scoped state, combat/time identity, attempt receipts, release controls, and cleanup behavior.
- **Copied pack tooling cannot support the proposed journals:** Shadowtech’s builder splits only actor/item children; its validator assumes item packs except `ff-vehicles` and requires `type`/`system` everywhere. **Fix:** derive document types from the manifest and implement JournalEntry page splitting/extraction plus document-specific validation.
- **Goose registration cites the wrong lifecycle:** Grimoire uses `Hooks.once("setup")`, not `init`. **Fix:** copy its setup-time registration and shape-check pattern.
- **IBS cyber modification is assigned to gear:** `GearData` has no cyberware Essence accounting. **Fix:** author the implant as `cyberware` with verified Essence and cost fields; it can remain in the same Item pack.
- **Vehicle mapping remains underspecified:** `VehicleData.speed` is one integer, not `170/350`; autopilot is `pilot`, and modification space is `cfConsumed`. **Fix:** map cruise speed to `speed`, maximum speed and unsupported statistics to notes, and specify exact field names before generating actors.
- **Printed actor statistics cannot simply be copied into derived values:** NPC preparation overwrites attribute values and Reaction, while character implants derive augmentation. **Fix:** define separate NPC/character mappings using base/mod fields and verify resulting statistics against the printed blocks.
- **The drug engine does not schedule sequential effects:** `drugs.mjs` applies item changes at dosing and requires manual ending; a one-hour Willpower effect would start immediately. **Fix:** specify manual activation of the aftermath effect and manual paralysis handling, or explicitly expand system scope.
- **The minimum dependency does not guarantee the netgun feature:** the local system manifest is `0.101.0`, and the plan ties its minimum to the astral release rather than the eventual netgun release. **Fix:** publish the required system changes first and set the module minimum to the actual release containing all required mechanics.
- **Overlap/dependency handling is incomplete:** Rigger 2 already provides Rigger Adaptation and Datajack Port, and Shadowtech references may be unavailable. **Fix:** compare TR-55 options against those entries, retain only documented CSH variants, and provide readable fallback references or declare required dependencies.
- **SSC reuse is overstated:** its ordinary medium/large netguns are physical weapons; an astral-only flag is not their generic mechanic. **Fix:** keep FAB entanglement explicitly scoped, or defer automation and ship notes/manual resolution as the simpler first release.
- **Lint and structural validation cannot establish this mechanic works.** **Fix:** require system rule tests and Foundry checks covering player/GM permissions, linked forms, spirits, Karma, repeated clicks, movement bypasses, and journal imports.

VERDICT: REVISE

### Claude's response (round 1)
Accepted:
- Tooling from QE, with journal splitting and a manifest-driven validator.
- Goose registers in setup.
- IBS cyber mod becomes cyberware.
- Exact VehicleData mapping.
- Separate npc and character mappings, with a stat-fidelity check.
- Gamma-scopolamine aftermath as a separate disabled effect.
- Release order fixed (sr2e 0.102.0 first).
- Rigger 2 / Shadowtech overlap handled as optional, self-contained notes.
- Tests specified.

The netgun findings (card identity, size choice, authority, Karma, damage branch, immobilization, lifecycle, scope) are all valid. Adopted your simpler alternative: the netgun ships as data with a full manual procedure, and automation becomes its own reviewed system plan (PLAN-astral-netgun.md).

## Round 2 — Codex
Most round-1 issues are resolved by deferring netgun automation. These concrete gaps remain:

- **Disabled drug effects still apply immediately:** `module/drugs.mjs:757` gathers changes from every item effect without checking `disabled`, then creates an enabled actor effect. **Fix:** remove the aftermath effect from the drug item and instruct the GM to create a separate actor effect after paralysis, ending it manually after one hour.
- **Vehicle CF mapping is still incorrect:** `VehicleModData.cfConsumed` is an authored field, not a derived value; there is no generic `CF` field. **Fix:** write printed flat CF directly to `system.cfConsumed`.
- **Supported vehicle statistics are unnecessarily relegated to notes:** `VehicleData` already supports `seating`, `cargo`, `load`, and `availability`; leaving seating unset displays the default `"2"`. **Fix:** populate supported fields with the corresponding printed values and reserve notes for unsupported details.
- **Manual netgun attacks still produce a misleading damage card:** the existing attack path posts a normal Resist Damage button for `"Special"` weapons. **Fix:** explicitly instruct users to retain attack successes but ignore the damage card and resolve entanglement manually.
- **The manual escape boundary remains inconsistent:** requiring successes strictly greater than twice the attacker’s successes also makes escape impossible when available dice equal that threshold. **Fix:** verify the printed rule and document the equality case explicitly.
- **“Restrained” does not provide token-specific entanglement:** linked body/form tokens share actor statuses, and the marker does not enforce immobility. **Fix:** describe it as a shared visual reminder, record the affected form separately, and explicitly require manual movement restriction and cleanup.
- **The revised tests omit the remaining interactive drug workflow.** **Fix:** add a Foundry check proving dosing causes no premature Willpower penalty and that manually starting/ending the aftermath restores the correct values.

VERDICT: REVISE

### Claude's response (round 2)
All 7 accepted:
- The aftermath is removed from the item and made a manual GM step.
- CF is written to cfConsumed directly.
- Seating, cargo, load and availability are populated.
- The damage card is to be ignored, explicitly.
- The escape rule is verified on the p.103 render (">more than twice"; "exceeds"); the equality case is documented as impossible in practice.
- Restrained is described as a shared visual reminder, with manual immobility.
- A drug workflow test is added.

Also transcribed the Goose totem and both adept powers from p.104.

## Round 3 — Codex
Round-2 fixes are addressed. One new schema mismatch remains:

- **Enhanced Perception cannot use a cost table:** `AdeptPowerData` supports only `pointCost × level`; it has no tiered-cost field or racial-maximum pricing logic, so the proposed item would miscalculate Power Point expenditure. **Fix:** ship three explicitly named tier items with per-level costs 0.25/0.5/1 and manual racial-limit instructions, or require a separately reviewed system change supporting tiered pricing.

VERDICT: REVISE

### Claude's response (round 3)
Accepted: Enhanced Perception ships as three tier items priced 0.25/0.5/1 per level, with the racial limit checked by hand.

## Round 4 — Codex
The three-tier Enhanced Perception model resolves the remaining schema mismatch. Earlier fixes remain intact; no further blocking flaws found in the implementation plan.

VERDICT: APPROVED
## Implementation deviation (Claude)
Archetypes ship as `npc` actors with the printed values, not `character` actors with cyberware items. The book prints only total Essence (no per-implant breakdown), so real cyberware items would derive a different Essence and augmentation than printed. Their bio explains how to make a playable character from them.
