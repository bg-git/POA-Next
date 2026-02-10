(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect(param) {
    let { addMessageListener, sendMessage, onUpdateError = console.error } = param;
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: (param)=>{
            let [chunkPath, callback] = param;
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[project]/apps/storefront/src/context/FavouritesContext.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FavouritesProvider",
    ()=>FavouritesProvider,
    "useFavourites",
    ()=>useFavourites
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
const FavouritesContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const STORAGE_KEY = 'poa-favourites';
const FavouritesProvider = (param)=>{
    let { children } = param;
    _s();
    const [favourites, setFavourites] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FavouritesProvider.useEffect": ()=>{
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                try {
                    setFavourites(JSON.parse(stored));
                } catch  {
                    setFavourites([]);
                }
            }
        }
    }["FavouritesProvider.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FavouritesProvider.useEffect": ()=>{
            localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
        }
    }["FavouritesProvider.useEffect"], [
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FavouritesContext.Provider, {
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
_s(FavouritesProvider, "YQU4RUm0riV8V8vqQDIlCtErHGY=");
_c = FavouritesProvider;
const useFavourites = ()=>{
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(FavouritesContext);
    if (!ctx) throw new Error('useFavourites must be used inside FavouritesProvider');
    return ctx;
};
_s1(useFavourites, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "FavouritesProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/storefront/src/context/ToastContext.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ToastProvider",
    ()=>ToastProvider,
    "useToast",
    ()=>useToast
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
const ToastContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const ToastProvider = (param)=>{
    let { children } = param;
    _s();
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const showToast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ToastProvider.useCallback[showToast]": (msg)=>{
            setMessage(msg);
            setTimeout({
                "ToastProvider.useCallback[showToast]": ()=>setMessage(null)
            }["ToastProvider.useCallback[showToast]"], 3000);
        }
    }["ToastProvider.useCallback[showToast]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ToastContext.Provider, {
        value: {
            showToast
        },
        children: [
            children,
            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
_s(ToastProvider, "eA0VvGavZyiRUz97JTEu05bgboA=");
_c = ToastProvider;
const useToast = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
_s1(useToast, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "ToastProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/storefront/src/lib/cookies.ts [client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [client] (ecmascript)");
const COOKIE_NAME = 'customer_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days in seconds
const COOKIE_DOMAIN = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN || '.pierceofart.co.uk';
function setCustomerCookie(res, token) {
    const expires = new Date(Date.now() + COOKIE_MAX_AGE * 1000);
    const cookie = `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; SameSite=None; Max-Age=${COOKIE_MAX_AGE}; Expires=${expires.toUTCString()}; Domain=${COOKIE_DOMAIN}; Secure`;
    res.setHeader('Set-Cookie', cookie);
}
function clearCustomerCookie(res) {
    const cookie = `${COOKIE_NAME}=; Path=/; SameSite=None; Max-Age=0; Domain=${COOKIE_DOMAIN}; Secure`;
    res.setHeader('Set-Cookie', cookie);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/storefront/src/context/AuthContext.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$lib$2f$cookies$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/lib/cookies.ts [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
;
const STORAGE_KEY = 'poa-auth-user';
function debounce(fn, delay) {
    let timeoutId = null;
    const debounced = function() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
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
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function getInitialAuth(initialUser) {
    if (initialUser) {
        return {
            user: initialUser,
            isAuthenticated: true
        };
    }
    if ("TURBOPACK compile-time truthy", 1) {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                return {
                    user: JSON.parse(stored),
                    isAuthenticated: true
                };
            }
        } catch  {
        // ignore parse errors
        }
        const hasCookie = document.cookie.split('; ').some((cookie)=>cookie.startsWith(`${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$lib$2f$cookies$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["COOKIE_NAME"]}=`));
        if (hasCookie) {
            return {
                user: null,
                isAuthenticated: true
            };
        }
    }
    return {
        user: null,
        isAuthenticated: false
    };
}
function AuthProvider(param) {
    let { children, initialUser } = param;
    _s();
    const { user: initialStateUser, isAuthenticated: initialAuth } = getInitialAuth(initialUser);
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(initialStateUser);
    const [isAuthenticated, setIsAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(initialAuth);
    const [loading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const verifySession = async ()=>{
        const hasCookie = document.cookie.split('; ').some((cookie)=>cookie.startsWith(`${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$lib$2f$cookies$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["COOKIE_NAME"]}=`));
        if (!hasCookie) {
            setUser(null);
            setIsAuthenticated(false);
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.removeItem(STORAGE_KEY);
            }
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
                if ("TURBOPACK compile-time truthy", 1) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.customer));
                }
                return true;
            } else {
                setUser(null);
                setIsAuthenticated(false);
                if ("TURBOPACK compile-time truthy", 1) {
                    localStorage.removeItem(STORAGE_KEY);
                }
                return false;
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null);
            setIsAuthenticated(false);
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.removeItem(STORAGE_KEY);
            }
            return false;
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            verifySession();
            let intervalId = null;
            const startInterval = {
                "AuthProvider.useEffect.startInterval": ()=>{
                    if (intervalId === null) {
                        intervalId = setInterval(verifySession, 60_000);
                    }
                }
            }["AuthProvider.useEffect.startInterval"];
            const stopInterval = {
                "AuthProvider.useEffect.stopInterval": ()=>{
                    if (intervalId !== null) {
                        clearInterval(intervalId);
                        intervalId = null;
                    }
                }
            }["AuthProvider.useEffect.stopInterval"];
            if (document.visibilityState === 'visible') {
                startInterval();
            }
            const debouncedVerifySession = debounce(verifySession, 1_000);
            const handleVisibilityChange = {
                "AuthProvider.useEffect.handleVisibilityChange": ()=>{
                    if (document.visibilityState === 'visible') {
                        debouncedVerifySession();
                        startInterval();
                    } else {
                        debouncedVerifySession.cancel();
                        stopInterval();
                    }
                }
            }["AuthProvider.useEffect.handleVisibilityChange"];
            document.addEventListener('visibilitychange', handleVisibilityChange);
            return ({
                "AuthProvider.useEffect": ()=>{
                    stopInterval();
                    document.removeEventListener('visibilitychange', handleVisibilityChange);
                    debouncedVerifySession.cancel();
                }
            })["AuthProvider.useEffect"];
        }
    }["AuthProvider.useEffect"], []);
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
                const domain = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN || window.location.hostname;
                document.cookie = `${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$lib$2f$cookies$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["COOKIE_NAME"]}=${encodeURIComponent(data.accessToken)}; Domain=${domain}; Path=/; Secure; SameSite=None; Max-Age=${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$lib$2f$cookies$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["COOKIE_MAX_AGE"]}`;
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
                    if ("TURBOPACK compile-time truthy", 1) {
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData.customer));
                    }
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
        const domain = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN || window.location.hostname;
        document.cookie = `${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$lib$2f$cookies$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["COOKIE_NAME"]}=; Domain=${domain}; Path=/; Secure; SameSite=None; Max-Age=0`;
        setIsAuthenticated(false);
        setUser(null);
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.removeItem(STORAGE_KEY);
        }
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
                if ("TURBOPACK compile-time truthy", 1) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.customer));
                }
            }
        } catch (err) {
            console.error('Failed to refresh user:', err);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
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
_s(AuthProvider, "RS3J70RzJIFQOjjD52SR2MTZzhY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/storefront/src/context/CartContext.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CartProvider",
    ()=>CartProvider,
    "useCart",
    ()=>useCart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$FavouritesContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/FavouritesContext.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$ToastContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/ToastContext.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/AuthContext.tsx [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
;
;
const CartContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const ITEMS_KEY = 'poa-cart-items';
const CHECKOUT_ID_KEY = 'poa-checkout-id';
const CartProvider = (param)=>{
    let { children } = param;
    _s();
    const [cartItems, setCartItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [checkoutId, setCheckoutId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [checkoutUrl, setCheckoutUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [draftCheckoutUrl, setDraftCheckoutUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [draftStatus, setDraftStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('idle');
    const [draftSignature, setDraftSignature] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isDrawerOpen, setIsDrawerOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const checkoutUrlRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(checkoutUrl);
    const syncTimeout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const pendingSync = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const syncVersion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const abortController = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const latestItemsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(cartItems);
    const draftRequestRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const { addFavourite, isFavourite } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$FavouritesContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useFavourites"])();
    const { showToast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$ToastContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useToast"])();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const isVipMember = Array.isArray(user?.tags) ? user.tags.includes('VIP-MEMBER') : false;
    const openDrawer = ()=>setIsDrawerOpen(true);
    const closeDrawer = ()=>setIsDrawerOpen(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartProvider.useEffect": ()=>{
            checkoutUrlRef.current = checkoutUrl;
        }
    }["CartProvider.useEffect"], [
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
            items: items.map((param)=>{
                let { variantId, quantity } = param;
                return {
                    variantId,
                    quantity
                };
            })
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartProvider.useEffect": ()=>{
            return ({
                "CartProvider.useEffect": ()=>{
                    if (syncTimeout.current) clearTimeout(syncTimeout.current);
                    abortController.current?.abort();
                    resetDraftState();
                }
            })["CartProvider.useEffect"];
        }
    }["CartProvider.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartProvider.useEffect": ()=>{
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
                }).then({
                    "CartProvider.useEffect": (res)=>res.json()
                }["CartProvider.useEffect"]).then({
                    "CartProvider.useEffect": (data)=>{
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
                            }).then({
                                "CartProvider.useEffect": (res)=>res.json()
                            }["CartProvider.useEffect"]).then({
                                "CartProvider.useEffect": (data)=>{
                                    setCheckoutId(data.checkoutId);
                                    setCheckoutUrl(data.checkoutUrl);
                                    checkoutUrlRef.current = data.checkoutUrl;
                                }
                            }["CartProvider.useEffect"]).catch({
                                "CartProvider.useEffect": ()=>{
                                    setCheckoutId(null);
                                    setCheckoutUrl(null);
                                    checkoutUrlRef.current = null;
                                }
                            }["CartProvider.useEffect"]);
                            return;
                        }
                        const items = (cart.lines.edges || []).map({
                            "CartProvider.useEffect.items": (edge)=>{
                                // Try to find existing item data from localStorage
                                const existingItem = parsedItems.find({
                                    "CartProvider.useEffect.items.existingItem": (item)=>item.variantId === edge.node.merchandise.id
                                }["CartProvider.useEffect.items.existingItem"]);
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
                            }
                        }["CartProvider.useEffect.items"]);
                        setCartItems(items);
                        setCheckoutUrl(cart.checkoutUrl);
                        checkoutUrlRef.current = cart.checkoutUrl;
                    }
                }["CartProvider.useEffect"]).catch({
                    "CartProvider.useEffect": ()=>{
                        setCheckoutId(null);
                        setCheckoutUrl(null);
                        checkoutUrlRef.current = null;
                    }
                }["CartProvider.useEffect"]);
            }
        }
    }["CartProvider.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartProvider.useEffect": ()=>{
            localStorage.setItem(ITEMS_KEY, JSON.stringify(cartItems));
            if (checkoutId) {
                localStorage.setItem(CHECKOUT_ID_KEY, checkoutId);
            } else {
                localStorage.removeItem(CHECKOUT_ID_KEY);
            }
        }
    }["CartProvider.useEffect"], [
        cartItems,
        checkoutId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartProvider.useEffect": ()=>{
            latestItemsRef.current = cartItems;
        }
    }["CartProvider.useEffect"], [
        cartItems
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartProvider.useEffect": ()=>{
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
            buildVipDraftCheckout(signature, cartItems, requestId).catch({
                "CartProvider.useEffect": (error)=>{
                    if (cancelled) return;
                    console.error('Failed to warm VIP draft checkout', error);
                }
            }["CartProvider.useEffect"]);
            return ({
                "CartProvider.useEffect": ()=>{
                    cancelled = true;
                }
            })["CartProvider.useEffect"];
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["CartProvider.useEffect"], [
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
    const addToCart = function(variantId, quantity) {
        let meta = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CartContext.Provider, {
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
_s(CartProvider, "5vYXhG3IhlByvqxJzMElv2mwuxM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$FavouritesContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useFavourites"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$ToastContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useToast"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = CartProvider;
const useCart = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
_s1(useCart, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "CartProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/storefront/src/components/Seo.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Seo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [client] (ecmascript)");
;
;
function Seo(param) {
    let { title, description, canonical, schemaType = 'WebPage', schemaData } = param;
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                children: `${title} | PIERCE OF ART`
            }, void 0, false, {
                fileName: "[project]/apps/storefront/src/components/Seo.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this),
            description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                name: "description",
                content: description
            }, void 0, false, {
                fileName: "[project]/apps/storefront/src/components/Seo.tsx",
                lineNumber: 97,
                columnNumber: 23
            }, this),
            canonical && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                rel: "canonical",
                href: canonical
            }, void 0, false, {
                fileName: "[project]/apps/storefront/src/components/Seo.tsx",
                lineNumber: 98,
                columnNumber: 21
            }, this),
            schema && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("script", {
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
_c = Seo;
var _c;
__turbopack_context__.k.register(_c, "Seo");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/storefront/src/components/ProductGallery.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/components/ProductGallery.tsx
__turbopack_context__.s([
    "default",
    ()=>ProductGallery
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
;
/** Only render the gallery variant for the current viewport */ function useIsDesktop() {
    _s();
    const [isDesktop, setIsDesktop] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useIsDesktop.useEffect": ()=>{
            const mq = window.matchMedia("(min-width: 769px)");
            const onChange = {
                "useIsDesktop.useEffect.onChange": ()=>setIsDesktop(mq.matches)
            }["useIsDesktop.useEffect.onChange"];
            onChange();
            mq.addEventListener("change", onChange);
            return ({
                "useIsDesktop.useEffect": ()=>mq.removeEventListener("change", onChange)
            })["useIsDesktop.useEffect"];
        }
    }["useIsDesktop.useEffect"], []);
    return isDesktop;
}
_s(useIsDesktop, "I3DqNlxt7Pw4zzIZQic0ZfednQQ=");
function ProductGallery(param) {
    let { images, defaultActive = 0 } = param;
    _s1();
    const [active, setActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(defaultActive);
    const [heroIndex, setHeroIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(defaultActive);
    const isDesktop = useIsDesktop();
    const snapRowRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const safeImages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ProductGallery.useMemo[safeImages]": ()=>(images || []).filter(Boolean)
    }["ProductGallery.useMemo[safeImages]"], [
        images
    ]);
    // Keep active in sync if images or requested default changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductGallery.useEffect": ()=>{
            setActive(defaultActive);
            setHeroIndex(defaultActive);
        }
    }["ProductGallery.useEffect"], [
        images,
        defaultActive
    ]);
    // Track the last non-UGC image that was active (hero image)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductGallery.useEffect": ()=>{
            if (!safeImages[active]?.isUGC) setHeroIndex(active);
        }
    }["ProductGallery.useEffect"], [
        active,
        safeImages
    ]);
    // Thumbnails: hero + UGC images (if any UGC exists)
    const thumbs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ProductGallery.useMemo[thumbs]": ()=>{
            if (!safeImages.some({
                "ProductGallery.useMemo[thumbs]": (img)=>img.isUGC
            }["ProductGallery.useMemo[thumbs]"])) return [];
            return [
                {
                    img: safeImages[0],
                    i: 0
                },
                ...safeImages.map({
                    "ProductGallery.useMemo[thumbs]": (img, i)=>({
                            img,
                            i
                        })
                }["ProductGallery.useMemo[thumbs]"]).filter({
                    "ProductGallery.useMemo[thumbs]": (param)=>{
                        let { img, i } = param;
                        return i > 0 && img.isUGC;
                    }
                }["ProductGallery.useMemo[thumbs]"])
            ];
        }
    }["ProductGallery.useMemo[thumbs]"], [
        safeImages
    ]);
    // Mobile: active hero + all UGC images
    const mobileImages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ProductGallery.useMemo[mobileImages]": ()=>{
            const imgs = [];
            if (safeImages[heroIndex]) imgs.push({
                img: safeImages[heroIndex],
                i: heroIndex
            });
            safeImages.forEach({
                "ProductGallery.useMemo[mobileImages]": (img, i)=>{
                    if (img.isUGC && i !== heroIndex) imgs.push({
                        img,
                        i
                    });
                }
            }["ProductGallery.useMemo[mobileImages]"]);
            return imgs;
        }
    }["ProductGallery.useMemo[mobileImages]"], [
        safeImages,
        heroIndex
    ]);
    // Scroll the mobile carousel when the active index changes (e.g. variant switch)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductGallery.useEffect": ()=>{
            if (isDesktop) return;
            const el = snapRowRef.current;
            if (!el) return;
            const slideIndex = mobileImages.findIndex({
                "ProductGallery.useEffect.slideIndex": (param)=>{
                    let { i } = param;
                    return i === active;
                }
            }["ProductGallery.useEffect.slideIndex"]);
            const target = el.offsetWidth * Math.max(slideIndex, 0);
            if (Math.abs(el.scrollLeft - target) < 1) return;
            el.scrollTo({
                left: target
            });
        }
    }["ProductGallery.useEffect"], [
        active,
        isDesktop,
        mobileImages
    ]);
    if (!safeImages.length) return null;
    const main = safeImages[Math.min(active, safeImages.length - 1)];
    let thumbIndex = 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-e3757942a9114ea1",
        children: [
            isDesktop ? /* DESKTOP: main image + overlayed thumbnail strip (bottom-left) */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-e3757942a9114ea1" + " " + "gallery-desktop",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-e3757942a9114ea1" + " " + "img-wrap",
                    children: [
                        main.isUGC && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-e3757942a9114ea1" + " " + "badges",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "jsx-e3757942a9114ea1" + " " + "badge-ugc",
                                    children: "Styled by you"
                                }, void 0, false, {
                                    fileName: "[project]/apps/storefront/src/components/ProductGallery.tsx",
                                    lineNumber: 97,
                                    columnNumber: 17
                                }, this),
                                main.credit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
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
                        thumbs.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            role: "group",
                            "aria-label": "Product thumbnails",
                            className: "jsx-e3757942a9114ea1" + " " + "thumbs-overlay",
                            children: thumbs.map((param)=>{
                                let { img, i } = param;
                                thumbIndex += 1;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    "aria-label": `Show image ${thumbIndex}`,
                                    onClick: ()=>setActive(i),
                                    type: "button",
                                    className: "jsx-e3757942a9114ea1" + " " + `thumb ${i === active ? "is-active" : ""}`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-e3757942a9114ea1" + " " + "thumb-frame",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
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
            }, this) : /* MOBILE: swipe-only (scroll-snap), with dots */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "aria-label": "Product images",
                className: "jsx-e3757942a9114ea1" + " " + "gallery-mobile",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: snapRowRef,
                        onScroll: (e)=>{
                            const idx = Math.round(e.currentTarget.scrollLeft / e.currentTarget.offsetWidth);
                            const safeIdx = mobileImages[idx]?.i ?? 0;
                            setActive(safeIdx);
                        },
                        className: "jsx-e3757942a9114ea1" + " " + "snap-row",
                        children: mobileImages.map((param, mIdx)=>{
                            let { img, i } = param;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-e3757942a9114ea1" + " " + "snap-card",
                                children: [
                                    img.isUGC && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-e3757942a9114ea1" + " " + "badges",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-e3757942a9114ea1" + " " + "badge-ugc",
                                                children: "Styled by you"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/components/ProductGallery.tsx",
                                                lineNumber: 171,
                                                columnNumber: 21
                                            }, this),
                                            img.credit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
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
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/apps/storefront/src/components/ProductGallery.tsx",
                        lineNumber: 156,
                        columnNumber: 11
                    }, this),
                    mobileImages.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-e3757942a9114ea1" + " " + "dots",
                        children: mobileImages.map((param, idx)=>{
                            let { i } = param;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-e3757942a9114ea1" + " " + `dot ${i === active ? "is-active" : ""}`
                            }, idx, false, {
                                fileName: "[project]/apps/storefront/src/components/ProductGallery.tsx",
                                lineNumber: 195,
                                columnNumber: 17
                            }, this);
                        })
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
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
_s1(ProductGallery, "VaiV9buseNl076QZgw0aSFxMPLI=", false, function() {
    return [
        useIsDesktop
    ];
});
_c = ProductGallery;
var _c;
__turbopack_context__.k.register(_c, "ProductGallery");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/storefront/src/pages/products/[handle].tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__N_SSG",
    ()=>__N_SSG,
    "default",
    ()=>ProductPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$CartContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/CartContext.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$components$2f$Seo$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/components/Seo.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/AuthContext.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$ToastContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/ToastContext.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$components$2f$ProductGallery$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/components/ProductGallery.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dynamic$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dynamic.js [client] (ecmascript)");
;
;
;
var _s = __turbopack_context__.k.signature();
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
const StyledByYouLazy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dynamic$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/apps/storefront/src/components/StyledByYou.tsx [client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/apps/storefront/src/components/StyledByYou.tsx [client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false,
    loading: ()=>null
});
_c = StyledByYouLazy;
const FavouriteToggleLazy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dynamic$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/apps/storefront/src/components/FavouriteToggle.tsx [client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/apps/storefront/src/components/FavouriteToggle.tsx [client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false,
    loading: ()=>null
});
_c1 = FavouriteToggleLazy;
var __N_SSG = true;
function ProductPage(param) {
    let { product, ugcItems } = param;
    _s();
    const { addToCart, openDrawer } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$CartContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useCart"])();
    const { showToast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$ToastContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useToast"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [selectedVariantId, setSelectedVariantId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showVariantImage, setShowVariantImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [qty, setQty] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const variantEdges = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ProductPage.useMemo[variantEdges]": ()=>product?.variants?.edges || []
    }["ProductPage.useMemo[variantEdges]"], [
        product
    ]);
    const defaultVariant = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ProductPage.useMemo[defaultVariant]": ()=>{
            const nodes = (variantEdges || []).map({
                "ProductPage.useMemo[defaultVariant].nodes": (v)=>v.node
            }["ProductPage.useMemo[defaultVariant].nodes"]);
            if (nodes.length === 0) return null;
            // Prefer first in-stock variant; otherwise fall back to the first variant
            const firstInStock = nodes.find({
                "ProductPage.useMemo[defaultVariant].firstInStock": (v)=>v.availableForSale && (v.quantityAvailable ?? 0) > 0
            }["ProductPage.useMemo[defaultVariant].firstInStock"]);
            return firstInStock ?? nodes[0];
        }
    }["ProductPage.useMemo[defaultVariant]"], [
        variantEdges
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductPage.useEffect": ()=>{
            if (!defaultVariant) {
                setSelectedVariantId(null);
                setQty(0);
                return;
            }
            setSelectedVariantId(defaultVariant.id);
            setShowVariantImage(false);
            setQty(defaultVariant.availableForSale && (defaultVariant.quantityAvailable ?? 0) > 0 ? 1 : 0);
        }
    }["ProductPage.useEffect"], [
        router.asPath,
        product?.id,
        defaultVariant
    ]);
    const { user, refreshUser, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useAuth"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductPage.useEffect": ()=>{
            const v = variantEdges.find({
                "ProductPage.useEffect": (e)=>e.node.id === selectedVariantId
            }["ProductPage.useEffect"])?.node;
            if (!v) return;
            setQty((v.quantityAvailable ?? 0) > 0 ? 1 : 0);
            if (!v.image) {
                setShowVariantImage(false);
            }
        }
    }["ProductPage.useEffect"], [
        selectedVariantId,
        variantEdges
    ]);
    const selectedVariant = product?.variants?.edges?.find((v)=>v.node.id === selectedVariantId)?.node;
    // Build the combined gallery: official image first, optional variant image,
    // then up to 2 “Styled By You” images
    const galleryImages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ProductPage.useMemo[galleryImages]": ()=>{
            const official = (product.images?.edges || []).slice(0, 1).map({
                "ProductPage.useMemo[galleryImages].official": (param)=>{
                    let { node } = param;
                    return {
                        url: node.url,
                        width: node.width,
                        height: node.height,
                        alt: node.altText || product.title,
                        isUGC: false
                    };
                }
            }["ProductPage.useMemo[galleryImages].official"]);
            const variantImg = showVariantImage && selectedVariant?.image ? [
                {
                    url: selectedVariant.image.url,
                    width: selectedVariant.image.width,
                    height: selectedVariant.image.height,
                    alt: selectedVariant.image.altText || product.title,
                    isUGC: false
                }
            ] : [];
            const sby = (ugcItems || []).slice(0, 2).map({
                "ProductPage.useMemo[galleryImages].sby": (it)=>({
                        url: it.image.url,
                        width: it.image.width,
                        height: it.image.height,
                        alt: it.alt || "Styled by you",
                        isUGC: true,
                        credit: it.credit || undefined
                    })
            }["ProductPage.useMemo[galleryImages].sby"]);
            // De-dupe by base URL, preserving order
            const seen = new Set();
            return [
                ...official,
                ...variantImg,
                ...sby
            ].filter({
                "ProductPage.useMemo[galleryImages]": (img)=>{
                    const base = img.url.split("?")[0];
                    if (seen.has(base)) return false;
                    seen.add(base);
                    return true;
                }
            }["ProductPage.useMemo[galleryImages]"]);
        }
    }["ProductPage.useMemo[galleryImages]"], [
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
    const metafields = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ProductPage.useMemo[metafields]": ()=>product?.metafields || []
    }["ProductPage.useMemo[metafields]"], [
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
    const sbyAnchorRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [showSBY, setShowSBY] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductPage.useEffect": ()=>{
            const el = sbyAnchorRef.current;
            if (!el) return;
            const io = new IntersectionObserver({
                "ProductPage.useEffect": (param)=>{
                    let [entry] = param;
                    if (entry.isIntersecting) {
                        setShowSBY(true);
                        io.disconnect();
                    }
                }
            }["ProductPage.useEffect"], {
                rootMargin: '300px'
            });
            io.observe(el);
            return ({
                "ProductPage.useEffect": ()=>io.disconnect()
            })["ProductPage.useEffect"];
        }
    }["ProductPage.useEffect"], []);
    // ✅ Idle-load FavouriteToggle (with proper typing from src/types/idle-callback.d.ts)
    const [showFav, setShowFav] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductPage.useEffect": ()=>{
            let cancel;
            if (("TURBOPACK compile-time value", "object") !== 'undefined' && typeof window.requestIdleCallback === 'function') {
                const id = window.requestIdleCallback({
                    "ProductPage.useEffect.id": ()=>setShowFav(true)
                }["ProductPage.useEffect.id"]);
                cancel = ({
                    "ProductPage.useEffect": ()=>{
                        if (typeof window.cancelIdleCallback === 'function') {
                            window.cancelIdleCallback(id);
                        }
                    }
                })["ProductPage.useEffect"];
            } else {
                const t = window.setTimeout({
                    "ProductPage.useEffect.t": ()=>setShowFav(true)
                }["ProductPage.useEffect.t"], 300);
                cancel = ({
                    "ProductPage.useEffect": ()=>window.clearTimeout(t)
                })["ProductPage.useEffect"];
            }
            return ({
                "ProductPage.useEffect": ()=>{
                    if (cancel) cancel();
                }
            })["ProductPage.useEffect"];
        }
    }["ProductPage.useEffect"], []);
    if (!product) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$components$2f$Seo$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                title: getFieldValue('title') || product.title,
                description: getFieldValue('description') || `Buy ${product.title} in 14k gold or titanium.`,
                canonical: `https://www.pierceofart.co.uk/item/${product.handle}`
            }, void 0, false, {
                fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                lineNumber: 329,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("script", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                style: {
                    maxWidth: '1400px',
                    margin: '0 auto',
                    padding: '16px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "product-layout",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "product-image",
                                style: {
                                    position: 'relative'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$components$2f$ProductGallery$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                        images: galleryImages,
                                        defaultActive: showVariantImage ? 1 : 0
                                    }, void 0, false, {
                                        fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                        lineNumber: 371,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "fav-wrapper",
                                        children: showFav ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FavouriteToggleLazy, {
                                            handle: router.query.handle,
                                            title: product.title,
                                            image: galleryImages[0]?.url || '/placeholder.png',
                                            price: formattedPrice,
                                            metafields: metafields
                                        }, void 0, false, {
                                            fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                            lineNumber: 378,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "product-info",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            justifyContent: 'flex-end'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                width: '80px',
                                                height: '24px',
                                                position: 'relative'
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                    variantOptions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: '24px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    gap: '8px',
                                                    flexWrap: 'wrap'
                                                },
                                                children: variantOptions.map((variant)=>{
                                                    const isCurrent = variant.label === currentVariantLabel;
                                                    return isCurrent ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
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
                                    product.variants?.edges?.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "variant-wrapper",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "variant-label",
                                                children: "Select an option:"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                                lineNumber: 485,
                                                columnNumber: 7
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "variant-grid",
                                                children: product.variants.edges.map((param)=>{
                                                    let { node } = param;
                                                    const isSelected = selectedVariantId === node.id;
                                                    const oos = !node.availableForSale || (node.quantityAvailable ?? 0) <= 0;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "desktop-add-to-cart",
                                        style: {
                                            marginTop: '24px'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                gap: '12px'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
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
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: '32px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
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
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                style: {
                                                    width: '100%',
                                                    borderCollapse: 'collapse',
                                                    fontSize: '14px',
                                                    border: '1px solid #e0e0e0'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                    children: Object.entries(fieldLabels).map((param)=>{
                                                        let [key, label] = param;
                                                        const value = getFieldValue(key);
                                                        return value ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    style: cellLabelStyle,
                                                                    children: label.toUpperCase()
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/storefront/src/pages/products/[handle].tsx",
                                                                    lineNumber: 640,
                                                                    columnNumber: 15
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
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
                                            product.descriptionHtml && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: sbyAnchorRef,
                        style: {
                            minHeight: showSBY ? undefined : '400px'
                        },
                        children: showSBY ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StyledByYouLazy, {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
_s(ProductPage, "eMoEc8fWqps7TYilMniVAe9BXLo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$CartContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useCart"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$ToastContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useToast"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c2 = ProductPage;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "StyledByYouLazy");
__turbopack_context__.k.register(_c1, "FavouriteToggleLazy");
__turbopack_context__.k.register(_c2, "ProductPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/apps/storefront/src/pages/products/[handle].tsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/products/[handle]";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/apps/storefront/src/pages/products/[handle].tsx [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/apps/storefront/src/pages/products/[handle].tsx\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/apps/storefront/src/pages/products/[handle].tsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__b28116f1._.js.map