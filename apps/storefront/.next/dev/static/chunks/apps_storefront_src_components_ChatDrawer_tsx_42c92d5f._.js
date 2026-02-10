(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/storefront/src/components/ChatDrawer.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChatDrawer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$ChatDrawerContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/storefront/src/context/ChatDrawerContext.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
function linkify(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i)=>urlRegex.test(part) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
            href: part,
            target: "_blank",
            rel: "noopener noreferrer",
            style: {
                color: '#0070f3',
                textDecoration: 'underline'
            },
            children: part
        }, i, false, {
            fileName: "[project]/apps/storefront/src/components/ChatDrawer.tsx",
            lineNumber: 14,
            columnNumber: 7
        }, this) : part);
}
function ChatDrawer() {
    _s();
    const { isDrawerOpen, closeDrawer } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$ChatDrawerContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useChatDrawer"])();
    const drawerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isTyping, setIsTyping] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [customerEmail, setCustomerEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [emailCaptured, setEmailCaptured] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const messagesEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const emailSentRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const replySound = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatDrawer.useEffect": ()=>{
            replySound.current = new Audio('/message.mp3');
        }
    }["ChatDrawer.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatDrawer.useEffect": ()=>{
            if (!isLoading) inputRef.current?.focus();
        }
    }["ChatDrawer.useEffect"], [
        isLoading
    ]);
    const isLoggedIn = false; // Replace this later with real auth check
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatDrawer.useEffect": ()=>{
            const handleEscape = {
                "ChatDrawer.useEffect.handleEscape": (e)=>{
                    if (e.key === 'Escape') closeDrawer();
                }
            }["ChatDrawer.useEffect.handleEscape"];
            if (isDrawerOpen) {
                document.addEventListener('keydown', handleEscape);
            }
            return ({
                "ChatDrawer.useEffect": ()=>{
                    document.removeEventListener('keydown', handleEscape);
                }
            })["ChatDrawer.useEffect"];
        }
    }["ChatDrawer.useEffect"], [
        isDrawerOpen,
        closeDrawer
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatDrawer.useEffect": ()=>{
            messagesEndRef.current?.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }["ChatDrawer.useEffect"], [
        messages,
        isTyping
    ]);
    // Add opening message on first open
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatDrawer.useEffect": ()=>{
            if (isDrawerOpen && messages.length === 0) {
                setMessages([
                    {
                        role: 'assistant',
                        content: "Hey, we're online. How can we help you today?"
                    }
                ]);
            }
        }
    }["ChatDrawer.useEffect"], [
        isDrawerOpen,
        messages.length
    ]);
    // Send transcript after 2 mins of no new messages (kept as-is)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatDrawer.useEffect": ()=>{
            if (messages.length === 0) return;
            const timeout = setTimeout({
                "ChatDrawer.useEffect.timeout": ()=>{
                    if (messages.length < 2 || emailSentRef.current) return;
                    emailSentRef.current = true;
                    const formattedMessages = messages.map({
                        "ChatDrawer.useEffect.timeout.formattedMessages": (msg)=>({
                                sender: msg.role === 'user' ? 'You' : 'PIERCE OF ART',
                                text: msg.content
                            })
                    }["ChatDrawer.useEffect.timeout.formattedMessages"]);
                    fetch('/api/email/chat-transcript', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: customerEmail || 'anonymous@pierceofart.co.uk',
                            name: 'Customer',
                            messages: formattedMessages
                        })
                    });
                }
            }["ChatDrawer.useEffect.timeout"], 2 * 60 * 1000);
            return ({
                "ChatDrawer.useEffect": ()=>clearTimeout(timeout)
            })["ChatDrawer.useEffect"];
        }
    }["ChatDrawer.useEffect"], [
        messages,
        customerEmail
    ]);
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!input.trim()) return;
        const userMessage = {
            role: 'user',
            content: input
        };
        const updatedMessages = [
            ...messages,
            userMessage
        ];
        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: updatedMessages
                })
            });
            if (!res.ok) throw new Error('Network error');
            const data = await res.json();
            const assistantMessage = {
                role: 'assistant',
                content: data.reply
            };
            setTimeout(()=>{
                setIsTyping(true);
                setTimeout(()=>{
                    if (replySound.current) {
                        replySound.current.currentTime = 0;
                        replySound.current.play().catch((err)=>console.warn('Failed to play reply sound:', err));
                    }
                    setMessages((prev)=>[
                            ...prev,
                            assistantMessage
                        ]);
                    setIsTyping(false);
                    setIsLoading(false);
                }, 6000);
            }, 5000);
        } catch (err) {
            console.error('Chat error:', err);
            setIsTyping(false);
            setIsLoading(false);
        }
    };
    // Simple flag: turn email capture UI on/off
    const SHOW_EMAIL_CAPTURE = false; // 👈 set to true later if you want it back
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `cart-backdrop ${isDrawerOpen ? 'open' : ''}`,
        onClick: closeDrawer,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `cart-drawer ${isDrawerOpen ? 'open' : ''}`,
            onClick: (e)=>e.stopPropagation(),
            ref: drawerRef,
            role: "dialog",
            "aria-modal": "true",
            "aria-labelledby": "chat-drawer-title",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("audio", {
                    ref: replySound,
                    src: "/message.mp3",
                    preload: "auto",
                    style: {
                        display: 'none'
                    }
                }, void 0, false, {
                    fileName: "[project]/apps/storefront/src/components/ChatDrawer.tsx",
                    lineNumber: 173,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "cart-drawer-inner",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "cart-header",
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            id: "chat-drawer-title",
                                            style: {
                                                margin: 0
                                            },
                                            children: "LIVE CHAT"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/storefront/src/components/ChatDrawer.tsx",
                                            lineNumber: 189,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "ring-container",
                                            style: {
                                                position: 'relative',
                                                width: '24px',
                                                height: '24px'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "ringring"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/storefront/src/components/ChatDrawer.tsx",
                                                    lineNumber: 196,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "circle"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/storefront/src/components/ChatDrawer.tsx",
                                                    lineNumber: 197,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/storefront/src/components/ChatDrawer.tsx",
                                            lineNumber: 192,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/storefront/src/components/ChatDrawer.tsx",
                                    lineNumber: 188,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: closeDrawer,
                                    "aria-label": "Close chat",
                                    children: "×"
                                }, void 0, false, {
                                    fileName: "[project]/apps/storefront/src/components/ChatDrawer.tsx",
                                    lineNumber: 200,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/storefront/src/components/ChatDrawer.tsx",
                            lineNumber: 180,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                flex: 1,
                                overflowY: 'auto',
                                marginBottom: '16px'
                            },
                            children: [
                                messages.map((msg, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginBottom: '12px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '12px',
                                                    fontWeight: 400,
                                                    marginBottom: '4px',
                                                    opacity: 0.6,
                                                    textAlign: msg.role === 'user' ? 'right' : 'left'
                                                },
                                                children: msg.role === 'user' ? 'ME' : 'PIERCE OF ART'
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/components/ChatDrawer.tsx",
                                                lineNumber: 210,
                                                columnNumber: 5
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    background: msg.role === 'user' ? '#f0f0f0' : '#181818',
                                                    color: msg.role === 'user' ? '#181818' : '#ffffff',
                                                    padding: '10px 14px',
                                                    borderRadius: '6px',
                                                    fontSize: '14px',
                                                    lineHeight: 1.5,
                                                    whiteSpace: 'pre-wrap',
                                                    maxWidth: '85%',
                                                    marginLeft: msg.role === 'user' ? 'auto' : '0'
                                                },
                                                children: linkify(msg.content)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/storefront/src/components/ChatDrawer.tsx",
                                                lineNumber: 223,
                                                columnNumber: 5
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/apps/storefront/src/components/ChatDrawer.tsx",
                                        lineNumber: 207,
                                        columnNumber: 3
                                    }, this)),
                                isTyping && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        background: '#ececec',
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        marginBottom: '8px',
                                        fontSize: '14px',
                                        color: '#181818'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: "PIERCE OF ART:"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/storefront/src/components/ChatDrawer.tsx",
                                            lineNumber: 254,
                                            columnNumber: 17
                                        }, this),
                                        " Typing…"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/storefront/src/components/ChatDrawer.tsx",
                                    lineNumber: 244,
                                    columnNumber: 15
                                }, this),
                                SHOW_EMAIL_CAPTURE && !isLoggedIn && !emailCaptured && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        background: '#ececec',
                                        padding: '12px',
                                        borderRadius: '6px',
                                        marginBottom: '12px',
                                        fontSize: '14px',
                                        color: '#181818'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "PIERCE OF ART:"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/storefront/src/components/ChatDrawer.tsx",
                                                    lineNumber: 271,
                                                    columnNumber: 19
                                                }, this),
                                                " Want a copy of this chat? Enter your email:"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/storefront/src/components/ChatDrawer.tsx",
                                            lineNumber: 270,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                            onSubmit: (e)=>{
                                                e.preventDefault();
                                                if (customerEmail.trim()) setEmailCaptured(true);
                                            },
                                            style: {
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '8px',
                                                marginTop: '8px'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "email",
                                                    value: customerEmail,
                                                    onChange: (e)=>setCustomerEmail(e.target.value),
                                                    placeholder: "you@example.com",
                                                    required: true,
                                                    style: {
                                                        flex: 1,
                                                        padding: '10px 12px',
                                                        fontSize: '16px',
                                                        border: '1px solid #ccc',
                                                        borderRadius: '4px'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/storefront/src/components/ChatDrawer.tsx",
                                                    lineNumber: 286,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "submit",
                                                    style: {
                                                        background: '#181818',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        padding: '8px 16px',
                                                        cursor: 'pointer'
                                                    },
                                                    children: "✓"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/storefront/src/components/ChatDrawer.tsx",
                                                    lineNumber: 301,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/storefront/src/components/ChatDrawer.tsx",
                                            lineNumber: 274,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/storefront/src/components/ChatDrawer.tsx",
                                    lineNumber: 260,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    ref: messagesEndRef
                                }, void 0, false, {
                                    fileName: "[project]/apps/storefront/src/components/ChatDrawer.tsx",
                                    lineNumber: 318,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/storefront/src/components/ChatDrawer.tsx",
                            lineNumber: 205,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleSubmit,
                            style: {
                                display: 'flex',
                                gap: '8px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: input,
                                    onChange: (e)=>setInput(e.target.value),
                                    placeholder: "Ask us something...",
                                    style: {
                                        flex: 1,
                                        padding: '10px 12px',
                                        fontSize: '16px',
                                        lineHeight: 1.5,
                                        border: '1px solid #ccc',
                                        borderRadius: '4px'
                                    },
                                    disabled: isLoading,
                                    ref: inputRef
                                }, void 0, false, {
                                    fileName: "[project]/apps/storefront/src/components/ChatDrawer.tsx",
                                    lineNumber: 322,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    style: {
                                        padding: '8px 16px',
                                        background: '#181818',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    },
                                    disabled: isLoading,
                                    children: isLoading ? '...' : 'Send'
                                }, void 0, false, {
                                    fileName: "[project]/apps/storefront/src/components/ChatDrawer.tsx",
                                    lineNumber: 339,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/storefront/src/components/ChatDrawer.tsx",
                            lineNumber: 321,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/storefront/src/components/ChatDrawer.tsx",
                    lineNumber: 179,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/storefront/src/components/ChatDrawer.tsx",
            lineNumber: 165,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/storefront/src/components/ChatDrawer.tsx",
        lineNumber: 161,
        columnNumber: 5
    }, this);
}
_s(ChatDrawer, "lLM/crdDaE/t6B4h5YDvhQu5xig=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$storefront$2f$src$2f$context$2f$ChatDrawerContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useChatDrawer"]
    ];
});
_c = ChatDrawer;
var _c;
__turbopack_context__.k.register(_c, "ChatDrawer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/storefront/src/components/ChatDrawer.tsx [client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/apps/storefront/src/components/ChatDrawer.tsx [client] (ecmascript)"));
}),
]);

//# sourceMappingURL=apps_storefront_src_components_ChatDrawer_tsx_42c92d5f._.js.map