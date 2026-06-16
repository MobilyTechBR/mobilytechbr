const LOCAL_PROMOTIONS = [
  {
    code: "MOBMEN",
    percent: 6,
    eligibleCategories: ["pc"],
    label: "6% OFF em PCs revisados selecionados"
  }
];

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

function discountForCheckoutItems(checkoutItems = [], payloadCoupon) {
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

module.exports = {
  LOCAL_PROMOTIONS,
  discountForCheckoutItems,
  normalizeCouponCode
};
