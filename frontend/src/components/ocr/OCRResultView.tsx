import { motion } from "framer-motion";
import {
    Clock,
    FileText,
    RotateCcw,
    Trash2
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

const DOC_TYPE_LABELS = {
    prescription: { label: "Prescription", icon: "💊", color: "#1E3A5F" },
    lab_report: { label: "Lab Report", icon: "🧪", color: "#059669" },
    medical_report: { label: "Medical Report", icon: "🏥", color: "#7C3AED" },
    other: { label: "Document", icon: "📄", color: "#D97706" },
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
                className="flex items-start justify-between gap-4 p-4 rounded-2xl"
                style={{ backgroundColor: "var(--color-navy-900)" }}
            >
                <div className="flex items-start gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                        style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                    >
                        {docConfig.icon}
                    </div>
                    <div>
                        <h2
                            className="font-heading font-bold text-lg leading-none"
                            style={{ color: "white" }}
                        >
                            {docConfig.label} Analysis
                        </h2>
                        <p
                            className="text-xs mt-1 flex items-center gap-1.5"
                            style={{ color: "rgba(255,255,255,0.6)" }}
                        >
                            <Clock size={11} />
                            {formatRelativeTime(result.createdAt)}
                        </p>
                        <p
                            className="text-xs mt-0.5 truncate max-w-xs"
                            style={{ color: "rgba(255,255,255,0.5)" }}
                        >
                            {result.fileName}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={() => setShowRawText((p) => !p)}
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium",
                            "transition-all"
                        )}
                        style={{
                            backgroundColor: showRawText
                                ? "rgba(255,255,255,0.2)"
                                : "rgba(255,255,255,0.1)",
                            color: "rgba(255,255,255,0.8)",
                        }}
                    >
                        <FileText size={12} />
                        {showRawText ? "Hide" : "Raw Text"}
                    </button>
                    <button
                        onClick={onReset}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                        style={{
                            backgroundColor: "rgba(255,255,255,0.1)",
                            color: "rgba(255,255,255,0.8)",
                        }}
                    >
                        <RotateCcw size={12} />
                        New Scan
                    </button>
                    {onDelete && (
                        <button
                            onClick={() => onDelete(result._id)}
                            className="p-1.5 rounded-xl transition-all hover:bg-red-500/20"
                            style={{ color: "rgba(255,255,255,0.6)" }}
                        >
                            <Trash2 size={14} />
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