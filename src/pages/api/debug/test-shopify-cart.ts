import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const shopifyStoreUrl = process.env.SHOPIFY_STORE_DOMAIN || '';
  const storefrontToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

  if (!shopifyStoreUrl || !storefrontToken) {
    return res.status(400).json({
      error: 'Missing Shopify credentials',
      hasStore: !!shopifyStoreUrl,
      hasToken: !!storefrontToken,
    });
  }

  const { productId = '55409591091583', email = 'test@example.com' } = req.body;

  const query = `
    mutation {
      cartCreate(input: {
        lines: [
          {
            merchandiseId: "gid://shopify/ProductVariant/${productId}"
            quantity: 1
          }
        ]
        buyerIdentity: {
          email: "${email}"
        }
        attributes: [
          { key: "Appointment Date", value: "2026-02-18" }
          { key: "Appointment Time", value: "11:00 AM" }
          { key: "Location", value: "Leicester" }
        ]
      }) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const url = `https://${shopifyStoreUrl}/api/2024-01/graphql.json`;

  console.log('=== Shopify Cart Test ===');
  console.log('URL:', url);
  console.log('Product ID:', productId);
  console.log('Email:', email);
  console.log('Token present:', !!storefrontToken);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontToken,
      },
      body: JSON.stringify({ query }),
    });

    console.log('HTTP Status:', response.status);
    console.log('Response OK:', response.ok);

    const result = await response.json();
    console.log('Shopify Response:', JSON.stringify(result, null, 2));

    return res.status(response.ok ? 200 : 400).json({
      success: response.ok && !result.errors && !result.data?.cartCreate?.userErrors?.length,
      httpStatus: response.status,
      httpOk: response.ok,
      shopifyResponse: result,
      cartId: result.data?.cartCreate?.cart?.id,
      checkoutUrl: result.data?.cartCreate?.cart?.checkoutUrl,
      graphqlErrors: result.errors,
      userErrors: result.data?.cartCreate?.userErrors,
    });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error('Fetch error:', err);
    return res.status(500).json({
      success: false,
      error: err.message,
      code: (error as Record<string, unknown>)?.code,
      name: err.name,
    });
  }
}
