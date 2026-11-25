#!/usr/bin/env bash
# Baut die Rechts-PDFs im Look der Website aus den Seiten (Chrome --print-to-pdf):
#   DE: assets/docs/AGB-und-Widerrufsbelehrung-Franz-Heinrich.pdf  aus agb.html + widerruf.html     (Vorlage druck/agb-pdf.html)
#   EN: assets/docs/Terms-and-Withdrawal-Franz-Heinrich.pdf        aus terms.html + withdrawal.html (Vorlage druck/terms-pdf.html)
#
# Aufruf im Repo-Wurzelordner:   bash druck/pdf-bauen.sh            (je PDF nur, wenn Quellseiten/Vorlage/PDF geändert —
#                                                                    ein „von Hand" geändertes PDF wird so wieder ersetzt)
#                                bash druck/pdf-bauen.sh --immer    (immer neu bauen)
# Optional: CHROME=<pfad>  PDF_BASIS=http://localhost:PORT  (eigener Server statt python3 -m http.server)
# Läuft im Cloud-Runner automatisch nach jeder Kundenänderung (plattform-jobs, Schritt „Kunden-Build").
set -euo pipefail
cd "$(dirname "$0")/.."

IMMER=""; [ "${1:-}" = "--immer" ] && IMMER=1

# geaendert <dateien…>: 0, wenn eine der Dateien gegenüber HEAD verändert oder neu ist
geaendert() {
  [ -n "$IMMER" ] && return 0
  git rev-parse --verify -q HEAD >/dev/null || return 0
  git diff --quiet HEAD -- "$@" || return 0
  [ -n "$(git ls-files --others --exclude-standard -- "$@")" ] && return 0
  return 1
}

SERVER_PID=""
server() {
  [ -n "${PDF_BASIS:-}" ] && return 0
  PORT=8765
  python3 -m http.server "$PORT" --bind 127.0.0.1 >/dev/null 2>&1 &
  SERVER_PID=$!
  trap '[ -n "$SERVER_PID" ] && kill "$SERVER_PID" 2>/dev/null || true' EXIT
  sleep 1
  PDF_BASIS="http://127.0.0.1:$PORT"
}

CHROME="${CHROME:-$(command -v google-chrome || command -v google-chrome-stable || command -v chromium || command -v chromium-browser || true)}"

# baue <vorlage> <ziel-pdf> <seite1> <seite2>
baue() {
  local vorlage="$1" ziel="$2" s1="$3" s2="$4"
  if ! geaendert "$s1" "$s2" "$vorlage" "$ziel" druck/pdf-bauen.sh; then
    echo "$s1/$s2 unverändert — $ziel bleibt, wie es ist."; return 0
  fi
  # Rechtstexte: öffentlich nur info@ (Franz, 24.11.2026)
  if grep -q "franz@" "$s1" "$s2"; then echo "FEHLER: franz@ steht in $s1/$s2 — $ziel wird nicht gebaut." >&2; return 1; fi
  [ -n "$CHROME" ] || { echo "FEHLER: kein Chrome/Chromium gefunden." >&2; return 1; }
  server
  local neu; neu="$(mktemp -d)/neu.pdf"
  "$CHROME" --headless=new --disable-gpu --no-sandbox --no-pdf-header-footer \
    --virtual-time-budget=15000 --run-all-compositor-stages-before-draw \
    --user-data-dir="$(mktemp -d)" --print-to-pdf="$neu" "$PDF_BASIS/$vorlage" >/dev/null 2>&1 || true
  # Prüfen, bevor das alte PDF ersetzt wird: Datei da, Marken-Schriften eingebettet, kein Fehlertext.
  [ -s "$neu" ] || { echo "FEHLER: Chrome hat kein PDF erzeugt ($ziel)." >&2; return 1; }
  grep -aq "DMSerifDisplay" "$neu" || { echo "FEHLER: DM Serif Display fehlt — $ziel bleibt." >&2; return 1; }
  grep -aq "Manrope" "$neu"        || { echo "FEHLER: Manrope fehlt — $ziel bleibt." >&2; return 1; }
  [ "$(stat -c %s "$neu" 2>/dev/null || wc -c < "$neu")" -gt 60000 ] || { echo "FEHLER: PDF verdächtig klein — $ziel bleibt." >&2; return 1; }
  mkdir -p "$(dirname "$ziel")"
  mv "$neu" "$ziel"
  echo "PDF neu gebaut: $ziel"
}

FEHLER=0
baue druck/agb-pdf.html   assets/docs/AGB-und-Widerrufsbelehrung-Franz-Heinrich.pdf agb.html   widerruf.html   || FEHLER=1
baue druck/terms-pdf.html assets/docs/Terms-and-Withdrawal-Franz-Heinrich.pdf       terms.html withdrawal.html || FEHLER=1
exit $FEHLER
