module.exports = [
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/apps/storefront/src/pages/api/shopify/blog/articles.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || '';
const SHOPIFY_STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';
// Fetch all articles from a specific blog
async function fetchBlogArticles(handle = 'magazine', limit = 250) {
    const query = `
    {
      blog(handle: "${handle}") {
        articles(first: ${limit}) {
          edges {
            node {
              id
              title
              handle
              excerpt
              contentHtml
              publishedAt
              image {
                url
                altText
              }
              author {
                name
              }
            }
          }
        }
      }
    }
  `;
    const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
        },
        body: JSON.stringify({
            query
        })
    });
    if (!response.ok) {
        throw new Error(`Shopify API error: ${response.status}`);
    }
    const data = await response.json();
    if (data.errors) {
        throw new Error(`GraphQL error: ${data.errors[0].message}`);
    }
    return data.data?.blog?.articles?.edges?.map((edge)=>({
            id: edge.node.id,
            title: edge.node.title,
            handle: edge.node.handle,
            excerpt: edge.node.excerpt || '',
            content: edge.node.contentHtml || '',
            publishedAt: edge.node.publishedAt,
            image: edge.node.image,
            author: edge.node.author
        })) || [];
}
// Fetch a single article by handle
async function fetchArticleByHandle(handle, blogHandle = 'magazine') {
    const query = `
    {
      blog(handle: "${blogHandle}") {
        articleByHandle(handle: "${handle}") {
          id
          title
          handle
          excerpt
          contentHtml
          publishedAt
          image {
            url
            altText
          }
          author {
            name
          }
        }
      }
    }
  `;
    const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
        },
        body: JSON.stringify({
            query
        })
    });
    if (!response.ok) {
        throw new Error(`Shopify API error: ${response.status}`);
    }
    const data = await response.json();
    if (data.errors) {
        console.error('GraphQL error:', data.errors);
        throw new Error(`GraphQL error: ${data.errors[0].message}`);
    }
    const article = data.data?.blog?.articleByHandle;
    if (!article) return null;
    console.log('Article content received:', {
        title: article.title,
        hasContent: !!article.contentHtml,
        contentLength: article.contentHtml?.length || 0
    });
    return {
        id: article.id,
        title: article.title,
        handle: article.handle,
        excerpt: article.excerpt || '',
        content: article.contentHtml || article.content || '',
        publishedAt: article.publishedAt,
        image: article.image,
        author: article.author
    };
}
async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({
            error: 'Method not allowed'
        });
    }
    try {
        const { handle, blog = 'magazine' } = req.query;
        if (handle) {
            // Fetch single article
            const article = await fetchArticleByHandle(handle, blog);
            if (!article) {
                return res.status(404).json({
                    error: 'Article not found'
                });
            }
            return res.status(200).json({
                articles: [
                    article
                ]
            });
        } else {
            // Fetch all articles
            const articles = await fetchBlogArticles(blog);
            return res.status(200).json({
                articles
            });
        }
    } catch (error) {
        console.error('Blog fetch error:', error);
        return res.status(500).json({
            error: 'Failed to fetch blog articles'
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__08d4f46e._.js.map