import type { NextApiRequest, NextApiResponse } from 'next';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function shopifyGraphQL(
  endpoint: string,
  token: string,
  query: string,
  variables?: Record<string, unknown>
) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shopify API error ${res.status}: ${text}`);
  }

  const json = await res.json();
  if (json.errors) {
    console.error('GraphQL errors:', JSON.stringify(json.errors, null, 2));
    throw new Error('GraphQL returned errors');
  }
  return json.data;
}

const GET_PRODUCT_METAFIELDS = `
  query GetProductMetafields($id: ID!) {
    product(id: $id) {
      id
      handle
      title
      metafields(first: 50, namespace: "custom") {
        edges {
          node {
            key
            value
          }
        }
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            metafields(first: 50, namespace: "custom") {
              edges {
                node {
                  key
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;

const FIND_PRODUCT_BY_HANDLE = `
  query FindProduct($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      variants(first: 100) {
        edges {
          node {
            id
            title
          }
        }
      }
    }
  }
`;

const SET_METAFIELD = `
  mutation SetMetafield($input: MetafieldsSetInput!) {
    metafieldsSet(input: $input) {
      userErrors {
        field
        message
      }
      metafields {
        key
        value
      }
    }
  }
`;

async function syncProductMetafields(auricleProductId: string) {
  const auricleStore = process.env.AURICLE_SHOPIFY_STORE_DOMAIN;
  const auricleToken = process.env.AURICLE_SHOPIFY_ADMIN_API_ACCESS_TOKEN;
  const poiStore = process.env.SHOPIFY_STORE_DOMAIN;
  const poiToken = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
  const apiVersion = process.env.SHOPIFY_ADMIN_API_VERSION || '2025-01';

  if (!auricleStore || !auricleToken || !poiStore || !poiToken) {
    throw new Error('Missing required environment variables');
  }

  const auricleEndpoint = `https://${auricleStore}/admin/api/${apiVersion}/graphql.json`;
  const poiEndpoint = `https://${poiStore}/admin/api/${apiVersion}/graphql.json`;

  // 1. Fetch product data from AURICLE
  const auricleData = await shopifyGraphQL(
    auricleEndpoint,
    auricleToken,
    GET_PRODUCT_METAFIELDS,
    { id: auricleProductId }
  );

  const auricleProduct = auricleData.product;
  if (!auricleProduct) {
    throw new Error(`Product not found in AURICLE: ${auricleProductId}`);
  }

  // 2. Find matching product in POI by handle
  const poiData = await shopifyGraphQL(
    poiEndpoint,
    poiToken,
    FIND_PRODUCT_BY_HANDLE,
    { handle: auricleProduct.handle }
  );

  const poiProduct = poiData.productByHandle;
  if (!poiProduct) {
    throw new Error(`Product not found in POI: ${auricleProduct.handle}`);
  }

  let syncedCount = 0;

  // 3. Sync product metafields
  const productMetafields = auricleProduct.metafields?.edges || [];
  if (productMetafields.length > 0) {
    const metafieldsToSet = productMetafields.map((mf: any) => ({
      namespace: 'custom',
      key: mf.node.key,
      value: mf.node.value,
      type: 'single_line_text_field',
    }));

    await shopifyGraphQL(
      poiEndpoint,
      poiToken,
      SET_METAFIELD,
      {
        input: {
          resourceId: poiProduct.id,
          metafields: metafieldsToSet,
        },
      }
    );

    syncedCount += productMetafields.length;
  }

  await sleep(200);

  // 4. Sync variant metafields
  const auricleVariants = auricleProduct.variants?.edges || [];
  const poiVariants = poiProduct.variants?.edges || [];

  for (let i = 0; i < auricleVariants.length; i++) {
    const auricleVariant = auricleVariants[i].node;
    const poiVariant = poiVariants[i]?.node;

    if (!poiVariant) {
      console.warn(`Variant mismatch at index ${i} for product ${auricleProduct.handle}`);
      continue;
    }

    const variantMetafields = auricleVariant.metafields?.edges || [];
    if (variantMetafields.length > 0) {
      const metafieldsToSet = variantMetafields.map((mf: any) => ({
        namespace: 'custom',
        key: mf.node.key,
        value: mf.node.value,
        type: 'single_line_text_field',
      }));

      await shopifyGraphQL(
        poiEndpoint,
        poiToken,
        SET_METAFIELD,
        {
          input: {
            resourceId: poiVariant.id,
            metafields: metafieldsToSet,
          },
        }
      );

      syncedCount += variantMetafields.length;
      await sleep(200);
    }
  }

  return {
    success: true,
    productHandle: auricleProduct.handle,
    syncedMetafields: syncedCount,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify webhook is from Shopify
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id, handle, title } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Missing product ID' });
    }

    console.log(`[AURICLE SYNC] Starting sync for product: ${title} (${handle})`);

    const result = await syncProductMetafields(id);

    console.log(
      `[AURICLE SYNC] ✅ Synced ${result.syncedMetafields} metafields for ${result.productHandle}`
    );

    return res.status(200).json({
      success: true,
      message: `Synced ${result.syncedMetafields} metafields`,
      productHandle: result.productHandle,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[AURICLE SYNC] ❌ Sync failed:`, errorMessage);

    return res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
}
