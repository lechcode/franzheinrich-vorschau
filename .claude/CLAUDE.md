# franzheinrich.com — Hinweise für Änderungen (Lechcode-Runner)

Diese Seite ist LIVE. Jede Änderung geht nach dem QA-Gate sofort online.

## Rechtstexte und PDF
- AGB, Widerrufsbelehrung, Datenschutz, Impressum: `agb.html`, `widerruf.html`, `datenschutz.html`, `impressum.html`.
  Öffentliche Adressen OHNE `.html` (`/agb`, `/widerruf`, `/datenschutz`, `/impressum`) — Links genau so setzen.
- Es sind geprüfte Rechtstexte von Franz: nur das ändern, was er wörtlich vorgibt.
- Öffentlich steht nur `info@franzheinrich.com` (nie `franz@…`). Keine `mailto:`-Links.
- Englische Fassungen (von Franz selbst übersetzt, Wort für Wort übernommen): `terms.html` (/terms), `withdrawal.html` (/withdrawal),
  `privacy-policy.html` (/privacy-policy), `legal-notice.html` (/legal-notice). Ändert Franz einen deutschen Rechtstext, die
  englische Fassung NICHT selbst nachübersetzen — Franz liefert sie; im Ergebnis kurz erwähnen, dass die EN-Seite noch alt ist.
- **Die PDFs in `assets/docs/` NIEMALS selbst schreiben oder bearbeiten** (`AGB-und-Widerrufsbelehrung-Franz-Heinrich.pdf`,
  `Terms-and-Withdrawal-Franz-Heinrich.pdf`). Sie werden nach deiner Änderung automatisch aus den Seiten gebaut
  (`druck/agb-pdf.html` aus agb + widerruf, `druck/terms-pdf.html` aus terms + withdrawal, Skript `druck/pdf-bauen.sh`, Chrome) —
  mit Logo, Farben und Schriften. PDF-Inhalt ändern = die Seiten ändern. PDF-Aussehen ändern = CSS in der Druckvorlage.

## Design
- Brand Kit verbindlich: Navy #023047 · Orange #E96A2C · Cream #F7F1E6 · Sand #D9C7B5 (nie als Fläche) · Soft Blue #8ECAE6 (nur Akzent),
  Schriften DM Serif Display (Überschriften) + Manrope (Text), lokal in `assets/fonts/`.
- Wer `assets/site.css`, `assets/site.js` oder `assets/i18n-en.js` ändert, zählt die Versionsnummer `?v=…` in ALLEN HTML-Dateien hoch.
- Textänderungen auf der Startseite gelten auch für die englische Fassung (`assets/i18n-en.js`, gleicher `data-t`-Schlüssel).
- Jede neue öffentliche Seite braucht `og:title`, `og:description`, `og:image`; gewolltes `noindex` mit `<!-- lc:noindex-gewollt -->` markieren.
