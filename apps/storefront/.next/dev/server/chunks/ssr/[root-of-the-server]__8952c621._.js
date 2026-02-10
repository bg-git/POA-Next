module.exports = [
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/react-dom [external] (react-dom, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react-dom", () => require("react-dom"));

module.exports = mod;
}),
"[externals]/@vercel/analytics/next [external] (@vercel/analytics/next, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("@vercel/analytics/next");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/apps/storefront/src/context/RegionContext.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/context/RegionContext.tsx
__turbopack_context__.s([
    "RegionProvider",
    ()=>RegionProvider,
    "useRegion",
    ()=>useRegion
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
const RegionContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["createContext"])('uk');
const RegionProvider = ({ children, initialRegion })=>{
    // Just pass through the region from SSR – no client override
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(RegionContext.Provider, {
        value: initialRegion,
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/storefront/src/context/RegionContext.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const useRegion = ()=>(0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useContext"])(RegionContext);
}),
"[project]/apps/storefront/src/lib/region.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/region.ts
__turbopack_context__.s([
    "getRegionFromHost",
    ()=>getRegionFromHost
]);
const getRegionFromHost = (host)=>{
    if (!host) return 'uk';
    const lower = host.toLowerCase();
    if (lower.includes('pierceofart.com')) return 'us';
    if (lower.includes('pierceofart.co.uk')) return 'uk';
    // default
    return 'uk';
};
}),
"[project]/apps/storefront/src/context/FavouritesContext.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FavouritesProvider",
    ()=>FavouritesProvider,
    "useFavourites",
    ()=>useFavourites
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
const FavouritesContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["createContext"])(undefined);
const STORAGE_KEY = 'poa-favourites';
const FavouritesProvider = ({ children })=>{
    const [favourites, setFavourites] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setFavourites(JSON.parse(stored));
            } catch  {
                setFavourites([]);
            }
        }
    }, []);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
    }, [
        favourites
    ]);
    const addFavourite = (item)=>{
        if (!favourites.find((f)=>f.handle === item.handle)) {
            setFavourites([
                ...favourites,
                item
            ]);
        }
    };
    const removeFavourite = (handle)=>{
        setFavourites(favourites.filter((f)=>f.handle !== handle));
    };
    const toggleFavourite = (item)=>{
        if (isFavourite(item.handle)) {
            removeFavourite(item.handle);
        } else {
            addFavourite(item);
        }
    };
    const isFavourite = (handle)=>{
        return favourites.some((f)=>f.handle === handle);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(FavouritesContext.Provider, {
        value: {
            favourites,
            addFavourite,
            removeFavourite,
            toggleFavourite,
            isFavourite
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/storefront/src/context/FavouritesContext.tsx",
        lineNumber: 67,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const useFavourites = ()=>{
    const ctx = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useContext"])(FavouritesContext);
    if (!ctx) throw new Error('useFavourites must be used inside FavouritesProvider');
    return ctx;
};
}),
"[project]/apps/storefront/src/context/ToastContext.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ToastProvider",
    ()=>ToastProvider,
    "useToast",
    ()=>useToast
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
const ToastContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["createContext"])(undefined);
const ToastProvider = ({ children })=>{
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const showToast = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])((msg)=>{
        setMessage(msg);
        setTimeout(()=>setMessage(null), 3000);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(ToastContext.Provider, {
        value: {
            showToast
        },
        children: [
            children,
            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "toast-message",
                children: message
            }, void 0, false, {
                fileName: "[project]/apps/storefront/src/context/ToastContext.tsx",
                lineNumber: 20,
                columnNumber: 19
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/apps/storefront/src/context/ToastContext.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const useToast = ()=>{
    const context = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useContext"])(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
}),
"[project]/apps/storefront/src/lib/cookies.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/apps/storefront/src/context/AuthContext.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$lib$2f$cookies$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/lib/cookies.ts [ssr] (ecmascript)");
;
;
;
;
const STORAGE_KEY = 'poa-auth-user';
function debounce(fn, delay) {
    let timeoutId = null;
    const debounced = (...args)=>{
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(()=>fn(...args), delay);
    };
    debounced.cancel = ()=>{
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    };
    return debounced;
}
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["createContext"])(undefined);
function getInitialAuth(initialUser) {
    if (initialUser) {
        return {
            user: initialUser,
            isAuthenticated: true
        };
    }
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return {
        user: null,
        isAuthenticated: false
    };
}
function AuthProvider({ children, initialUser }) {
    const { user: initialStateUser, isAuthenticated: initialAuth } = getInitialAuth(initialUser);
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(initialStateUser);
    const [isAuthenticated, setIsAuthenticated] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(initialAuth);
    const [loading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const verifySession = async ()=>{
        const hasCookie = document.cookie.split('; ').some((cookie)=>cookie.startsWith(`${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$lib$2f$cookies$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["COOKIE_NAME"]}=`));
        if (!hasCookie) {
            setUser(null);
            setIsAuthenticated(false);
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            return false;
        }
        try {
            const res = await fetch('/api/shopify/verify-customer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data.customer);
                setIsAuthenticated(true);
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                return true;
            } else {
                setUser(null);
                setIsAuthenticated(false);
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                return false;
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null);
            setIsAuthenticated(false);
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            return false;
        }
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        verifySession();
        let intervalId = null;
        const startInterval = ()=>{
            if (intervalId === null) {
                intervalId = setInterval(verifySession, 60_000);
            }
        };
        const stopInterval = ()=>{
            if (intervalId !== null) {
                clearInterval(intervalId);
                intervalId = null;
            }
        };
        if (document.visibilityState === 'visible') {
            startInterval();
        }
        const debouncedVerifySession = debounce(verifySession, 1_000);
        const handleVisibilityChange = ()=>{
            if (document.visibilityState === 'visible') {
                debouncedVerifySession();
                startInterval();
            } else {
                debouncedVerifySession.cancel();
                stopInterval();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return ()=>{
            stopInterval();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            debouncedVerifySession.cancel();
        };
    }, []);
    const signIn = async (email, password)=>{
        try {
            const response = await fetch('/api/shopify/sign-in-customer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                }),
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok && data.success) {
                setIsAuthenticated(true);
                const domain = process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN || window.location.hostname;
                document.cookie = `${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$lib$2f$cookies$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["COOKIE_NAME"]}=${encodeURIComponent(data.accessToken)}; Domain=${domain}; Path=/; Secure; SameSite=None; Max-Age=${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$lib$2f$cookies$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["COOKIE_MAX_AGE"]}`;
                // Fetch user data
                const userResponse = await fetch('/api/shopify/get-customer', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    setUser(userData.customer);
                    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                    ;
                }
                // Verify session after sign in
                const verified = await verifySession();
                if (verified) {
                    return {
                        success: true
                    };
                }
                return {
                    success: false,
                    error: 'Session verification failed'
                };
            } else {
                return {
                    success: false,
                    error: data.error || 'Sign in failed'
                };
            }
        } catch  {
            return {
                success: false,
                error: 'Network error'
            };
        }
    };
    const signOut = async ()=>{
        await fetch('/api/shopify/logout', {
            method: 'POST',
            credentials: 'include'
        });
        const domain = process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN || window.location.hostname;
        document.cookie = `${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$lib$2f$cookies$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["COOKIE_NAME"]}=; Domain=${domain}; Path=/; Secure; SameSite=None; Max-Age=0`;
        setIsAuthenticated(false);
        setUser(null);
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        router.push('/');
    };
    const refreshUser = async ()=>{
        try {
            const res = await fetch('/api/shopify/get-customer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data.customer);
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
            }
        } catch (err) {
            console.error('Failed to refresh user:', err);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            isAuthenticated,
            user,
            signIn,
            signOut,
            loading,
            refreshUser
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/storefront/src/context/AuthContext.tsx",
        lineNumber: 281,
        columnNumber: 5
    }, this);
}
function useAuth() {
    const context = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
}),
"[project]/apps/storefront/src/context/CartContext.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CartProvider",
    ()=>CartProvider,
    "useCart",
    ()=>useCart
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$FavouritesContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/FavouritesContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$ToastContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/ToastContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/AuthContext.tsx [ssr] (ecmascript)");
;
;
;
;
;
const CartContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["createContext"])(undefined);
const ITEMS_KEY = 'poa-cart-items';
const CHECKOUT_ID_KEY = 'poa-checkout-id';
const CartProvider = ({ children })=>{
    const [cartItems, setCartItems] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [checkoutId, setCheckoutId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [checkoutUrl, setCheckoutUrl] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [draftCheckoutUrl, setDraftCheckoutUrl] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [draftStatus, setDraftStatus] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('idle');
    const [draftSignature, setDraftSignature] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [isDrawerOpen, setIsDrawerOpen] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const checkoutUrlRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(checkoutUrl);
    const syncTimeout = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const pendingSync = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const syncVersion = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(0);
    const abortController = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const latestItemsRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(cartItems);
    const draftRequestRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(0);
    const { addFavourite, isFavourite } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$FavouritesContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useFavourites"])();
    const { showToast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$ToastContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useToast"])();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const isVipMember = Array.isArray(user?.tags) ? user.tags.includes('VIP-MEMBER') : false;
    const openDrawer = ()=>setIsDrawerOpen(true);
    const closeDrawer = ()=>setIsDrawerOpen(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        checkoutUrlRef.current = checkoutUrl;
    }, [
        checkoutUrl
    ]);
    const resetDraftState = ()=>{
        setDraftCheckoutUrl(null);
        setDraftSignature(null);
        setDraftStatus('idle');
        draftRequestRef.current += 1;
    };
    const computeDraftSignature = (items, vip)=>JSON.stringify({
            vip,
            items: items.map(({ variantId, quantity })=>({
                    variantId,
                    quantity
                }))
        });
    const buildVipDraftCheckout = async (signature, items, requestId)=>{
        try {
            setDraftStatus('building');
            setDraftCheckoutUrl(null);
            setDraftSignature(signature);
            const res = await fetch('/api/vip/create-draft-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    items
                })
            });
            const data = await res.json();
            const url = data?.draftCheckoutUrl || data?.invoiceUrl;
            if (requestId !== draftRequestRef.current) return null;
            if (!res.ok || !url) {
                setDraftCheckoutUrl(null);
                setDraftStatus('error');
                return null;
            }
            setDraftCheckoutUrl(url);
            setDraftStatus('ready');
            return url;
        } catch (error) {
            if (requestId !== draftRequestRef.current) return null;
            console.error('VIP draft checkout error', error);
            setDraftCheckoutUrl(null);
            setDraftStatus('error');
            return null;
        }
    };
    const ensureVipDraftCheckout = async ()=>{
        if (!isVipMember || cartItems.length === 0) return null;
        const signature = computeDraftSignature(cartItems, isVipMember);
        if (draftCheckoutUrl && draftStatus === 'ready' && draftSignature === signature) {
            return draftCheckoutUrl;
        }
        if (draftStatus === 'building') return null;
        const requestId = ++draftRequestRef.current;
        return buildVipDraftCheckout(signature, cartItems, requestId);
    };
    const scheduleSync = (items)=>{
        if (syncTimeout.current) {
            clearTimeout(syncTimeout.current);
        }
        if (abortController.current) {
            abortController.current.abort();
        }
        latestItemsRef.current = items;
        const current = ++syncVersion.current;
        abortController.current = new AbortController();
        syncTimeout.current = setTimeout(()=>{
            pendingSync.current = syncShopifyCheckout(latestItemsRef.current, current, abortController.current?.signal).finally(()=>{
                pendingSync.current = null;
            });
        }, 100);
    };
    const flushSync = async ()=>{
        if (syncTimeout.current) {
            clearTimeout(syncTimeout.current);
            syncTimeout.current = null;
            pendingSync.current = syncShopifyCheckout(latestItemsRef.current, syncVersion.current, abortController.current?.signal).finally(()=>{
                pendingSync.current = null;
            });
        }
        if (pendingSync.current) {
            await pendingSync.current;
        }
        return checkoutUrlRef.current;
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        return ()=>{
            if (syncTimeout.current) clearTimeout(syncTimeout.current);
            abortController.current?.abort();
            resetDraftState();
        };
    }, []);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const storedItems = localStorage.getItem(ITEMS_KEY);
        const storedId = localStorage.getItem(CHECKOUT_ID_KEY);
        let parsedItems = [];
        if (storedItems) {
            try {
                parsedItems = JSON.parse(storedItems);
                setCartItems(parsedItems);
            } catch  {
                setCartItems([]);
            }
        }
        if (storedId) {
            setCheckoutId(storedId);
            fetch('/api/get-checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: storedId
                }),
                credentials: 'include'
            }).then((res)=>res.json()).then((data)=>{
                const cart = data.cart;
                if (!cart) {
                    fetch('/api/create-checkout', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            items: parsedItems
                        }),
                        credentials: 'include'
                    }).then((res)=>res.json()).then((data)=>{
                        setCheckoutId(data.checkoutId);
                        setCheckoutUrl(data.checkoutUrl);
                        checkoutUrlRef.current = data.checkoutUrl;
                    }).catch(()=>{
                        setCheckoutId(null);
                        setCheckoutUrl(null);
                        checkoutUrlRef.current = null;
                    });
                    return;
                }
                const items = (cart.lines.edges || []).map((edge)=>{
                    // Try to find existing item data from localStorage
                    const existingItem = parsedItems.find((item)=>item.variantId === edge.node.merchandise.id);
                    return {
                        variantId: edge.node.merchandise.id,
                        quantity: edge.node.quantity,
                        // Preserve existing metadata from localStorage
                        title: existingItem?.title,
                        variantTitle: existingItem?.variantTitle,
                        selectedOptions: existingItem?.selectedOptions,
                        price: existingItem?.price,
                        basePrice: existingItem?.basePrice,
                        memberPrice: existingItem?.memberPrice,
                        currencyCode: existingItem?.currencyCode,
                        image: existingItem?.image,
                        handle: existingItem?.handle,
                        metafields: existingItem?.metafields,
                        quantityAvailable: existingItem?.quantityAvailable
                    };
                });
                setCartItems(items);
                setCheckoutUrl(cart.checkoutUrl);
                checkoutUrlRef.current = cart.checkoutUrl;
            }).catch(()=>{
                setCheckoutId(null);
                setCheckoutUrl(null);
                checkoutUrlRef.current = null;
            });
        }
    }, []);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        localStorage.setItem(ITEMS_KEY, JSON.stringify(cartItems));
        if (checkoutId) {
            localStorage.setItem(CHECKOUT_ID_KEY, checkoutId);
        } else {
            localStorage.removeItem(CHECKOUT_ID_KEY);
        }
    }, [
        cartItems,
        checkoutId
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        latestItemsRef.current = cartItems;
    }, [
        cartItems
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!isVipMember) {
            resetDraftState();
            return;
        }
        if (cartItems.length === 0) {
            resetDraftState();
            return;
        }
        const signature = computeDraftSignature(cartItems, isVipMember);
        if (draftCheckoutUrl && draftStatus === 'ready' && draftSignature === signature) {
            return;
        }
        let cancelled = false;
        const requestId = ++draftRequestRef.current;
        buildVipDraftCheckout(signature, cartItems, requestId).catch((error)=>{
            if (cancelled) return;
            console.error('Failed to warm VIP draft checkout', error);
        });
        return ()=>{
            cancelled = true;
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        cartItems,
        isVipMember
    ]);
    const syncShopifyCheckout = async (items, current, signal)=>{
        // Validate variant IDs
        const invalidItems = items.filter((item)=>!item.variantId || !item.variantId.startsWith('gid://shopify/'));
        if (invalidItems.length > 0) {
            console.error('❌ Invalid variant IDs found:', invalidItems);
            return;
        }
        const validItems = items.filter((item)=>item.quantity > 0);
        if (validItems.length !== items.length) {
            if (current !== syncVersion.current) return;
            setCartItems(validItems);
            latestItemsRef.current = validItems;
        }
        if (validItems.length === 0) {
            if (current !== syncVersion.current) return;
            setCheckoutUrl(null);
            setCheckoutId(null);
            checkoutUrlRef.current = null;
            return;
        }
        try {
            if (!checkoutId) {
                const res = await fetch('/api/create-checkout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        items: validItems
                    }),
                    credentials: 'include',
                    signal
                });
                const data = await res.json();
                if (current !== syncVersion.current) return;
                setCheckoutUrl(data.checkoutUrl);
                setCheckoutId(data.checkoutId);
                checkoutUrlRef.current = data.checkoutUrl;
            } else {
                const res = await fetch('/api/update-checkout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        checkoutId,
                        items: validItems
                    }),
                    credentials: 'include',
                    signal
                });
                const data = await res.json();
                if (current !== syncVersion.current) return;
                // Handle completed checkout if API returns it
                if (data.completed) {
                    setCartItems([]);
                    setCheckoutId(null);
                    setCheckoutUrl(null);
                    checkoutUrlRef.current = null;
                    return;
                }
                const cart = data.cart;
                if (cart) {
                    // Preserve existing metadata when updating from Shopify
                    const existingItemsMap = new Map(latestItemsRef.current.map((item)=>[
                            item.variantId,
                            item
                        ]));
                    const updated = (cart.lines.edges || []).map((edge)=>{
                        const existingItem = existingItemsMap.get(edge.node.merchandise.id);
                        return {
                            variantId: edge.node.merchandise.id,
                            quantity: edge.node.quantity,
                            // Preserve existing metadata
                            title: existingItem?.title,
                            variantTitle: existingItem?.variantTitle,
                            selectedOptions: existingItem?.selectedOptions,
                            price: existingItem?.price,
                            basePrice: existingItem?.basePrice,
                            memberPrice: existingItem?.memberPrice,
                            currencyCode: existingItem?.currencyCode,
                            image: existingItem?.image,
                            handle: existingItem?.handle,
                            metafields: existingItem?.metafields,
                            quantityAvailable: existingItem?.quantityAvailable
                        };
                    });
                    if (current !== syncVersion.current) return;
                    setCartItems(updated);
                    setCheckoutUrl(cart.checkoutUrl);
                    checkoutUrlRef.current = cart.checkoutUrl;
                }
            }
        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') return;
            console.error('Checkout error:', err);
        }
    };
    const addToCart = (variantId, quantity, meta = {})=>{
        const existing = cartItems.find((item)=>item.variantId === variantId);
        const maxQty = meta.quantityAvailable ?? existing?.quantityAvailable ?? Infinity;
        if (maxQty <= 0) {
            showToast('More coming soon.');
            return;
        }
        const desiredQty = existing ? existing.quantity + quantity : quantity;
        if (desiredQty > maxQty && maxQty !== Infinity) {
            showToast(`More coming soon 😉`);
        }
        const finalQty = Math.min(desiredQty, maxQty);
        const updatedItems = existing ? cartItems.map((item)=>item.variantId === variantId ? {
                ...item,
                quantity: finalQty,
                quantityAvailable: maxQty
            } : item) : [
            {
                variantId,
                quantity: finalQty,
                ...meta
            },
            ...cartItems
        ];
        setCartItems(updatedItems);
        // Open drawer immediately for better UX
        openDrawer();
        // ✅ Add to favourites silently
        if (meta.handle && !isFavourite(meta.handle)) {
            addFavourite({
                handle: meta.handle,
                title: meta.title || '',
                image: meta.image,
                price: meta.price,
                metafields: meta.metafields
            });
        }
        scheduleSync(updatedItems);
    };
    const updateQuantity = (variantId, newQty)=>{
        const item = cartItems.find((i)=>i.variantId === variantId);
        if (!item) return;
        const maxQty = item.quantityAvailable ?? Infinity;
        if (maxQty <= 0) {
            showToast('More coming soon.');
            return;
        }
        if (newQty > maxQty && maxQty !== Infinity) {
            showToast(`We only have ${maxQty} available. Sorry 😞`);
            return;
        }
        const updated = cartItems.map((i)=>i.variantId === variantId ? {
                ...i,
                quantity: newQty
            } : i).filter((i)=>i.quantity > 0);
        setCartItems(updated);
        scheduleSync(updated);
    };
    const removeFromCart = (variantId)=>{
        const updated = cartItems.filter((item)=>item.variantId !== variantId);
        setCartItems(updated);
        scheduleSync(updated);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(CartContext.Provider, {
        value: {
            cartItems,
            checkoutUrl,
            draftCheckoutUrl,
            draftStatus,
            draftSignature,
            addToCart,
            updateQuantity,
            removeFromCart,
            isDrawerOpen,
            openDrawer,
            closeDrawer,
            flushSync,
            ensureVipDraftCheckout
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/storefront/src/context/CartContext.tsx",
        lineNumber: 513,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const useCart = ()=>{
    const context = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useContext"])(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
}),
"[project]/apps/storefront/src/components/Header.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$CartContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/CartContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/AuthContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$FavouritesContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/FavouritesContext.tsx [ssr] (ecmascript)");
;
;
;
;
;
;
;
function Header() {
    const { openDrawer, cartItems } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$CartContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useCart"])();
    const { isAuthenticated, user, signOut, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [isMounted, setIsMounted] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const itemCount = cartItems.reduce((sum, item)=>sum + item.quantity, 0);
    const { favourites } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$FavouritesContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useFavourites"])();
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        setIsMounted(true);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
                style: {
                    width: '100%',
                    background: '#181818',
                    borderTop: '1px solid #fff',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    style: {
                        width: '100%',
                        maxWidth: '1400px',
                        margin: '0 auto',
                        padding: '0 16px',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        fontSize: '12px',
                        color: '#000'
                    },
                    children: !loading && (isMounted && isAuthenticated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/account",
                                style: {
                                    color: '#fff',
                                    textDecoration: 'none',
                                    marginRight: '12px'
                                },
                                children: user?.firstName ? `My Account` : 'My Account'
                            }, void 0, false, {
                                fileName: "[project]/apps/storefront/src/components/Header.tsx",
                                lineNumber: 49,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                style: {
                                    marginRight: '12px'
                                },
                                children: "|"
                            }, void 0, false, {
                                fileName: "[project]/apps/storefront/src/components/Header.tsx",
                                lineNumber: 54,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: signOut,
                                style: {
                                    background: 'none',
                                    border: 'none',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    padding: 0
                                },
                                children: "Sign Out"
                            }, void 0, false, {
                                fileName: "[project]/apps/storefront/src/components/Header.tsx",
                                lineNumber: 55,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/register",
                                style: {
                                    color: '#fff',
                                    textDecoration: 'none',
                                    marginRight: '12px'
                                },
                                children: "Join Us"
                            }, void 0, false, {
                                fileName: "[project]/apps/storefront/src/components/Header.tsx",
                                lineNumber: 71,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                style: {
                                    marginRight: '12px'
                                },
                                children: "|"
                            }, void 0, false, {
                                fileName: "[project]/apps/storefront/src/components/Header.tsx",
                                lineNumber: 74,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/sign-in",
                                style: {
                                    color: '#fff',
                                    textDecoration: 'none'
                                },
                                children: "Sign In"
                            }, void 0, false, {
                                fileName: "[project]/apps/storefront/src/components/Header.tsx",
                                lineNumber: 75,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true))
                }, void 0, false, {
                    fileName: "[project]/apps/storefront/src/components/Header.tsx",
                    lineNumber: 33,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/storefront/src/components/Header.tsx",
                lineNumber: 23,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    width: '100%',
                    background: '#181818',
                    height: '64px',
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid #fff'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    style: {
                        width: '100%',
                        maxWidth: '1400px',
                        margin: '0 auto',
                        padding: '0 16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            style: {
                                display: 'flex',
                                alignItems: 'center'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                src: "/Pierce_of_art_Logo_661612a0-0b7d-4d95-832a-3926ef0d4780.png",
                                alt: "PIERCE OF ART text logo",
                                width: 300,
                                height: 27,
                                priority: true,
                                style: {
                                    verticalAlign: 'middle',
                                    display: 'block'
                                }
                            }, void 0, false, {
                                fileName: "[project]/apps/storefront/src/components/Header.tsx",
                                lineNumber: 109,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/storefront/src/components/Header.tsx",
                            lineNumber: 107,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/favourites",
                                    "aria-label": "My Favourites",
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        cursor: 'pointer'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        fill: favourites.length > 0 ? 'red' : 'none',
                                        viewBox: "0 0 24 24",
                                        stroke: "#fff",
                                        strokeWidth: "2",
                                        width: "24",
                                        height: "24",
                                        style: {
                                            display: 'block'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            d: "M12 21c-1.1-1.04-5.55-5.08-7.62-7.51C2.64 11.21 2 9.66 2 8.25 2 5.4 4.4 3 7.25 3c1.49 0 2.94.68 3.75 1.75A5.48 5.48 0 0116.75 3C19.6 3 22 5.4 22 8.25c0 1.41-.64 2.96-2.38 5.24C17.55 15.92 13.1 19.96 12 21z"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/storefront/src/components/Header.tsx",
                                            lineNumber: 135,
                                            columnNumber: 7
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/storefront/src/components/Header.tsx",
                                        lineNumber: 125,
                                        columnNumber: 5
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/storefront/src/components/Header.tsx",
                                    lineNumber: 120,
                                    columnNumber: 3
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: openDrawer,
                                    style: {
                                        background: 'none',
                                        border: 'none',
                                        padding: 0,
                                        margin: 0,
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        color: '#fff',
                                        cursor: 'pointer',
                                        textDecoration: 'none'
                                    },
                                    children: [
                                        "My Bag",
                                        itemCount > 0 ? ` (${itemCount})` : ''
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/storefront/src/components/Header.tsx",
                                    lineNumber: 143,
                                    columnNumber: 3
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/storefront/src/components/Header.tsx",
                            lineNumber: 119,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/storefront/src/components/Header.tsx",
                    lineNumber: 95,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/storefront/src/components/Header.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("nav", {
                style: {
                    width: '100%',
                    background: '#181818',
                    borderBottom: '1px solid #ececec',
                    overflowX: 'auto'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        maxWidth: '1400px',
                        margin: '0 auto',
                        padding: '0 16px',
                        whiteSpace: 'nowrap'
                    },
                    children: [
                        {
                            label: 'BOOK A PIERCING',
                            href: '/collections/ends-gems'
                        },
                        {
                            label: 'PIERCING PRICE LIST',
                            href: '/information/piercing-price-list'
                        },
                        {
                            label: 'ENDS & GEMS',
                            href: '/collections/ends-gems'
                        },
                        {
                            label: 'CHAINS & CHARMS',
                            href: '/collections/chains-charms'
                        },
                        {
                            label: 'RINGS & HOOPS',
                            href: '/collections/rings-hoops'
                        },
                        {
                            label: 'SEARCH',
                            href: '/search'
                        }
                    ].map(({ label, href })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: href,
                            style: {
                                padding: '16px 12px',
                                fontSize: '16px',
                                color: '#fff',
                                fontWeight: '600',
                                textDecoration: 'none',
                                flexShrink: 0
                            },
                            children: label
                        }, label, false, {
                            fileName: "[project]/apps/storefront/src/components/Header.tsx",
                            lineNumber: 191,
                            columnNumber: 3
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/apps/storefront/src/components/Header.tsx",
                    lineNumber: 173,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/storefront/src/components/Header.tsx",
                lineNumber: 165,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
const __TURBOPACK__default__export__ = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["memo"])(Header);
}),
"[project]/apps/storefront/src/context/ChatDrawerContext.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChatDrawerProvider",
    ()=>ChatDrawerProvider,
    "useChatDrawer",
    ()=>useChatDrawer
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
const ChatDrawerContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["createContext"])(undefined);
function ChatDrawerProvider({ children }) {
    const [isDrawerOpen, setIsDrawerOpen] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const openDrawer = ()=>setIsDrawerOpen(true);
    const closeDrawer = ()=>setIsDrawerOpen(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(ChatDrawerContext.Provider, {
        value: {
            isDrawerOpen,
            openDrawer,
            closeDrawer
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/storefront/src/context/ChatDrawerContext.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
function useChatDrawer() {
    const context = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useContext"])(ChatDrawerContext);
    if (!context) throw new Error('useChatDrawer must be used within a ChatDrawerProvider');
    return context;
}
}),
"[project]/apps/storefront/src/components/Footer.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$ChatDrawerContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/ChatDrawerContext.tsx [ssr] (ecmascript)");
;
;
;
;
const sections = [
    {
        title: 'CARE',
        links: [
            {
                label: 'Contact Us',
                href: '/contact'
            },
            {
                label: 'Sign in',
                href: '/sign-in'
            },
            {
                label: 'Register',
                href: '/register'
            }
        ]
    },
    {
        title: 'COMPANY',
        links: [
            {
                label: 'About Us',
                href: '/information/about-us'
            },
            {
                label: 'Pricing & Efficiency',
                href: '/information/pricing-and-efficiency'
            },
            {
                label: 'Blog',
                href: '/piercing-magazine'
            }
        ]
    },
    {
        title: 'LEGAL',
        links: [
            {
                label: 'Terms of Service',
                href: '/information/terms-of-service'
            },
            {
                label: 'Terms of Sale',
                href: '/information/terms-of-sale'
            },
            {
                label: 'Privacy Policy',
                href: '/information/privacy-policy'
            },
            {
                label: 'Cookie Policy',
                href: '/information/cookie-policy'
            },
            {
                label: 'Shipping & Delivery',
                href: '/information/shipping-and-delivery-policy'
            },
            {
                label: 'All Terms',
                href: '/information'
            }
        ]
    },
    {
        title: 'SOCIALS',
        links: [
            {
                label: 'Instagram',
                href: 'https://instagram.com/pierceofart.co.uk'
            }
        ]
    }
];
function Footer() {
    const [openIndex, setOpenIndex] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const toggle = (index)=>setOpenIndex(openIndex === index ? null : index);
    const { openDrawer: openChatDrawer } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$ChatDrawerContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useChatDrawer"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("footer", {
        className: "site-footer",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "footer-inner",
            children: sections.map((section, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "footer-section",
                    "data-open": openIndex === index,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            className: "footer-toggle",
                            onClick: ()=>toggle(index),
                            "aria-expanded": openIndex === index,
                            children: [
                                section.title,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: "footer-toggle-icon",
                                    children: openIndex === index ? '−' : '+'
                                }, void 0, false, {
                                    fileName: "[project]/apps/storefront/src/components/Footer.tsx",
                                    lineNumber: 64,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/storefront/src/components/Footer.tsx",
                            lineNumber: 58,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                            className: "footer-links",
                            children: section.links.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                    children: link.label === 'Contact Us' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        onClick: openChatDrawer,
                                        style: {
                                            cursor: 'pointer',
                                            margin: 0
                                        },
                                        children: link.label
                                    }, void 0, false, {
                                        fileName: "[project]/apps/storefront/src/components/Footer.tsx",
                                        lineNumber: 72,
                                        columnNumber: 21
                                    }, this) : link.href.startsWith('/') ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: link.href,
                                        children: link.label
                                    }, void 0, false, {
                                        fileName: "[project]/apps/storefront/src/components/Footer.tsx",
                                        lineNumber: 79,
                                        columnNumber: 21
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                        href: link.href,
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        children: link.label
                                    }, void 0, false, {
                                        fileName: "[project]/apps/storefront/src/components/Footer.tsx",
                                        lineNumber: 81,
                                        columnNumber: 21
                                    }, this)
                                }, link.href, false, {
                                    fileName: "[project]/apps/storefront/src/components/Footer.tsx",
                                    lineNumber: 70,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/apps/storefront/src/components/Footer.tsx",
                            lineNumber: 68,
                            columnNumber: 13
                        }, this)
                    ]
                }, section.title, true, {
                    fileName: "[project]/apps/storefront/src/components/Footer.tsx",
                    lineNumber: 53,
                    columnNumber: 11
                }, this))
        }, void 0, false, {
            fileName: "[project]/apps/storefront/src/components/Footer.tsx",
            lineNumber: 51,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/storefront/src/components/Footer.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
const __TURBOPACK__default__export__ = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["memo"])(Footer);
}),
"[project]/apps/storefront/src/components/BreadcrumbSchema.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BreadcrumbSchema
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
;
;
const slugToLabel = {
    'chains-charms': 'Chains & Charms',
    'ends-gems': 'Ends & Gems',
    'backs-bars': 'Backs & Bars',
    'rings-hoops': 'Rings & Hoops'
};
function BreadcrumbSchema() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { pathname, asPath } = router;
    const excluded = [
        '/',
        '/account',
        '/register',
        '/sign-in',
        '/reset-password',
        '/checkout'
    ];
    if (excluded.some((p)=>pathname === p || pathname.startsWith(p + '/'))) {
        return null;
    }
    const pathWithoutQuery = asPath.split('?')[0];
    const segments = pathWithoutQuery.split('/').filter(Boolean);
    const breadcrumbs = segments.map((seg, index)=>{
        const label = slugToLabel[seg] || seg.split('-').map((word)=>word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        const url = '/' + segments.slice(0, index + 1).join('/');
        return {
            label,
            url
        };
    });
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((bc, index)=>({
                '@type': 'ListItem',
                position: index + 1,
                name: bc.label,
                item: `https://www.pierceofart.co.uk${bc.url}`
            }))
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("script", {
        type: "application/ld+json",
        dangerouslySetInnerHTML: {
            __html: JSON.stringify(schema)
        }
    }, void 0, false, {
        fileName: "[project]/apps/storefront/src/components/BreadcrumbSchema.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/storefront/src/hooks/useAccountValidation.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAccountValidation",
    ()=>useAccountValidation
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/AuthContext.tsx [ssr] (ecmascript)");
;
;
const useAccountValidation = ()=>{
    const [isAccountComplete, setIsAccountComplete] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    // Safely get auth context - handle case where it might not be available
    let isAuthenticated = false;
    let user = null;
    try {
        const authContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
        isAuthenticated = authContext.isAuthenticated;
        user = authContext.user;
    } catch (error) {
        console.warn('AuthContext not available in useAccountValidation:', error);
    }
    const validateAccountCompleteness = (customer)=>{
        if (!customer) return false;
        // Check mandatory account fields
        const hasFirstName = !!customer.firstName?.trim();
        const hasLastName = !!customer.lastName?.trim();
        const hasEmail = !!customer.email?.trim();
        const hasPhone = !!customer.phone?.trim();
        const hasWebsiteOrSocial = !!(customer.website?.trim() || customer.social?.trim());
        const accountFieldsComplete = hasFirstName && hasLastName && hasEmail && hasPhone && hasWebsiteOrSocial;
        // Check mandatory address fields
        const billingAddress = customer?.addresses?.edges?.[0]?.node;
        const shippingAddress = customer?.addresses?.edges?.[1]?.node;
        const isBillingComplete = billingAddress && billingAddress.firstName?.trim() && billingAddress.lastName?.trim() && billingAddress.address1?.trim() && billingAddress.city?.trim() && billingAddress.zip?.trim() && billingAddress.country?.trim() && billingAddress.phone?.trim();
        const isShippingComplete = shippingAddress && shippingAddress.firstName?.trim() && shippingAddress.lastName?.trim() && shippingAddress.address1?.trim() && shippingAddress.city?.trim() && shippingAddress.zip?.trim() && shippingAddress.country?.trim() && shippingAddress.phone?.trim();
        return accountFieldsComplete && isBillingComplete && isShippingComplete;
    };
    const checkAccountStatus = async ()=>{
        if (!isAuthenticated || !user?.id) {
            setIsAccountComplete(true); // Don't show banner for non-authenticated users
            setIsLoading(false);
            return;
        }
        try {
            const response = await fetch('/api/shopify/get-customer', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.success && data.customer) {
                const isComplete = validateAccountCompleteness(data.customer);
                setIsAccountComplete(isComplete);
            } else {
                setIsAccountComplete(false);
            }
        } catch (error) {
            console.error('Error checking account status:', error);
            setIsAccountComplete(true); // Don't show banner on error
        } finally{
            setIsLoading(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        checkAccountStatus();
    }, [
        isAuthenticated,
        user?.id
    ]);
    const refreshValidation = ()=>{
        setIsLoading(true);
        checkAccountStatus();
    };
    return {
        isAccountComplete,
        isLoading,
        refreshValidation
    };
};
}),
"[project]/apps/storefront/src/context/AccountValidationContext.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AccountValidationProvider",
    ()=>AccountValidationProvider,
    "useAccountValidationContext",
    ()=>useAccountValidationContext
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$hooks$2f$useAccountValidation$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/hooks/useAccountValidation.ts [ssr] (ecmascript)");
;
;
;
const AccountValidationContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["createContext"])(undefined);
function AccountValidationProvider({ children }) {
    const accountValidation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$hooks$2f$useAccountValidation$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useAccountValidation"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(AccountValidationContext.Provider, {
        value: accountValidation,
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/storefront/src/context/AccountValidationContext.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
function useAccountValidationContext() {
    const context = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useContext"])(AccountValidationContext);
    if (context === undefined) {
        throw new Error('useAccountValidationContext must be used within an AccountValidationProvider');
    }
    return context;
}
}),
"[project]/apps/storefront/src/components/AccountCompletionBanner.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AccountCompletionBanner
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AccountValidationContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/AccountValidationContext.tsx [ssr] (ecmascript)");
;
;
;
function AccountCompletionBanner() {
    try {
        const { isAccountComplete, isLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AccountValidationContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useAccountValidationContext"])();
        // Don't show banner if loading or account is complete
        if (isLoading || isAccountComplete) {
            return null;
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            style: {
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '12px 16px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: '500',
                position: 'relative',
                zIndex: 1000
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                children: [
                    "You must complete your account setup.",
                    ' ',
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/account",
                        style: {
                            color: 'white',
                            textDecoration: 'underline',
                            fontWeight: 'bold'
                        },
                        children: "Complete setup here"
                    }, void 0, false, {
                        fileName: "[project]/apps/storefront/src/components/AccountCompletionBanner.tsx",
                        lineNumber: 28,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/storefront/src/components/AccountCompletionBanner.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/storefront/src/components/AccountCompletionBanner.tsx",
            lineNumber: 14,
            columnNumber: 5
        }, this);
    } catch (error) {
        // Silently fail if context is not available - don't break the page
        console.warn('AccountCompletionBanner failed to render:', error);
        return null;
    }
}
}),
"[project]/apps/storefront/src/pages/_app.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// pages/_app.tsx
__turbopack_context__.s([
    "default",
    ()=>MyApp
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$app$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/app.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dynamic$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dynamic.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$vercel$2f$analytics$2f$next__$5b$external$5d$__$2840$vercel$2f$analytics$2f$next$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/@vercel/analytics/next [external] (@vercel/analytics/next, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$RegionContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/RegionContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$lib$2f$region$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/lib/region.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$components$2f$Header$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/components/Header.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$components$2f$Footer$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/components/Footer.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$components$2f$BreadcrumbSchema$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/components/BreadcrumbSchema.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$components$2f$AccountCompletionBanner$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/components/AccountCompletionBanner.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$CartContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/CartContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/AuthContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$FavouritesContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/FavouritesContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$ToastContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/ToastContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$ChatDrawerContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/ChatDrawerContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AccountValidationContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/AccountValidationContext.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$vercel$2f$analytics$2f$next__$5b$external$5d$__$2840$vercel$2f$analytics$2f$next$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$vercel$2f$analytics$2f$next__$5b$external$5d$__$2840$vercel$2f$analytics$2f$next$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
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
const CartDrawer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dynamic$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/apps/storefront/src/components/CartDrawer.tsx [ssr] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/apps/storefront/src/components/CartDrawer.tsx [client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
const ChatDrawer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dynamic$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/apps/storefront/src/components/ChatDrawer.tsx [ssr] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/apps/storefront/src/components/ChatDrawer.tsx [client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
function MyApp({ Component, pageProps }) {
    const initialRegion = pageProps.region ?? 'uk';
    const noLayout = pageProps.noLayout === true;
    // ------------------------------
    // Scroll restoration (fixes: back to "/" not remembering position)
    // ------------------------------
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const isPopState = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const keyFor = undefined;
        const save = undefined;
        const restore = undefined;
        const onRouteChangeStart = undefined;
        const onRouteChangeComplete = undefined;
    }, [
        router
    ]);
    // ------------------------------
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$vercel$2f$analytics$2f$next__$5b$external$5d$__$2840$vercel$2f$analytics$2f$next$2c$__esm_import$29$__["Analytics"], {}, void 0, false, {
                fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                lineNumber: 125,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$ToastContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["ToastProvider"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["AuthProvider"], {
                    initialUser: pageProps.customer || null,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AccountValidationContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["AccountValidationProvider"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$FavouritesContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["FavouritesProvider"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$CartContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["CartProvider"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$ChatDrawerContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["ChatDrawerProvider"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$RegionContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["RegionProvider"], {
                                        initialRegion: initialRegion,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                                                        name: "viewport",
                                                        content: "width=device-width, initial-scale=1, viewport-fit=cover"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                        lineNumber: 134,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                                                        name: "theme-color",
                                                        content: "#ffffff"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                        lineNumber: 138,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("link", {
                                                        rel: "icon",
                                                        href: "/favicon.ico"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                        lineNumber: 139,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("link", {
                                                        rel: "apple-touch-icon",
                                                        sizes: "180x180",
                                                        href: "/apple-touch-icon.png"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                        lineNumber: 140,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("link", {
                                                        rel: "icon",
                                                        type: "image/png",
                                                        sizes: "32x32",
                                                        href: "/favicon-32x32.png"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                        lineNumber: 141,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("link", {
                                                        rel: "icon",
                                                        type: "image/png",
                                                        sizes: "16x16",
                                                        href: "/favicon-16x16.png"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                        lineNumber: 142,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("link", {
                                                        rel: "manifest",
                                                        href: "/site.webmanifest"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                        lineNumber: 143,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("link", {
                                                        rel: "mask-icon",
                                                        href: "/safari-pinned-tab.svg",
                                                        color: "#181818"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                        lineNumber: 144,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                                                        name: "msapplication-TileColor",
                                                        content: "#ffffff"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                        lineNumber: 145,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                lineNumber: 133,
                                                columnNumber: 19
                                            }, this),
                                            noLayout ? // Dedicated pages like the .com region selector or /admin
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Component, {
                                                ...pageProps
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                lineNumber: 150,
                                                columnNumber: 21
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            minHeight: '100dvh'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$components$2f$AccountCompletionBanner$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                                fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                                lineNumber: 160,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$components$2f$Header$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                                fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                                lineNumber: 161,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
                                                                style: {
                                                                    flex: '1 0 auto'
                                                                },
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Component, {
                                                                    ...pageProps
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                                    lineNumber: 163,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                                lineNumber: 162,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$components$2f$BreadcrumbSchema$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                                fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                                lineNumber: 165,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$components$2f$Footer$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                                fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                                lineNumber: 166,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                        lineNumber: 153,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(CartDrawer, {}, void 0, false, {
                                                        fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                        lineNumber: 168,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(ChatDrawer, {}, void 0, false, {
                                                        fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                        lineNumber: 169,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                        lineNumber: 132,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                    lineNumber: 131,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                lineNumber: 130,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                            lineNumber: 129,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                        lineNumber: 128,
                        columnNumber: 9
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                    lineNumber: 127,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                lineNumber: 126,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
MyApp.getInitialProps = async (appContext)=>{
    const appProps = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$app$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"].getInitialProps(appContext);
    const myAppProps = appProps;
    // Ensure pageProps exists
    myAppProps.pageProps = myAppProps.pageProps || {};
    const req = appContext.ctx.req;
    // 1) Figure out which host this request came in on
    const hostHeader = req?.headers['x-forwarded-host'] ?? req?.headers['host'];
    const headerHost = Array.isArray(hostHeader) ? hostHeader[0] : hostHeader;
    // 2) In dev, allow overriding with process.env.HOST so we can simulate domains locally
    const effectiveHost = process.env.HOST || headerHost;
    // 3) Derive region from effective host (pierceofart.co.uk vs pierceofart.com)
    const region = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$lib$2f$region$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getRegionFromHost"])(effectiveHost);
    myAppProps.pageProps.region = region;
    // 4) Existing customer logic
    const customerHeader = req?.headers['x-customer'];
    if (customerHeader && typeof customerHeader === 'string') {
        try {
            myAppProps.pageProps.customer = JSON.parse(customerHeader);
        } catch  {
        // ignore parse errors
        }
    }
    const pathname = appContext.router.pathname;
    if (pathname.startsWith('/admin')) {
        myAppProps.pageProps.noLayout = true;
    }
    return myAppProps;
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8952c621._.js.map