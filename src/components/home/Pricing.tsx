import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function Pricing() {
    const freeFeatures = [
        { text: "All Free Tools", highlight: true },
        { text: "Unlimited Use", highlight: true },
        { text: "Ads Supported", highlight: true },
        { text: "Basic features", highlight: false },
        { text: "Blog & guides access", highlight: false },
        { text: "No credit card required", highlight: false },
    ];

    const premiumFeatures = [
        { text: "All Free Tools", highlight: true },
        { text: "Unlimited Use", highlight: true },
        { text: "Premium Tools", highlight: true },
        { text: "No Ads", highlight: true },
        { text: "Advanced features", highlight: false },
        { text: "Priority processing", highlight: false },
        { text: "No usage limits", highlight: false },
    ];

    return (
        <section className="relative md:min-h-screen flex flex-col justify-center items-center max-lg:py-24">
            <div className="bg-dot-pattern absolute inset-0 -z-1 opacity-10"></div>
            <div className="max-w-5xl w-full mx-auto px-4 ">
                <div className="text-center mb-14">
                    <h2 className="text-3xl sm:text-4xl font-semibold mb-4 text-foreground">
                        Simple <span className="gradient-text">Pricing</span>
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Use our tools for free. Upgrade to Premium for more powerful tools and an ad-free experience.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    {/* Free */}
                    <div className="bg-card border border-border rounded-2xl p-8 flex flex-col hover:border-border/80 transition-all">
                        <h3 className="text-xl font-semibold mb-1 text-foreground">Free</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold text-foreground">$0</span>
                            <span className="text-muted-foreground">/month</span>
                        </div>
                        <ul className="space-y-3 mb-8 flex-1">
                            {freeFeatures.map((item) => (
                                <li key={item.text} className="flex items-center gap-2.5 text-sm">
                                    <CheckCircle size={16} className="text-primary shrink-0" />
                                    <span className={item.highlight ? "font-semibold text-foreground" : "text-muted-foreground"}>
                                        {item.text}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <Link to="/register" className="block w-full py-3 rounded-xl bg-primary/10 text-secondary-foreground text-center text-sm font-medium hover:bg-primary/20 transition-colors">
                            Get Started Free
                        </Link>
                    </div>

                    {/* Premium */}
                    <div className="relative rounded-2xl p-8 flex flex-col bg-card border border-primary/30 shadow-lg shadow-primary/5 overflow-hidden">
                        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium" style={{ color: "var(--background)" }}>
                            Popular
                        </div>
                        <h3 className="text-xl font-semibold mb-1 text-foreground">Premium</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold text-primary">$5</span>
                            <span className="text-muted-foreground">/month</span>
                        </div>
                        <ul className="space-y-3 mb-8 flex-1">
                            {premiumFeatures.map((item) => (
                                <li key={item.text} className="flex items-center gap-2.5 text-sm">
                                    <CheckCircle size={16} className="text-primary shrink-0" />
                                    <span className={item.highlight ? "font-semibold text-foreground" : "text-muted-foreground"}>
                                        {item.text}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <button className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-center text-sm hover:opacity-90 transition-opacity" style={{ color: "var(--background)" }}>
                            Go Premium
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

