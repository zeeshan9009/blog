import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { BarChart3, History, LogOut, Menu, X, Target, Sun, Moon, ChartNoAxesColumnIcon, Sparkles } from "lucide-react";
import { useState } from "react";

function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24">
            <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
        </svg>
    );
}

export default function Navbar() {
    const { user, loading, signInWithGoogle, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [imgError, setImgError] = useState(false);

    const displayName = user?.user_metadata?.full_name || user?.name || "User";
    const displayAvatar = user?.user_metadata?.avatar_url || user?.avatar_url;
    const isPro = (user?.plan || user?.user_metadata?.plan || "").toUpperCase() === "PRO" || (user?.plan || "").toUpperCase() === "PREMIUM";

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    const handleGoogleLogin = async () => {
        await signInWithGoogle();
    };

    const isActive = (path: string) => location.pathname === path;

    const navLinks = [
        { path: "/dashboard", label: "Dashboard", icon: <BarChart3 size={18} /> },
        { path: "/analyze", label: "Premium Tools", icon: <Sparkles size={18} /> },
        { path: "/rank-tracker", label: "All Tools", icon: <Target size={18} /> },
        { path: "/history", label: "Blog", icon: <History size={18} /> },
    ];

    return (
        <nav className="fixed top-0 w-full bg-background/70 backdrop-blur-lg z-50 border-b border-border/40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <ChartNoAxesColumnIcon />
                        <span className="text-xl tracking-tight text-foreground font-semibold">Rank Tool</span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                                    isActive(link.path)
                                        ? "bg-accent/5 text-accent font-medium"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                                }`}
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right side */}
                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors flex items-center justify-center cursor-pointer"
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        {user ? (
                            <div className="flex items-center gap-3">
                                {/* Profile capsule pill */}
                                <div className="flex items-center gap-2.5 py-1 pl-1.5 pr-3 rounded-full border border-border/80 bg-card/70 backdrop-blur-sm shadow-xs">
                                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-slate-900 text-white text-xs font-semibold shrink-0 border border-border/40">
                                        {displayAvatar && !imgError ? (
                                            <img
                                                src={displayAvatar}
                                                alt={displayName}
                                                referrerPolicy="no-referrer"
                                                className="w-full h-full object-cover"
                                                onError={() => setImgError(true)}
                                            />
                                        ) : (
                                            <span>{displayName.charAt(0).toUpperCase()}</span>
                                        )}
                                    </div>
                                    <span className="text-foreground font-medium text-sm max-w-[120px] truncate">
                                        {displayName}
                                    </span>
                                    {isPro && (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
                                            PRO
                                        </span>
                                    )}
                                </div>

                                {/* Logout Button */}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
                                    title="Logout"
                                >
                                    <LogOut size={16} className="shrink-0" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-border bg-card/80 hover:bg-muted text-foreground text-sm font-medium transition-all shadow-xs hover:border-border/80 cursor-pointer disabled:opacity-50"
                            >
                                <GoogleIcon className="w-4 h-4 shrink-0" />
                                <span>{loading ? "Connecting..." : "Continue with Google"}</span>
                            </button>
                        )}
                    </div>

                    {/* Mobile toggle container */}
                    <div className="flex items-center gap-2 md:hidden">
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                        >
                            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        <button
                            className="text-muted-foreground hover:text-foreground p-2"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden border-b border-border bg-background origin-top">
                    <div className="px-4 py-3 space-y-2">
                        {user ? (
                            <div className="flex items-center justify-between p-3 bg-muted/50 border border-border/60 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-900 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                                        {displayAvatar && !imgError ? (
                                            <img
                                                src={displayAvatar}
                                                alt={displayName}
                                                referrerPolicy="no-referrer"
                                                className="w-full h-full object-cover"
                                                onError={() => setImgError(true)}
                                            />
                                        ) : (
                                            <span>{displayName.charAt(0).toUpperCase()}</span>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-sm font-semibold text-foreground truncate">{displayName}</div>
                                        <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                                    </div>
                                </div>
                                {isPro && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                        PRO
                                    </span>
                                )}
                            </div>
                        ) : (
                            <div className="py-2">
                                <button
                                    onClick={() => {
                                        handleGoogleLogin();
                                        setMobileOpen(false);
                                    }}
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-sm font-medium transition-all shadow-xs cursor-pointer"
                                >
                                    <GoogleIcon className="w-4 h-4 shrink-0" />
                                    <span>{loading ? "Connecting..." : "Continue with Google"}</span>
                                </button>
                            </div>
                        )}

                        {/* Mobile Nav Links - always visible */}
                        <div className="py-2 space-y-1 border-t border-border/40">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                        isActive(link.path)
                                            ? "bg-accent/10 text-accent"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    }`}
                                >
                                    {link.icon}
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {user && (
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setMobileOpen(false);
                                }}
                                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-danger hover:bg-danger/10 w-full mt-1 cursor-pointer font-medium"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

