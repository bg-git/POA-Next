module.exports = [
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/apps/storefront/src/lib/cookies.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "COOKIE_MAX_AGE",
    ()=>COOKIE_MAX_AGE,
    "COOKIE_NAME",
    ()=>COOKIE_NAME,
    "clearCustomerCookie",
    ()=>clearCustomerCookie,
    "setCustomerCookie",
    ()=>setCustomerCookie
]);
const COOKIE_NAME = 'customer_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days in seconds
const COOKIE_DOMAIN = process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN || '.pierceofart.co.uk';
function setCustomerCookie(res, token) {
    const expires = new Date(Date.now() + COOKIE_MAX_AGE * 1000);
    const cookie = `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; SameSite=None; Max-Age=${COOKIE_MAX_AGE}; Expires=${expires.toUTCString()}; Domain=${COOKIE_DOMAIN}; Secure`;
    res.setHeader('Set-Cookie', cookie);
}
function clearCustomerCookie(res) {
    const cookie = `${COOKIE_NAME}=; Path=/; SameSite=None; Max-Age=0; Domain=${COOKIE_DOMAIN}; Secure`;
    res.setHeader('Set-Cookie', cookie);
}
}),
"[project]/apps/storefront/src/pages/api/shopify/get-customer.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$lib$2f$cookies$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/lib/cookies.ts [api] (ecmascript)");
;
const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const STOREFRONT_URL = `https://${SHOPIFY_DOMAIN}/api/2024-04/graphql.json`;
const ADMIN_API_KEY = process.env.SHOPIFY_ADMIN_API_KEY;
async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed'
        });
    }
    const token = req.cookies[__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$lib$2f$cookies$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["COOKIE_NAME"]];
    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Not authenticated'
        });
    }
    const query = `
    query customer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        firstName
        lastName
        email
        phone
        acceptsMarketing
        createdAt
        updatedAt
        websiteMetafield: metafield(namespace: "custom", key: "website") {
      value
    }
        socialMetafield: metafield(namespace: "custom", key: "social") {
      value
    }
        defaultAddress {
          id
          firstName
          lastName
          company
          address1
          address2
          city
          province
          country
          zip
          phone
        }
        addresses(first: 10) {
          edges {
            node {
              id
              firstName
              lastName
              company
              address1
              address2
              city
              province
              country
              zip
              phone
            }
          }
        }
      }
    }
  `;
    const variables = {
        customerAccessToken: token
    };
    try {
        const response = await fetch(STOREFRONT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN
            },
            body: JSON.stringify({
                query,
                variables
            })
        });
        const json = await response.json();
        if (json.errors || !json.data.customer) {
            return res.status(401).json({
                success: false,
                error: 'Invalid token'
            });
        }
        const customer = json.data.customer;
        let website = customer.websiteMetafield?.value || '';
        let social = customer.socialMetafield?.value || '';
        let tags = [];
        if (customer.email) {
            const adminRes = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/2024-04/customers/search.json?query=email:${encodeURIComponent(customer.email)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': ADMIN_API_KEY
                }
            });
            const adminJson = await adminRes.json();
            if (adminJson.customers && adminJson.customers.length > 0) {
                const adminCustomer = adminJson.customers[0];
                const customerId = adminCustomer.id;
                // Get tags
                if (adminCustomer.tags) {
                    tags = adminCustomer.tags.split(',').map((t)=>t.trim()).filter(Boolean);
                }
                // If we don't have website or social from Storefront API, try to get them from Admin API metafields
                if (!website || !social) {
                    const metafieldRes = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/2024-07/customers/${customerId}/metafields.json?namespace=custom`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Shopify-Access-Token': ADMIN_API_KEY
                        }
                    });
                    const metafieldJson = await metafieldRes.json();
                    if (metafieldJson.metafields && metafieldJson.metafields.length > 0) {
                        metafieldJson.metafields.forEach((metafield)=>{
                            if (metafield.key === 'website' && !website) {
                                website = metafield.value || '';
                            }
                            if (metafield.key === 'social' && !social) {
                                social = metafield.value || '';
                            }
                        });
                    }
                }
            }
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$lib$2f$cookies$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["setCustomerCookie"])(res, token);
        return res.status(200).json({
            success: true,
            customer: {
                ...customer,
                website,
                social,
                tags
            }
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        return res.status(500).json({
            success: false,
            error: message
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4948f22a._.js.map