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
        <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-medical-border">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        to={ROUTES.HOME}
                        className="flex items-center gap-2 group"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="w-9 h-9 rounded-xl bg-navy-900 flex items-center justify-center shadow-navy"
                        >
                            <Stethoscope className="w-5 h-5 text-white" />
                        </motion.div>
                        <div className="flex flex-col">
                            <span className="text-navy-900 font-heading font-bold text-lg leading-none">
                                MediAssist
                            </span>
                            <span className="text-emerald-500 text-xs font-medium leading-none">
                                AI
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1">
                        {NAV_ITEMS.map((item) => {
                            const Icon = iconMap[item.icon as keyof typeof iconMap];
                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                        isActive(item.href)
                                            ? "bg-navy-900 text-white"
                                            : "text-medical-muted hover:text-navy-900 hover:bg-medical-surface"
                                    )}
                                >
                                    {Icon && <Icon className="w-4 h-4" />}
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Desktop Auth */}
                    <div className="hidden lg:flex items-center gap-3">
                        {isAuthenticated && user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-medical-surface transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">
                                                {getInitials(user.name)}
                                            </span>
                                        </div>
                                        <span className="text-sm font-medium text-medical-text">
                                            {user.name.split(" ")[0]}
                                        </span>
                                        <ChevronDown className="w-4 h-4 text-medical-muted" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem
                                        onClick={() => navigate(ROUTES.DASHBOARD)}
                                        className="cursor-pointer"
                                    >
                                        <User className="w-4 h-4 mr-2" />
                                        Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="cursor-pointer text-red-500 focus:text-red-500"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigate(ROUTES.LOGIN)}
                                    className="text-medical-muted hover:text-navy-900"
                                >
                                    Login
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => navigate(ROUTES.REGISTER)}
                                    className="bg-navy-900 hover:bg-navy-800 text-white"
                                >
                                    Get Started
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="lg:hidden p-2 rounded-lg hover:bg-medical-surface transition-colors"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-5 h-5 text-medical-text" />
                        ) : (
                            <Menu className="w-5 h-5 text-medical-text" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="lg:hidden border-t border-medical-border bg-white"
                    >
                        <div className="container mx-auto px-4 py-4 space-y-1">
                            {NAV_ITEMS.map((item) => {
                                const Icon = iconMap[item.icon as keyof typeof iconMap];
                                return (
                                    <Link
                                        key={item.href}
                                        to={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                                            isActive(item.href)
                                                ? "bg-navy-900 text-white"
                                                : "text-medical-muted hover:text-navy-900 hover:bg-medical-surface"
                                        )}
                                    >
                                        {Icon && <Icon className="w-4 h-4" />}
                                        {item.label}
                                    </Link>
                                );
                            })}

                            <div className="pt-3 border-t border-medical-border">
                                {isAuthenticated && user ? (
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3 px-4 py-3">
                                            <div className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center">
                                                <span className="text-white text-xs font-bold">
                                                    {getInitials(user.name)}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-medical-text">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-medical-muted">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start"
                                            onClick={() => {
                                                navigate(ROUTES.LOGIN);
                                                setIsMobileMenuOpen(false);
                                            }}
                                        >
                                            Login
                                        </Button>
                                        <Button
                                            className="w-full bg-navy-900 hover:bg-navy-800 text-white"
                                            onClick={() => {
                                                navigate(ROUTES.REGISTER);
                                                setIsMobileMenuOpen(false);
                                            }}
                                        >
                                            Get Started
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;