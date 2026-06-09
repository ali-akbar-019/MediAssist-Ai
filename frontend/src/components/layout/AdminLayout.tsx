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
} from "lucide-react";
import { ROUTES } from "../../constants";
import { useAuthStore } from "../../store/authStore";
import { cn } from "../../lib/utils";

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const location = useLocation();
    const { logout, user } = useAuthStore();
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const menuItems = [
        { label: "Command", icon: LayoutDashboard, href: ROUTES.ADMIN_DASHBOARD },
        { label: "Personnel", icon: Users, href: ROUTES.ADMIN_USERS },
        { label: "Intelligence", icon: Activity, href: ROUTES.ADMIN_AI },
        { label: "Configuration", icon: Settings, href: "#" },
    ];

    const SidebarContent = ({ collapsed = false }: { collapsed?: boolean }) => (
        <div className="flex flex-col h-full py-8">
            {/* Brand - Integrated */}
            <div className="px-6 mb-12 flex items-center justify-center lg:justify-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-navy-900 flex items-center justify-center shadow-lg shrink-0">
                    <ShieldCheck className="text-emerald-400" size={24} />
                </div>
                {!collapsed && (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }}
                        className="min-w-0"
                    >
                        <h1 className="text-lg font-heading font-black text-navy-900 uppercase tracking-tighter leading-none">
                            Tactical <span className="text-emerald-500">AI</span>
                        </h1>
                        <p className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-1">Admin_Module_V2</p>
                    </motion.div>
                )}
            </div>

            {/* Tactical Navigation Registry */}
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
                        >
                            <item.icon size={22} className={cn("shrink-0", isActive ? "text-emerald-400" : "group-hover:text-emerald-500")} />
                            {!collapsed && (
                                <motion.span 
                                    initial={{ opacity: 0, x: -10 }} 
                                    animate={{ opacity: 1, x: 0 }}
                                    className="font-heading font-bold uppercase tracking-tight text-[11px] whitespace-nowrap"
                                >
                                    {item.label}
                                </motion.span>
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
                    className="flex items-center gap-4 p-4 rounded-[1.25rem] text-slate-400 hover:bg-slate-50 hover:text-navy-900 transition-all group"
                >
                    <Home size={22} className="shrink-0" />
                    {!collapsed && (
                        <motion.span 
                            initial={{ opacity: 0, x: -10 }} 
                            animate={{ opacity: 1, x: 0 }}
                            className="font-heading font-bold uppercase tracking-tight text-[11px]"
                        >
                            Node Exit
                        </motion.span>
                    )}
                </Link>
            </nav>

            {/* Session Monitor Section */}
            <div className="px-4 mt-auto">
                <div className={cn(
                    "p-4 rounded-[2rem] bg-slate-50 border border-slate-100 transition-all duration-500 overflow-hidden",
                    collapsed ? "items-center" : "items-start"
                )}>
                    <div className="flex items-center gap-4 px-1 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-navy-800 flex items-center justify-center text-emerald-400 font-black shadow-inner shrink-0 leading-none text-xs">
                            {user?.name[0]?.toUpperCase()}
                        </div>
                        {!collapsed && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-w-0">
                                <p className="text-[11px] font-heading font-black text-navy-900 uppercase tracking-tight truncate">{user?.name}</p>
                                <p className="text-[8px] font-mono text-emerald-600 font-bold uppercase">Authorized</p>
                            </motion.div>
                        )}
                    </div>
                    <button
                        onClick={logout}
                        className={cn(
                            "w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white hover:bg-rose-50 text-slate-300 hover:text-rose-500 transition-all border border-slate-200 hover:border-rose-100 font-heading font-black uppercase text-[9px] tracking-widest group",
                            collapsed ? "px-0" : "px-4"
                        )}
                    >
                        <LogOut size={14} />
                        {!collapsed && <span>Terminate</span>}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex overflow-hidden font-sans text-slate-900">
            {/* Desktop Tactical Dock */}
            <aside 
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={cn(
                    "hidden lg:flex flex-col border-r border-slate-100 bg-white relative z-30 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[20px_0_40px_rgba(0,0,0,0.01)]",
                    isHovered ? "w-72" : "w-24"
                )}
            >
                <SidebarContent collapsed={!isHovered} />
            </aside>

            {/* Mobile Navigation Trigger */}
            <div className="lg:hidden fixed top-6 left-6 z-40">
                <button 
                    onClick={() => setIsMobileSidebarOpen(true)}
                    className="w-14 h-14 rounded-2xl bg-navy-900 text-white flex items-center justify-center shadow-2xl scale-90 active:scale-75 transition-transform"
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileSidebarOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileSidebarOpen(false)}
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
                                onClick={() => setIsMobileSidebarOpen(false)}
                                className="absolute top-8 right-8 w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center"
                            >
                                <X size={20} className="text-navy-900" />
                            </button>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Operational Workspace */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Visual Depth Gradients */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/[0.03] blur-[150px] rounded-full pointer-events-none -mr-40 -mt-40" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/[0.03] blur-[120px] rounded-full pointer-events-none -ml-40 -mb-40" />

                {/* Content Viewport */}
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

                {/* Floating System Status (Integrated Terminal Trigger) */}
                <div className="fixed bottom-10 right-10 z-20 hidden xl:flex items-center gap-4">
                   <div className="px-6 py-3 rounded-full bg-white border border-slate-100 shadow-2xl flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-[0.2em]">System_Pulse: Stable</span>
                   </div>
                   <button className="w-14 h-14 rounded-2xl bg-navy-900 text-emerald-400 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all group">
                        <Cpu size={24} className="group-hover:rotate-12 transition-transform" />
                   </button>
                </div>
            </main>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(100, 116, 139, 0.08);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(16, 185, 129, 0.2);
                }
            ` }} />
        </div>
    );
};

export default AdminLayout;
