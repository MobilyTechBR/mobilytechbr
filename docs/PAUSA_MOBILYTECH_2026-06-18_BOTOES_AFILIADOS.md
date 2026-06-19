# Pausa MobilyTech BR - Botoes de Afiliados

Data/hora da pausa: 2026-06-18 20:13:49 -03:00

## Estado

- Trabalho pausado a pedido do usuario.
- Nada foi publicado/deployado depois desta rodada.
- Servidor local de QA em `127.0.0.1:4179` foi encerrado.
- OpenAI API paga nao deve ser usada; chave foi removida do ambiente do Windows anteriormente.
- Caminho gratuito usado nesta rodada: Chrome local via Playwright + Ollama local `qwen2.5vl:7b`.

## Feito nesta etapa

- Gerados novos assets PNG dos botoes `Ver oferta`, derivados diretamente das imagens de referencia enviadas pelo usuario:
  - `assets/affiliate-button-aliexpress.png`
  - `assets/affiliate-button-amazon.png`
  - `assets/affiliate-button-mercado-livre.png`
- Atualizado o gerador `scripts/build_phase2_ibuy_style.py` para usar esses PNGs nos links de afiliados.
- Regenerados `index.html` e `fase2/achados.html` com os novos botoes.
- Validado localmente em `fase2/achados.html`:
  - 66 cards de afiliados renderizados.
  - 66 botoes visuais novos renderizados.
  - 29 AliExpress, 13 Amazon, 24 Mercado Livre.
  - Exemplos de links encontrados:
    - AliExpress: `https://s.click.aliexpress.com/e/_c3yklQt3`
    - Amazon: `https://www.amazon.com.br/dp/B0BR3M8XHK?tag=mobilytechbr-20`
    - Mercado Livre: `https://meli.la/1DNJP2s`
- Crocheck visual com Ollama:
  - AliExpress aprovado: `docs/qa/affiliate-buttons-final-2026-06-18/ollama-aliexpress.json`
  - Amazon aprovado: `docs/qa/affiliate-buttons-final-2026-06-18/ollama-amazon.json`
  - Mercado Livre aprovado no rerun: `docs/qa/affiliate-buttons-final-2026-06-18/ollama-mercado-livre-rerun.json`

## Evidencias geradas

- Browser QA: `docs/qa/affiliate-buttons-final-2026-06-18/browser-qa.json`
- Desktop completo: `docs/qa/affiliate-buttons-final-2026-06-18/desktop-full-after.png`
- Mobile completo: `docs/qa/affiliate-buttons-final-2026-06-18/mobile-full-after.png`
- Comparacao referencia/render: `docs/qa/affiliate-buttons-final-2026-06-18/display-reference-vs-real-contact-sheet.jpg`
- Botoes desktop:
  - `desktop-button-aliexpress.png`
  - `desktop-button-amazon.png`
  - `desktop-button-mercado-livre.png`
- Botoes mobile:
  - `mobile-button-aliexpress.png`
  - `mobile-button-amazon.png`
  - `mobile-button-mercado-livre.png`

## Observacoes tecnicas

- O primeiro print parecia pequeno porque a regra antiga `.market-btn img` reduzia os PNGs. Corrigido com `.market-button-art{width:100%!important;height:100%!important;...}`.
- O 404 local visto no console foi para `/api/account?action=session`. Isso acontece no servidor estatico local, porque a API existe no deploy/Vercel, nao no `python -m http.server`.
- Como o usuario pediu pausa, nao foi feita publicacao final, commit ou push.

## Falta fazer ao retomar

1. Reabrir a validacao local rapidamente e confirmar que os botoes continuam iguais aos PNGs aprovados.
2. Rodar uma checagem funcional final dos links principais em `fase2/achados.html`.
3. Corrigir somente se aparecer algum problema novo.
4. Publicar/deployar a versao final.
5. Validar no dominio oficial `https://www.mobilytech.com.br`, nao apenas no Vercel/local.
6. Enviar resumo final ao usuario com:
   - link oficial do site;
   - link oficial da pagina MobilyTech Finds;
   - status dos botoes;
   - evidencia do Ollama;
   - observacao de que OpenAI API paga nao foi usada.

## Arquivos locais importantes alterados/adicionados

- `scripts/build_phase2_ibuy_style.py`
- `index.html`
- `fase2/achados.html`
- `assets/affiliate-button-aliexpress.png`
- `assets/affiliate-button-amazon.png`
- `assets/affiliate-button-mercado-livre.png`
- `docs/qa/affiliate-buttons-final-2026-06-18/`
- `docs/PAUSA_MOBILYTECH_2026-06-18_BOTOES_AFILIADOS.md`
