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


def page_links(prefix: str) -> dict[str, str]:
    home = f"{prefix}fase2-hibrida.html" if prefix else "./fase2-hibrida.html"
    base = f"{prefix}fase2/"
    return {
        "home": home,
        "ofertas": f"{base}ofertas.html",
        "montagem": f"{base}montagem.html",
        "limpeza": f"{base}limpeza.html",
        "achados": f"{base}achados.html",
        "avaliacoes": f"{base}avaliacoes.html",
        "contato": f"{base}contato.html",
    }


def header(prefix: str, active: str = "home") -> str:
    links = page_links(prefix)
    nav = [
        ("ofertas", "Ofertas"),
        ("ofertas", "PC Gamer"),
        ("montagem", "Monte seu PC"),
        ("ofertas", "Hardware"),
        ("limpeza", "Limpeza"),
        ("achados", "MobilyTech Finds"),
        ("avaliacoes", "Avaliacoes"),
        ("contato", "Suporte"),
    ]
    nav_html = "\n".join(
        f'<a class="nav-link{" active" if key == active else ""}" href="{links[key]}">{label}</a>'
        for key, label in nav
    )
    return f"""
    <header class="site-header">
      <div class="topbar">
        <div class="topbar-inner">
          <button class="ticker-arrow" type="button" aria-label="Promocao anterior">&#8249;</button>
          <p>Julho Tech MobilyTech: PCs revisados, upgrades e limpeza com atendimento humano.</p>
          <button class="ticker-arrow" type="button" aria-label="Proxima promocao">&#8250;</button>
        </div>
      </div>
      <div class="nav-shell">
        <a class="brand" href="{links["home"]}" aria-label="MobilyTech BR">
          <img src="{prefix}assets/mobilytech-logo.png" alt="MobilyTech BR">
          <span>MobilyTech BR</span>
        </a>
        <nav class="main-nav" aria-label="Navegacao principal">{nav_html}</nav>
        <label class="search-pill">
          <span aria-hidden="true">&#128269;</span>
          <input id="siteSearch" type="search" placeholder="Buscar PCs, SSDs, limpeza...">
        </label>
        <button class="icon-action" type="button" aria-label="Conta">
          <span aria-hidden="true">&#9787;</span>
        </button>
        <button class="cart-mini" id="cartButton" type="button" aria-label="Abrir carrinho">
          <span aria-hidden="true">&#128722;</span>
          <strong id="cartCount">0</strong>
        </button>
      </div>
    </header>
    """


def footer(prefix: str) -> str:
    links = page_links(prefix)
    brand_logos = "\n".join(
        f'<img src="{prefix}assets/brand-officials/{brand_id}.svg" alt="{name}">'
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
        <p>Mercado Pago, Abacate Pay, Pix e demais opcoes disponiveis no checkout.</p>
        <div class="payment-icons">
          <img src="{prefix}assets/mercado-pago-icon.png" alt="Mercado Pago">
          <img src="{prefix}assets/abacate-pay-logo.svg" alt="Abacate Pay">
        </div>
      </div>
    </footer>
    <p class="copyright">&copy; 2026 MobilyTech BR. Vila Suzana, Sao Paulo, SP.</p>
    """


def product_seed(products):
    pcs = [item for item in products if item.get("active") is not False and item.get("category") == "pc"]
    hardware = [item for item in products if item.get("active") is not False and item.get("category") != "pc"]
    return pcs, hardware


def home_main(products, finalists, prefix: str) -> str:
    pcs, hardware = product_seed(products)
    hero_product = pcs[0] if pcs else (products[0] if products else {})
    hero_image = hero_product.get("cutout") or hero_product.get("image") or "./assets/mobilytech-logo.png"
    hero_specs = hero_product.get("specs", {})
    links = page_links(prefix)
    return f"""
    <main>
      <section class="hero-slider" id="inicio">
        <div class="hero-copy">
          <h1>PCs revisados para jogar, trabalhar e criar.</h1>
          <p>Computadores testados por especialistas, upgrades sob medida e atendimento direto da MobilyTech BR.</p>
          <div class="hero-actions">
            <a class="btn btn-red" href="{links["ofertas"]}">Ver catalogo de PCs <span>&rarr;</span></a>
            <a class="btn btn-white" href="{links["montagem"]}">Monte seu PC</a>
          </div>
        </div>
        <img class="hero-pc" src="{prefix}{hero_image.replace("./", "")}" alt="{clean_text(hero_product.get("title", "PC MobilyTech"))}">
        <aside class="hero-deal-card">
          <span>Em destaque</span>
          <h2>{clean_text(hero_product.get("title", "PC MobilyTech"))}</h2>
          <p>{clean_text(hero_specs.get("memory", "PC revisado"))} &middot; {clean_text(hero_specs.get("storage", "SSD"))}</p>
          <strong>{money(hero_product.get("price"))}</strong>
          <button class="small-link" type="button" data-detail="{clean_text(hero_product.get("id", ""))}">Ver detalhes</button>
        </aside>
      </section>
      <section class="trust-row" aria-label="Diferenciais MobilyTech">
        <article><span>&#128737;</span><strong>Pecas revisadas</strong><small>e testadas antes da venda</small></article>
        <article><span>&#9989;</span><strong>Garantia real</strong><small>14 dias para defeitos</small></article>
        <article><span>&#128666;</span><strong>Envio para o Brasil</strong><small>frete calculado no checkout</small></article>
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
        <article class="service-panel service-build">
          <div>
            <h2>Monte seu PC</h2>
            <p>Orcamento personalizado com pecas compativeis, objetivo claro e revisao antes da entrega.</p>
            <a class="outline-light" href="{links["montagem"]}">Solicitar orcamento</a>
          </div>
          <img src="{prefix}assets/assembly-pc-build-cutout.png" alt="Montagem de PC MobilyTech">
        </article>
        <article class="service-panel service-clean">
          <div>
            <h2>Limpeza de PC</h2>
            <p>Limpeza, troca de pasta termica e relatorio visual do antes/depois para manter seu computador em ordem.</p>
            <a class="outline-dark" href="{links["limpeza"]}">Agendar limpeza</a>
          </div>
          <img src="{prefix}assets/pc-cleaning-service-cutout.png" alt="Limpeza de PC MobilyTech">
        </article>
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
          <p>Produtos escolhidos para completar setup, manutencao e upgrades, com compra por marketplace confiavel.</p>
          <a class="btn btn-dark" href="{links["achados"]}">Ver selecionados</a>
        </div>
        <div class="finds-preview" id="homeFindsGrid" data-limit="3"></div>
      </section>
      {reviews_section(links["avaliacoes"])}
      {cleaning_inline_form()}
    </main>
    """


def products_page(title: str, intro: str, prefix: str) -> str:
    return f"""
    <main>
      <section class="page-hero page-hero-products">
        <div>
          <h1>{title}</h1>
          <p>{intro}</p>
        </div>
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


def finds_page(prefix: str) -> str:
    return """
    <main>
      <section class="page-hero page-hero-finds">
        <div>
          <h1>MobilyTech Finds</h1>
          <p>Achados de tecnologia para complementar seu setup, com descricao direta e link de compra no marketplace parceiro.</p>
        </div>
        <img src="../assets/mobilytech-character-cutout.png" alt="Personagem MobilyTech">
      </section>
      <section class="section-head">
        <div>
          <p class="section-kicker">Produtos selecionados</p>
          <h2>Complementos para setup, limpeza e upgrades</h2>
        </div>
      </section>
      <div class="finds-grid" id="findsGrid"></div>
    </main>
    """


def montagem_page(prefix: str) -> str:
    return """
    <main>
      <section class="page-hero page-hero-build">
        <div>
          <h1>Monte seu PC com a MobilyTech BR</h1>
          <p>Conte o objetivo, o orcamento e o que voce ja tem. A gente monta uma proposta coerente, sem empurrar peca desnecessaria.</p>
        </div>
        <img src="../assets/assembly-pc-build-cutout.png" alt="Montagem de PC">
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


def limpeza_page(prefix: str) -> str:
    return """
    <main>
      <section class="page-hero page-hero-clean">
        <div>
          <h1>Limpeza e relatorio do PC</h1>
          <p>Servico de limpeza com cuidado, organizacao e registro visual do antes/depois para manter o computador confiavel.</p>
        </div>
        <img src="../assets/pc-cleaning-service-cutout.png" alt="Limpeza de PC">
      </section>
      <section class="split-form">
        <div class="form-copy">
          <p class="section-kicker">Servico especializado</p>
          <h2>Limpeza completa do seu PC</h2>
          <ul>
            <li>Remocao de poeira e limpeza visual.</li>
            <li>Troca de pasta termica quando combinada.</li>
            <li>Relatorio do estado do computador.</li>
          </ul>
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
          <div class="stars">★★★★★</div>
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
          <div class="stars">★★★★★</div>
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
        <article><h2>Garantia</h2><p>Garantia de 14 dias para defeitos preexistentes comprovados, com avaliacao tecnica e suporte direto.</p></article>
      </section>
    </main>
    """


def cleaning_inline_form() -> str:
    return """
      <section class="inline-clean">
        <div>
          <p class="section-kicker">Servico especializado</p>
          <h2>Agende sua limpeza</h2>
          <p>Preencha os dados e a MobilyTech BR entra em contato para combinar visita, retirada ou entrega.</p>
        </div>
        <form class="lead-form compact-form" id="cleanFormInline">
          <label>Nome<input name="name" placeholder="Seu nome" required></label>
          <label>E-mail<input name="email" type="email" placeholder="seu@email.com"></label>
          <label>WhatsApp<input name="phone" placeholder="(DDD) 9XXXX-XXXX" required></label>
          <button class="btn btn-red full" type="submit">Agendar limpeza</button>
        </form>
      </section>
    """


def cart_drawer(prefix: str) -> str:
    return f"""
    <div class="cart-backdrop" id="cartBackdrop" hidden></div>
    <aside class="cart-drawer" id="cartDrawer" aria-label="Carrinho" aria-hidden="true">
      <div class="drawer-head">
        <div><small>Loja online</small><h2>Carrinho</h2></div>
        <button class="close-drawer" id="closeCart" type="button" aria-label="Fechar">&times;</button>
      </div>
      <div id="cartItems" class="drawer-items"></div>
      <div class="drawer-total"><span>Total</span><strong id="cartTotal">R$ 0,00</strong></div>
      <details class="shipping-box">
        <summary>Calcular frete</summary>
        <label>CEP<input id="postalCode" inputmode="numeric" placeholder="00000-000"></label>
        <button class="btn btn-dark full" id="quoteShipping" type="button">Calcular frete</button>
        <div id="shippingQuotes" class="shipping-quotes"></div>
      </details>
      <div class="checkout-actions">
        <button class="btn btn-red full" id="checkoutMercado" type="button">Pagar pelo Mercado Pago</button>
        <button class="btn btn-dark full" id="checkoutAbacate" type="button">Pagar pelo Abacate Pay</button>
      </div>
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
    .nav-shell{max-width:1540px;margin:auto;height:76px;padding:0 22px;display:grid;grid-template-columns:minmax(178px,210px) minmax(520px,1fr) minmax(220px,360px) 44px 68px;align-items:center;gap:18px}
    .brand{display:flex;align-items:center;gap:10px;font-weight:900;white-space:nowrap;min-width:0}.brand img{width:44px;height:44px;object-fit:contain;flex:0 0 auto}.brand span{overflow:hidden;text-overflow:ellipsis}
    .main-nav{display:flex;align-items:center;justify-content:flex-start;gap:18px;min-width:0;scrollbar-width:none}.main-nav::-webkit-scrollbar{display:none}.nav-link{font-size:15px;font-weight:900;padding:12px 2px;border-bottom:3px solid transparent;white-space:nowrap}.nav-link:hover,.nav-link.active{border-bottom-color:var(--red);color:#000}
    .search-pill{height:44px;border-radius:999px;background:#f0f1f3;display:flex;align-items:center;gap:10px;padding:0 16px;color:#111}.search-pill input{border:0;background:transparent;outline:0;min-width:0;width:100%;font-weight:700}
    .icon-action,.cart-mini{height:44px;border:0;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer}.icon-action{font-size:28px}.cart-mini{gap:4px;font-size:28px;position:relative}.cart-mini strong{position:absolute;top:0;right:0;min-width:20px;height:20px;border-radius:20px;background:var(--cyan);color:#061015;font-size:12px;display:grid;place-items:center}
    main{max-width:1540px;margin:auto;padding:0 22px 36px}.hero-slider{min-height:420px;margin:0 auto 28px;border-radius:0 0 16px 16px;background:linear-gradient(90deg,#1788e8 0%,#2f9cf2 43%,#89d2ff 100%);position:relative;overflow:hidden;display:grid;grid-template-columns:1fr 1.2fr 280px;align-items:center;padding:48px 62px;color:#fff}
    .hero-slider:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 16% 84%,rgba(255,255,255,.26),transparent 26%),radial-gradient(circle at 82% 20%,rgba(255,255,255,.25),transparent 20%);pointer-events:none}
    .hero-copy{position:relative;z-index:2;max-width:620px}.hero-copy h1{font-size:48px;line-height:1.02;margin:0 0 18px;font-weight:1000;letter-spacing:0}.hero-copy p{font-size:21px;font-weight:800;margin:0 0 26px;max-width:620px}
    .hero-actions{display:flex;gap:16px;flex-wrap:wrap}.btn{border:0;border-radius:999px;min-height:50px;padding:0 28px;display:inline-flex;align-items:center;justify-content:center;gap:12px;font-weight:1000;cursor:pointer;transition:.2s transform,.2s box-shadow}.btn:hover{transform:translateY(-2px);box-shadow:0 12px 30px rgba(0,0,0,.16)}.btn-red{background:var(--red);color:#fff}.btn-white{background:#fff;color:#111}.btn-dark{background:#111;color:#fff}.full{width:100%}
    .hero-pc{position:relative;z-index:1;justify-self:center;max-height:390px;object-fit:contain;filter:drop-shadow(0 0 0 #fff) drop-shadow(7px 10px 0 rgba(255,255,255,.92)) drop-shadow(0 24px 40px rgba(0,0,0,.34))}
    .hero-deal-card{position:relative;z-index:2;background:rgba(255,255,255,.92);color:#111;border-radius:14px;padding:24px;box-shadow:var(--shadow);align-self:center}.hero-deal-card span{font-weight:1000;color:var(--red);text-transform:uppercase;font-size:12px}.hero-deal-card h2{font-size:22px;line-height:1.14;margin:10px 0}.hero-deal-card p{color:#555;font-weight:800}.hero-deal-card strong{font-size:28px;display:block;margin:12px 0}.small-link{border:2px solid #111;background:transparent;border-radius:999px;padding:10px 18px;font-weight:1000;cursor:pointer}
    .trust-row{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:1px solid var(--line);border-radius:14px;overflow:hidden;margin:0 0 36px;background:#fff;box-shadow:0 10px 30px rgba(0,0,0,.06)}.trust-row article{display:grid;grid-template-columns:46px 1fr;grid-template-rows:auto auto;gap:2px 12px;align-items:center;padding:22px 28px;border-right:1px solid var(--line)}.trust-row article:last-child{border-right:0}.trust-row span{grid-row:1/3;width:42px;height:42px;border-radius:12px;background:#e9fbfa;color:#048b82;display:grid;place-items:center;font-size:24px}.trust-row strong{font-size:17px}.trust-row small{color:#69717c;font-weight:800}
    .section-head{display:flex;align-items:end;justify-content:space-between;gap:20px;margin:36px 0 18px}.section-head h2{font-size:34px;margin:0;line-height:1.08}.section-head p{max-width:760px;color:#626a76;font-weight:800}.section-head a{font-weight:1000;color:#0d6fca}.section-kicker{margin:0 0 8px;color:var(--red);font-size:14px;text-transform:uppercase;letter-spacing:.11em;font-weight:1000}
    .product-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:18px}.catalog-grid{grid-template-columns:repeat(4,minmax(0,1fr))}.hardware-grid{grid-template-columns:repeat(5,minmax(0,1fr))}
    .product-card{background:#fff;border:1px solid #e6e8ee;border-radius:16px;box-shadow:0 10px 28px rgba(13,23,38,.08);overflow:hidden;display:flex;flex-direction:column;min-height:100%}.product-media{height:190px;background:linear-gradient(180deg,#f5fbff,#fff);display:grid;place-items:center;padding:18px;position:relative}.product-media img{width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 18px 16px rgba(0,0,0,.18))}.product-card .badge{position:absolute;top:12px;left:12px;background:#dff9f7;color:#047d74;border-radius:999px;padding:7px 12px;font-size:12px;font-weight:1000}.product-body{padding:18px;display:flex;flex-direction:column;gap:10px;flex:1}.product-card h3{font-size:18px;line-height:1.22;margin:0;font-weight:1000;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.spec-line{color:#58606c;font-weight:800;font-size:14px;min-height:40px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.price{font-size:23px;font-weight:1000}.old-price{text-decoration:line-through;color:#8b93a0;font-size:14px;margin-right:8px}.installment{color:#0d8f70;font-weight:1000;font-size:13px}.card-actions{display:grid;gap:9px;margin-top:auto}.ghost-btn{border:2px solid #111;border-radius:999px;background:#fff;color:#111;height:42px;font-weight:1000;cursor:pointer}.cart-btn{border:0;border-radius:999px;background:#111;color:#fff;height:42px;font-weight:1000;cursor:pointer}
    .ibp-panels{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin:44px 0 20px}.service-panel{min-height:330px;border-radius:18px;padding:44px 42px;overflow:hidden;position:relative;display:flex;align-items:center}.service-panel div{position:relative;z-index:2;max-width:410px}.service-panel h2{font-size:36px;line-height:1.05;margin:0 0 14px}.service-panel p{font-size:18px;font-weight:800}.service-panel img{position:absolute;right:0;bottom:0;width:52%;max-height:95%;object-fit:contain;filter:drop-shadow(0 20px 22px rgba(0,0,0,.25))}.service-build{background:linear-gradient(110deg,#e51b1b,#a9080a);color:#fff}.service-clean{background:linear-gradient(110deg,#effbe7,#e1f2ff);color:#101820}.outline-light,.outline-dark{display:inline-flex;align-items:center;justify-content:center;height:52px;border-radius:999px;padding:0 26px;font-weight:1000}.outline-light{border:2px solid #fff;color:#fff}.outline-dark{border:2px solid #111;color:#111;background:#fff}
    .finds-band{margin:44px 0;padding:34px;border-radius:18px;background:#f7f8fb;display:grid;grid-template-columns:330px 1fr;gap:26px;align-items:center}.finds-text h2{font-size:34px;margin:0 0 12px}.finds-text p{font-weight:800;color:#5f6874}.finds-preview{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.find-card{background:#fff;border:1px solid var(--line);border-radius:16px;box-shadow:0 8px 24px rgba(0,0,0,.07);padding:14px;display:flex;flex-direction:column;gap:10px}.find-media{height:160px;border-radius:12px;background:#f4f7fb;display:grid;place-items:center;overflow:hidden}.find-media img{width:100%;height:100%;object-fit:contain;padding:12px}.find-card h3{font-size:17px;line-height:1.22;margin:0}.find-card p{font-size:13px;color:#59616d;font-weight:800}.find-meta{font-size:12px;color:#0b7c72;font-weight:1000}.market-btn{margin-top:auto;min-height:42px;border-radius:999px;border:0;background:linear-gradient(90deg,#fff159,#ffe000);color:#2b2b2b;font-weight:1000;display:flex;align-items:center;justify-content:center;gap:8px;padding:0 13px}.market-btn img{height:24px;width:auto;max-width:58px;object-fit:contain}
    .reviews-grid{display:grid;grid-template-columns:1.1fr repeat(4,1fr);gap:16px;margin-bottom:42px}.score-card,.review-card{background:#fff;border:1px solid var(--line);border-radius:16px;box-shadow:0 8px 24px rgba(0,0,0,.07);padding:26px}.score-card strong{font-size:56px}.stars{color:#ffc400;letter-spacing:.04em;font-size:22px}.review-card p{font-weight:800;color:#424a56}.review-card small{display:block;color:#6b7280;font-weight:900}
    .inline-clean,.split-form,.contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin:44px 0;padding:34px;border-radius:18px;background:#f7f8fb}.lead-form{display:grid;gap:14px}.lead-form label{font-size:13px;text-transform:uppercase;letter-spacing:.07em;font-weight:1000;color:#5b6470}.lead-form input,.lead-form textarea{width:100%;margin-top:7px;border:1px solid #d8dde7;border-radius:12px;background:#fff;padding:14px 16px;color:#111;font-weight:800;outline:0}.lead-form textarea{min-height:110px;resize:vertical}
    .about-strip,.powered-row{max-width:1540px;margin:44px auto 0;padding:32px 22px;border-top:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;gap:28px}.about-strip h2,.powered-row h2{margin:0 0 8px;font-size:28px}.about-strip p{max-width:980px;color:#5f6874;font-weight:800}.brand-line{display:flex;align-items:center;gap:32px;flex-wrap:nowrap;overflow-x:auto;padding:8px 0;scrollbar-width:none}.brand-line::-webkit-scrollbar{display:none}.brand-line img{height:34px;max-width:128px;width:auto;object-fit:contain;filter:grayscale(1);flex:0 0 auto}
    .footer{max-width:1540px;margin:20px auto 0;padding:36px 22px;display:grid;grid-template-columns:1.7fr repeat(4,1fr);gap:34px;border-top:1px solid var(--line)}.footer h3{font-size:17px;margin:0 0 14px}.footer a{display:block;margin:8px 0;color:#303742;font-weight:800}.footer-brand img{width:52px}.footer-brand strong{display:block;font-size:19px;margin-top:10px}.footer-brand p,.payment-box p{color:#626a76;font-weight:800}.socials{display:flex;gap:12px}.socials img{width:24px;height:24px;object-fit:contain}.payment-icons{display:flex;gap:12px;align-items:center}.payment-icons img{height:26px;width:auto}.copyright{max-width:1540px;margin:0 auto;padding:0 22px 28px;color:#6b7280;font-weight:800}
    .page-hero{min-height:320px;border-radius:0 0 18px 18px;margin-bottom:32px;padding:54px 64px;display:grid;grid-template-columns:1fr 480px;align-items:center;overflow:hidden;background:linear-gradient(90deg,#f5f6f8,#ffffff);position:relative}.page-hero h1{font-size:48px;line-height:1.02;margin:0 0 14px}.page-hero p{font-size:20px;color:#4b5563;font-weight:800;max-width:700px}.page-hero img{justify-self:end;max-height:300px;object-fit:contain;filter:drop-shadow(0 18px 24px rgba(0,0,0,.18))}.page-hero-products{background:linear-gradient(90deg,#f4f4f4,#fff 48%,#e8f5ff)}.page-hero-finds{background:linear-gradient(90deg,#fff7df,#fff 45%,#e7fbff)}.page-hero-build{background:linear-gradient(90deg,#fbe6e6,#fff 46%,#f1f1f1)}.page-hero-clean{background:linear-gradient(90deg,#effbe7,#fff 46%,#e8f5ff)}.page-hero-reviews,.page-hero-contact{grid-template-columns:1fr;background:#f7f8fb}
    .filter-row{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:18px}.filter-chip{border:1px solid var(--line);background:#fff;border-radius:999px;padding:11px 22px;font-weight:1000;cursor:pointer}.filter-chip.active{background:#111;color:#fff}.contact-grid article{background:#fff;border-radius:16px;padding:26px;box-shadow:0 8px 24px rgba(0,0,0,.07)}.contact-grid h2{margin:0 0 8px}
    .cart-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:40}.cart-drawer{position:fixed;top:0;right:0;width:min(460px,100vw);height:100vh;background:#fff;z-index:41;box-shadow:-20px 0 60px rgba(0,0,0,.18);transform:translateX(105%);transition:.25s transform;padding:24px;display:flex;flex-direction:column;gap:18px;overflow:auto}.cart-drawer.open{transform:translateX(0)}.drawer-head{display:flex;justify-content:space-between;align-items:start}.drawer-head small{text-transform:uppercase;letter-spacing:.11em;color:var(--red);font-weight:1000}.drawer-head h2{font-size:34px;margin:0}.close-drawer{border:0;background:#f0f1f4;border-radius:50%;width:38px;height:38px;font-size:28px;cursor:pointer}.drawer-item{display:grid;grid-template-columns:72px 1fr auto;gap:12px;align-items:center;border:1px solid var(--line);border-radius:14px;padding:12px}.drawer-item img{width:72px;height:72px;object-fit:contain;background:#f6f7fa;border-radius:10px}.drawer-item h3{font-size:14px;margin:0}.drawer-item small{display:block;color:#626a76;font-weight:800}.drawer-total{border-top:1px solid var(--line);padding-top:14px;display:flex;justify-content:space-between;font-size:22px;font-weight:1000}.shipping-box{border:1px solid var(--line);border-radius:14px;padding:14px}.shipping-box summary{font-weight:1000;cursor:pointer}.shipping-box label{display:block;margin:12px 0;font-weight:1000}.shipping-box input{width:100%;padding:12px;border:1px solid var(--line);border-radius:10px}.shipping-quotes{display:grid;gap:8px;margin-top:10px}.shipping-option{border:1px solid var(--line);border-radius:10px;padding:10px;display:flex;justify-content:space-between;gap:12px;cursor:pointer}.drawer-note{font-size:13px;color:#666;font-weight:800}.toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%) translateY(20px);background:#111;color:#fff;border-radius:999px;padding:12px 22px;font-weight:900;z-index:60;opacity:0;pointer-events:none;transition:.2s}.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
    .product-modal{border:0;border-radius:18px;padding:0;max-width:920px;width:calc(100vw - 40px);box-shadow:0 28px 90px rgba(0,0,0,.28)}.product-modal::backdrop{background:rgba(0,0,0,.45)}#modalBody{padding:28px}.modal-grid{display:grid;grid-template-columns:330px 1fr;gap:28px}.modal-grid img{height:300px;width:100%;object-fit:contain;background:#f6f7fb;border-radius:16px}.modal-grid h2{font-size:28px;margin:0 0 8px}.spec-list{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:16px 0}.spec-list span{background:#f4f6f8;border-radius:10px;padding:10px;font-weight:900;color:#4b5563}.option-box{display:grid;gap:8px;margin:14px 0}.option-box label{display:flex;justify-content:space-between;gap:12px;border:1px solid var(--line);border-radius:10px;padding:10px;font-weight:900;cursor:pointer}
    @media (max-width:1100px){
      .nav-shell{grid-template-columns:auto 1fr auto;grid-auto-rows:auto;height:auto;padding:12px 18px}.main-nav{grid-column:1/4;order:3;justify-content:flex-start;overflow-x:auto;padding-bottom:6px}.search-pill{grid-column:1/3;order:2}.icon-action{display:none}.cart-mini{justify-self:end}.hero-slider{grid-template-columns:1fr;gap:22px;padding:38px 24px}.hero-pc{max-height:310px}.hero-deal-card{max-width:360px}.trust-row{grid-template-columns:repeat(2,1fr)}.trust-row article:nth-child(2){border-right:0}.product-grid,.catalog-grid,.hardware-grid{grid-template-columns:repeat(3,1fr)}.finds-band{grid-template-columns:1fr}.reviews-grid{grid-template-columns:repeat(2,1fr)}.score-card{grid-column:1/3}.footer{grid-template-columns:repeat(2,1fr)}.page-hero{grid-template-columns:1fr;padding:42px 28px}.page-hero img{justify-self:center}.ibp-panels,.split-form,.inline-clean,.contact-grid{grid-template-columns:1fr}
    }
    @media (max-width:680px){
      body{font-size:14px}.topbar-inner{height:38px;font-size:12px;padding:0 8px}.nav-shell{gap:10px}.brand span{font-size:16px}.brand img{width:38px;height:38px}.main-nav{gap:9px}.nav-link{border:1px solid var(--line);border-radius:999px;padding:9px 13px;font-size:13px;background:#fff}.search-pill{height:42px}.hero-slider{min-height:0;border-radius:0 0 14px 14px;padding:28px 18px}.hero-copy h1{font-size:34px}.hero-copy p{font-size:17px}.hero-deal-card{padding:18px}.hero-pc{max-height:250px}.btn{min-height:46px;padding:0 20px}.trust-row{grid-template-columns:1fr}.trust-row article{border-right:0;border-bottom:1px solid var(--line);padding:16px}.trust-row article:last-child{border-bottom:0}.section-head{align-items:start;flex-direction:column}.section-head h2{font-size:28px}.product-grid,.catalog-grid,.hardware-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.product-media{height:128px;padding:12px}.product-body{padding:12px;gap:8px}.product-card h3{font-size:14px;min-height:34px}.price{font-size:18px}.old-price{display:block;margin-right:0}.installment{font-size:11px}.spec-line{font-size:12px;min-height:34px}.card-actions{gap:7px}.ghost-btn,.cart-btn{height:38px;font-size:12px}.ibp-panels{gap:14px}.service-panel{min-height:300px;padding:26px 20px}.service-panel h2{font-size:29px}.service-panel p{font-size:15px}.service-panel img{opacity:.9;width:58%}.finds-preview,.finds-grid{grid-template-columns:1fr}.finds-band{padding:22px}.reviews-grid{grid-template-columns:1fr}.score-card{grid-column:auto}.about-strip,.powered-row{align-items:start;flex-direction:column}.brand-line{width:100%;gap:22px}.brand-line img{height:26px;max-width:98px}.footer{grid-template-columns:1fr}.page-hero{min-height:0;padding:32px 18px}.page-hero h1{font-size:34px}.page-hero p{font-size:16px}.page-hero img{max-height:230px}.modal-grid{grid-template-columns:1fr}.modal-grid img{height:220px}.spec-list{grid-template-columns:1fr}.cart-drawer{padding:18px}
    }
    """


def js(products, finalists, addons, swaps) -> str:
    payloads = {
        "products": products,
        "finds": finalists.get("finalists", []) if isinstance(finalists, dict) else [],
        "addons": addons,
        "swaps": swaps,
    }
    return f"""
    const DATA = {json.dumps(payloads, ensure_ascii=False)};
    const assetBase = document.body.dataset.assetBase || "./";
    const cartKey = "mobilytech-ibuy-cart-v1";
    let cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
    let selectedShipping = null;
    const $ = (sel, root=document) => root.querySelector(sel);
    const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
    const asset = (path) => assetBase + String(path || "").replace(/^\\.\\//, "");
    const money = (value) => new Intl.NumberFormat("pt-BR", {{ style:"currency", currency:"BRL" }}).format(Number(value || 0));
    const norm = (value) => String(value || "").normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").toLowerCase();
    const productById = (id) => DATA.products.find((item) => item.id === id);
    function specs(product) {{
      const s = product.specs || {{}};
      return [s.processor, s.memory, s.gpu, s.storage, s.brand, s.capacity, s.interface].filter(Boolean).slice(0,4);
    }}
    function productType(product) {{ return product.category === "pc" ? "pc" : "hardware"; }}
    function productTotal(item) {{
      const product = productById(item.productId);
      if (!product) return 0;
      const extras = [...(item.selectedAddons || []), ...(item.selectedSwaps || [])].reduce((sum, option) => sum + Number(option.price || 0), 0);
      return Number(product.price || 0) + extras;
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
      let products = DATA.products.filter((item) => item.active !== false);
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
      return `<article class="product-card" data-kind="${{productType(product)}}" data-search="${{[product.title, spec].join(" ")}}">
        <div class="product-media"><img src="${{image}}" alt="${{product.title}}"><span class="badge">${{product.badge || (product.category === "pc" ? "PC revisado" : "Hardware")}}</span></div>
        <div class="product-body">
          <h3>${{product.title}}</h3>
          <p class="spec-line">${{spec}}</p>
          <div><span>${{old}}</span><span class="price">${{money(product.price)}}</span><p class="installment">12x sob consulta no checkout</p></div>
          <div class="card-actions">
            <button class="ghost-btn" type="button" data-detail="${{product.id}}">Ver detalhes</button>
            <button class="cart-btn" type="button" data-add="${{product.id}}">Adicionar</button>
          </div>
        </div>
      </article>`;
    }}
    function renderFinds(target="#findsGrid", limit=999) {{
      const node = $(target);
      if (!node) return;
      const search = norm($("#siteSearch")?.value || "");
      let items = DATA.finds.filter((item) => item.affiliateReady !== false);
      if (search) items = items.filter((item) => norm([item.title, item.whySell, item.niche].join(" ")).includes(search));
      items = items.slice(0, limit);
      node.innerHTML = items.map(findCard).join("") || '<p class="empty">Nenhum achado encontrado.</p>';
    }}
    function findCard(item) {{
      const market = item.marketplace || {{}};
      const image = asset(item.productImage || item.selectedCreative);
      const logo = asset(market.logo || "assets/mercado-livre-logo.svg");
      return `<article class="find-card" data-search="${{item.title}} ${{item.niche}}">
        <div class="find-media"><img src="${{image}}" alt="${{item.title}}"></div>
        <span class="find-meta">${{item.confidence || "Curadoria MobilyTech"}}</span>
        <h3>${{item.title}}</h3>
        <p>${{item.whySell || item.publicPartnerNote || ""}}</p>
        <p><strong>${{item.currentPrice || ""}}</strong></p>
        <a class="market-btn" href="${{item.affiliateUrl || item.sourceUrl}}" target="_blank" rel="noopener">
          <img src="${{logo}}" alt="" aria-hidden="true">${{item.affiliateButton || market.button || "Compre pelo marketplace"}}
        </a>
      </article>`;
    }}
    function addBaseProduct(productId) {{
      cart.push({{ productId, selectedAddons: [], selectedSwaps: [] }});
      saveCart();
      showToast("Produto adicionado ao carrinho.");
    }}
    function addConfiguredProduct(productId) {{
      const product = productById(productId);
      if (!product) return;
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
      cart.push({{ productId, selectedAddons, selectedSwaps }});
      saveCart();
      $("#productModal")?.close();
      showToast("Produto configurado adicionado ao carrinho.");
    }}
    function productDetail(productId) {{
      const product = productById(productId);
      if (!product) return;
      const modal = $("#productModal");
      const body = $("#modalBody");
      const specItems = specs(product).map((item) => `<span>${{item}}</span>`).join("");
      const swapGroups = availableSwaps(product);
      const swapHtml = swapGroups.map((group) => group.options.length ? `<div class="option-box"><strong>${{group.label}}</strong>${{group.options.map((option, index) => `<label><span><input type="checkbox" data-swap data-target="${{group.target}}" data-index="${{index}}" data-label="${{option.label}}" data-price="${{option.price}}"> ${{option.label}}</span><b>${{money(option.price)}}</b></label>`).join("")}}</div>` : "").join("");
      const addonHtml = DATA.addons.filter((item) => item.active !== false).map((option, index) => `<label><span><input type="checkbox" data-addon data-category="${{option.category}}" data-index="${{index}}" data-label="${{option.label}}" data-price="${{option.price}}"> ${{option.label}}</span><b>+${{money(option.price)}}</b></label>`).join("");
      body.innerHTML = `<div class="modal-grid">
        <img src="${{asset(product.cutout || product.image)}}" alt="${{product.title}}">
        <div>
          <h2>${{product.title}}</h2>
          <p class="price">${{money(product.price)}}</p>
          <div class="spec-list">${{specItems}}</div>
          ${{swapHtml ? `<h3>Trocas disponiveis</h3>${{swapHtml}}` : ""}}
          <h3>Adicionais</h3><div class="option-box">${{addonHtml}}</div>
          <button class="btn btn-red full" type="button" data-add-config="${{product.id}}">Adicionar configurado</button>
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
      const count = cart.length;
      $("#cartCount") && ($("#cartCount").textContent = String(count));
      const total = cart.reduce((sum, item) => sum + productTotal(item), 0);
      $("#cartTotal") && ($("#cartTotal").textContent = money(total + (selectedShipping?.price || 0)));
      const items = $("#cartItems");
      if (!items) return;
      if (!cart.length) {{
        items.innerHTML = '<p class="empty">Seu carrinho ainda esta vazio.</p>';
        return;
      }}
      items.innerHTML = cart.map((item, index) => {{
        const product = productById(item.productId);
        if (!product) return "";
        const options = [...(item.selectedAddons || []), ...(item.selectedSwaps || [])].map((o) => o.label).join(" + ");
        return `<article class="drawer-item">
          <img src="${{asset(product.cutout || product.image)}}" alt="">
          <div><h3>${{product.title}}</h3><small>${{options || "Sem opcionais"}}</small><strong>${{money(productTotal(item))}}</strong></div>
          <button class="close-drawer" type="button" data-remove="${{index}}" aria-label="Remover">&times;</button>
        </article>`;
      }}).join("");
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
        if (!response.ok || !Array.isArray(data.quotes)) throw new Error(data.error || "Frete indisponivel agora.");
        box.innerHTML = data.quotes.map((quote, index) => `<label class="shipping-option"><span><input type="radio" name="shipping" data-index="${{index}}"> ${{quote.company}} - ${{quote.name}}<small>${{quote.deliveryTime || "prazo sob consulta"}} dia(s)</small></span><strong>${{money(quote.price)}}</strong></label>`).join("");
        box.querySelectorAll("input[name=shipping]").forEach((input) => input.addEventListener("change", () => {{
          selectedShipping = data.quotes[Number(input.dataset.index)];
          renderCart();
        }}));
      }} catch(error) {{
        box.innerHTML = `<p>${{error.message}}</p>`;
      }}
    }}
    async function startCheckout(endpoint, button) {{
      if (!cart.length) return showToast("Seu carrinho esta vazio.");
      const original = button.textContent;
      button.textContent = "Abrindo checkout...";
      button.disabled = true;
      try {{
        const response = await fetch(endpoint, {{
          method: "POST",
          headers: {{ "Content-Type": "application/json" }},
          body: JSON.stringify({{ cartItems: cart, shipping: selectedShipping }})
        }});
        const data = await response.json();
        if (!response.ok || !data.checkout_url) throw new Error(data.error || "Nao foi possivel abrir o checkout agora.");
        window.location.href = data.checkout_url;
      }} catch(error) {{
        showToast(error.message);
      }} finally {{
        button.textContent = original;
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
    document.addEventListener("click", (event) => {{
      const add = event.target.closest("[data-add]");
      const detail = event.target.closest("[data-detail]");
      const addConfig = event.target.closest("[data-add-config]");
      const remove = event.target.closest("[data-remove]");
      if (add) addBaseProduct(add.dataset.add);
      if (detail) productDetail(detail.dataset.detail);
      if (addConfig) addConfiguredProduct(addConfig.dataset.addConfig);
      if (remove) {{ cart.splice(Number(remove.dataset.remove), 1); saveCart(); }}
    }});
    $("#cartButton")?.addEventListener("click", openCart);
    $("#closeCart")?.addEventListener("click", closeCart);
    $("#cartBackdrop")?.addEventListener("click", closeCart);
    $("#quoteShipping")?.addEventListener("click", quoteShipping);
    $("#checkoutMercado")?.addEventListener("click", (e) => startCheckout("/api/create-preference", e.currentTarget));
    $("#checkoutAbacate")?.addEventListener("click", (e) => startCheckout("/api/create-abacate-checkout", e.currentTarget));
    $$("#buildForm").forEach((form) => form.addEventListener("submit", (e) => {{ e.preventDefault(); submitLead(form, "build"); }}));
    $$("#cleanForm, #cleanFormInline").forEach((form) => form.addEventListener("submit", (e) => {{ e.preventDefault(); submitLead(form, "clean"); }}));
    $("#siteSearch")?.addEventListener("input", () => {{
      renderProducts("#homePcGrid", "pc", Number($("#homePcGrid")?.dataset.limit || 999));
      renderProducts("#homeHardwareGrid", "hardware", Number($("#homeHardwareGrid")?.dataset.limit || 999));
      renderProducts("#catalogGrid", window.currentFilter || "all");
      renderFinds("#homeFindsGrid", Number($("#homeFindsGrid")?.dataset.limit || 999));
      renderFinds("#findsGrid");
    }});
    $$(".filter-chip").forEach((button) => button.addEventListener("click", () => {{
      $$(".filter-chip").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      window.currentFilter = button.dataset.filter;
      renderProducts("#catalogGrid", window.currentFilter);
    }}));
    renderProducts("#homePcGrid", "pc", Number($("#homePcGrid")?.dataset.limit || 999));
    renderProducts("#homeHardwareGrid", "hardware", Number($("#homeHardwareGrid")?.dataset.limit || 999));
    renderProducts("#catalogGrid", "all");
    renderFinds("#homeFindsGrid", Number($("#homeFindsGrid")?.dataset.limit || 999));
    renderFinds("#findsGrid");
    renderCart();
    """


def html_doc(title: str, main: str, prefix: str, active: str, products, finalists, addons, swaps) -> str:
    return f"""<!doctype html>
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
    {header(prefix, active)}
    {main}
    {footer(prefix)}
    {cart_drawer(prefix)}
    <script>{js(products, finalists, addons, swaps)}</script>
  </body>
</html>
"""


def main():
    products = load_json("products.json", [])
    finalists = load_json("phase2-finalists.json", {"finalists": []})
    addons = load_json("addons.json", [])
    swaps = load_json("swaps.json", [])
    FASE2_DIR.mkdir(exist_ok=True)

    pages = {
        ROOT / "fase2-hibrida.html": (
            "MobilyTech BR | Loja gamer",
            home_main(products, finalists, "./"),
            "./",
            "home",
        ),
        FASE2_DIR / "index.html": (
            "MobilyTech BR | Loja gamer",
            home_main(products, finalists, "../"),
            "../",
            "home",
        ),
        FASE2_DIR / "ofertas.html": (
            "Ofertas | MobilyTech BR",
            products_page(
                "PCs revisados e hardware em estoque",
                "Catalogo visual inspirado em lojas gamer, com produtos reais da MobilyTech BR e checkout integrado ao Vercel.",
                "../",
            ),
            "../",
            "ofertas",
        ),
        FASE2_DIR / "achados.html": (
            "MobilyTech Finds | MobilyTech BR",
            finds_page("../"),
            "../",
            "achados",
        ),
        FASE2_DIR / "montagem.html": (
            "Monte seu PC | MobilyTech BR",
            montagem_page("../"),
            "../",
            "montagem",
        ),
        FASE2_DIR / "limpeza.html": (
            "Limpeza de PC | MobilyTech BR",
            limpeza_page("../"),
            "../",
            "limpeza",
        ),
        FASE2_DIR / "avaliacoes.html": (
            "Avaliacoes | MobilyTech BR",
            avaliacoes_page("../"),
            "../",
            "avaliacoes",
        ),
        FASE2_DIR / "contato.html": (
            "Contato | MobilyTech BR",
            contato_page("../"),
            "../",
            "contato",
        ),
    }
    for path, (title, content, prefix, active) in pages.items():
        path.write_text(html_doc(title, content, prefix, active, products, finalists, addons, swaps), encoding="utf-8")

    report = ROOT / "docs" / "phase2-ibuy-style-report-2026-06-14.md"
    report.write_text(
        "\n".join(
            [
                "# MobilyTech BR - Fase 2 iBUYPOWER style",
                "",
                f"Gerado em: {GENERATED_AT}",
                "",
                "- Preview principal: `fase2-hibrida.html`.",
                "- Subpaginas: `fase2/`.",
                "- Visual: estrutura clara inspirada em iBUYPOWER, com conteudo e assets MobilyTech.",
                "- Backend preservado: carrinho chama rotas Vercel de frete, Mercado Pago e Abacate Pay.",
                "- Linguagem publica: sem termos de teste, rascunho, dropshipping ou aprovacao interna.",
            ]
        ),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
