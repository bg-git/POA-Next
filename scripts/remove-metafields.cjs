require('dotenv').config({ path: '.env.local' });

// Metafield names to remove
const metafieldsToRemove = [
  'noindex',
  'redirect_handle',
  'extra_table_rows',
  'variant_label',
  'wholesale_handle',
  'retail_handle',
  'family_sku',
  'TEST CERTIFICATE',
  'twin_product',
  'Styled By You',
  'Complementary products',
  'Search product boosts',
  'Related products',
  'Related products settings',
  'SKU',
  'product order code',
];

const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
const API_VERSION = process.env.SHOPIFY_ADMIN_API_VERSION || '2025-01';

if (!STORE_DOMAIN || !ACCESS_TOKEN) {
  console.error('Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_API_ACCESS_TOKEN');
  process.exit(1);
}

const GRAPHQL_ENDPOINT = `https://${STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

async function makeGraphQLRequest(query, variables = {}) {
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shopify API error ${res.status}: ${text}`);
  }

  const json = await res.json();
  // Don't throw on GraphQL errors - let caller handle them
  return json;
}

async function main() {
  try {
    console.log('Fetching metafield definitions...\n');
    
    // Query PRODUCT metafields
    const defsResponse = await makeGraphQLRequest(`
      query {
        metafieldDefinitions(first: 100, ownerType: PRODUCT) {
          edges {
            node {
              id
              name
              namespace
              key
              type {
                name
              }
            }
          }
        }
      }
    `);
    
    if (defsResponse.errors) {
      console.error('Error fetching metafield definitions:', defsResponse.errors);
      process.exit(1);
    }

    const definitions = defsResponse.data.metafieldDefinitions.edges;
    const toDelete = definitions.filter((edge) =>
      metafieldsToRemove.includes(edge.node.name)
    );

    if (toDelete.length === 0) {
      console.log('No matching metafields found to delete.');
      process.exit(0);
    }

    console.log(`Found ${toDelete.length} metafield(s) to delete:\n`);
    toDelete.forEach((edge) => {
      console.log(`  - ${edge.node.name} (${edge.node.type.name})`);
    });
    console.log();

    // Delete each metafield
    for (const edge of toDelete) {
      const { id, name } = edge.node;
      console.log(`Deleting metafield: ${name}...`);

      const deleteResponse = await makeGraphQLRequest(`
        mutation DeleteMetafieldDefinition($id: ID!) {
          metafieldDefinitionDelete(id: $id) {
            deletedDefinitionId
            userErrors {
              field
              message
            }
          }
        }
      `, { id });

      if (deleteResponse.errors) {
        console.error(`  ✗ Error: ${deleteResponse.errors[0].message}`);
      } else if (
        deleteResponse.data &&
        deleteResponse.data.metafieldDefinitionDelete.userErrors &&
        deleteResponse.data.metafieldDefinitionDelete.userErrors.length > 0
      ) {
        const errors = deleteResponse.data.metafieldDefinitionDelete.userErrors;
        console.error(`  ✗ Error: ${errors[0].message}`);
      } else if (deleteResponse.data && deleteResponse.data.metafieldDefinitionDelete.deletedDefinitionId) {
        console.log(`  ✓ Successfully deleted`);
      }
    }

    console.log('\nCompleted!');
  } catch (error) {
    console.error('Script error:', error.message);
    process.exit(1);
  }
}

main();
