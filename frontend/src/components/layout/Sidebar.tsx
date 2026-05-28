import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Home,
    Stethoscope,
    MessageCircle,
    LayoutDashboard,
    Pill,
    MapPin,
    X,
    LogOut,
    User,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES, NAV_ITEMS } from "../../constants";
import { cn, getInitials } from "../../lib/utils";

const iconMap = {
    Home,
    Stethoscope,
    MessageCircle,
    LayoutDashboard,
    Pill,
    MapPin,
};

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const location = useLocation();
    const { user, isAuthenticated } = useAuthStore();
    const { handleLogout } = useAuth();

    const isActive = (href: string) => location.pathname === href;

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
                />
            )}

            {/* Sidebar */}
            <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: isOpen ? 0 : "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-elevated flex flex-col lg:hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-medical-border">
                    <Link
                        to={ROUTES.HOME}
                        onClick={onClose}
                        className="flex items-center gap-2"
                    >
                        <div className="w-9 h-9 rounded-xl bg-navy-900 flex items-center justify-center">
                            <Stethoscope className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span className="font-heading font-bold text-lg text-navy-900 leading-none block">
                                MediAssist
                            </span>
                            <span className="text-emerald-500 text-xs font-medium leading-none">
                                AI
                            </span>
                        </div>
                    </Link>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-medical-surface transition-colors"
                    >
                        <X className="w-5 h-5 text-medical-muted" />
                    </button>
                </div>

                {/* User Info */}
                {isAuthenticated && user && (
                    <div className="p-5 border-b border-medical-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-navy-900 flex items-center justify-center shrink-0">
                                <span className="text-white text-sm font-bold">
                                    {getInitials(user.name)}
                                </span>
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-medical-text truncate">
                                    {user.name}
                                </p>
                                <p className="text-xs text-medical-muted truncate">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {NAV_ITEMS.map((item) => {
                        const Icon = iconMap[item.icon as keyof typeof iconMap];
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                onClick={onClose}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                    isActive(item.href)
                                        ? "bg-navy-900 text-white shadow-navy"
                                        : "text-medical-muted hover:text-navy-900 hover:bg-medical-surface"
                                )}
                            >
                                {Icon && (
                                    <Icon
                                        className={cn(
                                            "w-5 h-5",
                                            isActive(item.href)
                                                ? "text-white"
                                                : "text-medical-muted"
                                        )}
                                    />
                                )}
                                {item.label}
                                {isActive(item.href) && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Actions */}
                <div className="p-4 border-t border-medical-border space-y-2">
                    {isAuthenticated ? (
                        <button
                            onClick={() => {
                                handleLogout();
                                onClose();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    ) : (
                        <div className="space-y-2">
                            <Link
                                to={ROUTES.LOGIN}
                                onClick={onClose}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border border-medical-border text-medical-text hover:bg-medical-surface transition-colors"
                            >
                                <User className="w-4 h-4" />
                                Login
                            </Link>
                            <Link
                                to={ROUTES.REGISTER}
                                onClick={onClose}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-navy-900 text-white hover:bg-navy-800 transition-colors"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </motion.aside>
        </>
    );
};

export default Sidebar;