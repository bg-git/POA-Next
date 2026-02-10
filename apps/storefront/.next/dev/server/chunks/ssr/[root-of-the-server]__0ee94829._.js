module.exports = [
"[project]/apps/storefront/src/lib/shopify.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "shopifyFetch",
    ()=>shopifyFetch
]);
const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
async function shopifyFetch({ query, variables = {} }) {
    try {
        const res = await fetch(`https://${domain}/api/2024-04/graphql.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': token
            },
            body: JSON.stringify({
                query,
                variables
            })
        });
        if (!res.ok) {
            throw new Error(`Shopify API error: ${res.status} ${res.statusText}`);
        }
        const json = await res.json();
        if (json.errors) throw new Error(JSON.stringify(json.errors));
        return json.data;
    } catch (error) {
        throw new Error(`Shopify fetch failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}
}),
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
"[project]/apps/storefront/src/lib/mapStyledByYou.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/lib/mapStyledByYou.ts
__turbopack_context__.s([
    "mapStyledByYou",
    ()=>mapStyledByYou
]);
const norm = (s)=>s.toLowerCase().replace(/[^a-z0-9]/g, "");
const match = (k, target)=>norm(k).endsWith(norm(target));
const isMediaImageRef = (ref)=>!!ref && ref.__typename === "MediaImage";
const isProductRef = (ref)=>!!ref && ref.__typename === "Product";
function mapStyledByYou(edges, productId) {
    if (!Array.isArray(edges)) return [];
    return edges.map((edge)=>{
        const node = edge.node;
        const pick = (t)=>node.fields.find((f)=>match(f.key, t));
        const imgRef = pick("image")?.reference;
        if (!isMediaImageRef(imgRef)) return null;
        const productRef = pick("product")?.reference;
        const okForProduct = !productRef || !productId || isProductRef(productRef) && productRef.id === productId;
        if (!okForProduct) return null;
        const image = imgRef.image;
        return {
            id: node.id,
            image,
            alt: pick("alt")?.value || image.altText || "",
            credit: pick("credit")?.value ?? undefined,
            url: pick("url")?.value ?? undefined,
            linkText: pick("link_text")?.value ?? undefined
        };
    }).filter((x)=>x !== null);
}
}),
"[externals]/styled-jsx/style.js [external] (styled-jsx/style.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("styled-jsx/style.js", () => require("styled-jsx/style.js"));

module.exports = mod;
}),
"[project]/apps/storefront/src/components/ProductGallery.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/components/ProductGallery.tsx
__turbopack_context__.s([
    "default",
    ()=>ProductGallery
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-jsx/style.js [external] (styled-jsx/style.js, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
;
;
/** Only render the gallery variant for the current viewport */ function useIsDesktop() {
    const [isDesktop, setIsDesktop] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const mq = window.matchMedia("(min-width: 769px)");
        const onChange = ()=>setIsDesktop(mq.matches);
        onChange();
        mq.addEventListener("change", onChange);
        return ()=>mq.removeEventListener("change", onChange);
    }, []);
    return isDesktop;
}
function ProductGallery({ images, defaultActive = 0 }) {
    const [active, setActive] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(defaultActive);
    const [heroIndex, setHeroIndex] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(defaultActive);
    const isDesktop = useIsDesktop();
    const snapRowRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const safeImages = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>(images || []).filter(Boolean), [
        images
    ]);
    // Keep active in sync if images or requested default changes
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        setActive(defaultActive);
        setHeroIndex(defaultActive);
    }, [
        images,
        defaultActive
    ]);
    // Track the last non-UGC image that was active (hero image)
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!safeImages[active]?.isUGC) setHeroIndex(active);
    }, [
        active,
        safeImages
    ]);
    // Thumbnails: hero + UGC images (if any UGC exists)
    const thumbs = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        if (!safeImages.some((img)=>img.isUGC)) return [];
        return [
            {
                img: safeImages[0],
                i: 0
            },
            ...safeImages.map((img, i)=>({
                    img,
                    i
                })).filter(({ img, i })=>i > 0 && img.isUGC)
        ];
    }, [
        safeImages
    ]);
    // Mobile: active hero + all UGC images
    const mobileImages = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        const imgs = [];
        if (safeImages[heroIndex]) imgs.push({
            img: safeImages[heroIndex],
            i: heroIndex
        });
        safeImages.forEach((img, i)=>{
            if (img.isUGC && i !== heroIndex) imgs.push({
                img,
                i
            });
        });
        return imgs;
    }, [
        safeImages,
        heroIndex
    ]);
    // Scroll the mobile carousel when the active index changes (e.g. variant switch)
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (isDesktop) return;
        const el = snapRowRef.current;
        if (!el) return;
        const slideIndex = mobileImages.findIndex(({ i })=>i === active);
        const target = el.offsetWidth * Math.max(slideIndex, 0);
        if (Math.abs(el.scrollLeft - target) < 1) return;
        el.scrollTo({
            left: target
        });
    }, [
        active,
        isDesktop,
        mobileImages
    ]);
    if (!safeImages.length) return null;
    const main = safeImages[Math.min(active, safeImages.length - 1)];
    let thumbIndex = 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "jsx-e3757942a9114ea1",
        children: [
            isDesktop ? /* DESKTOP: main image + overlayed thumbnail strip (bottom-left) */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "jsx-e3757942a9114ea1" + " " + "gallery-desktop",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "jsx-e3757942a9114ea1" + " " + "img-wrap",
                    children: [
                        main.isUGC && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "jsx-e3757942a9114ea1" + " " + "badges",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: "jsx-e3757942a9114ea1" + " " + "badge-ugc",
                                    children: "Styled by you"
                                }, void 0, false, {
                                    fileName: "[project]/apps/storefront/src/components/ProductGallery.tsx",
                                    lineNumber: 97,
                                    columnNumber: 17
                                }, this),
                                main.credit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: "jsx-e3757942a9114ea1" + " " + "badge-credit",
                                    children: [
                                        "Image provided by ",
                                        main.credit
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/storefront/src/components/ProductGallery.tsx",
                                    lineNumber: 99,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/storefront/src/components/ProductGallery.tsx",
                            lineNumber: 96,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            src: main.url,
                            alt: main.alt || "",
                            width: main.width,
                            height: main.height,
                            priority: true,
                            fetchPriority: "high",
                            loading: "eager",
                            sizes: "(min-width:1024px) calc((min(1400px,100vw) - 32px - 24px)/2), 100vw",
                            style: {
                                width: "100%",
                                height: "auto",
                                objectFit: "cover",
                                display: "block"
                            }
                        }, main.url, false, {
                            fileName: "[project]/apps/storefront/src/components/ProductGallery.tsx",
                            lineNumber: 104,
                            columnNumber: 13
                        }, this),
                        thumbs.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            role: "group",
                            "aria-label": "Product thumbnails",
                            className: "jsx-e3757942a9114ea1" + " " + "thumbs-overlay",
                            children: thumbs.map(({ img, i })=>{
                                thumbIndex += 1;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    "aria-label": `Show image ${thumbIndex}`,
                                    onClick: ()=>setActive(i),
                                    type: "button",
                                    className: "jsx-e3757942a9114ea1" + " " + `thumb ${i === active ? "is-active" : ""}`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-e3757942a9114ea1" + " " + "thumb-frame",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            src: img.url,
                                            alt: "",
                                            width: 60,
                                            height: 75,
                                            loading: "lazy",
                                            decoding: "async",
                                            fetchPriority: "low",
                                            sizes: "60px",
                                            quality: 40
                                        }, void 0, false, {
                                            fileName: "[project]/apps/storefront/src/components/ProductGallery.tsx",
                                            lineNumber: 134,
                                            columnNumber: 25
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/storefront/src/components/ProductGallery.tsx",
                                        lineNumber: 133,
                                        columnNumber: 23
                                    }, this)
                                }, img.url + i, false, {
                                    fileName: "[project]/apps/storefront/src/components/ProductGallery.tsx",
                                    lineNumber: 126,
                                    columnNumber: 21
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/apps/storefront/src/components/ProductGallery.tsx",
                            lineNumber: 118,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/storefront/src/components/ProductGallery.tsx",
                    lineNumber: 94,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/storefront/src/components/ProductGallery.tsx",
                lineNumber: 93,
                columnNumber: 9
            }, this) : /* MOBILE: swipe-only (scroll-snap), with dots */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                "aria-label": "Product images",
                className: "jsx-e3757942a9114ea1" + " " + "gallery-mobile",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        ref: snapRowRef,
                        onScroll: (e)=>{
                            const idx = Math.round(e.currentTarget.scrollLeft / e.currentTarget.offsetWidth);
                            const safeIdx = mobileImages[idx]?.i ?? 0;
                            setActive(safeIdx);
                        },
                        className: "jsx-e3757942a9114ea1" + " " + "snap-row",
                        children: mobileImages.map(({ img, i }, mIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-e3757942a9114ea1" + " " + "snap-card",
                                children: [
                                    img.isUGC && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-e3757942a9114ea1" + " " + "badges",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "jsx-e3757942a9114ea1" + " " + "badge-ugc",
                                                children: "Styled by you"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/components/ProductGallery.tsx",
                                                lineNumber: 171,
                                                columnNumber: 21
                                            }, this),
                                            img.credit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "jsx-e3757942a9114ea1" + " " + "badge-credit",
                                                children: [
                                                    "Image provided by ",
                                                    img.credit
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/storefront/src/components/ProductGallery.tsx",
                                                lineNumber: 173,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/storefront/src/components/ProductGallery.tsx",
                                        lineNumber: 170,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        src: img.url,
                                        alt: img.alt || "",
                                        width: img.width,
                                        height: img.height,
                                        priority: mIdx === 0,
                                        fetchPriority: mIdx === 0 ? "high" : "low",
                                        loading: mIdx === 0 ? "eager" : "lazy",
                                        decoding: "async",
                                        sizes: "100vw",
                                        style: {
                                            width: "100%",
                                            height: "auto",
                                            objectFit: "cover",
                                            display: "block"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/apps/storefront/src/components/ProductGallery.tsx",
                                        lineNumber: 177,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, img.url + i, true, {
                                fileName: "[project]/apps/storefront/src/components/ProductGallery.tsx",
                                lineNumber: 168,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/apps/storefront/src/components/ProductGallery.tsx",
                        lineNumber: 156,
                        columnNumber: 11
                    }, this),
                    mobileImages.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "jsx-e3757942a9114ea1" + " " + "dots",
                        children: mobileImages.map(({ i }, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-e3757942a9114ea1" + " " + `dot ${i === active ? "is-active" : ""}`
                            }, idx, false, {
                                fileName: "[project]/apps/storefront/src/components/ProductGallery.tsx",
                                lineNumber: 195,
                                columnNumber: 17
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/apps/storefront/src/components/ProductGallery.tsx",
                        lineNumber: 193,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/storefront/src/components/ProductGallery.tsx",
                lineNumber: 155,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"], {
                id: "e3757942a9114ea1",
                children: ".img-wrap.jsx-e3757942a9114ea1{width:100%;position:relative}.badges.jsx-e3757942a9114ea1{z-index:2;pointer-events:none;flex-direction:column;gap:4px;display:flex;position:absolute;top:8px;left:8px}.badge-ugc.jsx-e3757942a9114ea1,.badge-credit.jsx-e3757942a9114ea1{color:#fff;white-space:nowrap;text-overflow:ellipsis;background:#181818;border:1px solid #181818;max-width:max-content;padding:6px 8px;font-size:11px;line-height:1;display:inline-block;overflow:hidden}.thumbs-overlay.jsx-e3757942a9114ea1{-webkit-backdrop-filter:blur(4px);z-index:1;background:#fff9;border-radius:8px;gap:8px;padding:6px;display:flex;position:absolute;bottom:12px;left:12px}.thumb.jsx-e3757942a9114ea1{cursor:pointer;background:0 0;border:0;padding:0}.thumb-frame.jsx-e3757942a9114ea1{border:1px solid #e5e5e5;width:60px;height:75px;position:relative;overflow:hidden}.thumb.is-active.jsx-e3757942a9114ea1 .thumb-frame.jsx-e3757942a9114ea1{outline-offset:-2px;outline:2px solid #181818}.gallery-mobile.jsx-e3757942a9114ea1{position:relative}.snap-row.jsx-e3757942a9114ea1{scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;gap:8px;display:flex;overflow-x:auto}.snap-card.jsx-e3757942a9114ea1{scroll-snap-align:start;aspect-ratio:4/5;min-width:100%;position:relative}.dots.jsx-e3757942a9114ea1{gap:6px;display:flex;position:absolute;bottom:8px;left:50%;transform:translate(-50%)}.dot.jsx-e3757942a9114ea1{background:#18181840;border-radius:50%;width:6px;height:6px}.dot.is-active.jsx-e3757942a9114ea1{background:#181818}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/storefront/src/components/ProductGallery.tsx",
        lineNumber: 90,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/storefront/src/pages/products/[handle].tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProductPage,
    "getStaticPaths",
    ()=>getStaticPaths,
    "getStaticProps",
    ()=>getStaticProps
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$lib$2f$shopify$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/lib/shopify.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$CartContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/CartContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$components$2f$Seo$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/components/Seo.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/AuthContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$ToastContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/ToastContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$lib$2f$mapStyledByYou$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/lib/mapStyledByYou.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$components$2f$ProductGallery$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/components/ProductGallery.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dynamic$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dynamic.js [ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
// ✅ Lazy-loaded, non-critical UI
const StyledByYouLazy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dynamic$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/apps/storefront/src/components/StyledByYou.tsx [ssr] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/apps/storefront/src/components/StyledByYou.tsx [client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false,
    loading: ()=>null
});
const FavouriteToggleLazy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dynamic$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/apps/storefront/src/components/FavouriteToggle.tsx [ssr] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/apps/storefront/src/components/FavouriteToggle.tsx [client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false,
    loading: ()=>null
});
function ProductPage({ product, ugcItems }) {
    const { addToCart, openDrawer } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$CartContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useCart"])();
    const { showToast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$ToastContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useToast"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [selectedVariantId, setSelectedVariantId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [showVariantImage, setShowVariantImage] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [qty, setQty] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const variantEdges = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>product?.variants?.edges || [], [
        product
    ]);
    const defaultVariant = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        const nodes = (variantEdges || []).map((v)=>v.node);
        if (nodes.length === 0) return null;
        // Prefer first in-stock variant; otherwise fall back to the first variant
        const firstInStock = nodes.find((v)=>v.availableForSale && (v.quantityAvailable ?? 0) > 0);
        return firstInStock ?? nodes[0];
    }, [
        variantEdges
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!defaultVariant) {
            setSelectedVariantId(null);
            setQty(0);
            return;
        }
        setSelectedVariantId(defaultVariant.id);
        setShowVariantImage(false);
        setQty(defaultVariant.availableForSale && (defaultVariant.quantityAvailable ?? 0) > 0 ? 1 : 0);
    }, [
        router.asPath,
        product?.id,
        defaultVariant
    ]);
    const { user, refreshUser, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const v = variantEdges.find((e)=>e.node.id === selectedVariantId)?.node;
        if (!v) return;
        setQty((v.quantityAvailable ?? 0) > 0 ? 1 : 0);
        if (!v.image) {
            setShowVariantImage(false);
        }
    }, [
        selectedVariantId,
        variantEdges
    ]);
    const selectedVariant = product?.variants?.edges?.find((v)=>v.node.id === selectedVariantId)?.node;
    // Build the combined gallery: official image first, optional variant image,
    // then up to 2 “Styled By You” images
    const galleryImages = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        const official = (product.images?.edges || []).slice(0, 1).map(({ node })=>({
                url: node.url,
                width: node.width,
                height: node.height,
                alt: node.altText || product.title,
                isUGC: false
            }));
        const variantImg = showVariantImage && selectedVariant?.image ? [
            {
                url: selectedVariant.image.url,
                width: selectedVariant.image.width,
                height: selectedVariant.image.height,
                alt: selectedVariant.image.altText || product.title,
                isUGC: false
            }
        ] : [];
        const sby = (ugcItems || []).slice(0, 2).map((it)=>({
                url: it.image.url,
                width: it.image.width,
                height: it.image.height,
                alt: it.alt || "Styled by you",
                isUGC: true,
                credit: it.credit || undefined
            }));
        // De-dupe by base URL, preserving order
        const seen = new Set();
        return [
            ...official,
            ...variantImg,
            ...sby
        ].filter((img)=>{
            const base = img.url.split("?")[0];
            if (seen.has(base)) return false;
            seen.add(base);
            return true;
        });
    }, [
        product.images,
        product.title,
        ugcItems,
        selectedVariant?.image,
        showVariantImage
    ]);
    const isSoldOut = !selectedVariant?.availableForSale || selectedVariant?.quantityAvailable <= 0;
    const maxQty = selectedVariant?.quantityAvailable ?? 9999;
    const rawPrice = selectedVariant ? parseFloat(selectedVariant.price.amount) : parseFloat(product?.priceRange?.minVariantPrice?.amount || '0');
    const formattedPrice = rawPrice % 1 === 0 ? rawPrice.toFixed(0) : rawPrice.toFixed(2);
    const metafields = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>product?.metafields || [], [
        product?.metafields
    ]);
    const getFieldValue = (key)=>{
        const field = metafields.find((f)=>f?.key === key);
        if (!field?.value) return null;
        const value = field.value.trim();
        if (!value.startsWith('{') && !value.startsWith('[')) {
            return value;
        }
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed.join(', ') : String(parsed);
        } catch  {
            return value;
        }
    };
    const selectedSku = selectedVariant?.sku || getFieldValue('sku');
    const currentVariantLabel = getFieldValue('variant_label') || 'Select an option';
    const rawVariants = getFieldValue('variants');
    const variantOptions = rawVariants ? rawVariants.split(',').map((entry)=>{
        const [label, url] = entry.trim().split('::');
        return {
            label: label?.trim(),
            url: url?.trim()
        };
    }) : [];
    const cellLabelStyle = {
        padding: '8px',
        fontWeight: 500,
        background: '#f9f9f9',
        border: '1px solid #e0e0e0',
        textTransform: 'uppercase',
        fontSize: '12px',
        width: '40%'
    };
    const cellValueStyle = {
        padding: '8px',
        border: '1px solid #e0e0e0',
        fontSize: '14px',
        width: '60%'
    };
    const fieldLabels = {
        title: 'Title',
        name: 'Name',
        sku: 'SKU',
        metal: 'Metal',
        alloy: 'Alloy',
        metal_colour: 'Metal Colour',
        thread_type: 'Thread Type',
        fitting: 'Fitting',
        gem_type: 'Gem Type',
        gem_colour: 'Gem Colour',
        gauge: 'Gauge',
        base_size: 'Base Size',
        length: 'Length',
        width: 'Width',
        height: 'Height',
        sold_as: 'Sold As',
        shipping: 'Shipping'
    };
    // ✅ Viewport-gate "Styled By You"
    const sbyAnchorRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const [showSBY, setShowSBY] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const el = sbyAnchorRef.current;
        if (!el) return;
        const io = new IntersectionObserver(([entry])=>{
            if (entry.isIntersecting) {
                setShowSBY(true);
                io.disconnect();
            }
        }, {
            rootMargin: '300px'
        });
        io.observe(el);
        return ()=>io.disconnect();
    }, []);
    // ✅ Idle-load FavouriteToggle (with proper typing from src/types/idle-callback.d.ts)
    const [showFav, setShowFav] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        let cancel;
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        else {
            const t = window.setTimeout(()=>setShowFav(true), 300);
            cancel = ()=>window.clearTimeout(t);
        }
        return ()=>{
            if (cancel) cancel();
        };
    }, []);
    if (!product) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            style: {
                padding: '16px'
            },
            children: "Product not found."
        }, void 0, false, {
            fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
            lineNumber: 324,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$components$2f$Seo$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                title: getFieldValue('title') || product.title,
                description: getFieldValue('description') || `Buy ${product.title} in 14k gold or titanium.`,
                canonical: `https://www.pierceofart.co.uk/item/${product.handle}`
            }, void 0, false, {
                fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                lineNumber: 329,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("script", {
                type: "application/ld+json",
                dangerouslySetInnerHTML: {
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Product",
                        "name": product.title,
                        "image": product.images?.edges?.map((img)=>img?.node?.url).filter(Boolean),
                        "description": product.metafields?.find((m)=>m?.key === "description")?.value || "",
                        "sku": product.metafields?.find((m)=>m?.key === "sku")?.value || "",
                        "brand": {
                            "@type": "Brand",
                            "name": "PIERCE OF ART"
                        },
                        "offers": {
                            "@type": "Offer",
                            "url": `https://www.pierceofart.co.uk/item/${product.handle}`,
                            "priceCurrency": "GBP",
                            "price": "0.01",
                            "availability": "https://schema.org/InStock",
                            "priceSpecification": {
                                "@type": "UnitPriceSpecification",
                                "priceCurrency": "GBP",
                                "price": "0.01"
                            }
                        }
                    })
                }
            }, void 0, false, {
                fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                lineNumber: 337,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
                style: {
                    maxWidth: '1400px',
                    margin: '0 auto',
                    padding: '16px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "product-layout",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "product-image",
                                style: {
                                    position: 'relative'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$components$2f$ProductGallery$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        images: galleryImages,
                                        defaultActive: showVariantImage ? 1 : 0
                                    }, void 0, false, {
                                        fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                        lineNumber: 371,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "fav-wrapper",
                                        children: showFav ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(FavouriteToggleLazy, {
                                            handle: router.query.handle,
                                            title: product.title,
                                            image: galleryImages[0]?.url || '/placeholder.png',
                                            price: formattedPrice,
                                            metafields: metafields
                                        }, void 0, false, {
                                            fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                            lineNumber: 378,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "fav-placeholder"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                            lineNumber: 386,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                        lineNumber: 376,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                lineNumber: 370,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "product-info",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                        style: {
                                            fontSize: '20px',
                                            fontWeight: 600,
                                            marginBottom: '4px'
                                        },
                                        children: product.title
                                    }, void 0, false, {
                                        fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                        lineNumber: 392,
                                        columnNumber: 3
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: '12px',
                                            color: '#666',
                                            marginTop: '10px',
                                            marginBottom: '16px',
                                            textAlign: 'left',
                                            minHeight: 18
                                        },
                                        children: selectedSku || ''
                                    }, void 0, false, {
                                        fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                        lineNumber: 396,
                                        columnNumber: 3
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            justifyContent: 'flex-end'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            style: {
                                                width: '80px',
                                                height: '24px',
                                                position: 'relative'
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                "aria-live": "polite",
                                                style: {
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    fontSize: '14px',
                                                    fontWeight: 500,
                                                    lineHeight: '24px'
                                                },
                                                children: [
                                                    "£",
                                                    formattedPrice
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                                lineNumber: 418,
                                                columnNumber: 9
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                            lineNumber: 411,
                                            columnNumber: 7
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                        lineNumber: 410,
                                        columnNumber: 5
                                    }, this),
                                    variantOptions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: '24px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                style: {
                                                    fontSize: '14px',
                                                    fontWeight: 500,
                                                    marginBottom: '8px'
                                                },
                                                children: "Available in:"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                                lineNumber: 437,
                                                columnNumber: 7
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    gap: '8px',
                                                    flexWrap: 'wrap'
                                                },
                                                children: variantOptions.map((variant)=>{
                                                    const isCurrent = variant.label === currentVariantLabel;
                                                    return isCurrent ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            padding: '8px 12px',
                                                            borderRadius: '5px',
                                                            background: '#181818',
                                                            color: '#fff',
                                                            fontSize: '14px',
                                                            fontWeight: 500,
                                                            border: '2px solid #181818'
                                                        },
                                                        children: variant.label
                                                    }, variant.label, false, {
                                                        fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                                        lineNumber: 444,
                                                        columnNumber: 13
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        href: variant.url,
                                                        style: {
                                                            padding: '8px 12px',
                                                            borderRadius: '5px',
                                                            background: '#fff',
                                                            color: '#181818',
                                                            fontSize: '14px',
                                                            fontWeight: 500,
                                                            border: '1px solid #ccc',
                                                            textDecoration: 'none',
                                                            transition: 'all 0.2s'
                                                        },
                                                        children: variant.label
                                                    }, variant.url, false, {
                                                        fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                                        lineNumber: 459,
                                                        columnNumber: 13
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                                lineNumber: 440,
                                                columnNumber: 7
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                        lineNumber: 436,
                                        columnNumber: 5
                                    }, this),
                                    product.variants?.edges?.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "variant-wrapper",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "variant-label",
                                                children: "Select an option:"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                                lineNumber: 485,
                                                columnNumber: 7
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "variant-grid",
                                                children: product.variants.edges.map(({ node })=>{
                                                    const isSelected = selectedVariantId === node.id;
                                                    const oos = !node.availableForSale || (node.quantityAvailable ?? 0) <= 0;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>{
                                                            setSelectedVariantId(node.id);
                                                            setShowVariantImage(true);
                                                        },
                                                        className: `variant-button${isSelected ? ' selected' : ''}${oos ? ' is-disabled' : ''}`,
                                                        disabled: oos,
                                                        "aria-disabled": oos,
                                                        title: oos ? 'Sold out' : undefined,
                                                        "aria-label": oos ? `${node.title} (Sold out)` : undefined,
                                                        children: node.title
                                                    }, node.id, false, {
                                                        fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                                        lineNumber: 491,
                                                        columnNumber: 15
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                                lineNumber: 486,
                                                columnNumber: 7
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                        lineNumber: 484,
                                        columnNumber: 5
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "desktop-add-to-cart",
                                        style: {
                                            marginTop: '24px'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                gap: '12px'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                    htmlFor: "qty",
                                                    style: {
                                                        position: 'absolute',
                                                        left: '-9999px'
                                                    },
                                                    children: "Quantity"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                                    lineNumber: 514,
                                                    columnNumber: 7
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        flex: '0 0 120px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        border: '1px solid #ccc',
                                                        borderRadius: '4px',
                                                        overflow: 'hidden',
                                                        paddingInline: '4px'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            style: {
                                                                width: '48px',
                                                                height: '48px',
                                                                minWidth: '48px',
                                                                minHeight: '48px',
                                                                background: '#fff',
                                                                border: 'none',
                                                                fontSize: '20px',
                                                                cursor: 'pointer'
                                                            },
                                                            onClick: ()=>setQty((prev)=>Math.max(isSoldOut ? 0 : 1, prev - 1)),
                                                            disabled: isSoldOut,
                                                            "aria-disabled": isSoldOut,
                                                            children: "−"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                                            lineNumber: 530,
                                                            columnNumber: 9
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            id: "qty",
                                                            style: {
                                                                width: '100%',
                                                                height: '40px',
                                                                textAlign: 'center',
                                                                fontSize: '14px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                userSelect: 'none'
                                                            },
                                                            children: qty
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                                            lineNumber: 547,
                                                            columnNumber: 9
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            style: {
                                                                width: '48px',
                                                                height: '48px',
                                                                minWidth: '48px',
                                                                minHeight: '48px',
                                                                fontSize: '20px',
                                                                background: '#fff',
                                                                border: 'none',
                                                                cursor: 'pointer'
                                                            },
                                                            onClick: ()=>{
                                                                if (maxQty <= 0) {
                                                                    showToast('More coming soon 😉');
                                                                    return;
                                                                }
                                                                if (qty >= maxQty) {
                                                                    showToast(`We only have ${maxQty} available. Sorry 😞`);
                                                                    return;
                                                                }
                                                                setQty((prev)=>prev + 1);
                                                            },
                                                            disabled: isSoldOut,
                                                            "aria-disabled": isSoldOut,
                                                            children: "+"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                                            lineNumber: 562,
                                                            columnNumber: 9
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                                    lineNumber: 519,
                                                    columnNumber: 7
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    style: {
                                                        flex: '1',
                                                        height: '48px',
                                                        minHeight: '48px',
                                                        background: '#181818',
                                                        color: '#fff',
                                                        border: 'none',
                                                        fontSize: '14px',
                                                        fontWeight: 900,
                                                        cursor: 'pointer',
                                                        borderRadius: '4px',
                                                        whiteSpace: 'nowrap'
                                                    },
                                                    onClick: ()=>{
                                                        if (isSoldOut) {
                                                            showToast('SOLD OUT. More coming soon.');
                                                            return;
                                                        }
                                                        if (!selectedVariantId || !selectedVariant) return;
                                                        addToCart(selectedVariantId, qty, {
                                                            handle: router.query.handle,
                                                            title: product.title,
                                                            variantTitle: selectedVariant.title,
                                                            selectedOptions: selectedVariant.selectedOptions,
                                                            price: selectedVariant.price.amount,
                                                            image: product.images?.edges?.[0]?.node?.url || undefined,
                                                            metafields: product.metafields,
                                                            quantityAvailable: selectedVariant.quantityAvailable
                                                        });
                                                        openDrawer();
                                                    },
                                                    disabled: isSoldOut,
                                                    "aria-disabled": isSoldOut,
                                                    children: isSoldOut ? 'SOLD OUT' : 'ADD TO BAG'
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                                    lineNumber: 586,
                                                    columnNumber: 7
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                            lineNumber: 513,
                                            columnNumber: 5
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                        lineNumber: 512,
                                        columnNumber: 3
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: '32px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                style: {
                                                    fontSize: '16px',
                                                    fontWeight: 600,
                                                    marginBottom: '8px'
                                                },
                                                children: "Details"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                                lineNumber: 626,
                                                columnNumber: 5
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                                                style: {
                                                    width: '100%',
                                                    borderCollapse: 'collapse',
                                                    fontSize: '14px',
                                                    border: '1px solid #e0e0e0'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                                    children: Object.entries(fieldLabels).map(([key, label])=>{
                                                        const value = getFieldValue(key);
                                                        return value ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    style: cellLabelStyle,
                                                                    children: label.toUpperCase()
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                                                    lineNumber: 640,
                                                                    columnNumber: 15
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    style: cellValueStyle,
                                                                    children: value
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                                                    lineNumber: 641,
                                                                    columnNumber: 15
                                                                }, this)
                                                            ]
                                                        }, key, true, {
                                                            fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                                            lineNumber: 639,
                                                            columnNumber: 13
                                                        }, this) : null;
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                                    lineNumber: 635,
                                                    columnNumber: 7
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                                lineNumber: 627,
                                                columnNumber: 5
                                            }, this),
                                            product.descriptionHtml && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                style: {
                                                    marginTop: '24px',
                                                    fontSize: '14px',
                                                    lineHeight: '1.6'
                                                },
                                                dangerouslySetInnerHTML: {
                                                    __html: product.descriptionHtml
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                                lineNumber: 649,
                                                columnNumber: 7
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                        lineNumber: 625,
                                        columnNumber: 3
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                lineNumber: 391,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                        lineNumber: 369,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        ref: sbyAnchorRef,
                        style: {
                            minHeight: showSBY ? undefined : '400px'
                        },
                        children: showSBY ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(StyledByYouLazy, {
                            items: ugcItems
                        }, void 0, false, {
                            fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                            lineNumber: 663,
                            columnNumber: 22
                        }, this) : null
                    }, void 0, false, {
                        fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                        lineNumber: 659,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            height: '80px'
                        }
                    }, void 0, false, {
                        fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                        lineNumber: 666,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                lineNumber: 368,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
const getStaticPaths = async ()=>{
    const query = `
    {
      products(first: 250) {
        edges {
          node {
            handle
          }
        }
      }
    }
  `;
    const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$lib$2f$shopify$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["shopifyFetch"])({
        query
    });
    const paths = data.products.edges.map(({ node })=>({
            params: {
                handle: node.handle
            }
        }));
    return {
        paths,
        fallback: 'blocking'
    };
};
const getStaticProps = async (context)=>{
    const handle = context.params?.handle;
    const query = `
  query ProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      descriptionHtml
      priceRange { minVariantPrice { amount } }

      images(first: 5) {
        edges {
          node {
            url(transform: { maxWidth: 1600, preferredContentType: WEBP })
            width
            height
            altText
          }
        }
      }

      variants(first: 10) {
        edges {
          node {
            id
            title
            price { amount }
            availableForSale
            quantityAvailable
            selectedOptions { name value }
            sku
            image {
              url
              width
              height
              altText
            }
          }
        }
      }

      metafields(identifiers: [
        { namespace: "custom", key: "alloy" },
        { namespace: "custom", key: "metal" },
        { namespace: "custom", key: "metal_colour" },
        { namespace: "custom", key: "thread_type" },
        { namespace: "custom", key: "gem_type" },
        { namespace: "custom", key: "gem_colour" },
        { namespace: "custom", key: "name" },
        { namespace: "custom", key: "title" },
        { namespace: "custom", key: "sku" },
        { namespace: "custom", key: "width" },
        { namespace: "custom", key: "height" },
        { namespace: "custom", key: "length" },
        { namespace: "custom", key: "gauge" },
        { namespace: "custom", key: "sold_as" },
        { namespace: "custom", key: "shipping" },
        { namespace: "custom", key: "base_size" },
        { namespace: "custom", key: "variants" },
        { namespace: "custom", key: "variant_label" },
        { namespace: "custom", key: "fitting" }
      ]) {
        key
        value
      }

      styledByYou: metafield(namespace: "custom", key: "styled_by_you") {
        references(first: 50) {
          edges {
            node {
              ... on Metaobject {
                id
                type
                fields {
                  key
                  value
                  reference {
                    __typename
                    ... on MediaImage {
                      image {
                        url(transform: { maxWidth: 1200, preferredContentType: WEBP })
                        width
                        height
                        altText
                      }
                    }
                    ... on Product { id }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
    const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$lib$2f$shopify$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["shopifyFetch"])({
        query,
        variables: {
            handle
        }
    });
    const ugcItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$lib$2f$mapStyledByYou$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["mapStyledByYou"])(data.productByHandle.styledByYou?.references?.edges ?? [], data.productByHandle.id);
    return {
        props: {
            product: data.productByHandle,
            ugcItems
        },
        revalidate: 60
    };
};
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0ee94829._.js.map