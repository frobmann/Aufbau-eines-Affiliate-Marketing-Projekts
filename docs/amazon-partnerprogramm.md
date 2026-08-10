# Amazon-Partnerprogramm (PartnerNet) — Anmeldung & rechtssichere Umsetzung

> Dies ist Punkt 2 des Projekts: Wie werden aus Produkten echte, verdienende Amazon-Links?

## 1. Anmeldung beim Amazon-Partnerprogramm

1. Gehe zu **partnernet.amazon.de** und melde dich mit deinem Amazon-Konto an.
2. Gib deine **Webseite/App** an (dieses Projekt bzw. deine GitHub-Pages-URL) sowie deine
   Social-Media-Kanäle, auf denen die Videos laufen.
3. Wähle die **Themen/Kategorien** (Mode, Haushalt, Accessoires …).
4. Du erhältst deinen **Partner-Tag** (Format: `deinname-21` für Amazon.de).
5. **Wichtige Startbedingung:** Amazon verlangt i. d. R. **3 qualifizierte Verkäufe
   innerhalb von 180 Tagen**, sonst wird der Account geschlossen (Neubewerbung möglich).

## 2. Partner-Tag ins Projekt eintragen

In [`../data/journey.json`](../data/journey.json):

```json
"config": {
  "affiliateTag": "deinname-21"
}
```

Danach werden alle Produktlinks automatisch korrekt aufgebaut:
`https://www.amazon.de/dp/<ASIN>?tag=deinname-21`

## 3. Wie funktioniert die Verlinkung technisch?

- Du hinterlegst pro Produkt die **ASIN** (die 10-stellige Amazon-Produkt-ID, steht in jeder
  Produkt-URL nach `/dp/`) **oder** einen fertigen SiteStripe-/Kurzlink.
- Die App (`app.js` → `buildAmazonUrl`) hängt deinen Partner-Tag an.
- Klickt der Nutzer, öffnet sich Amazon; ein Cookie ordnet den Kauf **24 Stunden** lang dir zu
  (auch andere Käufe im Warenkorb).

## 4. Pflicht-Kennzeichnung (in diesem Projekt bereits umgesetzt)

- ✅ **Werbekennzeichnung**-Banner oben auf der Seite.
- ✅ **Amazon-Pflichtsatz** „Als Amazon-Partner verdiene ich an qualifizierten Verkäufen."
  (Banner + Footer).
- ✅ Links mit `rel="sponsored nofollow noopener"`.
- ⚠️ **Noch zu ergänzen (deine Daten):** Impressum + Datenschutzerklärung (Footer-Platzhalter).
  Für Deutschland Pflicht (TMG/DSGVO).

## 5. Wichtige Amazon-Regeln (nicht verletzen!)

- **Keine Preise/Verfügbarkeiten manuell dauerhaft anzeigen**, außer über die offizielle
  **Product Advertising API (PA-API)** — sonst drohen falsche Angaben. In diesem MVP ist
  `price` nur ein optionaler Anzeigetext; für automatische, korrekte Preise → PA-API
  (siehe Roadmap).
- **Keine Partnerlinks in E-Mails, PDFs oder Offline-Material.**
- **Keine irreführende Werbung** und keine Aufforderung „Bitte kauf über meinen Link".
- Kennzeichnung muss **klar sichtbar** sein (erledigt).
