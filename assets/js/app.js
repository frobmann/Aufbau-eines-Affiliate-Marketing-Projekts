/*
 * Avatar Journey – App-Logik
 * ---------------------------------
 * Lädt data/journey.json, wählt den aktuellen Tag und rendert:
 *  - den Avatar (Video oder Bild)
 *  - die Produkt-Karten mit korrekt gebauten Amazon-Partnerlinks
 *  - die Reise-Timeline (bisher besuchte Städte)
 *
 * Amazon-Partnerlinks werden mit rel="sponsored nofollow noopener" versehen
 * (Pflicht laut Amazon PartnerNet + Werbekennzeichnung).
 */

const DATA_URL = "data/journey.json";

/** Baut einen gültigen Amazon-Partnerlink. */
function buildAmazonUrl(product, config) {
  const domain = config.amazonDomain || "amazon.de";
  const tag = config.affiliateTag || "";
  let base;

  if (product.url && product.url.trim() !== "") {
    base = product.url.trim();
  } else if (product.asin && product.asin.trim() !== "") {
    base = `https://www.${domain}/dp/${product.asin.trim()}`;
  } else {
    return null; // Kein Ziel hinterlegt
  }

  if (!tag) return base;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}tag=${encodeURIComponent(tag)}`;
}

/** Wählt den anzuzeigenden Tag: den mit dem höchsten Datum <= heute, sonst den letzten. */
function pickCurrentDay(days) {
  if (!days || days.length === 0) return null;
  const today = new Date().toISOString().slice(0, 10);
  const past = days
    .filter((d) => d.date && d.date <= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  if (past.length > 0) return past[past.length - 1];
  return [...days].sort((a, b) => (a.day || 0) - (b.day || 0)).pop();
}

/** Rendert den Avatar-Bereich (Video bevorzugt, sonst Bild). */
function renderAvatar(day) {
  const el = document.getElementById("avatar-media");
  el.innerHTML = "";

  const isVideo = day.avatarMedia && day.avatarMedia.toLowerCase().endsWith(".mp4");
  if (isVideo) {
    const video = document.createElement("video");
    video.src = day.avatarMedia;
    if (day.avatarPoster) video.poster = day.avatarPoster;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("aria-label", `Avatar in ${day.city}`);
    el.appendChild(video);
  } else {
    const img = document.createElement("img");
    img.src = day.avatarMedia || day.avatarPoster || "";
    img.alt = `Avatar in ${day.city}`;
    img.loading = "eager";
    el.appendChild(img);
  }
}

/** Erzeugt eine Produkt-Karte. */
function productCard(product, config) {
  const url = buildAmazonUrl(product, config);

  const card = document.createElement("article");
  card.className = "product-card";

  const media = document.createElement("div");
  media.className = "product-media";
  const img = document.createElement("img");
  img.src = product.image || "";
  img.alt = product.name || "Produkt";
  img.loading = "lazy";
  img.onerror = () => {
    media.classList.add("is-empty");
    img.remove();
    media.textContent = "Produktbild hier einfügen";
  };
  media.appendChild(img);

  const body = document.createElement("div");
  body.className = "product-body";

  const title = document.createElement("h3");
  title.textContent = product.name || "Unbenanntes Produkt";

  const note = document.createElement("p");
  note.className = "product-note";
  note.textContent = product.note || "";

  const footer = document.createElement("div");
  footer.className = "product-footer";

  const price = document.createElement("span");
  price.className = "product-price";
  price.textContent = product.price || "";
  if (product.price && product.priceAsOf) {
    price.title = `Preis-Stand: ${product.priceAsOf}`;
    const asOf = document.createElement("small");
    asOf.className = "price-asof";
    asOf.textContent = `Stand ${product.priceAsOf}`;
    price.appendChild(asOf);
  }

  const cta = document.createElement("a");
  cta.className = "product-cta";
  cta.textContent = "Auf Amazon ansehen";
  if (url) {
    cta.href = url;
    cta.target = "_blank";
    cta.rel = "sponsored nofollow noopener";
  } else {
    cta.classList.add("is-disabled");
    cta.setAttribute("aria-disabled", "true");
    cta.textContent = "Link folgt";
  }

  footer.append(price, cta);
  body.append(title, note, footer);
  card.append(media, body);
  return card;
}

/** Rendert alle Produkte des Tages. */
function renderProducts(day, config) {
  const grid = document.getElementById("products-grid");
  grid.innerHTML = "";
  (day.products || []).forEach((p) => grid.appendChild(productCard(p, config)));
  if ((day.products || []).length === 0) {
    grid.innerHTML = '<p class="empty">Heute noch keine Produkte hinterlegt.</p>';
  }
}

/** Rendert die Reise-Timeline. */
function renderTimeline(days, currentDay) {
  const list = document.getElementById("timeline-list");
  list.innerHTML = "";
  [...days]
    .sort((a, b) => (a.day || 0) - (b.day || 0))
    .forEach((d) => {
      const li = document.createElement("li");
      li.className = "timeline-item";
      if (currentDay && d.day === currentDay.day) li.classList.add("is-current");
      li.innerHTML = `<span class="tl-day">Tag ${d.day}</span><span class="tl-city">${d.city}</span>`;
      list.appendChild(li);
    });
}

/** Setzt die Kopf-Infos (Stadt, Datum, Caption). */
function renderHeader(day, config) {
  document.getElementById("brand-name").textContent = config.brandName || "Avatar Journey";
  document.getElementById("brand-tagline").textContent = config.tagline || "";
  document.getElementById("day-badge").textContent = `Tag ${day.day}`;
  document.getElementById("city-name").textContent = day.city;
  const meta = [day.landmark, day.country].filter(Boolean).join(" · ");
  document.getElementById("city-meta").textContent = meta;
  document.getElementById("day-caption").textContent = day.caption || "";
  document.title = `${config.brandName} — Tag ${day.day}: ${day.city}`;
}

async function init() {
  try {
    const res = await fetch(DATA_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const config = data.config || {};
    const days = data.days || [];
    const current = pickCurrentDay(days);

    if (!current) {
      document.getElementById("app").innerHTML =
        '<p class="empty">Noch keine Reisetage in data/journey.json hinterlegt.</p>';
      return;
    }

    renderHeader(current, config);
    renderAvatar(current);
    renderProducts(current, config);
    renderTimeline(days, current);

    if (!config.affiliateTag || config.affiliateTag === "DEIN-TAG-21") {
      document.getElementById("tag-warning").hidden = false;
    }
  } catch (err) {
    console.error("Fehler beim Laden der Reise:", err);
    document.getElementById("app").innerHTML =
      `<p class="empty">Konnte data/journey.json nicht laden (${err.message}).<br>
       Tipp: Die Seite über einen lokalen Server öffnen (siehe README).</p>`;
  }
}

document.addEventListener("DOMContentLoaded", init);
