import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Users,
    Activity,
    FileText,
    ScanLine,
    TrendingUp,
    Cpu,
    ArrowUpRight,
    Shield,
    Clock,
    Zap,
    BrainCircuit
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
    growth: {
        newUsers30d: number;
    };
    ai: {
        totalAnalyses: number;
        avgResponseTime: string;
        accuracyRate: string;
        mostLognedSymptom: string;
    };
}

const AdminDashboard = () => {
    const { token } = useAuthStore();
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`${BACKEND_URL}/api/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setStats(data.data);
                } else {
                    setError(data.message || "Failed to retrieve system metrics");
                }
            } catch (error) {
                console.error("Failed to fetch admin stats:", error);
                setError("Connection to Command Center failed. Retrying...");
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, [token]);

    const kpiCards = [
        { label: "Personnel", value: stats?.counts.users || 0, icon: Users, color: "text-emerald-500", detail: "Active Registry" },
        { label: "Symptoms", value: stats?.counts.symptoms || 0, icon: Activity, color: "text-blue-500", detail: "Diagnostic Flow" },
        { label: "Intelligence", value: stats?.counts.ocrs || 0, icon: ScanLine, color: "text-indigo-500", detail: "Neural Scans" },
        { label: "Artifacts", value: stats?.counts.reports || 0, icon: FileText, color: "text-rose-500", detail: "Clinical Exports" },
    ];

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-6" data-testid="admin-loading">  // ADDED
            <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin shadow-sm" data-testid="admin-loading-spinner" />  // ADDED
            <p className="font-mono text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse" data-testid="admin-loading-text">Syncing Terminal Logic...</p>  // ADDED
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-6" data-testid="admin-error">  // ADDED
            <div className="text-rose-500 text-6xl">⚠️</div>
            <p className="font-mono text-sm font-bold text-rose-500">{error}</p>
        </div>
    );

    return (
        <div className="space-y-10 pb-20" data-testid="admin-dashboard">  // ADDED
            {/* Header Sector */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10" data-testid="admin-header">  // ADDED
                <div>
                    <h1 className="text-4xl font-heading font-black text-navy-900 uppercase tracking-tighter" data-testid="admin-heading">Command Center</h1>  // ADDED
                    <div className="flex items-center gap-3 mt-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.3em]" data-testid="admin-status">Operational Readiness: Optimal</p>  // ADDED
                    </div>
                </div>
                <div className="flex items-center gap-4" data-testid="admin-latency">  // ADDED
                    <div className="px-6 py-3 rounded-2xl bg-white border border-slate-100 flex flex-col items-end shadow-sm">
                        <span className="text-[9px] font-mono font-black text-slate-300 uppercase tracking-widest">Global_Latency</span>
                        <span className="text-sm font-mono font-bold text-navy-900" data-testid="admin-latency-value">{stats?.ai.avgResponseTime}</span>  // ADDED
                    </div>
                </div>
            </div>

            {/* KPI Registry: Constrained for density */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="admin-kpi-container">  // ADDED
                {kpiCards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        data-testid={`admin-kpi-${card.label.toLowerCase()}`}  // ADDED
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:border-emerald-200 transition-all duration-500 group shadow-[0_10px_40px_rgba(0,0,0,0.01)]"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 transition-colors group-hover:bg-white", card.color.replace('text', 'bg').replace('500', '50'))}>
                                <card.icon size={24} className={card.color} />
                            </div>
                            <ArrowUpRight className="text-slate-200 group-hover:text-emerald-500 transition-colors" size={20} />
                        </div>
                        <h3 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest mb-1" data-testid={`admin-kpi-label-${card.label.toLowerCase()}`}>{card.label}</h3>  // ADDED
                        <p className="text-4xl font-heading font-black text-navy-900 tracking-tighter uppercase leading-none" data-testid={`admin-kpi-value-${card.label.toLowerCase()}`}>{card.value}</p>  // ADDED
                        <p className="text-[10px] font-mono text-slate-400 uppercase mt-4 tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/30" />
                            {card.detail}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* 3-Column Tactical Console: THE KEY TO PREVENTING STRETCHING */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" data-testid="admin-console">  // ADDED

                {/* Sector 1: Intelligence Accuracy */}
                <section className="bg-white rounded-[3rem] border border-slate-100 p-8 flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.01)] relative overflow-hidden group" data-testid="admin-intelligence">  // ADDED
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200/50">
                            <BrainCircuit className="text-white" size={22} />
                        </div>
                        <div>
                            <h3 className="text-lg font-heading font-black text-navy-900 uppercase tracking-tight" data-testid="admin-intelligence-title">Intelligence</h3>  // ADDED
                            <p className="text-[9px] font-mono font-bold text-slate-400 uppercase">Verification Loop</p>
                        </div>
                    </div>

                    <div className="h-48 bg-slate-50/50 rounded-[2rem] border border-slate-100 flex items-end p-6 gap-2 relative overflow-hidden mb-8" data-testid="admin-intelligence-chart">  // ADDED
                        {[40, 70, 45, 90, 60, 85, 50, 95, 75, 40, 80].map((h, i) => (
                            <motion.div
                                key={i}
                                data-testid={`admin-chart-bar-${i}`}  // ADDED
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: i * 0.05 }}
                                className="flex-1 bg-gradient-to-t from-emerald-100 to-emerald-500 rounded-lg"
                            />
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100" data-testid="admin-confidence">  // ADDED
                            <p className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest mb-1">Confidence Rating</p>
                            <p className="text-2xl font-heading font-black text-emerald-600" data-testid="admin-confidence-value">{stats?.ai.accuracyRate}</p>  // ADDED
                        </div>
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100" data-testid="admin-most-logged">  // ADDED
                            <p className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest mb-1">Most Logged Hub</p>
                            <p className="text-lg font-heading font-black text-navy-900 uppercase truncate" data-testid="admin-most-logged-value">{stats?.ai.mostLognedSymptom || "N/A"}</p>  // ADDED
                        </div>
                    </div>
                </section>

                {/* Sector 2: Operational Threads */}
                <section className="bg-white rounded-[3rem] border border-slate-100 p-8 flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.01)]" data-testid="admin-operations">  // ADDED
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-navy-900 flex items-center justify-center shadow-lg">
                            <Zap className="text-blue-400" size={22} />
                        </div>
                        <div>
                            <h3 className="text-lg font-heading font-black text-navy-900 uppercase tracking-tight" data-testid="admin-operations-title">Active Logic</h3>  // ADDED
                            <p className="text-[9px] font-mono font-bold text-slate-400 uppercase">Processing Pipelines</p>
                        </div>
                    </div>

                    <div className="flex-1 space-y-8" data-testid="admin-threads">  // ADDED
                        {[
                            { label: "Radiology Synthesis", progress: 85, color: "bg-emerald-500" },
                            { label: "Symptom Correlation", progress: 62, color: "bg-blue-500" },
                            { label: "Registry Syncing", progress: 91, color: "bg-indigo-500" },
                            { label: "Artifact Exporting", progress: 34, color: "bg-slate-300" },
                        ].map((thread, i) => (
                            <div key={i} data-testid={`admin-thread-${i}`}>  // ADDED
                                <div className="flex justify-between items-center mb-2 px-1">
                                    <span className="text-[10px] font-heading font-bold text-navy-900 uppercase tracking-tight" data-testid={`admin-thread-label-${i}`}>{thread.label}</span>  // ADDED
                                    <span className="text-[9px] font-mono font-black text-slate-400" data-testid={`admin-thread-progress-${i}`}>{thread.progress}%</span>  // ADDED
                                </div>
                                <div className="h-3 bg-slate-50 rounded-full border border-slate-100 p-0.5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${thread.progress}%` }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                        className={cn("h-full rounded-full shadow-sm", thread.color)}
                                        data-testid={`admin-thread-bar-${i}`}  // ADDED
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Sector 3: System Pulse Log */}
                <section className="bg-white rounded-[3rem] border border-slate-100 p-8 flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.01)] min-h-[500px]" data-testid="admin-pulse">  // ADDED
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                            <TrendingUp className="text-navy-900" size={22} />
                        </div>
                        <div>
                            <h3 className="text-lg font-heading font-black text-navy-900 uppercase tracking-tight" data-testid="admin-pulse-title">System Pulse</h3>  // ADDED
                            <p className="text-[9px] font-mono font-bold text-slate-400 uppercase">Real-time Activity</p>
                        </div>
                    </div>

                    <div className="flex-1 space-y-4" data-testid="admin-pulse-events">  // ADDED
                        {[
                            { label: "Emergency Activated", time: "2m ago", color: "text-rose-500", bg: "bg-rose-50" },
                            { label: "Intelligence Export", time: "14m ago", color: "text-emerald-500", bg: "bg-emerald-50" },
                            { label: "New Node Link", time: "1h ago", color: "text-blue-500", bg: "bg-blue-50" },
                            { label: "Secure Scan Done", time: "3h ago", color: "text-indigo-500", bg: "bg-indigo-50" },
                        ].map((event, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all group cursor-pointer border border-transparent hover:border-slate-100" data-testid={`admin-pulse-event-${i}`}>  // ADDED
                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm", event.bg, event.color)}>
                                    <div className="w-2 h-2 rounded-full bg-current" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[12px] font-heading font-black text-navy-900 uppercase tracking-tight truncate" data-testid={`admin-pulse-event-label-${i}`}>{event.label}</p>  // ADDED
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Clock size={10} />
                                        <span className="text-[9px] font-mono font-bold uppercase" data-testid={`admin-pulse-event-time-${i}`}>{event.time}</span>  // ADDED
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        data-testid="admin-initialize-btn"  // ADDED
                        className="mt-10 py-5 w-full rounded-2xl bg-navy-900 hover:bg-emerald-600 text-white font-heading font-black uppercase text-[10px] tracking-[0.3em] transition-all duration-500 shadow-xl shadow-navy-900/10 active:scale-95 flex items-center justify-center gap-3"
                    >
                        <Cpu size={16} />
                        Initialize Terminal
                    </button>
                </section>

            </div>
        </div>
    );
};

export default AdminDashboard;