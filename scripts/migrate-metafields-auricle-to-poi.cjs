// scripts/migrate-metafields-auricle-to-poi.cjs
//
// Script to copy metafield values from AURICLE to PIERCE OF ART
// Reads from AURICLE store, writes to POI store
//
// Requires temporary AURICLE env vars in .env.local:
// - AURICLE_STORE_DOMAIN
// - AURICLE_ADMIN_API_ACCESS_TOKEN

require('dotenv').config({ path: '.env.local' });

const AURICLE_STORE_DOMAIN = process.env.AURICLE_SHOPIFY_STORE_DOMAIN;
const AURICLE_ADMIN_TOKEN = process.env.AURICLE_SHOPIFY_ADMIN_API_ACCESS_TOKEN;

const POI_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const POI_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;

const API_VERSION = process.env.SHOPIFY_ADMIN_API_VERSION || '2025-01';

if (!AURICLE_STORE_DOMAIN || !AURICLE_ADMIN_TOKEN) {
  console.error('❌ Missing AURICLE_SHOPIFY_STORE_DOMAIN or AURICLE_SHOPIFY_ADMIN_API_ACCESS_TOKEN in env.');
  process.exit(1);
}

if (!POI_STORE_DOMAIN || !POI_ADMIN_TOKEN) {
  console.error('❌ Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_API_ACCESS_TOKEN in env.');
  process.exit(1);
}

const AURICLE_GRAPHQL_ENDPOINT = `https://${AURICLE_STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;
const POI_GRAPHQL_ENDPOINT = `https://${POI_STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

// Helper: wait
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper: call Shopify Admin GraphQL
async function shopifyGraphQL(endpoint, token, query, variables = {}) {
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

// Query to get products with metafields from source
const GET_PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
          id
          title
          handle
          metafields(first: 20, namespace: "custom") {
            edges {
              node {
                key
                value
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                metafields(first: 10, namespace: "custom") {
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
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// Query to find product by handle in target store
const FIND_PRODUCT_BY_HANDLE = `
  query FindProduct($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      variants(first: 10) {
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

// Mutation to set metafield on product
const SET_PRODUCT_METAFIELD = `
  mutation SetProductMetafield($input: MetafieldsSetInput!) {
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

async function getAllProductsFromAuricle() {
  console.log(`📡 Fetching all products from AURICLE...\n`);
  let allProducts = [];
  let hasNextPage = true;
  let after = null;

  while (hasNextPage) {
    try {
      const result = await shopifyGraphQL(
        AURICLE_GRAPHQL_ENDPOINT,
        AURICLE_ADMIN_TOKEN,
        GET_PRODUCTS_QUERY,
        { first: 50, after }
      );

      const products = result.products?.edges || [];
      allProducts.push(...products);

      hasNextPage = result.products?.pageInfo?.hasNextPage || false;
      after = result.products?.pageInfo?.endCursor || null;

      console.log(`   ✅ Fetched ${products.length} products (total: ${allProducts.length})`);
      await sleep(300);
    } catch (error) {
      console.error(`   ❌ Error fetching products: ${error.message}`);
      break;
    }
  }

  return allProducts;
}

async function setMetafieldOnProduct(productId, key, value) {
  try {
    const result = await shopifyGraphQL(
      POI_GRAPHQL_ENDPOINT,
      POI_ADMIN_TOKEN,
      SET_PRODUCT_METAFIELD,
      {
        input: {
          resourceId: productId,
          metafields: [
            {
              namespace: 'custom',
              key,
              value,
              type: 'single_line_text_field',
            },
          ],
        },
      }
    );

    const userErrors = result.metafieldsSet?.userErrors || [];
    if (userErrors.length > 0) {
      console.error(`      ❌ Error: ${userErrors[0].message}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`      ❌ Error setting metafield: ${error.message}`);
    return false;
  }
}

async function findProductInPOI(handle) {
  try {
    const result = await shopifyGraphQL(
      POI_GRAPHQL_ENDPOINT,
      POI_ADMIN_TOKEN,
      FIND_PRODUCT_BY_HANDLE,
      { handle }
    );

    return result.productByHandle || null;
  } catch (error) {
    console.error(`      ❌ Error finding product: ${error.message}`);
    return null;
  }
}

async function migrateMetafields() {
  console.log(`▶ Migrating metafields from AURICLE to PIERCE OF ART`);
  console.log(`   Source: ${AURICLE_STORE_DOMAIN}`);
  console.log(`   Target: ${POI_STORE_DOMAIN}`);
  console.log(`   API Version: ${API_VERSION}\n`);

  // Fetch all products from AURICLE
  const auricleProducts = await getAllProductsFromAuricle();

  if (auricleProducts.length === 0) {
    console.log('\n⚠️  No products found in AURICLE');
    return;
  }

  console.log(`\n📦 Migrating metafields for ${auricleProducts.length} products...\n`);

  let successCount = 0;
  let totalCount = 0;

  for (const productEdge of auricleProducts) {
    const auricleProduct = productEdge.node;
    const metafields = auricleProduct.metafields?.edges || [];

    if (metafields.length === 0) {
      continue;
    }

    // Find matching product in POI by handle
    const poiProduct = await findProductInPOI(auricleProduct.handle);

    if (!poiProduct) {
      console.log(`   ⚠️  ${auricleProduct.title} - Not found in POI (handle: ${auricleProduct.handle})`);
      continue;
    }

    console.log(`   📌 ${auricleProduct.title}`);

    for (const mfEdge of metafields) {
      const mf = mfEdge.node;
      totalCount++;

      const success = await setMetafieldOnProduct(poiProduct.id, mf.key, mf.value);
      if (success) {
        console.log(`      ✅ ${mf.key}: ${mf.value}`);
        successCount++;
      }
      await sleep(200);
    }

    console.log('');
  }

  console.log(`✅ Done! ${successCount}/${totalCount} metafields migrated.`);
}

migrateMetafields().catch((err) => {
  console.error('❌ Script failed:', err);
  process.exit(1);
});
