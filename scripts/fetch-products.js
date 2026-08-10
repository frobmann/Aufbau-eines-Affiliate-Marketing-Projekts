#!/usr/bin/env node
/*
 * fetch-products.js — Reichert data/journey.json mit Live-Daten aus der
 * Amazon Product Advertising API (PA-API 5.0) an: Titel, Bild-URL und Preis.
 *
 * Ohne externe Abhaengigkeiten (nur Node-Standardbibliothek: https, crypto, fs).
 * Die AWS-Signature-V4-Signierung ist unten selbst implementiert.
 *
 * Nutzung:
 *   1. .env.example nach .env kopieren und ausfuellen
 *   2. node scripts/fetch-products.js
 *
 * Verhalten:
 *   - Titel/Bild werden nur gesetzt, wenn im Produkt noch leer (deine Eingaben
 *     bleiben erhalten).
 *   - Preis wird immer aktualisiert und mit "priceAsOf" (Datum) versehen
 *     (PA-API-Bedingungen verlangen einen Stand-Hinweis bei Preisen).
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const crypto = require("crypto");

const ROOT = path.resolve(__dirname, "..");
const JOURNEY_PATH = path.join(ROOT, "data", "journey.json");

/* ----------------------------- .env laden ----------------------------- */
function loadEnv() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let val = m[2];
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(m[1] in process.env)) process.env[m[1]] = val;
  }
}

/* ----------------------- Marketplace-Konfiguration -------------------- */
const MARKETPLACES = {
  "amazon.de": { host: "webservices.amazon.de", region: "eu-west-1", marketplace: "www.amazon.de" },
  "amazon.com": { host: "webservices.amazon.com", region: "us-east-1", marketplace: "www.amazon.com" },
  "amazon.co.uk": { host: "webservices.amazon.co.uk", region: "eu-west-1", marketplace: "www.amazon.co.uk" },
  "amazon.fr": { host: "webservices.amazon.fr", region: "eu-west-1", marketplace: "www.amazon.fr" },
  "amazon.it": { host: "webservices.amazon.it", region: "eu-west-1", marketplace: "www.amazon.it" },
  "amazon.es": { host: "webservices.amazon.es", region: "eu-west-1", marketplace: "www.amazon.es" },
};

/* ------------------------ AWS Signature V4 ---------------------------- */
const SERVICE = "ProductAdvertisingAPI";
const ALGORITHM = "AWS4-HMAC-SHA256";

function sha256Hex(data) {
  return crypto.createHash("sha256").update(data, "utf8").digest("hex");
}
function hmac(key, data) {
  return crypto.createHmac("sha256", key).update(data, "utf8").digest();
}

function signRequest({ accessKey, secretKey, region, host, target, payload }) {
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, ""); // YYYYMMDDTHHMMSSZ
  const dateStamp = amzDate.slice(0, 8);
  const canonicalUri = "/paapi5/getitems";

  const headers = {
    "content-encoding": "amz-1.0",
    "content-type": "application/json; charset=utf-8",
    host: host,
    "x-amz-date": amzDate,
    "x-amz-target": target,
  };

  const signedHeaders = Object.keys(headers).sort().join(";");
  const canonicalHeaders = Object.keys(headers)
    .sort()
    .map((k) => `${k}:${headers[k]}\n`)
    .join("");

  const payloadHash = sha256Hex(payload);
  const canonicalRequest = [
    "POST",
    canonicalUri,
    "",
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const credentialScope = `${dateStamp}/${region}/${SERVICE}/aws4_request`;
  const stringToSign = [ALGORITHM, amzDate, credentialScope, sha256Hex(canonicalRequest)].join("\n");

  const kDate = hmac("AWS4" + secretKey, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, SERVICE);
  const kSigning = hmac(kService, "aws4_request");
  const signature = crypto.createHmac("sha256", kSigning).update(stringToSign, "utf8").digest("hex");

  const authorization =
    `${ALGORITHM} Credential=${accessKey}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return { ...headers, Authorization: authorization };
}

/* -------------------------- GetItems-Aufruf --------------------------- */
function getItems(asins, cfg) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      ItemIds: asins,
      Resources: ["ItemInfo.Title", "Images.Primary.Large", "Offers.Listings.Price"],
      PartnerTag: cfg.partnerTag,
      PartnerType: "Associates",
      Marketplace: cfg.marketplace,
    });

    const target = "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems";
    const signed = signRequest({
      accessKey: cfg.accessKey,
      secretKey: cfg.secretKey,
      region: cfg.region,
      host: cfg.host,
      target,
      payload,
    });

    const req = https.request(
      {
        method: "POST",
        host: cfg.host,
        path: "/paapi5/getitems",
        headers: { ...signed, "content-length": Buffer.byteLength(payload) },
      },
      (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => {
          let json;
          try {
            json = JSON.parse(body);
          } catch (e) {
            return reject(new Error(`Ungueltige Antwort (HTTP ${res.statusCode}): ${body.slice(0, 300)}`));
          }
          if (res.statusCode !== 200) {
            const msg = json.Errors ? json.Errors.map((e) => e.Message).join(" | ") : body.slice(0, 300);
            return reject(new Error(`PA-API HTTP ${res.statusCode}: ${msg}`));
          }
          resolve(json);
        });
      }
    );
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

/* ------------------------------ Helpers ------------------------------- */
function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function indexItems(result) {
  const map = new Map();
  const items = (result.ItemsResult && result.ItemsResult.Items) || [];
  for (const it of items) {
    map.set(it.ASIN, {
      title: it.ItemInfo && it.ItemInfo.Title && it.ItemInfo.Title.DisplayValue,
      image: it.Images && it.Images.Primary && it.Images.Primary.Large && it.Images.Primary.Large.URL,
      price:
        it.Offers &&
        it.Offers.Listings &&
        it.Offers.Listings[0] &&
        it.Offers.Listings[0].Price &&
        it.Offers.Listings[0].Price.DisplayAmount,
    });
  }
  return map;
}

/* -------------------------------- Main -------------------------------- */
async function main() {
  loadEnv();

  const accessKey = process.env.PAAPI_ACCESS_KEY;
  const secretKey = process.env.PAAPI_SECRET_KEY;
  const partnerTag = process.env.PAAPI_PARTNER_TAG;
  const domain = process.env.PAAPI_DOMAIN || "amazon.de";

  if (!accessKey || !secretKey || !partnerTag || /DEIN/.test(accessKey + partnerTag)) {
    console.error(
      "\n⚠️  Keine (gueltigen) PA-API-Zugangsdaten gefunden.\n" +
        "   Kopiere .env.example nach .env und trage deine Schluessel ein.\n" +
        "   Voraussetzung: Amazon-Partner-Account + PA-API-Zugang (siehe docs/paapi-setup.md).\n"
    );
    process.exit(1);
  }

  const mk = MARKETPLACES[domain];
  if (!mk) {
    console.error(`⚠️  Unbekannte Domain "${domain}". Unterstuetzt: ${Object.keys(MARKETPLACES).join(", ")}`);
    process.exit(1);
  }

  const cfg = { accessKey, secretKey, partnerTag, ...mk };

  const journey = JSON.parse(fs.readFileSync(JOURNEY_PATH, "utf8"));
  const products = [];
  for (const day of journey.days || []) {
    for (const p of day.products || []) {
      if (p.asin && p.asin.trim() && !/EXAMPLE/i.test(p.asin)) products.push(p);
    }
  }

  const asins = [...new Set(products.map((p) => p.asin.trim()))];
  if (asins.length === 0) {
    console.log("Keine echten ASINs in data/journey.json gefunden — nichts zu tun.");
    return;
  }

  console.log(`Frage ${asins.length} Produkt(e) bei ${mk.marketplace} ab …`);
  const dataMap = new Map();
  for (const batch of chunk(asins, 10)) {
    const res = await getItems(batch, cfg);
    for (const [asin, info] of indexItems(res)) dataMap.set(asin, info);
    if (res.Errors) for (const e of res.Errors) console.warn(`  ⚠️  ${e.Code}: ${e.Message}`);
  }

  const asOf = new Date().toLocaleDateString("de-DE");
  let updated = 0;
  for (const p of products) {
    const info = dataMap.get(p.asin.trim());
    if (!info) continue;
    if (info.title && (!p.name || p.name.trim() === "")) p.name = info.title;
    if (info.image && (!p.image || p.image.trim() === "")) p.image = info.image;
    if (info.price) {
      p.price = info.price;
      p.priceAsOf = asOf;
    }
    updated++;
  }

  fs.writeFileSync(JOURNEY_PATH, JSON.stringify(journey, null, 2) + "\n", "utf8");
  console.log(`✅ ${updated} Produkt(e) aktualisiert. data/journey.json geschrieben.`);
}

main().catch((err) => {
  console.error("❌ Fehler:", err.message);
  process.exit(1);
});
