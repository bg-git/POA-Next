// scripts/pull-metafields-poi.cjs
//
// Script to pull all metafield values from PIERCE OF ART store
// Retrieves metafields from:
// - Collections
// - Products  
// - Product Variants

require('dotenv').config({ path: '.env.local' });

const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
const API_VERSION = process.env.SHOPIFY_ADMIN_API_VERSION || '2025-01';

if (!STORE_DOMAIN || !ADMIN_TOKEN) {
  console.error('❌ Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_API_ACCESS_TOKEN in env.');
  process.exit(1);
}

const GRAPHQL_ENDPOINT = `https://${STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

// Helper: wait
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper: call Shopify Admin GraphQL
async function shopifyGraphQL(query, variables = {}) {
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_TOKEN,
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

// Query to get collections with metafields
const COLLECTIONS_QUERY = `
  query GetCollections($first: Int!) {
    collections(first: $first) {
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
`;

// Query to get products with metafields
const PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
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
      }
    }
  }
`;

async function pullCollectionMetafields() {
  console.log(`📦 Pulling collection metafields...\n`);
  
  try {
    const result = await shopifyGraphQL(COLLECTIONS_QUERY, { first: 10 });
    const collections = result.collections?.edges || [];
    
    if (collections.length === 0) {
      console.log('   ⚠️  No collections found');
      return;
    }
    
    collections.forEach((collection) => {
      const node = collection.node;
      const metafields = node.metafields?.edges || [];
      
      console.log(`   📌 ${node.title}`);
      if (metafields.length === 0) {
        console.log(`      (no metafields)`);
      } else {
        metafields.forEach((mf) => {
          console.log(`      • ${mf.node.key}: ${mf.node.value}`);
        });
      }
      console.log('');
    });
  } catch (error) {
    console.error(`   ❌ Error pulling collection metafields: ${error.message}`);
  }
}

async function pullProductMetafields() {
  console.log(`📦 Pulling product metafields...\n`);
  
  try {
    const result = await shopifyGraphQL(PRODUCTS_QUERY, { first: 5 });
    const products = result.products?.edges || [];
    
    if (products.length === 0) {
      console.log('   ⚠️  No products found');
      return;
    }
    
    products.forEach((product) => {
      const node = product.node;
      const metafields = node.metafields?.edges || [];
      const variants = node.variants?.edges || [];
      
      console.log(`   📌 ${node.title}`);
      if (metafields.length === 0) {
        console.log(`      (no product metafields)`);
      } else {
        console.log(`      Product Metafields:`);
        metafields.forEach((mf) => {
          console.log(`      • ${mf.node.key}: ${mf.node.value}`);
        });
      }
      
      // Show variant metafields
      if (variants.length > 0) {
        console.log(`      Variants:`);
        variants.forEach((variant) => {
          const variantNode = variant.node;
          const variantMetafields = variantNode.metafields?.edges || [];
          console.log(`        - ${variantNode.title}`);
          if (variantMetafields.length === 0) {
            console.log(`          (no variant metafields)`);
          } else {
            variantMetafields.forEach((mf) => {
              console.log(`          • ${mf.node.key}: ${mf.node.value}`);
            });
          }
        });
      }
      console.log('');
    });
  } catch (error) {
    console.error(`   ❌ Error pulling product metafields: ${error.message}`);
  }
}

async function run() {
  console.log(`▶ Pulling metafield values`);
  console.log(`   Store: ${STORE_DOMAIN}`);
  console.log(`   API Version: ${API_VERSION}\n`);

  await pullCollectionMetafields();
  await sleep(500);
  
  await pullProductMetafields();
  await sleep(500);

  console.log(`✅ Done!`);
}

run().catch((err) => {
  console.error('❌ Script failed:', err);
  process.exit(1);
});
