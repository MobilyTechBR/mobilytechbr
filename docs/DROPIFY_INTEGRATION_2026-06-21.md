# Dropify integration - 2026-06-21

## Current status

- Dropify API support was added on the MobilyTech BR server side.
- No secret was written to the repository.
- The Dropify store was still showing `Aguardando aprovacao` when checked in the panel, so the `Token de integracao` tab was not available yet.
- Browser/Computer Use helpers are currently unavailable in Codex because the local node_repl transport is closed; Codex itself was not restarted or closed.

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
- `api/dropify-products.js`: admin-only product lookup/import helper.
- `api/dropify-webhook.js`: webhook receiver with optional HMAC verification.
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

The import script does not activate products automatically. It writes inactive candidates for human/Codex review before anything becomes sellable.
