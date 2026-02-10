module.exports = [
"[project]/apps/storefront/src/components/FavouriteToggle.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$FavouritesContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/FavouritesContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
;
function FavouriteToggle({ handle, title, image, price, metafields }) {
    const { isFavourite, toggleFavourite } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$FavouritesContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useFavourites"])();
    const [active, setActive] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        setActive(isFavourite(handle));
    }, [
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
        className: "favourite-toggle",
        onClick: handleClick,
        "aria-label": active ? 'Remove from favourites' : 'Add to favourites',
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
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
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
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
const __TURBOPACK__default__export__ = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["memo"])(FavouriteToggle);
}),
"[project]/apps/storefront/src/components/FavouriteToggle.tsx [ssr] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/apps/storefront/src/components/FavouriteToggle.tsx [ssr] (ecmascript)"));
}),
];

//# sourceMappingURL=apps_storefront_src_components_FavouriteToggle_tsx_0f289fbc._.js.map