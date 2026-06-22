import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Settings,
    Shield,
    Database,
    Cpu,
    Users,
    Activity,
    ScanLine,
    FileText,
    RefreshCw,
    CheckCircle2,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { BACKEND_URL } from "../../constants";
import { cn } from "../../lib/utils";
import { toast } from "sonner";

interface Config {
    environment: string;
    version: string;
    ai: { model: string; totalAnalyses: number };
    counts: Record<string, number>;
}

const ConfigPage = () => {
    const { token } = useAuthStore();
    const [config, setConfig] = useState<Config | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchConfig = async (showToast = false) => {
        try {
            if (showToast) setIsRefreshing(true);
            const res = await fetch(`${BACKEND_URL}/api/admin/config`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setConfig(data.data);
                if (showToast) toast.success("Configuration refreshed");
            }
        } catch {
            toast.error("Failed to load configuration");
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, [token]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
                <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin" />
                <p className="font-mono text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Loading configuration...</p>
            </div>
        );
    }

    const modules = [
        { label: "Users", value: config?.counts.users || 0, icon: Users, color: "text-emerald-500" },
        { label: "Symptoms", value: config?.counts.symptoms || 0, icon: Activity, color: "text-blue-500" },
        { label: "Emergencies", value: config?.counts.emergencies || 0, icon: Shield, color: "text-rose-500" },
        { label: "Documents", value: config?.counts.ocrs || 0, icon: ScanLine, color: "text-indigo-500" },
        { label: "Reports", value: config?.counts.reports || 0, icon: FileText, color: "text-amber-500" },
    ];

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10">
                <div>
                    <h1 className="text-4xl font-heading font-black text-navy-900 uppercase tracking-tighter">Configuration</h1>
                    <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-2">
                        System overview and module counts
                    </p>
                </div>
                <button
                    onClick={() => fetchConfig(true)}
                    disabled={isRefreshing}
                    className="flex items-center gap-3 px-8 h-14 rounded-2xl bg-navy-900 text-white hover:bg-emerald-600 transition-all font-heading font-black uppercase text-[10px] tracking-widest shadow-xl shadow-navy-900/10 active:scale-95 disabled:opacity-50"
                >
                    <RefreshCw size={16} className={cn(isRefreshing && "animate-spin")} />
                    Refresh
                </button>
            </div>

            {/* System Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section className="bg-white rounded-[3rem] border border-slate-100 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.01)]">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-navy-900 flex items-center justify-center shadow-lg">
                            <Database className="text-emerald-400" size={22} />
                        </div>
                        <div>
                            <h3 className="text-lg font-heading font-black text-navy-900 uppercase tracking-tight">System</h3>
                            <p className="text-[9px] font-mono font-bold text-slate-400 uppercase">Environment</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100">
                            <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">Environment</span>
                            <span className="text-sm font-heading font-black text-navy-900 uppercase">{config?.environment || "—"}</span>
                        </div>
                        <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100">
                            <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">Version</span>
                            <span className="text-sm font-heading font-black text-navy-900">{config?.version || "—"}</span>
                        </div>
                        <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100">
                            <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">AI Model</span>
                            <span className="text-sm font-heading font-black text-navy-900 text-right break-all max-w-[60%]">{config?.ai.model || "—"}</span>
                        </div>
                        <div className="flex items-center justify-between p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                            <span className="text-[10px] font-mono font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle2 size={14} />
                                Status
                            </span>
                            <span className="text-sm font-heading font-black text-emerald-600">Operational</span>
                        </div>
                    </div>
                </section>

                {/* Module Counts */}
                <section className="bg-white rounded-[3rem] border border-slate-100 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.01)]">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200/50">
                            <Cpu className="text-white" size={22} />
                        </div>
                        <div>
                            <h3 className="text-lg font-heading font-black text-navy-900 uppercase tracking-tight">Modules</h3>
                            <p className="text-[9px] font-mono font-bold text-slate-400 uppercase">Data Counts</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {modules.map((mod) => (
                            <div
                                key={mod.label}
                                className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm", mod.color)}>
                                        <mod.icon size={18} />
                                    </div>
                                    <span className="text-[11px] font-heading font-black text-navy-900 uppercase tracking-tight">{mod.label}</span>
                                </div>
                                <span className="text-2xl font-heading font-black text-navy-900">{mod.value}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ConfigPage;
