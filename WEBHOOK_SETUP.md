# AURICLE to POI Automatic Sync Setup

This webhook enables real-time synchronization of metafields from AURICLE to POI whenever products or variants are updated in AURICLE.

## How It Works

1. When a product is updated in AURICLE, a webhook is triggered
2. The webhook sends the product data to your POI server
3. The API endpoint (`/api/webhooks/auricle-sync`) automatically syncs all metafields
4. Both product-level and variant-level metafields are synced

## Setup Instructions

### 1. Deploy Your Application

Your application must be deployed to a publicly accessible URL for webhooks to work. Ensure your `src/pages/api/webhooks/auricle-sync.ts` endpoint is live.

Example production URL: `https://yourdomain.com/api/webhooks/auricle-sync`

### 2. Create Webhook in AURICLE Store

Follow these steps in the AURICLE Shopify Admin:

1. Go to **Settings** → **Webhooks** (or **Apps and sales channels** → **App and sales channel settings** → **Webhooks**)
2. Click **Create webhook**
3. Configure as follows:
   - **Event**: `Product` → `Updated`
   - **URL**: `https://yourdomain.com/api/webhooks/auricle-sync`
   - **Format**: `JSON`
   - Leave other options as default

4. Click **Create webhook** to save

### 3. Test the Webhook

1. In AURICLE, edit any product (e.g., change Metal Colour)
2. Save the changes
3. **Within 30 seconds**, the metafield should update in POI
4. Check the server logs for confirmation:
   ```
   [AURICLE SYNC] Starting sync for product: [Product Name]
   [AURICLE SYNC] ✅ Synced X metafields for [product-handle]
   ```

## Troubleshooting

### Webhook Isn't Triggering

- Verify the webhook URL is publicly accessible: `curl https://yourdomain.com/api/webhooks/auricle-sync`
- Check AURICLE webhook logs in Admin: Settings → Webhooks → [Your webhook] → View recent deliveries
- Ensure your server is deployed and running

### Metafields Not Syncing

- Check server logs for errors
- Verify environment variables are set correctly:
  - `AURICLE_SHOPIFY_STORE_DOMAIN`
  - `AURICLE_SHOPIFY_ADMIN_API_ACCESS_TOKEN`
  - `SHOPIFY_STORE_DOMAIN`
  - `SHOPIFY_ADMIN_API_ACCESS_TOKEN`
- Ensure product handles match between AURICLE and POI

### Rate Limiting

The endpoint implements a 200ms delay between API calls to avoid hitting Shopify's rate limits. If you're updating many products simultaneously, queuing may occur.

## Manual Sync Option

If webhooks don't work in your setup, you can still use the manual migration script:

```bash
npm run migrate:metafields
```

This syncs all products at once instead of individual updates.

## Monitoring

To add monitoring/alerts, you can:

1. Log webhook calls to a database
2. Set up error notifications if syncs fail
3. Monitor the `[AURICLE SYNC]` logs in your server

## Environment Variables Required

Ensure these are in your `.env.local`:

```
AURICLE_SHOPIFY_STORE_DOMAIN=your-auricle-store.myshopify.com
AURICLE_SHOPIFY_ADMIN_API_ACCESS_TOKEN=shpat_xxxxx
SHOPIFY_STORE_DOMAIN=your-poi-store.myshopify.com
SHOPIFY_ADMIN_API_ACCESS_TOKEN=shpat_xxxxx
SHOPIFY_ADMIN_API_VERSION=2025-01
```
