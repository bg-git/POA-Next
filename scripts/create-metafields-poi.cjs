// scripts/create-metafields-poi.cjs
//
// Script to create metafield definitions for PIERCE OF ART store
// Follows the same structure as other working scripts
//
// Creates namespace/key pairs for:
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

// Define all metafields by type
const METAFIELD_DEFINITIONS = {
  COLLECTION: [
    { key: 'title', name: 'Collection Title', type: 'single_line_text_field' },
    { key: 'description', name: 'Collection Description', type: 'single_line_text_field' },
    { key: 'deep_links', name: 'Deep Links', type: 'single_line_text_field' },
  ],
  PRODUCT: [
    { key: 'alloy', name: 'Alloy', type: 'single_line_text_field' },
    { key: 'metal', name: 'Metal', type: 'single_line_text_field' },
    { key: 'metal_colour', name: 'Metal Colour', type: 'single_line_text_field' },
    { key: 'thread_type', name: 'Thread Type', type: 'single_line_text_field' },
    { key: 'gem_type', name: 'Gem Type', type: 'single_line_text_field' },
    { key: 'gem_colour', name: 'Gem Colour', type: 'single_line_text_field' },
    { key: 'selected_color', name: 'Selected Color', type: 'single_line_text_field' },
    { key: 'name', name: 'Product Name', type: 'single_line_text_field' },
    { key: 'title', name: 'Product Title', type: 'single_line_text_field' },
    { key: 'sku', name: 'SKU', type: 'single_line_text_field' },
    { key: 'width', name: 'Width', type: 'single_line_text_field' },
    { key: 'height', name: 'Height', type: 'single_line_text_field' },
    { key: 'length', name: 'Length', type: 'single_line_text_field' },
    { key: 'gauge', name: 'Gauge', type: 'single_line_text_field' },
    { key: 'sold_as', name: 'Sold As', type: 'single_line_text_field' },
    { key: 'shipping', name: 'Shipping', type: 'single_line_text_field' },
    { key: 'base_size', name: 'Base Size', type: 'single_line_text_field' },
    { key: 'variants', name: 'Variants', type: 'json' },
    { key: 'variant_label', name: 'Variant Label', type: 'single_line_text_field' },
    { key: 'fitting', name: 'Fitting Type', type: 'single_line_text_field' },
    { key: 'styled_by_you', name: 'Styled By You', type: 'file_reference' },
  ],
  PRODUCTVARIANT: [
    { key: 'sku', name: 'Variant SKU', type: 'single_line_text_field' },
    { key: 'alloy', name: 'Variant Alloy', type: 'single_line_text_field' },
    { key: 'metal', name: 'Variant Metal', type: 'single_line_text_field' },
    { key: 'metal_colour', name: 'Variant Metal Colour', type: 'single_line_text_field' },
    { key: 'gem_colour', name: 'Variant Gem Colour', type: 'single_line_text_field' },
    { key: 'gem_type', name: 'Variant Gem Type', type: 'single_line_text_field' },
    { key: 'selected_color', name: 'Variant Selected Color', type: 'single_line_text_field' },
    { key: 'thread_type', name: 'Variant Thread Type', type: 'single_line_text_field' },
    { key: 'width', name: 'Variant Width', type: 'single_line_text_field' },
    { key: 'height', name: 'Variant Height', type: 'single_line_text_field' },
    { key: 'length', name: 'Variant Length', type: 'single_line_text_field' },
    { key: 'fitting', name: 'Variant Fitting', type: 'single_line_text_field' },
    { key: 'gauge', name: 'Variant Gauge', type: 'single_line_text_field' },
    { key: 'base_size', name: 'Variant Base Size', type: 'single_line_text_field' },
    { key: 'weight', name: 'Variant Weight', type: 'single_line_text_field' },
    { key: 'shipping', name: 'Variant Shipping', type: 'single_line_text_field' },
    { key: 'sold_as', name: 'Variant Sold As', type: 'single_line_text_field' },
    { key: 'variant_label', name: 'Variant Label', type: 'single_line_text_field' },
    { key: 'styled_by_you', name: 'Styled By You', type: 'file_reference' },
  ],
};

const MUTATION = `
  mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
    metafieldDefinitionCreate(definition: $definition) {
      userErrors {
        field
        message
      }
    }
  }
`;

async function createMetafieldDefinition(ownerType, key, name, type) {
  const variables = {
    definition: {
      namespace: 'custom',
      key,
      name,
      type,
      ownerType,
    },
  };

  try {
    const result = await shopifyGraphQL(MUTATION, variables);
    
    const userErrors = result.metafieldDefinitionCreate?.userErrors || [];
    
    if (userErrors.length > 0) {
      const msg = userErrors[0].message;
      if (msg.includes('already exists')) {
        console.log(`   ⚠️  ${ownerType}.${key} - Already exists`);
        return true;
      }
      console.error(`   ❌ ${ownerType}.${key} - ${msg}`);
      return false;
    }
    
    console.log(`   ✅ ${ownerType}.${key} - Created`);
    return true;
  } catch (error) {
    console.error(`   ❌ ${ownerType}.${key} - Error: ${error.message}`);
    return false;
  }
}

async function run() {
  console.log(`▶ Creating metafield definitions`);
  console.log(`   Store: ${STORE_DOMAIN}`);
  console.log(`   API Version: ${API_VERSION}\n`);

  let successCount = 0;
  let totalCount = 0;

  for (const [ownerType, fields] of Object.entries(METAFIELD_DEFINITIONS)) {
    console.log(`📦 Creating ${ownerType} metafields:`);
    for (const field of fields) {
      totalCount++;
      const success = await createMetafieldDefinition(
        ownerType,
        field.key,
        field.name,
        field.type
      );
      if (success) successCount++;
      await sleep(300);
    }
    console.log('');
  }

  console.log(`✅ Done! ${successCount}/${totalCount} metafield definitions created/verified.`);
}

run().catch((err) => {
  console.error('❌ Script failed:', err);
  process.exit(1);
});
