# KI-Tooling: Avatar bauen & Produkte einfügen (Stand 2026)

Ziel: **Ein wiederkehrender Avatar**, der **jeden Tag** ein anderes Produkt hält und durch
eine **neue Stadt** läuft — startend in Berlin. Der kritische Erfolgsfaktor ist
**Charakter-Konsistenz** (gleiches Gesicht/Körper an jedem Tag).

## Empfohlenes 2-Stufen-Setup

| Schritt | Aufgabe | Empfohlenes Tool | Warum |
|--------|---------|------------------|-------|
| 1. Avatar-DNA (einmalig) | Wiederkehrenden Avatar festlegen | **Hedra (Elements)** oder **HeyGen** | Speichert das Gesicht als wiederverwendbares Asset → keine Charakter-Drift |
| 2. Produkt einfügen (täglich) | Handtasche/Becher „anziehen"/geben | **Kling AI 3.0 (Kolors Try-On / Elements)** | Legt Produkte realistisch in Hand/an Körper |
| 3. Durch die Stadt laufen (täglich) | Bewegung + Stadtkulisse | **Kling AI 3.0** (oder Google Veo / Runway) | Cinematic-Qualität 2026 für flüssige Lauf-Animation |

## Wenn du mit EINEM Tool starten willst
**Kling AI 3.0** — vereint für Einsteiger am meisten: Charakter-Konsistenz (Elements 3.0),
Produkt-Einfügung (Kolors Try-On) und die Lauf-Bewegung durch Stadtkulissen.

## Alternative für klassische UGC-Werbespots
**Creatify (Product Avatar)** — ein KI-Sprecher hält/trägt das Produkt und spricht in die
Kamera. Stärker bei „reden über das Produkt", schwächer bei „laufend durch die Stadt".

## Tages-Workflow
1. Avatar-DNA 1× in Kling **Elements** speichern → „Berlin-Avatar".
2. Täglich: Produktfoto (von Amazon) hochladen → per **Kolors Try-On** dem Avatar zuweisen.
3. Prompt: *„[Avatar] läuft durch [Stadt], hält [Produkt], natürliches Licht, cinematic"*.
4. 5–15 Sek. Clip als `.mp4` rendern → nach `assets/avatars/` legen → in `journey.json`
   eintragen.

## Wichtiger Realitäts-Check
Amazon-Links lassen sich **nicht direkt in die Videodatei** einbetten. Die Verlinkung
passiert über die **Web-App drumherum** (dieses Projekt): Der Klick auf ein Produkt neben/
unter dem Avatar führt zum Amazon-Partnerlink. Für Social Media nutzt man zusätzlich
Link-in-Bio / Story-Links.

## Quellen
- Kling AI – Best AI Video Generator 2026: <https://kling.ai/blog/best-ai-video-generator-2026-kling-ai>
- Layer3Labs – Best AI Video Tools for Product Placement 2026: <https://www.layer3labs.io/guides/best-ai-video-tools-for-product-placement>
- Atlas Cloud – Consistent Characters & Lip-Sync: <https://www.atlascloud.ai/blog/guides/top-4-free-ai-video-generators-for-consistent-characters-lip-sync>
- D-ID – 15 Best AI Avatar Generators 2026: <https://www.d-id.com/blog/best-ai-avatar-generators/>
- Creatify – Best AI Avatar Generators: <https://creatify.ai/blog/best-ai-avatar-generators-and-tools>
