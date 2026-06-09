import { motion } from "framer-motion";
import {
    Clock,
    FileText,
    RotateCcw,
    Trash2,
    Pill,
    Microscope,
    Building2,
} from "lucide-react";
import { useState } from "react";
import { cn, formatRelativeTime } from "../../lib/utils";
import type { OCRResult } from "../../types";
import LabReportResult from "./LabReportResult";
import PrescriptionResult from "./PrescriptionResult";

interface OCRResultViewProps {
    result: OCRResult;
    onReset: () => void;
    onDelete?: (id: string) => void;
}

const DOC_TYPE_LABELS: Record<string, { label: string; icon: any; color: string }> = {
    prescription: { label: "Prescription", icon: Pill, color: "#1E3A5F" },
    lab_report: { label: "Lab Report", icon: Microscope, color: "#059669" },
    medical_report: { label: "Medical Report", icon: Building2, color: "#7C3AED" },
    other: { label: "Document", icon: FileText, color: "#D97706" },
};

const OCRResultView = ({ result, onReset, onDelete }: OCRResultViewProps) => {
    const [showRawText, setShowRawText] = useState(false);
    const docConfig = DOC_TYPE_LABELS[result.documentType];

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
        >
            {/* Result Header */}
            <div
                className="flex flex-col xl:flex-row xl:items-start justify-between gap-5 p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-luxe border border-white/10"
                style={{ backgroundColor: "var(--color-navy-900)" }}
            >
                <div className="flex items-start gap-4 sm:gap-5 min-w-0">
                    <div
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-emerald-400 shrink-0"
                        style={{ backgroundColor: "rgba(16,185,129,0.1)" }}
                    >
                        <docConfig.icon size={24} className="sm:w-7 sm:h-7" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                                AI Analysis Complete
                            </span>
                        </div>
                        <h2
                            className="font-heading font-black text-xl sm:text-2xl leading-none tracking-tight"
                            style={{ color: "white" }}
                        >
                            {docConfig.label} <span className="text-emerald-500 font-light italic">Insights.</span>
                        </h2>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3">
                            <p
                                className="text-[10px] font-bold flex items-center gap-2"
                                style={{ color: "rgba(255,255,255,0.4)" }}
                            >
                                <Clock size={12} className="text-emerald-500" />
                                {formatRelativeTime(result.createdAt)}
                            </p>
                            <div className="w-1 h-1 rounded-full bg-white/10" />
                            <p
                                className="text-[10px] font-bold truncate max-w-xs"
                                style={{ color: "rgba(255,255,255,0.4)" }}
                            >
                                {result.fileName}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full xl:w-auto">
                    <button
                        onClick={() => setShowRawText((p) => !p)}
                        className={cn(
                            "flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 w-full sm:w-auto",
                            showRawText ? "bg-white/20 text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
                        )}
                    >
                        <FileText size={14} />
                        {showRawText ? "Hide Output" : "Raw Source"}
                    </button>
                    <button
                        onClick={onReset}
                        className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-navy-900 shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                    >
                        <RotateCcw size={14} />
                        New Registry
                    </button>
                    {onDelete && (
                        <button
                            onClick={() => onDelete(result._id)}
                            className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 self-center sm:self-auto"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Raw Text Toggle */}
            {showRawText && result.rawText && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-xl border p-4"
                    style={{ borderColor: "var(--color-medical-border)" }}
                >
                    <p
                        className="text-xs font-semibold uppercase tracking-wider mb-2"
                        style={{ color: "var(--color-medical-muted)" }}
                    >
                        Extracted Raw Text
                    </p>
                    <pre
                        className="text-xs leading-relaxed whitespace-pre-wrap font-mono"
                        style={{
                            color: "var(--color-medical-muted)",
                            maxHeight: "200px",
                            overflowY: "auto",
                        }}
                    >
                        {result.rawText}
                    </pre>
                </motion.div>
            )}

            {/* Result Content based on type */}
            {result.documentType === "prescription" ? (
                <PrescriptionResult result={result} />
            ) : result.documentType === "lab_report" ? (
                <LabReportResult result={result} />
            ) : (
                /* Generic result for medical_report and other */
                <div className="space-y-4">
                    <div
                        className="p-4 rounded-xl"
                        style={{ backgroundColor: "var(--color-navy-900)" }}
                    >
                        <p
                            className="text-xs font-semibold uppercase tracking-wider mb-2"
                            style={{ color: "var(--color-emerald-400, #34D399)" }}
                        >
                            AI Summary
                        </p>
                        <p
                            className="text-sm leading-relaxed"
                            style={{ color: "rgba(255,255,255,0.85)" }}
                        >
                            {result.simplifiedExplanation || result.summary}
                        </p>
                    </div>

                    {result.importantNotes.length > 0 && (
                        <div
                            className="p-4 rounded-xl"
                            style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}
                        >
                            <p className="text-xs font-semibold uppercase tracking-wider mb-3"
                                style={{ color: "#D97706" }}>
                                Key Findings
                            </p>
                            <ul className="space-y-2">
                                {result.importantNotes.map((note, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm"
                                        style={{ color: "var(--color-medical-muted)" }}>
                                        <span style={{ color: "#D97706" }}>•</span>
                                        {note}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Disclaimer */}
            <p
                className="text-xs text-center"
                style={{ color: "var(--color-medical-muted)" }}
            >
                ⚠️ This AI analysis is for informational purposes only. Always consult
                your doctor for medical decisions.
            </p>
        </motion.div>
    );
};

export default OCRResultView;