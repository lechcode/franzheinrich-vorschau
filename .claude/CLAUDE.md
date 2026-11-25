# franzheinrich.com — Hinweise für Änderungen (Lechcode-Runner)

Diese Seite ist LIVE. Jede Änderung geht nach dem QA-Gate sofort online.

## Rechtstexte und PDF
- AGB, Widerrufsbelehrung, Datenschutz, Impressum: `agb.html`, `widerruf.html`, `datenschutz.html`, `impressum.html`.
  Öffentliche Adressen OHNE `.html` (`/agb`, `/widerruf`, `/datenschutz`, `/impressum`) — Links genau so setzen.
- Es sind geprüfte Rechtstexte von Franz: nur das ändern, was er wörtlich vorgibt.
- Öffentlich steht nur `info@franzheinrich.com` (nie `franz@…`). Keine `mailto:`-Links.
- **`assets/docs/AGB-und-Widerrufsbelehrung-Franz-Heinrich.pdf` NIEMALS selbst schreiben oder bearbeiten.**
  Das PDF wird nach deiner Änderung automatisch aus `agb.html` + `widerruf.html` gebaut
  (Vorlage `druck/agb-pdf.html`, Skript `druck/pdf-bauen.sh`, Chrome) — mit Logo, Farben und Schriften.
  Wünscht Franz Änderungen am PDF-Inhalt: in `agb.html` / `widerruf.html` ändern. Wünscht er Änderungen am
  PDF-Aussehen: in `druck/agb-pdf.html` (CSS) ändern.

## Design
- Brand Kit verbindlich: Navy #023047 · Orange #E96A2C · Cream #F7F1E6 · Sand #D9C7B5 (nie als Fläche) · Soft Blue #8ECAE6 (nur Akzent),
  Schriften DM Serif Display (Überschriften) + Manrope (Text), lokal in `assets/fonts/`.
- Wer `assets/site.css`, `assets/site.js` oder `assets/i18n-en.js` ändert, zählt die Versionsnummer `?v=…` in ALLEN HTML-Dateien hoch.
- Textänderungen auf der Startseite gelten auch für die englische Fassung (`assets/i18n-en.js`, gleicher `data-t`-Schlüssel).
- Jede neue öffentliche Seite braucht `og:title`, `og:description`, `og:image`; gewolltes `noindex` mit `<!-- lc:noindex-gewollt -->` markieren.
