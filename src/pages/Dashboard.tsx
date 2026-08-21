import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SearchIcon, ArrowRightIcon, SparklesIcon, LayoutGridIcon, BookOpenIcon, ZapIcon, FileTextIcon, Code2Icon, ShieldCheckIcon, GlobeIcon, CompassIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
    const { user: authUser } = useAuth();
    const user = {
        name: authUser?.user_metadata?.full_name || authUser?.name || "User",
        plan: (authUser?.plan || "PRO").toUpperCase(),
    };
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const popularTools = [
        {
            id: "tool-1",
            title: "Text & Case Converter",
            category: "Content",
            desc: "Convert text to uppercase, lowercase, title case, camelCase and more with one click.",
            icon: <FileTextIcon size={22} className="text-blue-500" />,
            badge: "Free",
            badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
            path: "/rank-tracker",
        },
        {
            id: "tool-2",
            title: "JSON Formatter & Validator",
            category: "Developer",
            desc: "Format, validate, beautify, and inspect JSON payloads instantly.",
            icon: <Code2Icon size={22} className="text-purple-500" />,
            badge: "Free",
            badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
            path: "/rank-tracker",
        },
        {
            id: "tool-3",
            title: "AI Content & SEO Optimizer",
            category: "Premium",
            desc: "Advanced AI analysis to generate optimized headlines, meta tags, and content recommendations.",
            icon: <SparklesIcon size={22} className="text-primary" />,
            badge: "PRO",
            badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
            path: "/analyze",
        },
        {
            id: "tool-4",
            title: "Meta Tag & OG Previewer",
            category: "SEO & Web",
            desc: "Inspect how your links and social cards appear on Google, Twitter, and Facebook.",
            icon: <GlobeIcon size={22} className="text-amber-500" />,
            badge: "Free",
            badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
            path: "/rank-tracker",
        },
        {
            id: "tool-5",
            title: "Speed & Performance Checker",
            category: "Web Performance",
            desc: "Evaluate page load speed, Core Web Vitals, and resource bottlenecks.",
            icon: <ZapIcon size={22} className="text-orange-500" />,
            badge: "Free",
            badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
            path: "/rank-tracker",
        },
        {
            id: "tool-6",
            title: "Deep Technical Auditor",
            category: "Premium",
            desc: "Full automated crawl of your web properties with issue detection and priority fixes.",
            icon: <ShieldCheckIcon size={22} className="text-rose-500" />,
            badge: "PRO",
            badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
            path: "/analyze",
        },
    ];

    const recentGuides = [
        {
            id: "guide-1",
            title: "The Ultimate Guide to Essential Online Tools for Productivity in 2026",
            category: "Productivity",
            readTime: "5 min read",
            date: "May 2026",
        },
        {
            id: "guide-2",
            title: "How to Optimize Your Workflow with Fast Browser-Based Utilities",
            category: "Guides & Tips",
            readTime: "4 min read",
            date: "April 2026",
        },
        {
            id: "guide-3",
            title: "Understanding Modern Web Vitals and Instant Tool Outputs",
            category: "Web & Tech",
            readTime: "6 min read",
            date: "April 2026",
        },
    ];

    const handleSearch = (e: React.SubmitEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/rank-tracker?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const filteredTools = searchQuery.trim()
        ? popularTools.filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.desc.toLowerCase().includes(searchQuery.toLowerCase()))
        : popularTools;

    return (
        <div className="min-h-screen pt-20 md:pt-24 pb-16 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-1.5">
                                Welcome back, <span className="gradient-text">{user.name}</span>
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                Choose a tool, get fast results, or explore our guides and tutorials.
                            </p>
                        </div>
                        {user.plan === "PRO" ? (
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold self-start sm:self-auto">
                                <SparklesIcon size={14} />
                                Premium Plan Active
                            </div>
                        ) : (
                            <Link
                                to="/#pricing"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity self-start sm:self-auto"
                                style={{ color: "var(--background)" }}
                            >
                                Upgrade to Premium
                                <ArrowRightIcon size={14} />
                            </Link>
                        )}
                    </div>
                </div>

                {/* Tool Search Bar */}
                <form onSubmit={handleSearch} className="mb-10 max-w-2xl">
                    <div className="border border-border/80 bg-card/60 rounded-full p-1.5 sm:p-2 flex items-center gap-2 shadow-xs hover:border-border transition-colors">
                        <div className="flex items-center gap-3 flex-1 px-3">
                            <SearchIcon size={18} className="text-muted-foreground shrink-0" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search tools (e.g. JSON, Case Converter, SEO, Performance)..."
                                className="w-full bg-transparent text-foreground placeholder-muted-foreground outline-none text-sm py-2"
                                id="dashboard-tool-search"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-primary px-5 py-2.5 rounded-full text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity shrink-0 flex items-center gap-1.5 cursor-pointer"
                            style={{ color: "var(--background)" }}
                        >
                            Find Tool
                        </button>
                    </div>
                </form>

                {/* Popular Tools Grid */}
                <div className="mb-14">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <LayoutGridIcon size={20} className="text-primary" />
                            <h2 className="text-xl font-semibold text-foreground">Available Online Tools</h2>
                        </div>
                        <Link to="/rank-tracker" className="text-sm text-primary hover:underline flex items-center gap-1 font-medium">
                            Browse All Tools <ArrowRightIcon size={14} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredTools.map((tool) => (
                            <Link
                                key={tool.id}
                                to={tool.path}
                                className="bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:bg-muted/30 transition-all group flex flex-col justify-between shadow-xs"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 rounded-xl bg-muted/60 border border-border/50 group-hover:border-primary/30 transition-colors">
                                            {tool.icon}
                                        </div>
                                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${tool.badgeClass}`}>
                                            {tool.badge}
                                        </span>
                                    </div>
                                    <div className="text-xs font-medium text-primary mb-1">{tool.category}</div>
                                    <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                        {tool.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {tool.desc}
                                    </p>
                                </div>
                                <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between text-xs font-medium text-muted-foreground group-hover:text-foreground">
                                    <span>Launch Tool</span>
                                    <ArrowRightIcon size={14} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Helpful Resources & Blog Guides */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <BookOpenIcon size={20} className="text-primary" />
                            <h2 className="text-xl font-semibold text-foreground">Guides & Tutorials</h2>
                        </div>
                        <Link to="/history" className="text-sm text-primary hover:underline flex items-center gap-1 font-medium">
                            Visit Blog <ArrowRightIcon size={14} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {recentGuides.map((guide) => (
                            <Link
                                key={guide.id}
                                to="/history"
                                className="bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:bg-muted/30 transition-all group flex flex-col justify-between shadow-xs"
                            >
                                <div>
                                    <div className="flex items-center gap-2 text-xs text-primary font-medium mb-2.5">
                                        <CompassIcon size={14} />
                                        <span>{guide.category}</span>
                                        <span className="text-muted-foreground">•</span>
                                        <span className="text-muted-foreground">{guide.readTime}</span>
                                    </div>
                                    <h3 className="text-base font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
                                        {guide.title}
                                    </h3>
                                </div>
                                <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                                    <span>{guide.date}</span>
                                    <span className="text-primary font-medium group-hover:underline flex items-center gap-1">
                                        Read Guide <ArrowRightIcon size={12} />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

