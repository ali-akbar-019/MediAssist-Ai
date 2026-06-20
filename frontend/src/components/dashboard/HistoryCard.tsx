import { motion } from "framer-motion";
import { Trash2, FileText, Clock, MapPin, Loader2 } from "lucide-react";
import type { Symptom } from "../../types";
import { formatRelativeTime, getSeverityInfo } from "../../lib/utils";
import { cn } from "../../lib/utils";

interface HistoryCardProps {
    symptom: Symptom;
    index: number;
    onDelete: (id: string) => void;
    onDownloadReport: (id: string) => void;
    isGeneratingReport: boolean;
}

const HistoryCard = ({
    symptom,
    index,
    onDelete,
    onDownloadReport,
    isGeneratingReport,
}: HistoryCardProps) => {
    const severityInfo = symptom.aiAnalysis
        ? getSeverityInfo(symptom.aiAnalysis.severity)
        : null;

    return (
        <motion.div
            data-testid={`history-card-${index}`}  // ADDED
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.8,
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1]
            }}
            className="glass-panel p-6 space-y-5 group hover:border-emerald-500/30 transition-all duration-500"
        >
            {/* Tactical Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-navy-900 border border-white/10 flex items-center justify-center shrink-0 shadow-navy overflow-hidden relative">
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-emerald-500 opacity-20" />
                        <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1 block" data-testid={`history-card-type-${index}`}>  // ADDED
                            Diagnostic File
                        </span>
                        <h3 className="text-base font-black text-navy-900 tracking-tight uppercase" data-testid={`history-card-bodypart-${index}`}>  // ADDED
                            {symptom.bodyPart}
                        </h3>
                    </div>
                </div>

                {severityInfo && (
                    <div className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                        symptom.aiAnalysis?.severity === "mild" ? "bg-emerald-50 border-emerald-200 text-emerald-600" :
                            symptom.aiAnalysis?.severity === "moderate" ? "bg-amber-50 border-amber-200 text-amber-600" :
                                "bg-rose-50 border-rose-200 text-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.2)]"
                    )} data-testid={`history-card-severity-${index}`}>  // ADDED
                        {severityInfo.label}
                    </div>
                )}
            </div>

            {/* Physiological Data Tags */}
            <div className="flex flex-wrap gap-2" data-testid={`history-card-symptoms-${index}`}>  // ADDED
                {symptom.symptoms.slice(0, 3).map((s) => (
                    <span
                        key={s}
                        data-testid={`history-card-symptom-${index}-${s}`}  // ADDED
                        className="px-3 py-1 rounded-lg bg-navy-900/5 border border-navy-900/5 text-[10px] font-bold text-navy-900 uppercase tracking-tighter"
                    >
                        {s}
                    </span>
                ))}
                {symptom.symptoms.length > 3 && (
                    <span className="px-3 py-1 rounded-lg bg-navy-900/5 border border-navy-900/5 text-[10px] font-bold text-slate-400" data-testid={`history-card-more-${index}`}>  // ADDED
                        +{symptom.symptoms.length - 3} MORE
                    </span>
                )}
            </div>

            {/* Metric Matrix */}
            <div className="grid grid-cols-3 gap-3" data-testid={`history-card-metrics-${index}`}>  // ADDED
                {[
                    { label: "Type", value: symptom.painType, testId: "type" },
                    { label: "Intensity", value: `${symptom.severity}/10`, testId: "intensity" },
                    { label: "Span", value: `${symptom.duration}${symptom.durationUnit[0]}`, testId: "span" }
                ].map((stat) => (
                    <div key={stat.label} className="p-2.5 rounded-[1.2rem] bg-navy-900/5 flex flex-col items-center justify-center border border-transparent hover:border-navy-900/10 transition-colors">
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</span>
                        <span className="text-[11px] font-black text-navy-900 uppercase" data-testid={`history-card-metric-${index}-${stat.testId}`}>  // ADDED
                            {stat.value}
                        </span>
                    </div>
                ))}
            </div>

            {/* AI Insight Bridge */}
            {symptom.aiAnalysis && (
                <div className="p-4 rounded-2xl bg-white/40 border border-white/60 relative overflow-hidden" data-testid={`history-card-ai-${index}`}>  // ADDED
                    <div className="absolute right-0 top-0 p-2 opacity-5">
                        <FileText className="w-8 h-8" />
                    </div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1" data-testid={`history-card-ai-label-${index}`}>  // ADDED
                        AI Synthesis
                    </p>
                    <p className="text-xs font-bold text-navy-900 leading-tight" data-testid={`history-card-ai-insight-${index}`}>  // ADDED
                        {symptom.aiAnalysis.possibleConditions[0]?.name ?? "Inconclusive Record"}
                    </p>
                </div>
            )}

            {/* Action Protocols */}
            <div className="flex items-center gap-3 pt-2">
                <button
                    onClick={() => onDownloadReport(symptom._id)}
                    disabled={isGeneratingReport}
                    data-testid={`history-card-download-${index}`}  // ADDED
                    className="flex-1 flex items-center justify-center gap-3 py-3 rounded-2xl bg-navy-900 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-navy-950 transition-all shadow-navy group shrink-0"
                >
                    {isGeneratingReport ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <FileText className="w-4 h-4 text-emerald-400" />
                    )}
                    Report
                </button>
                <button
                    onClick={() => onDelete(symptom._id)}
                    data-testid={`history-card-delete-${index}`}  // ADDED
                    className="w-12 h-12 rounded-2xl border border-navy-900/10 text-slate-300 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-all flex items-center justify-center shrink-0 group"
                >
                    <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
            </div>

            {/* Chrono Footer */}
            <div className="flex items-center justify-between pt-1 opacity-40">
                <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-1 h-1 rounded-full bg-slate-300" />
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    <span className="text-[10px] font-black tracking-tighter uppercase" data-testid={`history-card-time-${index}`}>  // ADDED
                        {formatRelativeTime(symptom.createdAt)}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default HistoryCard;