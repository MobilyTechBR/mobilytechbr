function parseEnvNumber(name, fallback) {
  const raw = String(process.env[name] || "").trim();
  if (!raw) return fallback;
  const value = Number(raw.replace(",", "."));
  return Number.isFinite(value) ? value : fallback;
}

function toMoney(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function grossUp(netValue, percent, fixed) {
  const net = Number(netValue || 0);
  const rate = Math.max(0, Number(percent || 0)) / 100;
  const fixedFee = Math.max(0, Number(fixed || 0));
  if (!Number.isFinite(net) || net <= 0 || rate >= 1) {
    return { gross: toMoney(net), fee: 0 };
  }

  const gross = Math.ceil(((net + fixedFee) / (1 - rate)) * 100) / 100;
  return {
    gross: toMoney(gross),
    fee: toMoney(Math.max(0, gross - net))
  };
}

function isGrossUpEnabled(prefix) {
  const globalValue = String(process.env.PAYMENT_GROSS_UP_ENABLED || "true").toLowerCase();
  const scopedValue = String(process.env[`${prefix}_GROSS_UP_ENABLED`] || globalValue).toLowerCase();
  return scopedValue !== "false";
}

function abacateCheckoutGrossUp(netValue) {
  if (!isGrossUpEnabled("ABACATE_PAY")) {
    return { gross: toMoney(netValue), fee: 0 };
  }

  return grossUp(
    netValue,
    parseEnvNumber("ABACATE_PAY_CHECKOUT_FEE_PERCENT", 4.5),
    parseEnvNumber("ABACATE_PAY_CHECKOUT_FIXED_FEE_BRL", 0.6)
  );
}

function abacatePixGrossUp(netValue) {
  if (!isGrossUpEnabled("ABACATE_PAY")) {
    return { gross: toMoney(netValue), fee: 0 };
  }

  return grossUp(
    netValue,
    parseEnvNumber("ABACATE_PAY_PIX_FEE_PERCENT", 0),
    parseEnvNumber("ABACATE_PAY_PIX_FIXED_FEE_BRL", 0.8)
  );
}

module.exports = {
  abacateCheckoutGrossUp,
  abacatePixGrossUp,
  grossUp
};
