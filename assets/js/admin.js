/*
 * Avatar Journey – Admin-Editor (clientseitig)
 * --------------------------------------------
 * Lädt data/journey.json, bietet Formulare für Konfig/Tage/Produkte und
 * exportiert die fertige journey.json als Download. Kein Backend nötig.
 */

const DATA_URL = "data/journey.json";

/** Leeres Start-Gerüst, falls journey.json nicht ladbar ist. */
const EMPTY = {
  config: { brandName: "Avatar Journey", tagline: "", affiliateTag: "DEIN-TAG-21", amazonDomain: "amazon.de", startCity: "Berlin" },
  days: [],
};

let state = structuredClone(EMPTY);

/* ------------------------------- Utils -------------------------------- */
const $ = (sel, root = document) => root.querySelector(sel);
const el = (tag, props = {}, children = []) => {
  const node = document.createElement(tag);
  Object.assign(node, props);
  for (const c of [].concat(children)) if (c) node.append(c);
  return node;
};

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 1600);
}

function field(labelText, value, onInput, opts = {}) {
  const input = opts.textarea ? el("textarea") : el("input");
  input.value = value == null ? "" : value;
  if (opts.placeholder) input.placeholder = opts.placeholder;
  input.addEventListener("input", () => onInput(input.value));
  return el("label", { className: "field" }, [document.createTextNode(labelText), input]);
}

/* ------------------------------ Rendering ----------------------------- */
function renderConfig() {
  const c = state.config;
  const box = $("#config-fields");
  box.innerHTML = "";
  const set = (k) => (v) => { c[k] = v; refreshJson(); };
  box.append(
    field("Markenname", c.brandName, set("brandName")),
    field("Amazon-Partner-Tag", c.affiliateTag, set("affiliateTag"), { placeholder: "deinname-21" }),
    field("Tagline", c.tagline, set("tagline")),
    field("Amazon-Domain", c.amazonDomain, set("amazonDomain"), { placeholder: "amazon.de" })
  );
}

function renderProduct(day, dayIdx, prod, prodIdx) {
  const set = (k) => (v) => { prod[k] = v; refreshJson(); };
  const removeBtn = el("button", {
    className: "btn btn-sm btn-danger",
    textContent: "Produkt entfernen",
    onclick: () => { day.products.splice(prodIdx, 1); renderDays(); },
  });
  return el("div", { className: "product-row" }, [
    el("div", { className: "row-top" }, removeBtn),
    el("div", { className: "grid2" }, [
      field("Produktname", prod.name, set("name")),
      field("Preis (Anzeige)", prod.price, set("price"), { placeholder: "z. B. 49,99 €" }),
      field("ASIN", prod.asin, set("asin"), { placeholder: "B0..." }),
      field("Bild-Pfad/URL", prod.image, set("image"), { placeholder: "assets/products/..." }),
      field("Fertiger Amazon-Link (optional)", prod.url, set("url")),
      field("Notiz", prod.note, set("note")),
    ]),
  ]);
}

function renderDay(day, dayIdx) {
  const set = (k) => (v) => { day[k] = v; refreshJson(); };

  const removeDay = el("button", {
    className: "btn btn-sm btn-danger",
    textContent: "Tag löschen",
    onclick: () => { state.days.splice(dayIdx, 1); renderDays(); },
  });

  const card = el("div", { className: "day-card" }, [
    el("div", { className: "day-top" }, [
      el("span", { className: "day-title", textContent: `Tag ${day.day ?? dayIdx + 1} — ${day.city || "(Stadt)"}` }),
      removeDay,
    ]),
    el("div", { className: "grid2" }, [
      field("Tag-Nr.", day.day, (v) => { day.day = Number(v) || v; refreshJson(); }),
      field("Datum (YYYY-MM-DD)", day.date, set("date"), { placeholder: "2026-08-11" }),
      field("Stadt", day.city, set("city")),
      field("Land", day.country, set("country")),
      field("Sehenswürdigkeit", day.landmark, set("landmark")),
      field("Avatar-Medium (mp4/jpg)", day.avatarMedia, set("avatarMedia"), { placeholder: "assets/avatars/..." }),
      field("Avatar-Poster (jpg)", day.avatarPoster, set("avatarPoster")),
      field("Caption", day.caption, set("caption"), { textarea: true }),
    ]),
  ]);

  const prodHead = el("div", { className: "products-head" }, [
    el("h4", { textContent: "Produkte" }),
    el("button", {
      className: "btn btn-sm",
      textContent: "+ Produkt",
      onclick: () => { (day.products ||= []).push({ name: "", image: "", price: "", note: "", asin: "", url: "" }); renderDays(); },
    }),
  ]);
  card.append(prodHead);
  (day.products || []).forEach((p, i) => card.append(renderProduct(day, dayIdx, p, i)));
  return card;
}

function renderDays() {
  const box = $("#days-container");
  box.innerHTML = "";
  if (!state.days.length) box.append(el("p", { className: "hint", textContent: "Noch keine Tage. Füge einen hinzu." }));
  state.days.forEach((d, i) => box.append(renderDay(d, i)));
  refreshJson();
}

function refreshJson() {
  $("#json-preview").textContent = JSON.stringify(state, null, 2);
}

function renderAll() {
  renderConfig();
  renderDays();
}

/* ------------------------------ Actions ------------------------------- */
function addDay() {
  const nextNum = state.days.reduce((m, d) => Math.max(m, Number(d.day) || 0), 0) + 1;
  state.days.push({
    day: nextNum, date: "", city: "", country: "", landmark: "",
    avatarMedia: "", avatarPoster: "", caption: "", products: [],
  });
  renderDays();
}

function download() {
  const blob = new Blob([JSON.stringify(state, null, 2) + "\n"], { type: "application/json" });
  const a = el("a", { href: URL.createObjectURL(blob), download: "journey.json" });
  document.body.append(a);
  a.click();
  a.remove();
  toast("journey.json heruntergeladen → in data/ ablegen");
}

async function copyJson() {
  try {
    await navigator.clipboard.writeText(JSON.stringify(state, null, 2));
    toast("JSON in Zwischenablage kopiert");
  } catch {
    toast("Kopieren nicht möglich — bitte manuell aus der Vorschau");
  }
}

async function load() {
  try {
    const res = await fetch(DATA_URL, { cache: "no-store" });
    if (!res.ok) throw new Error();
    state = await res.json();
    if (!state.config) state.config = structuredClone(EMPTY.config);
    if (!Array.isArray(state.days)) state.days = [];
    toast("Geladen");
  } catch {
    state = structuredClone(EMPTY);
    toast("Konnte journey.json nicht laden — leeres Gerüst");
  }
  renderAll();
}

/* ------------------------------- Init --------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  $("#btn-download").addEventListener("click", download);
  $("#btn-copy").addEventListener("click", copyJson);
  $("#btn-reload").addEventListener("click", load);
  document.querySelector('[data-action="add-day"]').addEventListener("click", addDay);
  load();
});
