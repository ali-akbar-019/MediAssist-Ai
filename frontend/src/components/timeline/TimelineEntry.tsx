import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin,
    Clock,
    ChevronDown,
    ChevronUp,
    AlertTriangle,
    CheckCircle,
    Activity,
    Home,
    Stethoscope,
    Zap,
} from "lucide-react";
import type { TimelineEntry as TimelineEntryType } from "../../types";
import { formatRelativeTime, formatDate, getSeverityFromScore } from "../../lib/utils";
import { cn } from "../../lib/utils";

interface TimelineEntryProps {
    entry: TimelineEntryType;
    index: number;
    isLast: boolean;
}

const TimelineEntry = ({ entry, index, isLast }: TimelineEntryProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    // Enforce severity mapping from score to fix inconsistency bug
    const effectiveSeverity = getSeverityFromScore(entry.severity);

    const severityColors = {
        mild: { dot: "#10B981", line: "#10B981" },
        moderate: { dot: "#F59E0B", line: "#F59E0B" },
        severe: { dot: "#EF4444", line: "#EF4444" },
        emergency: { dot: "#7C3AED", line: "#7C3AED" },
    };

    const dotColor = severityColors[effectiveSeverity].dot;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.06 }}
            className="flex gap-4 sm:gap-6"
        >
            {/* Timeline Line + Dot */}
            <div className="flex flex-col items-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.06 + 0.2, type: "spring", stiffness: 200 }}
                    className="w-5 h-5 rounded-full border-4 border-white shadow-md shrink-0 mt-2 z-10 relative"
                    style={{ backgroundColor: dotColor }}
                >
                    <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: dotColor }} />
                </motion.div>
                {!isLast && (
                    <div
                        className="w-1 flex-1 -mt-1 opacity-20"
                        style={{ backgroundColor: "var(--color-navy-900)" }}
                    />
                )}
            </div>

            {/* Entry Card */}
            <div className="flex-1 pb-10">
                <div
                    className={cn(
                        "glass-panel rounded-3xl overflow-hidden transition-all duration-500 border-white/20 shadow-luxe hover:shadow-2xl hover:translate-x-1",
                        isExpanded && "ring-2 ring-emerald-500/20"
                    )}
                >
                    {/* Card Header */}
                    <button
                        onClick={() => setIsExpanded((prev) => !prev)}
                        className="w-full flex items-start gap-4 p-5 text-left hover:bg-white/40 transition-colors group"
                    >
                        {/* Body Part Icon */}
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:rotate-6 transition-transform duration-500"
                            style={{ backgroundColor: `${dotColor}10` }}
                        >
                            <MapPin size={24} style={{ color: dotColor }} />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-black text-lg text-navy-900 leading-none">
                                            {entry.bodyPart}
                                        </h3>
                                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tighter bg-slate-100 text-slate-400">
                                            {entry.bodySide}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="flex items-center gap-1">
                                            <Clock size={12} className="text-slate-400" />
                                            <span className="text-xs font-bold text-slate-400">
                                                {formatRelativeTime(entry.createdAt)}
                                            </span>
                                        </div>
                                        <span className="text-xs text-slate-300">•</span>
                                        <span className="text-xs font-bold text-slate-400">
                                            {formatDate(entry.createdAt)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mt-2 sm:mt-0">
                                    <div className={cn(
                                        "px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-sm",
                                        "bg-white border"
                                    )} style={{ borderColor: `${dotColor}20`, color: dotColor }}>
                                        <Zap size={12} fill={dotColor} />
                                        {effectiveSeverity}
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-2xl font-black text-navy-900" style={{ color: dotColor }}>
                                            {entry.severity}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-300 uppercase leading-none">Intensity</span>
                                    </div>
                                </div>
                            </div>

                            {/* Symptom Tags */}
                            <div className="flex flex-wrap gap-2 mt-4">
                                {entry.symptoms.slice(0, 4).map((symptom) => (
                                    <span
                                        key={symptom}
                                        className="px-3 py-1.5 rounded-xl text-xs font-bold border border-white/50 bg-white/30 backdrop-blur-sm text-slate-600 shadow-sm"
                                    >
                                        {symptom}
                                    </span>
                                ))}
                                {entry.symptoms.length > 4 && (
                                    <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-navy-900 text-white shadow-navy">
                                        +{entry.symptoms.length - 4}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="mt-2 shrink-0">
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                                isExpanded ? "bg-navy-900 text-white" : "bg-slate-100 text-slate-400"
                            )}>
                                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                        </div>
                    </button>

                    {/* Expanded Details */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                            >
                                <div className="p-6 pt-2 space-y-6">
                                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-100 to-transparent mb-6" />
                                    
                                    {/* Pain Details */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {[
                                            { label: "Pain Type", value: entry.painType, icon: <Activity size={12} /> },
                                            { label: "Duration", value: `${entry.duration} ${entry.durationUnit}`, icon: <Clock size={12} /> },
                                            { label: "Triggers", value: entry.worseAt, icon: <Zap size={12} /> },
                                        ].map((item) => (
                                            <div
                                                key={item.label}
                                                className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 flex flex-col gap-1"
                                            >
                                                <div className="flex items-center gap-1.5 opacity-40">
                                                    {item.icon}
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                                                </div>
                                                <p className="text-sm font-black text-navy-900 capitalize italic">
                                                    "{item.value}"
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* AI Analysis Section */}
                                    {entry.aiAnalysis && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                                                <h4 className="text-[11px] font-black text-navy-900 uppercase tracking-[0.2em]">Diagnostic Intelligence</h4>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Top Condition */}
                                                {entry.aiAnalysis.possibleConditions.length > 0 && (
                                                    <div className="p-5 rounded-3xl bg-emerald-50/30 border border-emerald-100/50 relative overflow-hidden group">
                                                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl rounded-full -mr-12 -mt-12" />
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                                <Activity size={16} />
                                                            </div>
                                                            <span className="text-[11px] font-black text-emerald-700 uppercase tracking-wider">High Probability</span>
                                                        </div>
                                                        <h5 className="font-black text-navy-900 mb-1">{entry.aiAnalysis.possibleConditions[0].name}</h5>
                                                        <p className="text-xs text-slate-500 leading-relaxed">
                                                            {entry.aiAnalysis.possibleConditions[0].description}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Recommendation */}
                                                <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm relative overflow-hidden" style={{ borderColor: `${dotColor}20`, backgroundColor: `${dotColor}05` }}>
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${dotColor}20`, color: dotColor }}>
                                                            <Stethoscope size={16} />
                                                        </div>
                                                        <span className="text-[11px] font-black uppercase tracking-wider" style={{ color: dotColor }}>Clinical Guidance</span>
                                                    </div>
                                                    <p className="text-xs text-navy-900/80 font-bold leading-relaxed italic">
                                                        {entry.aiAnalysis.recommendation}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Home Remedies & Precautions */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {entry.aiAnalysis.homeRemedies.length > 0 && (
                                                    <div className="p-5 rounded-3xl border border-slate-100 bg-slate-50/20">
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <Home size={14} className="text-slate-400" />
                                                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Home Care Protocol</span>
                                                        </div>
                                                        <ul className="space-y-3">
                                                            {entry.aiAnalysis.homeRemedies.slice(0, 3).map((remedy, i) => (
                                                                <li key={i} className="flex items-start gap-3 text-xs text-slate-600 font-medium">
                                                                    <div className="w-5 h-5 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                                                                        <CheckCircle size={10} className="text-emerald-500" />
                                                                    </div>
                                                                    {remedy}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                <div className="p-5 rounded-3xl bg-amber-50/30 border border-amber-100/50">
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <AlertTriangle size={14} className="text-amber-500" />
                                                        <span className="text-[11px] font-black text-amber-700 uppercase tracking-wider">Critical Precautions</span>
                                                    </div>
                                                    <p className="text-xs text-amber-900/70 font-bold leading-relaxed px-1">
                                                        {entry.aiAnalysis.whenToSeeDoctor}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Additional Notes */}
                                    {entry.additionalNotes && (
                                        <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-navy relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                                <Zap size={40} />
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-emerald-400">Personal Observations</p>
                                            <p className="text-xs leading-relaxed font-medium text-slate-200">
                                                {entry.additionalNotes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default TimelineEntry;