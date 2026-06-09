import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home,
    Stethoscope,
    MessageCircle,
    LayoutDashboard,
    Pill,
    MapPin,
    Menu,
    X,
    LogOut,
    User,
    ChevronDown,
    Clock,
    AlertTriangle,
    ScanLine,
    ShieldCheck,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES, NAV_ITEMS } from "../../constants";
import { cn, getInitials } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

const iconMap = {
    Home,
    Stethoscope,
    MessageCircle,
    LayoutDashboard,
    Pill,
    MapPin,
    Clock,
    AlertTriangle,
    ScanLine,
};

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthStore();
    const { handleLogout } = useAuth();

    const isActive = (href: string) => location.pathname === href;

    const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

    return (
        <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
            <nav className="container mx-auto pointer-events-auto glass-panel rounded-3xl border-white/20 overflow-hidden shadow-[0_20px_50px_rgba(6,78,59,0.15)] ring-1 ring-white/10 relative pb-[2px]">
                {/* Subtle Top Shine */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                <div className="px-6 h-18 flex items-center justify-between">
                    {/* Logo Section */}
                    <div className="flex items-center gap-6">
                        <Link
                            to={ROUTES.HOME}
                            className="flex items-center gap-2.5 group"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                className="w-9 h-9 rounded-xl bg-navy-900 flex items-center justify-center shadow-navy relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <Stethoscope className="w-4 h-4 text-emerald-400 relative z-10" />
                            </motion.div>
                            <div className="flex flex-col">
                                <span className="text-navy-900 font-bold tracking-tighter text-xl leading-none">
                                    MediAssist <span className="text-emerald-500">AI</span>
                                </span>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                    <span className="text-[9px] uppercase tracking-[0.2em] font-black text-slate-500 leading-none">
                                        System Optimal
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation - Elite Link Style */}
                    <div className="hidden lg:flex items-center gap-1">
                        {NAV_ITEMS.filter(item => ["Home", "Dashboard", "Timeline"].includes(item.label)).map((item) => {
                            const Icon = iconMap[item.icon as keyof typeof iconMap];
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className={cn(
                                        "relative flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-[13px] font-bold transition-all duration-500 group",
                                        active
                                            ? "text-emerald-900"
                                            : "text-slate-500 hover:text-navy-900"
                                    )}
                                >
                                    {Icon && <Icon className={cn("w-4 h-4 transition-transform duration-500 group-hover:scale-110", active ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-500")} />}
                                    {item.label}
                                    {active ? (
                                        <motion.div
                                            layoutId="nav-active"
                                            className="absolute inset-0 bg-emerald-50 rounded-2xl -z-10 border border-emerald-100/50 shadow-sm"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-transparent rounded-2xl -z-10 group-hover:bg-slate-50/50 transition-colors duration-500" />
                                    )}
                                </Link>
                            );
                        })}

                        {/* Services Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className={cn(
                                    "relative flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-[13px] font-bold transition-all duration-500 group text-slate-500 hover:text-navy-900",
                                    NAV_ITEMS.filter(item => !["Home", "Dashboard", "Timeline"].includes(item.label)).some(item => isActive(item.href)) && "text-emerald-900"
                                )}>
                                    <div className="flex items-center gap-2">
                                        <div className="grid grid-cols-2 gap-0.5 group-hover:rotate-180 transition-transform duration-700">
                                            <div className="w-1.5 h-1.5 rounded-[3px] bg-emerald-500" />
                                            <div className="w-1.5 h-1.5 rounded-[3px] bg-emerald-400/50" />
                                            <div className="w-1.5 h-1.5 rounded-[3px] bg-emerald-400/50" />
                                            <div className="w-1.5 h-1.5 rounded-[3px] bg-emerald-500" />
                                        </div>
                                        <span>Health Services</span>
                                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 transition-transform group-data-[state=open]:rotate-180" />
                                    </div>
                                    {NAV_ITEMS.filter(item => !["Home", "Dashboard", "Timeline"].includes(item.label)).some(item => isActive(item.href)) && (
                                        <motion.div
                                            layoutId="nav-active"
                                            className="absolute inset-0 bg-emerald-50 rounded-2xl -z-10 border border-emerald-100/50 shadow-sm"
                                        />
                                    )}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-72 p-3 rounded-[2rem] glass-panel border-white/20 shadow-luxe mt-4 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-300">
                                <div className="px-3 py-2 mb-2">
                                    <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 leading-none">Diagnostic Suite</p>
                                </div>
                                <div className="grid gap-1.5">
                                    {NAV_ITEMS.filter(item => !["Home", "Dashboard", "Timeline"].includes(item.label)).map((item) => {
                                        const Icon = iconMap[item.icon as keyof typeof iconMap];
                                        const active = isActive(item.href);
                                        return (
                                            <DropdownMenuItem
                                                key={item.href}
                                                onClick={() => navigate(item.href)}
                                                className={cn(
                                                    "rounded-2xl flex items-center gap-4 focus:bg-emerald-50/50 cursor-pointer p-3 transition-all group/item",
                                                    active && "bg-emerald-50"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                                                    active ? "bg-emerald-100 text-emerald-600" : "bg-slate-100/50 text-slate-500 group-hover/item:bg-emerald-100 group-hover/item:text-emerald-600"
                                                )}>
                                                    {Icon && <Icon className="w-5 h-5" />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={cn(
                                                        "text-sm font-black leading-none mb-1",
                                                        active ? "text-navy-900" : "text-slate-600 group-hover/item:text-navy-900"
                                                    )}>{item.label}</span>
                                                    <span className="text-[10px] text-slate-400 font-medium leading-none">
                                                        {item.label === "Symptom Analyzer" ? "AI-powered diagnostics" :
                                                            item.label === "AI Doctor Chat" ? "Real-time AI consultation" :
                                                                item.label === "Medicine Info" ? "Drug database & usage" : "Interactive care locator"}
                                                    </span>
                                                </div>
                                            </DropdownMenuItem>
                                        );
                                    })}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Desktop Auth - Premium Dropdown */}
                    <div className="hidden lg:flex items-center gap-6">
                        {isAuthenticated && user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-3 pl-2 pr-4 py-2 rounded-2xl hover:bg-white/40 transition-all group border border-transparent hover:border-white/20">
                                        <div className="w-9 h-9 rounded-2xl bg-navy-900 flex items-center justify-center text-emerald-400 shadow-navy overflow-hidden border-2 border-emerald-100/20 group-hover:border-emerald-100/50 transition-all">
                                            <span className="text-xs font-black">
                                                {getInitials(user.name)}
                                            </span>
                                        </div>
                                        <div className="text-left hidden xl:block">
                                            <p className="text-xs font-black text-navy-900 leading-none mb-1">
                                                {user.name.split(" ")[0]}
                                            </p>
                                            <div className="flex items-center gap-1.5 opacity-60">
                                                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter leading-none">
                                                    Elite Member
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 transition-transform group-data-[state=open]:rotate-180" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64 p-3 rounded-[2rem] glass-panel border-white/20 shadow-luxe mt-4 ring-1 ring-black/5">
                                    <div className="px-2 py-3 mb-2">
                                        <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1 leading-none">Connected Identity</p>
                                        <p className="text-sm font-bold text-navy-900 truncate">{user.email}</p>
                                    </div>
                                    <DropdownMenuItem
                                        onClick={() => navigate(ROUTES.DASHBOARD)}
                                        className="rounded-2xl flex items-center gap-4 focus:bg-emerald-50 cursor-pointer p-4 transition-all"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-emerald-100/50 flex items-center justify-center">
                                            <User className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-navy-900 leading-none mb-1">Health Portfolio</span>
                                            <span className="text-[11px] text-slate-400 font-medium">Access diagnostic records</span>
                                        </div>
                                    </DropdownMenuItem>

                                    {user.role === "admin" && (
                                        <DropdownMenuItem
                                            onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
                                            className="rounded-2xl flex items-center gap-4 focus:bg-red-50 cursor-pointer p-4 transition-all"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-red-100/50 flex items-center justify-center">
                                                <ShieldCheck className="w-5 h-5 text-red-600" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-navy-900 leading-none mb-1">Command Center</span>
                                                <span className="text-[11px] text-red-400 font-medium">Admin & System Ops</span>
                                            </div>
                                        </DropdownMenuItem>
                                    )}

                                    <DropdownMenuSeparator className="my-2 bg-slate-100" />
                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="rounded-2xl flex items-center gap-4 focus:bg-red-50 cursor-pointer p-4 text-red-600 transition-all"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-red-100/50 flex items-center justify-center">
                                            <LogOut className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col text-left">
                                            <span className="text-sm font-black leading-none mb-1">Secure Sign Out</span>
                                            <span className="text-[11px] text-red-400/70 font-medium">Clear session identity</span>
                                        </div>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigate(ROUTES.LOGIN)}
                                    className="text-slate-500 hover:text-navy-900 hover:bg-white/40 rounded-2xl h-11 px-6 font-bold text-[13px]"
                                >
                                    Log In
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => navigate(ROUTES.REGISTER)}
                                    className="bg-navy-900 hover:bg-navy-950 text-white shadow-[0_10px_30px_rgba(15,23,42,0.3)] rounded-2xl h-11 px-8 font-black text-[13px] tracking-wide"
                                >
                                    Join
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button Styling */}
                    <button
                        onClick={toggleMobileMenu}
                        className="lg:hidden w-11 h-11 flex items-center justify-center rounded-2xl hover:bg-emerald-50 transition-all border border-transparent hover:border-emerald-100/50"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6 text-navy-900" />
                        ) : (
                            <Menu className="w-6 h-6 text-navy-900" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu - Premium Experience */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden border-t border-emerald-100/50 bg-white/40 backdrop-blur-3xl overflow-hidden max-h-[calc(100dvh-6.5rem)]"
                        >
                            <div className="max-h-[calc(100dvh-7.5rem)] overflow-y-auto overscroll-contain p-5 sm:p-8 space-y-6 sm:space-y-8">
                                {/* Primary Actions */}
                                <div className="space-y-3">
                                    <p className="px-6 text-[10px] uppercase font-black tracking-[0.2em] text-slate-400">Navigation</p>
                                    {NAV_ITEMS.filter(item => ["Home", "Dashboard", "Timeline"].includes(item.label)).map((item) => {
                                        const Icon = iconMap[item.icon as keyof typeof iconMap];
                                        const active = isActive(item.href);
                                        return (
                                            <Link
                                                key={item.href}
                                                to={item.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={cn(
                                                    "flex items-center gap-4 px-5 sm:px-6 py-4 sm:py-5 rounded-[2rem] text-base sm:text-lg font-bold transition-all",
                                                    active
                                                        ? "bg-navy-900 text-white shadow-navy"
                                                        : "text-slate-500 hover:bg-emerald-50 hover:text-navy-900"
                                                )}
                                            >
                                                {Icon && <Icon className="w-6 h-6" />}
                                                {item.label}
                                            </Link>
                                        );
                                    })}
                                </div>

                                {/* Health Services */}
                                <div className="space-y-3">
                                    <p className="px-6 text-[10px] uppercase font-black tracking-[0.2em] text-slate-400">Health Services</p>
                                    <div className="grid grid-cols-1 gap-2">
                                        {NAV_ITEMS.filter(item => !["Home", "Dashboard", "Timeline"].includes(item.label)).map((item) => {
                                            const Icon = iconMap[item.icon as keyof typeof iconMap];
                                            const active = isActive(item.href);
                                            return (
                                                <Link
                                                    key={item.href}
                                                    to={item.href}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className={cn(
                                                        "flex items-center gap-4 px-5 sm:px-6 py-4 rounded-[1.5rem] transition-all",
                                                        active
                                                            ? "bg-emerald-50 text-emerald-900 border border-emerald-100"
                                                            : "text-slate-600 hover:bg-emerald-50/50"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0",
                                                        active ? "bg-emerald-200/50 text-emerald-600" : "bg-white/80 text-slate-400 shadow-sm"
                                                    )}>
                                                        {Icon && <Icon className="w-5 h-5 sm:w-6 sm:h-6" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm sm:text-base leading-tight">{item.label}</p>
                                                        <p className="text-[11px] text-slate-400 font-medium">
                                                            {item.label === "Symptom Analyzer" ? "AI Diagnostics" :
                                                                item.label === "AI Doctor Chat" ? "Consultant" :
                                                                    item.label === "Medicine Info" ? "Drug Info" : "Care Locator"}
                                                        </p>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="pt-8 mt-6 border-t border-emerald-100/50">
                                    {isAuthenticated && user ? (
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-5 px-6">
                                                <div className="w-16 h-16 rounded-[2rem] bg-navy-900 flex items-center justify-center text-emerald-400 border-2 border-emerald-100 shadow-navy">
                                                    <span className="text-xl font-black">
                                                        {getInitials(user.name)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-xl font-black text-navy-900 leading-none mb-2">
                                                        {user.name}
                                                    </p>
                                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none">
                                                        Elite Health Member
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                onClick={() => {
                                                    handleLogout();
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                variant="outline"
                                                className="w-full h-18 rounded-[2rem] border-red-100 text-red-600 font-black text-lg hover:bg-red-50 flex items-center justify-center gap-4 transition-all"
                                            >
                                                <LogOut className="w-6 h-6" />
                                                Secure Log Out
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-4">
                                            <Button
                                                className="h-14 sm:h-18 rounded-[2rem] bg-navy-900 text-white font-black text-sm sm:text-lg shadow-navy"
                                                onClick={() => {
                                                    navigate(ROUTES.REGISTER);
                                                    setIsMobileMenuOpen(false);
                                                }}
                                            >
                                                Get Elite Access
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="h-14 sm:h-18 rounded-[2rem] font-bold text-sm sm:text-base text-slate-500"
                                                onClick={() => {
                                                    navigate(ROUTES.LOGIN);
                                                    setIsMobileMenuOpen(false);
                                                }}
                                            >
                                                Existing Member Login
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </div>
    );
};

export default Navbar;