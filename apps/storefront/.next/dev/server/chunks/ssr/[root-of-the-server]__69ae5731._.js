module.exports = [
"[project]/apps/storefront/src/components/Seo.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Seo
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [ssr] (ecmascript)");
;
;
function Seo({ title, description, canonical, schemaType = 'WebPage', schemaData }) {
    const schema = schemaData && schemaType === 'TechArticle' ? {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "@id": `${schemaData.canonicalBase}/quality-assurance/${schemaData.slug}#article`,
        "headline": schemaData.headline,
        "description": schemaData.description,
        "mainEntityOfPage": `${schemaData.canonicalBase}/quality-assurance/${schemaData.slug}`,
        "datePublished": schemaData.datePublished,
        "dateModified": schemaData.dateModified,
        "inLanguage": schemaData.region === 'us' ? "en-US" : "en-GB",
        "keywords": "body piercing jewellery, compliance, UK, EU, ASTM standards",
        "author": {
            "@type": "Organization",
            "name": "PIERCE OF ART",
            "url": "https://www.pierceofart.co.uk"
        },
        "publisher": {
            "@type": "Organization",
            "name": "PIERCE OF ART",
            "url": "https://www.pierceofart.co.uk"
        },
        "isPartOf": {
            "@type": "WebSite",
            "name": "PIERCE OF ART",
            "url": "https://www.pierceofart.co.uk"
        }
    } : schemaData && schemaType === 'Organization' ? {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": schemaData.name,
        "description": schemaData.description,
        "url": schemaData.url,
        "logo": schemaData.logo || "https://www.pierceofart.co.uk/auricle-logo.png",
        "image": schemaData.logo || "https://www.pierceofart.co.uk/auricle-logo.png",
        "areaServed": schemaData.areaServed || [
            "GB",
            "EU"
        ],
        "knowsAbout": schemaData.knowsAbout || [
            "Body Piercing Jewellery",
            "ASTM F136 Titanium",
            "ASTM F2923",
            "ASTM F2999",
            "EU Nickel Release Compliance",
            "Professional Body Piercing",
            "Jewellery Safety",
            "Material Certification"
        ],
        "sameAs": schemaData.sameAs || [],
        "founder": {
            "@type": "Person",
            "name": "PIERCE OF ART Team"
        },
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "GB"
        },
        "priceRange": "£",
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "Customer Support",
            "email": "info@pierceofart.co.uk"
        }
    } : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("title", {
                children: `${title} | PIERCE OF ART`
            }, void 0, false, {
                fileName: "[project]/apps/storefront/src/components/Seo.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this),
            description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                name: "description",
                content: description
            }, void 0, false, {
                fileName: "[project]/apps/storefront/src/components/Seo.tsx",
                lineNumber: 97,
                columnNumber: 23
            }, this),
            canonical && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("link", {
                rel: "canonical",
                href: canonical
            }, void 0, false, {
                fileName: "[project]/apps/storefront/src/components/Seo.tsx",
                lineNumber: 98,
                columnNumber: 21
            }, this),
            schema && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("script", {
                type: "application/ld+json",
                dangerouslySetInnerHTML: {
                    __html: JSON.stringify(schema)
                }
            }, void 0, false, {
                fileName: "[project]/apps/storefront/src/components/Seo.tsx",
                lineNumber: 100,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/storefront/src/components/Seo.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/storefront/src/pages/404.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NotFoundPage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$components$2f$Seo$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/components/Seo.tsx [ssr] (ecmascript)");
;
;
;
const linkStyle = {
    display: 'block',
    background: '#181818',
    color: '#fff',
    padding: '10px 16px',
    textDecoration: 'none',
    fontWeight: 600
};
const secondaryStyle = {
    ...linkStyle,
    background: 'transparent',
    color: '#181818',
    border: '1px solid #181818'
};
function NotFoundPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$components$2f$Seo$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                title: "Page Not Found"
            }, void 0, false, {
                fileName: "[project]/apps/storefront/src/pages/404.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "page-content",
                style: {
                    textAlign: 'center',
                    padding: '80px 16px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                        style: {
                            fontSize: '32px',
                            marginBottom: '16px'
                        },
                        children: "404 – Page Not Found"
                    }, void 0, false, {
                        fileName: "[project]/apps/storefront/src/pages/404.tsx",
                        lineNumber: 29,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        style: {
                            marginBottom: '24px'
                        },
                        children: "Sorry, the page you are looking for doesn't exist."
                    }, void 0, false, {
                        fileName: "[project]/apps/storefront/src/pages/404.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            maxWidth: '320px',
                            margin: '0 auto'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/browse/ends-gems",
                                style: linkStyle,
                                children: "Shop Ends & Gems ⟶"
                            }, void 0, false, {
                                fileName: "[project]/apps/storefront/src/pages/404.tsx",
                                lineNumber: 44,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/browse/chains-charms",
                                style: linkStyle,
                                children: "Shop Chains & Charms ⟶"
                            }, void 0, false, {
                                fileName: "[project]/apps/storefront/src/pages/404.tsx",
                                lineNumber: 47,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/browse/backs-bars",
                                style: linkStyle,
                                children: "Shop Backs & Bars ⟶"
                            }, void 0, false, {
                                fileName: "[project]/apps/storefront/src/pages/404.tsx",
                                lineNumber: 50,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/browse/rings-hoops",
                                style: linkStyle,
                                children: "Shop Rings & Hoops ⟶"
                            }, void 0, false, {
                                fileName: "[project]/apps/storefront/src/pages/404.tsx",
                                lineNumber: 53,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                style: secondaryStyle,
                                children: "Back to Home"
                            }, void 0, false, {
                                fileName: "[project]/apps/storefront/src/pages/404.tsx",
                                lineNumber: 56,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/storefront/src/pages/404.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/storefront/src/pages/404.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__69ae5731._.js.map