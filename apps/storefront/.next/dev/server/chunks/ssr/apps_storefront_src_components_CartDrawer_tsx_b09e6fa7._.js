module.exports = [
"[project]/apps/storefront/src/components/CartDrawer.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CartDrawer
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$CartContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/CartContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$FavouritesContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/FavouritesContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/AuthContext.tsx [ssr] (ecmascript)");
;
;
;
;
;
;
const formatPrice = (price)=>{
    const num = typeof price === 'number' ? price : parseFloat(price || '0');
    return num % 1 === 0 ? num.toFixed(0) : num.toFixed(2);
};
const getCurrencySymbol = (currencyCode)=>{
    const symbols = {
        GBP: '£',
        USD: '$',
        CAD: 'CA$',
        EUR: '€'
    };
    return symbols[currencyCode || 'GBP'] || '£';
};
const displayTitle = (title, variantTitle)=>{
    const t = (s)=>(s || '').trim();
    const isDefault = (s)=>/^default\s*title$/i.test(s || '');
    const base = t(title);
    const variant = t(variantTitle);
    if (!variant || isDefault(variant) || variant.toLowerCase() === base.toLowerCase()) {
        return base || 'Untitled Product';
    }
    return `${base} | ${variant}`;
};
function CartDrawer() {
    const { cartItems, checkoutUrl, isDrawerOpen, closeDrawer, updateQuantity, flushSync, draftCheckoutUrl, draftStatus, ensureVipDraftCheckout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$CartContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useCart"])();
    const { addFavourite } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$FavouritesContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useFavourites"])();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const isVipMember = Array.isArray(user?.tags) ? user.tags.includes('VIP-MEMBER') : false;
    const parsePrice = (value)=>{
        const trimmed = value?.trim();
        if (!trimmed) return null;
        const parsed = parseFloat(trimmed);
        return Number.isFinite(parsed) ? parsed : null;
    };
    const getEffectivePrice = (itemPrice)=>{
        const base = parsePrice(itemPrice.basePrice) ?? parsePrice(itemPrice.price) ?? 0;
        const member = parsePrice(itemPrice.memberPrice);
        if (isVipMember && member !== null) return member;
        return base;
    };
    const [isCheckingOut, setIsCheckingOut] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const isDraftBuilding = isVipMember && draftStatus === 'building';
    const checkoutLabel = isVipMember ? 'CHECKOUT' : 'CHECKOUT';
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const handleEscape = (e)=>{
            if (e.key === 'Escape') closeDrawer();
        };
        if (isDrawerOpen) {
            document.addEventListener('keydown', handleEscape);
        }
        return ()=>{
            document.removeEventListener('keydown', handleEscape);
        };
    }, [
        isDrawerOpen,
        closeDrawer
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: `cart-backdrop${isDrawerOpen ? ' open' : ''}`,
        onMouseDown: (e)=>{
            if (e.target === e.currentTarget) {
                closeDrawer();
            }
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: `cart-drawer${isDrawerOpen ? ' open' : ''}`,
            role: "dialog",
            "aria-modal": "true",
            "aria-labelledby": "cart-drawer-title",
            onClick: (e)=>e.stopPropagation(),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "cart-drawer-inner",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "cart-header",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                id: "cart-drawer-title",
                                children: "MY BAG"
                            }, void 0, false, {
                                fileName: "[project]/apps/storefront/src/components/CartDrawer.tsx",
                                lineNumber: 110,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: closeDrawer,
                                children: "×"
                            }, void 0, false, {
                                fileName: "[project]/apps/storefront/src/components/CartDrawer.tsx",
                                lineNumber: 111,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/storefront/src/components/CartDrawer.tsx",
                        lineNumber: 109,
                        columnNumber: 11
                    }, this),
                    cartItems.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "empty-message",
                        children: "Your cart is empty."
                    }, void 0, false, {
                        fileName: "[project]/apps/storefront/src/components/CartDrawer.tsx",
                        lineNumber: 115,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                        className: "cart-items",
                        children: cartItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                className: "cart-item-overlay",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "cart-image-full",
                                    children: [
                                        item.image && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            src: item.image,
                                            alt: displayTitle(item.title, item.variantTitle),
                                            width: 600,
                                            height: 750,
                                            style: {
                                                objectFit: 'cover',
                                                width: '100%',
                                                height: 'auto',
                                                display: 'block'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/apps/storefront/src/components/CartDrawer.tsx",
                                            lineNumber: 122,
                                            columnNumber: 23
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "cart-image-overlay",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "overlay-title",
                                                    children: displayTitle(item.title, item.variantTitle)
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/storefront/src/components/CartDrawer.tsx",
                                                    lineNumber: 137,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "overlay-controls",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "quantity-controls",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>updateQuantity(item.variantId, item.quantity - 1),
                                                                    children: "−"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/storefront/src/components/CartDrawer.tsx",
                                                                    lineNumber: 142,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    children: item.quantity
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/storefront/src/components/CartDrawer.tsx",
                                                                    lineNumber: 149,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>updateQuantity(item.variantId, item.quantity + 1),
                                                                    children: "+"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/storefront/src/components/CartDrawer.tsx",
                                                                    lineNumber: 150,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/apps/storefront/src/components/CartDrawer.tsx",
                                                            lineNumber: 141,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "cart-price",
                                                            children: [
                                                                getCurrencySymbol(item.currencyCode),
                                                                formatPrice(getEffectivePrice(item))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/apps/storefront/src/components/CartDrawer.tsx",
                                                            lineNumber: 158,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/storefront/src/components/CartDrawer.tsx",
                                                    lineNumber: 140,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/storefront/src/components/CartDrawer.tsx",
                                            lineNumber: 136,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/storefront/src/components/CartDrawer.tsx",
                                    lineNumber: 120,
                                    columnNumber: 19
                                }, this)
                            }, item.variantId, false, {
                                fileName: "[project]/apps/storefront/src/components/CartDrawer.tsx",
                                lineNumber: 119,
                                columnNumber: 17
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/apps/storefront/src/components/CartDrawer.tsx",
                        lineNumber: 117,
                        columnNumber: 13
                    }, this),
                    cartItems.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "cart-subtotal",
                        children: [
                            "Subtotal: ",
                            getCurrencySymbol(cartItems[0]?.currencyCode),
                            formatPrice(cartItems.reduce((sum, item)=>sum + getEffectivePrice(item) * item.quantity, 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/storefront/src/components/CartDrawer.tsx",
                        lineNumber: 169,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                        className: `checkout-button ${isCheckingOut || isDraftBuilding || !isVipMember && !checkoutUrl ? 'disabled' : ''}`,
                        href: draftCheckoutUrl || checkoutUrl || '#',
                        onClick: async (e)=>{
                            e.preventDefault();
                            if (isCheckingOut || isDraftBuilding) return;
                            setIsCheckingOut(true);
                            try {
                                let urlToUse = null;
                                if (isVipMember) {
                                    if (draftCheckoutUrl && draftStatus === 'ready') {
                                        urlToUse = draftCheckoutUrl;
                                    } else {
                                        urlToUse = await ensureVipDraftCheckout();
                                    }
                                }
                                if (!urlToUse) {
                                    const syncedUrl = await flushSync();
                                    urlToUse = syncedUrl;
                                }
                                if (!urlToUse) return;
                                cartItems.forEach((item)=>{
                                    if (item.handle) {
                                        addFavourite({
                                            handle: item.handle,
                                            title: item.title || '',
                                            image: item.image,
                                            price: item.price,
                                            metafields: item.metafields,
                                            orderAgain: true
                                        });
                                    }
                                });
                                window.location.href = urlToUse;
                            } finally{
                                setIsCheckingOut(false);
                            }
                        },
                        children: isCheckingOut || isDraftBuilding ? 'LOADING…' : checkoutLabel
                    }, void 0, false, {
                        fileName: "[project]/apps/storefront/src/components/CartDrawer.tsx",
                        lineNumber: 180,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/storefront/src/components/CartDrawer.tsx",
                lineNumber: 108,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/storefront/src/components/CartDrawer.tsx",
            lineNumber: 101,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/storefront/src/components/CartDrawer.tsx",
        lineNumber: 92,
        columnNumber: 3
    }, this);
}
}),
"[project]/apps/storefront/src/components/CartDrawer.tsx [ssr] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/apps/storefront/src/components/CartDrawer.tsx [ssr] (ecmascript)"));
}),
];

//# sourceMappingURL=apps_storefront_src_components_CartDrawer_tsx_b09e6fa7._.js.map