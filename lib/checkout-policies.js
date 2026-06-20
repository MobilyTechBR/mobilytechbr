const CHECKOUT_POLICY_VERSION = "2026-06-20-dropshipping-transparency";

function requestClientIp(request) {
  const forwarded = String(request?.headers?.["x-forwarded-for"] || "").split(",")[0].trim();
  return forwarded || request?.socket?.remoteAddress || "";
}

function assertPolicyAcceptance(payload = {}) {
  const acceptance = payload.acceptedPolicies || payload.policyAcceptance || {};
  if (acceptance.terms !== true || acceptance.privacy !== true) {
    const error = new Error("Aceite os Termos de Compra e a Politica de Privacidade antes de finalizar.");
    error.statusCode = 400;
    error.code = "POLICY_ACCEPTANCE_REQUIRED";
    throw error;
  }
  return {
    terms: true,
    privacy: true,
    supplierDisclosure: acceptance.supplierDisclosure === true,
    version: String(acceptance.version || CHECKOUT_POLICY_VERSION),
    acceptedAt: String(acceptance.acceptedAt || new Date().toISOString())
  };
}

function assertSupplierDisclosure(payload = {}, required = false) {
  const acceptance = payload.acceptedPolicies || payload.policyAcceptance || {};
  if (required && acceptance.supplierDisclosure !== true) {
    const error = new Error("Confirme o aviso de envio direto por fornecedor parceiro antes de finalizar.");
    error.statusCode = 400;
    error.code = "SUPPLIER_DISCLOSURE_REQUIRED";
    throw error;
  }
  return acceptance.supplierDisclosure === true;
}

module.exports = {
  CHECKOUT_POLICY_VERSION,
  assertPolicyAcceptance,
  assertSupplierDisclosure,
  requestClientIp
};
