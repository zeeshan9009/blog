/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
    BookOpen,
    Search,
    Clock,
    Calendar,
    ArrowRight,
    Tag,
    Share2,
    X,
    User,
    Compass,
    Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    category: "Guides & Tutorials" | "Developer Tips" | "Productivity" | "SEO & Growth";
    readTime: string;
    date: string;
    author: string;
    image: string;
    featured?: boolean;
    content: string[];
    tags: string[];
}

const BLOG_POSTS: BlogPost[] = [
    {
        id: "post-1",
        title: "The Ultimate Guide to Essential Online Tools for Peak Productivity in 2026",
        excerpt:
            "How lightweight browser utilities, quick text converters, and automated checkers can save you 5+ hours every week without bloated desktop software.",
        category: "Productivity",
        readTime: "6 min read",
        date: "May 18, 2026",
        author: "Sarah Jenkins",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
        featured: true,
        tags: ["Productivity", "Online Tools", "Workflow"],
        content: [
            "In modern digital work, friction is the enemy of productivity. Switching between heavy applications just to format a JSON snippet, count words, or encode a URL wastes precious focus.",
            "Browser-based micro-tools provide zero-setup instant execution. By keeping a suite of essential utilities at your fingertips, you eliminate context switching and streamline development.",
            "Key takeaways: Use case converters for consistent naming, validate JSON before API testing, and automate repetitive formatting tasks with single-click actions.",
        ],
    },
    {
        id: "post-2",
        title: "How to Optimize Your Website's Core Web Vitals for Higher Google Rankings",
        excerpt:
            "A deep dive into Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), and Interaction to Next Paint (INP) with actionable fixes.",
        category: "SEO & Growth",
        readTime: "5 min read",
        date: "May 12, 2026",
        author: "Alex Miller",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
        tags: ["SEO", "Performance", "Core Web Vitals"],
        content: [
            "Google's ranking algorithms increasingly prioritize user experience. Core Web Vitals represent quantifiable signals that measure how real visitors perceive the speed and stability of your website.",
            "To maximize performance, optimize large hero images, defer non-critical JavaScript, and reserve explicit width and height attributes for dynamic embeds to avoid layout shifting.",
            "Run our AI Website Auditor to immediately uncover slow resources and priority optimization opportunities.",
        ],
    },
    {
        id: "post-3",
        title: "Mastering JSON & API Debugging: Common Gotchas and Instant Fixes",
        excerpt:
            "Learn how to format complex API payloads, detect elusive syntax errors, and convert data structures effortlessly.",
        category: "Developer Tips",
        readTime: "4 min read",
        date: "May 04, 2026",
        author: "David Chen",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
        tags: ["JSON", "API", "Debugging"],
        content: [
            "JSON errors like trailing commas, unquoted keys, and unescaped quotes can cause silent API failures during development.",
            "Using a fast client-side JSON validator ensures clean schema structure without sending proprietary data to external unverified servers.",
            "Bookmark our JSON Validator & Formatter to inspect nested arrays and beautify API responses on the fly.",
        ],
    },
    {
        id: "post-4",
        title: "Creating High-Converting Meta Tags and Social Cards That Drive Clicks",
        excerpt:
            "Why your Open Graph tags and meta descriptions determine your click-through rates across Twitter, LinkedIn, and search engines.",
        category: "Guides & Tutorials",
        readTime: "5 min read",
        date: "April 28, 2026",
        author: "Elena Rostova",
        image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&auto=format&fit=crop&q=80",
        tags: ["Marketing", "Meta Tags", "Social Media"],
        content: [
            "A high Google ranking or viral tweet is only as good as its click-through rate. When your link preview looks broken or lacks an engaging image, users scroll past.",
            "Craft meta titles between 50-60 characters and descriptions under 160 characters with clear call-to-actions.",
            "Always preview your Open Graph tags before launching any landing page or publishing blog content.",
        ],
    },
    {
        id: "post-5",
        title: "Password Security 101: Why Length Trumps Complexity in Modern Cryptography",
        excerpt:
            "Understanding entropy, brute-force resistance, and how to create uncrackable passphrases for sensitive accounts.",
        category: "Developer Tips",
        readTime: "4 min read",
        date: "April 20, 2026",
        author: "Michael Scott",
        image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&auto=format&fit=crop&q=80",
        tags: ["Security", "Passwords", "Privacy"],
        content: [
            "Modern GPU clusters can crack 8-character complex passwords in seconds. However, adding just 4 extra characters exponentially increases the search space by trillions of combinations.",
            "Generate cryptographically random 16+ character passwords using our built-in Password Utility to keep your databases and accounts secure.",
        ],
    },
    {
        id: "post-6",
        title: "The Step-by-Step Workflow to Audit and Fix Broken Website Links",
        excerpt:
            "How 404 errors and redirect chains damage your domain authority and how to resolve them systematically.",
        category: "SEO & Growth",
        readTime: "5 min read",
        date: "April 15, 2026",
        author: "Sarah Jenkins",
        image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&auto=format&fit=crop&q=80",
        tags: ["SEO", "Broken Links", "Audit"],
        content: [
            "Broken internal links frustrate visitors and trap search engine crawlers, preventing fresh content from indexing efficiently.",
            "Perform regular monthly crawls of your key navigational links and blog archives to maintain clean link equity.",
        ],
    },
];

const BLOG_CATEGORIES = ["All", "Guides & Tutorials", "Developer Tips", "Productivity", "SEO & Growth"];

export default function Blog() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [activePostModal, setActivePostModal] = useState<BlogPost | null>(null);

    const filteredPosts = useMemo(() => {
        return BLOG_POSTS.filter((post) => {
            const matchesQuery =
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;

            return matchesQuery && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    const featuredPost = BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0];

    const sharePost = (post: BlogPost) => {
        if (navigator.share) {
            navigator.share({ title: post.title, text: post.excerpt, url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Article link copied!");
        }
    };

    return (
        <div className="min-h-screen pt-20 md:pt-24 pb-20 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-card text-xs font-semibold text-primary mb-3 shadow-xs">
                        <BookOpen size={14} />
                        Blog & Practical Guides
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-semibold text-foreground mb-3">
                        Insights, Tutorials & <span className="gradient-text">Tool Guides</span>
                    </h1>
                    <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
                        Explore practical workflows, developer hacks, SEO blueprints, and comprehensive guides to get the most out of our online tools.
                    </p>
                </div>

                {/* FEATURED POST HERO (Shown when no active search) */}
                {!searchQuery && selectedCategory === "All" && featuredPost && (
                    <div className="mb-14 bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:border-primary/40 transition-all group">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                            <div className="lg:col-span-7 h-64 lg:h-auto relative overflow-hidden bg-muted">
                                <img
                                    src={featuredPost.image}
                                    alt={featuredPost.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary text-primary-foreground shadow-md" style={{ color: "var(--background)" }}>
                                        Featured Guide
                                    </span>
                                </div>
                            </div>
                            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-3 text-xs text-primary font-semibold mb-3">
                                        <Compass size={14} />
                                        <span>{featuredPost.category}</span>
                                        <span className="text-muted-foreground">•</span>
                                        <span className="text-muted-foreground flex items-center gap-1">
                                            <Clock size={12} /> {featuredPost.readTime}
                                        </span>
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors leading-snug">
                                        {featuredPost.title}
                                    </h2>
                                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                                        {featuredPost.excerpt}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-border/60">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                                            {featuredPost.author.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-foreground">{featuredPost.author}</p>
                                            <p className="text-[11px] text-muted-foreground">{featuredPost.date}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setActivePostModal(featuredPost)}
                                        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer"
                                        style={{ color: "var(--background)" }}
                                    >
                                        Read Guide <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search & Category Filter Bar */}
                <div className="mb-10 max-w-4xl mx-auto space-y-4">
                    <div className="relative">
                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search articles, guides, or tags (e.g. SEO, JSON, Productivity)..."
                            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-card border border-border text-foreground placeholder-muted-foreground outline-none focus:border-primary/50 text-sm shadow-xs transition-colors"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-1 justify-start sm:justify-center">
                        {BLOG_CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
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
                </div>

                {/* Articles Grid */}
                {filteredPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map((post) => (
                            <article
                                key={post.id}
                                className="bg-card border border-border rounded-3xl overflow-hidden hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between group"
                            >
                                <div>
                                    <div className="h-48 relative overflow-hidden bg-muted">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 right-3">
                                            <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-background/90 backdrop-blur-md text-foreground border border-border/50">
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2.5">
                                            <Calendar size={13} />
                                            <span>{post.date}</span>
                                            <span>•</span>
                                            <Clock size={13} />
                                            <span>{post.readTime}</span>
                                        </div>

                                        <h3 className="text-base font-semibold text-foreground mb-2.5 group-hover:text-primary transition-colors leading-snug">
                                            {post.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                                            {post.excerpt}
                                        </p>

                                        <div className="flex flex-wrap gap-1.5 mb-2">
                                            {post.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-2.5 py-0.5 rounded-md text-[10px] font-medium bg-muted text-muted-foreground"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 pt-0 flex items-center justify-between border-t border-border/40 mt-auto pt-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                                            {post.author.charAt(0)}
                                        </div>
                                        <span className="text-xs text-muted-foreground">{post.author}</span>
                                    </div>

                                    <button
                                        onClick={() => setActivePostModal(post)}
                                        className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                                    >
                                        Read Article <ArrowRight size={13} />
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-card border border-border rounded-2xl max-w-xl mx-auto">
                        <BookOpen size={40} className="mx-auto text-muted-foreground mb-3 opacity-40" />
                        <h3 className="text-base font-semibold text-foreground mb-1">No articles found</h3>
                        <p className="text-sm text-muted-foreground mb-4">Try searching for other topics or reset your category filter.</p>
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedCategory("All");
                            }}
                            className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>

            {/* FULL ARTICLE READER MODAL */}
            {activePostModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-card border border-border rounded-3xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-4 mb-6 border-b border-border">
                            <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                                <Tag size={14} />
                                <span>{activePostModal.category}</span>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-muted-foreground">{activePostModal.readTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => sharePost(activePostModal)}
                                    className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted cursor-pointer"
                                    title="Share"
                                >
                                    <Share2 size={18} />
                                </button>
                                <button
                                    onClick={() => setActivePostModal(null)}
                                    className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted cursor-pointer"
                                    title="Close"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-4 leading-tight">
                            {activePostModal.title}
                        </h2>

                        <div className="flex items-center gap-3 mb-6 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <User size={14} />
                                <span className="text-foreground font-medium">{activePostModal.author}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1.5">
                                <Calendar size={14} />
                                <span>{activePostModal.date}</span>
                            </div>
                        </div>

                        <div className="rounded-2xl overflow-hidden mb-8 h-64 bg-muted">
                            <img
                                src={activePostModal.image}
                                alt={activePostModal.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                            {activePostModal.content.map((paragraph, i) => (
                                <p key={i} className="text-foreground/90">
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        <div className="mt-8 p-5 rounded-2xl bg-muted/40 border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                                    <Sparkles size={20} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-foreground">Try Related Online Tools</h4>
                                    <p className="text-xs text-muted-foreground">Put these guides into practice instantly.</p>
                                </div>
                            </div>
                            <Link
                                to="/rank-tracker"
                                onClick={() => setActivePostModal(null)}
                                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity whitespace-nowrap"
                                style={{ color: "var(--background)" }}
                            >
                                Explore All Tools
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
