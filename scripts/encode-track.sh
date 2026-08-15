#!/usr/bin/env bash
# Usage: encode_track.sh <input.mp3> <output.mp3> <start_sec> <dur_sec>
# Cuts a loopable excerpt, downmixes to mono 64 kbps and loudness-normalises to
# -18 LUFS, then trims gain until the *decoded mp3* true peak sits below -1 dBTP.
set -euo pipefail
IN="$1"; OUT="$2"; SS="$3"; DUR="$4"
FADE_OUT=$(python3 -c "print($DUR - 0.3)")
NORM="loudnorm=I=-18:TP=-2:LRA=11"

json_field() { python3 -c "import json,sys;print(json.loads(sys.stdin.read())['$1'])"; }
measure() { # <file-or-input-args...>
  ffmpeg -hide_banner -nostats "$@" -vn -af "${NORM}:print_format=json" -f null - 2>&1 |
    sed -n '/^{/,/^}/p'
}

MEAS=$(measure -ss "$SS" -t "$DUR" -i "$IN")
get() { json_field "$1" <<<"$MEAS"; }

TRIM=0
for _ in 1 2 3 4; do
  ffmpeg -v error -y -ss "$SS" -t "$DUR" -i "$IN" -vn \
    -af "afade=t=in:st=0:d=0.3,afade=t=out:st=${FADE_OUT}:d=0.3,${NORM}:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):offset=$(get target_offset):linear=true,volume=${TRIM}dB" \
    -ac 1 -ar 44100 -b:a 64k "$OUT"
  OUT_MEAS=$(measure -i "$OUT")
  TP=$(json_field input_tp <<<"$OUT_MEAS")
  LU=$(json_field input_i <<<"$OUT_MEAS")
  echo "${OUT}: ${LU} LUFS, ${TP} dBTP (trim ${TRIM} dB)"
  python3 -c "import sys;sys.exit(0 if $TP <= -1.0 else 1)" && break
  TRIM=$(python3 -c "print(round($TRIM - ($TP + 1.5), 2))")
done
