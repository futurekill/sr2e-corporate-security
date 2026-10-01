#!/bin/zsh
# Portraits for the security personnel and archetypes, in the style of the core
# contact portraits: the book's illustration (Corporate Security Handbook p.107-124,
# cropped into _work/ref/<slug>.png, git-ignored) as the likeness reference where
# the book has one, a setting of the character's own, 1:1 painted.
# Output _work/out/<slug>.webp; tools/fit-art.py squares them into assets/.
# Usage: tools/gen-portraits.sh [batch ...]
set -u
ROOT=/Users/jcandalino/Code/foundryvtt/shadowrun/sr2e-corporate-security
REF=$ROOT/_work/ref; OUT=_work/out
WORK=${TMPDIR:-/tmp}/csh-portraits; mkdir -p $WORK $ROOT/$OUT
cd $ROOT || exit 1

typeset -A D BG
D[executive-protection-adept]="gaunt human man, long slicked-back dark hair, scarred face, earring, cigarette, long pale coat, watchful"
BG[executive-protection-adept]="a rain-swept executive helipad at night, a client's VTOL waiting behind him"
D[executive-protection-decker]="bearded human man with round wire-rim glasses, suit and long overcoat, a cyberdeck keyboard under his arm, datajack"
BG[executive-protection-decker]="the back of an armoured limousine, deck cables and glowing displays"
D[executive-protection-mage]="young woman with long wavy dark hair, a pendant, a long coat over a flowing dress, a holstered pistol at her belt, calm"
BG[executive-protection-mage]="a luxury hotel corridor outside a client's suite, faint glowing ward sigils on the doors"
D[executive-protection-rigger]="lean human man in a dark chauffeur-style suit with cybereyes and a datajack, driving gloves, sharp and unsmiling"
BG[executive-protection-rigger]="the cockpit of an executive VTOL, instrument lights glowing"
D[executive-protection-specialist]="big, heavily augmented human bodyguard in a tailored dark suit, cybereyes with a rangefinder, earpiece, smartlinked pistol, alert"
BG[executive-protection-specialist]="a crowded corporate gala, blurred guests, his client's silhouette behind him"
D[investigator]="human man with short hair, a scar on his face, black turtleneck and coat, raising a pistol, cold stare"
BG[investigator]="a dim interrogation room, a single overhead lamp and a steel table"
D[magical-security-specialist]="human man with slicked-back streaked hair, smirking, cigarette, long coat, a glowing magical orb crackling between his hands"
BG[magical-security-specialist]="a server vault traced with glowing ward lines on the floor and walls"
D[magical-security-engineer]="balding older human man in a white lab coat, thoughtful frown"
BG[magical-security-engineer]="a magical-research laboratory, fiber-optic viewers, sample vats of glowing green bacteria"
D[personnel-security-specialist]="human man with glasses and neat hair, earring, light suit jacket, a pistol held low"
BG[personnel-security-specialist]="a corporate HR records office, walls of employee files on screens"
D[security-commander]="hard-faced woman with short swept-up hair and a facial scar, long military-cut coat, pistol in hand, cybereyes"
BG[security-commander]="a corporate security operations room, wall of camera feeds and a tactical map table"
D[security-decker]="young woman with a datajack and a display-link eye, cyberdeck in her lap, focused"
BG[security-decker]="a corporate Matrix security node rendered as a dark glowing grid, black IC shapes looming"
D[security-executive]="silver-haired executive in an expensive suit with a datajack, composed and calculating"
BG[security-executive]="a high-rise corporate boardroom at dusk, city lights through glass walls"
D[security-guard]="young bald human man in a corporate security uniform and tie, plain and slightly bored"
BG[security-guard]="a corporate lobby security checkpoint with a scanner gate"
D[security-mage]="older human man with grey hair and beard, tattooed arcane symbols on his chest under an open long coat, steady gaze"
BG[security-mage]="a corporate warehouse at night, faint astral shimmer of watcher spirits around him"
D[security-officer]="sturdy human officer in a corporate security uniform with a radio earpiece, smartlinked rifle slung, commanding"
BG[security-officer]="the loading gate of a guarded warehouse at night, floodlights"
D[security-rigger]="woman with cybereyes and a datajack cable to a control rig, rigger headset, intent"
BG[security-rigger]="a closed-circuit simsense control room, dozens of camera feeds and drone views"
D[security-specialist-animal-handler]="human handler with cybereyes in a corporate security jacket, kneeling with a powerful spotted guard dog in a spiked collar"
BG[security-specialist-animal-handler]="the perimeter fence of a corporate compound at dusk"
D[security-specialist-fast-response-officer]="corporate SWAT trooper in heavy tactical armour and helmet, cybereyes glinting, assault rifle ready"
BG[security-specialist-fast-response-officer]="smoke and flashing red alarm lights in a breached corporate corridor"
D[freelance-executive-protection-specialist-troll]="troll with curved horns, tusks, wild hair and goggles pushed up, rubbing his head, wearing a buttoned vest and long coat"
BG[freelance-executive-protection-specialist-troll]="the door of a parked armoured limousine on a rainy street"
D[freelance-magical-security-consultant]="scruffy human man with stubble and messy dark hair, long coat and loose tie, wry and confident"
BG[freelance-magical-security-consultant]="a dim talisman shop back room cluttered with fetishes and candles"
D[freelance-security-rigger]="human rigger in a striped rigger helmet with goggles, cigarette, long coat, holding a remote-control deck"
BG[freelance-security-rigger]="a building's rooftop at night among antennas and parked drones"
D[security-system-design-engineer-dwarf]="stocky bearded dwarf in a baseball cap, cigar, camo fatigues, a big tool backpack with an antenna, beside a computer terminal"
BG[security-system-design-engineer-dwarf]="a half-installed security panel in a corporate corridor, wiring everywhere"

BATCHES=(
  "executive-protection-adept executive-protection-decker executive-protection-mage executive-protection-rigger executive-protection-specialist investigator"
  "magical-security-specialist magical-security-engineer personnel-security-specialist security-commander security-decker security-executive"
  "security-guard security-mage security-officer security-rigger security-specialist-animal-handler security-specialist-fast-response-officer"
  "freelance-executive-protection-specialist-troll freelance-magical-security-consultant freelance-security-rigger security-system-design-engineer-dwarf"
)

BS=(${@}); [ ${#BS} -eq 0 ] && BS=(1 2 3 4)
for b in $BS; do
  slugs=(${=BATCHES[$b]}); pf=$WORK/batch-$b.txt; refs=(); i=1; listing=""
  for s in $slugs; do
    if [ -f "$REF/$s.png" ]; then refs+=(-i "$REF/$s.png"); r="reference image $((${#refs}/2))"; else r="no reference — invent from the description"; fi
    listing+="$i. ($r) $D[$s]. SETTING: $BG[$s]. Save to $OUT/$s.webp"$'\n'; i=$((i+1))
  done
  cat > $pf <<EOF
Use your imagegen skill with the built-in image_gen tool (NOT the CLI fallback).

Generate ${#slugs} character portraits for a Shadowrun (2050s cyberpunk) tabletop game,
one image per character. Some have a black-and-white reference illustration of
that same character (numbered below in attachment order): keep its likeness, face,
build, clothing and props, rendered as a fully painted, cinematic, full-colour
portrait. Those marked "no reference" are new characters from the description.

STYLE for every image: square 1:1, head-and-shoulders to waist, character centred
and facing the viewer, dramatic lighting from their OWN setting (given per
character) with that setting soft-focus behind them, painterly realism. Every
setting and palette must differ. NO text, NO logos, NO watermarks, NO border.

$listing
Report every saved path.
EOF
  echo "=== batch $b ($(date +%H:%M:%S))"
  timeout 2400 codex exec --skip-git-repo-check -s workspace-write $refs < $pf > $WORK/batch-$b.log 2>&1
  for s in $slugs; do [ -f "$OUT/$s.webp" ] && echo "   OK   $s" || echo "   MISS $s"; done
  grep -q 'usage limit' $WORK/batch-$b.log && echo "   !! usage limit — $WORK/batch-$b.log"; true
done
