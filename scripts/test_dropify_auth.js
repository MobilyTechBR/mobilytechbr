const {
  getDropifyAccessToken,
  isDropifyConfigured,
  isDropifyFreightConfigured,
  listDropifyProducts,
  normalizeDropifyProduct,
  normalizeProductArray,
  quoteDropifySupplierFreight
} = require("../lib/dropify");

async function main() {
  console.log(JSON.stringify({
    configured: isDropifyConfigured(),
    freightConfigured: isDropifyFreightConfigured()
  }, null, 2));

  await getDropifyAccessToken();
  const productsResponse = await listDropifyProducts({ page: 1, pageSize: 1 });
  const products = normalizeProductArray(productsResponse).map(normalizeDropifyProduct);
  console.log(JSON.stringify({
    auth: "ok",
    sampleProductCount: products.length,
    sampleProducts: products.map((product) => ({
      sku: product.sku,
      name: product.name,
      stockQuantity: product.stockQuantity,
      immediateShipment: product.immediateShipment
    }))
  }, null, 2));

  if (process.env.DROPIFY_TEST_SKU && process.env.DROPIFY_TEST_CEP && process.env.DROPIFY_FREIGHT_KEY) {
    const quoteProduct = {
      title: process.env.DROPIFY_TEST_TITLE || process.env.DROPIFY_TEST_SKU,
      dropify: { sku: process.env.DROPIFY_TEST_SKU },
      costPrice: process.env.DROPIFY_TEST_COST_BRL || 50,
      quantity: process.env.DROPIFY_TEST_QTY || 1,
      shipping: {
        provider: "dropify",
        heightCm: process.env.DROPIFY_TEST_HEIGHT_CM || 10,
        lengthCm: process.env.DROPIFY_TEST_LENGTH_CM || 16,
        widthCm: process.env.DROPIFY_TEST_WIDTH_CM || 12,
        weightKg: process.env.DROPIFY_TEST_WEIGHT_KG || 0.4
      }
    };
    const quotes = await quoteDropifySupplierFreight([quoteProduct], process.env.DROPIFY_TEST_CEP);
    console.log(JSON.stringify({
      freight: "ok",
      quoteCount: quotes.length,
      cheapest: quotes[0] ? {
        name: quotes[0].name,
        price: quotes[0].price,
        deliveryTime: quotes[0].deliveryTime
      } : null
    }, null, 2));
  }
}

main().catch((error) => {
  console.error(JSON.stringify({
    ok: false,
    error: error.message,
    code: error.code,
    statusCode: error.statusCode
  }, null, 2));
  process.exit(1);
});
