import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    Activity,
    Settings,
    ShieldCheck,
    LogOut,
    Home,
    Menu,
    X,
    Cpu,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { ROUTES } from "../../constants";
import { useAuthStore } from "../../store/authStore";
import { cn } from "../../lib/utils";

interface AdminLayoutProps {
    children: React.ReactNode;
}

const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: ROUTES.ADMIN_DASHBOARD },
    { label: "Users", icon: Users, href: ROUTES.ADMIN_USERS },
    { label: "AI Analytics", icon: Activity, href: ROUTES.ADMIN_AI },
    { label: "Configuration", icon: Settings, href: ROUTES.ADMIN_CONFIG },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const location = useLocation();
    const { logout, user } = useAuthStore();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const sidebarWidth = isCollapsed ? "w-24" : "w-72";

    const SidebarContent = ({ collapsed = false }: { collapsed?: boolean }) => (
        <div className="flex flex-col h-full py-8">
            {/* Brand */}
            <div className={cn(
                "flex mb-12",
                collapsed ? "justify-center px-4" : "px-6 items-center gap-4"
            )}>
                <div className="w-12 h-12 rounded-2xl bg-navy-900 flex items-center justify-center shadow-lg shrink-0">
                    <ShieldCheck className="text-emerald-400" size={24} />
                </div>
                {!collapsed && (
                    <div className="min-w-0">
                        <h1 className="text-lg font-heading font-black text-navy-900 uppercase tracking-tighter leading-none">
                            Admin <span className="text-emerald-500">Panel</span>
                        </h1>
                        <p className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-1">MediAssist AI</p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            to={item.href}
                            className={cn(
                                "flex items-center gap-4 p-4 rounded-[1.25rem] transition-all duration-300 group relative",
                                isActive
                                    ? "bg-navy-900 text-white shadow-xl shadow-navy-900/20"
                                    : "text-slate-400 hover:bg-slate-50 hover:text-navy-900"
                            )}
                            title={collapsed ? item.label : undefined}
                        >
                            <item.icon size={22} className={cn("shrink-0", isActive ? "text-emerald-400" : "group-hover:text-emerald-500")} />
                            {!collapsed && (
                                <span className="font-heading font-bold uppercase tracking-tight text-[11px] whitespace-nowrap">
                                    {item.label}
                                </span>
                            )}
                            {isActive && collapsed && (
                                <div className="absolute left-0 w-1 h-6 bg-emerald-500 rounded-r-full" />
                            )}
                        </Link>
                    );
                })}

                <div className="h-px bg-slate-100 my-8 mx-4" />

                <Link
                    to={ROUTES.HOME}
                    className={cn(
                        "flex items-center gap-4 p-4 rounded-[1.25rem] text-slate-400 hover:bg-slate-50 hover:text-navy-900 transition-all group",
                        collapsed && "justify-center"
                    )}
                    title={collapsed ? "Main Site" : undefined}
                >
                    <Home size={22} className="shrink-0" />
                    {!collapsed && (
                        <span className="font-heading font-bold uppercase tracking-tight text-[11px]">
                            Main Site
                        </span>
                    )}
                </Link>
            </nav>

            {/* User Session */}
            <div className="px-4 mt-auto">
                <div className={cn(
                    "p-4 rounded-[2rem] bg-slate-50 border border-slate-100 overflow-hidden",
                    collapsed && "flex flex-col items-center"
                )}>
                    <div className={cn(
                        "flex items-center gap-4 mb-6",
                        collapsed && "mb-6 flex-col px-1"
                    )}>
                        <div className="w-10 h-10 rounded-xl bg-navy-800 flex items-center justify-center text-emerald-400 font-black shadow-inner shrink-0 leading-none text-xs">
                            {user?.name?.[0]?.toUpperCase() || "A"}
                        </div>
                        {!collapsed && (
                            <div className="min-w-0">
                                <p className="text-[11px] font-heading font-black text-navy-900 uppercase tracking-tight truncate">{user?.name}</p>
                                <p className="text-[8px] font-mono text-emerald-600 font-bold uppercase">Admin</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={logout}
                        className={cn(
                            "w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white hover:bg-rose-50 text-slate-300 hover:text-rose-500 transition-all border border-slate-200 hover:border-rose-100 font-heading font-black uppercase text-[9px] tracking-widest group",
                            collapsed ? "px-0" : "px-4"
                        )}
                        title={collapsed ? "Logout" : undefined}
                    >
                        <LogOut size={14} />
                        {!collapsed && <span>Logout</span>}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex overflow-hidden font-sans text-slate-900">
            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    "hidden lg:flex flex-col border-r border-slate-100 bg-white relative z-30 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[20px_0_40px_rgba(0,0,0,0.01)]",
                    sidebarWidth
                )}
            >
                <SidebarContent collapsed={isCollapsed} />
                {/* Toggle button */}
                <button
                    onClick={() => setIsCollapsed((c) => !c)}
                    className="absolute -right-4 top-16 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-400 hover:text-navy-900 hover:border-emerald-200 transition-all z-10"
                    title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </aside>

            {/* Mobile Trigger */}
            <div className="lg:hidden fixed top-6 left-6 z-40">
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="w-14 h-14 rounded-2xl bg-navy-900 text-white flex items-center justify-center shadow-2xl scale-90 active:scale-75 transition-transform"
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 bg-navy-900/60 backdrop-blur-md z-[60] lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed inset-y-0 left-0 w-80 bg-white z-[70] lg:hidden shadow-2xl"
                        >
                            <SidebarContent />
                            <button
                                onClick={() => setIsMobileOpen(false)}
                                className="absolute top-8 right-8 w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center"
                            >
                                <X size={20} className="text-navy-900" />
                            </button>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Background gradients */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/[0.03] blur-[150px] rounded-full pointer-events-none -mr-40 -mt-40" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/[0.03] blur-[120px] rounded-full pointer-events-none -ml-40 -mb-40" />

                {/* Content viewport */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-12 mt-0 relative z-10">
                    <div className="max-w-[1400px] mx-auto w-full">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                        >
                            {children}
                        </motion.div>
                    </div>
                </div>

                {/* Bottom status */}
                <div className="fixed bottom-10 right-10 z-20 hidden xl:flex items-center gap-4">
                    <div className="px-6 py-3 rounded-full bg-white border border-slate-100 shadow-2xl flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-[0.2em]">System: Online</span>
                    </div>
                    <button className="w-14 h-14 rounded-2xl bg-navy-900 text-emerald-400 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all group">
                        <Cpu size={24} className="group-hover:rotate-12 transition-transform" />
                    </button>
                </div>
            </main>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(100,116,139,0.08); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(16,185,129,0.2); }
            `}</style>
        </div>
    );
};

export default AdminLayout;
