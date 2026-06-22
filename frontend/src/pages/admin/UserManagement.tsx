import { useEffect, useState, useCallback } from "react";
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
    Trash2,
    AlertTriangle,
    X,
    Check,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { BACKEND_URL } from "../../constants";
import { cn } from "../../lib/utils";
import { toast } from "sonner";
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
    const { token, user: currentUser } = useAuthStore();
    const [data, setData] = useState<UserResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            const params = new URLSearchParams({
                page: String(currentPage),
                limit: "10",
                search: searchQuery,
            });
            if (selectedRole !== "all") params.set("role", selectedRole);

            const res = await fetch(`${BACKEND_URL}/api/admin/users?${params}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const response = await res.json();
            if (response.success) {
                setData(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
            toast.error("Failed to load users");
        } finally {
            setIsLoading(false);
        }
    }, [token, currentPage, selectedRole, searchQuery]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleRoleUpdate = async (userId: string, newRole: string) => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ role: newRole }),
            });
            const response = await res.json();
            if (response.success) {
                toast.success(`User role changed to ${newRole}`);
                fetchUsers();
            } else {
                toast.error(response.message || "Failed to update role");
            }
        } catch (error) {
            toast.error("Failed to update user role");
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            const res = await fetch(
                `${BACKEND_URL}/api/admin/users/${deleteTarget._id}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const response = await res.json();
            if (response.success) {
                toast.success(`${deleteTarget.name} deleted`);
                setDeleteTarget(null);
                fetchUsers();
            } else {
                toast.error(response.message || "Failed to delete user");
            }
        } catch {
            toast.error("Failed to delete user");
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading && !data) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-6" data-testid="user-loading">
                <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin" data-testid="user-loading-spinner" />
                <p className="font-mono text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse" data-testid="user-loading-text">
                    Loading users...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20" data-testid="user-management">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-slate-100 pb-10">
                <div>
                    <h1 className="text-4xl font-heading font-black text-navy-900 uppercase tracking-tighter" data-testid="user-heading">
                        User Management
                    </h1>
                    <div className="flex items-center gap-3 mt-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest" data-testid="user-total-count">
                            {data?.pagination.total || 0} users registered
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="p-6 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.01)] flex flex-col md:flex-row md:items-center gap-6" data-testid="user-filters">
                <div className="flex-1 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        data-testid="user-search-input"
                        className="w-full h-14 pl-14 pr-6 bg-slate-50/50 border border-slate-100 rounded-[1.25rem] focus:outline-none focus:border-emerald-500/50 transition-all font-heading font-bold text-navy-900 placeholder:text-slate-400 uppercase text-xs tracking-tight"
                    />
                </div>
                <div className="flex items-center gap-3 px-6 h-14 bg-slate-50/50 border border-slate-100 rounded-[1.25rem] shrink-0" data-testid="user-role-filter">
                    <Filter size={16} className="text-slate-300" />
                    <select
                        value={selectedRole}
                        onChange={(e) => {
                            setSelectedRole(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="bg-transparent text-navy-900 text-[10px] font-heading font-black focus:outline-none appearance-none cursor-pointer uppercase tracking-widest min-w-[120px]"
                    >
                        <option value="all">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                </div>
            </div>

            {/* User Table */}
            <div className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.01)]" data-testid="user-table-container">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[900px]" data-testid="user-table">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-10 py-8 text-[10px] font-mono font-black text-slate-400 uppercase tracking-[0.3em]">User</th>
                                <th className="px-10 py-8 text-[10px] font-mono font-black text-slate-400 uppercase tracking-[0.3em]">Role</th>
                                <th className="px-10 py-8 text-[10px] font-mono font-black text-slate-400 uppercase tracking-[0.3em]">Status</th>
                                <th className="px-10 py-8 text-[10px] font-mono font-black text-slate-400 uppercase tracking-[0.3em]">Joined</th>
                                <th className="px-10 py-8 text-[10px] font-mono font-black text-slate-400 uppercase tracking-[0.3em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <AnimatePresence mode="popLayout">
                                {data?.users.map((user, i) => (
                                    <motion.tr
                                        key={user._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        data-testid={`user-row-${i}`}
                                        className="hover:bg-slate-50/30 transition-colors group"
                                    >
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-xl bg-navy-900 flex items-center justify-center text-emerald-400 text-lg font-black shadow-lg group-hover:scale-105 transition-transform">
                                                    {user.name[0]?.toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[14px] font-heading font-black text-navy-900 uppercase tracking-tight leading-none mb-1.5" data-testid={`user-name-${i}`}>
                                                        {user.name}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-slate-400">
                                                        <Mail size={12} />
                                                        <span className="text-[10px] font-mono font-bold tracking-tight" data-testid={`user-email-${i}`}>{user.email}</span>
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
                                            )} data-testid={`user-role-${i}`}>
                                                {user.role === "admin" ? <Shield size={12} /> : <UserIcon size={12} />}
                                                {user.role}
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-2 h-2 rounded-full",
                                                    user.isVerified ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "bg-slate-300"
                                                )} />
                                                <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest" data-testid={`user-status-${i}`}>
                                                    {user.isVerified ? "Verified" : "Unverified"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Calendar size={14} className="text-slate-300" />
                                                <span className="text-[10px] font-mono font-bold uppercase tracking-widest" data-testid={`user-joined-${i}`}>
                                                    {new Date(user.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {currentUser?._id !== user._id && (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                handleRoleUpdate(
                                                                    user._id,
                                                                    user.role === "admin" ? "user" : "admin"
                                                                )
                                                            }
                                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-300 hover:text-emerald-500 hover:border-emerald-100 transition-all shadow-sm"
                                                            title={user.role === "admin" ? "Demote to user" : "Promote to admin"}
                                                            data-testid={`user-toggle-role-${i}`}
                                                        >
                                                            <Shield size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteTarget(user)}
                                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-300 hover:text-rose-500 hover:border-rose-100 transition-all shadow-sm"
                                                            title="Delete user"
                                                            data-testid={`user-delete-${i}`}
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </>
                                                )}
                                                {currentUser?._id === user._id && (
                                                    <span className="text-[9px] font-mono font-bold text-slate-300 uppercase tracking-widest px-2">You</span>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {(!data || data.users.length === 0) && (
                    <div className="p-20 text-center space-y-6" data-testid="user-empty-state">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center mx-auto text-slate-200">
                            <Users size={32} />
                        </div>
                        <p className="text-navy-900 font-heading font-black uppercase text-sm">No users found</p>
                        <p className="text-slate-400 text-xs">Try adjusting your search or filters.</p>
                    </div>
                )}

                {data && data.pagination.pages > 1 && (
                    <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between" data-testid="user-pagination">
                        <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest" data-testid="user-pagination-info">
                            Page {currentPage} of {data.pagination.pages}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                data-testid="user-prev-page"
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-navy-900 disabled:opacity-30 transition-all shadow-sm"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                disabled={currentPage === data.pagination.pages}
                                onClick={() => setCurrentPage((p) => Math.min(data.pagination.pages, p + 1))}
                                data-testid="user-next-page"
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-navy-900 disabled:opacity-30 transition-all shadow-sm"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteTarget && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-navy-900/50 backdrop-blur-sm z-50"
                            onClick={() => !isDeleting && setDeleteTarget(null)}
                            data-testid="delete-modal-backdrop"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-6"
                        >
                            <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl border border-slate-100 space-y-8" data-testid="delete-modal">
                                <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto">
                                    <AlertTriangle className="text-rose-500" size={32} />
                                </div>
                                <div className="text-center space-y-2">
                                    <h2 className="text-xl font-heading font-black text-navy-900 uppercase tracking-tight" data-testid="delete-modal-title">
                                        Delete User
                                    </h2>
                                    <p className="text-sm text-slate-500" data-testid="delete-modal-text">
                                        This will permanently delete{" "}
                                        <span className="font-bold text-navy-900">{deleteTarget.name}</span>{" "}
                                        and all associated data (symptoms, scans, reports, emergencies).
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setDeleteTarget(null)}
                                        disabled={isDeleting}
                                        data-testid="delete-modal-cancel"
                                        className="flex-1 py-4 rounded-2xl border border-slate-200 text-slate-500 font-heading font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <X size={16} />
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        data-testid="delete-modal-confirm"
                                        className="flex-1 py-4 rounded-2xl bg-rose-500 text-white font-heading font-black uppercase text-[10px] tracking-widest hover:bg-rose-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isDeleting ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Check size={16} />
                                                Delete
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserManagement;
