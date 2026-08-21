/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
    SearchIcon,
    GlobeIcon,
    FileSearchIcon,
    BrainIcon,
    CheckCircleIcon,
    AlertCircle,
    Loader2,
    ArrowRightIcon,
    SparklesIcon,
    LockIcon,
    LayersIcon,
    CopyIcon,
    CheckIcon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const STEPS = [
    { icon: <GlobeIcon size={22} />, label: "Connecting to Cloud Browser", desc: "Initializing secure headless session..." },
    { icon: <FileSearchIcon size={22} />, label: "Deep Scraping & Performance", desc: "Extracting meta tags, scripts, images & Core Web Vitals..." },
    { icon: <BrainIcon size={22} />, label: "AI Neural Analysis", desc: "Evaluating semantic health & ranking opportunities..." },
    { icon: <CheckCircleIcon size={22} />, label: "Premium Report Ready", desc: "Compiling actionable fixes and scoring..." },
];

export default function Analyze() {
    const { user, setPlan } = useAuth();
    const isPro = (user?.plan || user?.user_metadata?.plan || "").toUpperCase() === "PRO" || (user?.plan || "").toUpperCase() === "PREMIUM";

    const [activeTab, setActiveTab] = useState<"auditor" | "content" | "compare">("auditor");
    const [url, setUrl] = useState("");
    const [analyzing, setAnalyzing] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState("");
    const [searchParams] = useSearchParams();
    const pollRef = useRef<any>(null);

    // AI Content Tool States
    const [topicKeyword, setTopicKeyword] = useState("");
    const [generatingContent, setGeneratingContent] = useState(false);
    const [contentResult, setContentResult] = useState<any>(null);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    // Compare Tool States
    const [url1, setUrl1] = useState("");
    const [url2, setUrl2] = useState("");
    const [comparing, setComparing] = useState(false);
    const [compareResult, setCompareResult] = useState<any>(null);

    const navigate = useNavigate();

    const handleAnalyze = async (submitUrl?: string) => {
        const targetUrl = submitUrl || url;
        if (!targetUrl.trim()) {
            setError("Please enter a valid website URL");
            return;
        }

        setError("");
        setAnalyzing(true);
        setCurrentStep(0);

        setTimeout(() => setCurrentStep(1), 1200);
        setTimeout(() => setCurrentStep(2), 3200);
        setTimeout(() => setCurrentStep(3), 5500);
        setTimeout(() => {
            setAnalyzing(false);
            navigate(`/report/id123`);
        }, 7000);
    };

    const handleContentGenerate = (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!topicKeyword.trim()) return;
        setGeneratingContent(true);
        setTimeout(() => {
            setContentResult({
                title: `${topicKeyword} — Complete Guide, Best Tools & Practical Tips (2026)`,
                description: `Discover how to master ${topicKeyword.toLowerCase()} with our curated tools, actionable workflows, and expert recommendations to boost performance.`,
                h1: `The Ultimate 2026 Blueprint to ${topicKeyword}`,
                keywords: [
                    `${topicKeyword.toLowerCase()} online tool`,
                    `best ${topicKeyword.toLowerCase()} guide`,
                    `free ${topicKeyword.toLowerCase()} tips`,
                    `fast ${topicKeyword.toLowerCase()} utility`,
                ],
            });
            setGeneratingContent(false);
            toast.success("AI Content Generated!");
        }, 1200);
    };

    const handleCompareSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!url1.trim() || !url2.trim()) return;
        setComparing(true);
        setTimeout(() => {
            setCompareResult({
                site1: { url: url1, score: 88, speed: "1.2s", metaOk: true, issues: 3 },
                site2: { url: url2, score: 74, speed: "2.4s", metaOk: false, issues: 8 },
            });
            setComparing(false);
            toast.success("Comparison Complete!");
        }, 1500);
    };

    const copyToClipboard = (text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const handleUpgradeDemo = () => {
        setPlan("PRO");
        toast.success("Premium Plan activated!");
    };

    useEffect(() => {
        const prefillUrl = searchParams.get("url");
        if (prefillUrl) {
            setUrl(prefillUrl);
            setTimeout(() => handleAnalyze(prefillUrl), 500);
        }

        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, []);

    return (
        <div className="min-h-screen pt-20 md:pt-24 pb-20 bg-background">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header Banner */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
                        <SparklesIcon size={14} />
                        Premium Suite
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-semibold text-foreground mb-3">
                        Advanced <span className="gradient-text">AI Premium Tools</span>
                    </h1>
                    <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
                        Deep AI site auditor, intelligent content optimization, and competitor analysis with priority processing.
                    </p>
                </div>

                {/* Subscription Status Banner */}
                {!isPro && (
                    <div className="mb-10 bg-card border border-primary/30 rounded-2xl p-6 sm:p-8 shadow-lg shadow-primary/5 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-2xl bg-primary/10 text-primary shrink-0">
                                <LockIcon size={28} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
                                    Premium Feature Locked
                                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                                        $5/mo
                                    </span>
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Upgrade to Premium to get unlimited AI audits, deep performance analysis, content optimization, and zero ads.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                            <button
                                onClick={handleUpgradeDemo}
                                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm cursor-pointer text-center"
                                style={{ color: "var(--background)" }}
                            >
                                Unlock PRO ($5/mo)
                            </button>
                            <Link
                                to="/#pricing"
                                className="px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-sm font-medium text-center transition-colors"
                            >
                                View Plans
                            </Link>
                        </div>
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="flex items-center justify-center gap-2 mb-8 bg-muted/50 p-1.5 rounded-2xl border border-border max-w-xl mx-auto">
                    <button
                        onClick={() => setActiveTab("auditor")}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer ${
                            activeTab === "auditor" ? "bg-card text-foreground shadow-xs border border-border/80 font-semibold" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <GlobeIcon size={16} />
                        AI Site Auditor
                    </button>
                    <button
                        onClick={() => setActiveTab("content")}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer ${
                            activeTab === "content" ? "bg-card text-foreground shadow-xs border border-border/80 font-semibold" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <BrainIcon size={16} />
                        Content Generator
                    </button>
                    <button
                        onClick={() => setActiveTab("compare")}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer ${
                            activeTab === "compare" ? "bg-card text-foreground shadow-xs border border-border/80 font-semibold" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <LayersIcon size={16} />
                        Site Compare
                    </button>
                </div>

                {/* TAB 1: AI Site Auditor */}
                {activeTab === "auditor" && (
                    <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm">
                        {!analyzing ? (
                            <div>
                                <div className="text-center mb-8">
                                    <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-3">
                                        <SearchIcon size={24} />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-foreground mb-2">Deep AI Website Auditor</h2>
                                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                        Analyze page performance, Core Web Vitals, metadata, security headers, and AI-recommended fixes.
                                    </p>
                                </div>

                                {error && (
                                    <div className="mb-6 px-4 py-3 rounded-xl severity-critical text-sm flex items-center gap-2 max-w-xl mx-auto">
                                        <AlertCircle size={18} className="shrink-0" />
                                        {error}
                                    </div>
                                )}

                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleAnalyze();
                                    }}
                                    className="max-w-xl mx-auto"
                                >
                                    <div className="border border-border bg-muted/30 rounded-2xl p-2 flex items-center gap-2 focus-within:border-primary/50 transition-colors">
                                        <div className="flex items-center gap-3 flex-1 px-3">
                                            <GlobeIcon size={18} className="text-muted-foreground shrink-0" />
                                            <input
                                                type="text"
                                                value={url}
                                                onChange={(e) => setUrl(e.target.value)}
                                                placeholder="Enter URL to audit (e.g., example.com)"
                                                className="w-full bg-transparent text-foreground placeholder-muted-foreground outline-none text-sm py-2.5"
                                                id="analyze-url-input"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="bg-primary px-6 py-2.5 rounded-xl flex items-center gap-2 text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shrink-0 cursor-pointer shadow-xs"
                                            id="analyze-submit-btn"
                                            style={{ color: "var(--background)" }}
                                        >
                                            Run Audit <ArrowRightIcon size={16} />
                                        </button>
                                    </div>
                                </form>

                                <div className="mt-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-2 flex-wrap">
                                    <span>Try sample websites:</span>
                                    {["stripe.com", "github.com", "vercel.com"].map((ex) => (
                                        <button
                                            key={ex}
                                            type="button"
                                            onClick={() => setUrl(ex)}
                                            className="px-2.5 py-1 rounded-lg border border-border/80 bg-muted/40 hover:bg-muted text-primary text-xs font-medium cursor-pointer transition-colors"
                                        >
                                            {ex}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="text-center mb-10">
                                    <h2 className="text-2xl font-semibold text-foreground">Running Deep AI Audit</h2>
                                    <div className="flex justify-center items-center gap-2 mt-2">
                                        <Loader2 size={16} className="text-primary animate-spin" />
                                        <p className="text-muted-foreground text-sm font-mono">{url}</p>
                                    </div>
                                </div>

                                <div className="max-w-md mx-auto space-y-3.5">
                                    {STEPS.map((step, i) => {
                                        const isComplete = i < currentStep;
                                        const isCurrent = i === currentStep;
                                        const isPending = i > currentStep;

                                        return (
                                            <div
                                                key={step.label}
                                                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                                                    isCurrent
                                                        ? "bg-primary/5 border-primary/40 shadow-xs"
                                                        : isComplete
                                                        ? "bg-card border-border/60 opacity-80"
                                                        : "bg-muted/20 border-border/30 opacity-40"
                                                }`}
                                            >
                                                <div
                                                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                                        isComplete
                                                            ? "bg-emerald-500/15 text-emerald-600"
                                                            : isCurrent
                                                            ? "bg-primary text-primary-foreground"
                                                            : "bg-muted text-muted-foreground"
                                                    }`}
                                                    style={isCurrent ? { color: "var(--background)" } : {}}
                                                >
                                                    {isComplete ? <CheckCircleIcon size={20} /> : step.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-semibold ${isPending ? "text-muted-foreground" : "text-foreground"}`}>{step.label}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{step.desc}</p>
                                                </div>
                                                {isCurrent && <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0" />}
                                            </div>
                                        );
                                    })}
                                </div>
                                <p className="text-center text-xs text-muted-foreground mt-8">Priority cloud instances processing scan with AI reasoning...</p>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 2: AI Content & Meta Generator */}
                {activeTab === "content" && (
                    <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm">
                        <div className="text-center mb-8">
                            <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-3">
                                <SparklesIcon size={24} />
                            </div>
                            <h2 className="text-2xl font-semibold text-foreground mb-2">AI Content & Meta Tag Generator</h2>
                            <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                Automatically generate CTR-optimized title tags, descriptions, and article structures for any topic.
                            </p>
                        </div>

                        <form onSubmit={handleContentGenerate} className="max-w-xl mx-auto mb-8">
                            <div className="border border-border bg-muted/30 rounded-2xl p-2 flex items-center gap-2 focus-within:border-primary/50 transition-colors">
                                <div className="flex items-center gap-3 flex-1 px-3">
                                    <BrainIcon size={18} className="text-muted-foreground shrink-0" />
                                    <input
                                        type="text"
                                        value={topicKeyword}
                                        onChange={(e) => setTopicKeyword(e.target.value)}
                                        placeholder="Enter topic or primary keyword (e.g., Online PDF Tools)"
                                        className="w-full bg-transparent text-foreground placeholder-muted-foreground outline-none text-sm py-2.5"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={generatingContent}
                                    className="bg-primary px-6 py-2.5 rounded-xl flex items-center gap-2 text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shrink-0 cursor-pointer shadow-xs disabled:opacity-50"
                                    style={{ color: "var(--background)" }}
                                >
                                    {generatingContent ? <Loader2 size={16} className="animate-spin" /> : "Generate"}
                                </button>
                            </div>
                        </form>

                        {contentResult && (
                            <div className="space-y-4 max-w-xl mx-auto animate-slide-up">
                                <div className="p-4 rounded-2xl bg-muted/30 border border-border">
                                    <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                                        <span>Optimized Title Tag</span>
                                        <button
                                            onClick={() => copyToClipboard(contentResult.title, "title")}
                                            className="text-primary hover:underline flex items-center gap-1 cursor-pointer font-normal"
                                        >
                                            {copiedKey === "title" ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                                            {copiedKey === "title" ? "Copied" : "Copy"}
                                        </button>
                                    </div>
                                    <p className="text-sm font-medium text-foreground">{contentResult.title}</p>
                                </div>

                                <div className="p-4 rounded-2xl bg-muted/30 border border-border">
                                    <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                                        <span>Meta Description</span>
                                        <button
                                            onClick={() => copyToClipboard(contentResult.description, "desc")}
                                            className="text-primary hover:underline flex items-center gap-1 cursor-pointer font-normal"
                                        >
                                            {copiedKey === "desc" ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                                            {copiedKey === "desc" ? "Copied" : "Copy"}
                                        </button>
                                    </div>
                                    <p className="text-sm text-foreground leading-relaxed">{contentResult.description}</p>
                                </div>

                                <div className="p-4 rounded-2xl bg-muted/30 border border-border">
                                    <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                                        Related Keyword Opportunities
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {contentResult.keywords.map((kw: string) => (
                                            <span key={kw} className="px-3 py-1 rounded-full text-xs font-medium bg-card border border-border text-foreground">
                                                {kw}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 3: Site Comparison */}
                {activeTab === "compare" && (
                    <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm">
                        <div className="text-center mb-8">
                            <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-3">
                                <LayersIcon size={24} />
                            </div>
                            <h2 className="text-2xl font-semibold text-foreground mb-2">Side-by-Side Site Compare</h2>
                            <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                Compare speed, SEO scores, and technical health of two competitor URLs side-by-side.
                            </p>
                        </div>

                        <form onSubmit={handleCompareSubmit} className="max-w-xl mx-auto space-y-3 mb-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    value={url1}
                                    onChange={(e) => setUrl1(e.target.value)}
                                    placeholder="Site 1 (e.g. siteA.com)"
                                    className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border text-foreground placeholder-muted-foreground outline-none text-sm focus:border-primary/50"
                                />
                                <input
                                    type="text"
                                    value={url2}
                                    onChange={(e) => setUrl2(e.target.value)}
                                    placeholder="Site 2 (e.g. siteB.com)"
                                    className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border text-foreground placeholder-muted-foreground outline-none text-sm focus:border-primary/50"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={comparing}
                                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                                style={{ color: "var(--background)" }}
                            >
                                {comparing ? <Loader2 size={16} className="animate-spin" /> : "Compare Websites"}
                            </button>
                        </form>

                        {compareResult && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto animate-slide-up">
                                <div className="p-5 rounded-2xl bg-muted/30 border border-border">
                                    <div className="text-sm font-semibold text-foreground truncate mb-3">{compareResult.site1.url}</div>
                                    <div className="space-y-2 text-xs">
                                        <div className="flex justify-between py-1 border-b border-border/40">
                                            <span className="text-muted-foreground">Overall Score:</span>
                                            <span className="font-bold text-emerald-500">{compareResult.site1.score}/100</span>
                                        </div>
                                        <div className="flex justify-between py-1 border-b border-border/40">
                                            <span className="text-muted-foreground">Load Speed:</span>
                                            <span className="font-semibold text-foreground">{compareResult.site1.speed}</span>
                                        </div>
                                        <div className="flex justify-between py-1">
                                            <span className="text-muted-foreground">Pending Issues:</span>
                                            <span className="font-semibold text-amber-500">{compareResult.site1.issues} detected</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 rounded-2xl bg-muted/30 border border-border">
                                    <div className="text-sm font-semibold text-foreground truncate mb-3">{compareResult.site2.url}</div>
                                    <div className="space-y-2 text-xs">
                                        <div className="flex justify-between py-1 border-b border-border/40">
                                            <span className="text-muted-foreground">Overall Score:</span>
                                            <span className="font-bold text-amber-500">{compareResult.site2.score}/100</span>
                                        </div>
                                        <div className="flex justify-between py-1 border-b border-border/40">
                                            <span className="text-muted-foreground">Load Speed:</span>
                                            <span className="font-semibold text-foreground">{compareResult.site2.speed}</span>
                                        </div>
                                        <div className="flex justify-between py-1">
                                            <span className="text-muted-foreground">Pending Issues:</span>
                                            <span className="font-semibold text-rose-500">{compareResult.site2.issues} detected</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
