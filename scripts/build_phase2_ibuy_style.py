from __future__ import annotations

import html
import json
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
FASE2_DIR = ROOT / "fase2"

GENERATED_AT = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
CHECKOUT_POLICY_VERSION = "2026-06-20-client-legal-import-tax-checkout"
FAVICON_VERSION = "20260621"

LEGAL_PAGES = {
    "termos": {
        "title": "Termos de Compra",
        "kicker": "Compra direta MobilyTech BR",
        "intro": "Aqui voce encontra as principais condicoes para comprar pelo site da MobilyTech BR antes de finalizar o pagamento.",
        "sections": [
            ("Identificacao da loja", "A loja e a MobilyTech BR, CNPJ 66.834.883/0001-43, com atendimento pelo WhatsApp +55 (11) 95480-1967 e pelo e-mail mobilytechbr@gmail.com. A atuacao principal e pela internet, com referencia em Vila Suzana, Sao Paulo, SP."),
            ("Quem atende sua compra", "Quando voce compra direto pelo site, o atendimento de venda e pos-venda e feito pela MobilyTech BR. Fornecedores, transportadoras e meios de pagamento podem participar da entrega ou do pagamento; fale com a MobilyTech BR sempre que precisar de ajuda sobre o pedido."),
            ("Antes de pagar", "Confira o produto, quantidade, preco, frete, prazo estimado, origem de envio e dados informados antes de seguir para o pagamento. Se notar qualquer erro, ajuste o carrinho ou fale com a loja antes de concluir."),
            ("Produtos sob encomenda", "Alguns produtos podem ser comprados sob encomenda pela MobilyTech BR. Nesses casos, o preco do produto considera a compra nacional ate a loja, e o frete final ate voce aparece no carrinho antes do pagamento."),
            ("Pagamento e confirmacao", "O pagamento e processado por checkout seguro de parceiro autorizado, como Mercado Pago. O pedido e confirmado apos aprovacao do pagamento e verificacao das informacoes necessarias para entrega."),
            ("Se algo der errado", "Em caso de atraso, divergencia, defeito, extravio ou duvida, entre em contato pelos canais oficiais. A MobilyTech BR acompanha o caso e orienta a solucao aplicavel, sem afastar os direitos previstos na legislacao de consumo."),
        ],
    },
    "privacidade": {
        "title": "Politica de Privacidade",
        "kicker": "LGPD e dados pessoais",
        "intro": "Veja como seus dados pessoais sao usados para atendimento, pedido, pagamento, entrega, seguranca e suporte.",
        "sections": [
            ("Dados que podemos usar", "Podemos tratar nome, e-mail, telefone, documento, endereco, CEP, itens do pedido, mensagens de atendimento, informacoes de entrega e registros de aceite no checkout."),
            ("Para que usamos", "Usamos esses dados para responder voce, calcular frete, criar pedido, processar pagamento, acompanhar entrega, prevenir fraude, cumprir obrigacoes legais e prestar suporte pos-venda."),
            ("Pagamento", "Dados sensiveis de cartao e carteira digital sao tratados pelo provedor de pagamento. A MobilyTech BR nao precisa armazenar numero completo de cartao para concluir sua compra."),
            ("Compartilhamento necessario", "Podemos compartilhar dados minimos com meios de pagamento, transportadoras, fornecedores logisticos, ferramentas de hospedagem e atendimento quando isso for necessario para executar o pedido ou responder sua solicitacao."),
            ("Parceiros de entrega", "Quando necessario, dados minimos podem ser compartilhados com transportadoras, Correios e operadores logisticos para preparar e transportar o pedido."),
            ("Seus direitos", "Voce pode solicitar orientacao sobre acesso, correcao, eliminacao ou informacoes de compartilhamento de dados pelos canais oficiais da MobilyTech BR."),
        ],
    },
    "trocas": {
        "title": "Trocas, Devolucoes e Reembolso",
        "kicker": "Suporte pos-venda",
        "intro": "Entenda como pedir ajuda depois da compra em casos de arrependimento, defeito, divergencia, atraso ou nao entrega.",
        "sections": [
            ("Arrependimento em compra online", "Voce pode solicitar desistenca da compra feita pela internet dentro do prazo legal de 7 dias, contado do recebimento do produto ou da contratacao do servico. Use WhatsApp ou e-mail oficial para registrar o pedido."),
            ("Como devolver", "Quando houver produto fisico, mantenha item, acessorios e embalagem em boas condicoes sempre que possivel. A MobilyTech BR informa o procedimento de envio, coleta ou analise conforme o caso."),
            ("Defeito ou produto divergente", "Se o produto chegar com defeito, dano, item errado ou informacao diferente do anuncio, fale com a MobilyTech BR e envie fotos, videos e numero do pedido para acelerar a analise."),
            ("Produto nao entregue ou atrasado", "Se o rastreio parar, houver atraso relevante ou indicacao de extravio, a MobilyTech BR acompanha o pedido com fornecedor ou transportadora e informa a alternativa aplicavel."),
            ("Reembolso", "Quando o reembolso for devido, ele segue o mesmo meio de pagamento sempre que possivel. O prazo pode depender do provedor de pagamento, do banco e da etapa de analise do pedido."),
        ],
    },
    "entrega": {
        "title": "Entrega e Prazos",
        "kicker": "Frete e rastreio",
        "intro": "Veja como funcionam retirada local, envio nacional, produtos sob encomenda, rastreio e prazo estimado.",
        "sections": [
            ("Retirada local", "A retirada local pode estar disponivel para servicos ou produtos proprios. Quando aparecer como opcao, combine dia e horario pelos canais oficiais apos a confirmacao do pedido."),
            ("Frete no carrinho", "Antes de pagar, informe o CEP e confira o valor do frete, o prazo estimado e a modalidade de envio. O carrinho mostra produto e frete separados no total da compra."),
            ("Envio nacional", "Produtos no Brasil podem ser enviados por transportadora, Correios ou parceiro logistico conforme disponibilidade para o CEP informado."),
            ("Produtos sob encomenda", "Produtos sob encomenda sao comprados pela MobilyTech BR antes do envio final. O valor do produto e o frete ate o cliente aparecem separados no carrinho antes do pagamento."),
            ("Prazos de encomenda", "Produtos sob encomenda podem precisar de prazo adicional para compra, recebimento e conferencia pela MobilyTech BR antes do envio final ao cliente."),
            ("Rastreio e atendimento", "Quando houver codigo de rastreio, ele sera informado nos canais de atendimento ou na area do cliente assim que estiver disponivel."),
        ],
    },
    "garantia": {
        "title": "Garantia",
        "kicker": "Cobertura e suporte",
        "intro": "A garantia depende do tipo de produto ou servico comprado. Leia a cobertura junto das informacoes do anuncio e do atendimento.",
        "sections": [
            ("Produtos proprios", "PCs, pecas e equipamentos proprios seguem a garantia informada no anuncio, proposta ou atendimento antes da compra. Se a cobertura especifica nao estiver clara, pergunte antes de pagar."),
            ("Servicos", "Montagem, limpeza e manutencao seguem o escopo combinado com voce, incluindo o que foi solicitado, aprovado e registrado no atendimento."),
            ("Produtos sob encomenda", "Produtos sob encomenda seguem atendimento inicial pela MobilyTech BR. Quando houver garantia do fabricante ou marketplace de origem, a loja orienta o procedimento aplicavel sem afastar direitos de consumo."),
            ("O que pode ser analisado", "Em caso de defeito, dano no transporte, produto diferente do anuncio, mau funcionamento ou ausencia de item, envie fotos, videos e numero do pedido."),
            ("O que pode ficar fora", "Mau uso, dano fisico causado apos o recebimento, instalacao inadequada, alteracao nao autorizada, queda, liquido ou incompatibilidade nao informada antes da compra podem exigir analise especifica."),
        ],
    },
}

BRANDS = [
    ("intel", "Intel"),
    ("amd", "AMD"),
    ("nvidia", "NVIDIA"),
    ("microsoft", "Microsoft"),
    ("corsair", "Corsair"),
    ("msi", "MSI"),
    ("asus", "ASUS"),
    ("gigabyte", "Gigabyte"),
    ("evga", "EVGA"),
    ("kingston", "Kingston"),
    ("crucial", "Crucial"),
    ("pny", "PNY"),
]

REVIEWS = [
    {
        "name": "Cliente OLX",
        "source": "OLX",
        "text": "PC chegou rapido, bem embalado e exatamente como combinado. Atendimento claro do inicio ao fim.",
    },
    {
        "name": "Rafael S.",
        "source": "WhatsApp",
        "text": "Tirei minhas duvidas antes da compra e recebi suporte depois. Recomendo para quem quer PC revisado.",
    },
    {
        "name": "Matheus P.",
        "source": "Facebook",
        "text": "Comprei um PC gamer e veio melhor do que eu esperava. Transparencia no preco e nas pecas.",
    },
    {
        "name": "Gabriel T.",
        "source": "OLX",
        "text": "Loja confiavel, entrega combinada certinho e garantia explicada antes da compra.",
    },
]

DEFAULT_SITE_CONTENT = {
    "featureFlags": {
        "auth": {
            "google": True,
            "microsoft": False,
        },
        "payments": {
            "mercadoPago": True,
            "abacatePay": False,
        },
        "catalog": {
            "physicalProducts": False,
            "dropshippingProducts": True,
        },
    },
    "homeHero": {
        "title": "PCs revisados para jogar, trabalhar e criar.",
        "subtitle": "Computadores testados por especialistas, upgrades sob medida e atendimento direto da MobilyTech BR.",
        "primaryLabel": "Ver catalogo de PCs",
        "secondaryLabel": "Monte seu PC",
        "featuredProductId": "pc-gamer-i5-gt610",
        "featuredKicker": "Em destaque",
        "backgroundMode": "preset",
        "backgroundPreset": "sky",
        "backgroundImage": "",
    },
    "homeFeaturedProducts": {
        "finds": [
            "find-aff-amazon-auto-b0bxfbn121-placa-m-e-gigabyte-a520m-k-v2-am4-2xddr4-hdmi-d-sub-m-2-usb-3-2",
            "find-aff-amazon-auto-b08dqb2gdn-placa-m-e-asus-para-amd-am4-prime-a520m-k-2xddr4-matx-90mb1500-m0eay0",
            "find-aff-amazon-auto-b08ckgw1d4-placa-m-e-asus-tuf-gaming-a520m-plus-ii-am4-4xddr4-hdmi-displayport-d",
        ],
        "dropshipping": [
            "sob-ssd-kingston-a400-480gb",
            "sob-ram-kingston-ddr4-8gb-notebook",
            "sob-fonte-duex-500w-bronze",
            "sob-roteador-tplink-archer-c6",
            "sob-teclado-redragon-sindri-abnt2",
            "sob-hub-usbc-ugreen-5em1",
        ],
    },
    "servicePanels": {
        "build": {
            "image": "./assets/phase2-service-build-reference.png",
            "alt": "Monte seu PC MobilyTech",
            "label": "Monte seu PC - solicitar orcamento",
        },
        "clean": {
            "image": "./assets/phase2-service-clean-reference.png",
            "alt": "Limpeza de PC MobilyTech",
            "label": "Limpeza de PC - agendar limpeza",
        },
        "cleanFormImage": "./assets/phase2-clean-form-visual.png",
    },
    "pages": {
        "ofertas": {
            "title": "PCs revisados e hardware em estoque",
            "intro": "Catalogo visual inspirado em lojas gamer, com produtos reais da MobilyTech BR, carrinho, frete e checkout online.",
            "image": "",
        },
        "achados": {
            "title": "MobilyTech Finds",
            "intro": "Achados de hardware, perifericos e setup com links diretos para marketplaces parceiros.",
            "image": "./assets/mobilytech-character-cutout.png",
        },
        "produtos": {
            "title": "Produtos sob encomenda na MobilyTech BR",
            "intro": "Produtos nacionais selecionados para setup, trabalho, upgrades e manutencao. O preco do produto ja considera a compra ate a MobilyTech BR; o envio final e calculado pelo CEP no carrinho.",
            "image": "./assets/mobilytech-character-cutout.png",
        },
        "montagem": {
            "title": "Monte seu PC com a MobilyTech BR",
            "intro": "Conte o objetivo, o orcamento e o que voce ja tem. A gente monta uma proposta coerente, sem empurrar peca desnecessaria.",
            "image": "./assets/phase2-service-build-reference.png",
        },
        "limpeza": {
            "title": "Limpeza e relatorio do PC",
            "intro": "Servico de limpeza com cuidado, organizacao e registro visual do antes/depois para manter o computador confiavel.",
            "image": "./assets/phase2-service-clean-reference.png",
        },
        "conta": {
            "title": "Minha conta e pedidos",
            "intro": "Entre com sua conta para acompanhar pedidos, dados de entrega e suporte de pos-venda em um lugar so.",
        },
    },
}


def load_json(name: str, default):
    path = DATA / name
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return default


def money(value) -> str:
    try:
        amount = float(value)
    except (TypeError, ValueError):
        amount = 0
    formatted = f"{amount:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    return f"R$ {formatted}"


def clean_text(value: str) -> str:
    return html.escape(str(value or ""), quote=True)


def merge_dict(default: dict, override: dict | None) -> dict:
    result = json.loads(json.dumps(default, ensure_ascii=False))
    if not isinstance(override, dict):
        return result
    for key, value in override.items():
        if isinstance(value, dict) and isinstance(result.get(key), dict):
            result[key] = merge_dict(result[key], value)
        else:
            result[key] = value
    return result


def feature_enabled(site_content: dict | None, group: str, key: str, default: bool = True) -> bool:
    flags = site_content.get("featureFlags", {}) if isinstance(site_content, dict) else {}
    section = flags.get(group, {}) if isinstance(flags, dict) else {}
    if isinstance(section, dict) and key in section:
        return bool(section.get(key))
    return default


def asset_path(prefix: str, path: str) -> str:
    value = str(path or "")
    if value.startswith(("http://", "https://", "data:")):
        return value
    return f"{prefix}{value.replace('./', '')}"


def product_by_id(products, product_id):
    return next((item for item in products if str(item.get("id")) == str(product_id)), None)


PUBLIC_FIND_FIELDS = {
    "id",
    "title",
    "niche",
    "whySell",
    "marketplace",
    "affiliateLinks",
    "affiliateUrl",
    "affiliateReady",
    "publicPartnerNote",
    "productImage",
    "selectedCreative",
    "productId",
    "salePrice",
    "priceBand",
    "publicShippingNote",
    "publicOriginNote",
    "shippingOrigin",
    "shippingScope",
    "addOnOnly",
    "comboRecommended",
    "freightRiskLevel",
    "freightRatio",
    "addOnMinSubtotalBrl",
}

PUBLIC_PRODUCT_FIELDS = {
    "id",
    "active",
    "category",
    "title",
    "price",
    "old",
    "badge",
    "image",
    "cutout",
    "gallery",
    "photo",
    "tags",
    "specs",
    "links",
    "shipping",
    "publicShippingNote",
    "publicOriginNote",
    "reviewFlags",
    "featured",
    "swaps",
    "variants",
    "allowQuantity",
    "madeToOrder",
    "supplierPlatform",
    "supplierReferenceUrl",
    "supplierCost",
    "inboundShippingCost",
    "baseCost",
    "targetMarginPercent",
    "marginPercent",
    "sourceNotes",
}


def public_finds_payload(finalists, products=None, site_content: dict | None = None):
    def clean_marketplace(value):
        if not isinstance(value, dict):
            return {}
        clean_value = {
            key: value.get(key)
            for key in ("name", "logo", "button", "class")
            if value.get(key)
        }
        clean_value["button"] = "Ver oferta"
        return clean_value

    def clean_affiliate_links(value):
        links = value if isinstance(value, list) else []
        public_links = []
        for link in links:
            if not isinstance(link, dict) or not link.get("url"):
                continue
            public_links.append(
                {
                    key: link.get(key)
                    for key in ("name", "platform", "url", "logo", "button", "class")
                    if link.get(key)
                }
            )
            public_links[-1]["button"] = "Ver oferta"
        return public_links

    def clean_public_find(item):
        clean_item = {key: item.get(key) for key in PUBLIC_FIND_FIELDS if key in item}
        clean_item["marketplace"] = clean_marketplace(clean_item.get("marketplace"))
        clean_item["affiliateLinks"] = clean_affiliate_links(clean_item.get("affiliateLinks"))
        if clean_item.get("affiliateReady") is False:
            clean_item.pop("affiliateUrl", None)
            clean_item["affiliateLinks"] = []
        clean_item["publicPartnerNote"] = (
            "Compra feita diretamente no marketplace parceiro; pagamentos e dados sensiveis ficam no provedor externo."
        )
        marketplace_name = str((clean_item.get("marketplace") or {}).get("name") or item.get("platform") or "")
        if not clean_item.get("shippingScope"):
            clean_item["shippingScope"] = "internacional" if "ali" in marketplace_name.lower() else "nacional"
        if not clean_item.get("salePrice"):
            fallback_price = (
                price_by_image.get(clean_item.get("productImage"))
                or price_by_image.get(clean_item.get("selectedCreative"))
            )
            if fallback_price:
                clean_item["salePrice"] = fallback_price
        return clean_item

    items = finalists.get("finalists", []) if isinstance(finalists, dict) else []
    price_by_image = {}
    for source_item in items:
        price = source_item.get("salePrice")
        if not price:
            continue
        for image_key in (source_item.get("productImage"), source_item.get("selectedCreative")):
            if image_key and image_key not in price_by_image:
                price_by_image[image_key] = price
    product_items = products or []
    finalists_by_product_id = {}
    for item in items:
        for key in (item.get("productId"), f"find-{item.get('id', '')}" if item.get("id") else None):
            if key:
                finalists_by_product_id[key] = item
    public_items = []
    if dropshipping_catalog_enabled(site_content):
        for product in product_items:
            if product.get("active") is False or not is_direct_order_product(product):
                continue
            finalist = finalists_by_product_id.get(product.get("id"), {})
            finalist_mode = finalist.get("purchaseMode")
            if finalist_mode == "affiliate" or finalist.get("publicGroup") == "recomendacoes":
                continue
            specs_data = product.get("specs") or {}
            shipping = product.get("shipping") or {}
            scope = "nacional" if not is_legacy_dropshipping_product(product) else "internacional"
            raw_region = str(shipping.get("region") or product.get("supplierRegion") or "").lower()
            if any(value in raw_region for value in ("br", "brasil", "nacional", "local")):
                scope = "nacional"
            made_to_order = not is_legacy_dropshipping_product(product)
            clean_item = {
                "id": product.get("id"),
                "productId": product.get("id"),
                "title": product.get("title"),
                "niche": product.get("niche") or finalist.get("niche") or specs_data.get("niche") or specs_data.get("category") or "Setup e tecnologia",
                "priceBand": product.get("priceBand") or specs_data.get("priceBand") or "",
                "whySell": finalist.get("whySell")
                or product.get("description")
                or "Produto selecionado para complementar seu setup com atendimento MobilyTech.",
                "confidence": finalist.get("confidence") or product.get("badge") or "Curadoria MobilyTech",
                "productImage": finalist.get("productImage") or product.get("image") or finalist.get("selectedCreative"),
                "selectedCreative": finalist.get("selectedCreative") or finalist.get("productImage") or product.get("image"),
                "salePrice": finalist.get("salePrice") or product.get("price"),
                "marketplace": {
                    "name": "MobilyTech BR",
                    "logo": "assets/mobilytech-logo.png",
                    "button": "Adicionar ao carrinho",
                    "class": "market-mobilytech",
                },
                "affiliateReady": True,
                "affiliateButton": "Adicionar ao carrinho",
                "publicPartnerNote": "Compra direta no site MobilyTech BR. Frete calculado antes do pagamento.",
                "publicShippingNote": product.get("publicShippingNote") or ("Preco do produto ja considera compra nacional ate a MobilyTech; envio final por CEP no carrinho." if made_to_order else "Frete recalculado pelo CEP antes do pagamento."),
                "publicOriginNote": product.get("publicOriginNote") or ("Produto nacional sob encomenda, com conferencia MobilyTech antes do envio final." if made_to_order else ("Envio internacional por fornecedor parceiro." if scope == "internacional" else "Envio por fornecedor parceiro.")),
                "shippingScope": scope,
                "addOnOnly": bool(shipping.get("addOnOnly")),
                "comboRecommended": bool(shipping.get("comboRecommended")),
                "freightRiskLevel": shipping.get("freightRiskLevel") or "",
                "freightRatio": shipping.get("freightRatio"),
                "addOnMinSubtotalBrl": shipping.get("addOnMinSubtotalBrl"),
                "storeCheckout": True,
                "publicGroup": "vendidos",
            }
            public_items.append(clean_item)
    for item in items:
        if item.get("purchaseMode") == "manual-dropshipping" or bool(item.get("manualFulfillment")):
            continue
        clean_item = clean_public_find(item)
        clean_item["storeCheckout"] = item.get("purchaseMode") == "manual-dropshipping" or bool(item.get("manualFulfillment"))
        clean_item["publicGroup"] = item.get("publicGroup") or ("vendidos" if clean_item["storeCheckout"] else "recomendacoes")
        if clean_item["storeCheckout"]:
            clean_item.pop("affiliateUrl", None)
        clean_item.setdefault(
            "publicPartnerNote",
            "Selecionado para complementar setups, upgrades e manutencao com compra segura.",
        )
        public_items.append(clean_item)
    return public_items


def is_direct_order_product(product: dict | None) -> bool:
    if not isinstance(product, dict):
        return False
    category = str(product.get("category") or "").strip().lower()
    return category in {"dropshipping", "sob-encomenda", "sob_encomenda", "encomenda"} or bool(product.get("madeToOrder"))


def is_legacy_dropshipping_product(product: dict | None) -> bool:
    return str((product or {}).get("category") or "").strip().lower() == "dropshipping"


def dropshipping_sellable(product):
    if product.get("active") is False or not is_direct_order_product(product):
        return False
    if product.get("checkoutEnabled") is not True:
        return False
    if not (
        product.get("supplierReferenceUrl")
        or product.get("supplierUrl")
        or product.get("sourceUrl")
        or product.get("supplierSearchUrl")
    ):
        return False
    try:
        price = float(product.get("price") or 0)
        cost = float(product.get("costPrice") or product.get("supplierCost") or 0)
    except (TypeError, ValueError):
        return False
    if price <= 0 or cost <= 0:
        return False
    if not is_legacy_dropshipping_product(product):
        return True
    if product.get("requireExactSupplierFreight") is not True:
        return False
    shipping = product.get("shipping") or {}
    if shipping.get("exactRequired") is not True:
        return False
    if shipping.get("liveQuoteReady") is not True:
        return False
    cj_data = product.get("cj") or {}
    if not (cj_data.get("vid") or product.get("cjVariantId") or product.get("cjVid")):
        return False
    return True


def physical_catalog_enabled(site_content: dict | None = None) -> bool:
    return feature_enabled(site_content, "catalog", "physicalProducts", False)


def dropshipping_catalog_enabled(site_content: dict | None = None) -> bool:
    return feature_enabled(site_content, "catalog", "dropshippingProducts", True)


def public_products_payload(products, site_content: dict | None = None):
    public_items = []
    include_physical = physical_catalog_enabled(site_content)
    include_dropshipping = dropshipping_catalog_enabled(site_content)
    for item in products:
        if item.get("active") is False:
            continue
        category = item.get("category")
        if category == "affiliate":
            continue
        if is_direct_order_product(item):
            if not include_dropshipping or not dropshipping_sellable(item):
                continue
        elif not include_physical:
            continue
        clean_item = {key: item.get(key) for key in PUBLIC_PRODUCT_FIELDS if key in item}
        public_items.append(clean_item)
    return public_items


def public_dropshipping_payload(products, site_content: dict | None = None):
    if not dropshipping_catalog_enabled(site_content):
        return []
    public_items = []
    for product in products:
        if not dropshipping_sellable(product):
            continue
        specs_data = product.get("specs") or {}
        shipping = product.get("shipping") or {}
        scope = "nacional" if not is_legacy_dropshipping_product(product) else "internacional"
        raw_region = str(shipping.get("region") or product.get("supplierRegion") or "").lower()
        if any(value in raw_region for value in ("br", "brasil", "nacional", "local")):
            scope = "nacional"
        made_to_order = not is_legacy_dropshipping_product(product)
        public_items.append(
            {
                "id": f"drop-{product.get('id')}",
                "productId": product.get("id"),
                "title": product.get("title"),
                "niche": product.get("niche") or specs_data.get("niche") or specs_data.get("category") or product.get("badge") or "Acessorios",
                "priceBand": product.get("priceBand") or specs_data.get("priceBand") or "",
                "whySell": product.get("description")
                or specs_data.get("operation")
                or "Selecionado pela MobilyTech BR com checkout seguro e acompanhamento humano.",
                "confidence": product.get("badge") or "Selecionado MobilyTech",
                "productImage": product.get("cutout") or product.get("image"),
                "selectedCreative": product.get("cutout") or product.get("image"),
                "salePrice": product.get("price"),
                "marketplace": {
                    "name": "MobilyTech BR",
                    "logo": "assets/mobilytech-logo.png",
                    "button": "Comprar",
                    "class": "market-mobilytech",
                },
                "affiliateReady": True,
                "affiliateButton": "Comprar",
                "publicPartnerNote": "Compra direta no site MobilyTech BR. Frete calculado antes do pagamento.",
                "publicShippingNote": product.get("publicShippingNote") or ("Preco do produto ja considera compra nacional ate a MobilyTech; envio final por CEP no carrinho." if made_to_order else "Frete recalculado pelo CEP antes do pagamento."),
                "publicOriginNote": product.get("publicOriginNote") or ("Produto nacional sob encomenda, com conferencia MobilyTech antes do envio final." if made_to_order else ("Envio internacional por fornecedor parceiro." if scope == "internacional" else "Envio por fornecedor parceiro.")),
                "shippingScope": scope,
                "addOnOnly": bool(shipping.get("addOnOnly")),
                "comboRecommended": bool(shipping.get("comboRecommended")),
                "freightRiskLevel": shipping.get("freightRiskLevel") or "",
                "freightRatio": shipping.get("freightRatio"),
                "addOnMinSubtotalBrl": shipping.get("addOnMinSubtotalBrl"),
                "storeCheckout": True,
                "publicGroup": "produtos",
            }
        )
    return public_items


def page_links(prefix: str) -> dict[str, str]:
    home = f"{prefix}index.html" if prefix else "./index.html"
    base = f"{prefix}fase2/"
    return {
        "home": home,
        "produtos": f"{base}nossos-produtos.html",
        "ofertas": f"{base}ofertas.html",
        "montagem": f"{base}montagem.html",
        "limpeza": f"{base}limpeza.html",
        "achados": f"{base}achados.html",
        "avaliacoes": f"{base}avaliacoes.html",
        "conta": f"{base}minha-conta.html",
        "contato": f"{base}contato.html",
        "termos": f"{base}termos.html",
        "privacidade": f"{base}privacidade.html",
        "trocas": f"{base}trocas-devolucoes.html",
        "entrega": f"{base}entrega-prazos.html",
        "garantia": f"{base}garantia.html",
    }


def header(prefix: str, active: str = "home", site_content: dict | None = None) -> str:
    links = page_links(prefix)
    google_enabled = feature_enabled(site_content, "auth", "google", True)
    microsoft_enabled = feature_enabled(site_content, "auth", "microsoft", False)
    dropshipping_enabled = dropshipping_catalog_enabled(site_content)
    guest_actions = "\n".join(
        item
        for item in [
            f'<a class="account-login google-login" id="accountGoogleLogin" href="/api/account?action=google-start"><img src="{prefix}assets/brand-officials/google-icon.svg" alt="" aria-hidden="true"><span>Entrar com Google</span></a>'
            if google_enabled
            else "",
            f'<a class="account-login microsoft-login" id="accountMicrosoftLogin" href="/api/account?action=microsoft-start"><img src="{prefix}assets/brand-officials/microsoft-icon.svg" alt="" aria-hidden="true"><span>Entrar com Microsoft</span></a>'
            if microsoft_enabled
            else "",
        ]
        if item
    )
    status_copy = (
        "Acesse com Google para acompanhar compras e dados de entrega."
        if google_enabled
        else "Acompanhe compras e dados de entrega quando o login estiver disponivel."
    )
    if physical_catalog_enabled(site_content):
        nav = [
            ("ofertas", "PC Gamer", "pc-gamer"),
            ("achados", "MobilyTech Finds", "achados"),
            ("ofertas", "Hardware", "hardware"),
            ("montagem", "Monte seu PC", "montagem"),
            ("limpeza", "Limpeza", "limpeza"),
            ("avaliacoes", "Avaliacoes", "avaliacoes"),
            ("contato", "Suporte", "contato"),
        ]
        if dropshipping_enabled:
            nav.insert(1, ("produtos", "Sob encomenda", "produtos"))
    else:
        nav = [
            ("home", "Inicio", "home"),
            ("achados", "MobilyTech Finds", "achados"),
            ("montagem", "Monte seu PC", "montagem"),
            ("limpeza", "Limpeza", "limpeza"),
            ("avaliacoes", "Avaliacoes", "avaliacoes"),
            ("contato", "Suporte", "contato"),
        ]
        if dropshipping_enabled:
            nav.insert(1, ("produtos", "Sob encomenda", "produtos"))
    nav_parts = []
    default_nav_key = "pc-gamer" if active == "ofertas" else active
    for index, (href_key, label, active_key) in enumerate(nav):
        if index:
            nav_parts.append('<span class="nav-separator" aria-hidden="true">|</span>')
        href = links[href_key]
        if href_key == "ofertas":
            separator = "&" if "?" in href else "?"
            href = f"{href}{separator}nav={active_key}#catalogGrid"
        is_active = active_key == default_nav_key
        aria_current = ' aria-current="page"' if is_active else ""
        nav_parts.append(
            f'<a class="nav-link{" active" if is_active else ""}" data-nav-key="{active_key}"{aria_current} href="{href}">{label}</a>'
        )
    nav_html = "\n".join(nav_parts)
    account_button_class = "icon-action account-action" + (" active" if active == "conta" else "")
    return f"""
    <header class="site-header">
      <div class="topbar">
        <div class="topbar-inner">
          <button class="ticker-arrow" type="button" aria-label="Promocao anterior">&#8249;</button>
          <p>Ofertas MobilyTech BR: PCs revisados, upgrades e atendimento direto para fechar sua compra com seguranca.</p>
          <button class="ticker-arrow" type="button" aria-label="Proxima promocao">&#8250;</button>
        </div>
      </div>
      <div class="nav-shell">
        <a class="brand" href="{links["home"]}" aria-label="MobilyTech BR">
          <img src="{prefix}assets/mobilytech-logo.png" alt="MobilyTech BR">
          <span>MobilyTech BR</span>
        </a>
        <nav class="main-nav" aria-label="Navegacao principal">{nav_html}</nav>
        <div class="search-zone">
          <label class="search-pill">
            <span aria-hidden="true">&#128269;</span>
            <input id="siteSearch" type="search" placeholder="Buscar PCs, SSDs...">
          </label>
          <div class="search-results" id="searchResults" hidden></div>
        </div>
        <div class="account-menu-wrap">
          <button class="{account_button_class}" id="accountMenuButton" type="button" aria-label="Abrir menu da conta" aria-controls="accountPopover" aria-expanded="false">
            <span aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img" focusable="false"><path d="M12 12.25a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Zm0 2.05c-4.2 0-7.6 2.33-7.6 5.2 0 .62.5 1.12 1.12 1.12h12.96c.62 0 1.12-.5 1.12-1.12 0-2.87-3.4-5.2-7.6-5.2Z"/></svg>
            </span>
          </button>
          <div class="account-popover" id="accountPopover" hidden>
            <p class="account-popover-kicker" id="accountGreeting">Conta MobilyTech</p>
            <strong id="accountMenuTitle">Entre para ver seus pedidos</strong>
            <small id="accountMenuStatus">{status_copy}</small>
            <div class="account-popover-actions" id="accountGuestActions">{guest_actions}</div>
            <nav class="account-popover-links" aria-label="Atalhos da conta">
              <a href="{links["conta"]}#minha-conta">Central Minha Conta</a>
              <a href="{links["conta"]}#meus-pedidos">Meus pedidos</a>
              <a href="{links["conta"]}#enderecos">Enderecos</a>
              <a href="{links["conta"]}#retirada">Retirada local</a>
              <a href="{links["contato"]}">Suporte</a>
              <a id="accountLogout" href="/api/account?action=logout&returnTo=/" hidden>Sair da conta</a>
            </nav>
          </div>
        </div>
        <button class="cart-mini" id="cartButton" type="button" aria-label="Abrir carrinho">
          <span aria-hidden="true">&#128722;</span>
          <strong id="cartCount">0</strong>
        </button>
      </div>
    </header>
    """


def footer(prefix: str, site_content: dict | None = None) -> str:
    links = page_links(prefix)
    mercado_enabled = feature_enabled(site_content, "payments", "mercadoPago", True)
    abacate_enabled = feature_enabled(site_content, "payments", "abacatePay", False)
    payment_names = []
    if mercado_enabled:
        payment_names.append("Mercado Pago")
    if abacate_enabled:
        payment_names.append("Abacate Pay")
    payment_text = ", ".join(payment_names + ["Pix e demais opcoes disponiveis no checkout"])
    payment_icons = "\n".join(
        item
        for item in [
            f'<img src="{prefix}assets/mercado-pago-icon.png" alt="Mercado Pago">' if mercado_enabled else "",
            f'<img src="{prefix}assets/abacate-pay-logo.svg" alt="Abacate Pay">' if abacate_enabled else "",
        ]
        if item
    )
    brand_logos = "\n".join(
        f'<img class="brand-logo logo-{brand_id}" src="{prefix}assets/brand-officials/{brand_id}.svg" alt="{name}">'
        for brand_id, name in BRANDS
    )
    dropshipping_enabled = dropshipping_catalog_enabled(site_content)
    physical_enabled = physical_catalog_enabled(site_content)
    store_links = "\n".join(
        item
        for item in [
            f'<a href="{links["produtos"]}">Produtos sob encomenda</a>' if dropshipping_enabled else "",
            f'<a href="{links["ofertas"]}">PC Gamer</a>' if physical_enabled else "",
            f'<a href="{links["ofertas"]}">Hardware</a>' if physical_enabled else "",
            f'<a href="{links["achados"]}">MobilyTech Finds</a>',
            f'<a href="{links["montagem"]}">Monte seu PC</a>',
            f'<a href="{links["limpeza"]}">Limpeza de PC</a>',
        ]
        if item
    )
    return f"""
    <section class="about-strip">
      <div>
        <h2>Sobre a MobilyTech BR</h2>
        <p>A MobilyTech BR trabalha com produtos selecionados, PCs revisados quando disponiveis, limpeza e montagem sob orcamento. O foco e deixar preco, frete, prazo, garantia e atendimento claros antes da compra.</p>
      </div>
      <a class="outline-dark" href="{links["contato"]}">Falar com a loja</a>
    </section>
    <section class="powered-row" aria-labelledby="brand-title">
      <div>
        <p class="section-kicker">Ecossistema MobilyTech</p>
        <h2 id="brand-title">Marcas que trabalhamos</h2>
      </div>
      <div class="brand-line">{brand_logos}</div>
    </section>
    <footer class="footer">
      <div class="footer-brand">
        <img src="{prefix}assets/mobilytech-logo.png" alt="MobilyTech BR">
        <strong>MobilyTech BR</strong>
        <p>Tecnologia real. Desempenho real. Confianca que entrega.</p>
        <div class="socials">
          <a href="https://www.instagram.com/mobilytechbr/" aria-label="Instagram"><img src="{prefix}assets/instagram-logo-2022.svg" alt=""></a>
          <a href="https://www.facebook.com/marketplace/" aria-label="Facebook"><img src="{prefix}assets/facebook-icon.svg" alt=""></a>
          <a href="https://avaliacoes.olx.com.br/vendedor/859fd666-c047-4d6d-adac-374dd530d56c" aria-label="OLX"><img src="{prefix}assets/olx-logo.svg" alt=""></a>
        </div>
      </div>
      <div>
        <h3>Loja</h3>
        {store_links}
      </div>
      <div>
        <h3>Suporte</h3>
        <a href="{links["contato"]}">Contato</a>
        <a href="{links["conta"]}">Minha conta</a>
        <a href="https://wa.me/5511954801967">WhatsApp</a>
        <a href="mailto:mobilytechbr@gmail.com">E-mail</a>
        <a href="{links["avaliacoes"]}">Avaliacoes</a>
      </div>
      <div>
        <h3>Legal</h3>
        <a href="{links["termos"]}">Termos de Compra</a>
        <a href="{links["privacidade"]}">Privacidade</a>
        <a href="{links["trocas"]}">Trocas e reembolso</a>
        <a href="{links["entrega"]}">Entrega e prazos</a>
        <a href="{links["garantia"]}">Garantia</a>
      </div>
      <div class="payment-box">
        <h3>Pagamentos</h3>
        <p>{payment_text}.</p>
        <div class="payment-icons">{payment_icons}</div>
      </div>
    </footer>
    <p class="copyright">&copy; 2026 MobilyTech BR. Vila Suzana, Sao Paulo, SP.</p>
    """


def product_seed(products):
    pcs = [item for item in products if item.get("active") is not False and item.get("category") == "pc"]
    hardware = [item for item in products if item.get("active") is not False and item.get("category") != "pc"]
    return pcs, hardware


def home_main(products, finalists, prefix: str, site_content: dict | None = None) -> str:
    content = merge_dict(DEFAULT_SITE_CONTENT, site_content or {})
    home = content["homeHero"]
    panels = content["servicePanels"]
    pcs, hardware = product_seed(products)
    physical_enabled = physical_catalog_enabled(site_content)
    dropshipping_enabled = dropshipping_catalog_enabled(site_content)
    dropshipping_products = [item for item in products if dropshipping_enabled and dropshipping_sellable(item)]
    links = page_links(prefix)
    configured_product = product_by_id(products, home.get("featuredProductId"))
    if configured_product and (
        configured_product.get("active") is False
        or (is_direct_order_product(configured_product) and not dropshipping_sellable(configured_product))
        or (not is_direct_order_product(configured_product) and not physical_enabled)
    ):
        configured_product = None
    hero_product = configured_product or (pcs[0] if physical_enabled and pcs else {})
    hero_image = hero_product.get("cutout") or hero_product.get("image") or "./assets/mobilytech-logo.png"
    hero_specs = hero_product.get("specs", {})
    if hero_product and is_direct_order_product(hero_product):
        origin_note = hero_product.get("publicOriginNote") or "Origem e prazo informados antes do pagamento."
        hero_deal_html = f"""
        <aside class="hero-deal-card">
          <span>{clean_text(home.get("featuredKicker"))}</span>
          <h2>{clean_text(hero_product.get("title", "Produto MobilyTech"))}</h2>
          <p>{clean_text(origin_note)}</p>
          <strong>{money(hero_product.get("price"))}</strong>
          <button class="small-link" type="button" data-detail="{clean_text(hero_product.get("id", ""))}">Ver detalhes</button>
        </aside>
        """
    elif hero_product:
        hero_deal_html = f"""
        <aside class="hero-deal-card">
          <span>{clean_text(home.get("featuredKicker"))}</span>
          <h2>{clean_text(hero_product.get("title", "PC MobilyTech"))}</h2>
          <p>{clean_text(hero_specs.get("memory", "PC revisado"))} &middot; {clean_text(hero_specs.get("storage", "SSD"))}</p>
          <strong>{money(hero_product.get("price"))}</strong>
          <button class="small-link" type="button" data-detail="{clean_text(hero_product.get("id", ""))}">Ver detalhes</button>
        </aside>
        """
    elif dropshipping_enabled:
        hero_deal_html = f"""
        <aside class="hero-deal-card">
          <span>Compra direta</span>
          <h2>Produtos sob encomenda no ar</h2>
          <p>Confira produto, prazo, frete final e total antes do pagamento.</p>
          <a class="small-link" href="{links["produtos"]}">Ver sob encomenda</a>
        </aside>
        """
    else:
        hero_deal_html = f"""
        <aside class="hero-deal-card">
          <span>Atendimento MobilyTech</span>
          <h2>Monte seu PC com a gente</h2>
          <p>Orcamento sob medida, limpeza e curadoria de pecas sem catalogo direto ativo.</p>
          <a class="small-link" href="{links["montagem"]}">Solicitar orcamento</a>
        </aside>
        """
    allowed_backgrounds = {"sky", "cyan", "graphite", "white", "red", "green"}
    hero_background_preset = str(home.get("backgroundPreset") or "sky")
    if hero_background_preset not in allowed_backgrounds:
        hero_background_preset = "sky"
    hero_classes = ["hero-slider", f"hero-bg-{hero_background_preset}"]
    hero_style = ""
    hero_background_image = str(home.get("backgroundImage") or "").strip()
    if str(home.get("backgroundMode") or "preset") == "image" and hero_background_image:
        hero_classes.append("hero-bg-image")
        hero_style = f' style="--hero-bg-image:url({clean_text(asset_path(prefix, hero_background_image))})"'
    primary_hero_link = links["produtos"] if dropshipping_enabled else (links["ofertas"] if physical_enabled else links["achados"])
    primary_hero_label = home.get("primaryLabel")
    if not physical_enabled and not dropshipping_enabled:
        primary_hero_label = "Ver MobilyTech Finds"
    build_panel = panels.get("build", {})
    clean_panel = panels.get("clean", {})
    catalog_sections = ""
    if physical_enabled:
        catalog_sections += f"""
      <section class="section-head" id="ofertas">
        <div>
          <p class="section-kicker">Estoque atual</p>
          <h2>PCs em destaque</h2>
        </div>
        <a href="{links["ofertas"]}">Ver todos os PCs &rarr;</a>
      </section>
      <div class="product-grid compact" id="homePcGrid" data-limit="5"></div>
      <section class="section-head" id="hardware">
        <div>
          <p class="section-kicker">Hardware</p>
          <h2>SSD, fonte e upgrades</h2>
        </div>
        <a href="{links["ofertas"]}">Ver hardware &rarr;</a>
      </section>
      <div class="product-grid hardware-grid" id="homeHardwareGrid" data-limit="5"></div>
        """
    if dropshipping_enabled:
        catalog_sections += f"""
      <section class="finds-band drops-band" id="produtos">
        <div class="finds-text">
          <p class="section-kicker">Produtos sob encomenda</p>
          <h2>Upgrade certeiro para setup, trabalho e manutenção</h2>
          <p>Hardware, perifericos e acessorios escolhidos para resolver gargalos reais: SSD, memoria, rede, teclado, mouse, limpeza e organizacao. O preco do produto ja considera a compra nacional ate a MobilyTech; o frete final e calculado pelo CEP no carrinho.</p>
          <a class="btn btn-dark" href="{links["produtos"]}">Ver sob encomenda</a>
        </div>
        <div class="finds-preview drops-preview" id="homeDropshippingGrid" data-source="dropshipping" data-limit="6"></div>
      </section>
        """
    return f"""
    <main>
      <section class="{' '.join(hero_classes)}" id="inicio"{hero_style}>
        <div class="hero-copy">
          <h1>{clean_text(home.get("title"))}</h1>
          <p>{clean_text(home.get("subtitle"))}</p>
          <div class="hero-actions">
            <a class="btn btn-red" href="{primary_hero_link}">{clean_text(primary_hero_label)} <span>&rarr;</span></a>
            <a class="btn btn-white" href="{links["montagem"]}">{clean_text(home.get("secondaryLabel"))}</a>
          </div>
        </div>
        <img class="hero-pc" src="{asset_path(prefix, hero_image)}" alt="{clean_text(hero_product.get("title", "PC MobilyTech"))}">
        {hero_deal_html}
      </section>
      <section class="trust-row" aria-label="Diferenciais MobilyTech">
        <article><span>&#128737;</span><strong>Peças revisadas</strong><small>e testadas antes da venda</small></article>
        <article><span>&#9989;</span><strong>Garantia clara</strong><small>cobertura informada antes da compra</small></article>
        <article><span>&#128666;</span><strong>Envio para todo o Brasil</strong><small>frete calculado no checkout</small></article>
        <article><span>&#128172;</span><strong>Suporte humano</strong><small>pré e pós-compra</small></article>
      </section>
      {catalog_sections}
      <section class="ibp-panels" id="servicos">
        <a class="service-panel service-panel-image service-build-image" href="{links["montagem"]}" aria-label="Solicitar orçamento de montagem de PC">
          <img src="{asset_path(prefix, build_panel.get("image"))}" alt="{clean_text(build_panel.get("alt"))}">
          <span>{clean_text(build_panel.get("label"))}</span>
        </a>
        <a class="service-panel service-panel-image service-clean-image" href="{links["limpeza"]}" aria-label="Agendar limpeza de PC">
          <img src="{asset_path(prefix, clean_panel.get("image"))}" alt="{clean_text(clean_panel.get("alt"))}">
          <span>{clean_text(clean_panel.get("label"))}</span>
        </a>
      </section>
      <section class="finds-band" id="finds">
        <div class="finds-text">
          <p class="section-kicker">MobilyTech Finds</p>
          <h2>MobilyTech Finds</h2>
          <p>Produtos escolhidos para completar setup, manutenção e upgrades. Recomendações externas usam Mercado Livre, Amazon ou AliExpress.</p>
          <a class="btn btn-dark" href="{links["achados"]}">Ver selecionados</a>
        </div>
        <div class="finds-preview" id="homeFindsGrid" data-limit="3"></div>
      </section>
      {reviews_section(links["avaliacoes"])}
      {cleaning_inline_form(prefix, panels)}
    </main>
    """


def products_page(page: dict, prefix: str) -> str:
    image = page.get("image") or ""
    image_html = f'<img src="{asset_path(prefix, image)}" alt="Catalogo MobilyTech BR">' if image else ""
    return f"""
    <main>
      <section class="page-hero page-hero-products">
        <div>
          <h1>{clean_text(page.get("title"))}</h1>
          <p>{clean_text(page.get("intro"))}</p>
        </div>
        {image_html}
      </section>
      <section class="section-head">
        <div>
          <p class="section-kicker">Catalogo</p>
          <h2>Estoque MobilyTech BR</h2>
        </div>
      </section>
      <div class="filter-row">
        <button class="filter-chip active" type="button" data-filter="all">Tudo</button>
        <button class="filter-chip" type="button" data-filter="pc">PCs</button>
        <button class="filter-chip" type="button" data-filter="hardware">Hardware</button>
      </div>
      <div class="product-grid catalog-grid" id="catalogGrid"></div>
    </main>
    """


def finds_page(prefix: str, page: dict) -> str:
    return f"""
    <main>
      <section class="page-hero page-hero-finds">
        <div>
          <h1>{clean_text(page.get("title"))}</h1>
          <p>{clean_text(page.get("intro"))}</p>
        </div>
      </section>
      <section class="section-head finds-section-head finds-primary-head">
        <div>
          <p class="section-kicker">MobilyTech recomenda</p>
          <h2><span aria-hidden="true">&#9989;</span> Boas compras nos marketplaces parceiros</h2>
          <p>Itens que fazem sentido para setup, manutencao e uso diario, com compra feita diretamente no Mercado Livre, Amazon ou AliExpress.</p>
        </div>
      </section>
      <section class="finds-layout" aria-label="Filtros e achados MobilyTech">
        <aside class="finds-filters" aria-label="Filtros do MobilyTech Finds">
          <form class="finds-filter-form" id="findsFilterForm" role="search">
            <label class="finds-search-label" for="findsSearch">Buscar nesta pagina</label>
            <div class="finds-search-control">
              <input id="findsSearch" data-finds-control type="search" enterkeyhint="search" autocomplete="off" placeholder="Buscar SSD, teclado, hub, fonte...">
              <button class="finds-search-apply" id="findsSearchApply" type="submit" aria-label="Aplicar busca">&#8594;</button>
            </div>
            <label class="finds-search-label" for="findsStore">Loja</label>
            <select id="findsStore" data-finds-control>
              <option value="all">Todas as lojas</option>
            </select>
            <label class="finds-search-label" for="findsNiche">Nicho</label>
            <select id="findsNiche" data-finds-control>
              <option value="all">Todos os nichos</option>
            </select>
            <label class="finds-search-label" for="findsShipping">Envio</label>
            <select id="findsShipping" data-finds-control>
              <option value="all">Todos</option>
              <option value="nacional">Envio nacional</option>
            </select>
            <div class="finds-filter-block">
              <div class="finds-filter-head">
                <strong>Preco</strong>
                <button id="findsReset" type="button">Limpar</button>
              </div>
              <div class="finds-price-inputs">
                <label>Minimo<input id="findsMinPrice" data-finds-control inputmode="numeric" type="number" min="0" step="10"></label>
                <label>Maximo<input id="findsMaxPrice" data-finds-control inputmode="numeric" type="number" min="0" step="10"></label>
              </div>
              <div class="finds-range-wrap" aria-label="Faixa de preco">
                <input id="findsMinRange" data-finds-control type="range" min="0" max="5000" step="10" value="0">
                <input id="findsMaxRange" data-finds-control type="range" min="0" max="5000" step="10" value="5000">
              </div>
            </div>
            <label class="finds-search-label" for="findsSort">Ordenar</label>
            <select id="findsSort" data-finds-control>
              <option value="relevance">Relevancia</option>
              <option value="price-asc">Menor preco</option>
              <option value="price-desc">Maior preco</option>
            </select>
            <button class="finds-apply" id="findsApply" type="submit">Aplicar filtros</button>
            <p class="finds-count" id="findsCount">Carregando achados...</p>
          </form>
        </aside>
        <div class="finds-grid finds-grid-recommendations" id="findsGrid"></div>
      </section>
    </main>
    """


def nossos_produtos_page(prefix: str, page: dict, site_content: dict | None = None) -> str:
    if not dropshipping_catalog_enabled(site_content):
        links = page_links(prefix)
        return f"""
    <main>
      <section class="page-hero page-hero-finds page-hero-products-store unavailable-page">
        <div>
          <p class="section-kicker">Produtos sob encomenda</p>
          <h1>Pagina temporariamente indisponivel</h1>
          <p>A compra direta de produtos sob encomenda esta desligada no painel da MobilyTech BR. Enquanto isso, veja o MobilyTech Finds ou fale com a loja para atendimento humano.</p>
          <div class="hero-actions">
            <a class="btn btn-red" href="{links["achados"]}">Ver MobilyTech Finds</a>
            <a class="btn btn-white" href="{links["contato"]}">Falar com a loja</a>
          </div>
        </div>
      </section>
    </main>
    """
    return f"""
    <main>
      <section class="page-hero page-hero-finds page-hero-products-store">
        <div>
          <h1>{clean_text(page.get("title"))}</h1>
          <p>{clean_text(page.get("intro"))}</p>
        </div>
      </section>
      <section class="section-head finds-section-head finds-primary-head">
        <div>
          <p class="section-kicker">Compra direta MobilyTech BR</p>
          <h2>Produtos sob encomenda na MobilyTech BR</h2>
          <p>Produtos selecionados para setup, escritorio, manutencao e upgrades. Voce pode filtrar por nicho, preco e tipo de envio antes de adicionar ao carrinho.</p>
          <p class="public-compliance-note">O preco exibido ja considera a compra nacional do item ate a MobilyTech BR. O frete final ate voce, o prazo estimado e o total aparecem no carrinho antes do pagamento.</p>
        </div>
      </section>
      <section class="finds-layout" aria-label="Filtros de produtos sob encomenda">
        <aside class="finds-filters" aria-label="Filtros de produtos sob encomenda">
          <form class="finds-filter-form" id="findsFilterForm" data-source="dropshipping" role="search">
            <label class="finds-search-label" for="findsSearch">Buscar nesta pagina</label>
            <div class="finds-search-control">
              <input id="findsSearch" data-finds-control type="search" enterkeyhint="search" autocomplete="off" placeholder="Buscar hub, teclado, limpeza, SSD...">
              <button class="finds-search-apply" id="findsSearchApply" type="submit" aria-label="Aplicar busca">&#8594;</button>
            </div>
            <label class="finds-search-label" for="findsNiche">Nicho</label>
            <select id="findsNiche" data-finds-control>
              <option value="all">Todos os nichos</option>
            </select>
            <label class="finds-search-label" for="findsShipping">Envio</label>
            <select id="findsShipping" data-finds-control>
              <option value="all">Todos</option>
              <option value="nacional">Envio nacional</option>
            </select>
            <div class="finds-filter-block">
              <div class="finds-filter-head">
                <strong>Preco</strong>
                <button id="findsReset" type="button">Limpar</button>
              </div>
              <div class="finds-price-inputs">
                <label>Minimo<input id="findsMinPrice" data-finds-control inputmode="numeric" type="number" min="0" step="10"></label>
                <label>Maximo<input id="findsMaxPrice" data-finds-control inputmode="numeric" type="number" min="0" step="10"></label>
              </div>
              <div class="finds-range-wrap" aria-label="Faixa de preco">
                <input id="findsMinRange" data-finds-control type="range" min="0" max="5000" step="10" value="0">
                <input id="findsMaxRange" data-finds-control type="range" min="0" max="5000" step="10" value="5000">
              </div>
            </div>
            <label class="finds-search-label" for="findsSort">Ordenar</label>
            <select id="findsSort" data-finds-control>
              <option value="relevance">Relevancia</option>
              <option value="price-asc">Menor preco</option>
              <option value="price-desc">Maior preco</option>
            </select>
            <button class="finds-apply" id="findsApply" type="submit">Aplicar filtros</button>
            <p class="finds-count" id="findsCount">Carregando produtos...</p>
          </form>
        </aside>
        <div class="finds-grid finds-grid-recommendations" id="findsGrid" data-source="dropshipping"></div>
      </section>
    </main>
    """


def montagem_page(prefix: str, page: dict) -> str:
    image = page.get("image") or "./assets/phase2-service-build-reference.png"
    return f"""
    <main>
      <section class="page-hero page-hero-build">
        <div>
          <h1>{clean_text(page.get("title"))}</h1>
          <p>{clean_text(page.get("intro"))}</p>
        </div>
        <img src="{asset_path(prefix, image)}" alt="Monte seu PC MobilyTech">
      </section>
      <section class="split-form">
        <div class="form-copy">
          <p class="section-kicker">Orcamento personalizado</p>
          <h2>Para jogar, estudar, editar ou trabalhar</h2>
          <p>A proposta considera compatibilidade, custo-beneficio, margem de upgrade e garantia do conjunto.</p>
          <ul>
            <li>Indicacao de processador, memoria, armazenamento e fonte.</li>
            <li>Revisao visual do gabinete e organizacao dos cabos.</li>
            <li>Atendimento pelo WhatsApp antes de fechar.</li>
          </ul>
        </div>
        <form class="lead-form" id="buildForm">
          <label>Nome completo<input name="name" placeholder="Seu nome" required></label>
          <label>WhatsApp<input name="phone" placeholder="(DDD) 9XXXX-XXXX" required></label>
          <label>Objetivo<textarea name="goal" placeholder="Conte o uso: jogos, estudo, trabalho, edicao..." required></textarea></label>
          <label>Orcamento<input name="budget" placeholder="Ex: ate R$ 2.500"></label>
          <button class="btn btn-red full" type="submit">Solicitar orcamento pelo WhatsApp</button>
        </form>
      </section>
    </main>
    """


def limpeza_page(prefix: str, page: dict, service_panels: dict) -> str:
    image = page.get("image") or "./assets/phase2-service-clean-reference.png"
    side_image = service_panels.get("cleanFormImage") or "./assets/phase2-clean-form-visual.png"
    return f"""
    <main>
      <section class="page-hero page-hero-clean">
        <div>
          <h1>{clean_text(page.get("title"))}</h1>
          <p>{clean_text(page.get("intro"))}</p>
        </div>
        <img src="{asset_path(prefix, image)}" alt="Limpeza de PC MobilyTech">
      </section>
      <section class="split-form">
        <div class="form-copy clean-page-copy">
          <p class="section-kicker">Servico especializado</p>
          <h2>Limpeza completa do seu PC</h2>
          <ul>
            <li>Remocao de poeira e limpeza visual.</li>
            <li>Troca de pasta termica quando combinada.</li>
            <li>Relatorio do estado do computador.</li>
          </ul>
          <img class="clean-side-image" src="{asset_path(prefix, side_image)}" alt="PC limpo com kit de limpeza">
        </div>
        <form class="lead-form" id="cleanForm">
          <label>Nome completo<input name="name" placeholder="Seu nome" required></label>
          <label>E-mail<input name="email" type="email" placeholder="seu@email.com"></label>
          <label>WhatsApp<input name="phone" placeholder="(DDD) 9XXXX-XXXX" required></label>
          <label>Descricao<textarea name="description" placeholder="Conte um pouco sobre o PC e o que precisa."></textarea></label>
          <button class="btn btn-red full" type="submit">Agendar limpeza</button>
        </form>
      </section>
    </main>
    """


def reviews_section(link: str | None = None) -> str:
    cards = "\n".join(
        f"""
        <article class="review-card">
          <div class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
          <p>"{clean_text(item["text"])}"</p>
          <strong>{clean_text(item["name"])}</strong>
          <small>{clean_text(item["source"])}</small>
        </article>
        """
        for item in REVIEWS
    )
    action = f'<a href="{link}">Ver todas as avaliacoes &rarr;</a>' if link else ""
    return f"""
      <section class="section-head reviews-head" id="avaliacoes">
        <div>
          <p class="section-kicker">Prova social</p>
          <h2>Avaliacoes de quem compra e confia</h2>
          <p>A MobilyTech BR possui historico real de entregas, atendimento direto e nota maxima nos canais onde atua.</p>
        </div>
        {action}
      </section>
      <section class="reviews-grid">
        <article class="score-card">
          <strong>5,0</strong>
          <div class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
          <p>avaliacoes reais na OLX e Marketplace</p>
        </article>
        {cards}
      </section>
    """


def avaliacoes_page(prefix: str) -> str:
    return f"""
    <main>
      <section class="page-hero page-hero-reviews">
        <div>
          <h1>Avaliacoes dos clientes</h1>
          <p>Prova social da MobilyTech BR em vendas reais, suporte pelo WhatsApp e atendimento em marketplaces.</p>
        </div>
      </section>
      {reviews_section(None)}
    </main>
    """


def contato_page(prefix: str) -> str:
    return """
    <main>
      <section class="page-hero page-hero-contact">
        <div>
          <h1>Fale com a MobilyTech BR</h1>
          <p>Atendimento humano para compra, garantia, montagem, limpeza, frete e retirada local.</p>
        </div>
      </section>
      <section class="contact-grid">
        <article><h2>WhatsApp</h2><p>+55 (11) 95480-1967</p><a class="btn btn-dark" href="https://wa.me/5511954801967">Chamar no WhatsApp</a></article>
        <article><h2>E-mail</h2><p>mobilytechbr@gmail.com</p><a class="btn btn-dark" href="mailto:mobilytechbr@gmail.com">Enviar e-mail</a></article>
        <article><h2>Retirada local</h2><p>Vila Suzana, Sao Paulo, SP.</p><p>Retirada combinada apos confirmacao do pedido.</p></article>
        <article class="shipping-contact-card"><img src="../assets/brazil-flag-glass.png" alt="" aria-hidden="true"><h2>Envio para todo o Brasil</h2><p>Envio por transportadora ou Correios, conforme disponibilidade do Melhor Envio, com opcao de rastreio.</p></article>
        <article><h2>Garantia</h2><p>A cobertura varia conforme produto ou servico e fica informada no anuncio, proposta ou atendimento antes da compra.</p></article>
      </section>
    </main>
    """


def legal_page(prefix: str, page_key: str) -> str:
    page = LEGAL_PAGES[page_key]
    links = page_links(prefix)
    sections = "\n".join(
        f"""
        <article class="legal-card">
          <h2>{clean_text(title)}</h2>
          <p>{clean_text(text)}</p>
        </article>
        """
        for title, text in page["sections"]
    )
    return f"""
    <main>
      <section class="page-hero page-hero-legal">
        <div>
          <p class="section-kicker">{clean_text(page["kicker"])}</p>
          <h1>{clean_text(page["title"])}</h1>
          <p>{clean_text(page["intro"])}</p>
        </div>
      </section>
      <section class="legal-layout" aria-label="{clean_text(page["title"])}">
        <div class="legal-note">
          <strong>MobilyTech BR</strong>
          <span>CNPJ 66.834.883/0001-43</span>
          <span>Vila Suzana, Sao Paulo, SP</span>
          <a href="{links["contato"]}">Atendimento e contato</a>
        </div>
        <div class="legal-grid">{sections}</div>
      </section>
    </main>
    """


def conta_page(prefix: str, page: dict, site_content: dict | None = None) -> str:
    google_enabled = feature_enabled(site_content, "auth", "google", True)
    microsoft_enabled = feature_enabled(site_content, "auth", "microsoft", False)
    login_options = "\n".join(
        item
        for item in [
            f'<a class="account-login google-login" href="/api/account?action=google-start"><img src="{prefix}assets/brand-officials/google-icon.svg" alt="" aria-hidden="true"><span>Entrar com Google</span></a>'
            if google_enabled
            else "",
            f'<a class="account-login microsoft-login" href="/api/account?action=microsoft-start"><img src="{prefix}assets/brand-officials/microsoft-icon.svg" alt="" aria-hidden="true"><span>Entrar com Microsoft</span></a>'
            if microsoft_enabled
            else "",
        ]
        if item
    )
    return f"""
    <main>
      <section class="page-hero page-hero-account">
        <div>
          <h1>{clean_text(page.get("title"))}</h1>
          <p>{clean_text(page.get("intro"))}</p>
        </div>
      </section>
      <section class="account-layout" aria-label="Area do cliente">
        <div class="account-primary">
          <article class="account-card account-login-card" id="minha-conta">
            <p class="section-kicker">Acesso seguro</p>
            <h2>Conta do cliente</h2>
            <p id="accountPageIntro">Entre com Google para ver pedidos vinculados ao seu e-mail. Senhas ficam no provedor de login e dados de pagamento ficam no Mercado Pago, PayPal ou outro checkout oficial.</p>
            <div class="account-session" id="accountPagePanel">
              <div class="account-avatar" aria-hidden="true">MT</div>
              <div>
                <strong>Voce ainda nao entrou.</strong>
                <small>Use um login seguro para carregar seus pedidos quando eles estiverem disponiveis.</small>
              </div>
            </div>
            <div class="account-login-options" id="accountPageGuestActions">{login_options}</div>
            <div class="account-login-options account-logged-actions" id="accountPageLoggedActions" hidden>
              <a class="account-login account-logout-link" id="accountPageLogout" href="/api/account?action=logout&returnTo=/"><span>Sair da conta</span></a>
            </div>
          </article>
          <article class="account-card" id="meus-pedidos">
            <p class="section-kicker">Meus pedidos</p>
            <h2>Historico e status</h2>
            <div class="orders-panel" id="ordersPanel">
              <p class="empty">Entre na sua conta para carregar pedidos vinculados ao seu e-mail.</p>
            </div>
          </article>
          <article class="account-card" id="enderecos">
            <p class="section-kicker">Dados de entrega</p>
            <h2>Enderecos e checkout</h2>
            <p>Enderecos usados em pedidos aparecem junto do pedido quando o checkout envia esses dados para a MobilyTech BR. Cartoes e carteiras digitais nao sao armazenados pela loja.</p>
            <div class="secure-note-list">
              <span>Login por provedor oficial</span>
              <span>Cartao somente no checkout</span>
              <span>Rastreio vinculado ao pedido</span>
            </div>
          </article>
        </div>
        <aside class="account-side">
          <article class="account-card account-card-main" id="retirada">
            <p class="section-kicker">Retirada local</p>
            <h2>Retirada a combinar</h2>
            <p>Quando o pedido for aprovado para retirada em Vila Suzana, a conta mostra o status e o contato fica como apoio para combinar horario.</p>
            <a class="btn whatsapp-btn full" href="https://wa.me/5511954801967?text=Ola%2C%20quero%20combinar%20a%20retirada%20do%20meu%20pedido%20MobilyTech%20BR." target="_blank" rel="noopener"><img src="../assets/whatsapp-icon-clean.png" alt="" aria-hidden="true">Combinar pelo WhatsApp</a>
          </article>
          <article class="account-card">
            <p class="section-kicker">Pedido online</p>
            <h2>Status esperados</h2>
            <ol class="order-timeline">
              <li><b>1</b><span><strong>Pagamento pendente</strong><small>Pedido recebido e aguardando confirmacao.</small></span></li>
              <li><b>2</b><span><strong>Pagamento aprovado</strong><small>Preparacao do PC, hardware ou item selecionado.</small></span></li>
              <li><b>3</b><span><strong>Despachado</strong><small>Codigo de rastreio enviado quando houver frete.</small></span></li>
              <li><b>4</b><span><strong>Em transporte</strong><small>Atualizacao pelo envio contratado.</small></span></li>
              <li><b>5</b><span><strong>Entregue ou retirada combinada</strong><small>Finalizacao do atendimento e pos-venda.</small></span></li>
            </ol>
          </article>
          <article class="account-card account-support-card">
            <p class="section-kicker">Atendimento</p>
            <h2>Suporte quando precisar</h2>
            <p>Use o suporte quando o pedido nao aparecer na conta, quando houver divergencia ou quando precisar combinar algum detalhe manual.</p>
            <div class="account-actions">
              <a class="btn whatsapp-btn" href="https://wa.me/5511954801967?text=Ola%2C%20quero%20ajuda%20com%20meu%20pedido%20MobilyTech%20BR." target="_blank" rel="noopener"><img src="../assets/whatsapp-icon-clean.png" alt="" aria-hidden="true">WhatsApp</a>
              <a class="btn btn-white outline-account" href="mailto:mobilytechbr@gmail.com?subject=Acompanhamento%20de%20pedido%20MobilyTech%20BR">E-mail</a>
            </div>
          </article>
        </aside>
      </section>
    </main>
    """


def cleaning_inline_form(prefix: str, service_panels: dict | None = None) -> str:
    service_panels = service_panels or DEFAULT_SITE_CONTENT["servicePanels"]
    image = service_panels.get("cleanFormImage") or "./assets/phase2-clean-form-visual.png"
    return f"""
      <section class="inline-clean">
      <div class="clean-form-visual">
        <p class="section-kicker">Servico especializado</p>
        <img src="{asset_path(prefix, image)}" alt="PC limpo com kit de limpeza">
      </div>
        <form class="lead-form compact-form" id="cleanFormInline">
          <label>Nome<input name="name" placeholder="Seu nome" required></label>
          <label>E-mail<input name="email" type="email" placeholder="seu@email.com"></label>
          <label>WhatsApp<input name="phone" placeholder="(DDD) 9XXXX-XXXX" required></label>
          <button class="btn btn-red full" type="submit">Agendar limpeza</button>
        </form>
      </section>
    """


def cart_drawer(prefix: str, site_content: dict | None = None) -> str:
    links = page_links(prefix)
    mercado_enabled = feature_enabled(site_content, "payments", "mercadoPago", True)
    abacate_enabled = feature_enabled(site_content, "payments", "abacatePay", False)
    checkout_buttons = "\n".join(
        item
        for item in [
            f'<button class="btn checkout-pay checkout-mercado full" id="checkoutMercado" type="button"><img src="{prefix}assets/mercado-pago-logo.svg" alt="" aria-hidden="true">Pagar pelo Mercado Pago</button>'
            if mercado_enabled
            else "",
            f'<button class="btn checkout-pay checkout-abacate full" id="checkoutAbacate" type="button"><img src="{prefix}assets/abacate-pay-logo.svg" alt="" aria-hidden="true">Pagar pelo Abacate Pay</button>'
            if abacate_enabled
            else "",
        ]
        if item
    )
    return f"""
    <div class="cart-backdrop" id="cartBackdrop" hidden></div>
    <aside class="cart-drawer" id="cartDrawer" aria-label="Carrinho" aria-hidden="true">
      <div class="drawer-head">
        <div><small>Loja online</small><h2>Carrinho</h2></div>
        <button class="close-drawer" id="closeCart" type="button" aria-label="Fechar">&times;</button>
      </div>
      <div id="cartItems" class="drawer-items"></div>
      <div class="drawer-total"><span>Total</span><strong id="cartTotal">R$ 0,00</strong></div>
      <div class="coupon-box">
        <label for="couponCode">Cupom promocional</label>
        <div class="coupon-control">
          <input id="couponCode" autocomplete="off" placeholder="Digite seu cupom">
          <button id="applyCoupon" class="coupon-apply" type="button" aria-label="Aplicar cupom">&#8250;</button>
        </div>
        <small id="couponFeedback">Cupons valem para produtos elegiveis; frete final fica separado no resumo.</small>
      </div>
      <details class="shipping-box">
        <summary>Calcular frete</summary>
        <div class="delivery-choice" id="deliveryChoice"></div>
        <label>CEP<input id="postalCode" inputmode="numeric" placeholder="00000-000"></label>
        <button class="btn btn-dark full" id="quoteShipping" type="button">Calcular frete</button>
        <div id="shippingQuotes" class="shipping-quotes"></div>
      </details>
      <div class="checkout-review" id="checkoutReview" hidden></div>
      <label class="policy-check">
        <input id="checkoutPoliciesAccepted" type="checkbox">
        <span>Li e aceito os <a href="{links["termos"]}" target="_blank" rel="noopener">Termos de Compra</a>, a <a href="{links["privacidade"]}" target="_blank" rel="noopener">Politica de Privacidade</a>, a <a href="{links["entrega"]}" target="_blank" rel="noopener">Politica de Entrega</a>, a <a href="{links["trocas"]}" target="_blank" rel="noopener">Politica de Trocas e Reembolso</a> e a <a href="{links["garantia"]}" target="_blank" rel="noopener">Politica de Garantia</a>.</span>
      </label>
      <label class="policy-check supplier-policy-check" id="supplierDisclosureCheck" hidden>
        <input id="supplierDisclosureAccepted" type="checkbox">
        <span>Estou ciente de que este pedido pode ter produto sob encomenda e conferi preco, frete final, prazo estimado e resumo antes do pagamento.</span>
      </label>
      <div class="checkout-actions">{checkout_buttons}</div>
      <p class="drawer-note">Antes de pagar, confira o resumo do pedido. O pagamento e feito em ambiente seguro do provedor escolhido.</p>
    </aside>
    <dialog class="product-modal" id="productModal">
      <form method="dialog">
        <button class="close-drawer" aria-label="Fechar">&times;</button>
      </form>
      <div id="modalBody"></div>
    </dialog>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>
    """


def css() -> str:
    return """
    :root {
      --red:#ff2b2b;
      --cyan:#15d8cc;
      --blue:#1478ff;
      --ink:#090b10;
      --muted:#626a76;
      --line:#e5e8ee;
      --soft:#f5f6f8;
      --card:#ffffff;
      --radius:16px;
      --shadow:0 18px 50px rgba(18,24,38,.12);
      font-family:'Nunito',Inter,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    }
    *{box-sizing:border-box}
    html{scroll-behavior:smooth;max-width:100%;overflow-x:hidden}
    body{margin:0;background:#fff;color:var(--ink);font-size:16px;line-height:1.45;max-width:100%;overflow-x:hidden}
    a{color:inherit;text-decoration:none}
    button,input,textarea{font:inherit}
    img{max-width:100%;display:block}
    .topbar{background:#ececec;border-bottom:1px solid #d8d8d8}
    .topbar-inner{height:44px;max-width:1540px;margin:auto;display:flex;align-items:center;justify-content:center;gap:30px;color:#222;font-size:15px}
    .topbar p{margin:0}.ticker-arrow{border:0;background:transparent;font-size:34px;color:#9ca3af;cursor:pointer}
    .site-header{position:sticky;top:0;z-index:20;background:#fff;box-shadow:0 2px 12px rgba(0,0,0,.08)}
    .nav-shell{max-width:1540px;margin:auto;height:76px;padding:0 22px;display:grid;grid-template-columns:minmax(160px,184px) minmax(620px,1fr) minmax(150px,210px) 44px 52px;align-items:center;gap:10px}
    .brand{display:flex;align-items:center;gap:10px;font-weight:900;white-space:nowrap;min-width:0}.brand img{width:44px;height:44px;object-fit:contain;flex:0 0 auto}.brand span{overflow:hidden;text-overflow:ellipsis}
    .main-nav{display:flex;align-items:center;justify-content:flex-start;gap:6px;min-width:0;scrollbar-width:none}.main-nav::-webkit-scrollbar{display:none}.nav-link{font-size:12.5px;font-weight:900;padding:12px 2px;border-bottom:3px solid transparent;white-space:nowrap}.nav-link.active{border-bottom-color:var(--red);color:#000}.nav-link:hover{color:#000;background:#f7f8fb;border-radius:10px}.nav-separator{color:#c8ced7;font-weight:1000;line-height:1;user-select:none}
    .search-zone{position:relative;min-width:0}.search-pill{height:44px;border-radius:999px;background:#f0f1f3;display:flex;align-items:center;gap:10px;padding:0 16px;color:#111}.search-pill input{border:0;background:transparent;outline:0;min-width:0;width:100%;font-weight:700}.search-results{position:absolute;top:calc(100% + 10px);left:0;right:0;z-index:36;background:#fff;border:1px solid var(--line);border-radius:16px;box-shadow:0 22px 54px rgba(10,18,30,.18);padding:8px;display:grid;gap:6px;max-height:360px;overflow:auto}.search-results[hidden]{display:none}.search-result{width:100%;border:0;background:#fff;border-radius:12px;padding:11px 12px;display:grid;grid-template-columns:34px 1fr auto;gap:10px;text-align:left;align-items:center;cursor:pointer}.search-result:hover,.search-result.active{background:#f4f7fb}.search-result-icon{width:34px;height:34px;border-radius:10px;background:#e7fbfa;color:#087f78;display:grid;place-items:center;font-weight:1000}.search-result-title{display:block;font-size:13px;font-weight:1000;color:#111;line-height:1.15}.search-result-desc{display:block;margin-top:2px;color:#69717c;font-size:11px;font-weight:800;line-height:1.25}.search-result-type{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#0b7c72;font-weight:1000;white-space:nowrap}.search-empty{margin:0;padding:10px 12px;color:#69717c;font-weight:900}
    .icon-action,.cart-mini{height:44px;border:0;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer}.icon-action{font-size:28px}.account-menu-wrap{position:relative;display:flex;justify-content:center}.account-action{width:44px;border-radius:999px}.account-action span{width:30px;height:30px;border:2px solid #111;border-radius:50%;display:grid;place-items:center;transition:.18s border-color,.18s box-shadow}.account-action svg{width:18px;height:18px;fill:#111}.account-action.active span,.account-action[aria-expanded="true"] span{border-color:var(--red);box-shadow:0 0 0 4px rgba(255,43,43,.13)}.account-popover{position:absolute;top:calc(100% + 12px);right:-12px;width:292px;background:#fff;border:1px solid var(--line);border-radius:14px;box-shadow:0 24px 60px rgba(10,18,30,.2);padding:18px;z-index:45;transform-origin:top right;animation:account-popover-in .16s ease-out both}.account-popover.is-closing{animation:account-popover-out .12s ease-in both}.account-popover:before{content:"";position:absolute;top:-8px;right:26px;width:16px;height:16px;background:#fff;border-left:1px solid var(--line);border-top:1px solid var(--line);transform:rotate(45deg)}.account-popover[hidden]{display:none}@keyframes account-popover-in{from{opacity:0;transform:translateY(-8px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}@keyframes account-popover-out{from{opacity:1;transform:translateY(0) scale(1)}to{opacity:0;transform:translateY(-6px) scale(.98)}}.account-popover-kicker{margin:0 0 8px;color:var(--red);font-size:11px;text-transform:uppercase;letter-spacing:.11em;font-weight:1000}.account-popover strong{display:block;font-size:18px;line-height:1.15}.account-popover small{display:block;margin-top:8px;color:#657081;font-weight:850;line-height:1.35}.account-popover-actions,.account-popover-links{display:grid;gap:8px;margin-top:14px}.account-popover-links a{border-top:1px solid #eef1f5;padding:9px 2px 0;font-weight:950;color:#2d3540}.account-popover-links a:hover{color:#0a6fce}.account-login{min-height:48px;border-radius:14px;border:1px solid #d9dee8;background:#fff;color:#111;display:inline-flex;align-items:center;justify-content:center;gap:14px;font-weight:1000;padding:0 22px;box-shadow:0 3px 10px rgba(16,24,40,.04);white-space:nowrap;line-height:1}.account-popover .account-login{min-height:40px;border-radius:999px;font-size:13px;padding:0 15px}.account-login img{width:28px;height:28px;object-fit:contain;flex:0 0 auto}.account-popover .account-login img{width:24px;height:24px}.account-login span{line-height:1}.cart-mini{gap:4px;font-size:28px;position:relative}.cart-mini strong{position:absolute;top:0;right:0;min-width:20px;height:20px;border-radius:20px;background:var(--cyan);color:#061015;font-size:12px;display:grid;place-items:center}
    main{max-width:1540px;margin:auto;padding:0 22px 36px}.hero-slider{min-height:420px;margin:0 auto 28px;border-radius:0 0 16px 16px;background:linear-gradient(90deg,#1788e8 0%,#2f9cf2 43%,#89d2ff 100%);position:relative;overflow:hidden;display:grid;grid-template-columns:1fr 1.2fr 280px;align-items:center;padding:48px 62px;color:#fff}.hero-bg-sky{background:linear-gradient(90deg,#1788e8 0%,#2f9cf2 43%,#89d2ff 100%)}.hero-bg-cyan{background:linear-gradient(90deg,#20ddd4 0%,#79ece8 48%,#f4ffff 100%);color:#06222e}.hero-bg-graphite{background:linear-gradient(90deg,#101827 0%,#1d3045 52%,#4d718e 100%)}.hero-bg-white{background:linear-gradient(90deg,#f4f8fb 0%,#ffffff 52%,#e7fbff 100%);color:#111}.hero-bg-red{background:linear-gradient(90deg,#ff2b2b 0%,#ff5353 52%,#ffd9d9 100%)}.hero-bg-green{background:linear-gradient(90deg,#087f78 0%,#16c48f 52%,#d9fff4 100%)}.hero-bg-image{background-image:linear-gradient(90deg,rgba(8,15,26,.74),rgba(8,15,26,.25)),var(--hero-bg-image);background-size:cover;background-position:center}
    .hero-slider:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 16% 84%,rgba(255,255,255,.26),transparent 26%),radial-gradient(circle at 82% 20%,rgba(255,255,255,.25),transparent 20%);pointer-events:none}
    .hero-copy{position:relative;z-index:2;max-width:620px}.hero-copy h1{font-size:48px;line-height:1.02;margin:0 0 18px;font-weight:1000;letter-spacing:0}.hero-copy p{font-size:21px;font-weight:800;margin:0 0 26px;max-width:620px}
    .hero-actions{display:flex;gap:16px;flex-wrap:wrap}.btn{border:0;border-radius:999px;min-height:50px;padding:0 28px;display:inline-flex;align-items:center;justify-content:center;gap:12px;font-weight:1000;cursor:pointer;transition:.2s transform,.2s box-shadow}.btn:hover{transform:translateY(-2px);box-shadow:0 12px 30px rgba(0,0,0,.16)}.btn-red{background:var(--red);color:#fff}.btn-white{background:#fff;color:#111}.btn-dark{background:#111;color:#fff}.full{width:100%}
    .hero-pc{position:relative;z-index:1;justify-self:center;max-height:390px;object-fit:contain;filter:drop-shadow(0 0 0 #fff) drop-shadow(7px 10px 0 rgba(255,255,255,.92)) drop-shadow(0 24px 40px rgba(0,0,0,.34))}
    .hero-deal-card{position:relative;z-index:2;background:rgba(255,255,255,.92);color:#111;border-radius:14px;padding:24px;box-shadow:var(--shadow);align-self:center}.hero-deal-card span{font-weight:1000;color:var(--red);text-transform:uppercase;font-size:12px}.hero-deal-card h2{font-size:22px;line-height:1.14;margin:10px 0}.hero-deal-card p{color:#555;font-weight:800}.hero-deal-card strong{font-size:28px;display:block;margin:12px 0}.small-link{border:2px solid #111;background:transparent;border-radius:999px;padding:10px 18px;font-weight:1000;cursor:pointer}
    .trust-row{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:1px solid var(--line);border-radius:14px;overflow:hidden;margin:0 0 36px;background:#fff;box-shadow:0 10px 30px rgba(0,0,0,.06)}.trust-row article{display:grid;grid-template-columns:48px 1fr;grid-template-rows:auto auto;gap:2px 12px;align-items:center;padding:22px 28px;border-right:1px solid var(--line)}.trust-row article:last-child{border-right:0}.trust-row span{grid-row:1/3;width:42px;height:42px;border-radius:12px;background:#e9fbfa;color:#048b82;display:grid;place-items:center;font-size:23px;line-height:1}.trust-row strong{font-size:17px}.trust-row small{color:#69717c;font-weight:800}
    .section-head{display:flex;align-items:end;justify-content:space-between;gap:20px;margin:36px 0 18px}.section-head h2{font-size:34px;margin:0;line-height:1.08;overflow-wrap:anywhere}.section-head p{max-width:760px;color:#626a76;font-weight:800}.section-head a{font-weight:1000;color:#0d6fca}.section-kicker{margin:0 0 8px;color:var(--red);font-size:14px;text-transform:uppercase;letter-spacing:.11em;font-weight:1000}
    section[id], .product-card[id], .find-card[id], .page-hero[id]{scroll-margin-top:138px}
    .product-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:18px;align-items:stretch}.catalog-grid{grid-template-columns:repeat(4,minmax(0,1fr))}.hardware-grid{grid-template-columns:repeat(5,minmax(0,1fr))}
    .product-card{background:#fff;border:1px solid #e6e8ee;border-radius:16px;box-shadow:0 10px 28px rgba(13,23,38,.08);overflow:visible;display:flex;flex-direction:column;min-height:418px}.product-media{height:220px;background:linear-gradient(180deg,#f5fbff,#fff);display:grid;place-items:center;padding:28px 18px 14px;position:relative;overflow:hidden;border-radius:16px 16px 0 0}.product-media img{width:auto;height:auto;max-width:86%;max-height:142px;object-fit:contain;filter:drop-shadow(0 15px 14px rgba(0,0,0,.16))}.product-card[data-kind="pc"] .product-media{height:236px;padding:30px 18px 12px}.product-card[data-kind="pc"] .product-media img{max-width:78%;max-height:174px;transform:none;filter:drop-shadow(0 0 0 #fff) drop-shadow(3px 5px 0 rgba(255,255,255,.92)) drop-shadow(0 16px 18px rgba(0,0,0,.22))}.product-card .badge{position:absolute;top:12px;left:12px;background:#dff9f7;color:#047d74;border-radius:999px;padding:7px 12px;font-size:12px;font-weight:1000}.product-body{padding:18px;display:flex;flex-direction:column;gap:10px;flex:1}.product-card h3{font-size:17px;line-height:1.2;margin:0;font-weight:1000;overflow-wrap:anywhere}.spec-line{color:#58606c;font-weight:800;font-size:13.5px;min-height:40px;overflow-wrap:anywhere}.price-row{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;min-width:0}.price{font-size:23px;font-weight:1000;line-height:1.08}.old-price{text-decoration:line-through;color:#8b93a0;font-size:14px}.installment{color:#0d8f70;font-weight:1000;font-size:13px}.card-actions{display:grid;gap:9px;margin-top:auto}.ghost-btn{border:2px solid #111;border-radius:999px;background:#fff;color:#111;height:42px;font-weight:1000;cursor:pointer}.cart-btn{border:0;border-radius:999px;background:#111;color:#fff;height:42px;font-size:13px;font-weight:1000;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:0 10px;white-space:normal;text-align:center;line-height:1.15}.cart-btn .cart-icon{font-size:15px;line-height:1;flex:0 0 auto}
    .ibp-panels{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin:44px 0 20px}.service-panel{min-height:330px;border-radius:18px;overflow:hidden;position:relative;display:flex;align-items:center}.service-panel-image{min-height:0;aspect-ratio:1.535/1;box-shadow:0 20px 48px rgba(0,0,0,.12);transition:.2s transform,.2s box-shadow;background:#fff}.service-panel-image img{width:100%;height:100%;object-fit:cover;display:block}.service-panel-image:hover{transform:translateY(-2px);box-shadow:0 26px 58px rgba(0,0,0,.16)}.service-panel-image span{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}.outline-light,.outline-dark{display:inline-flex;align-items:center;justify-content:center;height:52px;border-radius:999px;padding:0 26px;font-weight:1000}.outline-light{border:2px solid #fff;color:#fff}.outline-dark{border:2px solid #111;color:#111;background:#fff}
    .finds-band{margin:44px 0;padding:34px;border-radius:18px;background:#f7f8fb;display:grid;grid-template-columns:330px 1fr;gap:26px;align-items:center}.finds-text h2{font-size:34px;margin:0 0 12px}.finds-text p{font-weight:800;color:#5f6874}.finds-preview,.finds-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}.finds-preview{grid-template-columns:repeat(3,1fr);gap:16px}.finds-section-head{padding-top:24px;border-top:1px solid var(--line);margin-top:32px}.finds-section-head h2{font-size:32px;margin:0 0 8px}.finds-section-head p{margin:0 0 20px;color:#5f6874;font-weight:850}.find-card{background:#fff;border:1px solid var(--line);border-radius:18px;box-shadow:0 8px 24px rgba(0,0,0,.07);padding:14px;display:flex;flex-direction:column;gap:9px;min-height:452px}.find-media{height:176px;border-radius:14px;background:linear-gradient(180deg,#f5f8fc,#fff);display:grid;place-items:center;overflow:hidden;padding:12px}.find-media img{width:100%;height:100%;max-width:90%;max-height:148px;object-fit:contain;padding:0}.find-card h3{font-size:16px;line-height:1.22;margin:0;min-height:39px}.find-card p{font-size:12.5px;color:#59616d;font-weight:800;line-height:1.45;margin:0}.find-meta{font-size:12px;color:#0b7c72;font-weight:1000}.find-price{font-size:18px;font-weight:1000;text-align:center;color:#101318;margin:2px 0 2px;min-height:24px}.find-disclosure{border:1px solid #dceafe;background:#f6faff;border-radius:12px;padding:9px 10px;display:grid;gap:3px;color:#23445f}.find-disclosure span{font-size:11.5px;font-weight:1000;line-height:1.2}.find-disclosure small{font-size:10.8px;font-weight:900;line-height:1.25;color:#596b83}.market-actions{margin-top:auto;display:grid;gap:8px}.market-btn{min-height:42px;border-radius:999px;border:1px solid rgba(9,11,16,.88);background:linear-gradient(180deg,#fff8a8 0%,#fff159 58%,#f4d92a 100%);color:#2b2500;font-weight:1000;display:flex;align-items:center;justify-content:center;gap:9px;padding:0 13px;cursor:pointer;text-decoration:none;box-shadow:0 8px 20px rgba(0,0,0,.08),inset 0 1px 0 rgba(255,255,255,.72);transition:.18s transform,.18s box-shadow,.18s filter}.market-btn:hover{transform:translateY(-1px);box-shadow:0 12px 24px rgba(0,0,0,.12),inset 0 1px 0 rgba(255,255,255,.8);filter:saturate(1.04)}.market-btn img{height:25px;width:auto;max-width:82px;object-fit:contain}.market-mobilytech{background:linear-gradient(180deg,#7bc4ff 0%,#3da3ff 48%,#1688f2 100%);color:#fff;border:3px solid #087ff1;box-shadow:0 14px 28px rgba(9,103,214,.28),0 8px 18px rgba(13,23,38,.12),inset 0 2px 0 rgba(255,255,255,.35),inset 0 -4px 0 rgba(0,87,180,.18);text-shadow:0 1px 0 rgba(0,0,0,.12)}.market-mobilytech .market-cart-glyph svg{width:28px;height:28px;stroke:#fff;stroke-width:2.35;fill:none;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 2px 0 rgba(0,0,0,.08))}.market-ml{background:linear-gradient(180deg,#fff8a8 0%,#fff159 58%,#f4d92a 100%);color:#27220a;border-color:#d6bd00}.market-amazon{background:linear-gradient(180deg,#2d4056 0%,#232f3e 54%,#111820 100%);color:#fff;border-color:#ff9900;box-shadow:inset 0 -3px 0 #ff9900,0 8px 20px rgba(35,47,62,.16)}.market-shopee{background:linear-gradient(180deg,#ff714f,#ee4d2d);color:#fff;border-color:#d83a1c}.market-ali{background:linear-gradient(180deg,#ff7655 0%,#ff4e32 55%,#e63222 100%);color:#fff;border-color:#d73524}
    .market-btn{position:relative;isolation:isolate;height:58px;min-height:58px;width:100%;display:grid;grid-template-columns:104px 1px minmax(0,1fr);align-items:center;gap:15px;padding:0 18px;border-radius:999px;font-size:20px;line-height:1;letter-spacing:0;text-align:center;overflow:hidden}.market-btn:before,.market-btn:after{content:"";position:absolute;pointer-events:none;z-index:0}.market-brand,.market-sep,.market-label,.market-cart-glyph{position:relative;z-index:1}.market-brand{height:100%;display:flex;align-items:center;justify-content:center;min-width:0}.market-brand img{display:block;height:auto;max-height:43px;max-width:92px;width:auto;object-fit:contain}.market-sep{width:1px;height:34px;border-radius:999px;background:rgba(255,255,255,.42);box-shadow:1px 0 0 rgba(0,0,0,.16)}.market-label{display:flex;align-items:center;justify-content:center;min-width:0;font-size:20px;font-weight:1000;line-height:1;white-space:nowrap}.market-mobilytech{height:62px;min-height:62px;display:grid;grid-template-columns:52px 1px minmax(0,1fr);gap:16px;padding:0 22px;font-size:18px;line-height:1.05;white-space:normal;align-items:center}.market-mobilytech:before{left:8px;right:8px;top:7px;height:16px;border-radius:999px;background:linear-gradient(180deg,rgba(255,255,255,.42),rgba(255,255,255,.08));opacity:.9}.market-mobilytech .market-cart-glyph{display:grid;place-items:center}.market-mobilytech .market-sep{height:38px;background:rgba(255,255,255,.48);box-shadow:1px 0 0 rgba(0,86,176,.24)}.market-mobilytech .market-label{display:block;font-size:18px;color:#fff;text-align:center;white-space:normal;overflow-wrap:normal;word-break:normal;line-height:1.05}.market-ml{display:flex;align-items:center;justify-content:center;gap:13px;background:linear-gradient(180deg,#fffef4 0%,#fff36a 34%,#fff159 66%,#f0d719 100%);border:2px solid #e3c900;color:#221f08;box-shadow:0 12px 22px rgba(231,202,0,.22),inset 0 1px 0 rgba(255,255,255,.98),inset 0 -3px 0 rgba(185,159,0,.2)}.market-ml .market-brand{width:50px;height:30px;flex:0 0 50px}.market-ml .market-brand img{width:50px;height:30px;max-height:none;max-width:none}.market-ml .market-sep{display:none}.market-ml .market-label{font-size:20px;color:#24200a}.market-amazon{background:linear-gradient(180deg,#343434 0%,#171717 52%,#050505 100%);border:2px solid #f4a11e;color:#fff;box-shadow:0 12px 24px rgba(0,0,0,.22),inset 0 1px 0 rgba(255,255,255,.14),inset 0 -3px 0 rgba(246,162,26,.38)}.market-amazon:after{right:18px;bottom:7px;width:105px;height:32px;border-bottom:8px solid rgba(255,153,0,.18);border-radius:0 0 90px 90px;transform:rotate(-7deg)}.market-amazon .market-brand img{filter:none;max-height:46px;max-width:78px}.market-amazon .market-sep{background:rgba(255,255,255,.22);box-shadow:1px 0 0 rgba(246,162,26,.2)}.market-amazon .market-label{font-size:20px}.market-ali{background:linear-gradient(180deg,#ff3a1b 0%,#ee1205 54%,#c90000 100%);border:2px solid #ff9d1a;color:#fff;box-shadow:0 12px 24px rgba(224,21,8,.26),inset 0 1px 0 rgba(255,255,255,.26),inset 0 -3px 0 rgba(115,0,0,.18)}.market-ali:after{right:18px;top:13px;width:42px;height:42px;background:radial-gradient(circle at 50% 50%,rgba(255,114,40,.28) 0 24%,transparent 26%),linear-gradient(45deg,transparent 38%,rgba(255,114,40,.22) 40% 60%,transparent 62%),linear-gradient(-45deg,transparent 38%,rgba(255,114,40,.22) 40% 60%,transparent 62%);opacity:.9}.market-ali .market-brand img{filter:none;max-height:50px;max-width:86px}.market-ali .market-sep{background:rgba(255,211,109,.48);box-shadow:1px 0 0 rgba(93,0,0,.18)}.market-ali .market-label{font-size:20px}.market-art-btn{aspect-ratio:3/1;height:auto;min-height:0;padding:0;border:0;background:transparent!important;box-shadow:none!important;display:block;overflow:visible;transition:.18s transform,.18s filter}.market-art-btn:before,.market-art-btn:after{display:none}.market-art-btn:hover{transform:translateY(-1px);box-shadow:none!important;filter:saturate(1.03) brightness(1.01)}.market-button-art{width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;object-fit:fill;display:block}
    .drops-band{position:relative;overflow:hidden;background:#f4f8ff url("/assets/nossos-produtos-band-bg.png") center/cover no-repeat;border:1px solid #e5edf8;border-radius:20px;box-shadow:0 24px 58px rgba(22,47,86,.10);grid-template-columns:minmax(270px,340px) minmax(0,1fr);gap:30px;padding:58px 34px}.drops-band .finds-text{align-self:center;justify-self:center;max-width:330px}.drops-band .finds-text h2{font-size:clamp(34px,3.4vw,46px);line-height:1.13;margin-bottom:18px}.drops-band .finds-text p{font-size:17px;line-height:1.47;color:#415067}.drops-band .btn-dark{min-height:52px;padding-inline:24px;box-shadow:0 14px 28px rgba(0,0,0,.18)}.drops-band .find-card{border-radius:16px;border-color:#dae4f2;box-shadow:0 14px 32px rgba(30,55,86,.10);min-height:446px}.drops-band .find-media{background:linear-gradient(180deg,#f8fbff 0%,#fff 76%)}.find-price{font-size:21px;line-height:1.05;letter-spacing:0;color:#050b15;text-align:center;text-shadow:0 1px 0 rgba(255,255,255,.7)}.finds-layout .find-price{font-size:22px}.market-mobilytech{height:54px;min-height:54px;grid-template-columns:46px 1px minmax(0,1fr);gap:12px;padding:0 16px;border-width:2.5px;box-shadow:0 10px 22px rgba(9,103,214,.24),0 6px 14px rgba(13,23,38,.10),inset 0 2px 0 rgba(255,255,255,.36),inset 0 -3px 0 rgba(0,87,180,.18)}.market-mobilytech:before{left:8px;right:8px;top:6px;height:13px}.market-mobilytech .market-cart-glyph svg{width:24px;height:24px}.market-mobilytech .market-sep{height:32px}.market-mobilytech .market-label{font-size:16px;line-height:1.05}
    .finds-primary-head{text-align:center}.finds-primary-head h2{font-size:36px;line-height:1.06}.finds-primary-head h2 span{display:inline-block;margin-right:8px}.finds-primary-head p{max-width:780px;margin-left:auto;margin-right:auto}.public-compliance-note{border:1px solid #dceafe;background:#f6faff;border-radius:14px;padding:12px 14px;color:#23445f;font-size:13px;font-weight:900;line-height:1.45}.finds-layout{display:grid;grid-template-columns:minmax(230px,280px) 1fr;align-items:start;gap:22px;margin-top:22px}.finds-filters{position:sticky;top:92px;border:1px solid var(--line);border-radius:16px;background:#fff;padding:16px;box-shadow:0 8px 24px rgba(9,16,28,.07);display:grid;gap:12px}.finds-filter-form{display:grid;gap:12px;margin:0}.finds-search-label{font-size:12px;text-transform:uppercase;letter-spacing:.08em;font-weight:1000;color:#465366}.finds-search-control{position:relative;display:flex;align-items:center}.finds-search-apply{position:absolute;right:5px;top:50%;transform:translateY(-50%);width:38px;height:38px;border:0;border-radius:10px;background:#111;color:#fff;font-size:20px;font-weight:1000;display:grid;place-items:center;cursor:pointer;line-height:1}.finds-filters input,.finds-filters select{width:100%;border:1px solid #d9dee8;border-radius:11px;background:#fbfcfe;padding:11px 12px;font:inherit;font-size:14px;font-weight:850;color:#131923}.finds-filters .finds-search-control input{padding-right:52px}.finds-filter-block{border-top:1px solid #eef1f5;border-bottom:1px solid #eef1f5;padding:13px 0;display:grid;gap:11px}.finds-filter-head{display:flex;align-items:center;justify-content:space-between;gap:10px}.finds-filter-head strong{font-size:18px}.finds-filter-head button{border:0;background:#eef5ff;color:#075cab;border-radius:999px;padding:7px 10px;font-weight:1000;cursor:pointer}.finds-price-inputs{display:grid;grid-template-columns:1fr 1fr;gap:9px}.finds-price-inputs label{display:grid;gap:5px;font-size:11px;text-transform:uppercase;letter-spacing:.06em;font-weight:1000;color:#657081}.finds-range-wrap{position:relative;min-height:28px;display:grid;align-items:center}.finds-range-wrap input[type=range]{grid-area:1/1;width:100%;padding:0;background:transparent;accent-color:#111;pointer-events:none}.finds-range-wrap input[type=range]::-webkit-slider-thumb{pointer-events:auto}.finds-range-wrap input[type=range]::-moz-range-thumb{pointer-events:auto}.finds-apply{border:0;border-radius:999px;background:#111;color:#fff;min-height:42px;font-weight:1000;cursor:pointer;box-shadow:0 10px 20px rgba(0,0,0,.12)}.finds-count{margin:0;color:#59616d;font-size:13px;font-weight:900;line-height:1.35}.finds-layout .finds-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.account-logged-actions .account-logout-link{background:#111;color:#fff;border-color:#111}
    .reviews-head{display:grid;grid-template-columns:1fr auto;align-items:end;text-align:center}.reviews-head div{text-align:center;justify-self:center;max-width:820px;width:100%}.reviews-head .section-kicker,.reviews-head h2,.reviews-head p{text-align:center;margin-left:auto;margin-right:auto}.reviews-grid{display:grid;grid-template-columns:1.1fr repeat(4,1fr);gap:16px;margin-bottom:42px}.score-card,.review-card{background:#fff;border:1px solid var(--line);border-radius:16px;box-shadow:0 8px 24px rgba(0,0,0,.07);padding:26px;text-align:center}.score-card strong{font-size:56px}.stars{color:#ffc400;letter-spacing:.04em;font-size:22px}.review-card p{font-weight:800;color:#424a56}.review-card small{display:block;color:#6b7280;font-weight:900}
    .inline-clean,.split-form,.contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin:44px 0;padding:34px;border-radius:18px;background:#f7f8fb}.inline-clean{grid-template-columns:1.05fr .95fr;background:#f5f6f8;box-shadow:0 16px 42px rgba(16,24,40,.08);padding:22px 24px;align-items:center}.clean-form-visual{display:flex;flex-direction:column;justify-content:center;gap:12px}.clean-form-visual img{width:100%;height:auto;max-height:330px;object-fit:contain;border-radius:18px;box-shadow:0 14px 38px rgba(16,24,40,.08);background:#fff}.clean-page-copy{display:flex;flex-direction:column;gap:16px}.clean-side-image{width:100%;max-height:340px;object-fit:cover;border-radius:18px;box-shadow:0 14px 38px rgba(16,24,40,.08)}.lead-form{display:grid;gap:14px}.inline-clean .lead-form{gap:10px;align-self:center}.lead-form label{font-size:13px;text-transform:uppercase;letter-spacing:.07em;font-weight:1000;color:#5b6470}.lead-form input,.lead-form textarea{width:100%;margin-top:7px;border:1px solid #d8dde7;border-radius:12px;background:#fff;padding:14px 16px;color:#111;font-weight:800;outline:0}.inline-clean .lead-form input{padding:11px 14px}.inline-clean .btn-red{min-height:48px}.lead-form textarea{min-height:110px;resize:vertical}
    .about-strip,.powered-row{max-width:1540px;margin:44px auto 0;padding:32px 22px;border-top:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;gap:28px}.powered-row{display:block}.about-strip h2,.powered-row h2{margin:0 0 8px;font-size:28px}.about-strip p{max-width:980px;color:#5f6874;font-weight:800}.brand-line{display:flex;align-items:center;justify-content:space-between;gap:clamp(16px,2vw,34px);flex-wrap:nowrap;overflow-x:auto;padding:18px 0 6px;scrollbar-width:none;min-width:0;width:100%}.brand-line::-webkit-scrollbar{display:none}.brand-line .brand-logo{height:34px;max-width:116px;width:auto;object-fit:contain;opacity:1;flex:0 0 auto;filter:invert(1) saturate(.2) brightness(.9)}.brand-line .logo-microsoft{filter:none;height:32px;max-width:112px}.brand-line .logo-intel{max-width:88px}.brand-line .logo-kingston,.brand-line .logo-crucial{max-width:120px}
    .footer{max-width:1540px;margin:20px auto 0;padding:36px 22px;display:grid;grid-template-columns:1.7fr repeat(4,1fr);gap:34px;border-top:1px solid var(--line)}.footer h3{font-size:17px;margin:0 0 14px}.footer a{display:block;margin:8px 0;color:#303742;font-weight:800}.footer-brand img{width:52px}.footer-brand strong{display:block;font-size:19px;margin-top:10px}.footer-brand p,.payment-box p{color:#626a76;font-weight:800}.socials{display:flex;gap:12px}.socials img{width:24px;height:24px;object-fit:contain}.payment-icons{display:flex;gap:12px;align-items:center}.payment-icons img{height:26px;width:auto}.copyright{max-width:1540px;margin:0 auto;padding:0 22px 28px;color:#6b7280;font-weight:800}
    .page-hero{min-height:320px;border-radius:0 0 18px 18px;margin-bottom:32px;padding:54px 64px;display:grid;grid-template-columns:1fr 480px;align-items:center;overflow:hidden;background:linear-gradient(90deg,#f5f6f8,#ffffff);position:relative}.page-hero h1{font-size:48px;line-height:1.02;margin:0 0 14px}.page-hero p{font-size:20px;color:#4b5563;font-weight:800;max-width:700px}.page-hero img{justify-self:end;max-height:300px;object-fit:contain;filter:drop-shadow(0 18px 24px rgba(0,0,0,.18))}.page-hero-products{background:linear-gradient(90deg,#f4f4f4,#fff 48%,#e8f5ff)}.page-hero-finds{grid-template-columns:1fr;justify-items:center;text-align:center;min-height:280px;background:linear-gradient(180deg,#fff7df,#fff 52%,#e7fbff)}.page-hero-finds h1{font-size:clamp(52px,7vw,86px);font-weight:1000;letter-spacing:0}.page-hero-finds p{font-size:clamp(17px,2vw,22px);margin-left:auto;margin-right:auto}.finds-primary-head{justify-content:center;text-align:center;border-top:0;padding-top:0;margin-top:10px}.finds-primary-head div{max-width:920px;margin:0 auto}.finds-primary-head h2{font-size:clamp(34px,4vw,54px);font-weight:1000;line-height:1.02}.finds-primary-head p{margin-left:auto;margin-right:auto}.page-hero-build{background:linear-gradient(90deg,#fbe6e6,#fff 46%,#f1f1f1)}.page-hero-clean{background:linear-gradient(90deg,#effbe7,#fff 46%,#e8f5ff)}.page-hero-reviews,.page-hero-contact{grid-template-columns:1fr;background:#f7f8fb}
    .filter-row{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:18px}.filter-chip{border:1px solid var(--line);background:#fff;border-radius:999px;padding:11px 22px;font-weight:1000;cursor:pointer}.filter-chip.active{background:#111;color:#fff}.contact-grid article{background:#fff;border-radius:16px;padding:26px;box-shadow:0 8px 24px rgba(0,0,0,.07)}.contact-grid h2{margin:0 0 8px}.shipping-contact-card{position:relative;overflow:hidden}.shipping-contact-card img{position:absolute;right:18px;top:18px;width:58px;height:58px;object-fit:contain;opacity:.92;filter:drop-shadow(0 8px 14px rgba(0,0,0,.12))}.shipping-contact-card h2,.shipping-contact-card p{max-width:calc(100% - 70px)}
    .page-hero-account{grid-template-columns:1fr;background:linear-gradient(90deg,#e9fbfa,#fff 45%,#e8f5ff)}
    .account-layout{display:grid;grid-template-columns:minmax(0,1.08fr) minmax(360px,.72fr);gap:24px;margin:44px 0;align-items:start}.account-primary,.account-side{display:grid;gap:20px}
    .account-card{background:#fff;border:1px solid var(--line);border-radius:18px;box-shadow:0 10px 30px rgba(13,23,38,.08);padding:28px;min-width:0}
    .account-card-main{background:linear-gradient(135deg,#0b2034 0%,#123f5f 58%,#0b6b78 100%);color:#fff}.account-card h2{font-size:28px;line-height:1.08;margin:0 0 12px}.account-card p{color:#59616d;font-weight:800}.account-card.account-card-main p{color:#dbe7f2}.account-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:20px}.account-card-main .btn-white{background:#fff;color:#111}.outline-account{background:#fff;color:#111;border:2px solid #111}.account-session{margin:18px 0 0;border:1px solid var(--line);border-radius:16px;background:#f8fafc;padding:14px;display:grid;grid-template-columns:54px 1fr;gap:14px;align-items:center}.account-avatar{width:54px;height:54px;border-radius:50%;background:#111;color:#fff;display:grid;place-items:center;font-weight:1000;overflow:hidden}.account-avatar img{width:100%;height:100%;object-fit:cover}.account-session strong{display:block;font-size:18px}.account-session small{display:block;color:#657081;font-weight:850;line-height:1.35}.account-login-options{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}.orders-panel{display:grid;gap:12px;margin-top:16px}.order-card{border:1px solid var(--line);border-radius:16px;background:#fbfcfd;padding:15px;display:grid;gap:8px}.order-card-head{display:flex;justify-content:space-between;gap:12px;align-items:start}.order-card h3{margin:0;font-size:18px}.order-status-pill{border-radius:999px;background:#e9fbfa;color:#087f78;padding:6px 10px;font-size:11px;font-weight:1000;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap}.order-card dl{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:0}.order-card dt{font-size:11px;text-transform:uppercase;letter-spacing:.07em;color:#687182;font-weight:1000}.order-card dd{margin:2px 0 0;font-weight:950;color:#18202b}.secure-note-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:18px}.secure-note-list span{border:1px solid #e4eef8;background:#f8fbff;border-radius:12px;padding:12px;font-size:12px;font-weight:1000;color:#23445f;text-align:center}.whatsapp-btn{background:#18c56f;color:#04140b;box-shadow:0 10px 24px rgba(24,197,111,.18)}.whatsapp-btn img{width:22px;height:22px;object-fit:contain}
    .order-timeline{display:grid;gap:12px;margin:18px 0 0;padding:0;list-style:none}.order-timeline li{display:grid;grid-template-columns:40px 1fr;gap:12px;align-items:start;border:1px solid #edf0f4;border-radius:14px;padding:13px;background:#fbfcfd}.order-timeline b{width:40px;height:40px;border-radius:12px;background:#e9fbfa;color:#087f78;display:grid;place-items:center}.order-timeline strong{display:block;line-height:1.15}.order-timeline small{display:block;color:#626a76;font-weight:800;margin-top:3px}
.cart-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:40}.cart-drawer{position:fixed;top:0;right:0;width:min(460px,100vw);height:100vh;background:#fff;z-index:41;box-shadow:-20px 0 60px rgba(0,0,0,.18);border-left:1px solid var(--line);transform:translateX(105%);visibility:hidden;pointer-events:none;transition:.25s transform,.25s visibility;padding:24px;display:flex;flex-direction:column;gap:18px;overflow:auto}.cart-drawer.open{transform:translateX(0);visibility:visible;pointer-events:auto}.drawer-head{display:flex;justify-content:space-between;align-items:start}.drawer-head small{text-transform:uppercase;letter-spacing:.11em;color:var(--red);font-weight:1000}.drawer-head h2{font-size:34px;margin:0}.close-drawer{border:0;background:#f0f1f4;border-radius:50%;width:38px;height:38px;font-size:28px;cursor:pointer}.drawer-items{display:grid;gap:12px;min-height:46px}.drawer-item{display:grid;grid-template-columns:76px 1fr auto;gap:12px;align-items:start;border:1px solid var(--line);border-radius:14px;padding:12px}.drawer-item img{width:76px;height:76px;object-fit:contain;background:#f6f7fa;border-radius:10px}.drawer-item h3{font-size:14px;line-height:1.2;margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.drawer-item small{display:block;color:#626a76;font-weight:800;margin:4px 0;line-height:1.25}.drawer-total{border-top:1px solid var(--line);padding-top:14px;display:flex;justify-content:space-between;font-size:22px;font-weight:1000}.coupon-box,.shipping-box{border:1px solid var(--line);border-radius:14px;padding:14px}.coupon-box label,.shipping-box label{display:block;margin:0 0 10px;font-weight:1000}.coupon-box input,.shipping-box input{width:100%;padding:12px;border:1px solid var(--line);border-radius:10px}.coupon-box small{display:block;color:#687182;font-size:12px;font-weight:900;line-height:1.35}.shipping-box summary{font-weight:1000;cursor:pointer}.shipping-box label{margin:12px 0}.delivery-choice{display:grid;gap:8px;margin-top:12px}.delivery-choice:empty{display:none}.shipping-quotes{display:grid;gap:8px;margin-top:10px}.shipping-option{border:1px solid var(--line);border-radius:12px;padding:11px 12px;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:12px;cursor:pointer}.shipping-option.is-selected{border-color:#111;background:#f8fafc}.shipping-option.is-muted{background:#f7f8fb;color:#687182}.ship-main{display:flex;align-items:flex-start;gap:9px;min-width:0}.ship-main input{width:auto;margin-top:3px;flex:0 0 auto}.ship-copy{min-width:0}.ship-copy strong{display:block;font-size:14px;line-height:1.22;word-break:normal}.ship-copy small{display:block;margin-top:3px;color:#687182;font-size:12px;font-weight:900}.ship-price{white-space:nowrap;font-size:14px}.checkout-review{border:1px solid #dceafe;background:#f6faff;border-radius:14px;padding:13px;display:grid;gap:9px;color:#24384d}.checkout-review[hidden]{display:none}.checkout-review h3{margin:0;font-size:16px;line-height:1.15}.checkout-review p{margin:0;color:#536174;font-size:12.5px;font-weight:850;line-height:1.35}.checkout-review dl{display:grid;grid-template-columns:1fr auto;gap:6px 12px;margin:0}.checkout-review dt{color:#5f6b7a;font-size:12px;font-weight:1000}.checkout-review dd{margin:0;text-align:right;font-size:12.5px;font-weight:1000;color:#101318}.checkout-review a{text-decoration:underline;text-underline-offset:2px}.checkout-actions{display:grid;gap:10px}.checkout-pay{border:0;color:#111;box-shadow:0 10px 24px rgba(0,0,0,.11);gap:10px}.checkout-pay img{height:26px;max-width:92px;object-fit:contain}.checkout-mercado{background:#fff159;color:#1d2730}.checkout-abacate{background:#18f28b;color:#06130d}.drawer-note{font-size:13px;color:#666;font-weight:800}.policy-check{display:grid;grid-template-columns:20px 1fr;gap:10px;align-items:flex-start;border:1px solid var(--line);border-radius:14px;padding:12px;background:#f8fafc;color:#3c4450;font-size:12.5px;font-weight:900;line-height:1.35}.policy-check input{width:18px;height:18px;margin:0;accent-color:var(--red)}.policy-check a{color:#111;text-decoration:underline;text-underline-offset:2px}.toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%) translateY(20px);background:#111;color:#fff;border-radius:999px;padding:12px 22px;font-weight:900;z-index:60;opacity:0;pointer-events:none;transition:.2s}.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
.drawer-item{grid-template-columns:76px minmax(0,1fr) 38px;align-items:start;min-height:102px}.drawer-item>div{min-width:0}.drawer-item strong{display:block;margin-top:5px;font-size:15px;line-height:1.1;white-space:nowrap}.drawer-adjustment{grid-template-columns:minmax(0,1fr) auto;min-height:0;align-items:center}.drawer-adjustment>div:first-child:empty{display:none}.drawer-adjustment strong{margin:0;text-align:right}.drawer-total{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:12px;font-size:22px;line-height:1.05}.drawer-total strong{white-space:nowrap;text-align:right}.coupon-control{display:grid;grid-template-columns:minmax(0,1fr) 46px;gap:8px;align-items:center}.coupon-box .coupon-control input{height:48px;padding:0 13px}.coupon-apply{height:48px;border:0;border-radius:12px;background:#111;color:#fff;font-size:25px;font-weight:1000;line-height:1;display:grid;place-items:center;cursor:pointer;box-shadow:0 10px 20px rgba(0,0,0,.13)}.coupon-apply:hover{filter:brightness(1.08)}.checkout-review dl{grid-template-columns:minmax(0,1fr) minmax(92px,auto)}.checkout-review dd{overflow-wrap:anywhere}
.cart-drawer>*{flex-shrink:0}.drawer-items{flex:0 0 auto;align-content:start}.drawer-item.drawer-adjustment{grid-template-columns:minmax(0,1fr) auto;min-height:74px}.drawer-item.drawer-adjustment>div:first-child{display:none}.drawer-item.drawer-adjustment h3{font-size:13px;margin:0}.drawer-item.drawer-adjustment small{margin:4px 0 0}.drawer-item.drawer-adjustment strong{align-self:center;margin:0;text-align:right}
.drawer-item{overflow:hidden}.drawer-item>div{display:grid;gap:3px;align-content:start}.drawer-item h3,.drawer-item small,.drawer-item strong{min-width:0}.drawer-item small{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.drawer-item .close-drawer{align-self:start;line-height:1}.drawer-item-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:2px;min-width:0}.drawer-item-foot strong{margin:0;text-align:right}.drawer-qty{display:inline-grid;grid-template-columns:28px 34px 28px;align-items:center;justify-self:start;border:1px solid #d8e0ea;border-radius:999px;overflow:hidden;background:#f8fafc;min-height:28px}.drawer-qty button{width:28px;height:28px;border:0;background:#fff;color:#111;font-size:17px;font-weight:1000;line-height:1;cursor:pointer}.drawer-qty button:disabled{color:#aab2bf;cursor:not-allowed}.drawer-qty span{min-width:34px;text-align:center;font-size:12px;font-weight:1000;color:#111}
.market-mobilytech{aspect-ratio:7.1008/1;height:auto;min-height:0;display:block;grid-template-columns:none;padding:0;border:0;border-radius:0;overflow:visible;background:transparent url("/assets/add-to-cart-button-ref.png") center/100% 100% no-repeat!important;box-shadow:none;text-shadow:none;color:transparent}.market-mobilytech:before,.market-mobilytech:after{display:none}.market-mobilytech .market-cart-glyph,.market-mobilytech .market-sep,.market-mobilytech .market-label{opacity:0}
.drops-band{padding:46px 34px;background-color:#f8fbff}.drops-band .find-card{padding:12px;gap:7px;min-height:0}.drops-band .find-media{height:156px}.drops-band .find-media img{max-height:132px}.drops-band .find-card h3{min-height:34px}.drops-band .find-card p{font-size:11.7px;line-height:1.3;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.drops-band .find-disclosure{padding:7px 9px;gap:2px}.drops-band .find-disclosure span{font-size:10.8px}.drops-band .find-disclosure small{font-size:9.8px;line-height:1.18}.drops-band .find-price{font-size:20px;min-height:21px}.drops-band .market-actions{margin-top:0}
.page-hero-legal,.unavailable-page{background:#f8fafc;border:1px solid var(--line)}.legal-layout{max-width:1120px;margin:34px auto;padding:0 24px;display:grid;grid-template-columns:260px minmax(0,1fr);gap:18px}.legal-note,.legal-card{border:1px solid var(--line);border-radius:16px;background:#fff;box-shadow:var(--shadow)}.legal-note{position:sticky;top:120px;align-self:start;display:grid;gap:8px;padding:18px;font-size:13px;font-weight:900;color:#59616d}.legal-note strong{font-size:18px;color:#111}.legal-note a{color:#111}.legal-grid{display:grid;gap:14px}.legal-card{padding:20px}.legal-card h2{font-size:22px;margin:0 0 8px}.legal-card p{margin:0;color:#59616d;font-weight:800;line-height:1.55}
    .product-modal{border:0;border-radius:18px;padding:0;max-width:920px;width:calc(100vw - 40px);box-shadow:0 28px 90px rgba(0,0,0,.28)}.product-modal::backdrop{background:rgba(0,0,0,.45)}#modalBody{padding:28px}.modal-grid{display:grid;grid-template-columns:330px 1fr;gap:28px}.modal-grid img{height:300px;width:100%;object-fit:contain;background:#f6f7fb;border-radius:16px}.modal-grid h2{font-size:28px;margin:0 0 8px}.spec-list{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:16px 0}.spec-list span{background:#f4f6f8;border-radius:10px;padding:10px;font-weight:900;color:#4b5563}.option-box{display:grid;gap:8px;margin:14px 0}.option-box label{display:flex;justify-content:space-between;gap:12px;border:1px solid var(--line);border-radius:10px;padding:10px;font-weight:900;cursor:pointer}.variant-box{display:grid;gap:7px;margin:14px 0}.variant-box label{font-weight:1000}.variant-select{width:100%;min-height:46px;border:1px solid var(--line);border-radius:12px;background:#fff;padding:0 12px;font-weight:900;color:#111}.variant-note{font-size:12px;color:#687182;font-weight:900;line-height:1.3;margin:0}
    @media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}.account-popover,.account-popover.is-closing{animation:none}.btn,.service-panel-image,.cart-drawer,.toast,.account-action span{transition:none}}
    @media (max-width:1100px){
      .nav-shell{grid-template-columns:auto 1fr auto auto;grid-auto-rows:auto;height:auto;padding:12px 18px}.main-nav{grid-column:1/5;order:4;justify-content:flex-start;overflow-x:auto;padding-bottom:6px}.search-zone{grid-column:1/3;order:2}.account-menu-wrap{display:flex;justify-self:end}.cart-mini{justify-self:end}.hero-slider{grid-template-columns:1fr;gap:22px;padding:38px 24px}.hero-pc{max-height:310px}.hero-deal-card{max-width:360px}.trust-row{grid-template-columns:repeat(2,1fr)}.trust-row article:nth-child(2){border-right:0}.product-grid,.catalog-grid,.hardware-grid{grid-template-columns:repeat(3,1fr)}.finds-band{grid-template-columns:1fr}.reviews-grid{grid-template-columns:repeat(2,1fr)}.score-card{grid-column:1/3}.footer{grid-template-columns:repeat(2,1fr)}.page-hero{grid-template-columns:1fr;padding:42px 28px}.page-hero img{justify-self:center}.ibp-panels,.split-form,.inline-clean,.contact-grid,.account-layout{grid-template-columns:1fr}
    }
    @media (max-width:680px){
      body{font-size:14px}
      main{width:auto;max-width:none;padding-left:0;padding-right:0;margin-left:22px;margin-right:22px}
      .topbar-inner{height:36px;font-size:11px;padding:0 8px;gap:10px}
      .nav-shell{gap:8px;padding:10px 12px;grid-template-columns:auto 1fr auto}
      .brand{gap:8px}
      .brand span{font-size:16px}
      .brand img{width:38px;height:38px}
      .cart-mini{height:38px;font-size:23px}
      .cart-mini strong{min-width:18px;height:18px;font-size:11px}
      .main-nav{grid-column:1/4;order:3;width:100%;gap:7px;justify-content:flex-start;overflow-x:auto;flex-wrap:nowrap;padding:2px 0 5px}
      .nav-link{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;min-height:32px;border:0;border-bottom:3px solid transparent;border-radius:0;padding:7px 2px;font-size:11.5px;line-height:1;background:transparent}
      .nav-separator{display:inline-flex;align-items:center;color:#b8bec8;font-size:13px}
      .search-zone{grid-column:1/4;order:2;width:100%}
      .search-pill{height:40px}
      .search-results{top:calc(100% + 8px);max-height:300px}
      .search-result{grid-template-columns:30px 1fr;padding:10px}
      .search-result-icon{width:30px;height:30px}
      .search-result-type{display:none}
      .hero-slider{min-height:0;border-radius:0 0 14px 14px;padding:28px 18px}
      .hero-copy{max-width:300px}
      .hero-copy h1{font-size:30px;line-height:1.04}
      .hero-copy p{font-size:16px}
      .hero-actions{display:grid;grid-template-columns:1fr;gap:10px;max-width:300px}
      .hero-actions .btn{width:100%;padding:0 14px}
      .hero-deal-card{padding:18px}
      .hero-pc{max-height:250px}
      .btn{min-height:46px;padding:0 20px}
      .trust-row{grid-template-columns:1fr}
      .trust-row article{border-right:0;border-bottom:1px solid var(--line);padding:16px}
      .trust-row article:last-child{border-bottom:0}
      .section-head{align-items:start;flex-direction:column}
      .section-head h2{font-size:28px}
      section[id], .product-card[id], .find-card[id], .page-hero[id]{scroll-margin-top:216px}
      .product-grid,.catalog-grid{grid-template-columns:1fr;gap:14px;max-width:390px;margin-inline:auto}
      .hardware-grid,#homeHardwareGrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;max-width:none;margin-inline:0}
      .product-media{height:154px;padding:16px 12px 8px}
      .product-media img{max-height:94px;max-width:84%}
      .product-card[data-kind="pc"] .product-media{height:214px;padding:20px 14px 10px}
      .product-card[data-kind="pc"] .product-media img{max-height:166px;max-width:80%;transform:none}
      .product-body{padding:12px;gap:8px}
      .product-card h3{font-size:14px;min-height:34px}
      .product-card[data-kind="pc"] h3{font-size:16px;min-height:0}
      .price{font-size:18px}
      .product-card[data-kind="pc"] .price{font-size:24px}
      .old-price{display:block;margin-right:0}
      .installment{font-size:11px}
      .spec-line{font-size:12px;min-height:34px}
      .product-card[data-kind="pc"] .spec-line{min-height:0}
      .card-actions{gap:7px}
      .ghost-btn,.cart-btn{height:38px;font-size:10px}
      .product-card[data-kind="pc"] .ghost-btn,.product-card[data-kind="pc"] .cart-btn{height:44px;font-size:13px}
      .cart-btn .cart-icon{font-size:13px}
      .ibp-panels{gap:14px}
      .service-panel-image{aspect-ratio:1.535/1;min-height:0}
      .finds-preview{grid-template-columns:1fr;max-width:360px;margin-inline:auto}
      .finds-layout{grid-template-columns:1fr;gap:14px}
      .finds-filters{position:static;top:auto}
      .finds-layout .finds-grid,.finds-grid{grid-template-columns:1fr;gap:14px;max-width:360px;margin-inline:auto}
      .find-card{min-height:356px;padding:8px;border-radius:12px;gap:6px}
      .find-media{height:84px;border-radius:10px;padding:6px}
      .find-media img{max-width:94%;max-height:72px}
      .find-card h3{font-size:10.8px;line-height:1.16;min-height:38px;overflow-wrap:anywhere}
      .find-card p{font-size:9.4px;line-height:1.25;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
      .find-price{font-size:13px;line-height:1.05;min-height:16px;margin:0}
      .find-disclosure{padding:6px 7px;border-radius:9px}
      .find-disclosure span{font-size:9.4px}
      .find-disclosure small{font-size:8.8px;line-height:1.2}
      .market-actions{gap:5px}
      .market-mobilytech{height:56px;min-height:56px;grid-template-columns:28px 1px minmax(0,1fr);gap:6px;padding:0 7px}
      .market-mobilytech .market-cart-glyph svg{width:18px;height:18px}
      .market-mobilytech .market-sep{height:30px}
      .market-mobilytech .market-label{font-size:10.8px;line-height:1.05}
      .market-art-btn{aspect-ratio:3/1}
      .finds-primary-head h2{font-size:28px;line-height:1.08}
      .finds-band{padding:20px;gap:16px}
      .finds-text h2{font-size:30px;line-height:1.05}
      .finds-text p{font-size:13.5px;line-height:1.45}
      .find-media{height:116px;padding:8px}
      .find-media img{max-height:96px;max-width:90%}
      .find-card{padding:9px;border-radius:14px;min-height:382px}
      .find-card h3{font-size:12.6px;line-height:1.2;min-height:45px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
      .find-card p{font-size:10.8px;line-height:1.28;overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
      .find-price{font-size:14px;line-height:1.05;min-height:17px}
      .market-btn{height:58px;min-height:58px;font-size:20px;width:100%;padding:0 18px;grid-template-columns:104px 1px minmax(0,1fr);gap:15px}
      .market-mobilytech{height:58px;min-height:58px;grid-template-columns:28px 1px minmax(0,1fr);gap:6px;padding:0 8px}
      .market-mobilytech .market-label{font-size:11.8px;line-height:1.05}
      .market-mobilytech .market-cart-glyph svg{width:23px;height:23px}
      .drops-band{border-radius:16px;padding:22px 14px;background-position:center top}
      .drops-band .finds-text{max-width:330px;text-align:left}
      .drops-band .finds-text h2{font-size:28px}
      .drops-band .finds-text p{font-size:13px}
      .drops-band .find-card{min-height:372px}
      .market-mobilytech{height:50px;min-height:50px;grid-template-columns:30px 1px minmax(0,1fr);gap:7px;padding:0 8px}
      .market-mobilytech .market-label{font-size:11.2px;line-height:1.04}
      .market-mobilytech .market-sep{height:28px}
      .market-mobilytech .market-cart-glyph svg{width:18px;height:18px}
      .market-brand img{max-height:43px;max-width:92px}
      .market-ml .market-brand{width:50px;height:30px;flex:0 0 50px}
      .market-ml .market-brand img{width:50px;height:30px;max-height:none;max-width:none}
      .market-amazon .market-brand img{max-height:46px;max-width:78px}
      .market-ali .market-brand img{max-height:50px;max-width:86px}
      .market-label,.market-ali .market-label,.market-ml .market-label{font-size:20px}
      .market-amazon .market-label{font-size:20px}
      .market-sep{height:34px}
      .market-art-btn{aspect-ratio:3/1;height:auto;min-height:0;padding:0;display:block}
      .reviews-head{display:flex;text-align:center;align-items:center}
      .reviews-head div{justify-self:auto;text-align:center}
      .reviews-grid{grid-template-columns:1fr}
      .score-card{grid-column:auto}
      .about-strip,.powered-row{align-items:start;flex-direction:column}
      .about-strip h2,.powered-row h2{font-size:24px;line-height:1.08}
      .brand-line{width:100%;gap:16px 20px;justify-content:center;flex-wrap:wrap;overflow:visible;padding-top:12px}
      .brand-line .brand-logo{height:24px;max-width:78px;flex:0 0 auto}
      .footer{grid-template-columns:1fr}
      .page-hero{min-height:0;padding:24px 18px;gap:14px}
      .page-hero h1{font-size:30px;line-height:1.05}
      .page-hero p{font-size:14px;line-height:1.45}
      .page-hero img{max-height:160px}
      .page-hero-account,.account-layout{width:100%;max-width:360px;margin-left:0;margin-right:auto}
      .account-layout{grid-template-columns:1fr;gap:14px;margin-top:24px;margin-bottom:24px}
      .account-card{padding:18px;border-radius:16px}
      .account-card h2{font-size:21px}
      .account-card h2,.account-card p,.account-card small,.order-timeline strong{overflow-wrap:anywhere;word-break:break-word}
      .account-actions{display:grid;gap:10px}
      .account-login-options,.secure-note-list{grid-template-columns:1fr;display:grid}.account-login{width:100%}
      .order-card dl{grid-template-columns:1fr}
      .order-timeline li{grid-template-columns:34px 1fr;padding:11px}
      .order-timeline b{width:34px;height:34px}
      .modal-grid{grid-template-columns:1fr}
      .modal-grid img{height:220px}
      .spec-list{grid-template-columns:1fr}
      .variant-select{min-height:42px;font-size:12px}
      .cart-drawer{padding:18px;width:100vw}
      .drawer-items{max-height:min(43vh,340px);overflow:auto;overscroll-behavior:contain;padding-right:2px}
      .drawer-item{grid-template-columns:58px minmax(0,1fr) 32px;gap:9px;min-height:88px;align-items:center}
      .drawer-item img{width:58px;height:58px}
      .drawer-item h3{font-size:12.5px;line-height:1.16;-webkit-line-clamp:2;min-height:0}
      .drawer-item small{font-size:10.5px;line-height:1.18;-webkit-line-clamp:1;margin:1px 0 0}
      .drawer-item strong{font-size:13.5px;line-height:1.05;margin-top:2px;white-space:nowrap}
      .drawer-qty{grid-template-columns:24px 28px 24px;min-height:24px}
      .drawer-qty button{width:24px;height:24px;font-size:15px}
      .drawer-qty span{min-width:28px;font-size:11px}
      .drawer-total{font-size:20px}
      .coupon-control{grid-template-columns:minmax(0,1fr) 42px}
      .coupon-box .coupon-control input,.coupon-apply{height:44px}
      .checkout-review dl{grid-template-columns:minmax(0,1fr) minmax(82px,auto)}
      .drawer-head h2{font-size:30px}
      .shipping-option{grid-template-columns:1fr;align-items:start}
      .ship-price{justify-self:end}
      .inline-clean{padding:18px;gap:18px}
      .inline-clean .lead-form{gap:10px}
      .inline-clean .lead-form input{padding:11px 13px}
      .inline-clean .btn-red{min-height:48px}
      .clean-form-visual img{max-height:260px}
      .shipping-contact-card img{width:44px;height:44px;right:14px;top:14px}
      .shipping-contact-card h2,.shipping-contact-card p{max-width:calc(100% - 52px)}
      .legal-layout{grid-template-columns:1fr;padding:0 16px;margin:22px auto}
      .legal-note{position:static}
      .legal-card{padding:16px}
      .market-mobilytech{aspect-ratio:7.1008/1;height:auto;min-height:0;display:block;padding:0;border-radius:0;overflow:visible;background-image:url("/assets/add-to-cart-button-ref.png")!important;background-position:center!important;background-size:100% 100%!important;background-repeat:no-repeat!important}
      .finds-preview[data-source="dropshipping"],.finds-grid[data-source="dropshipping"]{grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;max-width:none;width:calc(100vw - 8px);margin-left:calc(50% - 50vw + 4px);margin-right:calc(50% - 50vw + 4px)}
      .drops-band{width:calc(100vw - 8px);margin-left:calc(50% - 50vw + 4px);margin-right:calc(50% - 50vw + 4px);padding:18px 6px}
      .drops-band .finds-preview[data-source="dropshipping"]{width:100%;margin-inline:0}
      .drops-band .finds-text{max-width:none;text-align:center;background:rgba(255,255,255,.74);border:1px solid rgba(218,228,242,.82);border-radius:16px;padding:16px 14px;box-shadow:0 14px 32px rgba(30,55,86,.10);backdrop-filter:blur(6px)}
      .drops-band .finds-text .section-kicker{justify-content:center}
      .drops-band .finds-text .btn-dark{justify-self:center;margin-inline:auto}
      .drops-band .finds-text{padding-inline:0}
      .finds-preview[data-source="dropshipping"] .find-card,.finds-grid[data-source="dropshipping"] .find-card{min-height:0;padding:6px;border-radius:12px;gap:5px}
      .finds-preview[data-source="dropshipping"] .find-media,.finds-grid[data-source="dropshipping"] .find-media{height:88px;padding:5px;border-radius:10px}
      .finds-preview[data-source="dropshipping"] .find-media img,.finds-grid[data-source="dropshipping"] .find-media img{max-height:78px;max-width:94%}
      .finds-preview[data-source="dropshipping"] .find-card h3,.finds-grid[data-source="dropshipping"] .find-card h3{font-size:10.5px;line-height:1.16;min-height:36px;-webkit-line-clamp:3}
      .finds-preview[data-source="dropshipping"] .find-card p,.finds-grid[data-source="dropshipping"] .find-card p{font-size:9.2px;line-height:1.18;-webkit-line-clamp:2}
      .finds-preview[data-source="dropshipping"] .find-price,.finds-grid[data-source="dropshipping"] .find-price{font-size:14px;min-height:15px;margin:0}
      .finds-preview[data-source="dropshipping"] .find-disclosure,.finds-grid[data-source="dropshipping"] .find-disclosure{padding:5px 6px;border-radius:8px;gap:1px}
      .finds-preview[data-source="dropshipping"] .find-disclosure span,.finds-grid[data-source="dropshipping"] .find-disclosure span{font-size:8.2px;line-height:1.12;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .finds-preview[data-source="dropshipping"] .find-disclosure small,.finds-grid[data-source="dropshipping"] .find-disclosure small{font-size:7.5px;line-height:1.12;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
      .finds-preview[data-source="dropshipping"] .market-actions,.finds-grid[data-source="dropshipping"] .market-actions{margin-top:0;gap:0}
      body{font-size:13px;line-height:1.38}
      main{margin-left:10px;margin-right:10px;padding-bottom:22px}
      .topbar-inner{height:28px;font-size:10.5px;gap:8px;line-height:1.15}
      .ticker-arrow{font-size:22px}
      .nav-shell{padding:7px 10px;gap:5px;grid-template-columns:auto 1fr auto}
      .brand img{width:32px;height:32px}
      .brand span{font-size:14px}
      .icon-action,.cart-mini{height:34px}
      .account-action{width:36px}
      .account-action span{width:28px;height:28px}
      .cart-mini{font-size:21px}
      .search-pill{height:34px;padding:0 12px;font-size:12.5px}
      .main-nav{gap:5px;padding:0 0 3px}
      .nav-link{min-height:27px;font-size:10.5px;padding:5px 1px}
      .nav-separator{font-size:11px}
      section[id], .product-card[id], .find-card[id], .page-hero[id]{scroll-margin-top:150px}
      .hero-slider{display:grid;grid-template-columns:minmax(0,1.08fr) minmax(110px,.92fr);grid-template-areas:"copy image" "deal deal";gap:12px;margin-bottom:18px;padding:18px 14px;border-radius:14px;align-items:center}
      .hero-copy{grid-area:copy;max-width:none}
      .hero-copy h1{font-size:23px;line-height:1.04;margin-bottom:10px}
      .hero-copy p{font-size:12.5px;line-height:1.36;margin-bottom:12px}
      .hero-actions{grid-template-columns:1fr;gap:7px;max-width:210px}
      .hero-actions .btn,.btn{min-height:36px;padding:0 12px;font-size:12px}
      .hero-pc{grid-area:image;max-height:138px;justify-self:center;align-self:center;filter:drop-shadow(0 0 0 #fff) drop-shadow(3px 5px 0 rgba(255,255,255,.88)) drop-shadow(0 12px 20px rgba(0,0,0,.24))}
      .hero-deal-card{grid-area:deal;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px 12px;align-items:center;padding:13px;border-radius:12px;max-width:none}
      .hero-deal-card span{grid-column:1 / -1;font-size:10px}
      .hero-deal-card h2{font-size:17px;line-height:1.12;margin:0}
      .hero-deal-card p{font-size:12px;line-height:1.3;margin:0}
      .hero-deal-card strong{font-size:18px;margin:0}
      .hero-deal-card .small-link{grid-row:2 / 4;grid-column:2;min-height:34px;padding:7px 12px;font-size:11px;white-space:nowrap}
      .trust-row{grid-template-columns:repeat(2,minmax(0,1fr));margin-bottom:20px}
      .trust-row article{grid-template-columns:32px minmax(0,1fr);gap:1px 8px;padding:10px;border-right:1px solid var(--line);border-bottom:1px solid var(--line)}
      .trust-row article:nth-child(2n){border-right:0}
      .trust-row article:nth-last-child(-n+2){border-bottom:0}
      .trust-row span{width:28px;height:28px;border-radius:8px;font-size:16px}
      .trust-row strong{font-size:12.5px;line-height:1.15}
      .trust-row small{font-size:10.5px;line-height:1.2}
      .section-head{gap:8px;margin:24px 0 12px}
      .section-head h2,.finds-primary-head h2{font-size:24px;line-height:1.08}
      .section-head p,.finds-primary-head p{font-size:12.5px;line-height:1.4}
      .section-kicker{font-size:10.5px;margin-bottom:5px}
      .page-hero{padding:18px 14px;margin-bottom:20px;border-radius:14px;gap:10px}
      .page-hero h1,.page-hero-finds h1{font-size:25px;line-height:1.04;margin-bottom:8px}
      .page-hero p,.page-hero-finds p{font-size:12.5px;line-height:1.38}
      .page-hero img{max-height:118px}
      .product-grid,.catalog-grid,.finds-layout .finds-grid,.finds-grid,.finds-preview{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;max-width:none;margin-inline:0}
      .product-card[data-kind="pc"]{grid-column:1 / -1}
      .product-card{min-height:0;border-radius:12px}
      .product-media{height:98px;padding:10px 8px 5px;border-radius:12px 12px 0 0}
      .product-media img{max-height:78px}
      .product-body{padding:9px;gap:6px}
      .product-card h3{font-size:11.5px;line-height:1.16;min-height:32px}
      .spec-line{font-size:10.5px;line-height:1.24;min-height:28px}
      .price{font-size:15.5px}
      .ghost-btn,.cart-btn{height:32px;font-size:9.5px;border-width:1.5px}
      .product-card[data-kind="pc"] .product-media{height:170px}
      .product-card[data-kind="pc"] .product-media img{max-height:132px}
      .product-card[data-kind="pc"] h3{font-size:14px}
      .product-card[data-kind="pc"] .price{font-size:21px}
      .finds-band{margin:24px 0;padding:14px;gap:12px;border-radius:14px}
      .finds-text h2{font-size:24px;line-height:1.08;margin-bottom:8px}
      .finds-text p{font-size:12px;line-height:1.38}
      .find-card{min-height:0;padding:8px;border-radius:12px;gap:6px}
      .find-media{height:98px;padding:6px;border-radius:10px}
      .find-media img{max-height:86px;max-width:94%}
      .find-card h3{font-size:11px;line-height:1.17;min-height:39px;-webkit-line-clamp:3}
      .find-card p{font-size:9.4px;line-height:1.2;-webkit-line-clamp:2}
      .find-price{font-size:15px;min-height:17px}
      .find-disclosure{padding:5px 6px;border-radius:8px}
      .find-disclosure span{font-size:8.5px;line-height:1.12;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .find-disclosure small{font-size:7.6px;line-height:1.12;-webkit-line-clamp:2}
      .market-btn{height:auto;min-height:0;aspect-ratio:3/1;padding:0 8px;font-size:13px;grid-template-columns:46px 1px minmax(0,1fr);gap:8px}
      .market-label,.market-ali .market-label,.market-ml .market-label,.market-amazon .market-label{font-size:13px}
      .market-brand img{max-height:28px;max-width:50px}
      .market-sep{height:22px}
      .market-mobilytech{aspect-ratio:7.1008/1;height:auto;min-height:0;display:block;padding:0;border-radius:0;background-size:100% 100%!important}
      .drops-band{width:100%;margin-left:0;margin-right:0;padding:12px 0;border-radius:14px}
      .drops-band .finds-text{margin:0 10px;padding:12px 10px;border-radius:12px}
      .drops-band .finds-text h2{font-size:22px;line-height:1.08}
      .drops-band .finds-text p{font-size:11.5px}
      .finds-preview[data-source="dropshipping"],.finds-grid[data-source="dropshipping"]{width:calc(100% + 12px);margin-left:-6px;margin-right:-6px;gap:8px}
      .drops-band .finds-preview[data-source="dropshipping"]{width:calc(100% + 12px);margin-left:-6px;margin-right:-6px}
      .finds-preview[data-source="dropshipping"] .find-card,.finds-grid[data-source="dropshipping"] .find-card{padding:9px;gap:7px}
      .finds-preview[data-source="dropshipping"] .find-media,.finds-grid[data-source="dropshipping"] .find-media{height:108px}
      .finds-preview[data-source="dropshipping"] .find-media img,.finds-grid[data-source="dropshipping"] .find-media img{max-height:96px}
      .finds-preview[data-source="dropshipping"] .find-card h3,.finds-grid[data-source="dropshipping"] .find-card h3{font-size:11.3px;line-height:1.18;min-height:42px}
      .finds-preview[data-source="dropshipping"] .find-card p,.finds-grid[data-source="dropshipping"] .find-card p{font-size:9.6px;line-height:1.22}
      .finds-preview[data-source="dropshipping"] .find-price,.finds-grid[data-source="dropshipping"] .find-price{font-size:16px;min-height:18px}
      .reviews-grid,.contact-grid{gap:10px}
      .score-card,.review-card,.contact-grid article,.account-card,.legal-card{padding:14px;border-radius:12px}
      .score-card strong{font-size:40px}
      .about-strip,.powered-row,.footer{padding-left:10px;padding-right:10px}
      .brand-line{gap:10px 14px}
      .brand-line .brand-logo{height:20px;max-width:68px}
      .inline-clean{padding:14px;border-radius:14px}
      .clean-form-visual img{max-height:170px}
      .cart-drawer{top:8px;right:8px;width:calc(100vw - 16px);height:calc(100vh - 16px);border:1px solid var(--line);border-radius:16px;padding:14px;gap:12px}
      .drawer-head h2{font-size:25px}
      .close-drawer{width:34px;height:34px;font-size:24px}
      .drawer-items{max-height:min(42vh,330px);gap:7px}
      .drawer-item{grid-template-columns:52px minmax(0,1fr) 30px;gap:8px;min-height:84px;padding:8px;border-radius:12px;align-items:center}
      .drawer-item img{width:52px;height:52px;border-radius:8px}
      .drawer-item h3{font-size:11.5px;line-height:1.15;-webkit-line-clamp:2}
      .drawer-item small{font-size:9.6px;line-height:1.16;-webkit-line-clamp:1;margin-top:0}
      .drawer-item strong{font-size:12px;line-height:1.05;white-space:nowrap}
      .drawer-qty{grid-template-columns:23px 26px 23px;min-height:23px}
      .drawer-qty button{width:23px;height:23px;font-size:14px}
      .drawer-qty span{min-width:26px;font-size:10.5px}
      .drawer-total{font-size:18px;padding-top:10px}
      .coupon-box,.shipping-box,.checkout-review,.policy-check{padding:10px;border-radius:12px}
      .coupon-box label,.shipping-box label{font-size:12px;margin-bottom:7px}
      .coupon-box .coupon-control input,.coupon-apply{height:38px}
      .coupon-apply{font-size:21px}
      .checkout-review h3{font-size:14px}
      .checkout-review p,.checkout-review dt,.checkout-review dd,.policy-check,.drawer-note{font-size:11px;line-height:1.3}
      .checkout-pay{min-height:40px}
      .product-modal{width:calc(100vw - 18px);border-radius:14px}
      #modalBody{padding:16px}
      .modal-grid{gap:14px}
      .modal-grid img{height:160px;border-radius:12px}
      .modal-grid h2{font-size:20px}
    }
    @media (max-width:360px){
      .product-grid,.catalog-grid,.finds-grid,.finds-preview{grid-template-columns:repeat(2,minmax(0,1fr))}
      .finds-preview[data-source="dropshipping"],.finds-grid[data-source="dropshipping"]{grid-template-columns:repeat(2,minmax(0,1fr))}
      .finds-preview[data-source="dropshipping"] .find-card,.finds-grid[data-source="dropshipping"] .find-card{padding:6px;gap:4px}
      .finds-preview[data-source="dropshipping"] .find-card h3,.finds-grid[data-source="dropshipping"] .find-card h3{font-size:9.4px}
      .finds-preview[data-source="dropshipping"] .find-card p,.finds-grid[data-source="dropshipping"] .find-card p{font-size:8.4px}
      .finds-preview[data-source="dropshipping"] .find-disclosure small,.finds-grid[data-source="dropshipping"] .find-disclosure small{font-size:7px}
      .find-card{max-width:none;margin-inline:0}
      .hero-copy h1{font-size:21px}
      .hero-pc{max-height:120px}
      .hero-deal-card{grid-template-columns:1fr}
      .hero-deal-card .small-link{grid-row:auto;grid-column:auto;justify-self:start}
    }
    """


def js(products, finalists, addons, swaps, site_content: dict | None = None) -> str:
    abacate_enabled = feature_enabled(site_content, "payments", "abacatePay", False)
    physical_enabled = physical_catalog_enabled(site_content)
    dropshipping_enabled = dropshipping_catalog_enabled(site_content)
    checkout_description = "Finalizar compra com frete e Mercado Pago."
    checkout_terms = "carrinho checkout pagamento mercado pago frete correios melhor envio finalizar"
    if abacate_enabled:
        checkout_description = "Finalizar compra com frete, Mercado Pago ou Abacate Pay."
        checkout_terms = "carrinho checkout pagamento mercado pago abacate pay frete correios melhor envio finalizar"
    search_entries = []
    if physical_enabled:
        search_entries.extend(
            [
                {"type": "Secao", "icon": "PC", "title": "PC Gamer", "description": "PCs revisados em estoque com opcionais e carrinho.", "href": "ROUTES.ofertas + \"#catalogGrid\"", "terms": "pc gamer computador ryzen intel oferta catalogo desktop"},
                {"type": "Secao", "icon": "SSD", "title": "Hardware e upgrades", "description": "SSDs, fonte e pecas disponiveis para compra.", "href": "ROUTES.ofertas + \"#catalogGrid\"", "terms": "ssd hardware fonte upgrade peca armazenamento sata nvme"},
            ]
        )
    if dropshipping_enabled:
        search_entries.append({"type": "Loja", "icon": "MT", "title": "Produtos sob encomenda", "description": "Produtos para setup, escritorio e manutencao com compra direta no site.", "href": "ROUTES.produtos + \"#findsGrid\"", "terms": "produtos sob encomenda mobilytech compra direta setup escritorio hardware manutencao"})
    search_entries.extend(
        [
            {"type": "Servico", "icon": "$", "title": "Monte seu PC", "description": "Orcamento personalizado para montagem sob demanda.", "href": "ROUTES.montagem", "terms": "montagem monte seu pc montar computador orcamento custom personalizado"},
            {"type": "Servico", "icon": "OK", "title": "Limpeza de PC", "description": "Agendamento de limpeza, pasta termica e relatorio.", "href": "ROUTES.limpeza", "terms": "limpeza limpar pc pasta termica manutencao agendar relatorio"},
            {"type": "Loja", "icon": "MT", "title": "MobilyTech Finds", "description": "Curadoria tech com ofertas selecionadas.", "href": "ROUTES.achados + \"#findsGrid\"", "terms": "mobilytech finds tech oferta mercado livre amazon aliexpress curadoria"},
            {"type": "Prova", "icon": "5", "title": "Avaliacoes", "description": "Prova social, OLX, Marketplace e historico de entregas.", "href": "ROUTES.avaliacoes", "terms": "avaliacoes reviews prova social olx facebook marketplace estrelas reputacao"},
            {"type": "Conta", "icon": "ID", "title": "Minha conta e pedidos", "description": "Acesso seguro, retirada e acompanhamento do pedido.", "href": "ROUTES.conta", "terms": "minha conta pedido pedidos endereco rastreio retirada status acompanhamento suporte"},
            {"type": "Contato", "icon": "WA", "title": "Contato e suporte", "description": "WhatsApp, e-mail, retirada e atendimento humano.", "href": "ROUTES.contato", "terms": "contato suporte whatsapp email instagram retirada vila suzana"},
            {"type": "Legal", "icon": "LG", "title": "Termos e privacidade", "description": "Termos de Compra, privacidade, garantia, entrega, trocas e reembolso.", "href": "ROUTES.termos", "terms": "termos compra privacidade garantia entrega prazo trocas devolucao reembolso lgpd"},
            {"type": "Loja", "icon": "C", "title": "Carrinho e checkout", "description": checkout_description, "href": "\"#cart\"", "terms": checkout_terms},
        ]
    )
    for entry in search_entries:
        href = entry["href"]
        if href.startswith('"') and href.endswith('"'):
            entry["hrefExpression"] = href[1:-1]
        else:
            entry["hrefExpression"] = href
        entry.pop("href", None)
    search_entries_js = json.dumps(search_entries, ensure_ascii=False)
    payloads = {
        "products": public_products_payload(products, site_content),
        "finds": public_finds_payload(finalists, products, site_content),
        "dropshipping": public_dropshipping_payload(products, site_content),
        "addons": addons,
        "swaps": swaps,
        "featureFlags": (site_content or {}).get("featureFlags", {}),
        "homeFeaturedProducts": (site_content or {}).get("homeFeaturedProducts", {}),
    }
    return f"""
    const DATA = {json.dumps(payloads, ensure_ascii=False)};
    const CHECKOUT_POLICY_VERSION = "{CHECKOUT_POLICY_VERSION}";
    const assetBase = document.body.dataset.assetBase || "./";
    const cartKey = "mobilytech-ibuy-cart-v1";
    const couponKey = "mobilytech-coupon-v1";
    let cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
    let activeCouponCode = "";
    let couponAttempted = false;
    try {{ localStorage.removeItem(couponKey); }} catch (error) {{}}
    let selectedShipping = null;
    const IMPORT_TAX_IMPORT_DUTY_RATE = 0.60;
    const IMPORT_TAX_ICMS_RATE = 0.20;
    const IMPORT_TAX_DEFAULT_USD_BRL = 5.45;
    const LOCAL_PROMOTIONS = [
      {{ code:"MOBMEN", percent:6, eligibleCategories:["pc"], label:"6% OFF em PCs revisados selecionados" }}
    ];
    const $ = (sel, root=document) => root.querySelector(sel);
    const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
    const asset = (path) => {{
      const value = String(path || "");
      if (/^https?:\\/\\//i.test(value) || value.startsWith("data:")) return value;
      return assetBase + value.replace(/^\\.\\//, "");
    }};
    const money = (value) => new Intl.NumberFormat("pt-BR", {{ style:"currency", currency:"BRL" }}).format(Number(value || 0));
    const norm = (value) => String(value || "").normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").toLowerCase();
    const escapeHtml = (value) => String(value || "").replace(/[&<>"']/g, (char) => ({{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}}[char]));
    const productById = (id) => DATA.products.find((item) => item.id === id && item.active !== false);
    function sanitizeCart() {{
      const before = cart.length;
      cart = cart.filter((item) => productById(item.productId));
      if (before !== cart.length) localStorage.setItem(cartKey, JSON.stringify(cart));
    }}
    sanitizeCart();
    const ROUTES = {{
      home: assetBase + "index.html",
      produtos: assetBase + "fase2/nossos-produtos.html",
      ofertas: assetBase + "fase2/ofertas.html",
      achados: assetBase + "fase2/achados.html",
      montagem: assetBase + "fase2/montagem.html",
      limpeza: assetBase + "fase2/limpeza.html",
      avaliacoes: assetBase + "fase2/avaliacoes.html",
      conta: assetBase + "fase2/minha-conta.html",
      contato: assetBase + "fase2/contato.html",
      termos: assetBase + "fase2/termos.html",
      privacidade: assetBase + "fase2/privacidade.html",
      trocas: assetBase + "fase2/trocas-devolucoes.html",
      entrega: assetBase + "fase2/entrega-prazos.html",
      garantia: assetBase + "fase2/garantia.html"
    }};
    function currentNavKey() {{
      const file = window.location.pathname.split("/").pop() || "index.html";
      if (file === "ofertas.html") {{
        const requested = new URLSearchParams(window.location.search).get("nav");
        return ["pc-gamer", "ofertas", "hardware"].includes(requested) ? requested : "pc-gamer";
      }}
      const navByFile = {{
        "achados.html": "achados",
        "nossos-produtos.html": "produtos",
        "montagem.html": "montagem",
        "limpeza.html": "limpeza",
        "avaliacoes.html": "avaliacoes",
        "contato.html": "contato"
      }};
      return navByFile[file] || "";
    }}
    function syncMainNav() {{
      const current = currentNavKey();
      $$(".main-nav .nav-link").forEach((link) => {{
        const selected = Boolean(current) && link.dataset.navKey === current;
        link.classList.toggle("active", selected);
        if (selected) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      }});
    }}
    syncMainNav();
    window.addEventListener("popstate", syncMainNav);
    window.addEventListener("hashchange", syncMainNav);
    $$(".main-nav .nav-link").forEach((link) => link.addEventListener("click", () => {{
      $$(".main-nav .nav-link").forEach((candidate) => {{
        const selected = candidate === link;
        candidate.classList.toggle("active", selected);
        if (selected) candidate.setAttribute("aria-current", "page");
        else candidate.removeAttribute("aria-current");
      }});
    }}));
    const SECTION_RESULTS = {search_entries_js}.map((item) => {{
      let href = item.hrefExpression || "";
      if (href === 'ROUTES.ofertas + "#catalogGrid"') href = ROUTES.ofertas + "#catalogGrid";
      else if (href === 'ROUTES.produtos + "#findsGrid"') href = ROUTES.produtos + "#findsGrid";
      else if (href === 'ROUTES.achados + "#findsGrid"') href = ROUTES.achados + "#findsGrid";
      else if (href === "ROUTES.montagem") href = ROUTES.montagem;
      else if (href === "ROUTES.limpeza") href = ROUTES.limpeza;
      else if (href === "ROUTES.avaliacoes") href = ROUTES.avaliacoes;
      else if (href === "ROUTES.conta") href = ROUTES.conta;
      else if (href === "ROUTES.contato") href = ROUTES.contato;
      else if (href === "ROUTES.termos") href = ROUTES.termos;
      return {{ ...item, href }};
    }});
    let currentSearchResults = [];
    let accountSession = {{ authenticated:false, user:null, admin:false, providers:{{}} }};
    function currentReturnTo() {{
      return window.location.pathname + window.location.search + window.location.hash;
    }}
    function accountLoginHref(provider) {{
      return `/api/account?action=${{provider}}-start&returnTo=${{encodeURIComponent(currentReturnTo())}}`;
    }}
    function initials(name="", email="") {{
      const source = String(name || email || "MT").trim();
      const parts = source.includes("@") ? [source[0], source.split("@")[0]?.[1]] : source.split(/\\s+/).slice(0, 2).map((part) => part[0]);
      return parts.filter(Boolean).join("").slice(0, 2).toUpperCase() || "MT";
    }}
    function setLoginLinks() {{
      const authFlags = DATA.featureFlags?.auth || {{}};
      $$(".google-login").forEach((link) => link.setAttribute("href", accountLoginHref("google")));
      $$(".microsoft-login").forEach((link) => {{
        link.setAttribute("href", accountLoginHref("microsoft"));
        if (authFlags.microsoft === false || (accountSession.providers && accountSession.providers.microsoftConfigured === false)) link.hidden = true;
      }});
      $$("#accountLogout").forEach((link) => link.setAttribute("href", `/api/account?action=logout&returnTo=${{encodeURIComponent(currentReturnTo())}}`));
      $$("#accountPageLogout").forEach((link) => link.setAttribute("href", `/api/account?action=logout&returnTo=${{encodeURIComponent(currentReturnTo())}}`));
    }}
    function renderAccountMenu() {{
      setLoginLinks();
      const user = accountSession.user || {{}};
      const logged = Boolean(accountSession.authenticated || user.email || user.name);
      const greeting = $("#accountGreeting");
      const title = $("#accountMenuTitle");
      const status = $("#accountMenuStatus");
      const guest = $("#accountGuestActions");
      const logout = $("#accountLogout");
      if (greeting) greeting.textContent = logged ? `Ola, ${{user.name || user.email || "cliente"}}` : "Conta MobilyTech";
      if (title) title.textContent = logged ? "Central Minha Conta" : "Entre para ver seus pedidos";
      if (status) status.textContent = logged ? String(user.email || "") : "Acesse com Google para acompanhar compras e dados de entrega.";
      if (guest) {{
        guest.hidden = logged;
        guest.style.display = logged ? "none" : "";
        guest.setAttribute("aria-hidden", logged ? "true" : "false");
      }}
      if (logout) logout.hidden = !logged;
    }}
    function renderAccountPage() {{
      const panel = $("#accountPagePanel");
      const guest = $("#accountPageGuestActions");
      const loggedActions = $("#accountPageLoggedActions");
      if (!panel) return;
      const user = accountSession.user || {{}};
      const logged = Boolean(accountSession.authenticated || user.email || user.name);
      if (!logged) {{
        panel.innerHTML = `<div class="account-avatar" aria-hidden="true">MT</div><div><strong>Voce ainda nao entrou.</strong><small>Use um login seguro para carregar seus pedidos quando eles estiverem disponiveis.</small></div>`;
        if (guest) {{
          guest.hidden = false;
          guest.style.display = "";
          guest.setAttribute("aria-hidden", "false");
        }}
        if (loggedActions) {{
          loggedActions.hidden = true;
          loggedActions.style.display = "none";
          loggedActions.setAttribute("aria-hidden", "true");
        }}
        renderOrders([]);
        return;
      }}
      const safePicture = /^https:\\/\\//.test(String(user.picture || "")) ? String(user.picture) : "";
      const avatar = safePicture
        ? `<img src="${{escapeHtml(safePicture)}}" alt="">`
        : initials(user.name, user.email);
      panel.innerHTML = `<div class="account-avatar" aria-hidden="true">${{avatar}}</div><div><strong>${{escapeHtml(user.name || "Cliente MobilyTech")}}</strong><small>${{escapeHtml(user.email || "")}}</small></div>`;
      if (guest) {{
        guest.hidden = true;
        guest.style.display = "none";
        guest.setAttribute("aria-hidden", "true");
      }}
      if (loggedActions) {{
        loggedActions.hidden = false;
        loggedActions.style.display = "";
        loggedActions.setAttribute("aria-hidden", "false");
      }}
      loadCustomerOrders();
    }}
    function normalizeOrder(order) {{
      return {{
        id: order.PedidoID || order.orderId || order.payment_id || order.id || "Pedido",
        status: order.Status || order.status || "Em acompanhamento",
        product: order.Produto || order.product_title || order.product || "Pedido MobilyTech BR",
        amount: order.ValorPago || order.amount_paid || order.amount || "",
        delivery: order.ModoEntrega || order.delivery_mode || "",
        tracking: order.CodigoRastreio || order.tracking_code || "",
        carrier: order.Transportadora || order.shipping_carrier || ""
      }};
    }}
    function isPlaceholderOrder(order) {{
      const id = String(order.id || "").trim().toLowerCase();
      const product = String(order.product || "").trim().toLowerCase();
      const amount = String(order.amount || "").trim().toLowerCase();
      const delivery = String(order.delivery || "").trim().toLowerCase();
      const tracking = String(order.tracking || order.carrier || "").trim().toLowerCase();
      const status = String(order.status || "").trim().toLowerCase();
      return /^pedido-\\d{{12,}}$/.test(id)
        && product === "pedido mobilytech br"
        && (!amount || amount.includes("consulta"))
        && (!delivery || delivery.includes("pickup") || delivery.includes("retirada"))
        && (!tracking || tracking.includes("ainda") || tracking.includes("indispon"))
        && (!status || status.includes("pago") || status.includes("aprov"));
    }}
    function renderOrders(orders, meta={{}}) {{
      const panel = $("#ordersPanel");
      if (!panel) return;
      if (!accountSession.authenticated) {{
        panel.innerHTML = '<p class="empty">Entre na sua conta para carregar pedidos vinculados ao seu e-mail.</p>';
        return;
      }}
      const visibleOrders = Array.isArray(orders)
        ? orders.map(normalizeOrder).filter((order) => !isPlaceholderOrder(order))
        : [];
      if (!visibleOrders.length) {{
        const note = meta.configured === false
          ? "Sua conta esta pronta. O historico automatico aparece aqui assim que o endpoint seguro de pedidos estiver conectado."
          : "Nenhum pedido encontrado para este e-mail no momento.";
        panel.innerHTML = `<p class="empty">${{escapeHtml(note)}}</p>`;
        return;
      }}
      panel.innerHTML = visibleOrders.map((order) => {{
        return `<article class="order-card">
          <div class="order-card-head"><h3>${{escapeHtml(order.id)}}</h3><span class="order-status-pill">${{escapeHtml(order.status)}}</span></div>
          <dl>
            <div><dt>Produto</dt><dd>${{escapeHtml(order.product)}}</dd></div>
            <div><dt>Valor</dt><dd>${{escapeHtml(order.amount || "Sob consulta")}}</dd></div>
            <div><dt>Entrega</dt><dd>${{escapeHtml(order.delivery || "A confirmar")}}</dd></div>
            <div><dt>Rastreio</dt><dd>${{escapeHtml(order.tracking || order.carrier || "Ainda nao disponivel")}}</dd></div>
          </dl>
        </article>`;
      }}).join("");
    }}
    async function loadCustomerOrders() {{
      if (!accountSession.authenticated || !$("#ordersPanel")) return;
      $("#ordersPanel").innerHTML = '<p class="empty">Carregando pedidos...</p>';
      try {{
        const response = await fetch("/api/account?action=customer-orders", {{ cache:"no-store" }});
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Nao foi possivel carregar pedidos.");
        renderOrders(data.orders || [], data);
      }} catch(error) {{
        $("#ordersPanel").innerHTML = `<p class="empty">${{escapeHtml(error.message)}}</p>`;
      }}
    }}
    async function loadAccountSession() {{
      setLoginLinks();
      if (["localhost", "127.0.0.1"].includes(location.hostname)) {{
        accountSession = {{ authenticated:false, user:null, admin:false, providers:{{ googleConfigured:true, microsoftConfigured:false }} }};
        renderAccountMenu();
        renderAccountPage();
        return;
      }}
      try {{
        const response = await fetch("/api/account?action=session", {{ cache:"no-store" }});
        const data = await response.json();
        if (response.ok) accountSession = data;
      }} catch(_error) {{
        accountSession = {{ authenticated:false, user:null, admin:false, providers:{{ googleConfigured:false, microsoftConfigured:false }} }};
      }}
      renderAccountMenu();
      renderAccountPage();
    }}
    function specs(product) {{
      const s = product.specs || {{}};
      const brand = isSupplierProduct(product) && norm(s.brand).includes("cj") ? "Fornecedor parceiro" : s.brand;
      return [s.processor, s.memory, s.gpu, s.storage, brand, s.capacity, s.interface].filter(Boolean).slice(0,4);
    }}
    function productBaseTitle(product) {{
      const title = String(product?.title || "Produto");
      if (!hasProductVariants(product)) return title;
      return title.replace(/\\s+-\\s+[^-]{{2,80}}$/u, "").trim() || title;
    }}
    function currentSearch() {{ return ($("#siteSearch")?.value || "").trim(); }}
    function anchorId(prefix, value) {{
      const slug = norm(value).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      return `${{prefix}}-${{slug || "item"}}`;
    }}
    function matchesSearch(text, query) {{
      const haystack = norm(text);
      const terms = norm(query).split(/\\s+/).filter(Boolean);
      return terms.length > 0 && terms.every((term) => haystack.includes(term));
    }}
    function addQuery(href, query) {{
      const parts = href.split("#");
      const path = parts[0];
      const hash = parts[1] ? "#" + parts[1] : "";
      const glue = path.includes("?") ? "&" : "?";
      return path + glue + "q=" + encodeURIComponent(query) + hash;
    }}
    function compactText(text, limit=86) {{
      const value = String(text || "").replace(/\\s+/g, " ").trim();
      return value.length > limit ? value.slice(0, limit - 1) + "..." : value;
    }}
    function searchScore(title, text, query) {{
      const q = norm(query);
      const t = norm(title);
      const body = norm(text);
      let score = 0;
      if (t === q) score += 120;
      if (t.startsWith(q)) score += 90;
      if (t.includes(q)) score += 60;
      if (body.includes(q)) score += 12;
      return score;
    }}
    function buildSearchResults(query) {{
      const q = String(query || "").trim();
      if (!q) return [];
      const sections = SECTION_RESULTS
        .filter((item) => matchesSearch([item.title, item.description, item.terms].join(" "), q))
        .map((item) => ({{ item, score: searchScore(item.title, [item.description, item.terms].join(" "), q) }}))
        .sort((a, b) => b.score - a.score)
        .slice(0, 4);
      const sectionResults = sections.map(({{ item }}) => item);
      const products = DATA.products
.filter((item) => item.active !== false && !["finds", "affiliate", "sob-encomenda", "dropshipping"].includes(item.category))
        .filter((item) => matchesSearch([item.title, item.badge, specs(item).join(" "), item.category].join(" "), q))
        .map((item) => ({{ item, score: searchScore(item.title, [item.badge, specs(item).join(" "), item.category].join(" "), q) }}))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(({{ item }}) => ({{
          type: item.category === "pc" ? "Produto" : "Hardware",
          icon: item.category === "pc" ? "PC" : "SSD",
          title: item.title,
          description: compactText(specs(item).join(" / ") || money(item.price)),
          href: addQuery(ROUTES.ofertas + "#" + anchorId("produto", item.id), q)
        }}));
      const finds = DATA.finds
        .filter((item) => item.affiliateReady !== false)
        .filter((item) => matchesSearch([item.title, item.niche, item.whySell, item.currentPrice, item.platform, item.marketplace?.name].join(" "), q))
        .map((item) => ({{ item, score: searchScore(item.title, [item.niche, item.whySell, item.currentPrice, item.platform, item.marketplace?.name].join(" "), q) }}))
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
        .map(({{ item }}) => ({{
          type: "Finds",
          icon: "MT",
          title: item.title,
          description: compactText(item.whySell || item.publicPartnerNote || "Produto tech selecionado pela MobilyTech."),
          href: addQuery(ROUTES.achados + "#" + anchorId("find", item.title), q)
        }}));
      const serviceFirst = /^(limpeza|limpar|montagem|monte|montar|orcamento|conta|login|pedido|pedidos|rastreio|retirada|contato|suporte|whatsapp|avaliacao|avaliacoes|review|carrinho|checkout|frete|pagamento)/.test(norm(q));
      const ordered = serviceFirst ? [...sectionResults, ...products, ...finds] : [...products, ...finds, ...sectionResults];
      return ordered.slice(0, 8);
    }}
    function renderSearchButton(item, index) {{
      return `<button class="search-result" type="button" data-search-index="${{index}}">
        <span class="search-result-icon" aria-hidden="true">${{item.icon}}</span>
        <span><span class="search-result-title">${{item.title}}</span><span class="search-result-desc">${{item.description}}</span></span>
        <span class="search-result-type">${{item.type}}</span>
      </button>`;
    }}
    function renderSearchResults() {{
      const panel = $("#searchResults");
      if (!panel) return;
      const query = currentSearch();
      if (!query) {{
        panel.hidden = true;
        panel.innerHTML = "";
        currentSearchResults = [];
        return;
      }}
      currentSearchResults = buildSearchResults(query);
      panel.hidden = false;
      panel.innerHTML = currentSearchResults.length
        ? currentSearchResults.map(renderSearchButton).join("")
        : '<p class="search-empty">Nenhum resultado direto. Tente PC, SSD, limpeza, montagem ou Mercado Livre.</p>';
    }}
    function hideSearchResults() {{
      const panel = $("#searchResults");
      if (panel) panel.hidden = true;
    }}
    function goSearchResult(item) {{
      if (!item) return;
      if (item.href === "#cart") {{
        hideSearchResults();
        openCart();
        return;
      }}
      window.location.href = item.href;
    }}
    function submitSearch() {{
      const query = currentSearch();
      if (!query) return;
      const results = buildSearchResults(query);
      if (results.length) return goSearchResult(results[0]);
      showToast("Nenhum resultado encontrado para essa busca.");
    }}
    function applyUrlSearch() {{
      const query = new URLSearchParams(window.location.search).get("q");
      const input = $("#siteSearch");
      if (query && input) input.value = query;
    }}
    function scrollElementIntoView(target) {{
      if (!target) return;
      const header = $(".site-header");
      const offset = (header ? header.getBoundingClientRect().height : 0) + 18;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({{ top: Math.max(0, top), behavior:"smooth" }});
    }}
    function scrollToHashTarget() {{
      if (!window.location.hash) return;
      const target = document.querySelector(window.location.hash);
      if (!target) return;
      setTimeout(() => scrollElementIntoView(target), 80);
    }}
    function productType(product) {{ return product.category === "pc" ? "pc" : "hardware"; }}
    function isConfigurablePc(product) {{ return product?.category === "pc"; }}
    function productVariants(product) {{
      return Array.isArray(product?.variants) ? product.variants.filter((variant) => variant && variant.active !== false) : [];
    }}
    function variantId(variant) {{
      return String(variant?.id || variant?.variantId || variant?.vid || variant?.cj?.vid || variant?.sku || variant?.cj?.sku || "");
    }}
    function hasProductVariants(product) {{ return productVariants(product).length > 0; }}
    function selectedVariantForItem(product, item={{}}) {{
      const variants = productVariants(product);
      if (!variants.length) return null;
      const selected = item.selectedVariant || {{}};
      const selectedId = String(item.selectedVariantId || selected.id || selected.variantId || selected.vid || selected?.cj?.vid || selected.sku || selected?.cj?.sku || "");
      return variants.find((variant) => variantId(variant) === selectedId)
        || variants.find((variant) => variant.default === true)
        || variants.find((variant) => String(variant?.cj?.vid || variant?.vid || "") === String(product?.cj?.vid || ""))
        || variants[0];
    }}
    function variantLabel(variant) {{
      return variant?.label || variant?.optionSummary || variant?.variantKey || variant?.name || "Variacao selecionada";
    }}
    function variantPrice(product, variant) {{
      if (!variant) return Number(product?.price || 0);
      const direct = Number(variant.price);
      if (Number.isFinite(direct) && direct > 0) return direct;
      const delta = Number(variant.priceDelta);
      return Number(product?.price || 0) + (Number.isFinite(delta) ? delta : 0);
    }}
    function variantSummary(product, variant) {{
      if (!variant) return null;
      return {{
        id: variantId(variant),
        label: variantLabel(variant),
        price: variantPrice(product, variant),
        priceDelta: variantPrice(product, variant) - Number(product?.price || 0),
        costPrice: variant.costPrice || variant.supplierCost || product?.costPrice,
        costUsd: variant.costUsd || product?.costUsd,
        image: variant.image || variant.variantImage || "",
        sku: variant.sku || variant?.cj?.sku || "",
        vid: variant.vid || variant?.cj?.vid || "",
        cj: {{
          ...(variant.cj || {{}}),
          vid: variant.vid || variant?.cj?.vid || "",
          sku: variant.sku || variant?.cj?.sku || "",
          variantKey: variant.variantKey || variant?.cj?.variantKey || "",
          variantNameEn: variant.variantNameEn || variant?.cj?.variantNameEn || ""
        }}
      }};
    }}
    function productUnitPrice(product, item={{}}) {{
      return variantPrice(product, selectedVariantForItem(product, item));
    }}
    function productTotal(item) {{
      const product = productById(item.productId);
      if (!product) return 0;
      const extras = isConfigurablePc(product)
        ? [...(item.selectedAddons || []), ...(item.selectedSwaps || [])].reduce((sum, option) => sum + Number(option.price || 0), 0)
        : 0;
      const quantity = Math.max(1, Number(item.quantity || 1));
      return (productUnitPrice(product, item) + extras) * quantity;
    }}
    function cartProducts() {{ return cart.map((item) => productById(item.productId)).filter(Boolean); }}
    function isSupplierProduct(product) {{
      const text = norm([product?.category, product?.purchaseMode, product?.fulfillmentMode, product?.shipping?.mode].join(" "));
      return Boolean(product?.manualFulfillment || text.includes("dropshipping") || text.includes("supplier") || text.includes("fornecedor"));
    }}
    function isDirectOrderProduct(product) {{
      const category = norm(product?.category || "");
      return Boolean(product?.madeToOrder || category === "sob-encomenda" || category === "sob encomenda" || category === "encomenda" || category === "dropshipping");
    }}
    function allowsCartQuantity(product) {{
      return Boolean(isSupplierProduct(product) || product?.allowQuantity === true || product?.madeToOrder === true || norm(product?.category || "") === "sob-encomenda");
    }}
    function isInternationalSupplierProduct(product) {{
      if (!isSupplierProduct(product)) return false;
      const text = norm([product?.shipping?.region, product?.shipping?.originCountry, product?.shipping?.startCountryCode, product?.supplierRegion, product?.originRegion, product?.publicOriginNote, product?.source].join(" "));
      if (text.includes("brasil") || text === "br") return false;
      return text.includes("intl") || text.includes("internacional") || text.includes("exterior") || text.includes("china") || text.includes("cn") || norm(product?.source).includes("cj");
    }}
    function supplierCartSubtotal() {{
      return cart.reduce((sum, item) => {{
        const product = productById(item.productId);
        if (!product || !isInternationalSupplierProduct(product)) return sum;
        return sum + productTotal(item);
      }}, 0);
    }}
    function supplierShippingForTaxes() {{
      if (!selectedShipping) return 0;
      const explicit = Number(selectedShipping.supplierPrice);
      if (Number.isFinite(explicit) && explicit >= 0) return explicit;
      const total = Number(selectedShipping.price);
      return Number.isFinite(total) && total >= 0 ? total : 0;
    }}
    function importTaxEstimate() {{
      const taxableProducts = cartProducts().filter(isInternationalSupplierProduct);
      if (!taxableProducts.length) return {{ applies:false, pending:false, total:0, importDuty:0, icms:0, customsValue:0 }};
      const subtotal = supplierCartSubtotal();
      if (!selectedShipping || !selectedShipping.serviceId) {{
        return {{ applies:true, pending:true, total:0, importDuty:0, icms:0, customsValue:subtotal }};
      }}
      const shipping = supplierShippingForTaxes();
      const customsValue = Math.max(0, subtotal + shipping);
      const importDuty = Math.round((customsValue * IMPORT_TAX_IMPORT_DUTY_RATE) * 100) / 100;
      const icms = Math.round((((customsValue + importDuty) / (1 - IMPORT_TAX_ICMS_RATE)) * IMPORT_TAX_ICMS_RATE) * 100) / 100;
      const usdBrl = Number(taxableProducts[0]?.shipping?.cjUsdBrlRate || taxableProducts[0]?.cj?.usdBrlRate || IMPORT_TAX_DEFAULT_USD_BRL);
      return {{
        applies:true,
        pending:false,
        total:Math.round((importDuty + icms) * 100) / 100,
        importDuty,
        icms,
        customsValue:Math.round(customsValue * 100) / 100,
        usdBrl
      }};
    }}
    function cartHasProduct(productId) {{
      return cart.some((item) => String(item.productId) === String(productId));
    }}
    function canAddCartProduct(productId) {{
      const product = productById(productId);
      if (!product) return false;
      if (!allowsCartQuantity(product) && cartHasProduct(productId)) {{
        showToast("Esse item fisico tem estoque unico e ja esta no carrinho.");
        openCart();
        return false;
      }}
      return true;
    }}
    function cartFulfillmentState() {{
      const products = cartProducts();
      return {{
        supplier: products.filter(isSupplierProduct).length,
        physical: products.filter((product) => !isSupplierProduct(product)).length
      }};
    }}
    function supplierDeliveryDays(product) {{
      const shipping = product?.shipping || {{}};
      const direct = Number(shipping.deliveryTime || shipping.delivery_time || 0);
      if (direct > 0) return direct;
      const digits = String(shipping.sampleQuoteAging || "").match(/\\d+/g) || [];
      const parsed = digits.map(Number).filter((value) => value > 0);
      return parsed.length ? Math.max(...parsed) : 18;
    }}
    function fixedSupplierShippingQuote(postalCode="") {{
      const rows = cart.map((item) => ({{ item, product: productById(item.productId) }})).filter((row) => row.product && isSupplierProduct(row.product));
      if (!rows.length || rows.length !== cart.length) return null;
      const price = rows.reduce((sum, row) => {{
        const quantity = Math.max(1, Number(row.item.quantity || 1));
        const shipping = row.product.shipping || {{}};
        const itemFreight = Number(shipping.customerPrice || shipping.sampleQuoteMinBrl || 0);
        return sum + itemFreight * quantity;
      }}, 0);
      const deliveryTime = rows.reduce((max, row) => Math.max(max, supplierDeliveryDays(row.product)), 0) || 18;
      const services = [...new Set(rows.map((row) => row.product.shipping?.sampleQuoteService).filter(Boolean))];
      return {{
        id: "supplier-fixed",
        serviceId: "supplier-fixed",
        price: Math.round(price * 100) / 100,
        postalCode,
        company: "Fornecedor selecionado",
        carrier: "Fornecedor selecionado",
        name: services.length === 1 ? services[0] : "Envio direto do fornecedor",
        serviceName: services.length === 1 ? services[0] : "Envio direto do fornecedor",
        deliveryTime,
        mode: "supplier-fixed",
        originMode: "supplier"
      }};
    }}
    function renderFixedSupplierShipping(box, quote) {{
      if (!box || !quote) return;
      selectedShipping = quote;
      box.innerHTML = `<label class="shipping-option is-selected">
        <span class="ship-main">
          <input type="radio" name="shipping" checked>
          <span class="ship-copy"><strong>Fornecedor selecionado - Envio direto</strong><small>${{quote.deliveryTime}} dia(s) uteis estimados. Frete calculado pela origem do fornecedor.</small></span>
        </span>
        <strong class="ship-price">${{money(quote.price)}}</strong>
      </label>`;
      renderCart();
    }}
    function customerFreightTitle(company="", service="", provider="") {{
      const cleanCompany = String(company || "").trim();
      const cleanService = String(service || "").trim();
      const hiddenCompany = /dropshipping/i.test(cleanCompany) || /cj-dropshipping/i.test(String(provider || ""));
      if (hiddenCompany && cleanService) return cleanService;
      if (!cleanCompany) return cleanService || "Envio com rastreio";
      if (!cleanService || cleanService === cleanCompany) return cleanCompany;
      return `${{cleanCompany}} - ${{cleanService}}`;
    }}
    function activePromotion() {{
      const code = norm(activeCouponCode).replace(/\\s+/g, "").toUpperCase();
      return LOCAL_PROMOTIONS.find((promo) => promo.code === code) || null;
    }}
    function couponDiscount() {{
      const promo = activePromotion();
      if (!promo) return 0;
      const eligible = cart.reduce((sum, item) => {{
        const product = productById(item.productId);
        if (!product || !promo.eligibleCategories.includes(product.category)) return sum;
        return sum + productTotal(item);
      }}, 0);
      return Math.round((eligible * Number(promo.percent || 0) / 100) * 100) / 100;
    }}
    function couponPayload() {{
      const promo = activePromotion();
      if (!promo) return null;
      return {{ code: promo.code, percent: promo.percent, discount: couponDiscount(), label: promo.label }};
    }}
    function policyPayload() {{
      const checked = $("#checkoutPoliciesAccepted")?.checked === true;
      const supplierDisclosure = $("#supplierDisclosureAccepted")?.checked === true;
      return {{
        terms: checked,
        privacy: checked,
        supplierDisclosure,
        version: CHECKOUT_POLICY_VERSION,
        acceptedAt: new Date().toISOString()
      }};
    }}
    function checkoutSubtotal() {{ return cart.reduce((sum, item) => sum + productTotal(item), 0); }}
    function checkoutTotal() {{
      const taxes = importTaxEstimate();
      return Math.max(0, checkoutSubtotal() - couponDiscount()) + (selectedShipping?.price || 0) + (taxes.pending ? 0 : taxes.total);
    }}
    function cartOriginSummary() {{
      const products = cartProducts();
      if (!products.length) return "";
      const supplier = products.some(isSupplierProduct);
      const international = products.some((product) => {{
        const text = norm([product.publicOriginNote, product.shipping?.region, product.supplierRegion, product.shipping?.originCountry].join(" "));
        return text.includes("intern") || text.includes("exterior") || text.includes("china") || text.includes("cn");
      }});
      if (supplier && international) return "Envio direto internacional.";
      if (supplier) return "Envio direto por fornecedor.";
      return "Envio ou retirada conforme opcao escolhida.";
    }}
    function renderCheckoutReview() {{
      const node = $("#checkoutReview");
      if (!node) return;
      if (!cart.length) {{
        node.hidden = true;
        node.innerHTML = "";
        return;
      }}
      const state = cartFulfillmentState();
      const subtotal = checkoutSubtotal();
      const discount = couponDiscount();
      const freight = selectedShipping?.price || 0;
      const taxes = importTaxEstimate();
      const total = checkoutTotal();
      const freightLabel = selectedShipping
        ? money(freight)
        : (state.supplier ? "A calcular" : "R$ 0,00");
      const deliveryLabel = selectedShipping
        ? `${{selectedShipping.carrier || selectedShipping.company || "Entrega"}} - ${{selectedShipping.serviceName || selectedShipping.name || "servico"}}`
        : (state.supplier ? "Calcule o frete antes de pagar" : "Retirada local ou entrega a calcular");
      const timeLabel = selectedShipping?.deliveryTime
        ? `${{selectedShipping.deliveryTime}} dia(s) uteis estimados`
        : (state.supplier ? "Apos calcular o frete" : "Conforme forma de entrega");
      node.hidden = false;
      node.innerHTML = `<h3>Revise antes de pagar</h3>
        <p>MobilyTech BR - CNPJ 66.834.883/0001-43. Revise valores, frete e prazo antes de pagar.</p>
        <dl>
          <dt>Produtos</dt><dd>${{money(subtotal)}}</dd>
          ${{discount > 0 ? `<dt>Desconto</dt><dd>-${{money(discount)}}</dd>` : ""}}
          <dt>Frete</dt><dd>${{freightLabel}}</dd>
          ${{taxes.applies ? `<dt>Tributos import.</dt><dd>${{taxes.pending ? "A calcular" : money(taxes.total)}}</dd>` : ""}}
          <dt>Total</dt><dd>${{money(total)}}</dd>
          <dt>Entrega</dt><dd>${{escapeHtml(deliveryLabel)}}</dd>
          <dt>Prazo</dt><dd>${{escapeHtml(timeLabel)}}</dd>
          <dt>Origem</dt><dd>${{escapeHtml(cartOriginSummary())}}</dd>
        </dl>
        <p><a href="${{ROUTES.termos}}" target="_blank" rel="noopener">Termos</a>, <a href="${{ROUTES.entrega}}" target="_blank" rel="noopener">entrega</a>, <a href="${{ROUTES.trocas}}" target="_blank" rel="noopener">trocas</a>, <a href="${{ROUTES.garantia}}" target="_blank" rel="noopener">garantia</a> e <a href="${{ROUTES.privacidade}}" target="_blank" rel="noopener">privacidade</a> ficam disponiveis antes do pagamento.</p>`;
    }}
    function syncCouponFeedback() {{
      const feedback = $("#couponFeedback");
      if (!feedback) return;
      const typed = ($("#couponCode")?.value || "").trim();
      if (!typed) {{
        feedback.textContent = "Cupons valem para produtos elegiveis; frete e envio direto ficam separados.";
        return;
      }}
      if (!couponAttempted) {{
        feedback.textContent = "Clique na seta para aplicar o cupom.";
        return;
      }}
      const promo = activePromotion();
      const discount = couponDiscount();
      if (!promo) {{
        feedback.textContent = "Cupom nao reconhecido. Verifique o codigo ou tente outro cupom.";
      }} else if (discount > 0) {{
        feedback.textContent = `${{promo.label}} aplicado: -${{money(discount)}}.`;
      }} else {{
        feedback.textContent = "Cupom valido, mas nao se aplica aos itens atuais.";
      }}
    }}
    function saveCart() {{ localStorage.setItem(cartKey, JSON.stringify(cart)); renderCart(); }}
    function showToast(message) {{
      const toast = $("#toast");
      if (!toast) return;
      toast.textContent = message;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2400);
    }}
    function renderProducts(target, filter="all", limit=999) {{
      const node = $(target);
      if (!node) return;
      const search = norm($("#siteSearch")?.value || "");
let products = DATA.products.filter((item) => item.active !== false && !["finds", "affiliate", "dropshipping", "sob-encomenda"].includes(item.category));
      if (filter === "pc") products = products.filter((item) => item.category === "pc");
      if (filter === "hardware") products = products.filter((item) => item.category !== "pc");
      if (target === "#homePcGrid") products = products.filter((item) => item.category === "pc");
      if (target === "#homeHardwareGrid") products = products.filter((item) => item.category !== "pc");
      if (search) products = products.filter((item) => norm([item.title, item.badge, specs(item).join(" ")].join(" ")).includes(search));
      products = products.slice(0, limit);
      node.innerHTML = products.map(productCard).join("") || '<p class="empty">Nenhum produto encontrado.</p>';
    }}
    function productCard(product) {{
      const image = asset(product.cutout || product.image);
      const spec = specs(product).join(" / ");
      const old = product.old ? `<span class="old-price">${{money(product.old)}}</span>` : "";
      return `<article class="product-card" id="${{anchorId("produto", product.id)}}" data-kind="${{productType(product)}}" data-search="${{[product.title, spec].join(" ")}}">
        <div class="product-media"><img src="${{image}}" alt="${{product.title}}"><span class="badge">${{product.badge || (product.category === "pc" ? "PC revisado" : "Hardware")}}</span></div>
        <div class="product-body">
          <h3>${{product.title}}</h3>
          <p class="spec-line">${{spec}}</p>
          <div><div class="price-row">${{old}}<span class="price">${{money(product.price)}}</span></div><p class="installment">12x sob consulta no checkout</p></div>
          <div class="card-actions">
            <button class="ghost-btn" type="button" data-detail="${{product.id}}">Ver detalhes</button>
            <button class="cart-btn" type="button" data-add="${{product.id}}"><span class="cart-icon" aria-hidden="true">&#128722;</span>Adicionar ao carrinho</button>
          </div>
        </div>
      </article>`;
    }}
    function findVisualKey(item) {{
      const imageKey = norm(String(item.productImage || item.selectedCreative || "").replace(/\\.(webp|png|jpe?g|svg)(\\?.*)?$/i, ""));
      const typeRules = [
        ["case-ssd", "case-ssd"],
        ["fone-kz", "fone-kz"],
        ["kit-limpeza", "kit-limpeza"],
        ["mini-aspirador", "mini-aspirador"],
        ["hub-usb-c", "hub-usb-c"],
        ["suporte-gpu", "suporte-gpu"],
        ["cabo-displayport", "cabo-video"],
        ["mousepad", "mousepad"],
        ["suporte-notebook", "suporte-monitor"],
        ["teclado-mecanico", "teclado-mecanico"],
        ["adaptador-bluetooth", "controle-bluetooth"],
        ["keycaps", "keycaps"],
        ["bias-light", "fita-led"]
      ];
      for (const [needle, key] of typeRules) {{
        if (imageKey.includes(needle)) return `type:${{key}}`;
      }}
      if (imageKey) return `image:${{imageKey}}`;
      return `title:${{norm(item.title || "").replace(/\\b(cor|preto|branco|usb|tipo|type|com|sem|para|de|do|da|the|and)\\b/g, " ").replace(/\\s+/g, " ").trim().slice(0, 64)}}`;
    }}
    function findPlatformName(item) {{
      return item.marketplace?.name || item.platform || item.affiliateLinks?.[0]?.platform || "";
    }}
    function findImageTitleScore(item) {{
      const imageKey = norm(String(item.productImage || item.selectedCreative || ""));
      const title = norm(`${{item.title || ""}} ${{item.niche || ""}} ${{item.whySell || ""}}`);
      if (!imageKey) return 1;
      if (imageKey.includes("case-ssd")) return (/(case|gaveta|gabinete)/.test(title) && /(ssd|nvme|m2|m\\.2)/.test(title)) ? 3 : 0;
      if (imageKey.includes("fone-kz")) return /(fone|kz|castor|edx|ouvido)/.test(title) ? 3 : 0;
      if (imageKey.includes("kit-limpeza")) return /(kit|limpeza|pincel|escova|pasta|termica|thermal|antiestatico|filtro)/.test(title) ? 3 : 0;
      if (imageKey.includes("mini-aspirador")) return /(aspirador|soprador|duster)/.test(title) ? 3 : 0;
      if (imageKey.includes("hub-usb-c")) return (title.includes("hub") || title.includes("leitor sd") || title.includes("microsd")) ? 3 : 0;
      if (imageKey.includes("suporte-gpu")) return (title.includes("suporte") && /(gpu|placa|video)/.test(title)) ? 3 : 0;
      if (imageKey.includes("cabo-displayport")) return /(cabo|displayport)/.test(title) ? 3 : 0;
      if (imageKey.includes("mousepad")) return title.includes("mousepad") ? 3 : 0;
      if (imageKey.includes("suporte-notebook")) return (title.includes("suporte") && /(monitor|notebook|f80|aluminio)/.test(title)) ? 3 : 0;
      if (imageKey.includes("teclado-mecanico")) return title.includes("teclado") ? 3 : 0;
      if (imageKey.includes("adaptador-bluetooth")) return (title.includes("adaptador") && title.includes("bluetooth")) ? 3 : 0;
      if (imageKey.includes("keycaps")) return /(keycap|keycaps|tecla)/.test(title) ? 3 : 0;
      if (imageKey.includes("bias-light")) return /(fita|led|bias|backlight)/.test(title) ? 3 : 0;
      return 1;
    }}
    function platformRank(name="") {{
      const value = norm(name);
      if (value.includes("mercado")) return 0;
      if (value.includes("amazon")) return 1;
      if (value.includes("aliexpress") || value.includes("ali express")) return 2;
      if (value.includes("shopee")) return 3;
      return 4;
    }}
    function chooseFindRepresentative(entries, platformCounts) {{
      const scored = entries.map((entry) => ({{ ...entry, imageScore: findImageTitleScore(entry.item) }}));
      const hasVisualMatch = scored.some((entry) => entry.imageScore > 0);
      if (!hasVisualMatch) return null;
      entries = scored.filter((entry) => entry.imageScore > 0);
      entries.sort((a, b) => {{
        if (a.imageScore !== b.imageScore) return b.imageScore - a.imageScore;
        const platformA = findPlatformName(a.item);
        const platformB = findPlatformName(b.item);
        const countA = platformCounts[platformA] || 0;
        const countB = platformCounts[platformB] || 0;
        if (countA !== countB) return countA - countB;
        const rankA = platformRank(platformA);
        const rankB = platformRank(platformB);
        if (rankA !== rankB) return rankA - rankB;
        const priceA = a.item.salePrice ? 0 : 1;
        const priceB = b.item.salePrice ? 0 : 1;
        if (priceA !== priceB) return priceA - priceB;
        return a.index - b.index;
      }});
      const chosen = entries[0].item;
      const platform = findPlatformName(chosen);
      platformCounts[platform] = (platformCounts[platform] || 0) + 1;
      return chosen;
    }}
    function bestFindUrl(item) {{
      const links = Array.isArray(item.affiliateLinks) ? item.affiliateLinks.filter((link) => link && link.url) : [];
      return item.affiliateUrl || links[0]?.url || "";
    }}
    function findNumericPrice(item) {{
      const direct = Number(item.salePrice);
      if (Number.isFinite(direct) && direct > 0) return direct;
      const text = String(item.currentPrice || "");
      const match = text.match(/(\\d{{1,3}}(?:\\.\\d{{3}})*|\\d+)(?:,(\\d{{2}}))?/);
      if (!match) return 0;
      return Number(`${{match[1].replace(/\\./g, "")}}.${{match[2] || "00"}}`);
    }}
    function dedupeFinds(items) {{
      const seenUrls = new Set();
      const seenVisuals = new Set();
      return items.filter((item) => {{
        const urlKey = norm(bestFindUrl(item));
        const imageKey = norm(String(item.productImage || item.selectedCreative || "").split("?")[0]);
        const titleKey = norm(String(item.title || "").replace(/\\b(kit|novo|original|premium|gamer)\\b/g, "").slice(0, 80));
        const visualKey = [imageKey, titleKey].filter(Boolean).join("|");
        if (urlKey && seenUrls.has(urlKey)) return false;
        if (visualKey && seenVisuals.has(visualKey)) return false;
        if (urlKey) seenUrls.add(urlKey);
        if (visualKey) seenVisuals.add(visualKey);
        return true;
      }});
    }}
    let findsControlsReady = false;
    function findsNumber(id, fallback) {{
      const value = Number($(`#${{id}}`)?.value);
      return Number.isFinite(value) ? value : fallback;
    }}
    function setFindsNumber(id, value) {{
      const input = $(`#${{id}}`);
      if (input) input.value = String(Math.round(value));
    }}
    function findMarketName(item) {{
      const links = Array.isArray(item.affiliateLinks) ? item.affiliateLinks.filter((link) => link && link.url) : [];
      const firstLink = links[0] || {{}};
      return item.marketplace?.name || firstLink.name || firstLink.platform || item.platform || "Marketplace";
    }}
    function findStoreKey(item) {{
      return norm(findMarketName(item)).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "marketplace";
    }}
    function findNicheName(item) {{
      return item.niche || item.priceBand || "Acessorios";
    }}
    function findNicheKey(item) {{
      return norm(findNicheName(item)).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "acessorios";
    }}
    function findShippingScope(item) {{
      const raw = norm([item.shippingScope, item.shippingOrigin, item.shipFrom, item.origin].join(" "));
      if (raw.includes("intern")) return "internacional";
      if (raw.includes("nacion") || raw.includes("brasil") || raw.includes("local")) return "nacional";
      const market = norm(findMarketName(item));
      if (market.includes("aliexpress") || market.includes("ali express")) return "internacional";
      return "nacional";
    }}
    function syncFindStoreOptions(items) {{
      const select = $("#findsStore");
      if (!select || select.dataset.ready === "1") return;
      const stores = [...new Map(items.map((item) => [findStoreKey(item), findMarketName(item)])).entries()]
        .sort((a, b) => a[1].localeCompare(b[1], "pt-BR"));
      select.innerHTML = '<option value="all">Todas as lojas</option>' + stores
        .map(([key, label]) => `<option value="${{escapeHtml(key)}}">${{escapeHtml(label)}}</option>`)
        .join("");
      select.dataset.ready = "1";
    }}
    function syncFindNicheOptions(items) {{
      const select = $("#findsNiche");
      if (!select || select.dataset.ready === "1") return;
      const niches = [...new Map(items.map((item) => [findNicheKey(item), findNicheName(item)])).entries()]
        .sort((a, b) => {{
          const order = ["hardware", "armazenamento", "conectividade", "setup", "manutencao", "audio-e-video", "casa-e-rotina", "acessorios"];
          const rankA = order.includes(a[0]) ? order.indexOf(a[0]) : 99;
          const rankB = order.includes(b[0]) ? order.indexOf(b[0]) : 99;
          if (rankA !== rankB) return rankA - rankB;
          return a[1].localeCompare(b[1], "pt-BR");
        }});
      select.innerHTML = '<option value="all">Todos os nichos</option>' + niches
        .map(([key, label]) => `<option value="${{escapeHtml(key)}}">${{escapeHtml(label)}}</option>`)
        .join("");
      select.dataset.ready = "1";
    }}
    function setupFindsControls(items) {{
      if (findsControlsReady || !$("#findsGrid")) return;
      syncFindStoreOptions(items);
      syncFindNicheOptions(items);
      const prices = items.map(findNumericPrice).filter((price) => price > 0);
      const maxPrice = Math.max(100, Math.ceil((Math.max(...prices, 100) + 50) / 50) * 50);
      ["findsMinRange", "findsMaxRange"].forEach((id) => {{
        const input = $(`#${{id}}`);
        if (input) input.max = String(maxPrice);
      }});
      setFindsNumber("findsMinPrice", 0);
      setFindsNumber("findsMinRange", 0);
      setFindsNumber("findsMaxPrice", maxPrice);
      setFindsNumber("findsMaxRange", maxPrice);
      findsControlsReady = true;
    }}
    function syncFindPriceControls(changedId="") {{
      const rangeMax = Number($("#findsMaxRange")?.max || 5000);
      let min = changedId === "findsMinRange" ? findsNumber("findsMinRange", 0) : findsNumber("findsMinPrice", 0);
      let max = changedId === "findsMaxRange" ? findsNumber("findsMaxRange", rangeMax) : findsNumber("findsMaxPrice", rangeMax);
      min = Math.max(0, Math.min(min, rangeMax));
      max = Math.max(0, Math.min(max, rangeMax));
      if (min > max) {{
        if (changedId.includes("Min")) max = min;
        else min = max;
      }}
      setFindsNumber("findsMinPrice", min);
      setFindsNumber("findsMinRange", min);
      setFindsNumber("findsMaxPrice", max);
      setFindsNumber("findsMaxRange", max);
    }}
    function findSourceForNode(node) {{
      return node?.dataset?.source || $("#findsFilterForm")?.dataset?.source || "finds";
    }}
    function sourceFindItems(source="finds") {{
      if (source === "dropshipping") {{
        return (DATA.dropshipping || []).filter((item) => item.storeCheckout === true && findProductId(item));
      }}
      return (DATA.finds || []).filter((item) => item.affiliateReady !== false && bestFindUrl(item));
    }}
    function configuredHomeFeaturedIds(kind) {{
      const ids = DATA.homeFeaturedProducts?.[kind];
      return Array.isArray(ids) ? ids.map((id) => String(id || "").trim()).filter(Boolean) : [];
    }}
    function featuredIdCandidates(item) {{
      return [
        findProductId(item),
        item.productId,
        item.id,
        item.id ? `find-${{item.id}}` : ""
      ].map((id) => String(id || "").trim()).filter(Boolean);
    }}
    function orderByConfiguredHomeFeatured(items, ids) {{
      if (!ids.length) return items;
      const byId = new Map();
      items.forEach((item) => {{
        featuredIdCandidates(item).forEach((id) => {{
          if (!byId.has(id)) byId.set(id, item);
        }});
      }});
      const selected = [];
      const selectedItems = new Set();
      ids.forEach((id) => {{
        const item = byId.get(id);
        if (item && !selectedItems.has(item)) {{
          selected.push(item);
          selectedItems.add(item);
        }}
      }});
      return [...selected, ...items.filter((item) => !selectedItems.has(item))];
    }}
    const HOME_DROPSHIPPING_PRIORITY = [
      "sob-ssd-kingston-a400-480gb",
      "sob-ram-kingston-ddr4-8gb-notebook",
      "sob-fonte-duex-500w-bronze",
      "sob-roteador-tplink-archer-c6",
      "sob-teclado-redragon-sindri-abnt2",
      "sob-hub-usbc-ugreen-5em1"
    ];
    function sortHomeDropshippingItems(items) {{
      const rank = new Map(HOME_DROPSHIPPING_PRIORITY.map((id, index) => [id, index]));
      return [...items].sort((a, b) => {{
        const aId = findProductId(a);
        const bId = findProductId(b);
        const aRank = rank.has(aId) ? rank.get(aId) : 999;
        const bRank = rank.has(bId) ? rank.get(bId) : 999;
        if (aRank !== bRank) return aRank - bRank;
        const aHardware = norm([a.title, a.niche].join(" ")).includes("hardware") ? 0 : 1;
        const bHardware = norm([b.title, b.niche].join(" ")).includes("hardware") ? 0 : 1;
        if (aHardware !== bHardware) return aHardware - bHardware;
        return findNumericPrice(b) - findNumericPrice(a);
      }});
    }}
    function filterFindsPageItems(items) {{
      const search = norm($("#findsSearch")?.value || "");
      const min = findsNumber("findsMinPrice", 0);
      const max = findsNumber("findsMaxPrice", Infinity);
      const sort = $("#findsSort")?.value || "relevance";
      const store = $("#findsStore")?.value || "all";
      const niche = $("#findsNiche")?.value || "all";
      const shipping = $("#findsShipping")?.value || "all";
      let filtered = items.filter((item) => {{
        const price = findNumericPrice(item);
        if (price > 0 && (price < min || price > max)) return false;
        if (store !== "all" && findStoreKey(item) !== store) return false;
        if (niche !== "all" && findNicheKey(item) !== niche) return false;
        if (shipping !== "all" && findShippingScope(item) !== shipping) return false;
        if (!search) return true;
        return norm([item.title, item.whySell, item.niche, item.platform, findMarketName(item), findShippingScope(item)].join(" ")).includes(search);
      }});
      if (sort === "price-asc") filtered.sort((a, b) => findNumericPrice(a) - findNumericPrice(b));
      if (sort === "price-desc") filtered.sort((a, b) => findNumericPrice(b) - findNumericPrice(a));
      return filtered;
    }}
    function renderFinds(target="#findsGrid", limit=999) {{
      const node = $(target);
      if (!node) return;
      const group = node.dataset.group;
      const source = findSourceForNode(node);
      const isPrimaryFindsPage = node.id === "findsGrid";
      let items = sourceFindItems(source);
      if (group) items = items.filter((item) => (item.publicGroup || "vendidos") === group);
      items = dedupeFinds(items);
      if (isPrimaryFindsPage) {{
        setupFindsControls(items);
        syncFindPriceControls();
        items = filterFindsPageItems(items);
        const count = $("#findsCount");
        if (count) count.textContent = `${{items.length}} produto${{items.length === 1 ? "" : "s"}} encontrado${{items.length === 1 ? "" : "s"}}`;
      }} else {{
        const search = norm($("#siteSearch")?.value || "");
        if (search) items = items.filter((item) => norm([item.title, item.whySell, item.niche, item.platform, item.marketplace?.name].join(" ")).includes(search));
        if (node.id === "homeDropshippingGrid") {{
          const configuredIds = configuredHomeFeaturedIds("dropshipping");
          items = configuredIds.length ? orderByConfiguredHomeFeatured(items, configuredIds) : sortHomeDropshippingItems(items);
        }}
        if (node.id === "homeFindsGrid") {{
          const configuredIds = configuredHomeFeaturedIds("finds");
          if (configuredIds.length) items = orderByConfiguredHomeFeatured(items, configuredIds);
        }}
      }}
      items = items.slice(0, limit);
      const emptyCopy = group === "vendidos"
        ? "Estamos atualizando esta selecao. Veja as ofertas recomendadas abaixo."
        : source === "dropshipping"
          ? "Nenhum produto sob encomenda encontrado com esses filtros."
        : "Nenhum achado encontrado.";
      node.innerHTML = items.map(findCard).join("") || `<p class="empty">${{emptyCopy}}</p>`;
    }}
    function findProductId(item) {{
      return item.productId || (item.id ? `find-${{item.id}}` : "");
    }}
    function marketClass(name="") {{
      const value = norm(name);
      if (value.includes("amazon")) return "market-amazon";
      if (value.includes("shopee")) return "market-shopee";
      if (value.includes("aliexpress") || value.includes("ali express")) return "market-ali";
      if (value.includes("mercado")) return "market-ml";
      return "";
    }}
    function marketLogo(name="") {{
      const value = norm(name);
      if (value.includes("amazon")) return "assets/affiliate-amazon-mark.svg";
      if (value.includes("shopee")) return "assets/shopee-logo.svg";
      if (value.includes("aliexpress") || value.includes("ali express")) return "assets/affiliate-aliexpress-mark.svg";
      if (value.includes("mercado")) return "assets/affiliate-mercado-livre-mark.svg";
      return "assets/mobilytech-logo.png";
    }}
    function marketButtonArt(name="") {{
      const value = norm(name);
      if (value.includes("amazon")) return "assets/affiliate-button-amazon.png";
      if (value.includes("aliexpress") || value.includes("ali express")) return "assets/affiliate-button-aliexpress.png";
      if (value.includes("mercado")) return "assets/affiliate-button-mercado-livre.png";
      return "";
    }}
    function compactSupplierFreightNote(note="", scope="", item={{}}) {{
      const minSubtotal = Number(item.addOnMinSubtotalBrl || 99);
      if (item.addOnOnly) {{
        return `Melhor em combo. Calcule com carrinho a partir de ${{money(minSubtotal)}}.`;
      }}
      if (item.comboRecommended || item.freightRiskLevel === "combo-recommended") {{
        const amount = String(note || "").match(/R\\$\\s*[\\d.,]+/);
        return amount ? `Melhor em combo. Frete SP: ${{amount[0]}}.` : "Melhor em combo para diluir o frete.";
      }}
      const amount = String(note || "").match(/R\\$\\s*[\\d.,]+/);
      if (scope === "internacional") {{
        return amount ? `Frete SP: ${{amount[0]}}. Total e tributos no carrinho.` : "Frete, total e tributos aparecem no carrinho.";
      }}
      return amount ? `Frete SP: ${{amount[0]}}. Total por CEP no carrinho.` : "Frete e total aparecem no carrinho.";
    }}
    function findCard(item) {{
      const market = item.marketplace || {{}};
      const image = asset(item.productImage || item.selectedCreative);
      const logo = asset(marketLogo(market.name || ""));
      const isManual = item.storeCheckout === true;
      const numericPrice = findNumericPrice(item);
      const price = numericPrice ? money(numericPrice) : (item.currentPrice || "");
      const buttonLabel = "Ver oferta";
      const scope = findShippingScope(item);
      const originNote = isManual ? (scope === "internacional" ? "Origem e prazo informados antes do pagamento." : "Produto nacional sob encomenda.") : "";
      const freightNote = isManual ? (item.publicShippingNote || "Frete recalculado pelo CEP antes do pagamento.") : "";
      const compactFreightNote = isManual ? compactSupplierFreightNote(freightNote, scope, item) : "";
      const disclosure = isManual
        ? `<div class="find-disclosure"><span>${{escapeHtml(originNote)}}</span><small>${{escapeHtml(compactFreightNote)}}</small></div>`
        : "";
      const affiliateLinks = Array.isArray(item.affiliateLinks) ? item.affiliateLinks.filter((link) => link && link.url) : [];
      const manualProductId = findProductId(item);
      const manualProduct = isManual ? productById(manualProductId) : null;
      const manualButtonAttr = manualProduct && hasProductVariants(manualProduct)
        ? `data-detail="${{manualProductId}}"`
        : `data-add="${{manualProductId}}"`;
      const linkButton = (link) => {{
        const name = link.name || link.platform || market.name || "Marketplace";
        const className = link.class || marketClass(name);
        const label = "Ver oferta";
        const linkLogo = asset(marketLogo(name));
        const art = marketButtonArt(name);
        if (art) {{
          const artSrc = asset(art);
          return `<a class="market-btn market-art-btn ${{className}}" href="${{link.url}}" target="_blank" rel="noopener" aria-label="${{label}} ${{name}}"><img class="market-button-art" src="${{artSrc}}" alt="${{label}} ${{name}}"></a>`;
        }}
        return `<a class="market-btn ${{className}}" href="${{link.url}}" target="_blank" rel="noopener"><span class="market-brand"><img src="${{linkLogo}}" alt="" aria-hidden="true"></span><span class="market-sep" aria-hidden="true"></span><span class="market-label">${{label}}</span></a>`;
      }};
      const action = isManual
        ? `<div class="market-actions"><button class="market-btn market-mobilytech" type="button" ${{manualButtonAttr}}><span class="market-cart-glyph" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M6 6h15l-1.4 8.1H8.2L6 6Z"></path><path d="M6 6 5.2 3H2.5"></path><circle cx="9.3" cy="19.3" r="1.6"></circle><circle cx="17.4" cy="19.3" r="1.6"></circle></svg></span><span class="market-sep" aria-hidden="true"></span><span class="market-label">Adicionar ao carrinho</span></button></div>`
        : `<div class="market-actions">${{affiliateLinks.length ? affiliateLinks.map(linkButton).join("") : (() => {{ const art = marketButtonArt(market.name || ""); return art ? `<a class="market-btn market-art-btn ${{market.class || marketClass(market.name || "")}}" href="${{item.affiliateUrl || "#achados"}}" target="_blank" rel="noopener" aria-label="${{buttonLabel}} ${{market.name || "Marketplace"}}"><img class="market-button-art" src="${{asset(art)}}" alt="${{buttonLabel}} ${{market.name || "Marketplace"}}"></a>` : `<a class="market-btn ${{market.class || ""}}" href="${{item.affiliateUrl || "#achados"}}" target="_blank" rel="noopener"><span class="market-brand"><img src="${{logo}}" alt="" aria-hidden="true"></span><span class="market-sep" aria-hidden="true"></span><span class="market-label">${{buttonLabel}}</span></a>`; }})()}}</div>`;
      return `<article class="find-card" id="${{anchorId("find", item.title)}}" data-search="${{item.title}} ${{item.niche}}" data-store="${{escapeHtml(findMarketName(item))}}" data-shipping="${{findShippingScope(item)}}">
        <div class="find-media"><img src="${{image}}" alt="${{item.title}}"></div>
        <h3>${{item.title}}</h3>
        <p>${{isManual ? "Compra direta com preco do produto revisado e frete final por CEP." : (item.whySell || item.publicPartnerNote || "")}}</p>
        <div class="find-price">${{price}}</div>
        ${{disclosure}}
        ${{action}}
      </article>`;
    }}
    function addBaseProduct(productId) {{
      if (!canAddCartProduct(productId)) return;
      const product = productById(productId);
      if (hasProductVariants(product)) {{
        productDetail(productId);
        return;
      }}
      const existing = cart.find((item) => String(item.productId) === String(productId) && !item.selectedVariantId);
      selectedShipping = null;
      if (existing && allowsCartQuantity(product)) {{
        existing.quantity = Math.max(1, Number(existing.quantity || 1)) + 1;
      }} else {{
        cart.push({{ productId, selectedAddons: [], selectedSwaps: [], quantity: 1 }});
      }}
      saveCart();
      openCart();
      showToast("Produto adicionado ao carrinho.");
    }}
    function addVariantProduct(productId) {{
      if (!canAddCartProduct(productId)) return;
      const product = productById(productId);
      if (!product) return;
      const selectedId = $("#productVariantSelect")?.value || "";
      const variant = selectedVariantForItem(product, {{ selectedVariantId: selectedId }});
      const summary = variantSummary(product, variant);
      const existing = cart.find((item) => String(item.productId) === String(productId) && String(item.selectedVariantId || "") === String(summary?.id || ""));
      selectedShipping = null;
      if (existing && allowsCartQuantity(product)) {{
        existing.quantity = Math.max(1, Number(existing.quantity || 1)) + 1;
      }} else {{
        cart.push({{ productId, selectedVariantId: summary?.id || "", selectedVariant: summary, selectedAddons: [], selectedSwaps: [], quantity: 1 }});
      }}
      saveCart();
      $("#productModal")?.close();
      openCart();
      showToast("Produto adicionado ao carrinho.");
    }}
    function addConfiguredProduct(productId) {{
      const product = productById(productId);
      if (!product) return;
      if (!isConfigurablePc(product)) return addBaseProduct(productId);
      if (!canAddCartProduct(productId)) return;
      const selectedAddons = $$("#modalBody input[data-addon]:checked").map((input) => ({{
        category: input.dataset.category,
        index: Number(input.dataset.index),
        label: input.dataset.label,
        price: Number(input.dataset.price || 0)
      }}));
      const selectedSwaps = $$("#modalBody input[data-swap]:checked").map((input) => ({{
        target: input.dataset.target,
        index: Number(input.dataset.index),
        label: input.dataset.label,
        price: Number(input.dataset.price || 0)
      }}));
      selectedShipping = null;
      cart.push({{ productId, selectedAddons, selectedSwaps, quantity: 1 }});
      saveCart();
      $("#productModal")?.close();
      openCart();
      showToast("Produto configurado adicionado ao carrinho.");
    }}
    function productDetail(productId) {{
      const product = productById(productId);
      if (!product) return;
      const modal = $("#productModal");
      const body = $("#modalBody");
      const specItems = specs(product).map((item) => `<span>${{item}}</span>`).join("");
      const isPc = isConfigurablePc(product);
      const variants = productVariants(product);
      const selectedVariant = selectedVariantForItem(product, {{}});
      const variantHtml = variants.length
        ? `<div class="variant-box">
            <label for="productVariantSelect">Variacao</label>
            <select class="variant-select" id="productVariantSelect" data-product-id="${{product.id}}">
              ${{variants.map((variant) => {{
                const id = variantId(variant);
                const price = variantPrice(product, variant);
                return `<option value="${{escapeHtml(id)}}"${{selectedVariant && id === variantId(selectedVariant) ? " selected" : ""}}>${{escapeHtml(variantLabel(variant))}} - ${{money(price)}}</option>`;
              }}).join("")}}
            </select>
            <p class="variant-note">Escolha a variacao antes de adicionar. O frete sera recalculado pelo CEP.</p>
          </div>`
        : "";
      const swapGroups = isPc ? availableSwaps(product) : [];
      const swapHtml = swapGroups.map((group) => group.options.length ? `<div class="option-box"><strong>${{group.label}}</strong>${{group.options.map((option, index) => `<label><span><input type="checkbox" data-swap data-target="${{group.target}}" data-index="${{index}}" data-label="${{option.label}}" data-price="${{option.price}}"> ${{option.label}}</span><b>${{money(option.price)}}</b></label>`).join("")}}</div>` : "").join("");
      const addonHtml = isPc ? DATA.addons.filter((item) => item.active !== false).map((option, index) => `<label><span><input type="checkbox" data-addon data-category="${{option.category}}" data-index="${{index}}" data-label="${{option.label}}" data-price="${{option.price}}"> ${{option.label}}</span><b>+${{money(option.price)}}</b></label>`).join("") : "";
      const configHtml = isPc
        ? `${{swapHtml ? `<h3>Trocas disponiveis</h3>${{swapHtml}}` : ""}}${{addonHtml ? `<h3>Adicionais</h3><div class="option-box">${{addonHtml}}</div>` : ""}}<button class="btn btn-red full" type="button" data-add-config="${{product.id}}"><span aria-hidden="true">&#128722;</span> Adicionar configurado</button>`
        : `${{variantHtml}}<button class="btn btn-red full" type="button" ${{variants.length ? `data-add-variant="${{product.id}}"` : `data-add="${{product.id}}"`}}><span aria-hidden="true">&#128722;</span> Adicionar ao carrinho</button>`;
      body.innerHTML = `<div class="modal-grid">
        <img id="modalProductImage" src="${{asset(selectedVariant?.image || product.cutout || product.image)}}" alt="${{product.title}}">
        <div>
          <h2>${{productBaseTitle(product)}}</h2>
          <p class="price" id="modalVariantPrice">${{money(variantPrice(product, selectedVariant))}}</p>
          <div class="spec-list">${{specItems}}</div>
          ${{configHtml}}
        </div>
      </div>`;
      modal?.showModal();
    }}
    function updateVariantPreview() {{
      const select = $("#productVariantSelect");
      if (!select) return;
      const product = productById(select.dataset.productId);
      const variant = selectedVariantForItem(product, {{ selectedVariantId: select.value }});
      const priceNode = $("#modalVariantPrice");
      const imageNode = $("#modalProductImage");
      if (priceNode) priceNode.textContent = money(variantPrice(product, variant));
      if (imageNode) imageNode.src = asset(variant?.image || product?.cutout || product?.image);
    }}
    function availableSwaps(product) {{
      if (product.category !== "pc" && product.allowGlobalSwaps !== true) return [];
      const details = product.specs || {{}};
      const categories = {{
        processor: ["Processador", details.processor || ""],
        memory: ["Memoria", details.memory || ""],
        gpu: ["Placa de video", details.gpu || ""],
        powerSupply: ["Fonte", details.powerSupply || ""],
        storage: ["Armazenamento", details.storage || ""]
      }};
      const productSwaps = Object.entries(product.swaps || {{}}).flatMap(([target, options]) => (options || []).map((option) => ({{...option, target}})));
      const all = [...DATA.swaps, ...productSwaps].filter((option) => option && option.active !== false);
      return Object.entries(categories).map(([target, [label, value]]) => {{
        const options = all.filter((option) => option.target === target && swapMatches(value, option));
        return {{ target, label, options }};
      }});
    }}
    function swapMatches(value, option) {{
      const text = norm(value);
      const when = option.whenContains || [];
      const exclude = option.excludeContains || [];
      if (when.length && !when.some((item) => text.includes(norm(item)))) return false;
      if (exclude.length && exclude.some((item) => text.includes(norm(item)))) return false;
      return true;
    }}
    function renderCart() {{
      const count = cart.reduce((sum, item) => sum + Math.max(1, Number(item.quantity || 1)), 0);
      $("#cartCount") && ($("#cartCount").textContent = String(count));
      const discount = couponDiscount();
      const shippingPrice = selectedShipping?.price || 0;
      const importTaxes = importTaxEstimate();
      $("#cartTotal") && ($("#cartTotal").textContent = money(checkoutTotal()));
      const items = $("#cartItems");
      if (!items) return;
      if (!cart.length) {{
        items.innerHTML = '<p class="empty">Seu carrinho ainda esta vazio.</p>';
        const supplierDisclosure = $("#supplierDisclosureCheck");
        if (supplierDisclosure) supplierDisclosure.hidden = true;
        renderDeliveryChoice();
        renderCheckoutReview();
        syncCouponFeedback();
        return;
      }}
      const cartRows = cart.map((item, index) => {{
        const product = productById(item.productId);
        if (!product) return "";
        const selectedVariant = selectedVariantForItem(product, item);
        const variantText = selectedVariant ? variantLabel(selectedVariant) : "";
        const options = [variantText, ...(item.selectedAddons || []).map((o) => o.label), ...(item.selectedSwaps || []).map((o) => o.label)].filter(Boolean).join(" + ");
        const quantity = Math.max(1, Number(item.quantity || 1));
        const quantityEnabled = allowsCartQuantity(product);
        const quantityLabel = !quantityEnabled && quantity > 1 ? `Qtd. ${{quantity}}` : "";
        const quantityControl = quantityEnabled
          ? `<div class="drawer-qty" aria-label="Quantidade">
              <button type="button" data-qty="${{index}}" data-delta="-1" aria-label="Diminuir quantidade"${{quantity <= 1 ? " disabled" : ""}}>-</button>
              <span aria-live="polite">${{quantity}}</span>
              <button type="button" data-qty="${{index}}" data-delta="1" aria-label="Aumentar quantidade">+</button>
            </div>`
          : "";
        return `<article class="drawer-item">
          <img src="${{asset(selectedVariant?.image || product.cutout || product.image)}}" alt="">
          <div><h3>${{productBaseTitle(product)}}</h3><small>${{[options || "Sem opcionais", quantityLabel].filter(Boolean).join(" - ")}}</small><div class="drawer-item-foot">${{quantityControl}}<strong>${{money(productTotal(item))}}</strong></div></div>
          <button class="close-drawer" type="button" data-remove="${{index}}" aria-label="Remover">&times;</button>
        </article>`;
      }}).join("");
      const discountRow = discount > 0
        ? `<article class="drawer-item drawer-adjustment"><div></div><div><h3>Cupom ${{activePromotion().code}}</h3><small>${{activePromotion().label}}</small></div><strong>-${{money(discount)}}</strong></article>`
        : "";
      const shippingRow = shippingPrice > 0
        ? `<article class="drawer-item drawer-adjustment"><div></div><div><h3>Frete selecionado</h3><small>${{selectedShipping.carrier || selectedShipping.company || "Entrega"}} - ${{selectedShipping.serviceName || selectedShipping.name || "servico"}}</small></div><strong>${{money(shippingPrice)}}</strong></article>`
        : "";
      const taxRow = importTaxes.applies
        ? `<article class="drawer-item drawer-adjustment"><div></div><div><h3>Tributos de importacao</h3><small>${{importTaxes.pending ? "Estimativa aparece apos calcular o frete." : "Estimativa conservadora de II + ICMS."}}</small></div><strong>${{importTaxes.pending ? "A calcular" : money(importTaxes.total)}}</strong></article>`
        : "";
      items.innerHTML = cartRows + discountRow + shippingRow + taxRow;
      renderDeliveryChoice();
      const supplierDisclosure = $("#supplierDisclosureCheck");
      if (supplierDisclosure) {{
        supplierDisclosure.hidden = !cartFulfillmentState().supplier;
      }}
      renderCheckoutReview();
      syncCouponFeedback();
    }}
    function changeCartQuantity(index, delta) {{
      const item = cart[index];
      const product = productById(item?.productId);
      if (!item || !product || !allowsCartQuantity(product)) return;
      const current = Math.max(1, Number(item.quantity || 1));
      const next = Math.max(1, current + Number(delta || 0));
      if (next === current) return;
      item.quantity = next;
      selectedShipping = null;
      saveCart();
    }}
    function renderDeliveryChoice() {{
      const node = $("#deliveryChoice");
      if (!node) return;
      const state = cartFulfillmentState();
      if (!cart.length) {{
        node.innerHTML = "";
        return;
      }}
      if (state.supplier && !state.physical) {{
        node.innerHTML = '<div class="shipping-option is-muted"><span class="ship-copy"><strong>Envio obrigatorio para produtos sob encomenda</strong><small>Informe o CEP e selecione uma entrega com rastreio antes do pagamento.</small></span></div>';
        return;
      }}
      if (state.supplier && state.physical) {{
        node.innerHTML = '<div class="shipping-option is-muted"><span class="ship-copy"><strong>Carrinho misto</strong><small>Itens fisicos e produtos sob encomenda usam frete final calculado pelo CEP.</small></span></div>';
        return;
      }}
      node.innerHTML = `<button class="shipping-option ${{selectedShipping ? "" : "is-selected"}}" type="button" id="localPickupOption">
        <span class="ship-copy"><strong>Retirada local em Vila Suzana</strong><small>Sem frete. Combine WhatsApp apos confirmacao do pagamento.</small></span>
        <strong class="ship-price">Gratis</strong>
      </button>`;
      $("#localPickupOption")?.addEventListener("click", () => {{
        selectedShipping = null;
        renderCart();
      }});
    }}
    function openCart() {{
      $("#cartBackdrop")?.removeAttribute("hidden");
      $("#cartDrawer")?.classList.add("open");
      $("#cartDrawer")?.setAttribute("aria-hidden", "false");
    }}
    function closeCart() {{
      $("#cartBackdrop")?.setAttribute("hidden", "");
      $("#cartDrawer")?.classList.remove("open");
      $("#cartDrawer")?.setAttribute("aria-hidden", "true");
    }}
    async function quoteShipping() {{
      const postalCode = $("#postalCode")?.value || "";
      const box = $("#shippingQuotes");
      const state = cartFulfillmentState();
      if (!cart.length) return showToast("Adicione um produto primeiro.");
      if (!postalCode.replace(/\\D/g, "")) return showToast("Informe o CEP para calcular.");
      box.innerHTML = "<p>Calculando frete...</p>";
      try {{
        const response = await fetch("/api/shipping-quote", {{
          method: "POST",
          headers: {{ "Content-Type": "application/json" }},
          body: JSON.stringify({{ cartItems: cart, postalCode }})
        }});
        const data = await response.json();
        if (!response.ok || !Array.isArray(data.quotes)) {{
          const apiError = new Error(data.error || "Frete indisponivel agora.");
          apiError.code = data.code || "";
          apiError.status = response.status;
          apiError.details = data.details;
          throw apiError;
        }}
        box.innerHTML = data.quotes.map((quote, index) => {{
          const company = typeof quote.company === "string"
            ? quote.company
            : (quote.company?.name || quote.company_name || "Transportadora");
          const service = quote.name || quote.service || quote.service_name || "Servico";
          const title = customerFreightTitle(company, service, quote.provider);
          const rawTime = quote.deliveryTime || quote.delivery_time || "";
          const time = rawTime ? `${{rawTime}} dia(s) uteis` : "prazo sob consulta";
          const economics = quote.shippingEconomics || {{}};
          const extra = quote.includedShipping && quote.originalShippingPrice
            ? `Frete real de ${{money(quote.originalShippingPrice)}} incluso no preco final.`
            : economics.freightRiskLevel === "combo-recommended"
              ? "Adicionar mais itens pode diluir o frete."
              : economics.freightRiskLevel === "add-on-only"
                ? "Item recomendado para combo."
                : "";
          return `<label class="shipping-option">
            <span class="ship-main">
              <input type="radio" name="shipping" data-index="${{index}}">
              <span class="ship-copy"><strong>${{escapeHtml(title)}}</strong><small>${{time}}${{extra ? ` - ${{escapeHtml(extra)}}` : ""}}</small></span>
            </span>
            <strong class="ship-price">${{money(quote.price)}}</strong>
          </label>`;
        }}).join("");
        box.querySelectorAll("input[name=shipping]").forEach((input) => input.addEventListener("change", () => {{
          const quote = data.quotes[Number(input.dataset.index)];
          selectedShipping = {{
            ...quote,
            postalCode: data.postalCode || postalCode,
            serviceId: quote.id,
            serviceName: quote.name || quote.service || quote.service_name || "Servico",
            carrier: typeof quote.company === "string" ? quote.company : (quote.company?.name || quote.company_name || "Transportadora")
          }};
          box.querySelectorAll(".shipping-option").forEach((option) => option.classList.remove("is-selected"));
          input.closest(".shipping-option")?.classList.add("is-selected");
          renderCart();
        }}));
        if (state.supplier && data.quotes.length === 1) {{
          const quote = data.quotes[0];
          selectedShipping = {{
            ...quote,
            postalCode: data.postalCode || postalCode,
            serviceId: quote.id,
            serviceName: quote.name || quote.service || quote.service_name || "Servico",
            carrier: typeof quote.company === "string" ? quote.company : (quote.company?.name || quote.company_name || "Transportadora")
          }};
          renderCart();
        }}
      }} catch(error) {{
        if (state.supplier) {{
          selectedShipping = null;
          renderCart();
          const message = error.message || "Nao conseguimos calcular o frete direto agora.";
          box.innerHTML = `<div class="shipping-option is-muted"><span class="ship-copy"><strong>Revise o carrinho</strong><small>${{escapeHtml(message)}}</small></span></div>`;
          showToast(error.code === "SUPPLIER_ADDON_CART_REQUIRED" ? "Adicione mais itens para diluir o frete." : "Frete direto indisponivel agora.");
          return;
        }}
        const fallback = fixedSupplierShippingQuote(postalCode);
        if (fallback) {{
          renderFixedSupplierShipping(box, fallback);
          showToast("Frete estimado aplicado. Confira antes de finalizar.");
          return;
        }}
        selectedShipping = null;
        renderCart();
        box.innerHTML = "<p>Nao conseguimos calcular o frete agora. Confira o CEP ou tente novamente em instantes.</p>";
      }}
    }}
    async function startCheckout(endpoint, button) {{
      if (!cart.length) return showToast("Seu carrinho esta vazio.");
      const state = cartFulfillmentState();
      if (state.supplier && (!selectedShipping || !selectedShipping.serviceId)) {{
        return showToast("Calcule e selecione o frete antes de finalizar produtos sob encomenda.");
      }}
      const acceptedPolicies = policyPayload();
      if (!acceptedPolicies.terms || !acceptedPolicies.privacy) {{
        return showToast("Aceite os Termos de Compra e a Politica de Privacidade.");
      }}
      if (state.supplier && !acceptedPolicies.supplierDisclosure) {{
        return showToast("Confirme o aviso de produto sob encomenda.");
      }}
      const original = button.innerHTML;
      button.innerHTML = "Abrindo checkout...";
      button.disabled = true;
      try {{
        const response = await fetch(endpoint, {{
          method: "POST",
          headers: {{ "Content-Type": "application/json" }},
          body: JSON.stringify({{ cartItems: cart, shipping: selectedShipping, coupon: couponPayload(), acceptedPolicies }})
        }});
        const data = await response.json();
        if (!response.ok || !data.checkout_url) throw new Error(data.error || "Nao foi possivel abrir o checkout agora.");
        window.location.href = data.checkout_url;
      }} catch(error) {{
        showToast(error.message);
      }} finally {{
        button.innerHTML = original;
        button.disabled = false;
      }}
    }}
    function submitLead(form, type) {{
      const data = new FormData(form);
      const name = data.get("name") || "";
      const phone = data.get("phone") || "";
      const goal = data.get("goal") || data.get("description") || "";
      const text = type === "build"
        ? `Ola, sou ${{name}}. Quero montar um PC. Orcamento: ${{data.get("budget") || "a combinar"}}. Objetivo: ${{goal}}. WhatsApp: ${{phone}}`
        : `Ola, sou ${{name}}. Quero agendar limpeza de PC. Detalhes: ${{goal}}. WhatsApp: ${{phone}}`;
      window.open(`https://wa.me/5511954801967?text=${{encodeURIComponent(text)}}`, "_blank");
    }}
    function submitOrderLookup(form) {{
      const data = new FormData(form);
      const order = data.get("order") || "sem numero informado";
      const email = data.get("email") || "sem email informado";
      const text = `Ola, quero ajuda para acompanhar meu pedido MobilyTech BR. Pedido: ${{order}}. E-mail: ${{email}}.`;
      window.open(`https://wa.me/5511954801967?text=${{encodeURIComponent(text)}}`, "_blank");
    }}
    function openAccountPopover() {{
      const popover = $("#accountPopover");
      const button = $("#accountMenuButton");
      if (!popover || !button) return;
      popover.classList.remove("is-closing");
      popover.hidden = false;
      button.setAttribute("aria-expanded", "true");
    }}
    function closeAccountPopover(immediate=false) {{
      const popover = $("#accountPopover");
      const button = $("#accountMenuButton");
      if (!popover || popover.hidden) {{
        button?.setAttribute("aria-expanded", "false");
        return;
      }}
      button?.setAttribute("aria-expanded", "false");
      if (immediate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {{
        popover.classList.remove("is-closing");
        popover.hidden = true;
        return;
      }}
      popover.classList.add("is-closing");
      window.setTimeout(() => {{
        popover.hidden = true;
        popover.classList.remove("is-closing");
      }}, 130);
    }}
    document.addEventListener("click", (event) => {{
      const accountButton = event.target.closest("#accountMenuButton");
      const accountWrap = event.target.closest(".account-menu-wrap");
      if (accountButton) {{
        const popover = $("#accountPopover");
        const open = popover?.hidden === false;
        if (open) closeAccountPopover();
        else openAccountPopover();
        return;
      }}
      if (!accountWrap) {{
        closeAccountPopover();
      }}
      const searchResult = event.target.closest("[data-search-index]");
      if (searchResult) {{
        goSearchResult(currentSearchResults[Number(searchResult.dataset.searchIndex)]);
        return;
      }}
      if (!event.target.closest(".search-zone")) hideSearchResults();
      const add = event.target.closest("[data-add]");
      const detail = event.target.closest("[data-detail]");
      const addConfig = event.target.closest("[data-add-config]");
      const addVariant = event.target.closest("[data-add-variant]");
      const remove = event.target.closest("[data-remove]");
      const qty = event.target.closest("[data-qty]");
      const focusOrder = event.target.closest("[data-focus-order]");
      const supportLogin = event.target.closest("[data-support-login]");
      if (focusOrder) {{
        const form = $("#orderLookupForm");
        const firstInput = form?.querySelector("input");
        scrollElementIntoView(form);
        setTimeout(() => firstInput?.focus(), 160);
        return;
      }}
      if (supportLogin) {{
        window.open("https://wa.me/5511954801967?text=Ola%2C%20quero%20ajuda%20com%20minha%20conta%20MobilyTech%20BR.", "_blank");
        return;
      }}
      if (add) addBaseProduct(add.dataset.add);
      if (detail) productDetail(detail.dataset.detail);
      if (addConfig) addConfiguredProduct(addConfig.dataset.addConfig);
      if (addVariant) addVariantProduct(addVariant.dataset.addVariant);
      if (qty) {{ changeCartQuantity(Number(qty.dataset.qty), Number(qty.dataset.delta)); return; }}
      if (remove) {{ cart.splice(Number(remove.dataset.remove), 1); selectedShipping = null; saveCart(); }}
    }});
    document.addEventListener("change", (event) => {{
      if (event.target.closest("#productVariantSelect")) updateVariantPreview();
    }});
    $("#cartButton")?.addEventListener("click", openCart);
    $("#closeCart")?.addEventListener("click", closeCart);
    $("#cartBackdrop")?.addEventListener("click", closeCart);
    $("#quoteShipping")?.addEventListener("click", quoteShipping);
    $("#checkoutMercado")?.addEventListener("click", (e) => startCheckout("/api/create-preference", e.currentTarget));
    $("#checkoutAbacate")?.addEventListener("click", (e) => startCheckout("/api/create-abacate-checkout", e.currentTarget));
    if ($("#couponCode")) $("#couponCode").value = activeCouponCode;
    $("#couponCode")?.addEventListener("input", (event) => {{
      if (norm(event.currentTarget.value || "") !== norm(activeCouponCode)) activeCouponCode = "";
      couponAttempted = false;
      try {{ localStorage.removeItem(couponKey); }} catch (error) {{}}
      renderCart();
    }});
    $("#couponCode")?.addEventListener("keydown", (event) => {{
      if (event.key !== "Enter") return;
      event.preventDefault();
      $("#applyCoupon")?.click();
    }});
    $("#applyCoupon")?.addEventListener("click", () => {{
      activeCouponCode = ($("#couponCode")?.value || "").trim();
      couponAttempted = Boolean(activeCouponCode);
      renderCart();
    }});
    $$("#buildForm").forEach((form) => form.addEventListener("submit", (e) => {{ e.preventDefault(); submitLead(form, "build"); }}));
    $$("#cleanForm, #cleanFormInline").forEach((form) => form.addEventListener("submit", (e) => {{ e.preventDefault(); submitLead(form, "clean"); }}));
    $("#orderLookupForm")?.addEventListener("submit", (e) => {{ e.preventDefault(); submitOrderLookup(e.currentTarget); }});
    let findsFilterFrame = 0;
    function applyFindsFiltersNow(changedId="") {{
      syncFindPriceControls(changedId);
      renderFinds("#findsGrid");
    }}
    function queueFindsFilters(event) {{
      const changedId = event?.currentTarget?.id || "";
      if (findsFilterFrame) cancelAnimationFrame(findsFilterFrame);
      findsFilterFrame = requestAnimationFrame(() => {{
        findsFilterFrame = 0;
        applyFindsFiltersNow(changedId);
      }});
    }}
    $("#findsFilterForm")?.addEventListener("submit", (event) => {{
      event.preventDefault();
      applyFindsFiltersNow(document.activeElement?.id || "");
      $("#findsSearch")?.blur();
    }});
    $("[data-finds-control]") && $$("#findsSearch, #findsStore, #findsNiche, #findsShipping, #findsMinPrice, #findsMaxPrice, #findsMinRange, #findsMaxRange, #findsSort").forEach((input) => {{
      ["input", "change", "search", "keyup", "compositionend"].forEach((type) => input.addEventListener(type, queueFindsFilters));
    }});
    $("#findsReset")?.addEventListener("click", () => {{
      const source = findSourceForNode($("#findsGrid") || $("#findsFilterForm"));
      findsControlsReady = false;
      $("#findsStore") && ($("#findsStore").dataset.ready = "");
      $("#findsNiche") && ($("#findsNiche").dataset.ready = "");
      setupFindsControls(dedupeFinds(sourceFindItems(source)));
      $("#findsSearch") && ($("#findsSearch").value = "");
      $("#findsStore") && ($("#findsStore").value = "all");
      $("#findsNiche") && ($("#findsNiche").value = "all");
      $("#findsShipping") && ($("#findsShipping").value = "all");
      $("#findsSort") && ($("#findsSort").value = "relevance");
      renderFinds("#findsGrid");
    }});
    applyUrlSearch();
    $("#siteSearch")?.addEventListener("input", () => {{
      renderSearchResults();
      renderProducts("#homePcGrid", "pc", Number($("#homePcGrid")?.dataset.limit || 999));
      renderProducts("#homeHardwareGrid", "hardware", Number($("#homeHardwareGrid")?.dataset.limit || 999));
      renderProducts("#catalogGrid", window.currentFilter || "all");
      renderFinds("#homeDropshippingGrid", Number($("#homeDropshippingGrid")?.dataset.limit || 999));
      renderFinds("#homeFindsGrid", Number($("#homeFindsGrid")?.dataset.limit || 999));
      renderFinds("#findsGrid");
      renderFinds("#findsRecommendedGrid");
    }});
    $("#siteSearch")?.addEventListener("focus", renderSearchResults);
    $("#siteSearch")?.addEventListener("keydown", (event) => {{
      if (event.key === "Enter") {{
        event.preventDefault();
        submitSearch();
      }}
      if (event.key === "Escape") hideSearchResults();
    }});
    document.addEventListener("keydown", (event) => {{
      if (event.key !== "Escape") return;
      closeAccountPopover();
    }});
    $$(".filter-chip").forEach((button) => button.addEventListener("click", () => {{
      $$(".filter-chip").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      window.currentFilter = button.dataset.filter;
      renderProducts("#catalogGrid", window.currentFilter);
    }}));
    window.addEventListener("hashchange", scrollToHashTarget);
    renderProducts("#homePcGrid", "pc", Number($("#homePcGrid")?.dataset.limit || 999));
    renderProducts("#homeHardwareGrid", "hardware", Number($("#homeHardwareGrid")?.dataset.limit || 999));
    renderProducts("#catalogGrid", "all");
    renderFinds("#homeDropshippingGrid", Number($("#homeDropshippingGrid")?.dataset.limit || 999));
    renderFinds("#homeFindsGrid", Number($("#homeFindsGrid")?.dataset.limit || 999));
    renderFinds("#findsGrid");
    renderFinds("#findsRecommendedGrid");
    renderCart();
    loadAccountSession();
    scrollToHashTarget();
    """


def html_doc(title: str, main: str, prefix: str, active: str, products, finalists, addons, swaps, site_content) -> str:
    document = f"""<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{clean_text(title)}</title>
    <meta name="description" content="MobilyTech BR - PCs revisados, hardware, limpeza e MobilyTech Finds.">
    <link rel="icon" type="image/x-icon" href="/assets/favicon.ico?v={FAVICON_VERSION}" sizes="any">
    <link rel="shortcut icon" href="/assets/favicon.ico?v={FAVICON_VERSION}">
    <link rel="icon" type="image/png" href="/assets/favicon.png?v={FAVICON_VERSION}" sizes="256x256">
    <link rel="apple-touch-icon" href="/assets/favicon.png?v={FAVICON_VERSION}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900;1000&display=swap" rel="stylesheet">
    <style>{css()}</style>
  </head>
  <body data-asset-base="{prefix}">
    {header(prefix, active, site_content)}
    {main}
    {footer(prefix, site_content)}
    {cart_drawer(prefix, site_content)}
    <script>{js(products, finalists, addons, swaps, site_content)}</script>
  </body>
</html>
"""
    return "\n".join(line.rstrip() for line in document.splitlines()) + "\n"


def main():
    products = load_json("products.json", [])
    finalists = load_json("phase2-finalists.json", {"finalists": []})
    addons = load_json("addons.json", [])
    swaps = load_json("swaps.json", [])
    site_content = merge_dict(DEFAULT_SITE_CONTENT, load_json("site-content.json", {}))
    pages_content = site_content["pages"]
    service_panels = site_content["servicePanels"]
    FASE2_DIR.mkdir(exist_ok=True)

    pages = {
        ROOT / "index.html": (
            "MobilyTech BR | Loja gamer",
            home_main(products, finalists, "./", site_content),
            "./",
            "home",
        ),
        ROOT / "fase2-hibrida.html": (
            "MobilyTech BR | Loja gamer",
            home_main(products, finalists, "./", site_content),
            "./",
            "home",
        ),
        FASE2_DIR / "index.html": (
            "MobilyTech BR | Loja gamer",
            home_main(products, finalists, "../", site_content),
            "../",
            "home",
        ),
        FASE2_DIR / "ofertas.html": (
            "Ofertas | MobilyTech BR",
            products_page(pages_content["ofertas"], "../"),
            "../",
            "ofertas",
        ),
        FASE2_DIR / "achados.html": (
            "MobilyTech Finds | MobilyTech BR",
            finds_page("../", pages_content["achados"]),
            "../",
            "achados",
        ),
        FASE2_DIR / "nossos-produtos.html": (
            "Produtos sob encomenda | MobilyTech BR",
            nossos_produtos_page("../", pages_content["produtos"], site_content),
            "../",
            "produtos",
        ),
        FASE2_DIR / "montagem.html": (
            "Monte seu PC | MobilyTech BR",
            montagem_page("../", pages_content["montagem"]),
            "../",
            "montagem",
        ),
        FASE2_DIR / "limpeza.html": (
            "Limpeza de PC | MobilyTech BR",
            limpeza_page("../", pages_content["limpeza"], service_panels),
            "../",
            "limpeza",
        ),
        FASE2_DIR / "avaliacoes.html": (
            "Avaliacoes | MobilyTech BR",
            avaliacoes_page("../"),
            "../",
            "avaliacoes",
        ),
        FASE2_DIR / "minha-conta.html": (
            "Minha conta e pedidos | MobilyTech BR",
            conta_page("../", pages_content["conta"], site_content),
            "../",
            "conta",
        ),
        FASE2_DIR / "contato.html": (
            "Contato | MobilyTech BR",
            contato_page("../"),
            "../",
            "contato",
        ),
        FASE2_DIR / "termos.html": (
            "Termos de Compra | MobilyTech BR",
            legal_page("../", "termos"),
            "../",
            "termos",
        ),
        FASE2_DIR / "privacidade.html": (
            "Politica de Privacidade | MobilyTech BR",
            legal_page("../", "privacidade"),
            "../",
            "privacidade",
        ),
        FASE2_DIR / "trocas-devolucoes.html": (
            "Trocas e Reembolso | MobilyTech BR",
            legal_page("../", "trocas"),
            "../",
            "trocas",
        ),
        FASE2_DIR / "entrega-prazos.html": (
            "Entrega e Prazos | MobilyTech BR",
            legal_page("../", "entrega"),
            "../",
            "entrega",
        ),
        FASE2_DIR / "garantia.html": (
            "Garantia | MobilyTech BR",
            legal_page("../", "garantia"),
            "../",
            "garantia",
        ),
    }
    for path, (title, content, prefix, active) in pages.items():
        path.write_text(html_doc(title, content, prefix, active, products, finalists, addons, swaps, site_content), encoding="utf-8")

    report = ROOT / "docs" / "phase2-ibuy-style-report-2026-06-14.md"
    report.write_text(
        "\n".join(
            [
                "# MobilyTech BR - Fase 2 iBUYPOWER style",
                "",
                f"Gerado em: {GENERATED_AT}",
                "",
                "- Home oficial: `index.html`.",
                "- Preview alternativo preservado: `fase2-hibrida.html`.",
                "- Subpaginas: `fase2/`.",
                "- Visual: estrutura clara inspirada em iBUYPOWER, com conteudo e assets MobilyTech.",
                "- Backend preservado: carrinho chama rotas Vercel de frete, Mercado Pago e Abacate Pay.",
                "- Conta/pedidos: pagina de consulta e atendimento preparada para retirada, envio e acompanhamento.",
                "- Linguagem publica: sem termos de teste, rascunho, dropshipping ou aprovacao interna.",
            ]
        ),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()


