#!/bin/zsh
# Item icons and vehicle art for the Corporate Security Handbook module, in the
# style of the sibling modules' icons (dark, moody, single object, 1:1).
# Prompts: tools/art-prompts.tsv (key<TAB>description). Output _work/out/icons/<key>.webp;
# tools/fit-art.py resizes into assets/ and copies shared icons (tools/art-share.tsv).
# Usage: tools/gen-icons.sh [batch ...]   (batches of 8 icons; the last batch is the vehicles)
set -u
ROOT=/Users/jcandalino/Code/foundryvtt/shadowrun/sr2e-corporate-security
OUT=_work/out/icons; WORK=${TMPDIR:-/tmp}/csh-icons; mkdir -p $WORK $ROOT/$OUT
cd $ROOT || exit 1
KEYS=(${(f)"$(cut -f1 tools/art-prompts.tsv)"})
typeset -A P; while IFS=$'\t' read -r k d; do P[$k]=$d; done < tools/art-prompts.tsv
NB=$(( (${#KEYS} + 7) / 8 ))
BS=(${@}); [ ${#BS} -eq 0 ] && BS=($(seq 1 $((NB + 1))))
for b in $BS; do
  pf=$WORK/batch-$b.txt; list=""; keys=()
  if [ $b -le $NB ]; then
    keys=(${KEYS[$(( (b-1)*8 + 1 )),$(( b*8 ))]})
    for k in $keys; do mkdir -p $OUT/${k%/*}; list+="- $P[$k]. Save to $OUT/$k.webp"$'\n'; done
    cat > $pf <<EOF
Use your imagegen skill with the built-in image_gen tool (NOT the CLI fallback).

Generate ${#keys} inventory icons for a Shadowrun (2050s cyberpunk) tabletop game, one
image per item. STYLE for every icon: square 1:1, a single object centred and filling
most of the frame, three-quarter view, photoreal-painterly, dark charcoal background
with a soft vignette and subtle smoky texture, moody rim lighting with small warm or
coloured glow accents. NO text, NO logos, NO watermarks, NO border, NO hands or people.

$list
Report every saved path.
EOF
  else
    keys=(vehicle/ares-tr-55t-traveler-vtol vehicle/ares-tr-55e-presidents-edition-executive-vtol vehicle/ares-tr-55c-cargoliner-vtol vehicle/ares-sentinel-drone vehicle/ares-sentinel-p-series-drone vehicle/ares-guardian-drone)
    mkdir -p $OUT/vehicle
    cat > $pf <<EOF
Use your imagegen skill with the built-in image_gen tool (NOT the CLI fallback).

Generate 6 vehicle portraits for a Shadowrun (2050s cyberpunk) tabletop game. STYLE:
square 1:1, the vehicle centred and filling the frame, cinematic three-quarter view,
painterly realism, a dark atmospheric backdrop fitting the vehicle with neon or
floodlight accents. Ares Industries corporate colours (dark grey, red accents) but NO
readable text or logos, NO watermarks, NO border.

- Ares TR-55T Traveler: a tilt-wing VTOL commuter aircraft, two engines on tilting wings, sleek passenger fuselage, hovering above a corporate helipad at night. Save to $OUT/vehicle/ares-tr-55t-traveler-vtol.webp
- Ares TR-55E "President's Edition": the same tilt-wing VTOL in a luxurious executive finish, glossy black with chrome trim, on a rooftop helipad. Save to $OUT/vehicle/ares-tr-55e-presidents-edition-executive-vtol.webp
- Ares TR-55C Cargoliner: the same tilt-wing VTOL armoured and rugged, military drab, a ventral winch lowering a cargo pallet, rain. Save to $OUT/vehicle/ares-tr-55c-cargoliner-vtol.webp
- Ares Sentinel: an immobile ceiling-mounted security drone turret with a rotary weapons pod and sensor eyes, in a corporate corridor. Save to $OUT/vehicle/ares-sentinel-drone.webp
- Ares Sentinel "P": the same security drone turret riding a narrow monorail track along a warehouse ceiling. Save to $OUT/vehicle/ares-sentinel-p-series-drone.webp
- Ares Guardian: a small vectored-thrust security drone, rounded body with ducted fans and a micro-turret, hovering in a corporate lobby. Save to $OUT/vehicle/ares-guardian-drone.webp

Report every saved path.
EOF
  fi
  echo "=== batch $b ($(date +%H:%M:%S))"
  timeout 2400 codex exec --skip-git-repo-check -s workspace-write < $pf > $WORK/batch-$b.log 2>&1
  for k in $keys; do [ -f "$OUT/$k.webp" ] && echo "   OK   $k" || echo "   MISS $k"; done
  grep -q 'usage limit' $WORK/batch-$b.log && echo "   !! usage limit — $WORK/batch-$b.log"; true
done
