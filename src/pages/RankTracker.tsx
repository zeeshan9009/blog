/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
    Search,
    LayoutGrid,
    Sparkles,
    FileText,
    Code2,
    Globe,
    Zap,
    Copy,
    Check,
    ArrowRight,
    SlidersHorizontal,
    Key,
    Shield,
    Hash,
    FileType,
    Maximize2,
    X,
} from "lucide-react";
import toast from "react-hot-toast";

interface ToolItem {
    id: string;
    title: string;
    category: "Text & Content" | "Developer" | "Web & SEO" | "Security & Utilities";
    desc: string;
    icon: any;
    isPremium: boolean;
    popular?: boolean;
    path?: string;
    interactiveType?: "case" | "wordcount" | "json" | "base64" | "password" | "urlencode";
}

const TOOLS_COLLECTION: ToolItem[] = [
    {
        id: "case-converter",
        title: "Text & Case Converter",
        category: "Text & Content",
        desc: "Convert text instantly into UPPERCASE, lowercase, Title Case, camelCase, kebab-case, or clean slug.",
        icon: <FileType className="text-blue-500" size={24} />,
        isPremium: false,
        popular: true,
        interactiveType: "case",
    },
    {
        id: "word-counter",
        title: "Word & Character Counter",
        category: "Text & Content",
        desc: "Real-time statistics for word count, character count, sentence count, and estimated reading time.",
        icon: <FileText className="text-emerald-500" size={24} />,
        isPremium: false,
        popular: true,
        interactiveType: "wordcount",
    },
    {
        id: "json-formatter",
        title: "JSON Formatter & Validator",
        category: "Developer",
        desc: "Validate, beautify, inspect, and minify JSON data with clear syntax error detection.",
        icon: <Code2 className="text-purple-500" size={24} />,
        isPremium: false,
        popular: true,
        interactiveType: "json",
    },
    {
        id: "ai-site-auditor",
        title: "Deep AI Site Auditor",
        category: "Web & SEO",
        desc: "Full automated AI analysis of website SEO, Core Web Vitals, performance bottlenecks, and security headers.",
        icon: <Sparkles className="text-primary" size={24} />,
        isPremium: true,
        popular: true,
        path: "/analyze",
    },
    {
        id: "password-generator",
        title: "Strong Password Generator",
        category: "Security & Utilities",
        desc: "Generate cryptographically secure, randomized passwords with customizable length and character sets.",
        icon: <Key className="text-amber-500" size={24} />,
        isPremium: false,
        interactiveType: "password",
    },
    {
        id: "base64-tool",
        title: "Base64 Encoder / Decoder",
        category: "Developer",
        desc: "Easily encode plain text to Base64 format or decode Base64 strings back to clean readable text.",
        icon: <Hash className="text-teal-500" size={24} />,
        isPremium: false,
        interactiveType: "base64",
    },
    {
        id: "url-encoder",
        title: "URL Encoder & Decoder",
        category: "Developer",
        desc: "Safely encode special characters for URLs or decode query parameters back into human text.",
        icon: <Globe className="text-cyan-500" size={24} />,
        isPremium: false,
        interactiveType: "urlencode",
    },
    {
        id: "ai-content-optimizer",
        title: "AI Content & Meta Generator",
        category: "Web & SEO",
        desc: "Generate high-ranking meta title tags, descriptions, and topic keyword density recommendations.",
        icon: <Sparkles className="text-primary" size={24} />,
        isPremium: true,
        popular: true,
        path: "/analyze",
    },
    {
        id: "site-benchmark",
        title: "Side-by-Side Site Compare",
        category: "Web & SEO",
        desc: "Benchmark and contrast two competitor websites side-by-side on speed, SEO, and technical health.",
        icon: <Zap className="text-orange-500" size={24} />,
        isPremium: true,
        path: "/analyze",
    },
    {
        id: "security-headers",
        title: "Security Header Checker",
        category: "Security & Utilities",
        desc: "Inspect Content-Security-Policy, HSTS, X-Frame-Options, and CORS configurations.",
        icon: <Shield className="text-rose-500" size={24} />,
        isPremium: false,
        path: "/analyze",
    },
];

const CATEGORIES = ["All", "Text & Content", "Developer", "Web & SEO", "Security & Utilities"];

export default function AllTools() {
    const [searchParams] = useSearchParams();
    const initialQuery = searchParams.get("q") || "";

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [planFilter, setPlanFilter] = useState<"all" | "free" | "premium">("all");

    // Modal Interactive Tool State
    const [activeToolModal, setActiveToolModal] = useState<ToolItem | null>(null);
    const [toolInput, setToolInput] = useState("");
    const [toolOutput, setToolOutput] = useState("");
    const [copied, setCopied] = useState(false);

    // Password generator config
    const [passLength, setPassLength] = useState(16);
    const [includeSymbols, setIncludeSymbols] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);

    const filteredTools = useMemo(() => {
        return TOOLS_COLLECTION.filter((tool) => {
            const matchesQuery =
                tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tool.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tool.category.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;

            const matchesPlan =
                planFilter === "all" ||
                (planFilter === "free" && !tool.isPremium) ||
                (planFilter === "premium" && tool.isPremium);

            return matchesQuery && matchesCategory && matchesPlan;
        });
    }, [searchQuery, selectedCategory, planFilter]);

    const openToolModal = (tool: ToolItem) => {
        setActiveToolModal(tool);
        setToolInput("");
        setToolOutput("");
        if (tool.interactiveType === "password") {
            generatePassword();
        }
    };

    const copyResult = () => {
        if (!toolOutput) return;
        navigator.clipboard.writeText(toolOutput);
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    // Live transformations
    const handleCaseConvert = (type: "upper" | "lower" | "title" | "camel" | "kebab" | "slug") => {
        if (!toolInput) return;
        let res = "";
        switch (type) {
            case "upper":
                res = toolInput.toUpperCase();
                break;
            case "lower":
                res = toolInput.toLowerCase();
                break;
            case "title":
                res = toolInput.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
                break;
            case "camel":
                res = toolInput
                    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()))
                    .replace(/\s+/g, "");
                break;
            case "kebab":
                res = toolInput
                    .toLowerCase()
                    .replace(/[^a-zA-Z0-9]+/g, "-")
                    .replace(/^-+|-+$/g, "");
                break;
            case "slug":
                res = toolInput
                    .toLowerCase()
                    .trim()
                    .replace(/[^\w\s-]/g, "")
                    .replace(/[\s_-]+/g, "-")
                    .replace(/^-+|-+$/g, "");
                break;
        }
        setToolOutput(res);
    };

    const handleJsonFormat = () => {
        try {
            const parsed = JSON.parse(toolInput);
            setToolOutput(JSON.stringify(parsed, null, 2));
            toast.success("Valid JSON formatted!");
        } catch (e: any) {
            setToolOutput(`Error: ${e.message}`);
            toast.error("Invalid JSON syntax");
        }
    };

    const handleBase64 = (encode: boolean) => {
        try {
            if (encode) {
                setToolOutput(btoa(toolInput));
            } else {
                setToolOutput(atob(toolInput));
            }
        } catch (e: any) {
            setToolOutput(`Base64 Error: ${e.message}`);
        }
    };

    const handleUrlEncode = (encode: boolean) => {
        try {
            if (encode) {
                setToolOutput(encodeURIComponent(toolInput));
            } else {
                setToolOutput(decodeURIComponent(toolInput));
            }
        } catch (e: any) {
            setToolOutput(`URL Error: ${e.message}`);
        }
    };

    const generatePassword = () => {
        let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (includeNumbers) chars += "0123456789";
        if (includeSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
        let res = "";
        for (let i = 0; i < passLength; i++) {
            res += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setToolOutput(res);
    };

    return (
        <div className="min-h-screen pt-20 md:pt-24 pb-20 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-card text-xs font-semibold text-primary mb-3 shadow-xs">
                        <LayoutGrid size={14} />
                        All Online Tools
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-semibold text-foreground mb-3">
                        Explore Our <span className="gradient-text">Complete Tool Suite</span>
                    </h1>
                    <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
                        Fast, free, and intuitive online utilities designed to speed up your everyday developer and content workflows.
                    </p>
                </div>

                {/* Search & Filters */}
                <div className="mb-10 max-w-4xl mx-auto space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search tools by name, keyword, or category..."
                            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-card border border-border text-foreground placeholder-muted-foreground outline-none focus:border-primary/50 text-sm shadow-xs transition-colors"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Category Filter Pills & Plan Tabs */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                                        selectedCategory === cat
                                            ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                                            : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                                    }`}
                                    style={selectedCategory === cat ? { color: "var(--background)" } : {}}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Plan Toggle */}
                        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border text-xs font-medium self-end sm:self-auto">
                            <button
                                onClick={() => setPlanFilter("all")}
                                className={`px-2.5 py-1 rounded-lg transition-all ${
                                    planFilter === "all" ? "bg-card text-foreground font-semibold shadow-xs" : "text-muted-foreground"
                                }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setPlanFilter("free")}
                                className={`px-2.5 py-1 rounded-lg transition-all ${
                                    planFilter === "free" ? "bg-card text-foreground font-semibold shadow-xs" : "text-muted-foreground"
                                }`}
                            >
                                Free
                            </button>
                            <button
                                onClick={() => setPlanFilter("premium")}
                                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                                    planFilter === "premium" ? "bg-card text-foreground font-semibold shadow-xs" : "text-muted-foreground"
                                }`}
                            >
                                <Sparkles size={12} className="text-primary" />
                                PRO
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tools Grid */}
                {filteredTools.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredTools.map((tool) => (
                            <div
                                key={tool.id}
                                className="bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:bg-muted/20 transition-all flex flex-col justify-between group shadow-xs"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 rounded-xl bg-muted/60 border border-border/50 group-hover:border-primary/30 transition-colors">
                                            {tool.icon}
                                        </div>
                                        {tool.isPremium ? (
                                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                                PRO
                                            </span>
                                        ) : (
                                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                                Free
                                            </span>
                                        )}
                                    </div>

                                    <div className="text-xs font-medium text-primary mb-1">{tool.category}</div>
                                    <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                        {tool.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {tool.desc}
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
                                    {tool.isPremium ? (
                                        <Link
                                            to={tool.path || "/analyze"}
                                            className="w-full py-2 px-4 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                                        >
                                            <Sparkles size={14} />
                                            Launch PRO Tool
                                        </Link>
                                    ) : tool.interactiveType ? (
                                        <button
                                            onClick={() => openToolModal(tool)}
                                            className="w-full py-2 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-xs flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer"
                                            style={{ color: "var(--background)" }}
                                        >
                                            <Maximize2 size={13} />
                                            Use Tool Online
                                        </button>
                                    ) : (
                                        <Link
                                            to={tool.path || "/analyze"}
                                            className="w-full py-2 px-4 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                                        >
                                            Open Tool <ArrowRight size={14} />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-card border border-border rounded-2xl max-w-xl mx-auto">
                        <SlidersHorizontal size={40} className="mx-auto text-muted-foreground mb-3 opacity-40" />
                        <h3 className="text-base font-semibold text-foreground mb-1">No tools match your filter</h3>
                        <p className="text-sm text-muted-foreground mb-4">Try clearing the search bar or choosing another category.</p>
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedCategory("All");
                                setPlanFilter("all");
                            }}
                            className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>

            {/* INTERACTIVE TOOL POPUP MODAL */}
            {activeToolModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-card border border-border rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                                    {activeToolModal.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground">{activeToolModal.title}</h3>
                                    <p className="text-xs text-muted-foreground">{activeToolModal.category}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setActiveToolModal(null)}
                                className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* CASE CONVERTER TOOL */}
                        {activeToolModal.interactiveType === "case" && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                                        Input Text
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={toolInput}
                                        onChange={(e) => setToolInput(e.target.value)}
                                        placeholder="Type or paste your text here to convert..."
                                        className="w-full p-3 rounded-xl bg-muted/30 border border-border text-foreground text-sm outline-none focus:border-primary/50"
                                    />
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => handleCaseConvert("upper")}
                                        className="px-3 py-1.5 rounded-lg bg-card border border-border hover:bg-muted text-xs font-semibold text-foreground cursor-pointer"
                                    >
                                        UPPERCASE
                                    </button>
                                    <button
                                        onClick={() => handleCaseConvert("lower")}
                                        className="px-3 py-1.5 rounded-lg bg-card border border-border hover:bg-muted text-xs font-semibold text-foreground cursor-pointer"
                                    >
                                        lowercase
                                    </button>
                                    <button
                                        onClick={() => handleCaseConvert("title")}
                                        className="px-3 py-1.5 rounded-lg bg-card border border-border hover:bg-muted text-xs font-semibold text-foreground cursor-pointer"
                                    >
                                        Title Case
                                    </button>
                                    <button
                                        onClick={() => handleCaseConvert("camel")}
                                        className="px-3 py-1.5 rounded-lg bg-card border border-border hover:bg-muted text-xs font-semibold text-foreground cursor-pointer"
                                    >
                                        camelCase
                                    </button>
                                    <button
                                        onClick={() => handleCaseConvert("kebab")}
                                        className="px-3 py-1.5 rounded-lg bg-card border border-border hover:bg-muted text-xs font-semibold text-foreground cursor-pointer"
                                    >
                                        kebab-case
                                    </button>
                                    <button
                                        onClick={() => handleCaseConvert("slug")}
                                        className="px-3 py-1.5 rounded-lg bg-card border border-border hover:bg-muted text-xs font-semibold text-foreground cursor-pointer"
                                    >
                                        URL Slug
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* WORD COUNTER TOOL */}
                        {activeToolModal.interactiveType === "wordcount" && (
                            <div className="space-y-4">
                                <textarea
                                    rows={5}
                                    value={toolInput}
                                    onChange={(e) => setToolInput(e.target.value)}
                                    placeholder="Type or paste your text to count words, characters, sentences..."
                                    className="w-full p-3 rounded-xl bg-muted/30 border border-border text-foreground text-sm outline-none focus:border-primary/50"
                                />
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div className="p-3 rounded-xl bg-muted/40 border border-border text-center">
                                        <div className="text-xl font-bold text-foreground">
                                            {toolInput.trim() ? toolInput.trim().split(/\s+/).length : 0}
                                        </div>
                                        <div className="text-xs text-muted-foreground">Words</div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-muted/40 border border-border text-center">
                                        <div className="text-xl font-bold text-foreground">{toolInput.length}</div>
                                        <div className="text-xs text-muted-foreground">Characters</div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-muted/40 border border-border text-center">
                                        <div className="text-xl font-bold text-foreground">
                                            {toolInput.trim() ? toolInput.split(/[.!?]+/).filter(Boolean).length : 0}
                                        </div>
                                        <div className="text-xs text-muted-foreground">Sentences</div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-muted/40 border border-border text-center">
                                        <div className="text-xl font-bold text-primary">
                                            {Math.ceil((toolInput.trim().split(/\s+/).filter(Boolean).length || 0) / 200)} min
                                        </div>
                                        <div className="text-xs text-muted-foreground">Reading Time</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* JSON FORMATTER */}
                        {activeToolModal.interactiveType === "json" && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                                        Raw JSON Input
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={toolInput}
                                        onChange={(e) => setToolInput(e.target.value)}
                                        placeholder='{"name": "Tool", "active": true}'
                                        className="w-full font-mono p-3 rounded-xl bg-muted/30 border border-border text-foreground text-xs outline-none focus:border-primary/50"
                                    />
                                </div>
                                <button
                                    onClick={handleJsonFormat}
                                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity"
                                    style={{ color: "var(--background)" }}
                                >
                                    Validate & Format JSON
                                </button>
                            </div>
                        )}

                        {/* PASSWORD GENERATOR */}
                        {activeToolModal.interactiveType === "password" && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between gap-4 p-3 bg-muted/30 rounded-xl border border-border">
                                    <label className="text-xs font-medium text-foreground">
                                        Length: <span className="font-bold text-primary">{passLength}</span>
                                    </label>
                                    <input
                                        type="range"
                                        min={8}
                                        max={32}
                                        value={passLength}
                                        onChange={(e) => setPassLength(Number(e.target.value))}
                                        className="w-48"
                                    />
                                </div>

                                <div className="flex gap-4 text-xs font-medium text-foreground">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={includeNumbers}
                                            onChange={(e) => setIncludeNumbers(e.target.checked)}
                                        />
                                        Numbers (0-9)
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={includeSymbols}
                                            onChange={(e) => setIncludeSymbols(e.target.checked)}
                                        />
                                        Symbols (!@#$)
                                    </label>
                                </div>

                                <button
                                    onClick={generatePassword}
                                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90"
                                    style={{ color: "var(--background)" }}
                                >
                                    Regenerate Password
                                </button>
                            </div>
                        )}

                        {/* BASE64 TOOL */}
                        {activeToolModal.interactiveType === "base64" && (
                            <div className="space-y-4">
                                <textarea
                                    rows={3}
                                    value={toolInput}
                                    onChange={(e) => setToolInput(e.target.value)}
                                    placeholder="Enter text or Base64 string..."
                                    className="w-full p-3 rounded-xl bg-muted/30 border border-border text-foreground text-sm outline-none"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleBase64(true)}
                                        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90"
                                        style={{ color: "var(--background)" }}
                                    >
                                        Encode to Base64
                                    </button>
                                    <button
                                        onClick={() => handleBase64(false)}
                                        className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-semibold text-xs"
                                    >
                                        Decode from Base64
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* URL ENCODE / DECODE */}
                        {activeToolModal.interactiveType === "urlencode" && (
                            <div className="space-y-4">
                                <textarea
                                    rows={3}
                                    value={toolInput}
                                    onChange={(e) => setToolInput(e.target.value)}
                                    placeholder="Enter string to URL encode or decode..."
                                    className="w-full p-3 rounded-xl bg-muted/30 border border-border text-foreground text-sm outline-none"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleUrlEncode(true)}
                                        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90"
                                        style={{ color: "var(--background)" }}
                                    >
                                        Encode URL
                                    </button>
                                    <button
                                        onClick={() => handleUrlEncode(false)}
                                        className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-semibold text-xs"
                                    >
                                        Decode URL
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* RESULT BOX */}
                        {toolOutput && (
                            <div className="mt-6 p-4 rounded-2xl bg-muted/50 border border-border">
                                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase mb-2">
                                    <span>Output Result</span>
                                    <button
                                        onClick={copyResult}
                                        className="text-primary hover:underline flex items-center gap-1 cursor-pointer font-normal"
                                    >
                                        {copied ? <Check size={14} /> : <Copy size={14} />}
                                        {copied ? "Copied" : "Copy Result"}
                                    </button>
                                </div>
                                <div className="font-mono text-sm text-foreground bg-card p-3 rounded-xl border border-border/60 break-all whitespace-pre-wrap max-h-48 overflow-y-auto">
                                    {toolOutput}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
