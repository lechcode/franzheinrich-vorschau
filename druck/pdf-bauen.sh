#!/usr/bin/env bash
# Baut assets/docs/AGB-und-Widerrufsbelehrung-Franz-Heinrich.pdf im Look der Website
# aus agb.html + widerruf.html (Vorlage: druck/agb-pdf.html, Chrome --print-to-pdf).
#
# Aufruf im Repo-Wurzelordner:   bash druck/pdf-bauen.sh            (nur wenn AGB/Widerruf/Vorlage/PDF geändert —
#                                                                    ein „von Hand" geändertes PDF wird so wieder ersetzt)
#                                bash druck/pdf-bauen.sh --immer    (immer neu bauen)
# Optional: CHROME=<pfad>  PDF_BASIS=http://localhost:PORT  (eigener Server statt python3 -m http.server)
# Läuft im Cloud-Runner automatisch nach jeder Kundenänderung (plattform-jobs, Schritt „Kunden-Build").
set -euo pipefail
cd "$(dirname "$0")/.."

ZIEL="assets/docs/AGB-und-Widerrufsbelehrung-Franz-Heinrich.pdf"

if [ "${1:-}" != "--immer" ] && git rev-parse --verify -q HEAD >/dev/null \
   && git diff --quiet HEAD -- agb.html widerruf.html druck/ "$ZIEL" \
   && [ -z "$(git ls-files --others --exclude-standard -- druck/)" ]; then
  echo "AGB/Widerruf unverändert — PDF bleibt, wie es ist."
  exit 0
fi

# Rechtstexte: öffentlich nur info@ (Franz, 24.11.2026)
if grep -q "franz@" agb.html widerruf.html; then
  echo "FEHLER: franz@ steht in agb.html/widerruf.html — PDF wird nicht gebaut." >&2; exit 1
fi

CHROME="${CHROME:-$(command -v google-chrome || command -v google-chrome-stable || command -v chromium || command -v chromium-browser || true)}"
[ -n "$CHROME" ] || { echo "FEHLER: kein Chrome/Chromium gefunden." >&2; exit 1; }

SERVER_PID=""
if [ -z "${PDF_BASIS:-}" ]; then
  PORT=8765
  python3 -m http.server "$PORT" --bind 127.0.0.1 >/dev/null 2>&1 &
  SERVER_PID=$!
  trap '[ -n "$SERVER_PID" ] && kill "$SERVER_PID" 2>/dev/null || true' EXIT
  sleep 1
  PDF_BASIS="http://127.0.0.1:$PORT"
fi

NEU="$(mktemp -d)/neu.pdf"
"$CHROME" --headless=new --disable-gpu --no-sandbox --no-pdf-header-footer \
  --virtual-time-budget=15000 --run-all-compositor-stages-before-draw \
  --user-data-dir="$(mktemp -d)" --print-to-pdf="$NEU" "$PDF_BASIS/druck/agb-pdf.html" >/dev/null 2>&1 || true

# Prüfen, bevor das alte PDF ersetzt wird: Datei da, Marken-Schriften eingebettet, kein Fehlertext.
[ -s "$NEU" ] || { echo "FEHLER: Chrome hat kein PDF erzeugt." >&2; exit 1; }
grep -aq "DMSerifDisplay" "$NEU" || { echo "FEHLER: Schrift DM Serif Display fehlt im PDF — altes PDF bleibt." >&2; exit 1; }
grep -aq "Manrope" "$NEU"        || { echo "FEHLER: Schrift Manrope fehlt im PDF — altes PDF bleibt." >&2; exit 1; }
[ "$(stat -c %s "$NEU" 2>/dev/null || wc -c < "$NEU")" -gt 60000 ] || { echo "FEHLER: PDF verdächtig klein — altes PDF bleibt." >&2; exit 1; }

mkdir -p "$(dirname "$ZIEL")"
mv "$NEU" "$ZIEL"
echo "PDF neu gebaut: $ZIEL"
