import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.query.test === 'shopify') {
    // Test Shopify connectivity
    try {
      const shopifyStoreUrl = process.env.SHOPIFY_STORE_DOMAIN || '';
      const storefrontToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';
      
      const url = `https://${shopifyStoreUrl}/api/2024-01/graphql.json`;
      
      console.log('Testing Shopify fetch to:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': storefrontToken,
        },
        body: JSON.stringify({ query: '{ shop { name } }' }),
      });
      
      return res.status(200).json({
        test: 'shopify',
        success: true,
        statusCode: response.status,
        statusText: response.statusText,
      });
    } catch (error: any) {
      return res.status(200).json({
        test: 'shopify',
        success: false,
        error: error.message,
        code: error.code,
        name: error.name,
        errno: error.errno,
      });
    }
  }

  if (req.query.test === 'google') {
    // Test basic internet connectivity
    try {
      console.log('Testing basic fetch to Google');
      const response = await fetch('https://www.google.com');
      return res.status(200).json({
        test: 'google',
        success: true,
        statusCode: response.status,
      });
    } catch (error: any) {
      return res.status(200).json({
        test: 'google',
        success: false,
        error: error.message,
        code: error.code,
      });
    }
  }

  if (req.query.test === 'dns') {
    // Test DNS resolution
    try {
      const { resolve4 } = await import('dns').then(m => m);
      const shopifyStoreUrl = process.env.SHOPIFY_STORE_DOMAIN || 'pierce-of-art.myshopify.com';
      
      return new Promise((resolveReq) => {
        resolve4(shopifyStoreUrl, (err, addresses) => {
          if (err) {
            resolveReq(res.status(200).json({
              test: 'dns',
              host: shopifyStoreUrl,
              success: false,
              error: err.message,
              code: err.code,
            }));
          } else {
            resolveReq(res.status(200).json({
              test: 'dns',
              host: shopifyStoreUrl,
              success: true,
              addresses,
            }));
          }
        });
      });
    } catch (error: any) {
      return res.status(200).json({
        test: 'dns',
        success: false,
        error: error.message,
      });
    }
  }

  // Default: show env vars
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

  const isDev = process.env.NODE_ENV === 'development';
  
  return res.status(200).json({
    environment: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL,
    env_vars_present: envCheck,
    actual_values: isDev ? {
      SHOPIFY_STORE_DOMAIN: process.env.SHOPIFY_STORE_DOMAIN,
      SHOPIFY_STOREFRONT_ACCESS_TOKEN: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    } : 'Hidden in production',
    tests: {
      google: `?test=google - Test if Vercel can reach google.com`,
      dns: `?test=dns - Test if DNS resolution works for Shopify`,
      shopify: `?test=shopify - Test if Vercel can reach Shopify API`,
    },
  });
}
