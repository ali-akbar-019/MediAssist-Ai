import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Users,
    Activity,
    FileText,
    ScanLine,
    TrendingUp,
    ArrowUpRight,
    Clock,
    BrainCircuit,
    UserPlus,
    AlertTriangle,
    ShieldCheck,
    Search,
    FileSearch,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { BACKEND_URL } from "../../constants";
import { cn } from "../../lib/utils";

interface Stats {
    counts: {
        users: number;
        symptoms: number;
        ocrs: number;
        reports: number;
    };
    growth: { newUsers30d: number };
    ai: {
        totalAnalyses: number;
        avgResponseTime: string;
        accuracyRate: string;
        mostLoggedSymptom: string;
        avgSeverity: number;
    };
}

interface ActivityItem {
    type: "user_register" | "symptom_logged" | "emergency" | "ocr_scan";
    label: string;
    detail?: string;
    time: string;
}

const ACTIVITY_ICONS: Record<string, { icon: any; color: string; bg: string }> = {
    user_register: { icon: UserPlus, color: "text-emerald-500", bg: "bg-emerald-50" },
    symptom_logged: { icon: Search, color: "text-blue-500", bg: "bg-blue-50" },
    emergency: { icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-50" },
    ocr_scan: { icon: FileSearch, color: "text-indigo-500", bg: "bg-indigo-50" },
};

const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
};

const AdminDashboard = () => {
    const { token } = useAuthStore();
    const [stats, setStats] = useState<Stats | null>(null);
    const [activity, setActivity] = useState<ActivityItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [statsRes, activityRes] = await Promise.all([
                    fetch(`${BACKEND_URL}/api/admin/stats`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${BACKEND_URL}/api/admin/activity`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                const statsData = await statsRes.json();
                if (statsData.success) setStats(statsData.data);

                const activityData = await activityRes.json();
                if (activityData.success) setActivity(activityData.data.activity);
            } catch {
                setError("Failed to load dashboard data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [token]);

    const kpiCards = [
        { label: "Users", value: stats?.counts.users || 0, icon: Users, color: "text-emerald-500", detail: "Registered" },
        { label: "Symptoms", value: stats?.counts.symptoms || 0, icon: Activity, color: "text-blue-500", detail: "Analyzed" },
        { label: "Documents", value: stats?.counts.ocrs || 0, icon: ScanLine, color: "text-indigo-500", detail: "Scanned" },
        { label: "Reports", value: stats?.counts.reports || 0, icon: FileText, color: "text-rose-500", detail: "Generated" },
    ];

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
                <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin" />
                <p className="font-mono text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
                <p className="font-mono text-sm font-bold text-rose-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10">
                <div>
                    <h1 className="text-4xl font-heading font-black text-navy-900 uppercase tracking-tighter">Dashboard</h1>
                    <div className="flex items-center gap-3 mt-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.3em]">System Online</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-6 py-3 rounded-2xl bg-white border border-slate-100 flex flex-col items-end shadow-sm">
                        <span className="text-[9px] font-mono font-black text-slate-300 uppercase tracking-widest">AI Latency</span>
                        <span className="text-sm font-mono font-bold text-navy-900">{stats?.ai.avgResponseTime || "—"}</span>
                    </div>
                    <div className="px-6 py-3 rounded-2xl bg-white border border-slate-100 flex flex-col items-end shadow-sm">
                        <span className="text-[9px] font-mono font-black text-slate-300 uppercase tracking-widest">New Users (30d)</span>
                        <span className="text-sm font-mono font-bold text-navy-900">+{stats?.growth.newUsers30d || 0}</span>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiCards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:border-emerald-200 transition-all duration-500 group shadow-[0_10px_40px_rgba(0,0,0,0.01)]"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 transition-colors group-hover:bg-white",
                                card.color.replace("text", "bg").replace("500", "50")
                            )}>
                                <card.icon size={24} className={card.color} />
                            </div>
                            <ArrowUpRight className="text-slate-200 group-hover:text-emerald-500 transition-colors" size={20} />
                        </div>
                        <h3 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</h3>
                        <p className="text-4xl font-heading font-black text-navy-900 tracking-tighter uppercase leading-none">{card.value}</p>
                        <p className="text-[10px] font-mono text-slate-400 uppercase mt-4 tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/30" />
                            {card.detail}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Two-column console */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* AI Intelligence */}
                <section className="bg-white rounded-[3rem] border border-slate-100 p-8 flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.01)]">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200/50">
                            <BrainCircuit className="text-white" size={22} />
                        </div>
                        <div>
                            <h3 className="text-lg font-heading font-black text-navy-900 uppercase tracking-tight">AI Intelligence</h3>
                            <p className="text-[9px] font-mono font-bold text-slate-400 uppercase">Analysis Summary</p>
                        </div>
                    </div>
                    <div className="space-y-4 flex-1">
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                            <p className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest mb-1">Total Analyses</p>
                            <p className="text-2xl font-heading font-black text-navy-900">{stats?.ai.totalAnalyses || 0}</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                            <p className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest mb-1">Avg Severity</p>
                            <p className="text-2xl font-heading font-black text-emerald-600">{stats?.ai.avgSeverity || 0}/10</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                            <p className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest mb-1">Most Logged Symptom</p>
                            <p className="text-lg font-heading font-black text-navy-900 uppercase truncate">{stats?.ai.mostLoggedSymptom || "N/A"}</p>
                        </div>
                    </div>
                </section>

                {/* Recent Activity */}
                <section className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 p-8 flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.01)]">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-navy-900 flex items-center justify-center shadow-lg">
                            <TrendingUp className="text-blue-400" size={22} />
                        </div>
                        <div>
                            <h3 className="text-lg font-heading font-black text-navy-900 uppercase tracking-tight">Recent Activity</h3>
                            <p className="text-[9px] font-mono font-bold text-slate-400 uppercase">Live Feed</p>
                        </div>
                    </div>
                    <div className="flex-1 space-y-4">
                        {activity.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-48 text-slate-300 gap-4">
                                <Clock size={32} />
                                <p className="text-[10px] font-mono font-black uppercase tracking-widest">No recent activity</p>
                            </div>
                        )}
                        {activity.map((event, i) => {
                            const meta = ACTIVITY_ICONS[event.type] || ACTIVITY_ICONS.symptom_logged;
                            const Icon = meta.icon;
                            return (
                                <div
                                    key={i}
                                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all group cursor-pointer border border-transparent hover:border-slate-100"
                                >
                                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm", meta.bg, meta.color)}>
                                        <Icon size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[12px] font-heading font-black text-navy-900 uppercase tracking-tight truncate">
                                            {event.label}
                                        </p>
                                        {event.detail && (
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <span className="text-[9px] font-mono font-bold uppercase">{event.detail}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400 shrink-0">
                                        <Clock size={10} />
                                        <span className="text-[9px] font-mono font-bold uppercase">{timeAgo(event.time)}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;
