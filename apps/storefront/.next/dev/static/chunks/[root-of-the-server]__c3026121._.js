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
"[project]/apps/storefront/src/components/BookingAuthModal.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/AuthContext.tsx [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
const BookingAuthModal = (param)=>{
    let { isOpen, onClose, onAuthSuccess } = param;
    _s();
    const { signIn } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('choose');
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    if (!isOpen) return null;
    const handleSignIn = async (e)=>{
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const result = await signIn(email, password);
            if (result.success) {
                setEmail('');
                setPassword('');
                setMode('choose');
                onClose();
                onAuthSuccess();
            } else {
                setError(result.error || 'Sign in failed');
            }
        } catch  {
            setError('An error occurred. Please try again.');
        } finally{
            setLoading(false);
        }
    };
    const handleRegisterClick = ()=>{
        // Open register page in a new tab or modal - for now redirect
        window.open('/account?tab=register', '_blank');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                background: '#fff',
                padding: '40px 32px',
                borderRadius: '0',
                maxWidth: '500px',
                width: '90%',
                position: 'relative'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    "aria-label": "Close",
                    onClick: onClose,
                    style: {
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'none',
                        border: 'none',
                        fontSize: '28px',
                        cursor: 'pointer',
                        color: '#000',
                        padding: '0',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    },
                    children: "×"
                }, void 0, false, {
                    fileName: "[project]/apps/storefront/src/components/BookingAuthModal.tsx",
                    lineNumber: 73,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                mode === 'choose' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            style: {
                                fontSize: '24px',
                                fontWeight: '700',
                                marginBottom: '12px',
                                textTransform: 'uppercase',
                                margin: '0 0 12px 0'
                            },
                            children: "SIGN IN TO BOOK"
                        }, void 0, false, {
                            fileName: "[project]/apps/storefront/src/components/BookingAuthModal.tsx",
                            lineNumber: 99,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                fontSize: '14px',
                                color: '#666',
                                marginBottom: '32px',
                                margin: '0 0 32px 0'
                            },
                            children: "You need to be logged in to book an appointment. Sign in to your account or create a new one."
                        }, void 0, false, {
                            fileName: "[project]/apps/storefront/src/components/BookingAuthModal.tsx",
                            lineNumber: 109,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setMode('signin'),
                                    style: {
                                        padding: '16px 24px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        background: '#000',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '0',
                                        cursor: 'pointer',
                                        textTransform: 'uppercase',
                                        width: '100%'
                                    },
                                    children: "Sign In"
                                }, void 0, false, {
                                    fileName: "[project]/apps/storefront/src/components/BookingAuthModal.tsx",
                                    lineNumber: 123,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: handleRegisterClick,
                                    style: {
                                        padding: '16px 24px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        background: '#fff',
                                        color: '#000',
                                        border: '1px solid #000',
                                        borderRadius: '0',
                                        cursor: 'pointer',
                                        textTransform: 'uppercase',
                                        width: '100%'
                                    },
                                    children: "Create Account"
                                }, void 0, false, {
                                    fileName: "[project]/apps/storefront/src/components/BookingAuthModal.tsx",
                                    lineNumber: 142,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/storefront/src/components/BookingAuthModal.tsx",
                            lineNumber: 118,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                fontSize: '12px',
                                color: '#999',
                                marginTop: '24px',
                                textAlign: 'center',
                                margin: '24px 0 0 0'
                            },
                            children: "Your booking will be saved to your account and a draft order will be created in Shopify."
                        }, void 0, false, {
                            fileName: "[project]/apps/storefront/src/components/BookingAuthModal.tsx",
                            lineNumber: 162,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true),
                mode === 'signin' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            style: {
                                fontSize: '24px',
                                fontWeight: '700',
                                marginBottom: '24px',
                                textTransform: 'uppercase',
                                margin: '0 0 24px 0'
                            },
                            children: "SIGN IN"
                        }, void 0, false, {
                            fileName: "[project]/apps/storefront/src/components/BookingAuthModal.tsx",
                            lineNumber: 176,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleSignIn,
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            style: {
                                                display: 'block',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                marginBottom: '8px',
                                                textTransform: 'uppercase'
                                            },
                                            children: "Email"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/storefront/src/components/BookingAuthModal.tsx",
                                            lineNumber: 188,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "email",
                                            value: email,
                                            onChange: (e)=>setEmail(e.target.value),
                                            required: true,
                                            style: {
                                                width: '100%',
                                                padding: '12px',
                                                fontSize: '14px',
                                                border: '1px solid #ddd',
                                                borderRadius: '0',
                                                boxSizing: 'border-box',
                                                fontFamily: 'inherit'
                                            },
                                            placeholder: "your@email.com"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/storefront/src/components/BookingAuthModal.tsx",
                                            lineNumber: 197,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/storefront/src/components/BookingAuthModal.tsx",
                                    lineNumber: 187,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            style: {
                                                display: 'block',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                marginBottom: '8px',
                                                textTransform: 'uppercase'
                                            },
                                            children: "Password"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/storefront/src/components/BookingAuthModal.tsx",
                                            lineNumber: 216,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "password",
                                            value: password,
                                            onChange: (e)=>setPassword(e.target.value),
                                            required: true,
                                            style: {
                                                width: '100%',
                                                padding: '12px',
                                                fontSize: '14px',
                                                border: '1px solid #ddd',
                                                borderRadius: '0',
                                                boxSizing: 'border-box',
                                                fontFamily: 'inherit'
                                            },
                                            placeholder: "••••••••"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/storefront/src/components/BookingAuthModal.tsx",
                                            lineNumber: 225,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/storefront/src/components/BookingAuthModal.tsx",
                                    lineNumber: 215,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: '12px',
                                        background: '#fee',
                                        color: '#c00',
                                        fontSize: '13px',
                                        borderRadius: '0'
                                    },
                                    children: error
                                }, void 0, false, {
                                    fileName: "[project]/apps/storefront/src/components/BookingAuthModal.tsx",
                                    lineNumber: 244,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: loading,
                                    style: {
                                        padding: '16px 24px',
                                        fontSize: '16px',
                                        fontWeight: '700',
                                        background: '#000',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '0',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        textTransform: 'uppercase',
                                        width: '100%',
                                        opacity: loading ? 0.7 : 1
                                    },
                                    children: loading ? 'Signing In...' : 'Sign In'
                                }, void 0, false, {
                                    fileName: "[project]/apps/storefront/src/components/BookingAuthModal.tsx",
                                    lineNumber: 255,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/storefront/src/components/BookingAuthModal.tsx",
                            lineNumber: 186,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>setMode('choose'),
                            style: {
                                marginTop: '16px',
                                padding: '12px 24px',
                                background: 'none',
                                border: 'none',
                                color: '#666',
                                cursor: 'pointer',
                                fontSize: '14px',
                                width: '100%'
                            },
                            children: "← Back"
                        }, void 0, false, {
                            fileName: "[project]/apps/storefront/src/components/BookingAuthModal.tsx",
                            lineNumber: 276,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/storefront/src/components/BookingAuthModal.tsx",
            lineNumber: 65,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/apps/storefront/src/components/BookingAuthModal.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(BookingAuthModal, "U27cN04A0zGEtb/vCxJMoZ8aswY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = BookingAuthModal;
const __TURBOPACK__default__export__ = BookingAuthModal;
var _c;
__turbopack_context__.k.register(_c, "BookingAuthModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$components$2f$BookingAuthModal$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/components/BookingAuthModal.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/AuthContext.tsx [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
const BookAPiercing = ()=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { location, reschedule } = router.query;
    const { isAuthenticated, user, loading: authLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const rescheduleBookingId = reschedule;
    const isRescheduleMode = !!rescheduleBookingId;
    const [showAuthModal, setShowAuthModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isClient, setIsClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [attemptedDate, setAttemptedDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedDate, setSelectedDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedTime, setSelectedTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [availableTimes, setAvailableTimes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [availabilities, setAvailabilities] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [agreeToTos, setAgreeToTos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isBooked, setIsBooked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [bookedTime, setBookedTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currentMonth, setCurrentMonth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Initialize on client side only to prevent hydration issues
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BookAPiercing.useEffect": ()=>{
            setIsClient(true);
        }
    }["BookAPiercing.useEffect"], []);
    // Initialize currentMonth on client side only
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BookAPiercing.useEffect": ()=>{
            if (currentMonth === null && isClient) {
                setCurrentMonth(new Date());
            }
        }
    }["BookAPiercing.useEffect"], [
        isClient,
        currentMonth
    ]);
    const locationTitle = location === 'chesterfield' ? 'Chesterfield' : location === 'leicester' ? 'Leicester' : 'Booking';
    const locationMap = {
        chesterfield: {
            name: 'Chester',
            address: '3 Knifesmithgate',
            city: 'Chesterfield',
            postcode: 'S40 1RF',
            phone: '+44 (0) 1246 555555'
        },
        leicester: {
            name: 'Leicester',
            address: '8 Silver Walk, St Martins Square',
            city: 'Leicester',
            postcode: 'LE1 5EW',
            phone: '+44 (0) 116 507 0400'
        }
    };
    const locationData = location ? locationMap[location] : null;
    // Mock data - replace with API call
    const generateMockAvailabilities = ()=>{
        const availabilities = [];
        const today = new Date();
        for(let i = 0; i < 30; i++){
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            if (date.getDay() === 0) continue; // Skip Sundays
            const dateStr = date.toISOString().split('T')[0];
            const timeSlots = [
                {
                    start_time: '09:00 AM',
                    formatedTime: '9:00 AM',
                    slots: 2
                },
                {
                    start_time: '10:00 AM',
                    formatedTime: '10:00 AM',
                    slots: 2
                },
                {
                    start_time: '11:00 AM',
                    formatedTime: '11:00 AM',
                    slots: i % 2 === 0 ? 1 : 2
                },
                {
                    start_time: '02:00 PM',
                    formatedTime: '2:00 PM',
                    slots: 2
                },
                {
                    start_time: '03:00 PM',
                    formatedTime: '3:00 PM',
                    slots: 2
                },
                {
                    start_time: '04:00 PM',
                    formatedTime: '4:00 PM',
                    slots: i % 3 === 0 ? 0 : 1
                }
            ];
            availabilities.push({
                date: dateStr,
                available: timeSlots.some((t)=>t.slots > 0),
                spots: timeSlots
            });
        }
        return availabilities;
    };
    const handleAuthSuccess = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "BookAPiercing.useCallback[handleAuthSuccess]": ()=>{
            // After successful authentication, auto-select the date they tried to click
            if (attemptedDate) {
                setSelectedDate(attemptedDate);
                setAttemptedDate(null);
            }
        }
    }["BookAPiercing.useCallback[handleAuthSuccess]"], [
        attemptedDate
    ]);
    // Initialize availabilities from API on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BookAPiercing.useEffect": ()=>{
            const fetchAvailabilities = {
                "BookAPiercing.useEffect.fetchAvailabilities": async ()=>{
                    if (!location) return;
                    try {
                        const response = await fetch(`/api/booking/availability?location=${location}`);
                        if (response.ok) {
                            const data = await response.json();
                            setAvailabilities(data.availabilities || []);
                        } else {
                            console.error('Failed to fetch availabilities');
                            // Fallback to mock data
                            setAvailabilities(generateMockAvailabilities());
                        }
                    } catch (error) {
                        console.error('Error fetching availabilities:', error);
                        // Fallback to mock data
                        setAvailabilities(generateMockAvailabilities());
                    } finally{
                        setLoading(false);
                    }
                }
            }["BookAPiercing.useEffect.fetchAvailabilities"];
            fetchAvailabilities();
        }
    }["BookAPiercing.useEffect"], [
        location
    ]);
    // Update available times when date is selected
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BookAPiercing.useEffect": ()=>{
            if (selectedDate) {
                const availability = availabilities.find({
                    "BookAPiercing.useEffect.availability": (a)=>a.date === selectedDate
                }["BookAPiercing.useEffect.availability"]);
                if (availability) {
                    setAvailableTimes(availability.spots.filter({
                        "BookAPiercing.useEffect": (t)=>t.slots > 0
                    }["BookAPiercing.useEffect"]));
                    setSelectedTime(null);
                }
            }
        }
    }["BookAPiercing.useEffect"], [
        selectedDate,
        availabilities
    ]);
    // Auto-select the attempted date after successful authentication
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BookAPiercing.useEffect": ()=>{
            if (isClient && isAuthenticated && user?.id && attemptedDate) {
                handleAuthSuccess();
            }
        }
    }["BookAPiercing.useEffect"], [
        isClient,
        isAuthenticated,
        user?.id,
        attemptedDate,
        handleAuthSuccess
    ]);
    const getDaysInMonth = (date)=>{
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };
    const getFirstDayOfMonth = (date)=>{
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };
    const renderCalendar = ()=>{
        if (!currentMonth) return [];
        const daysInMonth = getDaysInMonth(currentMonth);
        const firstDay = getFirstDayOfMonth(currentMonth);
        const days = [];
        const today = new Date();
        const todayDate = today.getDate();
        const currentMonthNum = today.getMonth();
        const currentYear = today.getFullYear();
        // Empty cells for days before the first day of month
        for(let i = 0; i < firstDay; i++){
            days.push(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {}, `empty-${i}`, false, {
                fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                lineNumber: 179,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0)));
        }
        // Days of the month
        for(let day = 1; day <= daysInMonth; day++){
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const dateStr = date.toISOString().split('T')[0];
            const availability = availabilities.find((a)=>a.date === dateStr);
            const isToday = day === todayDate && currentMonth.getMonth() === currentMonthNum && currentMonth.getFullYear() === currentYear;
            const isPastDate = date < today;
            const isSunday = date.getDay() === 0;
            const isSelected = selectedDate === dateStr;
            const hasAvailability = availability && availability.available && !isPastDate && !isSunday;
            days.push(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>!authLoading && hasAvailability && handleDateClick(dateStr),
                disabled: !hasAvailability || authLoading,
                style: {
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: isToday ? '700' : '500',
                    border: isSelected ? 'none' : '1px solid #ddd',
                    borderRadius: '4px',
                    background: isSelected ? '#000' : isToday ? '#f0f0f0' : '#fff',
                    color: isSelected ? '#fff' : '#000',
                    cursor: hasAvailability && !authLoading ? 'pointer' : 'not-allowed',
                    opacity: !hasAvailability || authLoading ? 0.5 : 1,
                    transition: 'all 0.2s'
                },
                children: day
            }, dateStr, false, {
                fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                lineNumber: 196,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)));
        }
        return days;
    };
    const handleDateClick = (dateStr)=>{
        // Wait for auth to load, then check if user is authenticated
        if (!isClient || authLoading) {
            return;
        }
        // Check if user is authenticated AND has user data
        const isReallyAuthenticated = isAuthenticated && !!user?.id;
        if (!isReallyAuthenticated) {
            // Store the date they tried to click and show auth modal
            setAttemptedDate(dateStr);
            setShowAuthModal(true);
            return;
        }
        // User is authenticated, select the date
        setSelectedDate(dateStr);
    };
    const formatBookingTime = (dateStr, timeStr)=>{
        const date = new Date(dateStr + 'T00:00:00');
        const [time, period] = timeStr.split(' ');
        const [hours, mins] = time.split(':').map(Number);
        const adjustedHours = period === 'PM' && hours !== 12 ? hours + 12 : period === 'AM' && hours === 12 ? 0 : hours;
        date.setHours(adjustedHours, mins);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const dateFormatted = `${day}/${month}/${year}`;
        return `${dateFormatted} ${timeStr}`;
    };
    const handleConfirmBooking = async ()=>{
        if (!selectedDate || !selectedTime || !agreeToTos) {
            alert('Please select a date, time, and accept terms & conditions');
            return;
        }
        if (!user?.id) {
            alert('You must be logged in to confirm a booking');
            return;
        }
        setIsLoading(true);
        try {
            // Determine which endpoint to use based on mode
            const endpoint = isRescheduleMode ? '/api/booking/reschedule' : '/api/booking/confirm';
            const payload = isRescheduleMode ? {
                bookingId: rescheduleBookingId,
                location,
                date: selectedDate,
                time: selectedTime
            } : {
                location,
                date: selectedDate,
                time: selectedTime,
                email: user.email || '',
                firstName: user.firstName || 'Guest',
                lastName: user.lastName || '',
                customerId: user.id
            };
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (response.ok) {
                if (isRescheduleMode) {
                    // Reschedule successful - redirect to account page
                    alert('Appointment rescheduled successfully');
                    router.push('/account');
                } else {
                    // New booking - redirect to checkout
                    if (data.checkoutUrl) {
                        window.location.href = data.checkoutUrl;
                    } else {
                        alert(`Booking confirmed for ${formatBookingTime(selectedDate, selectedTime)}`);
                        setIsBooked(true);
                        setBookedTime(formatBookingTime(selectedDate, selectedTime));
                        setSelectedDate(null);
                        setSelectedTime(null);
                        setAgreeToTos(false);
                    }
                }
            } else {
                const errorDetails = data.details ? ` (${data.details})` : '';
                alert(`${isRescheduleMode ? 'Reschedule' : 'Booking'} failed: ${data.error}${errorDetails}`);
            }
        } catch (error) {
            console.error('Booking error:', error);
            alert('Error confirming booking. Please try again.');
        } finally{
            setIsLoading(false);
        }
    };
    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    const dayNames = [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'
    ];
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            style: {
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '40px 24px'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                        children: `Book a Piercing - ${locationTitle} | Pierce of Art`
                    }, void 0, false, {
                        fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                        lineNumber: 341,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                    lineNumber: 340,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        textAlign: 'center',
                        padding: '40px'
                    },
                    children: "Loading availability..."
                }, void 0, false, {
                    fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                    lineNumber: 343,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
            lineNumber: 339,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                        children: `Book a Piercing - ${locationTitle} | Pierce of Art`
                    }, void 0, false, {
                        fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                        lineNumber: 351,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "description",
                        content: `Book your piercing appointment at Pierce of Art ${locationTitle}`
                    }, void 0, false, {
                        fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                        lineNumber: 352,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                lineNumber: 350,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$components$2f$BookingAuthModal$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: showAuthModal,
                onClose: ()=>setShowAuthModal(false),
                onAuthSuccess: handleAuthSuccess
            }, void 0, false, {
                fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                lineNumber: 355,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                style: {
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '40px 24px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            textAlign: 'left',
                            marginBottom: '40px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                style: {
                                    fontSize: '32px',
                                    fontWeight: '700',
                                    marginBottom: '8px',
                                    textTransform: 'uppercase'
                                },
                                children: isRescheduleMode ? 'RESCHEDULE APPOINTMENT' : isBooked ? 'RE-SCHEDULE' : 'PRIORITY BOOKING'
                            }, void 0, false, {
                                fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                lineNumber: 363,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                style: {
                                    fontSize: '24px',
                                    fontWeight: '600'
                                },
                                children: locationTitle
                            }, void 0, false, {
                                fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                lineNumber: 366,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                        lineNumber: 362,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    isRescheduleMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: '#e8f4f8',
                            padding: '20px 24px',
                            marginBottom: '32px',
                            borderRadius: '4px',
                            borderLeft: '4px solid #03cb91'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                margin: '0'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "Select a new date and time for your appointment."
                                }, void 0, false, {
                                    fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                    lineNumber: 380,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                " No checkout required - your appointment will be updated immediately."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                            lineNumber: 379,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                        lineNumber: 372,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    isBooked && !isRescheduleMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: '#f0f0f0',
                            padding: '20px 24px',
                            marginBottom: '32px',
                            borderRadius: '4px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    margin: '0 0 8px 0'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: [
                                        "You've already got a piercing booked for ",
                                        bookedTime
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                    lineNumber: 393,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                lineNumber: 392,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    margin: '0 0 8px 0'
                                },
                                children: "Don't worry though. You can have more than 1 piercing when you arrive."
                            }, void 0, false, {
                                fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                lineNumber: 395,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    margin: 0
                                },
                                children: "If you're trying to book for a friend, they will need to book separately."
                            }, void 0, false, {
                                fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                lineNumber: 396,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                        lineNumber: 386,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    !isBooked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: '#f9f9f9',
                            padding: '40px 24px',
                            borderRadius: '8px'
                        },
                        children: [
                            currentMonth && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginBottom: '40px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            display: 'block',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            marginBottom: '20px',
                                            textTransform: 'uppercase'
                                        },
                                        children: "SELECT DATE"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                        lineNumber: 409,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: '#fff',
                                            padding: '24px',
                                            borderRadius: '4px',
                                            border: '1px solid #ddd'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    marginBottom: '24px'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>currentMonth && setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)),
                                                        style: {
                                                            background: 'none',
                                                            border: 'none',
                                                            fontSize: '18px',
                                                            cursor: 'pointer',
                                                            color: '#03cb91'
                                                        },
                                                        children: "← Prev"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                                        lineNumber: 426,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        style: {
                                                            fontSize: '18px',
                                                            fontWeight: '600',
                                                            margin: 0
                                                        },
                                                        children: [
                                                            monthNames[currentMonth.getMonth()],
                                                            " ",
                                                            currentMonth.getFullYear()
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                                        lineNumber: 438,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>currentMonth && setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)),
                                                        style: {
                                                            background: 'none',
                                                            border: 'none',
                                                            fontSize: '18px',
                                                            cursor: 'pointer',
                                                            color: '#03cb91'
                                                        },
                                                        children: "Next →"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                                        lineNumber: 441,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                                lineNumber: 420,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(7, 1fr)',
                                                    gap: '8px',
                                                    marginBottom: '12px'
                                                },
                                                children: dayNames.map((day)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            textAlign: 'center',
                                                            fontWeight: '600',
                                                            fontSize: '12px',
                                                            padding: '8px',
                                                            color: '#666'
                                                        },
                                                        children: day
                                                    }, day, false, {
                                                        fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                                        lineNumber: 463,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)))
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                                lineNumber: 456,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(7, 1fr)',
                                                    gap: '8px'
                                                },
                                                children: renderCalendar()
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                                lineNumber: 479,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                        lineNumber: 413,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                lineNumber: 408,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            selectedDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginBottom: '40px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            display: 'block',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            marginBottom: '20px',
                                            textTransform: 'uppercase'
                                        },
                                        children: "SELECT TIME"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                        lineNumber: 493,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                                            gap: '12px'
                                        },
                                        children: availableTimes.length > 0 ? availableTimes.map((time)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setSelectedTime(time.start_time),
                                                style: {
                                                    padding: '16px 12px',
                                                    fontSize: '14px',
                                                    fontWeight: '600',
                                                    border: selectedTime === time.start_time ? 'none' : '1px solid #ddd',
                                                    borderRadius: '4px',
                                                    background: selectedTime === time.start_time ? '#000' : '#fff',
                                                    color: selectedTime === time.start_time ? '#fff' : '#000',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: time.formatedTime
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                                        lineNumber: 520,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: '12px',
                                                            marginTop: '4px',
                                                            opacity: 0.8
                                                        },
                                                        children: [
                                                            time.slots,
                                                            " slot",
                                                            time.slots > 1 ? 's' : ''
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                                        lineNumber: 521,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, time.start_time, true, {
                                                fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                                lineNumber: 503,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0))) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                padding: '20px',
                                                color: '#999',
                                                gridColumn: '1 / -1'
                                            },
                                            children: "No available times for this date"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                            lineNumber: 527,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                        lineNumber: 496,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                lineNumber: 492,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            selectedTime && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginBottom: '24px'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        cursor: 'pointer'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            checked: agreeToTos,
                                            onChange: (e)=>setAgreeToTos(e.target.checked),
                                            style: {
                                                cursor: 'pointer',
                                                width: '20px',
                                                height: '20px'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                            lineNumber: 539,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: '14px'
                                            },
                                            children: [
                                                "I agree to the ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/information/terms-of-service",
                                                    style: {
                                                        color: '#000',
                                                        textDecoration: 'underline'
                                                    },
                                                    children: "terms & conditions"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                                    lineNumber: 546,
                                                    columnNumber: 36
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                            lineNumber: 545,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                    lineNumber: 538,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                lineNumber: 537,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: '40px',
                                    padding: '24px',
                                    background: '#fff',
                                    borderRadius: '4px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        style: {
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            marginBottom: '12px'
                                        },
                                        children: [
                                            locationTitle,
                                            " Location"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                        lineNumber: 559,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: '14px',
                                            color: '#666',
                                            lineHeight: '1.6',
                                            margin: 0
                                        },
                                        children: [
                                            locationData?.address,
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                                lineNumber: 563,
                                                columnNumber: 40
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            locationData?.city,
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                                lineNumber: 564,
                                                columnNumber: 37
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            locationData?.postcode,
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                                lineNumber: 565,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                                lineNumber: 566,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Phone:"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                                lineNumber: 567,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: `tel:${locationData?.phone.replace(/\s/g, '')}`,
                                                style: {
                                                    color: '#000'
                                                },
                                                children: locationData?.phone
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                                lineNumber: 567,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                        lineNumber: 562,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                lineNumber: 553,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                        lineNumber: 401,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    selectedTime && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: 'fixed',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: '#181818',
                            padding: '16px 24px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            zIndex: 100
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: '#fff',
                                    color: '#000',
                                    padding: '12px',
                                    textAlign: 'center',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    borderRadius: '0'
                                },
                                children: [
                                    "MY BOOKING: ",
                                    new Date(selectedDate + 'T00:00:00').toLocaleDateString(),
                                    " ",
                                    selectedTime
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                lineNumber: 587,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleConfirmBooking,
                                disabled: !agreeToTos || isLoading,
                                style: {
                                    padding: '16px 24px',
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    background: agreeToTos ? '#000' : '#ccc',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '0',
                                    cursor: agreeToTos ? 'pointer' : 'not-allowed',
                                    textTransform: 'uppercase',
                                    width: '100%',
                                    opacity: isLoading ? 0.7 : 1
                                },
                                title: "You must agree to terms & conditions to proceed",
                                children: isLoading ? 'Processing...' : 'Confirm Booking & Proceed to Checkout (Terms Accepted)'
                            }, void 0, false, {
                                fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                                lineNumber: 598,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                        lineNumber: 575,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx",
                lineNumber: 361,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
_s(BookAPiercing, "tvT0iFcmKChm8eZtFqhWs+z2+bM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = BookAPiercing;
const __TURBOPACK__default__export__ = BookAPiercing;
var _c;
__turbopack_context__.k.register(_c, "BookAPiercing");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/book-a-piercing/[location]";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/apps/storefront/src/pages/book-a-piercing/[location].tsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__c3026121._.js.map