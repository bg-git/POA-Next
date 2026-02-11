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
"[project]/apps/storefront/src/context/RegionContext.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/context/RegionContext.tsx
__turbopack_context__.s([
    "RegionProvider",
    ()=>RegionProvider,
    "useRegion",
    ()=>useRegion
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
const RegionContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createContext"])('uk');
const RegionProvider = (param)=>{
    let { children, initialRegion } = param;
    // Just pass through the region from SSR – no client override
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RegionContext.Provider, {
        value: initialRegion,
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/storefront/src/context/RegionContext.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = RegionProvider;
const useRegion = ()=>{
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(RegionContext);
};
_s(useRegion, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
var _c;
__turbopack_context__.k.register(_c, "RegionProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/storefront/src/lib/region.ts [client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
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
"[project]/apps/storefront/src/components/Header.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$CartContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/CartContext.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/AuthContext.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$FavouritesContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/FavouritesContext.tsx [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
function Header() {
    _s();
    const { openDrawer, cartItems } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$CartContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useCart"])();
    const { isAuthenticated, user, signOut, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [isMounted, setIsMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const itemCount = cartItems.reduce((sum, item)=>sum + item.quantity, 0);
    const { favourites } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$FavouritesContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useFavourites"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Header.useEffect": ()=>{
            setIsMounted(true);
        }
    }["Header.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "header-top",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "header-top-content",
                    children: !loading && (isMounted && isAuthenticated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/account",
                                style: {
                                    color: '#fff',
                                    textDecoration: 'none',
                                    marginRight: '12px'
                                },
                                children: user?.firstName ? `My Account` : 'My Account'
                            }, void 0, false, {
                                fileName: "[project]/apps/storefront/src/components/Header.tsx",
                                lineNumber: 28,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    marginRight: '12px'
                                },
                                children: "|"
                            }, void 0, false, {
                                fileName: "[project]/apps/storefront/src/components/Header.tsx",
                                lineNumber: 33,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                lineNumber: 34,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/register",
                                style: {
                                    color: '#fff',
                                    textDecoration: 'none',
                                    marginRight: '12px'
                                },
                                children: "Join Us"
                            }, void 0, false, {
                                fileName: "[project]/apps/storefront/src/components/Header.tsx",
                                lineNumber: 50,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    marginRight: '12px'
                                },
                                children: "|"
                            }, void 0, false, {
                                fileName: "[project]/apps/storefront/src/components/Header.tsx",
                                lineNumber: 53,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/sign-in",
                                style: {
                                    color: '#fff',
                                    textDecoration: 'none'
                                },
                                children: "Sign In"
                            }, void 0, false, {
                                fileName: "[project]/apps/storefront/src/components/Header.tsx",
                                lineNumber: 54,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true))
                }, void 0, false, {
                    fileName: "[project]/apps/storefront/src/components/Header.tsx",
                    lineNumber: 24,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/storefront/src/components/Header.tsx",
                lineNumber: 23,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "header-main",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "header-main-content",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            style: {
                                display: 'flex',
                                alignItems: 'center'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
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
                                lineNumber: 69,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/storefront/src/components/Header.tsx",
                            lineNumber: 67,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/favourites",
                                    "aria-label": "My Favourites",
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        cursor: 'pointer'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
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
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            d: "M12 21c-1.1-1.04-5.55-5.08-7.62-7.51C2.64 11.21 2 9.66 2 8.25 2 5.4 4.4 3 7.25 3c1.49 0 2.94.68 3.75 1.75A5.48 5.48 0 0116.75 3C19.6 3 22 5.4 22 8.25c0 1.41-.64 2.96-2.38 5.24C17.55 15.92 13.1 19.96 12 21z"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/storefront/src/components/Header.tsx",
                                            lineNumber: 95,
                                            columnNumber: 7
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/storefront/src/components/Header.tsx",
                                        lineNumber: 85,
                                        columnNumber: 5
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/storefront/src/components/Header.tsx",
                                    lineNumber: 80,
                                    columnNumber: 3
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                    lineNumber: 103,
                                    columnNumber: 3
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/storefront/src/components/Header.tsx",
                            lineNumber: 79,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/storefront/src/components/Header.tsx",
                    lineNumber: 65,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/storefront/src/components/Header.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "header-nav",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "header-nav-content",
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
                    ].map((param)=>{
                        let { label, href } = param;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
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
                            lineNumber: 136,
                            columnNumber: 3
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/apps/storefront/src/components/Header.tsx",
                    lineNumber: 126,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/storefront/src/components/Header.tsx",
                lineNumber: 125,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(Header, "CWZUHizc9vgJcc0IE+LX0BpNl5Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$CartContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useCart"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$FavouritesContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useFavourites"]
    ];
});
_c = Header;
const __TURBOPACK__default__export__ = /*#__PURE__*/ _c1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["memo"])(Header);
var _c, _c1;
__turbopack_context__.k.register(_c, "Header");
__turbopack_context__.k.register(_c1, "%default%");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/storefront/src/context/ChatDrawerContext.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChatDrawerProvider",
    ()=>ChatDrawerProvider,
    "useChatDrawer",
    ()=>useChatDrawer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
const ChatDrawerContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function ChatDrawerProvider(param) {
    let { children } = param;
    _s();
    const [isDrawerOpen, setIsDrawerOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const openDrawer = ()=>setIsDrawerOpen(true);
    const closeDrawer = ()=>setIsDrawerOpen(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ChatDrawerContext.Provider, {
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
_s(ChatDrawerProvider, "t28cAGpFqiK0sX63aU+U7uaWhmM=");
_c = ChatDrawerProvider;
function useChatDrawer() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(ChatDrawerContext);
    if (!context) throw new Error('useChatDrawer must be used within a ChatDrawerProvider');
    return context;
}
_s1(useChatDrawer, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "ChatDrawerProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/storefront/src/components/Footer.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$ChatDrawerContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/ChatDrawerContext.tsx [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
    _s();
    const [openIndex, setOpenIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const toggle = (index)=>setOpenIndex(openIndex === index ? null : index);
    const { openDrawer: openChatDrawer } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$ChatDrawerContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useChatDrawer"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "site-footer",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "footer-inner",
            children: sections.map((section, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "footer-section",
                    "data-open": openIndex === index,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "footer-toggle",
                            onClick: ()=>toggle(index),
                            "aria-expanded": openIndex === index,
                            children: [
                                section.title,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "footer-links",
                            children: section.links.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: link.label === 'Contact Us' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                    }, this) : link.href.startsWith('/') ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: link.href,
                                        children: link.label
                                    }, void 0, false, {
                                        fileName: "[project]/apps/storefront/src/components/Footer.tsx",
                                        lineNumber: 79,
                                        columnNumber: 21
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
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
_s(Footer, "PbOR2OVgVmz0sS+1IzziH8cGzs4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$ChatDrawerContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useChatDrawer"]
    ];
});
_c = Footer;
const __TURBOPACK__default__export__ = /*#__PURE__*/ _c1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["memo"])(Footer);
var _c, _c1;
__turbopack_context__.k.register(_c, "Footer");
__turbopack_context__.k.register(_c1, "%default%");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/storefront/src/components/BreadcrumbSchema.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BreadcrumbSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
const slugToLabel = {
    'chains-charms': 'Chains & Charms',
    'ends-gems': 'Ends & Gems',
    'backs-bars': 'Backs & Bars',
    'rings-hoops': 'Rings & Hoops'
};
function BreadcrumbSchema() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("script", {
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
_s(BreadcrumbSchema, "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = BreadcrumbSchema;
var _c;
__turbopack_context__.k.register(_c, "BreadcrumbSchema");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/storefront/src/hooks/useAccountValidation.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAccountValidation",
    ()=>useAccountValidation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/AuthContext.tsx [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
const useAccountValidation = ()=>{
    _s();
    const [isAccountComplete, setIsAccountComplete] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Safely get auth context - handle case where it might not be available
    let isAuthenticated = false;
    let user = null;
    try {
        const authContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useAuth"])();
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAccountValidation.useEffect": ()=>{
            checkAccountStatus();
        }
    }["useAccountValidation.useEffect"], [
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
_s(useAccountValidation, "fQOhqDtVuGBVYYno98UdkZgSdKI=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/storefront/src/context/AccountValidationContext.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AccountValidationProvider",
    ()=>AccountValidationProvider,
    "useAccountValidationContext",
    ()=>useAccountValidationContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$hooks$2f$useAccountValidation$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/hooks/useAccountValidation.ts [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
const AccountValidationContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AccountValidationProvider(param) {
    let { children } = param;
    _s();
    const accountValidation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$hooks$2f$useAccountValidation$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useAccountValidation"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AccountValidationContext.Provider, {
        value: accountValidation,
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/storefront/src/context/AccountValidationContext.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_s(AccountValidationProvider, "Rc990qx4DmzPQPO5mVC/4veXlw0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$hooks$2f$useAccountValidation$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useAccountValidation"]
    ];
});
_c = AccountValidationProvider;
function useAccountValidationContext() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(AccountValidationContext);
    if (context === undefined) {
        throw new Error('useAccountValidationContext must be used within an AccountValidationProvider');
    }
    return context;
}
_s1(useAccountValidationContext, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AccountValidationProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/storefront/src/components/AccountCompletionBanner.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AccountCompletionBanner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AccountValidationContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/AccountValidationContext.tsx [client] (ecmascript)");
;
;
;
function AccountCompletionBanner() {
    try {
        const { isAccountComplete, isLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AccountValidationContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useAccountValidationContext"])();
        // Don't show banner if loading or account is complete
        if (isLoading || isAccountComplete) {
            return null;
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: [
                    "You must complete your account setup.",
                    ' ',
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
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
_c = AccountCompletionBanner;
var _c;
__turbopack_context__.k.register(_c, "AccountCompletionBanner");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/storefront/src/pages/_app.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// pages/_app.tsx
__turbopack_context__.s([
    "default",
    ()=>MyApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$app$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/app.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dynamic$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dynamic.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$vercel$2f$analytics$2f$dist$2f$next$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@vercel/analytics/dist/next/index.mjs [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$RegionContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/RegionContext.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$lib$2f$region$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/lib/region.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$components$2f$Header$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/components/Header.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$components$2f$Footer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/components/Footer.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$components$2f$BreadcrumbSchema$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/components/BreadcrumbSchema.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$components$2f$AccountCompletionBanner$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/components/AccountCompletionBanner.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$CartContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/CartContext.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/AuthContext.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$FavouritesContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/FavouritesContext.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$ToastContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/ToastContext.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$ChatDrawerContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/ChatDrawerContext.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AccountValidationContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/AccountValidationContext.tsx [client] (ecmascript)");
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
const CartDrawer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dynamic$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/apps/storefront/src/components/CartDrawer.tsx [client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/apps/storefront/src/components/CartDrawer.tsx [client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c = CartDrawer;
const ChatDrawer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dynamic$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/apps/storefront/src/components/ChatDrawer.tsx [client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/apps/storefront/src/components/ChatDrawer.tsx [client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c1 = ChatDrawer;
function MyApp(param) {
    let { Component, pageProps } = param;
    _s();
    const initialRegion = pageProps.region ?? 'uk';
    const noLayout = pageProps.noLayout === true;
    // ------------------------------
    // Scroll restoration (fixes: back to "/" not remembering position)
    // ------------------------------
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const isPopState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MyApp.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            // We handle restoration ourselves (SSR pages often won't restore reliably otherwise)
            if ('scrollRestoration' in window.history) {
                window.history.scrollRestoration = 'manual';
            }
            router.beforePopState({
                "MyApp.useEffect": ()=>{
                    isPopState.current = true;
                    return true;
                }
            }["MyApp.useEffect"]);
            const keyFor = {
                "MyApp.useEffect.keyFor": (asPath)=>`scroll:${asPath}`
            }["MyApp.useEffect.keyFor"];
            const save = {
                "MyApp.useEffect.save": (asPath)=>{
                    try {
                        sessionStorage.setItem(keyFor(asPath), String(window.scrollY));
                    } catch  {
                    // ignore
                    }
                }
            }["MyApp.useEffect.save"];
            const restore = {
                "MyApp.useEffect.restore": (asPath)=>{
                    let y = null;
                    try {
                        y = sessionStorage.getItem(keyFor(asPath));
                    } catch  {
                    // ignore
                    }
                    if (y == null) return;
                    // Wait for paint (important for SSR + images)
                    requestAnimationFrame({
                        "MyApp.useEffect.restore": ()=>{
                            window.scrollTo(0, Number(y));
                        }
                    }["MyApp.useEffect.restore"]);
                }
            }["MyApp.useEffect.restore"];
            const onRouteChangeStart = {
                "MyApp.useEffect.onRouteChangeStart": ()=>{
                    save(router.asPath);
                }
            }["MyApp.useEffect.onRouteChangeStart"];
            const onRouteChangeComplete = {
                "MyApp.useEffect.onRouteChangeComplete": (url)=>{
                    if (isPopState.current) restore(url);
                    isPopState.current = false;
                }
            }["MyApp.useEffect.onRouteChangeComplete"];
            router.events.on('routeChangeStart', onRouteChangeStart);
            router.events.on('routeChangeComplete', onRouteChangeComplete);
            return ({
                "MyApp.useEffect": ()=>{
                    router.events.off('routeChangeStart', onRouteChangeStart);
                    router.events.off('routeChangeComplete', onRouteChangeComplete);
                }
            })["MyApp.useEffect"];
        }
    }["MyApp.useEffect"], [
        router
    ]);
    // ------------------------------
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$vercel$2f$analytics$2f$dist$2f$next$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["Analytics"], {}, void 0, false, {
                fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                lineNumber: 126,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$ToastContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["ToastProvider"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["AuthProvider"], {
                    initialUser: pageProps.customer || null,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AccountValidationContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["AccountValidationProvider"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$FavouritesContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["FavouritesProvider"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$CartContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["CartProvider"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$ChatDrawerContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["ChatDrawerProvider"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$RegionContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["RegionProvider"], {
                                        initialRegion: initialRegion,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                                                        name: "viewport",
                                                        content: "width=device-width, initial-scale=1, viewport-fit=cover"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                        lineNumber: 135,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                                                        name: "theme-color",
                                                        content: "#ffffff"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                        lineNumber: 139,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                                                        rel: "icon",
                                                        href: "/favicon.ico"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                        lineNumber: 140,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                                                        rel: "apple-touch-icon",
                                                        sizes: "180x180",
                                                        href: "/apple-touch-icon.png"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                        lineNumber: 141,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                                                        rel: "icon",
                                                        type: "image/png",
                                                        sizes: "32x32",
                                                        href: "/favicon-32x32.png"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                        lineNumber: 142,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                                                        rel: "icon",
                                                        type: "image/png",
                                                        sizes: "16x16",
                                                        href: "/favicon-16x16.png"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                        lineNumber: 143,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                                                        rel: "manifest",
                                                        href: "/site.webmanifest"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                        lineNumber: 144,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                                                        rel: "mask-icon",
                                                        href: "/safari-pinned-tab.svg",
                                                        color: "#181818"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                        lineNumber: 145,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                                                        name: "msapplication-TileColor",
                                                        content: "#ffffff"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                        lineNumber: 146,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                lineNumber: 134,
                                                columnNumber: 19
                                            }, this),
                                            noLayout ? // Dedicated pages like the .com region selector or /admin
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {
                                                ...pageProps
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                lineNumber: 151,
                                                columnNumber: 21
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            minHeight: '100dvh'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$components$2f$AccountCompletionBanner$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                                fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                                lineNumber: 161,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$components$2f$Header$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                                fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                                lineNumber: 162,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                                                                style: {
                                                                    flex: '1 0 auto'
                                                                },
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {
                                                                    ...pageProps
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                                    lineNumber: 164,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                                lineNumber: 163,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$components$2f$BreadcrumbSchema$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                                fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                                lineNumber: 166,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$components$2f$Footer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                                fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                                lineNumber: 167,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                        lineNumber: 154,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CartDrawer, {}, void 0, false, {
                                                        fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                        lineNumber: 169,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ChatDrawer, {}, void 0, false, {
                                                        fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                                        lineNumber: 170,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                        lineNumber: 133,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                    lineNumber: 132,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                                lineNumber: 131,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                            lineNumber: 130,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                        lineNumber: 129,
                        columnNumber: 9
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                    lineNumber: 128,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/storefront/src/pages/_app.tsx",
                lineNumber: 127,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(MyApp, "KIibRJ0cDa9cT4Hi4Be6xn0fqKs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c2 = MyApp;
MyApp.getInitialProps = async (appContext)=>{
    const appProps = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$app$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].getInitialProps(appContext);
    const myAppProps = appProps;
    // Ensure pageProps exists
    myAppProps.pageProps = myAppProps.pageProps || {};
    const req = appContext.ctx.req;
    // 1) Figure out which host this request came in on
    const hostHeader = req?.headers['x-forwarded-host'] ?? req?.headers['host'];
    const headerHost = Array.isArray(hostHeader) ? hostHeader[0] : hostHeader;
    // 2) In dev, allow overriding with process.env.HOST so we can simulate domains locally
    const effectiveHost = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].env.HOST || headerHost;
    // 3) Derive region from effective host (pierceofart.co.uk vs pierceofart.com)
    const region = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$lib$2f$region$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["getRegionFromHost"])(effectiveHost);
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
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "CartDrawer");
__turbopack_context__.k.register(_c1, "ChatDrawer");
__turbopack_context__.k.register(_c2, "MyApp");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/apps/storefront/src/pages/_app.tsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/_app";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/apps/storefront/src/pages/_app.tsx [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/apps/storefront/src/pages/_app\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/apps/storefront/src/pages/_app.tsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__439b8a5a._.js.map