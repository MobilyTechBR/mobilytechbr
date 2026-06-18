from __future__ import annotations

import html
import json
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
FASE2_DIR = ROOT / "fase2"

GENERATED_AT = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

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
            "intro": "Complemente seu setup com acessorios, upgrades e gadgets selecionados pela curadoria MobilyTech.",
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
    return f"{prefix}{str(path or '').replace('./', '')}"


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
    "confidence",
    "productImage",
    "selectedCreative",
    "productId",
    "salePrice",
    "currentPrice",
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
    "featured",
    "swaps",
}


def public_finds_payload(finalists, products=None):
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
        return clean_item

    items = finalists.get("finalists", []) if isinstance(finalists, dict) else []
    product_items = products or []
    finalists_by_product_id = {}
    for item in items:
        for key in (item.get("productId"), f"find-{item.get('id', '')}" if item.get("id") else None):
            if key:
                finalists_by_product_id[key] = item
    public_items = []
    for product in product_items:
        if product.get("active") is False or product.get("category") != "dropshipping":
            continue
        finalist = finalists_by_product_id.get(product.get("id"), {})
        finalist_mode = finalist.get("purchaseMode")
        if finalist_mode == "affiliate" or finalist.get("publicGroup") == "recomendacoes":
            continue
        specs_data = product.get("specs") or {}
        clean_item = {
            "id": product.get("id"),
            "productId": product.get("id"),
            "title": product.get("title"),
            "niche": finalist.get("niche") or specs_data.get("category") or "Setup e tecnologia",
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
            "publicPartnerNote": "Produto selecionado para complementar setups MobilyTech com atendimento humano.",
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


def public_products_payload(products):
    public_items = []
    for item in products:
        if item.get("active") is False:
            continue
        if item.get("category") in {"dropshipping", "affiliate"}:
            continue
        clean_item = {key: item.get(key) for key in PUBLIC_PRODUCT_FIELDS if key in item}
        public_items.append(clean_item)
    return public_items


def page_links(prefix: str) -> dict[str, str]:
    home = f"{prefix}index.html" if prefix else "./index.html"
    base = f"{prefix}fase2/"
    return {
        "home": home,
        "ofertas": f"{base}ofertas.html",
        "montagem": f"{base}montagem.html",
        "limpeza": f"{base}limpeza.html",
        "achados": f"{base}achados.html",
        "avaliacoes": f"{base}avaliacoes.html",
        "conta": f"{base}minha-conta.html",
        "contato": f"{base}contato.html",
    }


def header(prefix: str, active: str = "home", site_content: dict | None = None) -> str:
    links = page_links(prefix)
    google_enabled = feature_enabled(site_content, "auth", "google", True)
    microsoft_enabled = feature_enabled(site_content, "auth", "microsoft", False)
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
    nav = [
        ("ofertas", "Ofertas", "ofertas"),
        ("ofertas", "PC Gamer", "ofertas"),
        ("montagem", "Monte seu PC", "montagem"),
        ("ofertas", "Hardware", "ofertas"),
        ("limpeza", "Limpeza", "limpeza"),
        ("achados", "MobilyTech Finds", "achados"),
        ("avaliacoes", "Avaliacoes", "avaliacoes"),
        ("contato", "Suporte", "contato"),
    ]
    nav_parts = []
    for index, (href_key, label, active_key) in enumerate(nav):
        if index:
            nav_parts.append('<span class="nav-separator" aria-hidden="true">|</span>')
        nav_parts.append(
            f'<a class="nav-link{" active" if active_key == active else ""}" href="{links[href_key]}">{label}</a>'
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
              <a id="accountLogout" href="/api/account?action=logout&returnTo=/" hidden>Sair</a>
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
    return f"""
    <section class="about-strip">
      <div>
        <h2>Sobre a MobilyTech BR</h2>
        <p>A MobilyTech BR trabalha com PCs usados revisados, hardware selecionado, limpeza e montagem sob orcamento. O foco e entregar computador pronto para uso, atendimento claro e garantia explicada antes da compra.</p>
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
        <a href="{links["ofertas"]}">PC Gamer</a>
        <a href="{links["ofertas"]}">Hardware</a>
        <a href="{links["montagem"]}">Monte seu PC</a>
        <a href="{links["limpeza"]}">Limpeza de PC</a>
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
        <a href="{links["contato"]}">Garantia</a>
        <a href="{links["contato"]}">Entrega e retirada</a>
        <a href="{links["contato"]}">Privacidade</a>
        <a href="{links["contato"]}">Termos de uso</a>
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
    configured_product = product_by_id(products, home.get("featuredProductId"))
    if configured_product and configured_product.get("active") is False:
        configured_product = None
    hero_product = configured_product or (pcs[0] if pcs else (products[0] if products else {}))
    hero_image = hero_product.get("cutout") or hero_product.get("image") or "./assets/mobilytech-logo.png"
    hero_specs = hero_product.get("specs", {})
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
    links = page_links(prefix)
    build_panel = panels.get("build", {})
    clean_panel = panels.get("clean", {})
    return f"""
    <main>
      <section class="{' '.join(hero_classes)}" id="inicio"{hero_style}>
        <div class="hero-copy">
          <h1>{clean_text(home.get("title"))}</h1>
          <p>{clean_text(home.get("subtitle"))}</p>
          <div class="hero-actions">
            <a class="btn btn-red" href="{links["ofertas"]}">{clean_text(home.get("primaryLabel"))} <span>&rarr;</span></a>
            <a class="btn btn-white" href="{links["montagem"]}">{clean_text(home.get("secondaryLabel"))}</a>
          </div>
        </div>
        <img class="hero-pc" src="{prefix}{hero_image.replace("./", "")}" alt="{clean_text(hero_product.get("title", "PC MobilyTech"))}">
        <aside class="hero-deal-card">
          <span>{clean_text(home.get("featuredKicker"))}</span>
          <h2>{clean_text(hero_product.get("title", "PC MobilyTech"))}</h2>
          <p>{clean_text(hero_specs.get("memory", "PC revisado"))} &middot; {clean_text(hero_specs.get("storage", "SSD"))}</p>
          <strong>{money(hero_product.get("price"))}</strong>
          <button class="small-link" type="button" data-detail="{clean_text(hero_product.get("id", ""))}">Ver detalhes</button>
        </aside>
      </section>
      <section class="trust-row" aria-label="Diferenciais MobilyTech">
        <article><span>&#128737;</span><strong>Pecas revisadas</strong><small>e testadas antes da venda</small></article>
        <article><span>&#9989;</span><strong>Garantia real</strong><small>14 dias para defeitos</small></article>
        <article><span>&#128666;</span><strong>Envio para todo o Brasil</strong><small>frete calculado no checkout</small></article>
        <article><span>&#128172;</span><strong>Suporte humano</strong><small>pre e pos-compra</small></article>
      </section>
      <section class="section-head" id="ofertas">
        <div>
          <p class="section-kicker">Estoque atual</p>
          <h2>PCs em destaque</h2>
        </div>
        <a href="{links["ofertas"]}">Ver todos os PCs &rarr;</a>
      </section>
      <div class="product-grid compact" id="homePcGrid" data-limit="5"></div>
      <section class="ibp-panels" id="servicos">
        <a class="service-panel service-panel-image service-build-image" href="{links["montagem"]}" aria-label="Solicitar orcamento de montagem de PC">
          <img src="{asset_path(prefix, build_panel.get("image"))}" alt="{clean_text(build_panel.get("alt"))}">
          <span>{clean_text(build_panel.get("label"))}</span>
        </a>
        <a class="service-panel service-panel-image service-clean-image" href="{links["limpeza"]}" aria-label="Agendar limpeza de PC">
          <img src="{asset_path(prefix, clean_panel.get("image"))}" alt="{clean_text(clean_panel.get("alt"))}">
          <span>{clean_text(clean_panel.get("label"))}</span>
        </a>
      </section>
      <section class="section-head" id="hardware">
        <div>
          <p class="section-kicker">Hardware</p>
          <h2>SSD, fonte e upgrades</h2>
        </div>
        <a href="{links["ofertas"]}">Ver hardware &rarr;</a>
      </section>
      <div class="product-grid hardware-grid" id="homeHardwareGrid" data-limit="5"></div>
      <section class="finds-band" id="finds">
        <div class="finds-text">
          <p class="section-kicker">Curadoria MobilyTech</p>
          <h2>MobilyTech Finds</h2>
          <p>Produtos escolhidos para completar setup, manutencao e upgrades. Recomendacoes externas usam Mercado Livre, Amazon, Shopee ou AliExpress.</p>
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
    image = page.get("image") or "./assets/mobilytech-character-cutout.png"
    return f"""
    <main>
      <section class="page-hero page-hero-finds">
        <div>
          <h1>{clean_text(page.get("title"))}</h1>
          <p>{clean_text(page.get("intro"))}</p>
        </div>
        <img src="{asset_path(prefix, image)}" alt="MobilyTech Finds">
      </section>
      <section class="section-head">
        <div>
          <p class="section-kicker">Curadoria MobilyTech</p>
          <h2>Produtos selecionados para completar seu setup</h2>
        </div>
      </section>
      <div class="finds-grid" id="findsGrid" data-group="vendidos"></div>
      <section class="section-head finds-section-head">
        <div>
          <p class="section-kicker">MobilyTech recomenda</p>
          <h2>Boas compras nos marketplaces parceiros</h2>
          <p>Itens que fazem sentido para setup, manutencao e uso diario, com compra feita diretamente no Mercado Livre, Amazon, Shopee ou AliExpress.</p>
        </div>
      </section>
      <div class="finds-grid finds-grid-recommendations" id="findsRecommendedGrid" data-group="recomendacoes"></div>
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
        <article><h2>Garantia</h2><p>Garantia de 14 dias para defeitos preexistentes comprovados, com avaliacao tecnica e suporte direto.</p></article>
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
        <label>Cupom promocional<input id="couponCode" autocomplete="off" placeholder="Digite seu cupom"></label>
        <small id="couponFeedback">Cupons valem para produtos elegiveis; frete e envio direto ficam separados.</small>
      </div>
      <details class="shipping-box">
        <summary>Calcular frete</summary>
        <div class="delivery-choice" id="deliveryChoice"></div>
        <label>CEP<input id="postalCode" inputmode="numeric" placeholder="00000-000"></label>
        <button class="btn btn-dark full" id="quoteShipping" type="button">Calcular frete</button>
        <div id="shippingQuotes" class="shipping-quotes"></div>
      </details>
      <div class="checkout-actions">{checkout_buttons}</div>
      <p class="drawer-note">O pagamento usa as rotas seguras ja configuradas na MobilyTech BR. Frete automatico pelo Melhor Envio quando disponivel.</p>
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
    html{scroll-behavior:smooth}
    body{margin:0;background:#fff;color:var(--ink);font-size:16px;line-height:1.45}
    a{color:inherit;text-decoration:none}
    button,input,textarea{font:inherit}
    img{max-width:100%;display:block}
    .topbar{background:#ececec;border-bottom:1px solid #d8d8d8}
    .topbar-inner{height:44px;max-width:1540px;margin:auto;display:flex;align-items:center;justify-content:center;gap:30px;color:#222;font-size:15px}
    .topbar p{margin:0}.ticker-arrow{border:0;background:transparent;font-size:34px;color:#9ca3af;cursor:pointer}
    .site-header{position:sticky;top:0;z-index:20;background:#fff;box-shadow:0 2px 12px rgba(0,0,0,.08)}
    .nav-shell{max-width:1540px;margin:auto;height:76px;padding:0 22px;display:grid;grid-template-columns:minmax(160px,184px) minmax(620px,1fr) minmax(150px,210px) 44px 52px;align-items:center;gap:10px}
    .brand{display:flex;align-items:center;gap:10px;font-weight:900;white-space:nowrap;min-width:0}.brand img{width:44px;height:44px;object-fit:contain;flex:0 0 auto}.brand span{overflow:hidden;text-overflow:ellipsis}
    .main-nav{display:flex;align-items:center;justify-content:flex-start;gap:6px;min-width:0;scrollbar-width:none}.main-nav::-webkit-scrollbar{display:none}.nav-link{font-size:12.5px;font-weight:900;padding:12px 2px;border-bottom:3px solid transparent;white-space:nowrap}.nav-link:hover,.nav-link.active{border-bottom-color:var(--red);color:#000}.nav-separator{color:#c8ced7;font-weight:1000;line-height:1;user-select:none}
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
    .finds-band{margin:44px 0;padding:34px;border-radius:18px;background:#f7f8fb;display:grid;grid-template-columns:330px 1fr;gap:26px;align-items:center}.finds-text h2{font-size:34px;margin:0 0 12px}.finds-text p{font-weight:800;color:#5f6874}.finds-preview,.finds-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}.finds-preview{grid-template-columns:repeat(3,1fr);gap:16px}.finds-section-head{padding-top:24px;border-top:1px solid var(--line);margin-top:32px}.finds-section-head h2{font-size:32px;margin:0 0 8px}.finds-section-head p{margin:0 0 20px;color:#5f6874;font-weight:850}.find-card{background:#fff;border:1px solid var(--line);border-radius:18px;box-shadow:0 8px 24px rgba(0,0,0,.07);padding:14px;display:flex;flex-direction:column;gap:9px;min-height:398px}.find-media{height:176px;border-radius:14px;background:linear-gradient(180deg,#f5f8fc,#fff);display:grid;place-items:center;overflow:hidden;padding:12px}.find-media img{width:auto;height:auto;max-width:84%;max-height:140px;object-fit:contain;padding:0}.find-card h3{font-size:16px;line-height:1.22;margin:0;min-height:39px}.find-card p{font-size:12.5px;color:#59616d;font-weight:800;line-height:1.45;margin:0}.find-meta{font-size:12px;color:#0b7c72;font-weight:1000}.find-price{font-size:18px;font-weight:1000;text-align:center;color:#101318;margin:2px 0 4px;min-height:24px}.market-actions{margin-top:auto;display:grid;gap:8px}.market-btn{min-height:42px;border-radius:999px;border:1px solid rgba(9,11,16,.88);background:linear-gradient(180deg,#fff8a8 0%,#fff159 58%,#f4d92a 100%);color:#2b2500;font-weight:1000;display:flex;align-items:center;justify-content:center;gap:9px;padding:0 13px;cursor:pointer;text-decoration:none;box-shadow:0 8px 20px rgba(0,0,0,.08),inset 0 1px 0 rgba(255,255,255,.72);transition:.18s transform,.18s box-shadow,.18s filter}.market-btn:hover{transform:translateY(-1px);box-shadow:0 12px 24px rgba(0,0,0,.12),inset 0 1px 0 rgba(255,255,255,.8);filter:saturate(1.04)}.market-btn img{height:25px;width:auto;max-width:82px;object-fit:contain}.market-mobilytech{background:#19f5d0;color:#031014;box-shadow:0 10px 24px rgba(25,245,208,.18)}.market-ml{background:linear-gradient(180deg,#fff8a8 0%,#fff159 58%,#f4d92a 100%);color:#27220a;border-color:#d6bd00}.market-amazon{background:linear-gradient(180deg,#2d4056 0%,#232f3e 54%,#111820 100%);color:#fff;border-color:#ff9900;box-shadow:inset 0 -3px 0 #ff9900,0 8px 20px rgba(35,47,62,.16)}.market-shopee{background:linear-gradient(180deg,#ff714f,#ee4d2d);color:#fff;border-color:#d83a1c}.market-ali{background:linear-gradient(180deg,#ff7655 0%,#ff4e32 55%,#e63222 100%);color:#fff;border-color:#d73524}
    .market-btn{height:46px;min-height:46px;width:100%;display:grid;grid-template-columns:82px 1px minmax(0,1fr);align-items:center;gap:12px;padding:0 16px;border-radius:999px;font-size:15.5px;line-height:1;letter-spacing:0;text-align:center;overflow:hidden}.market-brand{height:100%;display:flex;align-items:center;justify-content:center;min-width:0}.market-brand img{height:auto;max-height:31px;max-width:76px;width:auto;object-fit:contain}.market-sep{width:1px;height:25px;border-radius:999px;background:rgba(255,255,255,.38);box-shadow:1px 0 0 rgba(0,0,0,.16)}.market-label{display:flex;align-items:center;justify-content:center;min-width:0;font-size:15.5px;font-weight:1000;line-height:1;white-space:nowrap}.market-ml{background:linear-gradient(180deg,#fffbd1 0%,#fff159 54%,#f4d20a 100%);border:2px solid #dcc200;color:#22200a;box-shadow:0 10px 20px rgba(230,200,0,.18),inset 0 1px 0 rgba(255,255,255,.9),inset 0 -3px 0 rgba(184,156,0,.2)}.market-ml .market-brand img{max-height:38px;max-width:72px}.market-ml .market-sep{background:rgba(37,33,0,.24);box-shadow:1px 0 0 rgba(255,255,255,.55)}.market-amazon{background:linear-gradient(180deg,#333 0%,#171717 53%,#070707 100%);border:2px solid #f6a21a;color:#fff;box-shadow:0 10px 22px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.14),inset 0 -3px 0 rgba(246,162,26,.42)}.market-amazon .market-brand img{filter:none;max-height:36px;max-width:72px}.market-amazon .market-sep{background:rgba(255,255,255,.22);box-shadow:1px 0 0 rgba(246,162,26,.18)}.market-ali{background:linear-gradient(180deg,#ff3d1d 0%,#ec1506 52%,#c90000 100%);border:2px solid #ff9f1c;color:#fff;box-shadow:0 10px 22px rgba(224,21,8,.24),inset 0 1px 0 rgba(255,255,255,.22),inset 0 -3px 0 rgba(115,0,0,.18)}.market-ali .market-brand img{filter:none;max-height:40px;max-width:78px}.market-ali .market-sep{background:rgba(255,211,109,.48);box-shadow:1px 0 0 rgba(93,0,0,.18)}
    .reviews-head{display:grid;grid-template-columns:1fr auto;align-items:end;text-align:center}.reviews-head div{text-align:center;justify-self:center;max-width:820px;width:100%}.reviews-head .section-kicker,.reviews-head h2,.reviews-head p{text-align:center;margin-left:auto;margin-right:auto}.reviews-grid{display:grid;grid-template-columns:1.1fr repeat(4,1fr);gap:16px;margin-bottom:42px}.score-card,.review-card{background:#fff;border:1px solid var(--line);border-radius:16px;box-shadow:0 8px 24px rgba(0,0,0,.07);padding:26px;text-align:center}.score-card strong{font-size:56px}.stars{color:#ffc400;letter-spacing:.04em;font-size:22px}.review-card p{font-weight:800;color:#424a56}.review-card small{display:block;color:#6b7280;font-weight:900}
    .inline-clean,.split-form,.contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin:44px 0;padding:34px;border-radius:18px;background:#f7f8fb}.inline-clean{grid-template-columns:1.05fr .95fr;background:#f5f6f8;box-shadow:0 16px 42px rgba(16,24,40,.08);padding:22px 24px;align-items:center}.clean-form-visual{display:flex;flex-direction:column;justify-content:center;gap:12px}.clean-form-visual img{width:100%;height:auto;max-height:330px;object-fit:contain;border-radius:18px;box-shadow:0 14px 38px rgba(16,24,40,.08);background:#fff}.clean-page-copy{display:flex;flex-direction:column;gap:16px}.clean-side-image{width:100%;max-height:340px;object-fit:cover;border-radius:18px;box-shadow:0 14px 38px rgba(16,24,40,.08)}.lead-form{display:grid;gap:14px}.inline-clean .lead-form{gap:10px;align-self:center}.lead-form label{font-size:13px;text-transform:uppercase;letter-spacing:.07em;font-weight:1000;color:#5b6470}.lead-form input,.lead-form textarea{width:100%;margin-top:7px;border:1px solid #d8dde7;border-radius:12px;background:#fff;padding:14px 16px;color:#111;font-weight:800;outline:0}.inline-clean .lead-form input{padding:11px 14px}.inline-clean .btn-red{min-height:48px}.lead-form textarea{min-height:110px;resize:vertical}
    .about-strip,.powered-row{max-width:1540px;margin:44px auto 0;padding:32px 22px;border-top:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;gap:28px}.powered-row{display:block}.about-strip h2,.powered-row h2{margin:0 0 8px;font-size:28px}.about-strip p{max-width:980px;color:#5f6874;font-weight:800}.brand-line{display:flex;align-items:center;justify-content:space-between;gap:clamp(16px,2vw,34px);flex-wrap:nowrap;overflow-x:auto;padding:18px 0 6px;scrollbar-width:none;min-width:0;width:100%}.brand-line::-webkit-scrollbar{display:none}.brand-line .brand-logo{height:34px;max-width:116px;width:auto;object-fit:contain;opacity:1;flex:0 0 auto;filter:invert(1) saturate(.2) brightness(.9)}.brand-line .logo-microsoft{filter:none;height:32px;max-width:112px}.brand-line .logo-intel{max-width:88px}.brand-line .logo-kingston,.brand-line .logo-crucial{max-width:120px}
    .footer{max-width:1540px;margin:20px auto 0;padding:36px 22px;display:grid;grid-template-columns:1.7fr repeat(4,1fr);gap:34px;border-top:1px solid var(--line)}.footer h3{font-size:17px;margin:0 0 14px}.footer a{display:block;margin:8px 0;color:#303742;font-weight:800}.footer-brand img{width:52px}.footer-brand strong{display:block;font-size:19px;margin-top:10px}.footer-brand p,.payment-box p{color:#626a76;font-weight:800}.socials{display:flex;gap:12px}.socials img{width:24px;height:24px;object-fit:contain}.payment-icons{display:flex;gap:12px;align-items:center}.payment-icons img{height:26px;width:auto}.copyright{max-width:1540px;margin:0 auto;padding:0 22px 28px;color:#6b7280;font-weight:800}
    .page-hero{min-height:320px;border-radius:0 0 18px 18px;margin-bottom:32px;padding:54px 64px;display:grid;grid-template-columns:1fr 480px;align-items:center;overflow:hidden;background:linear-gradient(90deg,#f5f6f8,#ffffff);position:relative}.page-hero h1{font-size:48px;line-height:1.02;margin:0 0 14px}.page-hero p{font-size:20px;color:#4b5563;font-weight:800;max-width:700px}.page-hero img{justify-self:end;max-height:300px;object-fit:contain;filter:drop-shadow(0 18px 24px rgba(0,0,0,.18))}.page-hero-products{background:linear-gradient(90deg,#f4f4f4,#fff 48%,#e8f5ff)}.page-hero-finds{background:linear-gradient(90deg,#fff7df,#fff 45%,#e7fbff)}.page-hero-build{background:linear-gradient(90deg,#fbe6e6,#fff 46%,#f1f1f1)}.page-hero-clean{background:linear-gradient(90deg,#effbe7,#fff 46%,#e8f5ff)}.page-hero-reviews,.page-hero-contact{grid-template-columns:1fr;background:#f7f8fb}
    .filter-row{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:18px}.filter-chip{border:1px solid var(--line);background:#fff;border-radius:999px;padding:11px 22px;font-weight:1000;cursor:pointer}.filter-chip.active{background:#111;color:#fff}.contact-grid article{background:#fff;border-radius:16px;padding:26px;box-shadow:0 8px 24px rgba(0,0,0,.07)}.contact-grid h2{margin:0 0 8px}.shipping-contact-card{position:relative;overflow:hidden}.shipping-contact-card img{position:absolute;right:18px;top:18px;width:58px;height:58px;object-fit:contain;opacity:.92;filter:drop-shadow(0 8px 14px rgba(0,0,0,.12))}.shipping-contact-card h2,.shipping-contact-card p{max-width:calc(100% - 70px)}
    .page-hero-account{grid-template-columns:1fr;background:linear-gradient(90deg,#e9fbfa,#fff 45%,#e8f5ff)}
    .account-layout{display:grid;grid-template-columns:minmax(0,1.08fr) minmax(360px,.72fr);gap:24px;margin:44px 0;align-items:start}.account-primary,.account-side{display:grid;gap:20px}
    .account-card{background:#fff;border:1px solid var(--line);border-radius:18px;box-shadow:0 10px 30px rgba(13,23,38,.08);padding:28px;min-width:0}
    .account-card-main{background:linear-gradient(135deg,#0b2034 0%,#123f5f 58%,#0b6b78 100%);color:#fff}.account-card h2{font-size:28px;line-height:1.08;margin:0 0 12px}.account-card p{color:#59616d;font-weight:800}.account-card.account-card-main p{color:#dbe7f2}.account-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:20px}.account-card-main .btn-white{background:#fff;color:#111}.outline-account{background:#fff;color:#111;border:2px solid #111}.account-session{margin:18px 0 0;border:1px solid var(--line);border-radius:16px;background:#f8fafc;padding:14px;display:grid;grid-template-columns:54px 1fr;gap:14px;align-items:center}.account-avatar{width:54px;height:54px;border-radius:50%;background:#111;color:#fff;display:grid;place-items:center;font-weight:1000;overflow:hidden}.account-avatar img{width:100%;height:100%;object-fit:cover}.account-session strong{display:block;font-size:18px}.account-session small{display:block;color:#657081;font-weight:850;line-height:1.35}.account-login-options{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}.orders-panel{display:grid;gap:12px;margin-top:16px}.order-card{border:1px solid var(--line);border-radius:16px;background:#fbfcfd;padding:15px;display:grid;gap:8px}.order-card-head{display:flex;justify-content:space-between;gap:12px;align-items:start}.order-card h3{margin:0;font-size:18px}.order-status-pill{border-radius:999px;background:#e9fbfa;color:#087f78;padding:6px 10px;font-size:11px;font-weight:1000;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap}.order-card dl{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:0}.order-card dt{font-size:11px;text-transform:uppercase;letter-spacing:.07em;color:#687182;font-weight:1000}.order-card dd{margin:2px 0 0;font-weight:950;color:#18202b}.secure-note-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:18px}.secure-note-list span{border:1px solid #e4eef8;background:#f8fbff;border-radius:12px;padding:12px;font-size:12px;font-weight:1000;color:#23445f;text-align:center}.whatsapp-btn{background:#18c56f;color:#04140b;box-shadow:0 10px 24px rgba(24,197,111,.18)}.whatsapp-btn img{width:22px;height:22px;object-fit:contain}
    .order-timeline{display:grid;gap:12px;margin:18px 0 0;padding:0;list-style:none}.order-timeline li{display:grid;grid-template-columns:40px 1fr;gap:12px;align-items:start;border:1px solid #edf0f4;border-radius:14px;padding:13px;background:#fbfcfd}.order-timeline b{width:40px;height:40px;border-radius:12px;background:#e9fbfa;color:#087f78;display:grid;place-items:center}.order-timeline strong{display:block;line-height:1.15}.order-timeline small{display:block;color:#626a76;font-weight:800;margin-top:3px}
.cart-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:40}.cart-drawer{position:fixed;top:0;right:0;width:min(460px,100vw);height:100vh;background:#fff;z-index:41;box-shadow:-20px 0 60px rgba(0,0,0,.18);border-left:1px solid var(--line);transform:translateX(105%);visibility:hidden;pointer-events:none;transition:.25s transform,.25s visibility;padding:24px;display:flex;flex-direction:column;gap:18px;overflow:auto}.cart-drawer.open{transform:translateX(0);visibility:visible;pointer-events:auto}.drawer-head{display:flex;justify-content:space-between;align-items:start}.drawer-head small{text-transform:uppercase;letter-spacing:.11em;color:var(--red);font-weight:1000}.drawer-head h2{font-size:34px;margin:0}.close-drawer{border:0;background:#f0f1f4;border-radius:50%;width:38px;height:38px;font-size:28px;cursor:pointer}.drawer-items{display:grid;gap:12px;min-height:46px}.drawer-item{display:grid;grid-template-columns:76px 1fr auto;gap:12px;align-items:start;border:1px solid var(--line);border-radius:14px;padding:12px}.drawer-item img{width:76px;height:76px;object-fit:contain;background:#f6f7fa;border-radius:10px}.drawer-item h3{font-size:14px;line-height:1.2;margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.drawer-item small{display:block;color:#626a76;font-weight:800;margin:4px 0;line-height:1.25}.drawer-total{border-top:1px solid var(--line);padding-top:14px;display:flex;justify-content:space-between;font-size:22px;font-weight:1000}.coupon-box,.shipping-box{border:1px solid var(--line);border-radius:14px;padding:14px}.coupon-box label,.shipping-box label{display:block;margin:0 0 10px;font-weight:1000}.coupon-box input,.shipping-box input{width:100%;padding:12px;border:1px solid var(--line);border-radius:10px}.coupon-box small{display:block;color:#687182;font-size:12px;font-weight:900;line-height:1.35}.shipping-box summary{font-weight:1000;cursor:pointer}.shipping-box label{margin:12px 0}.delivery-choice{display:grid;gap:8px;margin-top:12px}.delivery-choice:empty{display:none}.shipping-quotes{display:grid;gap:8px;margin-top:10px}.shipping-option{border:1px solid var(--line);border-radius:12px;padding:11px 12px;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:12px;cursor:pointer}.shipping-option.is-selected{border-color:#111;background:#f8fafc}.shipping-option.is-muted{background:#f7f8fb;color:#687182}.ship-main{display:flex;align-items:flex-start;gap:9px;min-width:0}.ship-main input{width:auto;margin-top:3px;flex:0 0 auto}.ship-copy{min-width:0}.ship-copy strong{display:block;font-size:14px;line-height:1.22;word-break:normal}.ship-copy small{display:block;margin-top:3px;color:#687182;font-size:12px;font-weight:900}.ship-price{white-space:nowrap;font-size:14px}.checkout-actions{display:grid;gap:10px}.checkout-pay{border:0;color:#111;box-shadow:0 10px 24px rgba(0,0,0,.11);gap:10px}.checkout-pay img{height:26px;max-width:92px;object-fit:contain}.checkout-mercado{background:#fff159;color:#1d2730}.checkout-abacate{background:#18f28b;color:#06130d}.drawer-note{font-size:13px;color:#666;font-weight:800}.toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%) translateY(20px);background:#111;color:#fff;border-radius:999px;padding:12px 22px;font-weight:900;z-index:60;opacity:0;pointer-events:none;transition:.2s}.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
    .product-modal{border:0;border-radius:18px;padding:0;max-width:920px;width:calc(100vw - 40px);box-shadow:0 28px 90px rgba(0,0,0,.28)}.product-modal::backdrop{background:rgba(0,0,0,.45)}#modalBody{padding:28px}.modal-grid{display:grid;grid-template-columns:330px 1fr;gap:28px}.modal-grid img{height:300px;width:100%;object-fit:contain;background:#f6f7fb;border-radius:16px}.modal-grid h2{font-size:28px;margin:0 0 8px}.spec-list{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:16px 0}.spec-list span{background:#f4f6f8;border-radius:10px;padding:10px;font-weight:900;color:#4b5563}.option-box{display:grid;gap:8px;margin:14px 0}.option-box label{display:flex;justify-content:space-between;gap:12px;border:1px solid var(--line);border-radius:10px;padding:10px;font-weight:900;cursor:pointer}
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
      .finds-grid{grid-template-columns:1fr;gap:12px;max-width:360px;margin-inline:auto}
      .finds-band{padding:20px;gap:16px}
      .finds-text h2{font-size:30px;line-height:1.05}
      .finds-text p{font-size:13.5px;line-height:1.45}
      .find-media{height:138px;padding:10px}
      .find-media img{max-height:118px;max-width:84%}
      .find-card{padding:14px;border-radius:16px;min-height:352px}
      .find-card h3{font-size:13.5px;line-height:1.25;min-height:34px}
      .find-card p{font-size:12px;line-height:1.35;overflow-wrap:anywhere}
      .find-price{font-size:16px}
      .find-meta{font-size:10px}
      .market-btn{height:46px;min-height:46px;font-size:15.5px;width:100%;padding:0 16px;grid-template-columns:82px 1px minmax(0,1fr);gap:12px}
      .market-brand img{max-height:31px;max-width:76px}
      .market-ml .market-brand img{max-height:38px;max-width:72px}
      .market-amazon .market-brand img{max-height:36px;max-width:72px}
      .market-ali .market-brand img{max-height:40px;max-width:78px}
      .market-label{font-size:15.5px}
      .market-sep{height:22px}
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
      .cart-drawer{padding:18px;width:100vw}
      .drawer-item{grid-template-columns:68px 1fr 34px}
      .drawer-item img{width:68px;height:68px}
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
    }
    @media (max-width:360px){
      .finds-grid{grid-template-columns:1fr}
      .find-card{max-width:340px;margin-inline:auto}
    }
    """


def js(products, finalists, addons, swaps, site_content: dict | None = None) -> str:
    abacate_enabled = feature_enabled(site_content, "payments", "abacatePay", False)
    checkout_description = "Finalizar compra com frete e Mercado Pago."
    checkout_terms = "carrinho checkout pagamento mercado pago frete correios melhor envio finalizar"
    if abacate_enabled:
        checkout_description = "Finalizar compra com frete, Mercado Pago ou Abacate Pay."
        checkout_terms = "carrinho checkout pagamento mercado pago abacate pay frete correios melhor envio finalizar"
    payloads = {
        "products": public_products_payload(products),
        "finds": public_finds_payload(finalists, products),
        "addons": addons,
        "swaps": swaps,
        "featureFlags": (site_content or {}).get("featureFlags", {}),
    }
    return f"""
    const DATA = {json.dumps(payloads, ensure_ascii=False)};
    const assetBase = document.body.dataset.assetBase || "./";
    const cartKey = "mobilytech-ibuy-cart-v1";
    const couponKey = "mobilytech-coupon-v1";
    let cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
    let activeCouponCode = "";
    try {{ localStorage.removeItem(couponKey); }} catch (error) {{}}
    let selectedShipping = null;
    const LOCAL_PROMOTIONS = [
      {{ code:"MOBMEN", percent:6, eligibleCategories:["pc"], label:"6% OFF em PCs revisados selecionados" }}
    ];
    const $ = (sel, root=document) => root.querySelector(sel);
    const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
    const asset = (path) => assetBase + String(path || "").replace(/^\\.\\//, "");
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
      ofertas: assetBase + "fase2/ofertas.html",
      achados: assetBase + "fase2/achados.html",
      montagem: assetBase + "fase2/montagem.html",
      limpeza: assetBase + "fase2/limpeza.html",
      avaliacoes: assetBase + "fase2/avaliacoes.html",
      conta: assetBase + "fase2/minha-conta.html",
      contato: assetBase + "fase2/contato.html"
    }};
    const SECTION_RESULTS = [
      {{ type:"Secao", icon:"PC", title:"PC Gamer", description:"PCs revisados em estoque com opcionais e carrinho.", href: ROUTES.ofertas + "#catalogGrid", terms:"pc gamer computador ryzen intel oferta catalogo desktop" }},
      {{ type:"Secao", icon:"SSD", title:"Hardware e upgrades", description:"SSDs, fonte e pecas disponiveis para compra.", href: ROUTES.ofertas + "#catalogGrid", terms:"ssd hardware fonte upgrade peca armazenamento sata nvme" }},
      {{ type:"Servico", icon:"$" , title:"Monte seu PC", description:"Orcamento personalizado para montagem sob demanda.", href: ROUTES.montagem, terms:"montagem monte seu pc montar computador orcamento custom personalizado" }},
      {{ type:"Servico", icon:"OK", title:"Limpeza de PC", description:"Agendamento de limpeza, pasta termica e relatorio.", href: ROUTES.limpeza, terms:"limpeza limpar pc pasta termica manutencao agendar relatorio" }},
      {{ type:"Loja", icon:"MT", title:"MobilyTech Finds", description:"Curadoria tech com ofertas selecionadas.", href: ROUTES.achados + "#findsGrid", terms:"mobilytech finds tech oferta mercado livre amazon aliexpress curadoria" }},
      {{ type:"Prova", icon:"5", title:"Avaliacoes", description:"Prova social, OLX, Marketplace e historico de entregas.", href: ROUTES.avaliacoes, terms:"avaliacoes reviews prova social olx facebook marketplace estrelas reputacao" }},
      {{ type:"Conta", icon:"ID", title:"Minha conta e pedidos", description:"Acesso seguro, retirada e acompanhamento do pedido.", href: ROUTES.conta, terms:"minha conta pedido pedidos endereco rastreio retirada status acompanhamento suporte" }},
      {{ type:"Contato", icon:"WA", title:"Contato e suporte", description:"WhatsApp, e-mail, retirada e atendimento humano.", href: ROUTES.contato, terms:"contato suporte whatsapp email instagram retirada vila suzana" }},
      {{ type:"Loja", icon:"C", title:"Carrinho e checkout", description:"{checkout_description}", href: "#cart", terms:"{checkout_terms}" }}
    ];
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
    }}
    function renderAccountMenu() {{
      setLoginLinks();
      const user = accountSession.user || {{}};
      const logged = Boolean(accountSession.authenticated);
      const greeting = $("#accountGreeting");
      const title = $("#accountMenuTitle");
      const status = $("#accountMenuStatus");
      const guest = $("#accountGuestActions");
      const logout = $("#accountLogout");
      if (greeting) greeting.textContent = logged ? `Ola, ${{user.name || user.email || "cliente"}}` : "Conta MobilyTech";
      if (title) title.textContent = logged ? "Central Minha Conta" : "Entre para ver seus pedidos";
      if (status) status.textContent = logged ? String(user.email || "") : "Acesse com Google para acompanhar compras e dados de entrega.";
      if (guest) guest.hidden = logged;
      if (logout) logout.hidden = !logged;
    }}
    function renderAccountPage() {{
      const panel = $("#accountPagePanel");
      const guest = $("#accountPageGuestActions");
      if (!panel) return;
      const user = accountSession.user || {{}};
      if (!accountSession.authenticated) {{
        panel.innerHTML = `<div class="account-avatar" aria-hidden="true">MT</div><div><strong>Voce ainda nao entrou.</strong><small>Use um login seguro para carregar seus pedidos quando eles estiverem disponiveis.</small></div>`;
        if (guest) guest.hidden = false;
        renderOrders([]);
        return;
      }}
      const safePicture = /^https:\\/\\//.test(String(user.picture || "")) ? String(user.picture) : "";
      const avatar = safePicture
        ? `<img src="${{escapeHtml(safePicture)}}" alt="">`
        : initials(user.name, user.email);
      panel.innerHTML = `<div class="account-avatar" aria-hidden="true">${{avatar}}</div><div><strong>${{escapeHtml(user.name || "Cliente MobilyTech")}}</strong><small>${{escapeHtml(user.email || "")}}</small></div>`;
      if (guest) guest.hidden = true;
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
      return [s.processor, s.memory, s.gpu, s.storage, s.brand, s.capacity, s.interface].filter(Boolean).slice(0,4);
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
.filter((item) => item.active !== false && !["finds", "affiliate"].includes(item.category))
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
    function productTotal(item) {{
      const product = productById(item.productId);
      if (!product) return 0;
      const extras = isConfigurablePc(product)
        ? [...(item.selectedAddons || []), ...(item.selectedSwaps || [])].reduce((sum, option) => sum + Number(option.price || 0), 0)
        : 0;
      const quantity = Math.max(1, Number(item.quantity || 1));
      return (Number(product.price || 0) + extras) * quantity;
    }}
    function cartProducts() {{ return cart.map((item) => productById(item.productId)).filter(Boolean); }}
    function isSupplierProduct(product) {{
      const text = norm([product?.category, product?.purchaseMode, product?.fulfillmentMode, product?.shipping?.mode].join(" "));
      return Boolean(product?.manualFulfillment || text.includes("dropshipping") || text.includes("supplier") || text.includes("fornecedor"));
    }}
    function cartHasProduct(productId) {{
      return cart.some((item) => String(item.productId) === String(productId));
    }}
    function canAddCartProduct(productId) {{
      const product = productById(productId);
      if (!product) return false;
      if (!isSupplierProduct(product) && cartHasProduct(productId)) {{
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
    function fixedSupplierShippingQuote(postalCode="") {{
      const rows = cart.map((item) => ({{ item, product: productById(item.productId) }})).filter((row) => row.product && isSupplierProduct(row.product));
      if (!rows.length || rows.length !== cart.length) return null;
      const price = rows.reduce((sum, row) => {{
        const quantity = Math.max(1, Number(row.item.quantity || 1));
        return sum + Number(row.product.shipping?.customerPrice || 0) * quantity;
      }}, 0);
      const deliveryTime = rows.reduce((max, row) => Math.max(max, Number(row.product.shipping?.deliveryTime || 18)), 0) || 18;
      return {{
        id: "supplier-fixed",
        price: Math.round(price * 100) / 100,
        postalCode,
        company: "Fornecedor selecionado",
        carrier: "Fornecedor selecionado",
        name: "Envio direto do fornecedor",
        serviceName: "Envio direto do fornecedor",
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
    function checkoutSubtotal() {{ return cart.reduce((sum, item) => sum + productTotal(item), 0); }}
    function checkoutTotal() {{ return Math.max(0, checkoutSubtotal() - couponDiscount()) + (selectedShipping?.price || 0); }}
    function syncCouponFeedback() {{
      const feedback = $("#couponFeedback");
      if (!feedback) return;
      const typed = ($("#couponCode")?.value || "").trim();
      if (!typed) {{
        feedback.textContent = "Cupons valem para produtos elegiveis; frete e envio direto ficam separados.";
        return;
      }}
      const promo = activePromotion();
      feedback.textContent = promo
        ? `${{promo.label}} aplicado: -${{money(couponDiscount())}}.`
        : "Cupom nao reconhecido. Verifique o codigo ou tente outro cupom.";
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
let products = DATA.products.filter((item) => item.active !== false && !["finds", "affiliate", "dropshipping"].includes(item.category));
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
    function renderFinds(target="#findsGrid", limit=999) {{
      const node = $(target);
      if (!node) return;
      const search = norm($("#siteSearch")?.value || "");
      const group = node.dataset.group;
      let items = DATA.finds.filter((item) => item.affiliateReady !== false);
      if (group) items = items.filter((item) => (item.publicGroup || "vendidos") === group);
      if (search) items = items.filter((item) => norm([item.title, item.whySell, item.niche, item.platform, item.marketplace?.name].join(" ")).includes(search));
      items = items.slice(0, limit);
      const emptyCopy = group === "vendidos"
        ? "Estamos atualizando esta selecao. Veja as ofertas recomendadas abaixo."
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
    function findCard(item) {{
      const market = item.marketplace || {{}};
      const image = asset(item.productImage || item.selectedCreative);
      const logo = asset(marketLogo(market.name || ""));
      const isManual = item.storeCheckout === true;
      const price = item.salePrice ? money(item.salePrice) : (item.currentPrice || "");
      const buttonLabel = "Ver oferta";
      const affiliateLinks = Array.isArray(item.affiliateLinks) ? item.affiliateLinks.filter((link) => link && link.url) : [];
      const linkButton = (link) => {{
        const name = link.name || link.platform || market.name || "Marketplace";
        const className = link.class || marketClass(name);
        const label = "Ver oferta";
        const linkLogo = asset(marketLogo(name));
        return `<a class="market-btn ${{className}}" href="${{link.url}}" target="_blank" rel="noopener"><span class="market-brand"><img src="${{linkLogo}}" alt="" aria-hidden="true"></span><span class="market-sep" aria-hidden="true"></span><span class="market-label">${{label}}</span></a>`;
      }};
      const action = isManual
        ? `<div class="market-actions"><button class="market-btn market-mobilytech" type="button" data-add="${{findProductId(item)}}"><span class="cart-icon" aria-hidden="true">&#128722;</span>Adicionar ao carrinho</button></div>`
        : `<div class="market-actions">${{affiliateLinks.length ? affiliateLinks.map(linkButton).join("") : `<a class="market-btn ${{market.class || ""}}" href="${{item.affiliateUrl || "#achados"}}" target="_blank" rel="noopener"><span class="market-brand"><img src="${{logo}}" alt="" aria-hidden="true"></span><span class="market-sep" aria-hidden="true"></span><span class="market-label">${{buttonLabel}}</span></a>`}}</div>`;
      return `<article class="find-card" id="${{anchorId("find", item.title)}}" data-search="${{item.title}} ${{item.niche}}">
        <div class="find-media"><img src="${{image}}" alt="${{item.title}}"></div>
        <span class="find-meta">${{item.confidence || "Curadoria MobilyTech"}}</span>
        <h3>${{item.title}}</h3>
        <p>${{item.whySell || item.publicPartnerNote || ""}}</p>
        <div class="find-price">${{price}}</div>
        ${{action}}
      </article>`;
    }}
    function addBaseProduct(productId) {{
      if (!canAddCartProduct(productId)) return;
      const product = productById(productId);
      const existing = cart.find((item) => String(item.productId) === String(productId));
      selectedShipping = null;
      if (existing && isSupplierProduct(product)) {{
        existing.quantity = Math.max(1, Number(existing.quantity || 1)) + 1;
      }} else {{
        cart.push({{ productId, selectedAddons: [], selectedSwaps: [], quantity: 1 }});
      }}
      saveCart();
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
      const swapGroups = isPc ? availableSwaps(product) : [];
      const swapHtml = swapGroups.map((group) => group.options.length ? `<div class="option-box"><strong>${{group.label}}</strong>${{group.options.map((option, index) => `<label><span><input type="checkbox" data-swap data-target="${{group.target}}" data-index="${{index}}" data-label="${{option.label}}" data-price="${{option.price}}"> ${{option.label}}</span><b>${{money(option.price)}}</b></label>`).join("")}}</div>` : "").join("");
      const addonHtml = isPc ? DATA.addons.filter((item) => item.active !== false).map((option, index) => `<label><span><input type="checkbox" data-addon data-category="${{option.category}}" data-index="${{index}}" data-label="${{option.label}}" data-price="${{option.price}}"> ${{option.label}}</span><b>+${{money(option.price)}}</b></label>`).join("") : "";
      const configHtml = isPc
        ? `${{swapHtml ? `<h3>Trocas disponiveis</h3>${{swapHtml}}` : ""}}${{addonHtml ? `<h3>Adicionais</h3><div class="option-box">${{addonHtml}}</div>` : ""}}<button class="btn btn-red full" type="button" data-add-config="${{product.id}}"><span aria-hidden="true">&#128722;</span> Adicionar configurado</button>`
        : `<button class="btn btn-red full" type="button" data-add="${{product.id}}"><span aria-hidden="true">&#128722;</span> Adicionar ao carrinho</button>`;
      body.innerHTML = `<div class="modal-grid">
        <img src="${{asset(product.cutout || product.image)}}" alt="${{product.title}}">
        <div>
          <h2>${{product.title}}</h2>
          <p class="price">${{money(product.price)}}</p>
          <div class="spec-list">${{specItems}}</div>
          ${{configHtml}}
        </div>
      </div>`;
      modal?.showModal();
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
      $("#cartTotal") && ($("#cartTotal").textContent = money(checkoutTotal()));
      const items = $("#cartItems");
      if (!items) return;
      if (!cart.length) {{
        items.innerHTML = '<p class="empty">Seu carrinho ainda esta vazio.</p>';
        renderDeliveryChoice();
        syncCouponFeedback();
        return;
      }}
      const cartRows = cart.map((item, index) => {{
        const product = productById(item.productId);
        if (!product) return "";
        const options = [...(item.selectedAddons || []), ...(item.selectedSwaps || [])].map((o) => o.label).join(" + ");
        const quantity = Math.max(1, Number(item.quantity || 1));
        const quantityLabel = quantity > 1 ? `Qtd. ${{quantity}}` : "";
        return `<article class="drawer-item">
          <img src="${{asset(product.cutout || product.image)}}" alt="">
          <div><h3>${{product.title}}</h3><small>${{[options || "Sem opcionais", quantityLabel].filter(Boolean).join(" - ")}}</small><strong>${{money(productTotal(item))}}</strong></div>
          <button class="close-drawer" type="button" data-remove="${{index}}" aria-label="Remover">&times;</button>
        </article>`;
      }}).join("");
      const discountRow = discount > 0
        ? `<article class="drawer-item drawer-adjustment"><div></div><div><h3>Cupom ${{activePromotion().code}}</h3><small>${{activePromotion().label}}</small></div><strong>-${{money(discount)}}</strong></article>`
        : "";
      const shippingRow = shippingPrice > 0
        ? `<article class="drawer-item drawer-adjustment"><div></div><div><h3>Frete selecionado</h3><small>${{selectedShipping.carrier || selectedShipping.company || "Entrega"}} - ${{selectedShipping.serviceName || selectedShipping.name || "servico"}}</small></div><strong>${{money(shippingPrice)}}</strong></article>`
        : "";
      items.innerHTML = cartRows + discountRow + shippingRow;
      renderDeliveryChoice();
      syncCouponFeedback();
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
        node.innerHTML = '<div class="shipping-option is-muted"><span class="ship-copy"><strong>Envio obrigatorio para MobilyTech Finds</strong><small>Informe o CEP e selecione o envio direto com rastreio; retirada local nao se aplica.</small></span></div>';
        return;
      }}
      if (state.supplier && state.physical) {{
        node.innerHTML = '<div class="shipping-option is-muted"><span class="ship-copy"><strong>Carrinho misto</strong><small>Itens fisicos usam Melhor Envio ou retirada; MobilyTech Finds usa envio direto no mesmo calculo.</small></span></div>';
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
      const fixedSupplierQuote = state.supplier && !state.physical ? fixedSupplierShippingQuote(postalCode) : null;
      if (fixedSupplierQuote) {{
        renderFixedSupplierShipping(box, fixedSupplierQuote);
        return;
      }}
      try {{
        const response = await fetch("/api/shipping-quote", {{
          method: "POST",
          headers: {{ "Content-Type": "application/json" }},
          body: JSON.stringify({{ cartItems: cart, postalCode }})
        }});
        const data = await response.json();
        if (!response.ok || !Array.isArray(data.quotes)) throw new Error(data.error || "Frete indisponivel agora.");
        box.innerHTML = data.quotes.map((quote, index) => {{
          const company = typeof quote.company === "string"
            ? quote.company
            : (quote.company?.name || quote.company_name || "Transportadora");
          const service = quote.name || quote.service || quote.service_name || "Servico";
          const rawTime = quote.deliveryTime || quote.delivery_time || "";
          const time = rawTime ? `${{rawTime}} dia(s) uteis` : "prazo sob consulta";
          return `<label class="shipping-option">
            <span class="ship-main">
              <input type="radio" name="shipping" data-index="${{index}}">
              <span class="ship-copy"><strong>${{company}} - ${{service}}</strong><small>${{time}}</small></span>
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
        const fallbackQuote = state.supplier && !state.physical ? fixedSupplierShippingQuote(postalCode) : null;
        if (fallbackQuote) renderFixedSupplierShipping(box, fallbackQuote);
        else box.innerHTML = `<p>${{error.message}}</p>`;
      }}
    }}
    async function startCheckout(endpoint, button) {{
      if (!cart.length) return showToast("Seu carrinho esta vazio.");
      const original = button.innerHTML;
      button.innerHTML = "Abrindo checkout...";
      button.disabled = true;
      try {{
        const response = await fetch(endpoint, {{
          method: "POST",
          headers: {{ "Content-Type": "application/json" }},
          body: JSON.stringify({{ cartItems: cart, shipping: selectedShipping, coupon: couponPayload() }})
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
      const remove = event.target.closest("[data-remove]");
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
      if (remove) {{ cart.splice(Number(remove.dataset.remove), 1); selectedShipping = null; saveCart(); }}
    }});
    $("#cartButton")?.addEventListener("click", openCart);
    $("#closeCart")?.addEventListener("click", closeCart);
    $("#cartBackdrop")?.addEventListener("click", closeCart);
    $("#quoteShipping")?.addEventListener("click", quoteShipping);
    $("#checkoutMercado")?.addEventListener("click", (e) => startCheckout("/api/create-preference", e.currentTarget));
    $("#checkoutAbacate")?.addEventListener("click", (e) => startCheckout("/api/create-abacate-checkout", e.currentTarget));
    if ($("#couponCode")) $("#couponCode").value = activeCouponCode;
    $("#couponCode")?.addEventListener("input", (event) => {{
      activeCouponCode = event.currentTarget.value || "";
      try {{ localStorage.removeItem(couponKey); }} catch (error) {{}}
      renderCart();
    }});
    $$("#buildForm").forEach((form) => form.addEventListener("submit", (e) => {{ e.preventDefault(); submitLead(form, "build"); }}));
    $$("#cleanForm, #cleanFormInline").forEach((form) => form.addEventListener("submit", (e) => {{ e.preventDefault(); submitLead(form, "clean"); }}));
    $("#orderLookupForm")?.addEventListener("submit", (e) => {{ e.preventDefault(); submitOrderLookup(e.currentTarget); }});
    applyUrlSearch();
    $("#siteSearch")?.addEventListener("input", () => {{
      renderSearchResults();
      renderProducts("#homePcGrid", "pc", Number($("#homePcGrid")?.dataset.limit || 999));
      renderProducts("#homeHardwareGrid", "hardware", Number($("#homeHardwareGrid")?.dataset.limit || 999));
      renderProducts("#catalogGrid", window.currentFilter || "all");
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
    <link rel="icon" href="{prefix}assets/favicon.png">
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
