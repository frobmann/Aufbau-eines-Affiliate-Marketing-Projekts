# Prompt-Bibliothek — Avatar Journey 🎬

Fertige Prompts für den wiederkehrenden Avatar. **Wichtig:** KI-Modelle liefern mit
**englischen** Prompts meist bessere Ergebnisse — deshalb sind die Prompts hier auf Englisch,
die Erklärungen auf Deutsch. Passe die <PLATZHALTER> an.

> 🔑 Der wichtigste Trick für Konsistenz: **Immer dasselbe Referenzbild / dasselbe Kling-Element
> verwenden** und die **exakt gleiche Charakter-Beschreibung** wiederholen. Kleine, konkrete,
> wiederholbare Merkmale (Haarfarbe, Augenfarbe, Outfit, Statur) sind Gold wert.

---

## 1) Avatar-Referenzbild erstellen (FLUX.2 / Midjourney / Kling „Image")

Ziel: **ein** starkes Ganzkörperbild, das du danach als Charakter-DNA wiederverwendest.

### Beispiel-Avatar (weiblich) — als Vorlage, frei anpassbar
```
Full-body portrait of "Mia", a friendly stylish woman, 28 years old, warm light-brown
shoulder-length wavy hair, green eyes, light natural makeup, slim athletic build,
approximately 170 cm tall. Wearing a beige oversized blazer, white t-shirt, straight-leg
blue jeans and white sneakers. Neutral confident expression, soft natural daylight,
standing in a clean studio, plain light-grey background, photorealistic, sharp focus,
50mm lens, full body visible head to toe, 4k.
```

### Alternative (männlich)
```
Full-body portrait of "Leo", a friendly stylish man, 30 years old, short dark-brown hair,
light stubble, brown eyes, athletic build, approximately 182 cm tall. Wearing a navy overshirt,
white t-shirt, beige chinos and white sneakers. Calm confident expression, soft natural daylight,
plain light-grey studio background, photorealistic, sharp focus, 50mm lens, full body visible
head to toe, 4k.
```

**Midjourney-Zusatz** (falls du MJ nutzt): hänge `--ar 2:3 --style raw` an. Für Folgebilder
mit demselben Charakter: `--oref <bild-url> --ow 120`.

**Tipp:** Erzeuge 3–4 Varianten, wähle die beste, und **das** ist ab jetzt „dein Avatar".
Diese Datei/URL lädst du in Kling als **Element** hoch.

---

## 2) Tages-Video in Kling AI 3.0 (Avatar läuft durch die Stadt, hält ein Produkt)

Nutze dein gespeichertes **Element** als Charakter-Referenz und dazu ein **Produktbild**
(per Kolors Try-On), dann diesen Bewegungs-Prompt:

### Berlin — Tag 1 (mit Handtasche)
```
[Character element: Mia] walks slowly toward the camera along a Berlin street, the
Brandenburg Gate softly blurred in the background. She carries an elegant handbag in her
right hand and smiles naturally. Cinematic tracking shot, smooth steady cam following her,
warm golden-hour light, shallow depth of field, realistic motion, people softly blurred in
the background, 24fps film look, high detail.
```

### Berlin — Variante (mit Kaffeebecher)
```
[Character element: Mia] strolls through a lively Berlin street near the Spree river,
holding a takeaway coffee cup, looking relaxed and happy. Slow cinematic dolly shot moving
with her, soft morning light, gentle bokeh, realistic walking motion, urban background
softly blurred, 24fps film look, high detail.
```

### Vorlage für JEDEN weiteren Tag (Stadt + Produkt einsetzen)
```
[Character element: <NAME>] walks through <STADT + LANDMARK>, holding <PRODUKT>,
natural relaxed expression. Cinematic tracking shot following her, <TAGESZEIT/LICHT z. B.
soft afternoon light>, shallow depth of field, realistic motion, background softly blurred,
24fps film look, high detail.
```

---

## 3) Negativ-Prompt (was vermieden werden soll)

In Kling ins Feld „Negative Prompt" einfügen:
```
deformed hands, extra fingers, distorted face, changing face, inconsistent character,
blurry, low quality, watermark, text, logo, warped product, floating objects, jitter,
duplicate person, extra limbs
```

---

## 4) Konsistenz-Checkliste (jeden Tag gleich halten)

- ✅ Immer **dasselbe Element / Referenzbild** verwenden.
- ✅ Charaktername + Kernmerkmale **wörtlich** wiederholen (Haare, Augen, Statur, Grund-Outfit).
- ✅ Nur **Stadt, Produkt und Licht** pro Tag ändern — nicht das Aussehen des Avatars.
- ✅ Gleiche Kameraführung („cinematic tracking shot") für einen Wiedererkennungs-Stil.
- ✅ Falls das Tool Seeds erlaubt: denselben **Seed** notieren und wiederverwenden.
- ✅ Video als `.mp4` nach `assets/avatars/` legen (z. B. `tag-01-berlin.mp4`) und in
  `data/journey.json` eintragen.

---

## 5) Prompt-Bausteine für Abwechslung (optional)

- **Tageszeit/Licht:** `soft morning light` · `golden-hour light` · `overcast diffused light` ·
  `blue-hour evening light`
- **Kamera:** `slow dolly-in` · `side tracking shot` · `over-the-shoulder follow` ·
  `low-angle cinematic shot`
- **Stimmung:** `relaxed and happy` · `confident and stylish` · `playful` · `elegant`
