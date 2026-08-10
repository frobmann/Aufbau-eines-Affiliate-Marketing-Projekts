# Avatar Journey 🧳🌍

**Ein Avatar. Jeden Tag eine neue Stadt. Jeden Tag neue Lieblingsprodukte.**

Ein Affiliate-Marketing-Projekt: Ein wiederkehrender KI-Avatar reist täglich durch eine
neue Stadtlandschaft (Start: **Berlin**) und bewirbt Markenprodukte. Klickt der Nutzer auf
ein Produkt, gelangt er über einen **Amazon-Partnerlink** zum Kauf.

Dieses Repository enthält die **lauffähige Web-App (MVP)** dafür sowie die komplette Strategie.

---

## 🚀 Schnellstart

Da die App per JavaScript eine JSON-Datei lädt, muss sie über einen kleinen lokalen Server
laufen (nicht per Doppelklick auf `index.html`):

```bash
# Variante A: Python (fast überall vorinstalliert)
python3 -m http.server 8000

# Variante B: Node
npx serve .
```

Dann im Browser öffnen: <http://localhost:8000>

Kostenlos veröffentlichen kannst du die Seite später z. B. über **GitHub Pages**
(Settings → Pages → Branch auswählen).

---

## 🗓️ So deckst du den Avatar täglich neu ein

Alles läuft über **eine einzige Datei**: [`data/journey.json`](data/journey.json).
Du fügst einfach einen neuen Eintrag unter `"days"` hinzu:

```jsonc
{
  "day": 2,
  "date": "2026-08-11",
  "city": "Hamburg",
  "country": "Deutschland",
  "landmark": "Elbphilharmonie",
  "avatarMedia": "assets/avatars/tag-02-hamburg.mp4",   // dein Kling-Video (oder .jpg)
  "avatarPoster": "assets/avatars/tag-02-hamburg.jpg",
  "caption": "Tag 2 — Der Avatar erkundet den Hamburger Hafen.",
  "products": [
    {
      "name": "Sonnenbrille XY",
      "image": "assets/products/sonnenbrille.jpg",
      "price": "29,99 €",
      "note": "Ideal für sonnige Städtetrips.",
      "asin": "B00XXXXXXX",     // ASIN reicht – Link wird automatisch gebaut
      "url": ""                  // ODER hier einen fertigen Amazon-Link einfügen
    }
  ]
}
```

**Wichtig:**
- Die App zeigt automatisch den **neuesten Tag**, dessen `date` ≤ heute ist.
- **Amazon-Link:** Entweder `asin` (empfohlen) **oder** eine fertige `url` angeben. Der
  Partner-Tag wird automatisch angehängt.
- Trage deinen echten Partner-Tag in `config.affiliateTag` ein (ersetzt `DEIN-TAG-21`).

---

## 🎨 Avatar & Produkte erstellen (Tooling)

Empfohlener Workflow (siehe [`docs/tooling.md`](docs/tooling.md) für Details):

1. **Avatar-DNA einmalig festlegen** – mit *Hedra (Elements)* oder *HeyGen*, damit der
   Avatar jeden Tag identisch aussieht (keine Charakter-Drift).
2. **Produkt an den Avatar bringen** – *Kling AI 3.0 (Kolors Try-On)*: Produktfoto hochladen,
   Avatar hält/trägt es.
3. **Durch die Stadt laufen lassen** – *Kling AI 3.0* / *Google Veo* / *Runway* für die
   Lauf-Animation in der Stadtkulisse.

Fertiges Video (`.mp4`) nach `assets/avatars/` legen, Produktfotos nach `assets/products/`.

---

## 📁 Projektstruktur

```
.
├── index.html              # Die Web-App (Startseite)
├── data/journey.json       # ➜ Hier pflegst du täglich Stadt + Produkte ein
├── assets/
│   ├── css/styles.css      # Design
│   ├── js/app.js           # Logik (lädt journey.json, baut Partnerlinks)
│   ├── avatars/            # Deine Avatar-Videos/-Bilder pro Tag
│   └── products/           # Deine Produktfotos
└── docs/
    ├── tooling.md          # KI-Tool-Empfehlungen & Workflow
    ├── amazon-partnerprogramm.md   # Anmeldung + rechtssichere Umsetzung
    └── roadmap.md          # Projektfahrplan (alle Ausbaustufen)
```

---

## ⚖️ Rechtliches (kurz, aber wichtig)

- **Werbekennzeichnung** ist Pflicht (bereits im Banner + Footer umgesetzt).
- **Amazon-Pflichthinweis** „Als Amazon-Partner verdiene ich an qualifizierten Verkäufen."
  ist eingebaut.
- Links tragen `rel="sponsored nofollow noopener"` (Amazon-Vorgabe).
- **Impressum & Datenschutz** musst du noch mit deinen Daten füllen (Platzhalter im Footer).

Details: [`docs/amazon-partnerprogramm.md`](docs/amazon-partnerprogramm.md).

---

## 🗺️ Roadmap

Siehe [`docs/roadmap.md`](docs/roadmap.md) — von diesem MVP bis zu automatischer
Produktpflege, mehreren Ländern/Amazon-Domains, Klick-Tracking und Social-Media-Ausspielung.
