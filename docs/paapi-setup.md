# PA-API einrichten — automatische Preise & Bilder (Stufe 2)

Die **Product Advertising API (PA-API 5.0)** liefert dir korrekte, aktuelle Preise, Titel
und Produktbilder direkt von Amazon. Das Script `scripts/fetch-products.js` holt diese Daten
und schreibt sie in `data/journey.json`.

## Warum ein Script (und keine Live-Abfrage im Browser)?

Die PA-API verlangt **geheime Schlüssel** und signierte Anfragen. Diese dürfen **niemals**
im Browser/öffentlichen Code stehen (sie wären sofort sichtbar und missbrauchbar). Deshalb
läuft die Abfrage **lokal bei dir** (oder in einer CI) und schreibt nur das fertige Ergebnis
in die statische Seite. So bleibt die Website auf GitHub Pages hostbar und sicher.

## Voraussetzungen

1. Aktiver **Amazon-Partner-Account**.
2. **3 qualifizierte Verkäufe** (erst danach schaltet Amazon die PA-API frei).
3. Node.js ≥ 18 installiert (`node --version`).

## Schritt für Schritt

1. **Schlüssel erzeugen:** PartnerNet → *Tools* → *Product Advertising API* →
   *Zugangsschlüssel verwalten* → Access Key + Secret Key erstellen.
2. **Konfig anlegen:**
   ```bash
   cp .env.example .env
   ```
   Dann `.env` öffnen und ausfüllen:
   ```env
   PAAPI_ACCESS_KEY=AK...
   PAAPI_SECRET_KEY=...
   PAAPI_PARTNER_TAG=deinname-21
   PAAPI_DOMAIN=amazon.de
   ```
   `.env` ist per `.gitignore` geschützt und wird nicht eingecheckt.
3. **ASINs eintragen:** In `data/journey.json` bei jedem Produkt das Feld `asin` setzen
   (die 10-stellige ID aus der Amazon-URL nach `/dp/`).
4. **Abrufen:**
   ```bash
   npm run fetch
   # oder: node scripts/fetch-products.js
   ```

Danach stehen Titel, Bild-URL und Preis (mit Stand-Datum) in `journey.json`.

## Was das Script genau macht

- Sammelt alle echten ASINs (Beispiel-ASINs mit „EXAMPLE" werden übersprungen).
- Fragt sie in Paketen zu je 10 über `GetItems` ab.
- **Titel & Bild** werden nur gesetzt, wenn dein Feld noch leer ist (deine Texte bleiben).
- **Preis** wird immer aktualisiert und mit `priceAsOf` (Datum) versehen — die App zeigt den
  Stand an (PA-API-Bedingung).

## Automatisieren (optional, später)

Per GitHub Action täglich laufen lassen: Schlüssel als *Repository Secrets* hinterlegen,
`node scripts/fetch-products.js` in einem Cron-Workflow ausführen und das aktualisierte
`journey.json` committen. (Kommt in Stufe 3.)

## Rechtlicher Hinweis

Preise/Bilder aus der PA-API dürfen nur gemäß den Amazon-Partnerbedingungen angezeigt werden,
inklusive **Stand-Angabe** (ist umgesetzt). Zeige keine manuell „eingefrorenen" Preise ohne
Aktualisierung.
