import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    Search,
    Filter,
    Shield,
    User as UserIcon,
    Calendar,
    Mail,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Download,
    UserPlus,
    Clock
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { BACKEND_URL } from "../../constants";
import { cn } from "../../lib/utils";
import type { User } from "../../types";

interface UserResponse {
    users: User[];
    pagination: {
        total: number;
        page: number;
        pages: number;
    };
}

const UserManagement = () => {
    const { token } = useAuthStore();
    const [data, setData] = useState<UserResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`${BACKEND_URL}/api/admin/users?page=${currentPage}&search=${searchQuery}&role=${selectedRole === "all" ? "" : selectedRole}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const response = await res.json();
            if (response.success) {
                setData(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [token, currentPage, selectedRole]);

    // Search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1);
            fetchUsers();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleRoleUpdate = async (userId: string, newRole: string) => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/users/${userId}/role`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ role: newRole })
            });
            const response = await res.json();
            if (response.success) {
                fetchUsers(); // Refresh for accuracy
            }
        } catch (error) {
            console.error("Failed to update user role:", error);
        }
    };

    if (isLoading && !data) return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-6" data-testid="user-loading">  // ADDED
            <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin" data-testid="user-loading-spinner" />  // ADDED
            <p className="font-mono text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse" data-testid="user-loading-text">Scanning Personnel Database...</p>  // ADDED
        </div>
    );

    return (
        <div className="space-y-10 pb-20" data-testid="user-management">  // ADDED
            {/* Command Header & Actions */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-slate-100 pb-10" data-testid="user-header">  // ADDED
                <div>
                    <h1 className="text-4xl font-heading font-black text-navy-900 uppercase tracking-tighter" data-testid="user-heading">Personnel Registry</h1>  // ADDED
                    <div className="flex items-center gap-3 mt-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest" data-testid="user-total-count">  // ADDED
                            Authorized Records: {data?.pagination.total || 0} Entities Found
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <button
                        data-testid="user-export-btn"  // ADDED
                        className="flex items-center gap-3 px-6 h-14 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-navy-900 hover:border-emerald-200 transition-all font-heading font-black uppercase text-[10px] tracking-widest shadow-sm group"
                    >
                        <Download size={16} />
                        Export Registry
                    </button>
                    <button
                        data-testid="user-enroll-btn"  // ADDED
                        className="flex items-center gap-3 px-8 h-14 rounded-2xl bg-navy-900 text-white hover:bg-emerald-600 transition-all font-heading font-black uppercase text-[10px] tracking-widest shadow-xl shadow-navy-900/10 active:scale-95"
                    >
                        <UserPlus size={16} />
                        Enroll New Personnel
                    </button>
                </div>
            </div>

            {/* Tactical Filtering Console */}
            <div className="p-6 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.01)] flex flex-col md:flex-row md:items-center gap-6" data-testid="user-filters">  // ADDED
                <div className="flex-1 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search Identity (Name, Email, UID)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        data-testid="user-search-input"  // ADDED
                        className="w-full h-14 pl-14 pr-6 bg-slate-50/50 border border-slate-100 rounded-[1.25rem] focus:outline-none focus:border-emerald-500/50 transition-all font-heading font-bold text-navy-900 placeholder:text-slate-400 uppercase text-xs tracking-tight"
                    />
                </div>

                <div className="flex items-center gap-3 px-6 h-14 bg-slate-50/50 border border-slate-100 rounded-[1.25rem] shrink-0">
                    <Filter size={16} className="text-slate-300" />
                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        data-testid="user-role-filter"  // ADDED
                        className="bg-transparent text-navy-900 text-[10px] font-heading font-black focus:outline-none appearance-none cursor-pointer uppercase tracking-widest min-w-[120px]"
                    >
                        <option value="all">Global Access</option>
                        <option value="admin">Privileged_Admin</option>
                        <option value="user">Standard_User</option>
                    </select>
                </div>
            </div>

            {/* Registry Visualizer (Table) */}
            <div className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.01)]" data-testid="user-table-container">  // ADDED
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[1000px]" data-testid="user-table">  // ADDED
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-10 py-8 text-[10px] font-mono font-black text-slate-400 uppercase tracking-[0.3em]" data-testid="user-th-identity">Identity Node</th>  // ADDED
                                <th className="px-10 py-8 text-[10px] font-mono font-black text-slate-400 uppercase tracking-[0.3em]" data-testid="user-th-role">Access Level</th>  // ADDED
                                <th className="px-10 py-8 text-[10px] font-mono font-black text-slate-400 uppercase tracking-[0.3em]" data-testid="user-th-enrolled">Enrolled On</th>  // ADDED
                                <th className="px-10 py-8 text-[10px] font-mono font-black text-slate-400 uppercase tracking-[0.3em]" data-testid="user-th-pulse">Security Pulse</th>  // ADDED
                                <th className="px-10 py-8 text-[10px] font-mono font-black text-slate-400 uppercase tracking-[0.3em] text-right" data-testid="user-th-ops">Operations</th>  // ADDED
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <AnimatePresence mode="popLayout">
                                {data?.users.map((user, i) => (
                                    <motion.tr
                                        key={user._id}
                                        data-testid={`user-row-${i}`}  // ADDED
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="hover:bg-slate-50/30 transition-colors group"
                                    >
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-xl bg-navy-900 flex items-center justify-center text-emerald-400 text-lg font-black shadow-lg group-hover:scale-105 transition-transform duration-500" data-testid={`user-avatar-${i}`}>  // ADDED
                                                    {user.name[0]?.toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[14px] font-heading font-black text-navy-900 uppercase tracking-tight leading-none mb-1.5" data-testid={`user-name-${i}`}>{user.name}</p>  // ADDED
                                                    <div className="flex items-center gap-2 text-slate-400">
                                                        <Mail size={12} />
                                                        <span className="text-[10px] font-mono font-bold tracking-tight" data-testid={`user-email-${i}`}>{user.email}</span>  // ADDED
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className={cn(
                                                "inline-flex items-center gap-2.5 px-4 py-2 rounded-xl border font-mono text-[9px] font-black uppercase tracking-widest transition-all",
                                                user.role === "admin"
                                                    ? "bg-rose-50 border-rose-100 text-rose-600 shadow-sm"
                                                    : "bg-emerald-50 border-emerald-100 text-emerald-600 shadow-sm"
                                            )} data-testid={`user-role-badge-${i}`}>  // ADDED
                                                {user.role === "admin" ? <Shield size={12} /> : <UserIcon size={12} />}
                                                {user.role}
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Calendar size={14} className="text-slate-300" />
                                                <span className="text-[10px] font-mono font-bold uppercase tracking-widest" data-testid={`user-created-${i}`}>  // ADDED
                                                    {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] group-hover:animate-ping" />
                                                <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest" data-testid={`user-status-${i}`}>Linked</span>  // ADDED
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleRoleUpdate(user._id, user.role === 'admin' ? 'user' : 'admin')}
                                                    data-testid={`user-role-toggle-${i}`}  // ADDED
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-300 hover:text-emerald-500 hover:border-emerald-100 transition-all shadow-sm group/btn"
                                                >
                                                    <Shield size={18} />
                                                </button>
                                                <button
                                                    data-testid={`user-more-btn-${i}`}  // ADDED
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-200 hover:text-navy-900 hover:border-slate-300 transition-all shadow-sm"
                                                >
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {(!data || data.users.length === 0) && (
                    <div className="p-20 text-center space-y-6" data-testid="user-empty-state">  // ADDED
                        <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center mx-auto text-slate-200">
                            <Users size={32} />
                        </div>
                        <div className="max-w-xs mx-auto">
                            <p className="text-navy-900 font-heading font-black uppercase text-sm mb-1">Sector Empty</p>
                            <p className="text-slate-400 text-xs">No personnel records found matching current telemetry.</p>
                        </div>
                    </div>
                )}

                {/* Tactical Paging */}
                {data && data.pagination.pages > 1 && (
                    <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between" data-testid="user-pagination">  // ADDED
                        <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest" data-testid="user-pagination-info">  // ADDED
                            Sector {currentPage} of {data.pagination.pages}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                data-testid="user-prev-page"  // ADDED
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-navy-900 disabled:opacity-30 transition-all shadow-sm"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                disabled={currentPage === data.pagination.pages}
                                onClick={() => setCurrentPage(p => Math.min(data.pagination.pages, p + 1))}
                                data-testid="user-next-page"  // ADDED
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-navy-900 disabled:opacity-30 transition-all shadow-sm"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;