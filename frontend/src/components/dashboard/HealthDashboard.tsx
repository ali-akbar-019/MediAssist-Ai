import { useEffect } from "react";
import { motion } from "framer-motion";
import {
    Activity,
    FileText,
    Clock,
    TrendingUp,
    Stethoscope,
    ArrowRight,
    Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useSymptoms } from "../../hooks/useSymptoms";
import HistoryCard from "./HistoryCard";
import StatsChart from "./StatsChart";
import { ROUTES } from "../../constants";
import { formatRelativeTime } from "../../lib/utils";

const StatCard = ({
    icon: Icon,
    label,
    value,
    color,
    delay,
}: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    color: string;
    delay: number;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel p-6 group relative overflow-hidden"
    >
        {/* Holographic Gradient Overlay */}
        <div 
            className="absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-700"
            style={{ backgroundColor: color }}
        />
        
        <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                    Metric Protocol
                </span>
                <span className="text-sm font-bold text-navy-900 leading-tight">
                    {label}
                </span>
            </div>
            <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110 shadow-sm"
                style={{ 
                    backgroundColor: `${color}08`,
                    borderColor: `${color}20`
                }}
            >
                <Icon className="w-6 h-6" style={{ color }} />
            </div>
        </div>

        <div className="flex items-end justify-between relative z-10">
            <p className="text-4xl font-black text-navy-900 tracking-tighter">
                {value}
            </p>
            <div className="flex items-center gap-1 opacity-40">
                <div className="w-1 h-3 rounded-full bg-slate-200" />
                <div className="w-1 h-3 rounded-full bg-slate-200" />
                <div className="w-1 h-3 rounded-full bg-emerald-500" />
            </div>
        </div>

        {/* Tactical Border Bottom */}
        <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-slate-200 to-transparent w-full opacity-50" />
    </motion.div>
);

const HealthDashboard = () => {
    const { user } = useAuthStore();
    const {
        symptoms,
        isLoadingSymptoms,
        stats,
        isLoadingStats,
        isGeneratingReport,
        handleGetSymptoms,
        handleGetStats,
        handleDeleteSymptom,
        handleDownloadReport,
    } = useSymptoms();

    useEffect(() => {
        handleGetSymptoms(1, 6);
        handleGetStats();
    }, []);

    return (
        <div className="space-y-12">
            {/* Command Actions Bar */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-between p-2 pl-8 pr-2 rounded-[2rem] glass-panel border-white/60 shadow-luxe"
            >
                <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-navy-900">
                        Operational Status: Clinical Optimal
                    </span>
                </div>
                <Link
                    to={ROUTES.ANALYZER}
                    className="flex items-center gap-3 px-8 py-4 bg-navy-900 text-white rounded-[1.4rem] text-sm font-black uppercase tracking-widest hover:bg-navy-950 transition-all shadow-navy group overflow-hidden relative"
                >
                    <div className="absolute inset-0 bg-emerald-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-10" />
                    <Stethoscope className="w-5 h-5 text-emerald-400" />
                    Initiate New Analysis
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </motion.div>

            {/* Stat Console */}
            {isLoadingStats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="glass-panel p-6 h-40 animate-pulse relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                            <div className="h-2 bg-slate-100 rounded w-1/3 mb-4" />
                            <div className="h-10 bg-slate-50 rounded w-1/2" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={Activity}
                        label="Total Analyses"
                        value={stats?.totalSymptoms ?? 0}
                        color="#1E3A5F"
                        delay={0}
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="This Month"
                        value={
                            symptoms.filter((s) => {
                                const date = new Date(s.createdAt);
                                const now = new Date();
                                return (
                                    date.getMonth() === now.getMonth() &&
                                    date.getFullYear() === now.getFullYear()
                                );
                            }).length
                        }
                        color="#10B981"
                        delay={0.1}
                    />
                    <StatCard
                        icon={FileText}
                        label="Reports Generated"
                        value={stats?.totalSymptoms ?? 0}
                        color="#F59E0B"
                        delay={0.2}
                    />
                    <StatCard
                        icon={Clock}
                        label="Last Analysis"
                        value={
                            symptoms.length > 0
                                ? formatRelativeTime(symptoms[0].createdAt)
                                : "None yet"
                        }
                        color="#7C3AED"
                        delay={0.3}
                    />
                </div>
            )}

            {/* Charts Intelligence Zone */}
            {stats && !isLoadingStats && (
                <div className="relative group">
                    <div className="absolute -inset-4 bg-emerald-500/5 blur-2xl rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
                    <StatsChart stats={stats} />
                </div>
            )}

            {/* Diagnostic Chronology */}
            <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-navy-900/5 pb-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-1">
                            Chronological Data
                        </span>
                        <h2 className="text-3xl font-black text-navy-900 tracking-tighter">
                            DIAGNOSTIC HISTORY<span className="text-emerald-500">.</span>
                        </h2>
                    </div>
                    <div className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Total Records: {symptoms.length}
                        <div className="w-8 h-[1px] bg-slate-200 group-hover:w-12 group-hover:bg-navy-900 transition-all" />
                    </div>
                </div>

                {isLoadingSymptoms ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Synchronizing Clinical Data...
                        </span>
                    </div>
                ) : symptoms.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-center glass-panel"
                    >
                        <div className="w-20 h-20 rounded-[2rem] bg-navy-900/5 flex items-center justify-center mb-6">
                            <Stethoscope className="w-10 h-10 text-navy-900" />
                        </div>
                        <h3 className="text-xl font-black text-navy-900 tracking-tight mb-2">
                            No active records identified
                        </h3>
                        <p className="text-slate-500 text-sm mb-8 max-w-xs font-medium">
                            Initiate your first analysis to populate the diagnostic matrix.
                        </p>
                        <Link
                            to={ROUTES.ANALYZER}
                            className="px-8 py-3 bg-navy-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-navy-950 transition-all shadow-navy"
                        >
                            Start Analysis Protocol
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {symptoms.map((symptom, index) => (
                            <HistoryCard
                                key={symptom._id}
                                symptom={symptom}
                                index={index}
                                onDelete={handleDeleteSymptom}
                                onDownloadReport={handleDownloadReport}
                                isGeneratingReport={isGeneratingReport}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* System Profiles */}
            {user && (
                <div className="pt-8 border-t border-navy-900/5">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <h2 className="text-[10px] font-black tracking-[0.4em] text-navy-900 uppercase">
                            Health Matrix Architecture
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: "Age Index", value: user.age ?? "N/A" },
                            { label: "Gender Model", value: user.gender ?? "N/A" },
                            { label: "Biological Type", value: user.bloodGroup ?? "N/A" },
                            {
                                label: "Sensitivity Log",
                                value: user.allergies?.length ? user.allergies.join(", ") : "None",
                            },
                        ].map((item) => (
                            <div key={item.label} className="p-4 rounded-3xl border border-navy-900/5 bg-white/40">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                                    {item.label}
                                </p>
                                <p className="text-sm font-black text-navy-900 capitalize tracking-tight">
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HealthDashboard;