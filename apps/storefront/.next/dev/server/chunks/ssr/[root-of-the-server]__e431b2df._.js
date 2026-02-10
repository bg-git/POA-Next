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
"[project]/apps/storefront/src/pages/index.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// pages/index.tsx
__turbopack_context__.s([
    "HomeContent",
    ()=>HomeContent,
    "default",
    ()=>Home,
    "getServerSideProps",
    ()=>getServerSideProps
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$components$2f$Seo$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/components/Seo.tsx [ssr] (ecmascript)");
;
;
;
;
;
const REGION_COOKIE_NAME = 'poa_region_pref';
// --- small helper to read one cookie from the header ---
function getCookieFromHeader(ctx, name) {
    const cookieHeader = ctx.req.headers.cookie;
    if (!cookieHeader) return null;
    const cookies = cookieHeader.split(';');
    for (const cookie of cookies){
        const [key, ...rest] = cookie.trim().split('=');
        if (key === name) {
            return decodeURIComponent(rest.join('='));
        }
    }
    return null;
}
const getServerSideProps = async (ctx)=>{
    try {
        const host = ctx.req.headers.host || '';
        // POA doesn't need region selection - just show normal homepage
        // Only the old Auricle .com domains would need the selector
        const isDotCom = host.endsWith('pierceofart.com') || host.endsWith('poa.com');
        // Not .com → normal homepage (including vercel.app for testing)
        return {
            props: {
                showSelector: false,
                noLayout: false
            }
        };
    } catch (error) {
        console.error('Homepage getServerSideProps error:', error);
        return {
            props: {
                showSelector: false,
                noLayout: false
            }
        };
    }
};
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;
const regions = [
    {
        id: 'gb',
        label: 'United Kingdom'
    }
];
// All languages we support overall
const languages = [
    {
        id: 'en',
        label: 'English'
    }
];
// Mapping: region -> language -> href
const regionLanguageHref = {
    gb: {
        en: 'https://pierceofart.co.uk'
    }
};
function RegionSelector() {
    const [selectedRegion, setSelectedRegion] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [selectedLanguage, setSelectedLanguage] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [rememberPreference, setRememberPreference] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const handleRegionChange = (e)=>{
        const value = e.target.value;
        setSelectedRegion(value);
        // Reset language + remember when changing region
        setSelectedLanguage('');
        setRememberPreference(false);
    };
    const handleLanguageChange = (e)=>{
        const value = e.target.value;
        setSelectedLanguage(value);
    };
    const handleRememberChange = (e)=>{
        setRememberPreference(e.target.checked);
    };
    const handleContinue = (e)=>{
        e.preventDefault();
        if (!selectedRegion || !selectedLanguage) return;
        const href = regionLanguageHref[selectedRegion]?.[selectedLanguage];
        if (!href) return;
        if (rememberPreference) {
            // Save preference cookie (on .com)
            document.cookie = `${REGION_COOKIE_NAME}=${encodeURIComponent(href)}; Max-Age=${ONE_YEAR_SECONDS}; Path=/; SameSite=Lax`;
        }
        // Redirect
        window.location.href = href;
    };
    const availableLanguagesForSelectedRegion = selectedRegion ? languages.filter((lang)=>regionLanguageHref[selectedRegion]?.[lang.id]) : [];
    const canShowRememberRow = Boolean(selectedRegion) && Boolean(selectedLanguage) && availableLanguagesForSelectedRegion.some((l)=>l.id === selectedLanguage);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$components$2f$Seo$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                title: "Choose region | PIERCE OF ART",
                description: "Select your country and language to continue to PIERCE OF ART."
            }, void 0, false, {
                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                lineNumber: 148,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
                className: "region-selector",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                    className: "region-selector__panel",
                    onSubmit: handleContinue,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
                            className: "region-selector__brand",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    src: "/auricle-logo.png",
                                    alt: "PIERCE OF ART",
                                    width: 140,
                                    height: 94,
                                    priority: true
                                }, void 0, false, {
                                    fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                    lineNumber: 157,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "region-selector__welcome",
                                    children: "Welcome to PIERCE OF ART – your premium body piercing studio."
                                }, void 0, false, {
                                    fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                    lineNumber: 163,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/storefront/src/pages/index.tsx",
                            lineNumber: 156,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                            className: "region-selector__section",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                    htmlFor: "region-select",
                                    className: "region-selector__label",
                                    children: "Choose your region"
                                }, void 0, false, {
                                    fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                    lineNumber: 170,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "region-selector__hint-text",
                                    children: "Select where you are based to see the correct store."
                                }, void 0, false, {
                                    fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                    lineNumber: 173,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "region-selector__field",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                        id: "region-select",
                                        className: "region-selector__select",
                                        value: selectedRegion,
                                        onChange: handleRegionChange,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "Select region"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                lineNumber: 183,
                                                columnNumber: 17
                                            }, this),
                                            regions.map((region)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                    value: region.id,
                                                    children: region.label
                                                }, region.id, false, {
                                                    fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                    lineNumber: 185,
                                                    columnNumber: 19
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                        lineNumber: 177,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                    lineNumber: 176,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/storefront/src/pages/index.tsx",
                            lineNumber: 169,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                            className: "region-selector__section",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                    htmlFor: "language-select",
                                    className: "region-selector__label",
                                    children: "Choose your language"
                                }, void 0, false, {
                                    fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                    lineNumber: 195,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "region-selector__hint-text",
                                    children: "Languages are based on the region selected above."
                                }, void 0, false, {
                                    fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                    lineNumber: 198,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "region-selector__field",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                        id: "language-select",
                                        className: "region-selector__select",
                                        value: selectedLanguage,
                                        onChange: handleLanguageChange,
                                        disabled: !selectedRegion || availableLanguagesForSelectedRegion.length === 0,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: selectedRegion ? 'Select language' : 'Select a region first'
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                lineNumber: 211,
                                                columnNumber: 17
                                            }, this),
                                            availableLanguagesForSelectedRegion.map((lang)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                    value: lang.id,
                                                    children: lang.label
                                                }, lang.id, false, {
                                                    fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                    lineNumber: 217,
                                                    columnNumber: 19
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                        lineNumber: 202,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                    lineNumber: 201,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/storefront/src/pages/index.tsx",
                            lineNumber: 194,
                            columnNumber: 11
                        }, this),
                        canShowRememberRow && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                            className: "region-selector__section region-selector__section--remember",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                    className: "region-selector__remember",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            checked: rememberPreference,
                                            onChange: handleRememberChange,
                                            className: "region-selector__remember-checkbox"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                            lineNumber: 229,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "region-selector__remember-label",
                                            children: "Remember this preference on this device"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                            lineNumber: 235,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                    lineNumber: 228,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    className: "region-selector__continue",
                                    children: "Continue"
                                }, void 0, false, {
                                    fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                    lineNumber: 240,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/storefront/src/pages/index.tsx",
                            lineNumber: 227,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("footer", {
                            className: "region-selector__footer"
                        }, void 0, false, {
                            fileName: "[project]/apps/storefront/src/pages/index.tsx",
                            lineNumber: 249,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/storefront/src/pages/index.tsx",
                    lineNumber: 154,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                lineNumber: 153,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function HomeContent() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$components$2f$Seo$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                title: "Premium Body Piercing Studio",
                description: "Premium body piercing studio with locations in Chesterfield and Leicester. Shop our large selection of high-quality titanium and 14k gold piercing jewellery online with fast delivery.",
                schemaType: "Organization",
                schemaData: {
                    name: "PIERCE OF ART",
                    description: "Premium body piercing studio with locations in Chesterfield and Leicester. We offer a large selection of high-quality jewellery available online with fast delivery. All products verified to ASTM standards (F136, F2923, F2999) with independent third-party testing and mill certificates.",
                    url: "https://www.pierceofart.co.uk",
                    logo: "https://www.pierceofart.co.uk/auricle-logo.png",
                    areaServed: [
                        "GB",
                        "US",
                        "AU",
                        "DE",
                        "FR",
                        "IT",
                        "ES",
                        "NL",
                        "BE",
                        "AT",
                        "PL",
                        "SE",
                        "DK",
                        "IE",
                        "PT",
                        "GR",
                        "CZ",
                        "HU"
                    ],
                    knowsAbout: [
                        "ASTM F136 Implant-Grade Titanium",
                        "ASTM F2923 Children's Jewellery Safety",
                        "ASTM F2999 Adult Jewellery Safety",
                        "EU Nickel Release Compliance",
                        "Professional Body Piercing",
                        "Material Certification",
                        "Independent Third-Party Testing",
                        "UK & EU Consumer Product Safety",
                        "Medical-Grade Jewellery",
                        "Professional Body Piercing",
                        "High Quality Piercing Jewellery"
                    ],
                    sameAs: []
                }
            }, void 0, false, {
                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                lineNumber: 264,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
                className: "home-page",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                    className: "custom-grid",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "custom-card",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "image-container",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        src: "/images/piercing_ends_and_gems_wholesale_uk.jpg",
                                        alt: "Ends & gems",
                                        fill: true,
                                        priority: true,
                                        fetchPriority: "high",
                                        style: {
                                            objectFit: 'cover'
                                        },
                                        sizes: "(max-width: 800px) 50vw, 600px"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                        lineNumber: 296,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "overlay",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                className: "overlay-title",
                                                children: "ENDS & GEMS"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                lineNumber: 306,
                                                columnNumber: 9
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "overlay-subtitle",
                                                children: "View our collection of ends & gems"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                lineNumber: 307,
                                                columnNumber: 9
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "overlay-buttons",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/browse/ends-gems",
                                                    className: "button",
                                                    children: "VIEW ALL ENDS & GEMS ⟶"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                    lineNumber: 309,
                                                    columnNumber: 11
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                lineNumber: 308,
                                                columnNumber: 9
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                        lineNumber: 305,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                lineNumber: 295,
                                columnNumber: 5
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/storefront/src/pages/index.tsx",
                            lineNumber: 294,
                            columnNumber: 3
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "custom-card",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "image-container",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        src: "/images/piercing_chains_and_charms_wholesale_uk.jpg",
                                        alt: "Chains & Charms",
                                        fill: true,
                                        priority: true,
                                        fetchPriority: "high",
                                        style: {
                                            objectFit: 'cover'
                                        },
                                        sizes: "(max-width: 800px) 50vw, 600px"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                        lineNumber: 320,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "overlay",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                className: "overlay-title",
                                                children: "CHAINS & CHARMS"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                lineNumber: 330,
                                                columnNumber: 9
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "overlay-subtitle",
                                                children: "Browse our collection of chains & charms"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                lineNumber: 331,
                                                columnNumber: 9
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "overlay-buttons",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/browse/chains-charms",
                                                    className: "button",
                                                    children: "VIEW ALL CHAINS & CHARMS ⟶"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                    lineNumber: 335,
                                                    columnNumber: 11
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                lineNumber: 334,
                                                columnNumber: 9
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                        lineNumber: 329,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                lineNumber: 319,
                                columnNumber: 5
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/storefront/src/pages/index.tsx",
                            lineNumber: 318,
                            columnNumber: 3
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "custom-card",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "image-container",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        src: "/images/Titanium_and_gold_rings_for_piercing.jpg",
                                        alt: "Gold Twist Ring Made from Titanium with pave gems",
                                        fill: true,
                                        priority: true,
                                        style: {
                                            objectFit: 'cover'
                                        },
                                        sizes: "(max-width: 800px) 50vw, 600px"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                        lineNumber: 346,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "overlay",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                className: "overlay-title",
                                                children: "RINGS & HOOPS"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                lineNumber: 355,
                                                columnNumber: 9
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "overlay-subtitle",
                                                children: "View our collection of rings"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                lineNumber: 356,
                                                columnNumber: 9
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "overlay-buttons",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/browse/rings-hoops",
                                                    className: "button",
                                                    children: "VIEW ALL RINGS ⟶"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                    lineNumber: 358,
                                                    columnNumber: 11
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                lineNumber: 357,
                                                columnNumber: 9
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                        lineNumber: 354,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                lineNumber: 345,
                                columnNumber: 5
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/storefront/src/pages/index.tsx",
                            lineNumber: 344,
                            columnNumber: 3
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "custom-card",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "image-container",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        src: "/images/polished-silver-titanium-labret-back-internal-thread-4mm-base-16g-1.2mm.jpg",
                                        alt: "Labrets",
                                        fill: true,
                                        style: {
                                            objectFit: 'cover'
                                        },
                                        sizes: "(max-width: 800px) 50vw, 600px"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                        lineNumber: 369,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "overlay",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                className: "overlay-title",
                                                children: "LABRET BARS"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                lineNumber: 377,
                                                columnNumber: 9
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "overlay-subtitle",
                                                children: "Browse our collection of labret bars"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                lineNumber: 378,
                                                columnNumber: 9
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "overlay-buttons",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/item/labret-base-titanium-polished-16-gauge",
                                                    className: "button",
                                                    children: "VIEW ALL LABRETS ⟶"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                    lineNumber: 382,
                                                    columnNumber: 11
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                lineNumber: 381,
                                                columnNumber: 9
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                        lineNumber: 376,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                lineNumber: 368,
                                columnNumber: 5
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/storefront/src/pages/index.tsx",
                            lineNumber: 367,
                            columnNumber: 3
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "custom-card",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "image-container",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        src: "/images/polished-silver-titanium-hinged-piercing-ring.jpg",
                                        alt: "Plain Hinged Rings",
                                        fill: true,
                                        style: {
                                            objectFit: 'cover'
                                        },
                                        sizes: "(max-width: 800px) 50vw, 600px"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                        lineNumber: 396,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "overlay",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                className: "overlay-title",
                                                children: "PLAIN HINGED RINGS"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                lineNumber: 404,
                                                columnNumber: 9
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "overlay-subtitle",
                                                children: "Browse our collection of plain hinged rings"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                lineNumber: 405,
                                                columnNumber: 9
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "overlay-buttons",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/item/piercing-jewellery-plain-hinged-ring-polished-silver-titanium",
                                                    className: "button",
                                                    children: "VIEW ALL PLAIN HINGED RINGS ⟶"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                    lineNumber: 409,
                                                    columnNumber: 11
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                lineNumber: 408,
                                                columnNumber: 9
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                        lineNumber: 403,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                lineNumber: 395,
                                columnNumber: 5
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/storefront/src/pages/index.tsx",
                            lineNumber: 394,
                            columnNumber: 3
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "custom-card",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "image-container",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        src: "/images/16g Titanium Curved Barbell Polished SIlver.jpg",
                                        alt: "Curved Barbells",
                                        fill: true,
                                        style: {
                                            objectFit: 'cover'
                                        },
                                        sizes: "(max-width: 800px) 50vw, 600px"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                        lineNumber: 423,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "overlay",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                className: "overlay-title",
                                                children: "CURVED BARBELLS"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                lineNumber: 431,
                                                columnNumber: 9
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "overlay-subtitle",
                                                children: "Browse our collection of curved barbells"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                lineNumber: 432,
                                                columnNumber: 9
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "overlay-buttons",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/item/curved-barbell-titanium-polished",
                                                    className: "button",
                                                    children: "VIEW ALL CURVED BARBELLS ⟶"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                    lineNumber: 436,
                                                    columnNumber: 11
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                lineNumber: 435,
                                                columnNumber: 9
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                        lineNumber: 430,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                lineNumber: 422,
                                columnNumber: 5
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/storefront/src/pages/index.tsx",
                            lineNumber: 421,
                            columnNumber: 3
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "custom-card",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "image-container",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        src: "/images/16g Internal Thread Titanium Circular Barbell Polished SIlver.jpg",
                                        alt: "Circular Barbells",
                                        fill: true,
                                        style: {
                                            objectFit: 'cover'
                                        },
                                        sizes: "(max-width: 800px) 50vw, 600px"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                        lineNumber: 447,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "overlay",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                className: "overlay-title",
                                                children: "CIRCULAR BARBELLS"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                lineNumber: 455,
                                                columnNumber: 9
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "overlay-subtitle",
                                                children: "Browse our collection of circular barbells"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                lineNumber: 456,
                                                columnNumber: 9
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "overlay-buttons",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/item/circular-barbell-titanium-polished",
                                                    className: "button",
                                                    children: "VIEW ALL CIRCULAR BARBELLS ⟶"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                    lineNumber: 460,
                                                    columnNumber: 11
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                lineNumber: 459,
                                                columnNumber: 9
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                        lineNumber: 454,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                lineNumber: 446,
                                columnNumber: 5
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/storefront/src/pages/index.tsx",
                            lineNumber: 445,
                            columnNumber: 3
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "custom-card",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "image-container",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        src: "/images/16g Titanium Barbell Polished SIlver.jpg",
                                        alt: "Straight Barbells",
                                        fill: true,
                                        style: {
                                            objectFit: 'cover'
                                        },
                                        sizes: "(max-width: 800px) 50vw, 600px"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                        lineNumber: 471,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "overlay",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                className: "overlay-title",
                                                children: "STRAIGHT BARBELLS"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                lineNumber: 479,
                                                columnNumber: 9
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "overlay-subtitle",
                                                children: "Browse our collection of straight barbells"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                lineNumber: 480,
                                                columnNumber: 9
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "overlay-buttons",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/item/barbell-titanium-polished",
                                                    className: "button",
                                                    children: "VIEW ALL STRAIGHT BARBELLS ⟶"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                    lineNumber: 484,
                                                    columnNumber: 11
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                lineNumber: 483,
                                                columnNumber: 9
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                        lineNumber: 478,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                lineNumber: 470,
                                columnNumber: 5
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/storefront/src/pages/index.tsx",
                            lineNumber: 469,
                            columnNumber: 3
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "custom-card",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "image-container",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        src: "/images/piercemed-piercing-aftercare-spray.jpg",
                                        alt: "Piercing Aftercare",
                                        fill: true,
                                        style: {
                                            objectFit: 'cover'
                                        },
                                        sizes: "(max-width: 800px) 50vw, 600px"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                        lineNumber: 495,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "overlay",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                className: "overlay-title",
                                                children: "PIERCING AFTERCARE"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                lineNumber: 503,
                                                columnNumber: 9
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "overlay-subtitle",
                                                children: "Browse our piercing aftercare"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                lineNumber: 504,
                                                columnNumber: 9
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "overlay-buttons",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/item/piercemed-piercing-aftercare",
                                                    className: "button",
                                                    children: "VIEW PIERCING AFTERCARE ⟶"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                    lineNumber: 506,
                                                    columnNumber: 11
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                                lineNumber: 505,
                                                columnNumber: 9
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                        lineNumber: 502,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                                lineNumber: 494,
                                columnNumber: 5
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/storefront/src/pages/index.tsx",
                            lineNumber: 493,
                            columnNumber: 3
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/storefront/src/pages/index.tsx",
                    lineNumber: 292,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/storefront/src/pages/index.tsx",
                lineNumber: 291,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function Home({ showSelector }) {
    if (showSelector) {
        // .com root with no cookie → show country/language selector
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(RegionSelector, {}, void 0, false, {
            fileName: "[project]/apps/storefront/src/pages/index.tsx",
            lineNumber: 525,
            columnNumber: 12
        }, this);
    }
    // .co.uk root (and any non-.com domain) → normal homepage
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(HomeContent, {}, void 0, false, {
        fileName: "[project]/apps/storefront/src/pages/index.tsx",
        lineNumber: 529,
        columnNumber: 10
    }, this);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e431b2df._.js.map