import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if env vars exist
  const envCheck = {
    shopifyStoreDomain: !!process.env.SHOPIFY_STORE_DOMAIN,
    shopifyStorefrontToken: !!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseServiceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  };

  // Return the actual values ONLY in development to prevent leaking secrets
  const isDev = process.env.NODE_ENV === 'development';
  
  return res.status(200).json({
    environment: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL,
    env_vars_present: envCheck,
    actual_values: isDev ? {
      SHOPIFY_STORE_DOMAIN: process.env.SHOPIFY_STORE_DOMAIN,
      SHOPIFY_STOREFRONT_ACCESS_TOKEN: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    } : 'Hidden in production',
  });
}
