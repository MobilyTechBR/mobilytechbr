/*
  MobilyTech BR - Pos-venda por Google Apps Script

  Como usar:
  1. Crie uma planilha no Google Sheets.
  2. Abra Extensoes > Apps Script e cole este arquivo.
  3. Preencha SPREADSHEET_ID e rode setupMobilyTechPostSale().
  4. Publique como Web App e use a URL em ORDER_NOTIFICATION_ENDPOINT na Vercel.
*/

const MOBILYTECH = {
  SPREADSHEET_ID: "COLE_AQUI_O_ID_DA_PLANILHA",
  ORDERS_SHEET: "Pedidos",
  SETTINGS_SHEET: "Configuracoes",
  PRICE_REVIEW_SHEET: "Revisao de precos",
  NEW_LISTINGS_SHEET: "Novos anuncios",
  SITE_URL: "https://mobilytechbr.vercel.app",
  SETTINGS_URL: "https://mobilytechbr.vercel.app/data/automation-settings.json",
  LOGO_URL: "https://mobilytechbr.vercel.app/assets/mobilytech-logo.png",
  SELLER_EMAIL: "mobilytechbr@gmail.com",
  WHATSAPP_URL: "https://wa.me/5511954801967?text=Ola%2C%20tenho%20uma%20duvida%20sobre%20meu%20pedido%20MobilyTech%20BR."
};

const ORDER_HEADERS = [
  "PedidoID",
  "Status",
  "Plataforma",
  "ClienteNome",
  "ClienteEmail",
  "ClienteTelefone",
  "Produto",
  "Opcionais",
  "ValorPago",
  "ModoEntrega",
  "Transportadora",
  "ServicoFrete",
  "PrecoFrete",
  "Cep",
  "Endereco",
  "LinkConfirmarEtiqueta",
  "DecisaoEtiqueta",
  "CodigoRastreio",
  "LinkRastreio",
  "EmailClienteConfirmacaoEnviado",
  "EmailVendedorVendaEnviado",
  "EmailClienteDespachoEnviado",
  "EmailClienteEntregaEnviado",
  "ReembolsoManual",
  "AtualizadoEm"
];

const PRICE_HEADERS = [
  "ProdutoID",
  "TituloSite",
  "PrecoSite",
  "ImagemProduto",
  "LinkFacebook",
  "LinkOLX",
  "PrecoEncontrado",
  "PrecoEncontradoNumero",
  "Fonte",
  "Confianca",
  "TipoMudanca",
  "AcaoSugerida",
  "AprovadoParaAplicar",
  "Observacao",
  "ProcessadorOK",
  "MemoriaOK",
  "PlacaVideoOK",
  "ArmazenamentoOK",
  "FonteOK",
  "DetalhesDaComparacao",
  "MudancaHash",
  "StatusRevisao",
  "EmailRevisaoEnviadoEm",
  "EmailAutoAplicadoEnviadoEm",
  "LinkOLXCandidato",
  "LinkOLXHash",
  "StatusLinkOLX",
  "EmailLinkOLXEnviadoEm",
  "PrecoAnterior",
  "PrecoNovoAplicado",
  "AtivoAnterior",
  "AtivoNovoAplicado",
  "AplicadoEm",
  "AtualizadoEm"
];

const NEW_LISTING_HEADERS = [
  "LinkFacebook",
  "TituloDetectado",
  "PrecoDetectado",
  "ProdutoIDGerado",
  "Processador",
  "Memoria",
  "PlacaVideo",
  "Fonte",
  "Armazenamento",
  "Descricao",
  "MudancaHash",
  "Status",
  "EmailEnviadoEm",
  "CriadoEm",
  "AtualizadoEm",
  "Origem",
  "LinkOLX",
  "Categoria",
  "Marca",
  "Modelo",
  "Tipo",
  "Formato",
  "Interface",
  "Potencia",
  "Certificacao",
  "Conectores"
];

function setupMobilyTechPostSale() {
  const ss = spreadsheet_();
  ensureSheet_(ss, MOBILYTECH.ORDERS_SHEET, ORDER_HEADERS);
  const settings = ensureSheet_(ss, MOBILYTECH.SETTINGS_SHEET, ["Chave", "Valor", "Observacao"]);
  seedSettings_(settings);
  ensureSheet_(ss, MOBILYTECH.PRICE_REVIEW_SHEET, PRICE_HEADERS);
  ensureSheet_(ss, MOBILYTECH.NEW_LISTINGS_SHEET, NEW_LISTING_HEADERS);
  installTrigger_("processMobilyTechAutomations", 5);
}

function processMobilyTechAutomations() {
  const settings = mergedSettings_();
  if (settingBool_(settings.postSaleEmailsEnabled, true)) {
    processPostSaleQueue_(settings);
  }
  if (settingBool_(settings.marketplacePriceSyncEnabled, false) && shouldRunMarketplacePriceReview_(settings)) {
    runMarketplacePriceReview_(settings);
  }
}

function doPost(e) {
  const payload = parseIncomingPayload_(e);
  const row = upsertOrder_(payload);
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, row }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const action = String(e.parameter.action || "");
  if (action === "deny-label") return denyLabel_(e.parameter.order, e.parameter.token);
  if (action === "approve-price") return approveMarketplaceReview_(e.parameter.product, e.parameter.hash, e.parameter.token);
  if (action === "reject-price") return rejectMarketplaceReview_(e.parameter.product, e.parameter.hash, e.parameter.token);
  if (action === "revert-price") return revertMarketplaceAutoChange_(e.parameter.product, e.parameter.hash, e.parameter.token);
  if (action === "approve-olx-link") return approveOlxLinkReview_(e.parameter.product, e.parameter.hash, e.parameter.token);
  if (action === "reject-olx-link") return rejectOlxLinkReview_(e.parameter.product, e.parameter.hash, e.parameter.token);
  return HtmlService.createHtmlOutput("MobilyTech BR automacoes ativas.");
}

function processPostSaleQueue_(settings) {
  const sheet = ordersSheet_();
  const rows = readRows_(sheet);
  rows.forEach(({ row, values }) => {
    const status = String(values.Status || "").toUpperCase();
    if (status === "PAGO") {
      if (!values.EmailClienteConfirmacaoEnviado && values.ClienteEmail) {
        sendCustomerConfirmation_(values);
        sheet.getRange(row, col_("EmailClienteConfirmacaoEnviado")).setValue(new Date());
      }
      if (settingBool_(settings.sellerNotificationsEnabled, true) && !values.EmailVendedorVendaEnviado) {
        sendSellerSaleAlert_(values, settings);
        sheet.getRange(row, col_("EmailVendedorVendaEnviado")).setValue(new Date());
      }
    }

    if (status === "DESPACHADO" && values.CodigoRastreio && !values.EmailClienteDespachoEnviado && values.ClienteEmail) {
      sendCustomerTracking_(values);
      sheet.getRange(row, col_("EmailClienteDespachoEnviado")).setValue(new Date());
    }

    if (status === "ENTREGUE" && !values.EmailClienteEntregaEnviado && values.ClienteEmail) {
      sendCustomerDelivered_(values);
      sheet.getRange(row, col_("EmailClienteEntregaEnviado")).setValue(new Date());
    }
  });
}

function sendCustomerConfirmation_(order) {
  const subject = "Compra confirmada - MobilyTech BR";
  const html = emailShell_({
    preheader: "Recebemos seu pedido e vamos preparar tudo com cuidado.",
    title: "Compra confirmada!",
    intro: `Ola, ${escapeHtml_(order.ClienteNome || "tudo bem")}! A MobilyTech BR agradece sua compra. Vamos preparar o seu pedido para ele chegar prontinho para uso!`,
    blocks: [
      detailBlock_("Resumo do pedido", [
        ["Produto", order.Produto],
        ["Opcionais", order.Opcionais || "Nenhum"],
        ["Valor pago", formatMoneyText_(order.ValorPago)],
        ["Entrega", deliverySummary_(order)]
      ]),
      textBlock_("Proximos passos", "O seu PC sera despachado o mais breve possivel. Assim que for despachado, sera enviado um codigo de rastreio para que voce possa acompanha-lo durante o envio. Seguimos a disposicao para qualquer duvida que voce tiver.")
    ],
    ctaLabel: "Falar com a MobilyTech BR",
    ctaUrl: MOBILYTECH.WHATSAPP_URL
  });
  GmailApp.sendEmail(order.ClienteEmail, subject, "Sua compra foi confirmada pela MobilyTech BR.", { htmlBody: html, name: "MobilyTech BR" });
}

function sendSellerSaleAlert_(order, settings) {
  const sellerEmail = settings.sellerEmail || MOBILYTECH.SELLER_EMAIL;
  const subject = "Parabens, voce vendeu no site - MobilyTechBR";
  const denyUrl = buildActionUrl_("deny-label", order.PedidoID);
  const labelUrl = order.LinkConfirmarEtiqueta || "";
  const actionHtml = order.ModoEntrega === "shipping"
    ? `<p style="margin:18px 0 0"><a href="${labelUrl}" style="${buttonStyle_()}">Confirmar etiqueta</a><a href="${denyUrl}" style="${buttonStyle_("secondary")}">Negar etiqueta</a></p>`
    : "<p style='margin:18px 0 0;color:#bcd4df;font-weight:700'>Retirada local selecionada. Combine o horario com o cliente.</p>";

  const html = emailShell_({
    preheader: "Nova venda confirmada no site.",
    title: "Parabens, voce vendeu no site!",
    intro: "Venda confirmada. Confira os dados abaixo antes de preparar o pedido.",
    blocks: [
      detailBlock_("Pedido", [
        ["Produto", order.Produto],
        ["Opcionais", order.Opcionais || "Nenhum"],
        ["Valor pago", formatMoneyText_(order.ValorPago)],
        ["Plataforma", order.Plataforma]
      ]),
      detailBlock_("Cliente e entrega", [
        ["Cliente", order.ClienteNome],
        ["Email", order.ClienteEmail],
        ["Telefone", order.ClienteTelefone],
        ["Entrega", deliverySummary_(order)],
        ["Endereco", order.Endereco]
      ]),
      actionHtml
    ]
  });
  GmailApp.sendEmail(sellerEmail, subject, "Nova venda confirmada no site MobilyTechBR.", { htmlBody: html, name: "MobilyTech BR" });
}

function sendCustomerTracking_(order) {
  const trackUrl = order.LinkRastreio || `https://www2.correios.com.br/sistemas/rastreamento/default.cfm?objetos=${encodeURIComponent(order.CodigoRastreio)}`;
  const html = emailShell_({
    preheader: "Seu pedido foi despachado.",
    title: "Seu PC ja foi despachado!",
    intro: "Seu pedido saiu para envio. Agora voce pode acompanhar o trajeto pelo codigo de rastreamento.",
    blocks: [
      detailBlock_("Rastreamento", [
        ["Codigo", order.CodigoRastreio],
        ["Transportadora", order.Transportadora || "Correios"],
        ["Produto", order.Produto]
      ])
    ],
    ctaLabel: "Acompanhar pedido",
    ctaUrl: trackUrl
  });
  GmailApp.sendEmail(order.ClienteEmail, "Pedido despachado - MobilyTech BR", "Seu pedido foi despachado.", { htmlBody: html, name: "MobilyTech BR" });
}

function sendCustomerDelivered_(order) {
  const html = emailShell_({
    preheader: "Pedido entregue. Conte com a gente no pos-venda.",
    title: "Seu pedido chegou!",
    intro: "Tomara que voce curta bastante o PC. Se precisar de ajuda com instalacao, configuracao basica ou qualquer duvida inicial, chama a MobilyTech BR.",
    blocks: [
      textBlock_("Obrigado pela confianca", "Depois de testar tudo, se puder deixar uma avaliacao, isso ajuda muito outras pessoas a comprarem com seguranca tambem.")
    ],
    ctaLabel: "Falar no WhatsApp",
    ctaUrl: MOBILYTECH.WHATSAPP_URL
  });
  GmailApp.sendEmail(order.ClienteEmail, "Pedido entregue - MobilyTech BR", "Seu pedido foi entregue.", { htmlBody: html, name: "MobilyTech BR" });
}

function runMarketplacePriceReview_(settings) {
  const mode = String(settings.marketplacePriceSyncMode || "review").toLowerCase();
  const sheet = spreadsheet_().getSheetByName(MOBILYTECH.PRICE_REVIEW_SHEET);
  const products = fetchSiteProducts_();
  const allProducts = fetchSiteProducts_(true);
  if (!products.length) return;

  const existing = readRows_(sheet);
  const byId = Object.fromEntries(existing.map((item) => [String(item.values.ProdutoID || ""), item]));
  const threshold = Math.max(95, Number(settings.marketplacePriceSyncHighConfidenceThreshold || 95));
  const manualApproval = settingBool_(settings.marketplacePriceSyncRequireManualApproval, false);
  const autoMode = mode === "auto" && !manualApproval;
  const autoRemoval = settingBool_(settings.marketplaceRemovalSyncAutoApply, true);
  const olxCandidates = settingBool_(settings.marketplaceOlxLinkReviewEnabled, true)
    ? collectOlxLinkCandidates_(settings, products, threshold)
    : {};
  products.forEach((product) => {
    const candidate = findMarketplacePriceCandidate_(product, threshold);
    const olxCandidate = olxCandidates[product.id] || null;
    const previousItem = byId[String(product.id)] || {};
    const previous = previousItem.values || {};
    const currentPrice = parseMoneyNumber_(product.price);
    const foundPrice = candidate.priceNumber;
    const priceChanged = candidate.kind === "price"
      && Number.isFinite(currentPrice)
      && Number.isFinite(foundPrice)
      && Math.round(currentPrice * 100) !== Math.round(foundPrice * 100);
    const removalDetected = candidate.kind === "removal";
    const changeType = priceChanged ? "preco" : (removalDetected ? "remocao" : "");
    const oldValue = changeType === "remocao" ? true : currentPrice;
    const newValue = changeType === "remocao" ? false : foundPrice;
    const hash = changeType ? changeHash_([
      product.id,
      changeType,
      candidate.source,
      candidate.url,
      currentPrice,
      foundPrice,
      candidate.confidence,
      candidate.details
    ]) : "";
    const sameHash = hash && String(previous.MudancaHash || "") === hash;
    const alreadyReviewSent = sameHash && previous.EmailRevisaoEnviadoEm;
    const alreadyAutoSent = sameHash && previous.EmailAutoAplicadoEnviadoEm;
    const alreadyApplied = sameHash && previous.AplicadoEm;
    const now = new Date();
    const olxHash = olxCandidate ? changeHash_([product.id, "olx-link", olxCandidate.url, olxCandidate.confidence, olxCandidate.details]) : "";
    const sameOlxHash = olxHash && String(previous.LinkOLXHash || "") === olxHash;
    const record = {
      ProdutoID: product.id,
      TituloSite: product.title,
      PrecoSite: product.price,
      ImagemProduto: absoluteSiteUrl_(product.cutout || product.image || ""),
      LinkFacebook: product.links?.facebook || "",
      LinkOLX: product.links?.olx || "",
      PrecoEncontrado: candidate.price || "",
      PrecoEncontradoNumero: Number.isFinite(foundPrice) ? foundPrice : "",
      Fonte: candidate.source || "",
      Confianca: candidate.confidence || "manual",
      TipoMudanca: changeType,
      AcaoSugerida: candidate.action || "Nenhuma acao",
      AprovadoParaAplicar: sameHash ? previous.AprovadoParaAplicar || "" : "",
      Observacao: candidate.note || "",
      ProcessadorOK: candidate.matches?.processor || "",
      MemoriaOK: candidate.matches?.memory || "",
      PlacaVideoOK: candidate.matches?.gpu || "",
      ArmazenamentoOK: candidate.matches?.storage || "",
      FonteOK: candidate.matches?.powerSupply || "",
      DetalhesDaComparacao: candidate.details || "",
      MudancaHash: hash,
      StatusRevisao: changeType ? "Mudanca detectada" : "Sem mudanca detectada",
      EmailRevisaoEnviadoEm: sameHash ? previous.EmailRevisaoEnviadoEm || "" : "",
      EmailAutoAplicadoEnviadoEm: sameHash ? previous.EmailAutoAplicadoEnviadoEm || "" : "",
      LinkOLXCandidato: olxCandidate?.url || "",
      LinkOLXHash: olxHash,
      StatusLinkOLX: olxCandidate ? "Link OLX candidato aguardando aprovacao" : (product.links?.olx ? "Link OLX ja cadastrado" : "Sem candidato OLX"),
      EmailLinkOLXEnviadoEm: sameOlxHash ? previous.EmailLinkOLXEnviadoEm || "" : "",
      PrecoAnterior: changeType === "preco" ? currentPrice : "",
      PrecoNovoAplicado: changeType === "preco" ? foundPrice : "",
      AtivoAnterior: changeType === "remocao" ? true : "",
      AtivoNovoAplicado: changeType === "remocao" ? false : "",
      AplicadoEm: sameHash ? previous.AplicadoEm || "" : "",
      AtualizadoEm: now
    };
    if (sameHash && previous.StatusRevisao) record.StatusRevisao = previous.StatusRevisao;
    if (sameOlxHash && previous.StatusLinkOLX) record.StatusLinkOLX = previous.StatusLinkOLX;
    if (!changeType && previous.AplicadoEm && previous.MudancaHash) {
      [
        "TipoMudanca",
        "MudancaHash",
        "AprovadoParaAplicar",
        "StatusRevisao",
        "EmailRevisaoEnviadoEm",
        "EmailAutoAplicadoEnviadoEm",
        "PrecoAnterior",
        "PrecoNovoAplicado",
        "AtivoAnterior",
        "AtivoNovoAplicado",
        "AplicadoEm"
      ].forEach((header) => {
        record[header] = previous[header] || record[header] || "";
      });
    }

    if (changeType) {
      const canAutoApply = autoMode && candidate.strong && (changeType === "preco" || autoRemoval);
      if (canAutoApply && !alreadyApplied) {
        const result = applyMarketplaceChangeToGithub_(product.id, changeType, oldValue, newValue, `MobilyTechBR: ${changeType === "preco" ? "atualiza preco" : "remove anuncio"} ${product.title}`);
        if (result.ok) {
          record.StatusRevisao = changeType === "preco" ? "Preco aplicado automaticamente" : "Anuncio removido automaticamente";
          record.AprovadoParaAplicar = true;
          record.AplicadoEm = now;
          record.EmailAutoAplicadoEnviadoEm = alreadyAutoSent || now;
          if (!alreadyAutoSent) sendMarketplaceAutoEmail_(settings, product, candidate, record);
        } else {
          record.StatusRevisao = result.needsConfig ? "Revisao necessaria: configurar GitHub" : "Revisao necessaria: aplicacao automatica falhou";
          record.Observacao = [record.Observacao, result.message].filter(Boolean).join(" ");
          if (!alreadyReviewSent) {
            sendMarketplaceReviewEmail_(settings, product, candidate, record);
            record.EmailRevisaoEnviadoEm = now;
          }
        }
      } else if (!alreadyReviewSent && !alreadyApplied) {
        sendMarketplaceReviewEmail_(settings, product, candidate, record);
        record.EmailRevisaoEnviadoEm = now;
      } else if (alreadyApplied) {
        record.StatusRevisao = previous.StatusRevisao || record.StatusRevisao;
      }
    }

    if (olxCandidate && !record.EmailLinkOLXEnviadoEm) {
      sendOlxLinkReviewEmail_(settings, product, olxCandidate, record);
      record.EmailLinkOLXEnviadoEm = now;
    }

    const values = PRICE_HEADERS.map((header) => record[header] !== undefined ? record[header] : "");
    const row = previousItem.row;
    if (row) {
      sheet.getRange(row, 1, 1, PRICE_HEADERS.length).setValues([values]);
    } else {
      sheet.appendRow(values);
    }
  });

  if (settingBool_(settings.marketplaceDraftCreationEnabled, true)) {
    runMarketplaceDraftCreation_(settings, allProducts.length ? allProducts : products);
  }
}

function findMarketplacePriceCandidate_(product, threshold) {
  const category = productCategory_(product);
  const sources = [];
  if (product.links?.facebook) sources.push(["Facebook", product.links.facebook]);
  if (category === "ssd" && product.links?.olx) sources.push(["OLX", product.links.olx]);
  let facebookReviewFallback = null;

  for (const [source, url] of sources) {
    const page = fetchPublicPage_(url);
    if (page.unavailable) {
      const match = page.text ? marketplaceMatchConfidence_(product, page.text) : emptyMarketplaceMatch_();
      const candidate = {
        kind: "removal",
        price: "",
        priceNumber: null,
        source,
        url,
        confidence: page.text ? `${match.score}%` : "link indisponivel",
        strong: match.score >= threshold && match.requiredOk,
        action: match.score >= threshold && match.requiredOk
          ? "Anuncio parece removido; pode remover do site com alta confianca"
          : "Revisar possivel remocao antes de alterar o site",
        note: `O link do anuncio em ${source} parece indisponivel. Como anuncios duplicados podem existir, o script so remove automaticamente quando a pagina ainda confirma as configuracoes com alta confianca.`,
        matches: match.matches,
        details: match.details
      };
      if (category === "ssd" && source === "Facebook" && product.links?.olx) {
        facebookReviewFallback = candidate;
        continue;
      }
      return candidate;
    }
    if (!page.ok) {
      continue;
    }
    const match = marketplaceMatchConfidence_(product, page.text);
    const price = extractPrice_(page.text);
    if (price.label && match.score >= threshold && match.requiredOk) {
      return {
        kind: "price",
        price: price.label,
        priceNumber: price.number,
        source,
        url,
        confidence: `${match.score}%`,
        strong: true,
        action: "Preco candidato forte; pode aplicar automaticamente ou aprovar por e-mail",
        note: "Bateu com as configuracoes obrigatorias com alta confianca.",
        matches: match.matches,
        details: match.details
      };
    }
    if (price.label) {
      const candidate = {
        kind: "price",
        price: price.label,
        priceNumber: price.number,
        source,
        url,
        confidence: `${match.score}%`,
        strong: false,
        action: "Revisar manualmente",
        note: match.requiredOk
          ? "Preco encontrado, mas a confianca ainda nao passou do limite seguro."
          : "Preco encontrado, mas uma configuracao obrigatoria nao bateu. Pode ser outro PC parecido.",
        matches: match.matches,
        details: match.details
      };
      if (category === "ssd" && source === "Facebook" && product.links?.olx) {
        facebookReviewFallback = candidate;
        continue;
      }
      return candidate;
    }
  }

  if (facebookReviewFallback) return facebookReviewFallback;

  return {
    kind: "none",
    price: "",
    priceNumber: null,
    source: "",
    url: "",
    confidence: "manual",
    strong: false,
    action: "Revisar manualmente",
    note: "Nao encontrei preco publico confiavel. Facebook/OLX podem exigir login ou bloquear leitura automatica.",
    matches: {},
    details: ""
  };
}

function fetchPublicPage_(url) {
  try {
    const response = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      followRedirects: true,
      headers: {
        "User-Agent": "Mozilla/5.0 MobilyTechBR price review"
      }
    });
    const status = response.getResponseCode();
    const text = response.getContentText().slice(0, 300000);
    const unavailable = isUnavailableMarketplacePage_(status, text);
    if (status >= 300) return { ok: false, unavailable, status, text: unavailable ? text : "" };
    return { ok: true, unavailable, status, text };
  } catch (_error) {
    return { ok: false, unavailable: false, status: 0, text: "" };
  }
}

function isUnavailableMarketplacePage_(status, text) {
  if (status === 404 || status === 410) return true;
  const normalized = normalizeText_(text);
  return [
    "este anuncio nao esta mais disponivel",
    "este produto nao esta mais disponivel",
    "este conteudo nao esta disponivel",
    "this listing is no longer available",
    "this item is no longer available",
    "this content is not available"
  ].some((phrase) => normalized.includes(phrase));
}

function emptyMarketplaceMatch_() {
  return {
    score: 0,
    requiredOk: false,
    matches: {},
    details: "Pagina indisponivel sem conteudo suficiente para comparar as configuracoes."
  };
}

function collectOlxLinkCandidates_(settings, products, threshold) {
  const profileUrl = String(settings.marketplaceOlxProfileUrl || "https://www.olx.com.br/perfil/julian-859fd666").trim();
  if (!profileUrl) return {};
  const page = fetchPublicPage_(profileUrl);
  if (!page.ok) return {};
  const currentOlxFingerprints = new Set(products
    .map((product) => product.links?.olx || "")
    .filter(Boolean)
    .map(marketplaceListingFingerprint_));
  const urls = extractListingUrls_(page.text, "olx")
    .filter((url) => !currentOlxFingerprints.has(marketplaceListingFingerprint_(url)))
    .slice(0, 18);
  const candidates = {};

  urls.forEach((url) => {
    const listing = fetchPublicPage_(url);
    if (!listing.ok || listing.unavailable) return;
    products.forEach((product) => {
      const match = marketplaceMatchConfidence_(product, listing.text);
      if (match.score < threshold || !match.requiredOk) return;
      const previous = candidates[product.id];
      if (!previous || match.score > previous.score) {
        candidates[product.id] = {
          url,
          source: "OLX",
          confidence: `${match.score}%`,
          score: match.score,
          matches: match.matches,
          details: match.details,
          title: extractPageTitle_(listing.text),
          note: "Encontrei um link da OLX que parece ser este produto. Como links de redirecionamento podem confundir anuncios parecidos, ele precisa da sua aprovacao antes de entrar no site."
        };
      }
    });
  });

  return candidates;
}

function runMarketplaceDraftCreation_(settings, products) {
  const sheet = ensureSheet_(spreadsheet_(), MOBILYTECH.NEW_LISTINGS_SHEET, NEW_LISTING_HEADERS);
  const existingRows = readRows_(sheet);
  const existingHashes = new Set(existingRows.map(({ values }) => String(values.MudancaHash || "")));
  const knownFingerprints = new Set(products
    .flatMap((product) => [product.links?.facebook || "", product.links?.olx || ""])
    .filter(Boolean)
    .map(marketplaceListingFingerprint_));
  existingRows.forEach(({ values }) => {
    [values.LinkFacebook, values.LinkOLX].filter(Boolean).forEach((url) => knownFingerprints.add(marketplaceListingFingerprint_(url)));
  });

  const sources = [
    {
      key: "facebook",
      type: "facebook",
      label: "Facebook",
      profileUrl: String(settings.marketplaceFacebookProfileUrl || "https://www.facebook.com/marketplace/profile/100035688601043/?ref=permalink&mibextid=6ojiHh").trim()
    },
    {
      key: "olx",
      type: "olx",
      label: "OLX",
      profileUrl: String(settings.marketplaceOlxProfileUrl || "https://www.olx.com.br/perfil/julian-859fd666").trim()
    }
  ].filter((source) => source.profileUrl);

  sources.forEach((source) => {
    const profile = fetchPublicPage_(source.profileUrl);
    if (!profile.ok) return;
    const urls = extractListingUrls_(profile.text, source.type)
      .filter((url) => !knownFingerprints.has(marketplaceListingFingerprint_(url)))
      .slice(0, source.key === "olx" ? 20 : 12);

    urls.forEach((url) => {
      const page = fetchPublicPage_(url);
      if (!page.ok || page.unavailable) return;
      const classification = classifyListing_(page.text);
      if (source.key === "olx" && classification.category !== "ssd") return;
      const title = extractPageTitle_(page.text) || defaultTitleForCategory_(classification.category, source.label);
      const price = extractPrice_(page.text);
      const priceNumber = source.key === "olx" && classification.category !== "ssd" ? null : price.number;
      const hash = changeHash_(["novo-anuncio", source.key, marketplaceListingFingerprint_(url), classification.category, title, priceNumber, JSON.stringify(classification.specs)]);
      if (existingHashes.has(hash)) return;
      const draft = buildDraftProduct_(url, title, priceNumber, classification.specs, {
        sourceKey: source.key,
        sourceLabel: source.label,
        category: classification.category
      });
      const result = createDraftProductOnGithub_(draft);
      const now = new Date();
      const status = result.ok ? "Rascunho inativo criado no painel" : `Detectado, mas nao criado: ${result.message || "erro desconhecido"}`;
      const row = {
        Origem: source.label,
        LinkFacebook: source.key === "facebook" ? url : "",
        LinkOLX: source.key === "olx" ? url : "",
        TituloDetectado: title,
        PrecoDetectado: priceNumber || "",
        Categoria: classification.category,
        ProdutoIDGerado: draft.id,
        Processador: classification.specs.processor || "",
        Memoria: classification.specs.memory || "",
        PlacaVideo: classification.specs.gpu || "",
        Fonte: classification.specs.powerSupply || "",
        Armazenamento: classification.specs.storage || classification.specs.capacity || "",
        Marca: classification.specs.brand || "",
        Modelo: classification.specs.model || "",
        Tipo: classification.specs.type || "",
        Formato: classification.specs.formFactor || "",
        Interface: classification.specs.interface || "",
        Potencia: classification.specs.wattage || "",
        Certificacao: classification.specs.certification || "",
        Conectores: classification.specs.connectors || "",
        Descricao: extractPageDescription_(page.text),
        MudancaHash: hash,
        Status: status,
        EmailEnviadoEm: now,
        CriadoEm: result.ok ? now : "",
        AtualizadoEm: now
      };
      sheet.appendRow(NEW_LISTING_HEADERS.map((header) => row[header] || ""));
      existingHashes.add(hash);
      knownFingerprints.add(marketplaceListingFingerprint_(url));
      sendNewListingEmail_(settings, draft, url, classification.specs, priceNumber, status, result.ok, source.label, classification.category);
    });
  });
}

function buildDraftProduct_(listingUrl, title, price, specs, options) {
  const category = options?.category || "pc";
  const sourceKey = options?.sourceKey || "facebook";
  const cleanTitle = cleanupText_(title).replace(/\s*-\s*(Facebook|OLX).*$/i, "") || defaultTitleForCategory_(category, options?.sourceLabel || "plataforma");
  const tags = draftTagsForCategory_(category, specs);
  const product = {
    id: uniqueDraftId_(cleanTitle),
    active: false,
    category,
    title: cleanTitle,
    price: Number.isFinite(price) ? price : 0,
    badge: draftBadgeForCategory_(category),
    image: "./assets/mobilytech-logo.png",
    photo: "square",
    tags,
    specs,
    links: { [sourceKey]: listingUrl },
    featured: false
  };
  const shipping = defaultShippingForCategory_(category, price);
  if (shipping) product.shipping = shipping;
  return product;
}

function defaultTitleForCategory_(category, sourceLabel) {
  const names = {
    pc: "Novo PC detectado",
    ssd: "Novo SSD detectado",
    fonte: "Nova fonte detectada",
    hardware: "Novo produto detectado"
  };
  return `${names[category] || names.hardware} em ${sourceLabel || "marketplace"}`;
}

function draftBadgeForCategory_(category) {
  return {
    pc: "Rascunho",
    ssd: "SSD",
    fonte: "Fonte",
    hardware: "Rascunho"
  }[category] || "Rascunho";
}

function draftTagsForCategory_(category, specs) {
  const order = {
    pc: [specs.processor, specs.memory, specs.gpu, specs.storage],
    ssd: [specs.storage || specs.capacity, specs.brand, specs.interface || specs.type],
    fonte: [specs.wattage || specs.powerSupply, specs.certification, specs.brand],
    hardware: [specs.brand, specs.model, specs.type]
  }[category] || [specs.brand, specs.model, specs.type];
  return order.filter(Boolean);
}

function defaultShippingForCategory_(category, price) {
  const insuranceValue = Number.isFinite(price) && price > 0 ? price : undefined;
  if (category === "ssd") {
    return {
      weightKg: 0.35,
      heightCm: 6,
      widthCm: 12,
      lengthCm: 15,
      insuranceValue
    };
  }
  if (category === "fonte") {
    return {
      weightKg: 2.2,
      heightCm: 15,
      widthCm: 25,
      lengthCm: 30,
      insuranceValue
    };
  }
  return null;
}

function createDraftProductOnGithub_(draft) {
  return updateGithubProducts_((products) => {
    if (products.some((product) => String(product.id) === String(draft.id))) {
      draft.id = `${draft.id}-${Date.now()}`;
    }
    products.push(draft);
    return { changed: true };
  }, `MobilyTechBR: cria rascunho inativo ${draft.title}`);
}

function uniqueDraftId_(title) {
  return slug_(`rascunho-${title}`).slice(0, 52).replace(/-+$/g, "") || `rascunho-${Date.now()}`;
}

function extractListingUrls_(html, type) {
  const text = String(html || "").replace(/\\\//g, "/").replace(/&amp;/g, "&");
  const pattern = type === "facebook"
    ? /https?:\/\/(?:www\.)?facebook\.com\/marketplace\/item\/[0-9][^"'<>\\\s]*/g
    : /https?:\/\/(?:[^"'<>\\\s]*\.)?olx\.com\.br\/[^"'<>\\\s]+|https?:\/\/olx\.com\.br\/vi\/[0-9][^"'<>\\\s]*/g;
  const absolute = (text.match(pattern) || []).map((url) => sanitizeUrl_(url));
  const relative = type === "facebook"
    ? (text.match(/\/marketplace\/item\/[0-9][^"'<>\\\s]*/g) || []).map((url) => sanitizeUrl_(`https://www.facebook.com${url}`))
    : (text.match(/\/(?:vi\/[0-9]|[a-z]{2}\/[^"'<>\\\s]*-[0-9]{8,})[^"'<>\\\s]*/g) || []).map((url) => sanitizeUrl_(`https://www.olx.com.br${url}`));
  return [...new Set([...absolute, ...relative])].filter(Boolean);
}

function sanitizeUrl_(url) {
  try {
    const parsed = new URL(String(url || ""));
    return parsed.toString();
  } catch (_error) {
    return "";
  }
}

function marketplaceListingFingerprint_(url) {
  const value = String(url || "");
  const facebook = value.match(/marketplace\/item\/(\d+)/i);
  if (facebook) return `facebook:${facebook[1]}`;
  const olx = value.match(/\/vi\/(\d+)/i) || value.match(/-(\d{8,})(?:[/?#]|$)/);
  if (olx) return `olx:${olx[1]}`;
  return normalizeText_(value).replace(/[?#].*$/, "").replace(/\/+$/, "");
}

function extractPageTitle_(html) {
  const text = String(html || "");
  const og = text.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)
    || text.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
  const title = og?.[1] || (text.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
  return cleanupText_(decodeHtml_(title));
}

function extractPageDescription_(html) {
  const text = String(html || "");
  const og = text.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)
    || text.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i);
  return cleanupText_(decodeHtml_(og?.[1] || text.replace(/<[^>]+>/g, " ").slice(0, 700))).slice(0, 650);
}

function productCategory_(product) {
  return String(product?.category || product?.type || "pc").toLowerCase();
}

function classifyListing_(html) {
  const text = listingPlainText_(html);
  const pcSpecs = extractPcSpecsFromPlainText_(text);
  const category = detectListingCategory_(text, pcSpecs);
  if (category === "ssd") return { category, specs: extractSsdSpecsFromPlainText_(text) };
  if (category === "fonte") return { category, specs: extractPowerSupplySpecsFromPlainText_(text) };
  if (category === "pc") return { category, specs: pcSpecs };
  return { category: "hardware", specs: extractHardwareSpecsFromPlainText_(text) };
}

function listingPlainText_(html) {
  return normalizeText_(extractPageTitle_(html) + " " + extractPageDescription_(html) + " " + String(html || "").replace(/<[^>]+>/g, " ").slice(0, 5000));
}

function detectListingCategory_(text, pcSpecs) {
  const hasPcCore = Boolean(pcSpecs.processor || pcSpecs.gpu || /\bpc\s*gamer\b|\bcomputador\b|\bdesktop\b/.test(text));
  const hasSsd = /\bssd\b|\bnvme\b|\bm\.?2\b|\bsata\b/.test(text);
  const hasPsu = /\bfonte\b|\bpower\s*supply\b|\b80\s*plus\b|\b\d{3,4}\s*w\b/.test(text);
  if (hasPcCore) return "pc";
  if (hasPsu) return "fonte";
  if (hasSsd) return "ssd";
  return "hardware";
}

function extractSpecsFromText_(html) {
  return classifyListing_(html).specs;
}

function extractPcSpecsFromPlainText_(text) {
  return {
    processor: firstSpecMatch_(text, [
      /\bryzen\s*[3579]\s*\d{4}\s*[a-z]*/i,
      /\b(?:core\s*)?i[3579][-\s]?\d{3,5}[a-z]*/i,
      /\bxeon\s*e?3?[-\s]?\d{4}\s*v?\d\b/i,
      /\bamd\s*fx[-\s]?\d{4}\b/i,
      /\bfx[-\s]?\d{4}\b/i
    ]),
    memory: firstSpecMatch_(text, [/\b\d{1,2}\s*gb\s*(?:ddr\s*\d)?\s*(?:ram)?(?:\s*dual\s*channel)?/i]),
    gpu: firstSpecMatch_(text, [
      /\bgtx\s*\d{3,4}\s*ti(?:\s*\d+\s*gb)?/i,
      /\bgtx\s*\d{3,4}(?:\s*\d+\s*gb)?/i,
      /\brx\s*\d{4}\s*xt(?:\s*\d+\s*gb)?/i,
      /\brtx\s*\d{3,4}(?:\s*ti)?/i,
      /\bgt\s*\d{3,4}\b/i
    ]),
    powerSupply: firstSpecMatch_(text, [/\b(?:cx|vs|evga|corsair|thermaltake|cooler\s*master)?\s*\d{3,4}\s*w(?:\s*80\s*plus)?/i]),
    storage: firstSpecMatch_(text, [/\b(?:ssd|hd|hdd|nvme)\s*\d{2,4}\s*(?:gb|tb)\b/i])
  };
}

function extractSsdSpecsFromPlainText_(text) {
  const storage = firstSpecMatch_(text, [
    /\b(?:ssd|nvme|m\.?2|sata)?\s*\d{2,4}\s*(?:gb|tb)\b/i
  ]);
  const brand = extractKnownBrand_(text, [
    "kingston", "adata", "crucial", "sandisk", "wd", "western digital", "hikvision", "goldenfir",
    "xraydisk", "lexar", "samsung", "seagate", "pny", "patriot", "netac", "multilaser", "kingspec"
  ]);
  const isNvme = /\bnvme\b|\bm\.?2\b|\b2280\b/.test(text);
  const isSata = /\bsata\b|\b2\.?5\b/.test(text);
  const interfaceName = isNvme ? "NVMe" : (isSata ? "SATA" : "");
  const formFactor = isNvme ? "M.2 2280" : (isSata ? "2.5 polegadas" : "");
  return {
    storage,
    capacity: storage,
    brand,
    model: extractModelNearBrand_(text, brand),
    type: isNvme ? "SSD NVMe" : "SSD",
    formFactor,
    interface: interfaceName
  };
}

function extractPowerSupplySpecsFromPlainText_(text) {
  const brand = extractKnownBrand_(text, [
    "corsair", "evga", "cooler master", "thermaltake", "redragon", "pichau", "mancer",
    "gamemax", "aerocool", "kcas", "duex", "bluecase", "xpg", "gigabyte"
  ]);
  const wattage = firstSpecMatch_(text, [/\b\d{3,4}\s*w\b/i]);
  const certification = firstSpecMatch_(text, [
    /\b80\s*plus\s*(?:white|bronze|silver|gold|platinum|titanium)?\b/i
  ]);
  const connectors = extractPowerSupplyConnectors_(text);
  const model = extractModelNearBrand_(text, brand) || firstSpecMatch_(text, [/\b(?:cx|vs|cv|kcas)\s*\d{3,4}\b/i]);
  const summary = uniqueSpecs_([brand, model, wattage, certification]).join(" ");
  return {
    powerSupply: summary || wattage,
    wattage,
    brand,
    model,
    certification,
    connectors
  };
}

function extractPowerSupplyConnectors_(text) {
  const matches = String(text || "").match(/\b(?:24\s*pinos?|8\s*pinos?|6\+2\s*pinos?|4\+4\s*pinos?|sata|pci[-\s]?e)\b/ig) || [];
  return uniqueSpecs_(matches.map(prettySpec_)).slice(0, 5).join(", ");
}

function uniqueSpecs_(items) {
  const seen = new Set();
  return (items || [])
    .map((item) => cleanupText_(item))
    .filter(Boolean)
    .filter((item) => {
      const key = normalizeText_(item);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function extractHardwareSpecsFromPlainText_(text) {
  const brand = extractKnownBrand_(text, ["corsair", "kingston", "adata", "crucial", "pichau", "mancer", "redragon", "samsung", "wd"]);
  return {
    brand,
    model: extractModelNearBrand_(text, brand),
    type: firstSpecMatch_(text, [/\b(?:ssd|fonte|memoria|placa\s*de\s*video|gabinete|monitor|teclado|mouse)\b/i])
  };
}

function extractKnownBrand_(text, brands) {
  const normalized = normalizeText_(text);
  const found = brands.find((brand) => new RegExp(`\\b${brand.replace(/\s+/g, "\\s+")}\\b`, "i").test(normalized));
  return found ? prettyBrand_(found) : "";
}

function extractModelNearBrand_(text, brand) {
  if (!brand) return "";
  const normalizedBrand = normalizeText_(brand).replace(/\s+/g, "\\s+");
  const match = String(text || "").match(new RegExp(`\\b${normalizedBrand}\\b\\s+([a-z0-9][a-z0-9\\- ]{1,22})`, "i"));
  if (!match) return "";
  const model = cleanupText_(match[1])
    .replace(/\b\d{2,4}\s*(?:gb|tb|w)\b.*$/i, "")
    .replace(/\b(?:ssd|sata|nvme|m\.?2|fonte|power|supply|80\s*plus|novo|usado|seminovo|para|pc|gamer|com)\b.*$/i, "")
    .trim();
  return prettySpec_(model).slice(0, 28);
}

function prettyBrand_(value) {
  return cleanupText_(value)
    .replace(/\bwd\b/i, "WD")
    .replace(/\bxpg\b/i, "XPG")
    .replace(/\bevga\b/i, "EVGA")
    .replace(/\bpny\b/i, "PNY")
    .replace(/\badata\b/i, "ADATA")
    .replace(/\b([a-z])([a-z]*)\b/gi, (_match, first, rest) => first.toUpperCase() + rest.toLowerCase());
}

function firstSpecMatch_(text, patterns) {
  for (const pattern of patterns) {
    const match = String(text || "").match(pattern);
    if (match) return prettySpec_(match[0]);
  }
  return "";
}

function prettySpec_(value) {
  return cleanupText_(value)
    .replace(/(\d)\s*gb\b/ig, "$1GB")
    .replace(/(\d)\s*tb\b/ig, "$1TB")
    .replace(/(\d)\s*w\b/ig, "$1W")
    .replace(/\bgb\b/ig, "GB")
    .replace(/\btb\b/ig, "TB")
    .replace(/\bram\b/ig, "RAM")
    .replace(/\bddr\s*(\d)\b/ig, "DDR$1")
    .replace(/\bssd\b/ig, "SSD")
    .replace(/\bhdd\b/ig, "HDD")
    .replace(/\bnvme\b/ig, "NVMe")
    .replace(/\b80\s*plus\b/ig, "80 Plus")
    .replace(/\bwhite\b/ig, "White")
    .replace(/\bbronze\b/ig, "Bronze")
    .replace(/\bsilver\b/ig, "Silver")
    .replace(/\bgold\b/ig, "Gold")
    .replace(/\bplatinum\b/ig, "Platinum")
    .replace(/\btitanium\b/ig, "Titanium")
    .replace(/\b(cx|vs|cv)\s*(\d{3,4})\b/ig, (_match, prefix, number) => `${prefix.toUpperCase()}${number}`)
    .replace(/\bkcas\s*(\d{3,4})\b/ig, (_match, number) => `KCAS ${number}`)
    .replace(/\bpci[-\s]?e\b/ig, "PCIe")
    .replace(/\bgtx\b/ig, "GTX")
    .replace(/\brtx\b/ig, "RTX")
    .replace(/\brx\b/ig, "RX")
    .replace(/\bxeon\b/ig, "Xeon")
    .replace(/\bryzen\b/ig, "Ryzen")
    .replace(/\bamd\b/ig, "AMD")
    .replace(/\bfx\b/ig, "FX")
    .replace(/\bti\b/ig, "Ti");
}

function cleanupText_(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function decodeHtml_(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function slug_(value) {
  return normalizeText_(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function marketplaceMatchConfidence_(product, html) {
  const text = normalizeText_(html);
  const specs = product.specs || {};
  const category = productCategory_(product);
  const checks = marketplaceChecksForCategory_(category, specs, text);
  const titleCheck = looseTokenMatch_(product.title, text);
  const tagHits = (product.tags || []).filter((tag) => looseTokenMatch_(tag, text).ok).length;
  const tagTotal = (product.tags || []).length || 1;
  const weightedTotal = checks.reduce((sum, check) => sum + check.weight, 0) + 8;
  const weightedHits = checks.reduce((sum, check) => sum + (check.ok ? check.weight : 0), 0)
    + (titleCheck.ok ? 5 : 0)
    + Math.min(3, Math.round((tagHits / tagTotal) * 3));
  const requiredOk = checks.filter((check) => check.required).every((check) => check.ok);
  const matches = Object.fromEntries(checks.map((check) => [check.key, check.ok ? "SIM" : "NAO"]));
  const details = checks
    .map((check) => `${check.label}: ${check.ok ? "OK" : "NAO"} (${check.expected || "nao informado"})`)
    .join(" | ");

  return {
    score: Math.min(100, Math.round((weightedHits / weightedTotal) * 100)),
    requiredOk,
    matches,
    details
  };
}

function marketplaceChecksForCategory_(category, specs, text) {
  if (category === "ssd") {
    return [
      specCheck_("storage", "Armazenamento", specs.storage || specs.capacity, text, 44, true),
      specCheck_("brand", "Marca", specs.brand, text, 22, Boolean(specs.brand)),
      specCheck_("model", "Modelo", specs.model, text, 16, Boolean(specs.model)),
      specCheck_("interface", "Interface", specs.interface || specs.type, text, 12, Boolean(specs.interface || specs.type))
    ].filter((check) => check.weight > 0);
  }
  if (category === "fonte") {
    return [
      specCheck_("wattage", "Potencia", specs.wattage || specs.powerSupply, text, 38, Boolean(specs.wattage || specs.powerSupply)),
      specCheck_("brand", "Marca", specs.brand, text, 20, Boolean(specs.brand)),
      specCheck_("model", "Modelo", specs.model, text, 18, Boolean(specs.model)),
      specCheck_("certification", "Certificacao", specs.certification, text, 14, Boolean(specs.certification)),
      specCheck_("connectors", "Conectores", specs.connectors, text, 8, false)
    ].filter((check) => check.weight > 0);
  }
  if (category === "hardware") {
    return [
      specCheck_("brand", "Marca", specs.brand, text, 30, Boolean(specs.brand)),
      specCheck_("model", "Modelo", specs.model, text, 28, Boolean(specs.model)),
      specCheck_("type", "Tipo", specs.type, text, 18, Boolean(specs.type)),
      specCheck_("storage", "Armazenamento", specs.storage || specs.capacity, text, 18, Boolean(specs.storage || specs.capacity))
    ].filter((check) => check.weight > 0);
  }
  return [
    specCheck_("processor", "Processador", specs.processor, text, 28, true),
    specCheck_("memory", "Memoria", specs.memory, text, 16, true),
    specCheck_("gpu", "Placa de video", specs.gpu, text, 32, true),
    specCheck_("storage", "Armazenamento", specs.storage, text, 14, Boolean(specs.storage)),
    specCheck_("powerSupply", "Fonte", specs.powerSupply, text, 10, Boolean(specs.powerSupply))
  ].filter((check) => check.weight > 0);
}

function extractPrice_(html) {
  const matches = String(html).match(/R\$\s?[\d.]+,\d{2}|R\$\s?[\d.]+/g) || [];
  const prices = matches
    .map((value) => value.replace(/\s+/g, " "))
    .map((label) => ({ label, number: Number(label.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".")) }))
    .filter((item) => Number.isFinite(item.number) && item.number >= 20 && item.number <= 30000);
  if (!prices.length) return { label: "", number: null };
  return prices[0];
}

function specCheck_(key, label, expected, text, weight, required) {
  if (!expected) return { key, label, expected: "", ok: !required, weight: required ? weight : 0, required };
  const match = looseTokenMatch_(expected, text);
  return {
    key,
    label,
    expected,
    ok: match.ok,
    weight,
    required,
    missing: match.missing
  };
}

function looseTokenMatch_(expected, text) {
  const tokens = specTokens_(expected);
  if (!tokens.length) return { ok: true, missing: [] };
  const missing = tokens.filter((token) => !text.includes(token));
  const minHits = tokens.length <= 2 ? tokens.length : Math.ceil(tokens.length * 0.75);
  return {
    ok: tokens.length - missing.length >= minHits,
    missing
  };
}

function specTokens_(value) {
  return [...new Set(normalizeText_(value)
    .replace(/\bti\b/g, "ti")
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length >= 2)
    .filter((term) => !["pc", "gamer", "com", "ram", "gb", "ddr", "dual", "channel", "plus", "sata"].includes(term)))];
}

function changeHash_(parts) {
  const raw = parts.map((part) => String(part === undefined || part === null ? "" : part)).join("|");
  return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw)).slice(0, 28);
}

function normalizeText_(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function upsertOrder_(payload) {
  const sheet = ordersSheet_();
  const order = normalizeOrder_(payload);
  const existing = readRows_(sheet).find(({ values }) => String(values.PedidoID) === order.PedidoID);
  if (existing) {
    const rowValues = ORDER_HEADERS.map((header) => {
      const nextValue = order[header];
      if (nextValue !== undefined && nextValue !== null && String(nextValue) !== "") return nextValue;
      return existing.values[header] || "";
    });
    sheet.getRange(existing.row, 1, 1, ORDER_HEADERS.length).setValues([rowValues]);
    return existing.row;
  }
  const rowValues = ORDER_HEADERS.map((header) => order[header] || "");
  sheet.appendRow(rowValues);
  return sheet.getLastRow();
}

function normalizeOrder_(payload) {
  const shippingCustomer = parseJson_(payload.shipping_customer, {});
  const customer = {
    name: payload.customer_name || shippingCustomer.name || "",
    email: payload.customer_email || payload.email || shippingCustomer.email || "",
    phone: payload.customer_phone || shippingCustomer.phone || ""
  };
  return {
    PedidoID: String(payload.payment_id || payload.pagamento || `pedido-${Date.now()}`),
    Status: String(payload.order_status || "PAGO").toUpperCase(),
    Plataforma: payload.platform || "Site",
    ClienteNome: customer.name,
    ClienteEmail: customer.email,
    ClienteTelefone: customer.phone,
    Produto: payload.product_title || payload.produto || "",
    Opcionais: payload.selected_addons || payload.opcionais || "",
    ValorPago: payload.amount_paid || "",
    ModoEntrega: payload.delivery_mode || (payload.shipping_requested === "true" ? "shipping" : "pickup"),
    Transportadora: payload.shipping_carrier || "",
    ServicoFrete: payload.shipping_service_name || "",
    PrecoFrete: payload.shipping_price || "",
    Cep: payload.shipping_postal_code || shippingCustomer.postalCode || "",
    Endereco: [shippingCustomer.street, shippingCustomer.number, shippingCustomer.complement, shippingCustomer.district, shippingCustomer.city, shippingCustomer.state].filter(Boolean).join(", "),
    LinkConfirmarEtiqueta: payload.label_confirmation_url || payload.confirmar_etiqueta || "",
    DecisaoEtiqueta: "",
    CodigoRastreio: payload.tracking_code || payload.codigo_rastreio || payload.CodigoRastreio || "",
    LinkRastreio: payload.tracking_url || payload.link_rastreio || payload.LinkRastreio || "",
    EmailClienteConfirmacaoEnviado: "",
    EmailVendedorVendaEnviado: "",
    EmailClienteDespachoEnviado: "",
    EmailClienteEntregaEnviado: "",
    ReembolsoManual: "",
    AtualizadoEm: new Date()
  };
}

function denyLabel_(orderId, token) {
  if (!verifyActionToken_(orderId, token)) {
    return HtmlService.createHtmlOutput("Link invalido ou expirado.");
  }
  const sheet = ordersSheet_();
  const found = readRows_(sheet).find(({ values }) => String(values.PedidoID) === String(orderId));
  if (!found) return HtmlService.createHtmlOutput("Pedido nao encontrado.");
  sheet.getRange(found.row, col_("DecisaoEtiqueta")).setValue("Negada");
  sheet.getRange(found.row, col_("Status")).setValue("CANCELAR");
  sheet.getRange(found.row, col_("ReembolsoManual")).setValue("Pendente");
  return HtmlService.createHtmlOutput("Etiqueta negada. O pedido foi marcado para cancelamento/reembolso manual.");
}

function sendMarketplaceReviewEmail_(settings, product, candidate, record) {
  const sellerEmail = settings.sellerEmail || MOBILYTECH.SELLER_EMAIL;
  const changeLabel = record.TipoMudanca === "remocao" ? "possivel remocao de anuncio" : "possivel mudanca de preco";
  const approveUrl = buildMarketplaceActionUrl_("approve-price", product.id, record.MudancaHash);
  const rejectUrl = buildMarketplaceActionUrl_("reject-price", product.id, record.MudancaHash);
  const html = emailShell_({
    preheader: "Uma mudanca nova foi detectada e aguarda sua revisao.",
    title: "Revisao de preco do site",
    intro: `Detectei uma nova ${changeLabel} em ${candidate.source || "uma plataforma"}, mas ela precisa da sua confirmacao antes de mexer no site. Este e-mail sera enviado apenas uma vez enquanto essa mesma mudanca continuar igual.`,
    blocks: [
      marketplaceEmailCard_(product, candidate, record),
      marketplaceActionButtons_("Aprovar alteracao no site", approveUrl, "Nao aprovar", rejectUrl)
    ]
  });
  GmailApp.sendEmail(sellerEmail, "Revisao de preco/anuncio - MobilyTechBR", "Uma mudanca nova precisa de revisao.", { htmlBody: html, name: "MobilyTech BR" });
}

function sendMarketplaceAutoEmail_(settings, product, candidate, record) {
  const sellerEmail = settings.sellerEmail || MOBILYTECH.SELLER_EMAIL;
  const revertUrl = buildMarketplaceActionUrl_("revert-price", product.id, record.MudancaHash);
  const html = emailShell_({
    preheader: "Uma mudanca de alta confianca foi aplicada automaticamente.",
    title: "Atualizacao automatica feita",
    intro: "Detectei uma mudanca com alta confianca e atualizei o site automaticamente. Se algo estiver errado, use o botao para voltar como era antes.",
    blocks: [
      marketplaceEmailCard_(product, candidate, record),
      marketplaceActionButtons_("Voltar como era antes", revertUrl, "", "")
    ]
  });
  GmailApp.sendEmail(sellerEmail, "Atualizacao automatica no site - MobilyTechBR", "Uma mudanca foi aplicada automaticamente.", { htmlBody: html, name: "MobilyTech BR" });
}

function sendOlxLinkReviewEmail_(settings, product, candidate, record) {
  const sellerEmail = settings.sellerEmail || MOBILYTECH.SELLER_EMAIL;
  const approveUrl = buildMarketplaceActionUrl_("approve-olx-link", product.id, record.LinkOLXHash);
  const rejectUrl = buildMarketplaceActionUrl_("reject-olx-link", product.id, record.LinkOLXHash);
  const html = emailShell_({
    preheader: "Encontrei um possivel link da OLX para um produto do site.",
    title: "Confirmar link da OLX",
    intro: "Encontrei um link da OLX que parece combinar com um produto do site. Nao vou trocar automaticamente: confirme primeiro para evitar colocar o link de outro anuncio parecido.",
    blocks: [
      marketplaceEmailCard_(product, candidate, {
        ...record,
        TipoMudanca: "link-olx",
        PrecoAnterior: product.links?.olx || "Sem link OLX no site",
        PrecoNovoAplicado: candidate.url,
        Confianca: candidate.confidence,
        Fonte: "OLX",
        DetalhesDaComparacao: candidate.details
      }),
      marketplaceActionButtons_("Confirmar link da OLX", approveUrl, "Nao e esse anuncio", rejectUrl)
    ]
  });
  GmailApp.sendEmail(sellerEmail, "Confirmar link OLX - MobilyTechBR", "Possivel link OLX encontrado.", { htmlBody: html, name: "MobilyTech BR" });
}

function sendNewListingEmail_(settings, draft, listingUrl, specs, price, status, created, sourceLabel, category) {
  const sellerEmail = settings.sellerEmail || MOBILYTECH.SELLER_EMAIL;
  const panelUrl = `${MOBILYTECH.SITE_URL}/admin/`;
  const categoryLabel = productCategoryLabel_(category || draft.category);
  const html = emailShell_({
    preheader: `Um novo anuncio em ${sourceLabel || "marketplace"} foi detectado.`,
    title: created ? "Rascunho criado no painel" : "Novo anuncio detectado",
    intro: created
      ? `Detectei um novo anuncio em ${sourceLabel || "marketplace"} e criei um rascunho inativo no painel. Ele ainda nao aparece para clientes. Entre no painel, coloque fotos boas, confira as informacoes e ative quando estiver pronto.`
      : `Detectei um novo anuncio em ${sourceLabel || "marketplace"}, mas nao consegui criar automaticamente no painel. Confira o motivo abaixo.`,
    blocks: [
      detailBlock_("Anuncio detectado", [
        ["Origem", sourceLabel || "Marketplace"],
        ["Categoria", categoryLabel],
        ["Titulo", draft.title],
        ["Preco detectado", Number.isFinite(price) ? formatMoneyText_(price) : "Nao detectado"],
        ["Processador", specs.processor || ""],
        ["Memoria", specs.memory || ""],
        ["Placa de video", specs.gpu || ""],
        ["Fonte", specs.powerSupply || ""],
        ["Armazenamento", specs.storage || specs.capacity || ""],
        ["Marca", specs.brand || ""],
        ["Modelo", specs.model || ""],
        ["Tipo", specs.type || ""],
        ["Potencia", specs.wattage || ""],
        ["Certificacao", specs.certification || ""],
        ["Status", status],
        ["Link do anuncio", listingUrl]
      ].filter((item) => item[1] !== "")),
      `<p style="text-align:center;margin:22px 0 4px"><a href="${panelUrl}" style="${buttonStyle_()}">Abrir painel do site</a></p>`
    ]
  });
  GmailApp.sendEmail(sellerEmail, "Novo anuncio detectado - MobilyTechBR", `Um novo anuncio foi detectado em ${sourceLabel || "marketplace"}.`, { htmlBody: html, name: "MobilyTech BR" });
}

function productCategoryLabel_(category) {
  return {
    pc: "PC completo",
    ssd: "SSD / armazenamento",
    fonte: "Fonte",
    hardware: "Hardware"
  }[String(category || "").toLowerCase()] || "Produto";
}

function marketplaceEmailCard_(product, candidate, record) {
  const image = record.ImagemProduto || absoluteSiteUrl_(product.cutout || product.image || "");
  const oldText = record.TipoMudanca === "remocao" ? "Ativo no site" : (record.TipoMudanca === "link-olx" ? record.PrecoAnterior : formatMoneyText_(record.PrecoAnterior));
  const newText = record.TipoMudanca === "remocao" ? "Remover do site" : (record.TipoMudanca === "link-olx" ? record.PrecoNovoAplicado : formatMoneyText_(record.PrecoNovoAplicado));
  const imageHtml = image
    ? `<td width="128" valign="top" style="padding-right:16px"><img src="${escapeHtml_(image)}" width="116" alt="" style="display:block;width:116px;max-width:116px;border-radius:14px;border:1px solid #176c82;background:#061622"></td>`
    : "";
  return `<div style="${cardStyle_()}">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        ${imageHtml}
        <td valign="top">
          <h2 style="margin:0 0 8px;color:#ffffff!important;font-size:20px;line-height:1.2">${escapeHtml_(product.title || record.TituloSite)}</h2>
          <p style="margin:0 0 12px;color:#bcd4df!important;font-size:13px;line-height:1.5;font-weight:700">${escapeHtml_(candidate.note || record.Observacao || "")}</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr><td style="padding:6px 0;color:#9fc1d1!important;font-size:12px;font-weight:900;text-transform:uppercase">Antes</td><td style="padding:6px 0;color:#ffffff!important;font-weight:900;text-align:right">${escapeHtml_(oldText)}</td></tr>
            <tr><td style="padding:6px 0;color:#9fc1d1!important;font-size:12px;font-weight:900;text-transform:uppercase">Agora</td><td style="padding:6px 0;color:#22f0c4!important;font-weight:900;text-align:right">${escapeHtml_(newText)}</td></tr>
            <tr><td style="padding:6px 0;color:#9fc1d1!important;font-size:12px;font-weight:900;text-transform:uppercase">Fonte</td><td style="padding:6px 0;color:#ffffff!important;font-weight:900;text-align:right">${escapeHtml_(record.Fonte || candidate.source || "")}</td></tr>
            <tr><td style="padding:6px 0;color:#9fc1d1!important;font-size:12px;font-weight:900;text-transform:uppercase">Confianca</td><td style="padding:6px 0;color:#ffffff!important;font-weight:900;text-align:right">${escapeHtml_(record.Confianca || candidate.confidence || "")}</td></tr>
          </table>
          <p style="margin:12px 0 0;color:#d7eaf5!important;font-size:12px;line-height:1.5;font-weight:700">${escapeHtml_(record.DetalhesDaComparacao || candidate.details || "")}</p>
        </td>
      </tr>
    </table>
  </div>`;
}

function marketplaceActionButtons_(primaryLabel, primaryUrl, secondaryLabel, secondaryUrl) {
  if (!primaryUrl) {
    return textBlock_("Acao indisponivel", "Republique o Apps Script como Web App para gerar links de aprovacao.");
  }
  const secondary = secondaryLabel && secondaryUrl
    ? `<a href="${secondaryUrl}" style="${buttonStyle_("secondary")}">${escapeHtml_(secondaryLabel)}</a>`
    : "";
  return `<p style="text-align:center;margin:22px 0 4px"><a href="${primaryUrl}" style="${buttonStyle_()}">${escapeHtml_(primaryLabel)}</a>${secondary}</p>`;
}

function approveMarketplaceReview_(productId, hash, token) {
  if (!verifyMarketplaceActionToken_("approve-price", productId, hash, token)) return HtmlService.createHtmlOutput("Link invalido.");
  const found = findPriceReviewRow_(productId, hash);
  if (!found) return HtmlService.createHtmlOutput("Revisao nao encontrada ou ja substituida por uma mudanca mais nova.");
  const type = String(found.values.TipoMudanca || "");
  const newValue = type === "remocao" ? false : parseMoneyNumber_(found.values.PrecoNovoAplicado || found.values.PrecoEncontradoNumero || found.values.PrecoEncontrado);
  const oldValue = type === "remocao" ? true : parseMoneyNumber_(found.values.PrecoAnterior || found.values.PrecoSite);
  const result = applyMarketplaceChangeToGithub_(productId, type, oldValue, newValue, `MobilyTechBR: aplica revisao ${productId}`);
  if (!result.ok) {
    updatePriceReviewFields_(found.sheet, found.row, {
      AprovadoParaAplicar: true,
      StatusRevisao: `Aprovado, mas nao aplicado: ${result.message || "erro desconhecido"}`,
      AtualizadoEm: new Date()
    });
    return HtmlService.createHtmlOutput(`Aprovado, mas ainda nao aplicado no site. ${escapeHtml_(result.message || "")}`);
  }
  updatePriceReviewFields_(found.sheet, found.row, {
    AprovadoParaAplicar: true,
    StatusRevisao: type === "remocao" ? "Remocao aprovada e aplicada" : "Preco aprovado e aplicado",
    AplicadoEm: new Date(),
    AtualizadoEm: new Date()
  });
  return HtmlService.createHtmlOutput("Alteracao aprovada e aplicada no site. O deploy pode levar alguns minutos para aparecer.");
}

function rejectMarketplaceReview_(productId, hash, token) {
  if (!verifyMarketplaceActionToken_("reject-price", productId, hash, token)) return HtmlService.createHtmlOutput("Link invalido.");
  const found = findPriceReviewRow_(productId, hash);
  if (!found) return HtmlService.createHtmlOutput("Revisao nao encontrada ou ja substituida por uma mudanca mais nova.");
  updatePriceReviewFields_(found.sheet, found.row, {
    AprovadoParaAplicar: false,
    StatusRevisao: "Rejeitado por e-mail",
    AtualizadoEm: new Date()
  });
  return HtmlService.createHtmlOutput("Revisao rejeitada. O site nao foi alterado.");
}

function approveOlxLinkReview_(productId, hash, token) {
  if (!verifyMarketplaceActionToken_("approve-olx-link", productId, hash, token)) return HtmlService.createHtmlOutput("Link invalido.");
  const found = findPriceReviewRowByField_(productId, "LinkOLXHash", hash);
  if (!found) return HtmlService.createHtmlOutput("Revisao de link OLX nao encontrada ou ja substituida por uma mais nova.");
  const link = String(found.values.LinkOLXCandidato || "");
  const result = applyMarketplaceLinkToGithub_(productId, "olx", link, `MobilyTechBR: atualiza link OLX ${productId}`);
  if (!result.ok) {
    updatePriceReviewFields_(found.sheet, found.row, {
      StatusLinkOLX: `Aprovado, mas nao aplicado: ${result.message || "erro desconhecido"}`,
      AtualizadoEm: new Date()
    });
    return HtmlService.createHtmlOutput(`Aprovado, mas ainda nao aplicado no site. ${escapeHtml_(result.message || "")}`);
  }
  updatePriceReviewFields_(found.sheet, found.row, {
    StatusLinkOLX: "Link OLX aprovado e aplicado",
    AtualizadoEm: new Date()
  });
  return HtmlService.createHtmlOutput("Link da OLX aprovado e aplicado no site. O deploy pode levar alguns minutos.");
}

function rejectOlxLinkReview_(productId, hash, token) {
  if (!verifyMarketplaceActionToken_("reject-olx-link", productId, hash, token)) return HtmlService.createHtmlOutput("Link invalido.");
  const found = findPriceReviewRowByField_(productId, "LinkOLXHash", hash);
  if (!found) return HtmlService.createHtmlOutput("Revisao de link OLX nao encontrada ou ja substituida por uma mais nova.");
  updatePriceReviewFields_(found.sheet, found.row, {
    StatusLinkOLX: "Link OLX rejeitado por e-mail",
    AtualizadoEm: new Date()
  });
  return HtmlService.createHtmlOutput("Link da OLX rejeitado. O site nao foi alterado.");
}

function revertMarketplaceAutoChange_(productId, hash, token) {
  if (!verifyMarketplaceActionToken_("revert-price", productId, hash, token)) return HtmlService.createHtmlOutput("Link invalido.");
  const found = findPriceReviewRow_(productId, hash);
  if (!found) return HtmlService.createHtmlOutput("Mudanca nao encontrada ou ja substituida por uma mudanca mais nova.");
  const type = String(found.values.TipoMudanca || "");
  const revertValue = type === "remocao" ? true : parseMoneyNumber_(found.values.PrecoAnterior || found.values.PrecoSite);
  const result = applyMarketplaceChangeToGithub_(productId, type, "", revertValue, `MobilyTechBR: desfaz alteracao ${productId}`);
  if (!result.ok) {
    updatePriceReviewFields_(found.sheet, found.row, {
      StatusRevisao: `Desfazer falhou: ${result.message || "erro desconhecido"}`,
      AtualizadoEm: new Date()
    });
    return HtmlService.createHtmlOutput(`Nao consegui desfazer automaticamente. ${escapeHtml_(result.message || "")}`);
  }
  updatePriceReviewFields_(found.sheet, found.row, {
    StatusRevisao: "Alteracao desfeita pelo botao do e-mail",
    AtualizadoEm: new Date()
  });
  return HtmlService.createHtmlOutput("Pronto, voltei o anuncio como estava antes. O deploy pode levar alguns minutos para aparecer.");
}

function findPriceReviewRow_(productId, hash) {
  return findPriceReviewRowByField_(productId, "MudancaHash", hash);
}

function findPriceReviewRowByField_(productId, field, hash) {
  const sheet = spreadsheet_().getSheetByName(MOBILYTECH.PRICE_REVIEW_SHEET);
  const row = readRows_(sheet).find(({ values }) => String(values.ProdutoID) === String(productId) && String(values[field]) === String(hash));
  return row ? { ...row, sheet } : null;
}

function updatePriceReviewFields_(sheet, row, fields) {
  Object.keys(fields).forEach((header) => {
    const column = priceCol_(header);
    if (column > 0) sheet.getRange(row, column).setValue(fields[header]);
  });
}

function priceCol_(header) {
  return PRICE_HEADERS.indexOf(header) + 1;
}

function buildMarketplaceActionUrl_(action, productId, hash) {
  const baseUrl = ScriptApp.getService().getUrl();
  if (!baseUrl) return "";
  const token = marketplaceActionToken_(action, productId, hash);
  return `${baseUrl}?action=${encodeURIComponent(action)}&product=${encodeURIComponent(productId)}&hash=${encodeURIComponent(hash)}&token=${encodeURIComponent(token)}`;
}

function marketplaceActionToken_(action, productId, hash) {
  const secret = Session.getEffectiveUser().getEmail() || MOBILYTECH.SELLER_EMAIL;
  const raw = `${action}|${productId}|${hash}`;
  return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(raw, secret));
}

function verifyMarketplaceActionToken_(action, productId, hash, token) {
  return token && token === marketplaceActionToken_(action, productId, hash);
}

function applyMarketplaceChangeToGithub_(productId, type, oldValue, newValue, message) {
  if (type !== "preco" && type !== "remocao") return { ok: false, message: "Tipo de mudanca invalido." };
  return updateGithubProducts_((products) => {
    const product = products.find((item) => String(item.id) === String(productId));
    if (!product) return { changed: false, message: "Produto nao encontrado em data/products.json." };
    if (type === "remocao") {
      product.active = Boolean(newValue);
      return { changed: true };
    }
    const nextPrice = Number(newValue);
    if (!Number.isFinite(nextPrice) || nextPrice <= 0) return { changed: false, message: "Preco novo invalido." };
    product.price = nextPrice;
    return { changed: true };
  }, message);
}

function applyMarketplaceLinkToGithub_(productId, key, link, message) {
  return updateGithubProducts_((products) => {
    const product = products.find((item) => String(item.id) === String(productId));
    if (!product) return { changed: false, message: "Produto nao encontrado em data/products.json." };
    product.links = product.links || {};
    product.links[key] = link;
    return { changed: true };
  }, message);
}

function updateGithubProducts_(mutator, message) {
  const config = githubConfig_();
  if (!config.token) {
    return { ok: false, needsConfig: true, message: "Configure GITHUB_TOKEN nas propriedades do Apps Script para permitir alteracoes automaticas no site." };
  }
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${encodeURIComponent(config.path).replace(/%2F/g, "/")}?ref=${encodeURIComponent(config.branch)}`;
  const headers = {
    Authorization: `Bearer ${config.token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
  };
  try {
    const getResponse = UrlFetchApp.fetch(url, { muteHttpExceptions: true, headers });
    const fileData = JSON.parse(getResponse.getContentText() || "{}");
    if (getResponse.getResponseCode() >= 300 || !fileData.content || !fileData.sha) {
      return { ok: false, message: `GitHub recusou leitura de products.json (${getResponse.getResponseCode()}).` };
    }
    const json = Utilities.newBlob(Utilities.base64Decode(String(fileData.content).replace(/\s/g, ""))).getDataAsString("UTF-8");
    const products = JSON.parse(json);
    const mutation = mutator(products);
    if (!mutation.changed) return { ok: false, message: mutation.message || "Nenhuma alteracao aplicada." };
    const payload = {
      message,
      content: Utilities.base64Encode(JSON.stringify(products, null, 2) + "\n"),
      sha: fileData.sha,
      branch: config.branch
    };
    const putResponse = UrlFetchApp.fetch(url, {
      method: "put",
      muteHttpExceptions: true,
      contentType: "application/json",
      headers,
      payload: JSON.stringify(payload)
    });
    if (putResponse.getResponseCode() >= 300) {
      return { ok: false, message: `GitHub recusou gravacao (${putResponse.getResponseCode()}): ${putResponse.getContentText().slice(0, 220)}` };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, message: error.message || "Erro ao atualizar o GitHub." };
  }
}

function githubConfig_() {
  const props = PropertiesService.getScriptProperties();
  return {
    token: props.getProperty("GITHUB_TOKEN") || props.getProperty("MOBILYTECH_GITHUB_TOKEN") || "",
    owner: props.getProperty("GITHUB_OWNER") || "MobilyTechBR",
    repo: props.getProperty("GITHUB_REPO") || "mobilytechbr",
    branch: props.getProperty("GITHUB_BRANCH") || "main",
    path: props.getProperty("GITHUB_PRODUCTS_PATH") || "data/products.json"
  };
}

function emailShell_({ preheader, title, intro, blocks = [], ctaLabel, ctaUrl }) {
  const blocksHtml = blocks.join("");
  const cta = ctaLabel && ctaUrl
    ? `<p style="text-align:center;margin:26px 0 6px"><a href="${ctaUrl}" style="${buttonStyle_()}">${escapeHtml_(ctaLabel)}</a></p>`
    : "";
  return `<!doctype html>
  <html>
  <head>
    <meta name="color-scheme" content="light only">
    <meta name="supported-color-schemes" content="light">
  </head>
  <body style="margin:0;padding:0;background-color:#02070d!important;color:#f5fbff!important">
  <div style="display:none;max-height:0;overflow:hidden;color:#02070d">${escapeHtml_(preheader || "")}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#02070d" style="background-color:#02070d!important;margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;color:#f5fbff!important">
    <tr><td align="center" bgcolor="#02070d" style="padding:28px 14px;background-color:#02070d!important;color:#f5fbff!important">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#061b2a" style="max-width:680px;border:1px solid #136064;border-radius:18px;background-color:#061b2a!important;color:#f5fbff!important;overflow:hidden">
        <tr><td align="center" bgcolor="#082235" style="padding:30px 26px 18px;background-color:#082235!important;color:#f5fbff!important">
          <img src="${MOBILYTECH.LOGO_URL}" width="96" alt="MobilyTech BR" style="display:block;border-radius:999px;margin:0 auto 16px">
          <div style="color:#22f0c4!important;font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase">MobilyTech BR</div>
          <h1 style="margin:10px 0 0;color:#ffffff!important;font-size:32px;line-height:1.08">${escapeHtml_(title)}</h1>
          <p style="margin:14px auto 0;max-width:540px;color:#d7eaf5!important;font-size:16px;line-height:1.55;font-weight:700">${escapeHtml_(intro)}</p>
        </td></tr>
        <tr><td bgcolor="#061b2a" style="padding:10px 26px 28px;background-color:#061b2a!important;color:#f5fbff!important">${blocksHtml}${cta}</td></tr>
        <tr><td bgcolor="#04111d" style="padding:18px 26px;border-top:1px solid #16435a;background-color:#04111d!important;color:#a9bfcc!important;font-size:12px;line-height:1.5;text-align:center">
          MobilyTech BR - PCs e Hardware<br>
          Envio para todo o Brasil | Site oficial | OLX | Facebook Marketplace | Mercado Livre
        </td></tr>
      </table>
    </td></tr>
  </table>
  </body>
  </html>`;
}

function detailBlock_(title, rows) {
  const rowsHtml = rows
    .filter(([, value]) => value !== undefined && value !== null && String(value) !== "")
    .map(([label, value]) => `<tr><td style="padding:7px 0;color:#9fc1d1!important;font-size:12px;font-weight:800;text-transform:uppercase">${escapeHtml_(label)}</td><td style="padding:7px 0;color:#f5fbff!important;font-size:14px;font-weight:800;text-align:right">${escapeHtml_(value)}</td></tr>`)
    .join("");
  return `<div style="${cardStyle_()}"><h2 style="${blockTitleStyle_()}">${escapeHtml_(title)}</h2><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="color:#f5fbff!important">${rowsHtml}</table></div>`;
}

function textBlock_(title, text) {
  return `<div style="${cardStyle_()}"><h2 style="${blockTitleStyle_()}">${escapeHtml_(title)}</h2><p style="margin:0;color:#d7eaf5!important;font-size:14px;line-height:1.6;font-weight:700">${escapeHtml_(text)}</p></div>`;
}

function buttonStyle_(variant) {
  if (variant === "secondary") {
    return "display:inline-block;margin:6px 6px;padding:13px 18px;border:1px solid #2b7696;border-radius:10px;color:#dff7ff!important;background-color:#0b2134!important;text-decoration:none;font-weight:900";
  }
  return "display:inline-block;margin:6px 6px;padding:13px 18px;border-radius:10px;color:#021018!important;background-color:#22f0c4!important;text-decoration:none;font-weight:900";
}

function cardStyle_() {
  return "margin:14px 0 0;padding:18px;border:1px solid #16435a;border-radius:14px;background-color:#082235!important;color:#f5fbff!important";
}

function blockTitleStyle_() {
  return "margin:0 0 12px;color:#22f0c4!important;font-size:13px;letter-spacing:.08em;text-transform:uppercase";
}

function deliverySummary_(order) {
  if (order.ModoEntrega === "pickup") return "Retirada local - Vila Suzana, Sao Paulo, SP";
  return [order.Transportadora, order.ServicoFrete, order.Cep ? `CEP ${order.Cep}` : ""].filter(Boolean).join(" - ");
}

function parseIncomingPayload_(e) {
  if (e.postData && e.postData.contents) {
    const type = String(e.postData.type || "");
    if (type.includes("application/json")) return JSON.parse(e.postData.contents);
  }
  return e.parameter || {};
}

function spreadsheet_() {
  return SpreadsheetApp.openById(MOBILYTECH.SPREADSHEET_ID);
}

function ordersSheet_() {
  return spreadsheet_().getSheetByName(MOBILYTECH.ORDERS_SHEET);
}

function ensureSheet_(ss, name, headers) {
  const sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  const current = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  if (current.join("") !== headers.join("")) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function seedSettings_(sheet) {
  const rows = [
    ["postSaleEmailsEnabled", "true", "Envia e-mails para cliente e vendedor."],
    ["sellerNotificationsEnabled", "true", "Envia aviso interno de venda confirmada."],
    ["sellerEmail", MOBILYTECH.SELLER_EMAIL, "Destino do e-mail interno."],
    ["marketplacePriceSyncEnabled", "false", "Comece desligado."],
    ["marketplacePriceSyncMode", "auto", "review ou auto."],
    ["marketplacePriceSyncIntervalMinutes", "360", "Recomendado: 6 horas."],
    ["marketplacePriceSyncHighConfidenceThreshold", "95", "Minimo para aplicar sozinho."],
    ["marketplacePriceSyncRequireManualApproval", "false", "true bloqueia aplicacao automatica."],
    ["marketplaceRemovalSyncAutoApply", "true", "Permite remover anuncio sozinho apenas com alta confianca."],
    ["marketplaceOlxLinkReviewEnabled", "true", "Sugere links da OLX por e-mail e permite criar SSDs vindos da OLX."],
    ["marketplaceDraftCreationEnabled", "true", "Cria rascunhos inativos para novos anuncios do Facebook e SSDs novos da OLX."],
    ["marketplaceFacebookProfileUrl", "https://www.facebook.com/marketplace/profile/100035688601043/?ref=permalink&mibextid=6ojiHh", "Perfil do Facebook Marketplace usado para detectar anuncios novos."],
    ["marketplaceOlxProfileUrl", "https://www.olx.com.br/perfil/julian-859fd666", "Perfil OLX usado para sugerir links e detectar SSDs novos."]
  ];
  if (sheet.getLastRow() <= 1) sheet.getRange(2, 1, rows.length, 3).setValues(rows);
}

function shouldRunMarketplacePriceReview_(settings) {
  const intervalMinutes = Math.max(30, Number(settings.marketplacePriceSyncIntervalMinutes || 360));
  const props = PropertiesService.getScriptProperties();
  const key = "marketplacePriceSyncLastRunAt";
  const lastRunAt = Number(props.getProperty(key) || 0);
  const now = Date.now();
  if (lastRunAt && now - lastRunAt < intervalMinutes * 60 * 1000) return false;
  props.setProperty(key, String(now));
  return true;
}

function installTrigger_(handler, minutes) {
  ScriptApp.getProjectTriggers()
    .filter((trigger) => trigger.getHandlerFunction() === handler)
    .forEach((trigger) => ScriptApp.deleteTrigger(trigger));
  ScriptApp.newTrigger(handler).timeBased().everyMinutes(minutes).create();
}

function mergedSettings_() {
  return { ...sheetSettings_(), ...siteSettings_() };
}

function sheetSettings_() {
  const sheet = spreadsheet_().getSheetByName(MOBILYTECH.SETTINGS_SHEET);
  if (!sheet || sheet.getLastRow() < 2) return {};
  return Object.fromEntries(sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues().filter((row) => row[0]).map((row) => [row[0], row[1]]));
}

function siteSettings_() {
  try {
    const response = UrlFetchApp.fetch(`${MOBILYTECH.SETTINGS_URL}?t=${Date.now()}`, { muteHttpExceptions: true });
    if (response.getResponseCode() >= 300) return {};
    return JSON.parse(response.getContentText());
  } catch (_error) {
    return {};
  }
}

function readRows_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  return sheet.getRange(2, 1, lastRow - 1, headers.length).getValues().map((rowValues, index) => ({
    row: index + 2,
    values: Object.fromEntries(headers.map((header, i) => [header, rowValues[i]]))
  }));
}

function col_(header) {
  return ORDER_HEADERS.indexOf(header) + 1;
}

function fetchSiteProducts_(includeInactive) {
  try {
    const response = UrlFetchApp.fetch(`${MOBILYTECH.SITE_URL}/data/products.json?t=${Date.now()}`, { muteHttpExceptions: true });
    if (response.getResponseCode() >= 300) return [];
    const products = JSON.parse(response.getContentText());
    return includeInactive ? products : products.filter((product) => product.active !== false);
  } catch (_error) {
    return [];
  }
}

function buildActionUrl_(action, orderId) {
  const baseUrl = ScriptApp.getService().getUrl();
  if (!baseUrl) return "";
  const token = actionToken_(orderId);
  return `${baseUrl}?action=${encodeURIComponent(action)}&order=${encodeURIComponent(orderId)}&token=${encodeURIComponent(token)}`;
}

function actionToken_(orderId) {
  const secret = Session.getEffectiveUser().getEmail() || MOBILYTECH.SELLER_EMAIL;
  const raw = `${orderId}|${Utilities.formatDate(new Date(), "GMT", "yyyyMMdd")}`;
  return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(raw, secret));
}

function verifyActionToken_(orderId, token) {
  return token && token === actionToken_(orderId);
}

function settingBool_(value, fallback) {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value).toLowerCase() === "true";
}

function formatMoneyText_(value) {
  const number = parseMoneyNumber_(value);
  if (!Number.isFinite(number)) return String(value || "");
  return `R$ ${number.toFixed(2).replace(".", ",")}`;
}

function parseMoneyNumber_(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : NaN;
  let text = String(value || "").replace(/[^\d,.-]/g, "").trim();
  if (!text) return NaN;
  const hasComma = text.includes(",");
  const hasDot = text.includes(".");
  if (hasComma && hasDot) {
    text = text.replace(/\./g, "").replace(",", ".");
  } else if (hasComma) {
    text = text.replace(",", ".");
  }
  const number = Number(text);
  return Number.isFinite(number) ? number : NaN;
}

function absoluteSiteUrl_(value) {
  if (!value) return "";
  const text = String(value);
  if (/^https?:\/\//i.test(text)) return text;
  return `${MOBILYTECH.SITE_URL}/${text.replace(/^\.\//, "").replace(/^\//, "")}`;
}

function parseJson_(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (_error) {
    return fallback;
  }
}

function escapeHtml_(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sendTestConfirmationEmail() {
  sendCustomerConfirmation_({
    ClienteNome: "Julian",
    ClienteEmail: MOBILYTECH.SELLER_EMAIL,
    Produto: "PC Gamer MobilyTech BR",
    Opcionais: "SSD 240GB",
    ValorPago: "950",
    ModoEntrega: "shipping",
    Transportadora: "Correios",
    ServicoFrete: "SEDEX",
    Cep: "05641-090"
  });
}
