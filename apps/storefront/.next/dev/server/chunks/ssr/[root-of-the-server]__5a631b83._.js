module.exports = [
"[externals]/gray-matter [external] (gray-matter, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("gray-matter", () => require("gray-matter"));

module.exports = mod;
}),
"[externals]/marked [external] (marked, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("marked");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
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
"[project]/apps/storefront/src/pages/information/[slug].tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>InformationPage,
    "getStaticPaths",
    ()=>getStaticPaths,
    "getStaticProps",
    ()=>getStaticProps
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$gray$2d$matter__$5b$external$5d$__$28$gray$2d$matter$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/gray-matter [external] (gray-matter, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$marked__$5b$external$5d$__$28$marked$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/marked [external] (marked, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$components$2f$Seo$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/components/Seo.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$RegionContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/RegionContext.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$marked__$5b$external$5d$__$28$marked$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$marked__$5b$external$5d$__$28$marked$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
function InformationPage({ slug, gbEn, usEn }) {
    const region = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$RegionContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useRegion"])();
    // Pick the appropriate variant based on region, with sensible fallbacks
    const variant = region === 'us' ? usEn || gbEn // .com prefers US-EN, falls back to GB-EN
     : gbEn || usEn; // .co.uk prefers GB-EN, falls back to US-EN
    if (!variant) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
            className: "info-page",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                children: "Page not found"
            }, void 0, false, {
                fileName: "[project]/apps/storefront/src/pages/information/[slug].tsx",
                lineNumber: 33,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/storefront/src/pages/information/[slug].tsx",
            lineNumber: 32,
            columnNumber: 7
        }, this);
    }
    const canonicalBase = region === 'us' ? 'https://www.pierceofart.co.uk' : 'https://www.pierceofart.co.uk';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
        className: "info-page",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$components$2f$Seo$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                title: variant.title,
                description: variant.description || '',
                canonical: `${canonicalBase}/information/${slug}`
            }, void 0, false, {
                fileName: "[project]/apps/storefront/src/pages/information/[slug].tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                children: variant.title
            }, void 0, false, {
                fileName: "[project]/apps/storefront/src/pages/information/[slug].tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                dangerouslySetInnerHTML: {
                    __html: variant.html
                }
            }, void 0, false, {
                fileName: "[project]/apps/storefront/src/pages/information/[slug].tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                className: "info-page__translation-note",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        children: "Local language and translations"
                    }, void 0, false, {
                        fileName: "[project]/apps/storefront/src/pages/information/[slug].tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this),
                    region === 'us' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        children: [
                            "We aim to provide localized and translated versions of this page so information is easier to understand. Translations are offered for convenience only and may not always be complete or fully accurate. If there is any difference or uncertainty between a translated version and the original UK English version of these terms or policies, the UK English version will take priority and will govern your use of our services. If anything in a translation is unclear, email ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                children: "info@pierceofart.co.uk"
                            }, void 0, false, {
                                fileName: "[project]/apps/storefront/src/pages/information/[slug].tsx",
                                lineNumber: 65,
                                columnNumber: 19
                            }, this),
                            " so we can assist."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/storefront/src/pages/information/[slug].tsx",
                        lineNumber: 57,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        children: [
                            "We aim to provide localised and translated versions of this page so information is easier to follow. Translations are offered for convenience only and may not always be complete or fully accurate. If there is any difference or uncertainty between a translated version and the UK English version of these terms or policies, the UK English version takes priority and governs your use of our services. If anything in a translation is unclear, email",
                            ' ',
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                children: "info@pierceofart.co.uk"
                            }, void 0, false, {
                                fileName: "[project]/apps/storefront/src/pages/information/[slug].tsx",
                                lineNumber: 76,
                                columnNumber: 13
                            }, this),
                            " so we can help."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/storefront/src/pages/information/[slug].tsx",
                        lineNumber: 68,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/storefront/src/pages/information/[slug].tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/storefront/src/pages/information/[slug].tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
const getStaticPaths = async ()=>{
    const dir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'content/information');
    const files = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readdirSync(dir).filter((f)=>f.endsWith('.md'));
    const slugs = Array.from(new Set(files.map((file)=>{
        const base = file.replace(/\.md$/i, '');
        const [slug] = base.split('.');
        return slug || null;
    }).filter((slug)=>Boolean(slug))));
    const paths = slugs.map((slug)=>({
            params: {
                slug
            }
        }));
    return {
        paths,
        fallback: false
    };
};
const getStaticProps = async ({ params })=>{
    const slug = params?.slug;
    const baseDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'content/information');
    const loadMarkdown = (filename)=>{
        const fullPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(baseDir, filename);
        if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(fullPath)) return null;
        const raw = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(fullPath, 'utf8');
        const { data, content } = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$gray$2d$matter__$5b$external$5d$__$28$gray$2d$matter$2c$__cjs$29$__["default"])(raw);
        return {
            title: data.title || slug,
            description: data.description || null,
            html: __TURBOPACK__imported__module__$5b$externals$5d2f$marked__$5b$external$5d$__$28$marked$2c$__esm_import$29$__["marked"].parse(content)
        };
    };
    const defaultVariant = loadMarkdown(`${slug}.md`);
    const gbEn = loadMarkdown(`${slug}.gb-en.md`) || defaultVariant;
    const usEn = loadMarkdown(`${slug}.us-en.md`) || defaultVariant;
    if (!gbEn && !usEn) {
        return {
            notFound: true
        };
    }
    return {
        props: {
            slug,
            gbEn: gbEn || null,
            usEn: usEn || null
        },
        revalidate: 60
    };
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5a631b83._.js.map