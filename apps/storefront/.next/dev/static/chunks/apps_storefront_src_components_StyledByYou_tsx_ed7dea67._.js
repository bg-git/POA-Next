(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/storefront/src/components/StyledByYou.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/components/StyledByYou.tsx
__turbopack_context__.s([
    "default",
    ()=>StyledByYou
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [client] (ecmascript)");
;
;
function StyledByYou(param) {
    let { items = [], uploadUrl = "https://form.jotform.com/252432451663050" } = param;
    const hasItems = items.length > 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        "aria-label": "Styled by you",
        className: "ugc",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "ugc-title",
                children: "STYLED BY YOU"
            }, void 0, false, {
                fileName: "[project]/apps/storefront/src/components/StyledByYou.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Upload your photo for a chance to be featured."
            }, void 0, false, {
                fileName: "[project]/apps/storefront/src/components/StyledByYou.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                className: "ugc-upload-btn",
                href: uploadUrl,
                target: "_blank",
                rel: "noopener noreferrer",
                "aria-label": "Upload your photo (opens in a new tab)",
                children: "Upload Your Photo"
            }, void 0, false, {
                fileName: "[project]/apps/storefront/src/components/StyledByYou.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "ugc-grid",
                children: hasItems ? items.map((it)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("figure", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "ugc-frame",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                    src: it.image.url,
                                    alt: (it.alt || it.image.altText || "Customer photo").slice(0, 100),
                                    width: it.image.width,
                                    height: it.image.height,
                                    loading: "lazy",
                                    decoding: "async",
                                    sizes: "(min-width: 1024px) calc((min(1400px, 100vw) - 48px) / 5), 100vw",
                                    quality: 60
                                }, void 0, false, {
                                    fileName: "[project]/apps/storefront/src/components/StyledByYou.tsx",
                                    lineNumber: 43,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/storefront/src/components/StyledByYou.tsx",
                                lineNumber: 42,
                                columnNumber: 15
                            }, this),
                            (it.credit || it.url) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("figcaption", {
                                className: "ugc-caption",
                                children: [
                                    it.credit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ugc-credit",
                                        children: it.credit
                                    }, void 0, false, {
                                        fileName: "[project]/apps/storefront/src/components/StyledByYou.tsx",
                                        lineNumber: 57,
                                        columnNumber: 33
                                    }, this),
                                    it.url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        className: "ugc-link",
                                        href: it.url,
                                        rel: "nofollow noopener",
                                        children: it.linkText || "View"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/storefront/src/components/StyledByYou.tsx",
                                        lineNumber: 59,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/storefront/src/components/StyledByYou.tsx",
                                lineNumber: 56,
                                columnNumber: 17
                            }, this)
                        ]
                    }, it.id, true, {
                        fileName: "[project]/apps/storefront/src/components/StyledByYou.tsx",
                        lineNumber: 41,
                        columnNumber: 13
                    }, this)) : /* Fallback placeholder card when no items */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("figure", {
                    className: "ugc-placeholder",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "ugc-frame has-shimmer",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                src: "/tiny-placeholder.jpg",
                                alt: "Be the first to share a photo of this jewellery",
                                width: 1200,
                                height: 1500,
                                loading: "lazy",
                                decoding: "async",
                                sizes: "(min-width: 1024px) calc((min(1400px, 100vw) - 48px) / 5), 100vw",
                                quality: 100
                            }, void 0, false, {
                                fileName: "[project]/apps/storefront/src/components/StyledByYou.tsx",
                                lineNumber: 71,
                                columnNumber: 5
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/storefront/src/components/StyledByYou.tsx",
                            lineNumber: 70,
                            columnNumber: 3
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("figcaption", {
                            className: "ugc-caption",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ugc-credit",
                                children: "Be the first to share a photo."
                            }, void 0, false, {
                                fileName: "[project]/apps/storefront/src/components/StyledByYou.tsx",
                                lineNumber: 84,
                                columnNumber: 5
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/storefront/src/components/StyledByYou.tsx",
                            lineNumber: 83,
                            columnNumber: 3
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/storefront/src/components/StyledByYou.tsx",
                    lineNumber: 69,
                    columnNumber: 1
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/storefront/src/components/StyledByYou.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/storefront/src/components/StyledByYou.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
_c = StyledByYou;
var _c;
__turbopack_context__.k.register(_c, "StyledByYou");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/storefront/src/components/StyledByYou.tsx [client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/apps/storefront/src/components/StyledByYou.tsx [client] (ecmascript)"));
}),
]);

//# sourceMappingURL=apps_storefront_src_components_StyledByYou_tsx_ed7dea67._.js.map