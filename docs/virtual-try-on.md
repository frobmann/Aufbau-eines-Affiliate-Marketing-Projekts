# Avatar einkleiden — Amazon-Produkte per Virtual Try-On (VTO)

So bringst du Kleidung & Produkte, die du auf Amazon bewerben willst, an deinen Avatar.
Ablauf in 3 Etappen:

**Amazon-Produktfoto → auf den Avatar setzen (Try-On) → in Kling zum Laufvideo animieren.**

---

## Welches Tool für welches Produkt?

| Produkttyp | Bestes Tool (2026) | Warum |
|---|---|---|
| **Kleidung** (Shirt, Jacke, Kleid, Hose) | **Kling – Kolors Virtual Try-On** | In Kling integriert (gleiche Plattform wie die Videos), gratis-Stufe, versteht Faltenwurf/Körperform |
| **Accessoires** (Tasche, Brille, Hut, Schmuck) & **gehaltene Objekte** (Becher) | **FLUX.1 Kontext** oder **Google „Nano Banana"** | Echte referenzbasierte Bild-Bearbeitung — stark dort, wo klassisches Try-On schwächelt |
| **Hohe Stückzahl / Katalog** | FASHN.ai · Veeton · Uwear | Batch-Verarbeitung vieler Artikel (später relevant beim Skalieren) |

---

## Schritt 1 — Amazon-Produktbild holen
- Produkt auf Amazon öffnen → **Hauptbild** speichern (am besten freigestellt auf weißem
  Hintergrund; das liefert die besten Try-On-Ergebnisse).
- Ablegen unter `assets/products/` (z. B. `handtasche.jpg`).
- Rechtlich: Produktbilder nur im Rahmen der Amazon-Partnerbedingungen verwenden. Sauberster
  Weg für dauerhafte Nutzung: Bilder über die **PA-API** beziehen (siehe `paapi-setup.md`).

## Schritt 2a — Kleidung anziehen (Kling – Kolors Virtual Try-On)
1. In Kling **„Virtual Try-On / Kolors"** öffnen.
2. **Modell-Bild** = dein Avatar-Referenzbild (z. B. „Mia").
3. **Kleidungs-Bild** = das Amazon-Foto.
4. Generieren → Ergebnis: **ein Standbild, auf dem der Avatar das Teil trägt.**

## Schritt 2b — Tasche / Becher / Brille (FLUX.1 Kontext oder Nano Banana)
Beide Bilder hochladen (Avatar + Produkt) und bearbeiten. Beispiel-Prompt:
```
Keep the woman's face, hair and outfit exactly the same. She is now holding this handbag
in her right hand. Photorealistic, natural lighting, seamless integration, no distortion
of the product.
```
Für getragene Accessoires (Sonnenbrille/Hut):
```
Keep the person identical. Add these sunglasses on her face, matching perspective and
lighting. Photorealistic, seamless.
```

## Schritt 3 — Standbild → Laufvideo (Kling, Image-to-Video)
- Das fertige „angezogene" Standbild als **Startbild/erste Frame** verwenden.
- Bewegungs-Prompt aus [`prompts.md`](prompts.md) einfügen (Avatar läuft durch die Stadt).
- 5–15 Sek. rendern → `.mp4` nach `assets/avatars/` → in `data/journey.json` eintragen.

---

## Konsistenz-Regel (wichtig!)
Beim Try-On darf sich **nur** das Produkt ändern — **Gesicht, Haare, Statur bleiben gleich**.
Deshalb im Prompt immer betonen: *„keep her face and body identical"*. So ist es über alle
Produkte hinweg garantiert **dieselbe Person**.

## Mini-Checkliste pro Produkt
- [ ] Amazon-Hauptbild gespeichert (freigestellt) → `assets/products/`
- [ ] Try-On/Edit gemacht → Avatar trägt/hält das Produkt (Gesicht unverändert)
- [ ] Standbild → Kling Image-to-Video mit Stadt-Prompt
- [ ] `.mp4` → `assets/avatars/`, Produkt (ASIN) → `data/journey.json`
- [ ] Push → Live-Seite aktualisiert sich automatisch
