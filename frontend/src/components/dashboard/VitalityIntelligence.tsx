import { motion } from "framer-motion";
import {
    Activity,
    ShieldCheck,
    Zap,
    Brain,
    Heart,
    Wind,
    Dna
} from "lucide-react";
import type { TimelineEntry } from "../../types";

interface VitalityIntelligenceProps {
    recentEntries: TimelineEntry[];
}

const VitalityGauge = ({ score }: { score: number }) => {
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="relative w-64 h-64 flex items-center justify-center" data-testid="vitality-gauge">  // ADDED
            {/* Spinning Outer Ring */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-emerald-500/10 rounded-full"
            />

            {/* Pulsing Glow */}
            <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-8 bg-emerald-500/20 blur-3xl rounded-full"
            />

            {/* SVG Gauge */}
            <svg className="w-full h-full transform -rotate-90">
                {/* Background Track */}
                <circle
                    cx="128"
                    cy="128"
                    r={radius}
                    className="stroke-navy-900/5"
                    strokeWidth="12"
                    fill="none"
                />
                {/* Progress Bar */}
                <motion.circle
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    cx="128"
                    cy="128"
                    r={radius}
                    stroke="url(#vitality-gradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    fill="none"
                    style={{ strokeDasharray: circumference }}
                    data-testid="vitality-gauge-progress"  // ADDED
                />
                <defs>
                    <linearGradient id="vitality-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#34D399" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Score Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-6xl font-black text-navy-900 tracking-tighter"
                    data-testid="vitality-score"  // ADDED
                >
                    {score}<span className="text-emerald-500">%</span>
                </motion.span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1" data-testid="vitality-label">  // ADDED
                    System Vitality
                </span>
            </div>

            {/* Scanning Ticker Decorative */}
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border border-emerald-500/20 rounded-full border-t-transparent border-l-transparent"
            />
        </div>
    );
};

const SystemStatus = ({ icon: Icon, label, status, color }: any) => (
    <div className="flex flex-col gap-3 p-4 rounded-3xl bg-white/40 border border-navy-900/5 group hover:bg-white transition-all duration-500" data-testid={`system-status-${label.toLowerCase()}`}>  // ADDED
        <div className="flex items-center justify-between">
            <div className={`p-2 rounded-xl bg-${color}-500/10`}>
                <Icon size={16} className={`text-${color}-500`} />
            </div>
            <div className="flex gap-0.5">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className={`w-1 h-3 rounded-full ${status === 'Optimal' ? 'bg-emerald-500' : 'bg-slate-100'}`} data-testid={`system-status-dot-${label.toLowerCase()}-${i}`} />  // ADDED
                ))}
            </div>
        </div>
        <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5" data-testid={`system-status-label-${label.toLowerCase()}`}>  // ADDED
                {label}
            </p>
            <p className="text-xs font-black text-navy-900" data-testid={`system-status-value-${label.toLowerCase()}`}>  // ADDED
                {status}
            </p>
        </div>
    </div>
);

const VitalityIntelligence = ({ recentEntries }: VitalityIntelligenceProps) => {
    // Calculate Score Algorithm
    // Default 100, drops based on recent high-severity symptoms
    let score = 100;
    if (recentEntries.length > 0) {
        const recentSeverityEffect = recentEntries.slice(0, 5).reduce((acc, curr) => acc + (curr.severity), 0);
        score = Math.max(70, 100 - Math.floor(recentSeverityEffect / 2));
    }

    return (
        <motion.div
            data-testid="vitality-intelligence"  // ADDED
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-10 relative overflow-hidden group"
        >
            {/* Background Bio-Texture Deco */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                {/* Left: Gauge Display */}
                <div className="lg:col-span-4 flex flex-col items-center justify-center border-r border-navy-900/5">
                    <VitalityGauge score={score} />
                    <div className="mt-8 flex items-center gap-4 bg-navy-900/5 px-6 py-2 rounded-full border border-navy-900/5" data-testid="vitality-status-badge">  // ADDED
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-navy-900" data-testid="vitality-status-text">  // ADDED
                            Neural Synthesis Active
                        </span>
                    </div>
                </div>

                {/* Right: Synthesis Details */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <ShieldCheck size={18} className="text-emerald-500" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500" data-testid="vitality-protocol">  // ADDED
                                    Diagnostic Protocol v4.0
                                </span>
                            </div>
                            <h2 className="text-4xl font-black text-navy-900 tracking-tighter leading-none" data-testid="vitality-title">  // ADDED
                                SYSTEM INTEGRITY MONITOR<span className="text-emerald-500">.</span>
                            </h2>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Health Signature</span>
                            <span className="text-sm font-black text-navy-900 tracking-tight" data-testid="vitality-signature">  // ADDED
                                SIG-{Math.random().toString(36).substring(7).toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="vitality-system-statuses">  // ADDED
                        <SystemStatus
                            icon={Brain}
                            label="Neurological"
                            status="Optimal"
                            color="emerald"
                        />
                        <SystemStatus
                            icon={Heart}
                            label="Cardiovascular"
                            status="Optimal"
                            color="emerald"
                        />
                        <SystemStatus
                            icon={Wind}
                            label="Respiratory"
                            status="Optimal"
                            color="emerald"
                        />
                        <SystemStatus
                            icon={Dna}
                            label="Biological"
                            status="Synthesized"
                            color="emerald"
                        />
                    </div>

                    <div className="p-6 rounded-[2rem] bg-navy-900 text-white relative overflow-hidden shadow-navy group-hover:scale-[1.02] transition-transform duration-500" data-testid="vitality-ai-insight">  // ADDED
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Zap size={80} />
                        </div>
                        <div className="flex items-start gap-6 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                                <Activity className="text-emerald-400" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs font-black uppercase tracking-widest text-emerald-400" data-testid="vitality-insight-label">  // ADDED
                                    AI Intelligence Insight
                                </p>
                                <p className="text-sm font-medium leading-relaxed opacity-90" data-testid="vitality-insight-text">  // ADDED
                                    Current physiological analysis suggests a high degree of system stability. No acute patterns of clinical concern identified in recent chronological logs.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default VitalityIntelligence;