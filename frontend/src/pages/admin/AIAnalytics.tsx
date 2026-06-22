import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    BrainCircuit,
    Activity,
    Search,
    FileSearch,
    AlertTriangle,
    TrendingUp,
    Clock,
    Cpu,
    Zap,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { BACKEND_URL } from "../../constants";
import { cn } from "../../lib/utils";

interface ActivityItem {
    type: "symptom_logged" | "ocr_scan" | "user_register" | "emergency";
    label: string;
    detail?: string;
    time: string;
}

interface Config {
    environment: string;
    version: string;
    ai: { model: string; totalAnalyses: number };
    counts: Record<string, number>;
}

const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
};

const AIAnalytics = () => {
    const { token } = useAuthStore();
    const [analysisActivity, setAnalysisActivity] = useState<ActivityItem[]>([]);
    const [config, setConfig] = useState<Config | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [activityRes, configRes] = await Promise.all([
                    fetch(`${BACKEND_URL}/api/admin/activity`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${BACKEND_URL}/api/admin/config`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                const activityData = await activityRes.json();
                if (activityData.success) {
                    const filtered = activityData.data.activity.filter(
                        (a: ActivityItem) =>
                            a.type === "symptom_logged" || a.type === "ocr_scan"
                    );
                    setAnalysisActivity(filtered);
                }

                const configData = await configRes.json();
                if (configData.success) setConfig(configData.data);
            } catch {
                // silent
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [token]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
                <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin" />
                <p className="font-mono text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Loading AI analytics...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="border-b border-slate-100 pb-10">
                <h1 className="text-4xl font-heading font-black text-navy-900 uppercase tracking-tighter">AI Analytics</h1>
                <div className="flex items-center gap-3 mt-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                        Model: {config?.ai.model || "—"}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* System Info */}
                <section className="bg-white rounded-[3rem] border border-slate-100 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.01)]">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200/50">
                            <Cpu className="text-white" size={22} />
                        </div>
                        <div>
                            <h3 className="text-lg font-heading font-black text-navy-900 uppercase tracking-tight">System</h3>
                            <p className="text-[9px] font-mono font-bold text-slate-400 uppercase">Configuration</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                            <p className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest mb-1">Environment</p>
                            <p className="text-sm font-heading font-black text-navy-900 uppercase">{config?.environment || "—"}</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                            <p className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest mb-1">Version</p>
                            <p className="text-sm font-heading font-black text-navy-900">{config?.version || "—"}</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                            <p className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest mb-1">AI Model</p>
                            <p className="text-sm font-heading font-black text-navy-900 break-all">{config?.ai.model || "—"}</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                            <p className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest mb-1">Total Analyses</p>
                            <p className="text-2xl font-heading font-black text-navy-900">{config?.ai.totalAnalyses || 0}</p>
                        </div>
                    </div>
                </section>

                {/* Analysis Activity Feed */}
                <section className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.01)]">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200/50">
                            <Zap className="text-white" size={22} />
                        </div>
                        <div>
                            <h3 className="text-lg font-heading font-black text-navy-900 uppercase tracking-tight">Analysis History</h3>
                            <p className="text-[9px] font-mono font-bold text-slate-400 uppercase">Recent AI Operations</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {analysisActivity.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-48 text-slate-300 gap-4">
                                <BrainCircuit size={32} />
                                <p className="text-[10px] font-mono font-black uppercase tracking-widest">No analyses yet</p>
                            </div>
                        )}
                        {analysisActivity.map((event, i) => {
                            const isSymptom = event.type === "symptom_logged";
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                                >
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                                        isSymptom ? "bg-blue-50 text-blue-500" : "bg-indigo-50 text-indigo-500"
                                    )}>
                                        {isSymptom ? <Search size={18} /> : <FileSearch size={18} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[12px] font-heading font-black text-navy-900 uppercase tracking-tight truncate">
                                            {event.label}
                                        </p>
                                        {event.detail && (
                                            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">{event.detail}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400 shrink-0">
                                        <Clock size={10} />
                                        <span className="text-[9px] font-mono font-bold uppercase">{timeAgo(event.time)}</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AIAnalytics;
