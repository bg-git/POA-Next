#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=').replace(/^["']|["']$/g, '');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    }
  });
}

const SHOPIFY_STORE = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;

if (!SHOPIFY_ACCESS_TOKEN || !SHOPIFY_STORE) {
  console.error('❌ Missing environment variables:');
  if (!SHOPIFY_ACCESS_TOKEN) console.error('   - SHOPIFY_ADMIN_API_ACCESS_TOKEN');
  if (!SHOPIFY_STORE) console.error('   - SHOPIFY_STORE_DOMAIN');
  process.exit(1);
}

const metafieldsToExpose = [
  'alloy',
  'metal',
  'metal_colour',
  'thread_type',
  'gem_type',
  'gem_colour',
  'name',
  'title',
  'sku',
  'width',
  'height',
  'length',
  'gauge',
  'sold_as',
  'shipping',
  'base_size',
  'variants',
  'variant_label',
  'fitting',
  'extra_table_rows',
  'test_certificate',
  'description',
  'styled_by_you',
];

async function shopifyFetch(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query, variables });

    const options = {
      hostname: SHOPIFY_STORE,
      port: 443,
      path: '/admin/api/2024-01/graphql.json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': body.length,
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function getMetafieldDefinitions() {
  const query = `
    query {
      metafieldDefinitions(first: 250, ownerType: PRODUCT, namespace: "custom") {
        edges {
          node {
            id
            key
            namespace
          }
        }
      }
    }
  `;

  const result = await shopifyFetch(query);
  if (result.errors) {
    throw new Error(JSON.stringify(result.errors));
  }
  return result.data.metafieldDefinitions.edges;
}

async function updateMetafieldDefinition(id, key) {
  const mutation = `
    mutation UpdateMetafieldDefinition($id: ID!, $input: MetafieldDefinitionInput!) {
      metafieldDefinitionUpdate(id: $id, input: $input) {
        metafieldDefinition {
          id
          key
          access {
            storefront
          }
        }
        userErrors {
          field
          message
          code
        }
      }
    }
  `;

  const input = {
    access: {
      storefront: "READ"
    }
  };

  const result = await shopifyFetch(mutation, { id, input });
  if (result.errors) {
    console.error(`  ❌ GraphQL error for ${key}:`, result.errors[0]?.message);
    return false;
  }
  if (result.data?.metafieldDefinitionUpdate?.userErrors?.length > 0) {
    console.error(`  ❌ User error for ${key}:`, result.data.metafieldDefinitionUpdate.userErrors[0]?.message);
    return false;
  }
  return true;
}

async function main() {
  console.log('📦 Enabling Storefront API Access...\n');

  try {
    const definitions = await getMetafieldDefinitions();

    const customNamespaceFields = definitions.filter(
      (edge) =>
        edge.node.namespace === 'custom' &&
        metafieldsToExpose.includes(edge.node.key)
    );

    if (customNamespaceFields.length === 0) {
      console.log('⚠️  No matching metafield definitions found');
      process.exit(0);
    }

    console.log(`Found ${customNamespaceFields.length} custom metafields to update:\n`);

    let updatedCount = 0;
    let failedCount = 0;

    for (const edge of customNamespaceFields) {
      const { id, key } = edge.node;
      process.stdout.write(`🔄 ${key}... `);
      
      const success = await updateMetafieldDefinition(id, key);
      if (success) {
        console.log('✅');
        updatedCount++;
      } else {
        console.log('❌');
        failedCount++;
      }
    }

    console.log(`\n✨ Done!`);
    console.log(`📊 Updated: ${updatedCount}`);
    console.log(`📊 Failed: ${failedCount}`);
    console.log(`📊 Total: ${customNamespaceFields.length}\n`);
    
    if (failedCount === 0) {
      console.log('✅ All metafields now have Storefront API access enabled!');
      console.log('🔨 Rebuild your Next.js app to fetch the updated metafields:');
      console.log('   npm run build');
      console.log('   npm run dev');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
