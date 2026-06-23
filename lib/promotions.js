const fs = require("fs");
const path = require("path");

const LOCAL_PROMOTIONS = [
  {
    code: "MOBMEN",
    percent: 6,
    eligibleCategories: ["pc"],
    label: "6% OFF em PCs revisados selecionados"
  }
];

const DEFAULT_CHECKOUT_OFFERS = {
  combo: {
    enabled: true,
    rules: [
      {
        code: "COMBO5",
        label: "Combo MobilyTech: 5% OFF em Nossos produtos",
        percent: 5,
        cap: 35,
        minItems: 3,
        minSubtotal: 150,
        match: "any"
      },
      {
        code: "COMBO3",
        label: "Combo MobilyTech: 3% OFF em Nossos produtos",
        percent: 3,
        cap: 20,
        minItems: 2,
        minSubtotal: 0,
        match: "all"
      }
    ]
  }
};

function normalizeCouponCode(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")
    .toUpperCase();
}

function toMoney(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function itemCategory(item) {
  return String(item?.product?.category || item?.product?.type || "").toLowerCase();
}

function isComboEligibleItem(item) {
  const product = item?.product || {};
  const category = itemCategory(item);
  return Boolean(
    product.madeToOrder === true
    || category === "sob-encomenda"
    || category === "sob encomenda"
    || category === "encomenda"
    || category === "dropshipping"
  );
}

function itemTotal(item) {
  const swapsTotal = (item.swaps || []).reduce((sum, swap) => sum + Number(swap.price || 0), 0);
  const quantity = Math.max(1, Number(item.quantity || 1));
  return (Number(item.unitPrice || 0) + swapsTotal) * quantity;
}

function promotionFromPayload(payloadCoupon) {
  const code = normalizeCouponCode(payloadCoupon?.code || payloadCoupon);
  if (!code) return null;
  return LOCAL_PROMOTIONS.find((promotion) => promotion.code === code) || null;
}

function loadCheckoutOffers() {
  try {
    const file = path.join(process.cwd(), "data", "checkout-offers.json");
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return DEFAULT_CHECKOUT_OFFERS;
  }
}

function comboOfferRules() {
  const config = loadCheckoutOffers().combo || DEFAULT_CHECKOUT_OFFERS.combo;
  if (config.enabled === false) return [];
  return (Array.isArray(config.rules) ? config.rules : DEFAULT_CHECKOUT_OFFERS.combo.rules)
    .map((rule) => ({
      ...rule,
      percent: Number(rule.percent || 0),
      cap: Number(rule.cap || 0),
      minItems: Number(rule.minItems || 0),
      minSubtotal: Number(rule.minSubtotal || 0)
    }))
    .filter((rule) => rule.code && rule.percent > 0)
    .sort((a, b) => b.percent - a.percent);
}

function comboRuleMatches(rule, itemCount, eligibleTotal) {
  const itemOk = !rule.minItems || itemCount >= rule.minItems;
  const subtotalOk = !rule.minSubtotal || eligibleTotal >= rule.minSubtotal;
  const hasBothCriteria = Boolean(rule.minItems && rule.minSubtotal);
  if (String(rule.match || "").toLowerCase() === "any" && hasBothCriteria) {
    return itemOk || subtotalOk;
  }
  return itemOk && subtotalOk;
}

function couponDiscountForCheckoutItems(checkoutItems = [], payloadCoupon) {
  const promotion = promotionFromPayload(payloadCoupon);
  if (!promotion) {
    return {
      code: "",
      label: "",
      percent: 0,
      discount: 0,
      eligibleTotal: 0
    };
  }

  const eligibleTotal = checkoutItems.reduce((sum, item) => {
    if (!promotion.eligibleCategories.includes(itemCategory(item))) return sum;
    return sum + itemTotal(item);
  }, 0);

  return {
    code: promotion.code,
    label: promotion.label,
    percent: promotion.percent,
    discount: toMoney(eligibleTotal * Number(promotion.percent || 0) / 100),
    eligibleTotal: toMoney(eligibleTotal)
  };
}

function comboDiscountForCheckoutItems(checkoutItems = []) {
  const eligibleItems = checkoutItems.filter(isComboEligibleItem);
  const itemCount = eligibleItems.reduce((sum, item) => sum + Math.max(1, Number(item.quantity || 1)), 0);
  const eligibleTotal = eligibleItems.reduce((sum, item) => sum + itemTotal(item), 0);
  const rule = comboOfferRules().find((candidate) => comboRuleMatches(candidate, itemCount, eligibleTotal));

  if (!rule) {
    return {
      code: "",
      label: "",
      percent: 0,
      discount: 0,
      eligibleTotal: toMoney(eligibleTotal)
    };
  }

  return {
    code: rule.code,
    label: rule.label,
    percent: rule.percent,
    discount: toMoney(Math.min(eligibleTotal * rule.percent / 100, rule.cap)),
    eligibleTotal: toMoney(eligibleTotal)
  };
}

function discountForCheckoutItems(checkoutItems = [], payloadCoupon, options = {}) {
  const coupon = couponDiscountForCheckoutItems(checkoutItems, payloadCoupon);
  const combo = options.autoCombo ? comboDiscountForCheckoutItems(checkoutItems) : {
    code: "",
    label: "",
    percent: 0,
    discount: 0,
    eligibleTotal: 0
  };
  const discounts = [coupon, combo].filter((item) => Number(item.discount || 0) > 0);

  return {
    code: discounts.map((item) => item.code).filter(Boolean).join("+"),
    label: discounts.map((item) => item.label).filter(Boolean).join(" | "),
    percent: discounts.length === 1 ? discounts[0].percent : 0,
    discount: toMoney(discounts.reduce((sum, item) => sum + Number(item.discount || 0), 0)),
    eligibleTotal: toMoney(discounts.reduce((sum, item) => sum + Number(item.eligibleTotal || 0), 0)),
    discounts
  };
}

module.exports = {
  LOCAL_PROMOTIONS,
  comboDiscountForCheckoutItems,
  discountForCheckoutItems,
  normalizeCouponCode
};
