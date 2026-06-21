# Dropify integration - 2026-06-21

## Current status

- Dropify API support was added on the MobilyTech BR server side.
- No secret was written to the repository.
- The Dropify store was approved by email on 2026-06-21, but the browser helper is still unavailable, so credentials were not retrieved from the panel yet.
- Browser/Computer Use helpers are currently unavailable in Codex because the local node_repl transport is closed; Codex itself was not restarted or closed.
- Public Postman docs confirm credentials are generated from `Configurar Lojas > Token de integracao` and API usage is limited to 180 requisicoes per minute.

## Vercel environment variables

Configure these in Vercel as server-only variables, scoped to Production and Preview after the Dropify panel releases credentials:

- `DROPIFY_CLIENT_ID`
- `DROPIFY_CLIENT_SECRET`
- `DROPIFY_FREIGHT_KEY`

Optional:

- `DROPIFY_WEBHOOK_SECRET`
- `DROPIFY_CREATE_ORDER_ENABLED=false`
- `DROPIFY_ORDER_SHIPPING_METHOD=CUSTOM_LABEL`
- `DROPIFY_SALES_CHANNEL=MobilyTech BR`

Keep `DROPIFY_CREATE_ORDER_ENABLED=false` until authentication, freight and order creation have been tested in a controlled order. With the default value, the system prepares the Dropify order payload but does not create the order.

## Where to get credentials

In the Dropify panel, after store approval:

1. Open `Configurar Lojas`.
2. Select the MobilyTech store.
3. Open `Token de integracao`.
4. Click `Gerar credenciais`.
5. Copy `Client ID` to `DROPIFY_CLIENT_ID`.
6. Copy `Client Secret` to `DROPIFY_CLIENT_SECRET`.

The freight key is separate and should be requested in the Dropify freight integration area, then saved as `DROPIFY_FREIGHT_KEY`.

## Files added or changed

- `lib/dropify.js`: authentication, product lookup, freight quote and safe order payload creation.
- `lib/account-handlers.js`: consolidated `/api/dropify-products` and `/api/dropify-webhook` into the existing account function to keep the Vercel function count within the current project limit.
- `vercel.json`: rewrites `/api/dropify-products` and `/api/dropify-webhook` to the consolidated account handler.
- `lib/fulfillment-shipping.js`: supplier freight now prefers Dropify for Dropify items and CJ for CJ items.
- `lib/product-variants.js`: variants can carry Dropify SKU data.
- `api/mercado-pago-webhook.js`: paid orders can prepare Dropify payloads in payload-only mode.
- `scripts/test_dropify_auth.js`: safe auth/freight smoke test.
- `scripts/import_dropify_catalog.js`: writes candidate products to `docs/qa/dropify-import-2026-06-21/dropify-candidates.json`.

## Test commands

After env vars exist:

```powershell
node scripts/test_dropify_auth.js
```

Optional freight smoke test:

```powershell
$env:DROPIFY_TEST_SKU='SKU_AQUI'
$env:DROPIFY_TEST_CEP='01311000'
$env:DROPIFY_TEST_COST_BRL='50'
$env:DROPIFY_TEST_HEIGHT_CM='10'
$env:DROPIFY_TEST_LENGTH_CM='16'
$env:DROPIFY_TEST_WIDTH_CM='12'
$env:DROPIFY_TEST_WEIGHT_KG='0.4'
node scripts/test_dropify_auth.js
```

Candidate import:

```powershell
$env:DROPIFY_IMPORT_PAGES='2'
node scripts/import_dropify_catalog.js
```

The import script does not activate products automatically. It writes inactive candidates for human/Codex review before anything becomes sellable. It now also writes:

- `docs/qa/dropify-import-2026-06-21/dropify-candidates.json`
- `docs/qa/dropify-import-2026-06-21/dropify-selected-75.json`
- `docs/qa/dropify-import-2026-06-21/dropify-prelista.md`

The selected list is sorted with extra weight for hardware, useful home/tool products, lower and medium price bands, stock, image availability, validated cost and measurements.
