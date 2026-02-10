(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/storefront/src/components/FavouriteToggle.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$FavouritesContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/FavouritesContext.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
function FavouriteToggle(param) {
    let { handle, title, image, price, metafields } = param;
    _s();
    const { isFavourite, toggleFavourite } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$FavouritesContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useFavourites"])();
    const [active, setActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FavouriteToggle.useEffect": ()=>{
            setActive(isFavourite(handle));
        }
    }["FavouriteToggle.useEffect"], [
        handle,
        isFavourite
    ]);
    const handleClick = (e)=>{
        e.preventDefault();
        toggleFavourite({
            handle,
            title,
            image,
            price,
            metafields
        });
        setActive(!active);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: "favourite-toggle",
        onClick: handleClick,
        "aria-label": active ? 'Remove from favourites' : 'Add to favourites',
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            fill: active ? 'red' : 'none',
            viewBox: "0 0 24 24",
            stroke: "currentColor",
            strokeWidth: "2",
            width: "20",
            height: "20",
            style: {
                display: 'block',
                pointerEvents: 'none'
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                d: "M12 21c-1.1-1.04-5.55-5.08-7.62-7.51C2.64 11.21 2 9.66 2 8.25 2 5.4 4.4 3 7.25 3c1.49 0 2.94.68 3.75 1.75A5.48 5.48 0 0116.75 3C19.6 3 22 5.4 22 8.25c0 1.41-.64 2.96-2.38 5.24C17.55 15.92 13.1 19.96 12 21z"
            }, void 0, false, {
                fileName: "[project]/apps/storefront/src/components/FavouriteToggle.tsx",
                lineNumber: 51,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/storefront/src/components/FavouriteToggle.tsx",
            lineNumber: 38,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/storefront/src/components/FavouriteToggle.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_s(FavouriteToggle, "uceNf2fCmTjNhsfyvr6mAhsvO08=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$FavouritesContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useFavourites"]
    ];
});
_c = FavouriteToggle;
const __TURBOPACK__default__export__ = /*#__PURE__*/ _c1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["memo"])(FavouriteToggle);
var _c, _c1;
__turbopack_context__.k.register(_c, "FavouriteToggle");
__turbopack_context__.k.register(_c1, "%default%");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/storefront/src/components/FavouriteToggle.tsx [client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/apps/storefront/src/components/FavouriteToggle.tsx [client] (ecmascript)"));
}),
]);

//# sourceMappingURL=apps_storefront_src_components_FavouriteToggle_tsx_5176b106._.js.map