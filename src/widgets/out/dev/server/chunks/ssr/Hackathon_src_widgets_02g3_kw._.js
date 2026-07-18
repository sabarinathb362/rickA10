module.exports = [
"[project]/Hackathon/src/widgets/RickGotchi.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RickGotchi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Hackathon/src/widgets/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Hackathon/src/widgets/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
// Maps mood + screenState to a sprite image
function getSpriteSrc(mood, screenState, isMusicPlaying, isDragging) {
    if (mood === 'DESERTED') return '/rick/deserted.png';
    if (mood === 'QUARANTINE') return '/rick/quarantine.png';
    if (mood === 'ANGRY') return '/rick/angry.png';
    if (mood === 'TIRED') return '/rick/tired.png';
    if (screenState === 'STUDIOUS') return '/rick/studious.png';
    // DANCING / FLOW / BORED / PANIC / SLACKING / music → dancing
    return '/rick/dancing.png';
}
function getAnimationClass(mood, isMusicPlaying, isDragging) {
    if (isDragging) return 'rick-spin';
    if (isMusicPlaying || mood === 'DANCING') return 'rick-bounce';
    if (mood === 'ANGRY') return 'rick-shake';
    if (mood === 'TIRED') return 'rick-sway';
    return '';
}
function RickGotchi({ screenState, socialMediaTime, secondsUntilFeed, consecutiveNeglects, groove, vocal, loyalty, mood, statusText, isMusicPlaying }) {
    const [localTimeLeft, setLocalTimeLeft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(secondsUntilFeed);
    const [captchaInput, setCaptchaInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        x: 0,
        y: 0
    });
    const [dragQuote, setDragQuote] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const dragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setLocalTimeLeft(secondsUntilFeed);
    }, [
        secondsUntilFeed
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (mood === 'DESERTED' || mood === 'QUARANTINE') return;
        const interval = setInterval(()=>setLocalTimeLeft((p)=>Math.max(0, p - 1)), 1000);
        return ()=>clearInterval(interval);
    }, [
        mood
    ]);
    const formatTime = (secs)=>{
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };
    const triggerAction = (action, param)=>{
        window.parent.postMessage({
            type: 'WIDGET_ACTION',
            action: param ? `${action} with ${param}` : action
        }, '*');
    };
    const submitCaptcha = ()=>{
        window.parent.postMessage({
            type: 'WIDGET_ACTION',
            action: `Solve lyric captcha with word: ${captchaInput}`
        }, '*');
        setCaptchaInput('');
    };
    const handleMouseDown = (e)=>{
        if (mood === 'DESERTED' || mood === 'QUARANTINE') return;
        setIsDragging(true);
        dragStart.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
        setDragQuote('Whoa! Never gonna let you drop me!');
    };
    const handleMouseMove = (e)=>{
        if (!isDragging) return;
        setPosition({
            x: Math.min(Math.max(e.clientX - dragStart.current.x, -80), 80),
            y: Math.min(Math.max(e.clientY - dragStart.current.y, -60), 60)
        });
    };
    const handleMouseUp = ()=>{
        if (!isDragging) return;
        setIsDragging(false);
        setPosition({
            x: 0,
            y: 0
        });
        setDragQuote('Landed safely! Never gonna give you up!');
        triggerAction('feedRick', 'Vinyl Record');
        setTimeout(()=>setDragQuote(null), 2000);
    };
    const spriteSrc = getSpriteSrc(mood, screenState, isMusicPlaying, isDragging);
    const animClass = getAnimationClass(mood, isMusicPlaying, isDragging);
    const lcdBg = mood === 'ANGRY' ? '#f38ba8' : isMusicPlaying ? '#cba6f7' : consecutiveNeglects > 0 ? '#f9e2af' : '#a6e3a1';
    // ── QUARANTINE OVERLAY ──────────────────────────────────────────────────────
    if (mood === 'QUARANTINE') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                position: 'fixed',
                inset: 0,
                background: '#0a0512',
                zIndex: 99999,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 20,
                textAlign: 'center',
                border: '8px solid #ff0055',
                boxSizing: 'border-box',
                fontFamily: 'monospace'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        width: '100%',
                        background: '#ef4444',
                        color: '#fff',
                        padding: '12px 0',
                        fontWeight: 'bold',
                        fontSize: 18,
                        animation: 'sirenFlash 0.4s infinite alternate',
                        marginBottom: 20,
                        letterSpacing: 2,
                        borderBottom: '4px solid #fff'
                    },
                    children: "🚨 PROHIBITED SITE DETECTED by RICKGUARD 🚨"
                }, void 0, false, {
                    fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
                    lineNumber: 129,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: spriteSrc,
                    alt: "Rick blocking",
                    style: {
                        width: 180,
                        height: 180,
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 0 20px #ff0055)',
                        animation: 'sirenFlash 0.6s infinite alternate'
                    }
                }, void 0, false, {
                    fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
                    lineNumber: 137,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    style: {
                        fontSize: 18,
                        color: '#39ff14',
                        margin: '16px 0 8px',
                        textShadow: '0 0 8px #39ff14'
                    },
                    children: "NEVER GONNA LET YOU VIEW THIS!"
                }, void 0, false, {
                    fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
                    lineNumber: 142,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        fontSize: 12,
                        color: '#a6adc8',
                        maxWidth: 360,
                        lineHeight: 1.5,
                        marginBottom: 20
                    },
                    children: "Close the prohibited tab and fill in the missing lyric to restore access:"
                }, void 0, false, {
                    fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
                    lineNumber: 145,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        background: '#110c1f',
                        padding: 16,
                        borderRadius: 12,
                        border: '2px solid #ff0055',
                        width: 280
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: 12,
                                color: '#fff',
                                marginBottom: 10
                            },
                            children: [
                                '"Never gonna ',
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        color: '#ff0055',
                                        fontWeight: 'bold'
                                    },
                                    children: "_____"
                                }, void 0, false, {
                                    fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
                                    lineNumber: 151,
                                    columnNumber: 26
                                }, this),
                                ' you up"'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
                            lineNumber: 150,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                gap: 8,
                                justifyContent: 'center'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    value: captchaInput,
                                    onChange: (e)=>setCaptchaInput(e.target.value),
                                    placeholder: "word...",
                                    onKeyDown: (e)=>e.key === 'Enter' && submitCaptcha(),
                                    style: {
                                        padding: 8,
                                        borderRadius: 6,
                                        border: '2px solid #89b4fa',
                                        background: '#181825',
                                        color: '#fff',
                                        width: 100,
                                        textAlign: 'center',
                                        outline: 'none'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
                                    lineNumber: 154,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: submitCaptcha,
                                    style: {
                                        padding: '8px 16px',
                                        background: '#ff0055',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: 6,
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        boxShadow: '0 0 10px #ff0055'
                                    },
                                    children: "UNLOCK"
                                }, void 0, false, {
                                    fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
                                    lineNumber: 158,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
                            lineNumber: 153,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
                    lineNumber: 149,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Style, {}, void 0, false, {
                    fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
                    lineNumber: 164,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
            lineNumber: 123,
            columnNumber: 7
        }, this);
    }
    // ── DESERTED ────────────────────────────────────────────────────────────────
    if (mood === 'DESERTED') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                position: 'fixed',
                bottom: 16,
                right: 16,
                zIndex: 9999,
                background: '#181825',
                border: '4px solid #313244',
                borderRadius: 20,
                padding: 20,
                textAlign: 'center',
                fontFamily: 'monospace',
                color: '#f38ba8',
                boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
                width: 220
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: spriteSrc,
                    alt: "Rick leaving",
                    style: {
                        width: 120,
                        height: 120,
                        objectFit: 'contain',
                        opacity: 0.6,
                        filter: 'grayscale(60%)'
                    }
                }, void 0, false, {
                    fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
                    lineNumber: 178,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    style: {
                        fontSize: 14,
                        margin: '10px 0 6px'
                    },
                    children: "⚠️ DESERTED ⚠️"
                }, void 0, false, {
                    fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
                    lineNumber: 180,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        fontSize: 11,
                        color: '#a6adc8',
                        lineHeight: 1.4
                    },
                    children: [
                        '"',
                        statusText,
                        '"'
                    ]
                }, void 0, true, {
                    fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
                    lineNumber: 181,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Style, {}, void 0, false, {
                    fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
                    lineNumber: 182,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
            lineNumber: 172,
            columnNumber: 7
        }, this);
    }
    // ── NORMAL TAMAGOTCHI (corner-pinned) ───────────────────────────────────────
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 9999,
            fontFamily: '"Courier New", Courier, monospace',
            userSelect: 'none'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    background: 'linear-gradient(160deg, #ff9eb8 0%, #ff4b86 100%)',
                    border: '5px solid #4a0422',
                    borderRadius: 28,
                    boxShadow: '0 8px 0 #280212, 0 14px 28px rgba(0,0,0,0.5)',
                    padding: 14,
                    width: 220,
                    animation: mood === 'ANGRY' ? 'rickShake 0.4s infinite' : 'none'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: lcdBg,
                            borderRadius: 14,
                            border: '4px solid #11111b',
                            padding: '10px 10px 8px',
                            transition: 'background 0.5s ease',
                            boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.25)',
                            position: 'relative',
                            minHeight: 180,
                            display: 'flex',
                            flexDirection: 'column'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: 8,
                                    fontWeight: 'bold',
                                    color: '#11111b',
                                    marginBottom: 4
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "RICK_GOTCHI v1.0"
                                    }, void 0, false, {
                                        fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
                                        lineNumber: 218,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            animation: consecutiveNeglects > 0 || isMusicPlaying ? 'lcdFlash 0.5s infinite alternate' : 'none'
                                        },
                                        children: isMusicPlaying ? '⚡MUSIC' : consecutiveNeglects > 0 ? '⚠ NEGLECTED' : '● ACTIVE'
                                    }, void 0, false, {
                                        fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
                                        lineNumber: 219,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
                                lineNumber: 217,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onMouseDown: handleMouseDown,
                                onMouseMove: handleMouseMove,
                                onMouseUp: handleMouseUp,
                                onMouseLeave: handleMouseUp,
                                style: {
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: isDragging ? 'grabbing' : 'grab',
                                    transform: `translate(${position.x}px, ${position.y}px)`,
                                    transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275)'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: spriteSrc,
                                    alt: `Rick ${mood}`,
                                    className: animClass,
                                    style: {
                                        width: 100,
                                        height: 100,
                                        objectFit: 'contain',
                                        imageRendering: 'pixelated',
                                        filter: mood === 'TIRED' ? 'brightness(0.7) saturate(0.5)' : 'none'
                                    },
                                    draggable: false
                                }, void 0, false, {
                                    fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
                                    lineNumber: 237,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
                                lineNumber: 225,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 10,
                                    borderTop: '1px dashed #11111b',
                                    paddingTop: 5,
                                    fontStyle: 'italic',
                                    color: '#11111b',
                                    lineHeight: 1.3,
                                    minHeight: 28
                                },
                                children: [
                                    '"',
                                    dragQuote || statusText,
                                    '"'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
                                lineNumber: 252,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: 9,
                                    borderTop: '1px solid #11111b',
                                    paddingTop: 4,
                                    marginTop: 4,
                                    color: '#11111b'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "FEED DUE:"
                                    }, void 0, false, {
                                        fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
                                        lineNumber: 258,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontWeight: 'bold',
                                            color: localTimeLeft < 60 ? '#ef4444' : '#11111b'
                                        },
                                        children: formatTime(localTimeLeft)
                                    }, void 0, false, {
                                        fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
                                        lineNumber: 259,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
                                lineNumber: 257,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
                        lineNumber: 205,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            margin: '10px 0 8px',
                            background: 'rgba(0,0,0,0.25)',
                            padding: '8px 10px',
                            borderRadius: 8,
                            fontSize: 9,
                            color: '#fff',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 5
                        },
                        children: [
                            {
                                label: 'Groove',
                                val: groove,
                                color: '#a6e3a1'
                            },
                            {
                                label: 'Vocals',
                                val: vocal,
                                color: '#89b4fa'
                            },
                            {
                                label: 'Loyalty',
                                val: loyalty,
                                color: '#f38ba8'
                            }
                        ].map(({ label, val, color })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            width: 40
                                        },
                                        children: label
                                    }, void 0, false, {
                                        fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
                                        lineNumber: 273,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1,
                                            height: 7,
                                            background: '#313244',
                                            borderRadius: 4,
                                            overflow: 'hidden'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                width: `${val}%`,
                                                height: '100%',
                                                background: color,
                                                transition: 'width 0.5s ease',
                                                borderRadius: 4
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
                                            lineNumber: 275,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
                                        lineNumber: 274,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            width: 24,
                                            textAlign: 'right'
                                        },
                                        children: Math.round(val)
                                    }, void 0, false, {
                                        fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
                                        lineNumber: 277,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, label, true, {
                                fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
                                lineNumber: 272,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
                        lineNumber: 266,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: 8,
                            justifyContent: 'center'
                        },
                        children: [
                            {
                                emoji: '🍵',
                                title: 'Ginger Tea → Vocals',
                                action: ()=>triggerAction('feedRick', 'Ginger Tea'),
                                color: '#ffdd33'
                            },
                            {
                                emoji: '🎵',
                                title: 'Vinyl Record → Groove',
                                action: ()=>triggerAction('feedRick', 'Vinyl Record'),
                                color: '#ffdd33'
                            },
                            {
                                emoji: '🕺',
                                title: 'Dance! → resets feed timer',
                                action: ()=>triggerAction('makeRickDance'),
                                color: '#39ff14'
                            }
                        ].map(({ emoji, title, action, color })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: action,
                                title: title,
                                style: {
                                    width: 44,
                                    height: 44,
                                    borderRadius: '50%',
                                    background: color,
                                    color: '#11111b',
                                    border: '3px solid #4a0422',
                                    boxShadow: '0 3px 0 #280212',
                                    cursor: 'pointer',
                                    fontSize: 18,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'transform 0.1s',
                                    fontFamily: 'inherit'
                                },
                                onMouseDown: (e)=>e.currentTarget.style.transform = 'translateY(2px)',
                                onMouseUp: (e)=>e.currentTarget.style.transform = '',
                                children: emoji
                            }, emoji, false, {
                                fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
                                lineNumber: 289,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
                        lineNumber: 283,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
                lineNumber: 195,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Style, {}, void 0, false, {
                fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
                lineNumber: 306,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
        lineNumber: 189,
        columnNumber: 5
    }, this);
}
function Style() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
        dangerouslySetInnerHTML: {
            __html: `
      @keyframes rickBounce {
        0%   { transform: translateY(0) scale(1); }
        50%  { transform: translateY(-8px) scale(1.06); }
        100% { transform: translateY(0) scale(1); }
      }
      @keyframes rickShake {
        0%   { transform: translate(0, 0) rotate(0deg); }
        25%  { transform: translate(-3px, 1px) rotate(-2deg); }
        75%  { transform: translate(3px, -1px) rotate(2deg); }
        100% { transform: translate(0, 0) rotate(0deg); }
      }
      @keyframes rickSway {
        0%   { transform: rotate(-3deg); }
        100% { transform: rotate(3deg); }
      }
      @keyframes rickSpin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
      @keyframes lcdFlash {
        from { opacity: 1; }
        to   { opacity: 0.3; }
      }
      @keyframes sirenFlash {
        from { background: #ef4444; }
        to   { background: #990000; }
      }
      .rick-bounce { animation: rickBounce 0.7s ease-in-out infinite; }
      .rick-shake  { animation: rickShake 0.35s linear infinite; }
      .rick-sway   { animation: rickSway 1.5s ease-in-out infinite alternate; }
      .rick-spin   { animation: rickSpin 0.5s linear infinite; }
    `
        }
    }, void 0, false, {
        fileName: "[project]/Hackathon/src/widgets/RickGotchi.tsx",
        lineNumber: 313,
        columnNumber: 5
    }, this);
}
}),
"[project]/Hackathon/src/widgets/app/rick-gotchi/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RickGotchiPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Hackathon/src/widgets/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Hackathon/src/widgets/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$RickGotchi$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Hackathon/src/widgets/RickGotchi.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
const DEFAULT_STATE = {
    screenState: 'BORED',
    socialMediaTime: 0,
    secondsUntilFeed: 600,
    consecutiveNeglects: 0,
    groove: 80,
    vocal: 70,
    loyalty: 90,
    mood: 'DANCING',
    statusText: 'Never gonna give you up, buddy!',
    isMusicPlaying: false
};
function RickGotchiPage() {
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_STATE);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Read initial props injected by NitroStack via the URL hash or search params
        const tryParse = ()=>{
            try {
                const params = new URLSearchParams(window.location.search);
                const raw = params.get('props') || params.get('data');
                if (raw) {
                    setState({
                        ...DEFAULT_STATE,
                        ...JSON.parse(decodeURIComponent(raw))
                    });
                    return;
                }
                const hash = window.location.hash.slice(1);
                if (hash) {
                    setState({
                        ...DEFAULT_STATE,
                        ...JSON.parse(decodeURIComponent(hash))
                    });
                }
            } catch  {
            // keep defaults
            }
        };
        tryParse();
        // Listen for prop updates posted by the NitroStudio parent frame
        const handleMessage = (event)=>{
            if (event.data?.type === 'NITROSTACK_PROPS' || event.data?.props) {
                const incoming = event.data.props ?? event.data;
                setState((prev)=>({
                        ...prev,
                        ...incoming
                    }));
            }
        };
        window.addEventListener('message', handleMessage);
        return ()=>window.removeEventListener('message', handleMessage);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            background: 'transparent'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Hackathon$2f$src$2f$widgets$2f$RickGotchi$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            ...state
        }, void 0, false, {
            fileName: "[project]/Hackathon/src/widgets/app/rick-gotchi/page.tsx",
            lineNumber: 77,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Hackathon/src/widgets/app/rick-gotchi/page.tsx",
        lineNumber: 69,
        columnNumber: 5
    }, this);
}
}),
"[project]/Hackathon/src/widgets/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/Hackathon/src/widgets/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime;
}),
];

//# sourceMappingURL=Hackathon_src_widgets_02g3_kw._.js.map