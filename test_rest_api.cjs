const https = require('https');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
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

async function restFetch(method, endpoint, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: SHOPIFY_STORE,
      port: 443,
      path: `/admin/api/2024-01${endpoint}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
      },
    };

    if (body) {
      const bodyStr = JSON.stringify(body);
      options.headers['Content-Length'] = bodyStr.length;
    }

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve({status: res.statusCode, body: data ? JSON.parse(data) : null});
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function main() {
  try {
    console.log('Fetching custom metafield definitions via REST API...\n');
    const result = await restFetch('GET', '/metafield_definitions.json?owner_type=PRODUCT&namespace=custom');
    
    if (result.status === 200 && result.body.metafield_definitions) {
      const defs = result.body.metafield_definitions.slice(0, 3);
      console.log(`Found ${result.body.metafield_definitions.length} metafield definitions`);
      console.log(`Showing first 3:\n`);
      defs.forEach(def => {
        console.log(`  - ${def.key}: storefront_api_access = ${def.storefront_api_access}`);
      });
      
      if (defs.length > 0) {
        console.log(`\nFirst definition ID: ${defs[0].id}`);
        console.log(`Trying to update it...`);
        
        const updateResult = await restFetch('PUT', `/metafield_definitions/${defs[0].id}.json`, {
          metafield_definition: {
            storefront_api_access: true
          }
        });
        
        console.log(`\nUpdate response status: ${updateResult.status}`);
        if (updateResult.body.errors) {
          console.log(`Errors:`, updateResult.body.errors);
        } else if (updateResult.body.metafield_definition) {
          console.log(`SUCCESS! Updated: ${updateResult.body.metafield_definition.key}`);
          console.log(`New storefront_api_access: ${updateResult.body.metafield_definition.storefront_api_access}`);
        }
      }
    } else {
      console.log('Response:', result);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
