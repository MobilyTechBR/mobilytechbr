#!/usr/bin/env node

const fs = require("fs");

const file = process.argv.slice(2).find((item) => !item.startsWith("--")) || "data/products.json";
const minimum = Number(process.argv.find((item) => item.startsWith("--minimum="))?.split("=")[1] || 100);
const data = JSON.parse(fs.readFileSync(file, "utf8"));
const items = data.filter((item) => item.category === "dropshipping" && item.active !== false);

function money(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function audit(item) {
  const errors = [];
  const cost = money(item.costPrice);
  const price = money(item.price);
  if (item.checkoutEnabled !== true) errors.push("checkoutEnabled != true");
  if (!item.manualFulfillment) errors.push("manualFulfillment ausente");
  if (!item.requireExactSupplierFreight) errors.push("frete exato nao exigido");
  if (!item.image && !item.cutout) errors.push("sem imagem");
  if (!item.supplierReferenceUrl && !item.sourceNotes?.supplierReferenceUrl) errors.push("sem link de referencia");
  if (!item.cj?.pid) errors.push("sem cj.pid");
  if (!item.cj?.vid && !item.cj?.sku) errors.push("sem cj.vid/sku");
  if (!item.cj?.priceValidatedAt) errors.push("sem validacao de preco");
  if (!item.cj?.freightValidatedAt) errors.push("sem validacao de frete");
  if (item.shipping?.liveQuoteReady !== true) errors.push("sem liveQuoteReady");
  if (!money(item.shipping?.sampleQuoteMinBrl)) errors.push("sem frete teste BRL");
  if (!cost) errors.push("sem custo");
  if (!price) errors.push("sem preco");
  if (price <= cost) errors.push("preco menor/igual ao custo");
  return errors;
}

const problems = items
  .map((item) => ({ id: item.id, title: item.title, errors: audit(item) }))
  .filter((entry) => entry.errors.length);

const summary = {
  file,
  minimum,
  dropshippingActive: items.length,
  valid: Math.max(0, items.length - problems.length),
  problems: problems.slice(0, 50)
};

console.log(JSON.stringify(summary, null, 2));

if (items.length < minimum || problems.length) {
  process.exitCode = 1;
}
