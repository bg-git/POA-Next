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

async function shopifyFetch(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const https = require('https');
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

async function main() {
  const query = `
    query {
      metafieldDefinitions(first: 250, ownerType: PRODUCT, namespace: "custom") {
        edges {
          node {
            id
            key
            namespace
            type {
              name
            }
          }
        }
      }
    }
  `;

  try {
    const result = await shopifyFetch(query);
    if (result.data.metafieldDefinitions.edges.length === 0) {
      console.log('❌ No custom metafields found in your Shopify store.');
      console.log('');
      console.log('You need to create them first in Shopify Admin:');
      console.log('1. Go to Settings → Custom data → Products');
      console.log('2. Create metafields for: metal, alloy, gem_type, etc.');
      console.log('3. Set their type to "String" or appropriate type');
      console.log('4. Then run this script again to expose them to the storefront.');
    } else {
      console.log(`Found ${result.data.metafieldDefinitions.edges.length} custom metafields:\n`);
      result.data.metafieldDefinitions.edges.forEach(edge => {
        const { id, key, type } = edge.node;
        console.log(`  • ${key} (${type.name})`);
        console.log(`    ID: ${id}`);
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
