import type { NextApiRequest, NextApiResponse } from 'next';

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

interface CartLine {
  merchandiseId: string;
  quantity: number;
}

interface CartUpdateRequest {
  checkoutId: string;
  items: Array<{
    variantId: string;
    quantity: number;
  }>;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { checkoutId, items }: CartUpdateRequest = req.body;

  if (!checkoutId || !items) {
    return res.status(400).json({ message: 'Missing checkoutId or items' });
  }

  const lines: CartLine[] = items.map((item) => ({
    merchandiseId: item.variantId,
    quantity: item.quantity,
  }));

  // Remove all existing lines and add new ones
  const query = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 250) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    // First, get current cart to find existing line IDs
    const getQuery = `
      query cart($id: ID!) {
        cart(id: $id) {
          id
          checkoutUrl
          lines(first: 250) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                  }
                }
              }
            }
          }
        }
      }
    `;

    const getRes = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-04/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN!,
      },
      body: JSON.stringify({ query: getQuery, variables: { id: checkoutId } }),
    });

    const getJson = await getRes.json();
    const currentCart = getJson.data?.cart;

    if (!currentCart) {
      return res.status(404).json({ message: 'Cart not found', debug: getJson });
    }

    // Build update operations: update existing lines or create new ones
    const cartLineUpdates = lines.map((line) => {
      const existingLine = (currentCart.lines?.edges || []).find(
        (edge: { node: { id: string; merchandise?: { id?: string } } }) =>
          edge.node.merchandise?.id === line.merchandiseId
      );

      if (existingLine) {
        return {
          id: existingLine.node.id,
          quantity: line.quantity,
        };
      }

      // This shouldn't happen as we're only updating existing items
      return {
        merchandiseId: line.merchandiseId,
        quantity: line.quantity,
      };
    });

    // Update the cart with new quantities
    const updateRes = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-04/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN!,
      },
      body: JSON.stringify({
        query,
        variables: { cartId: checkoutId, lines: cartLineUpdates },
      }),
    });

    const updateJson = await updateRes.json();
    const updatedCart = updateJson.data?.cartLinesUpdate?.cart;

    if (!updatedCart) {
      console.error('Shopify cartLinesUpdate error:', JSON.stringify(updateJson, null, 2));
      return res.status(500).json({ message: 'Failed to update cart', debug: updateJson });
    }

    return res.status(200).json({ cart: updatedCart });
  } catch (error) {
    console.error('Cart update error:', error);
    return res.status(500).json({ message: 'Failed to update cart', error: String(error) });
  }
}
