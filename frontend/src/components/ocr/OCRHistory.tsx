import { motion, AnimatePresence } from "framer-motion";
import { Clock, Trash2, ChevronRight, ScanLine, FileSearch, FileText, Upload } from "lucide-react";
import type { OCRResult } from "../../types";
import { formatRelativeTime, truncate } from "../../lib/utils";
import { cn } from "../../lib/utils";

interface OCRHistoryProps {
    history: OCRResult[];
    isLoading: boolean;
    onSelect: (result: OCRResult) => void;
    onDelete: (id: string) => void;
}

const DOC_TYPE_CONFIG = {
    prescription: { icon: "💊", label: "Prescription" },
    lab_report: { icon: "🧪", label: "Lab Report" },
    medical_report: { icon: "🏥", label: "Medical Report" },
    other: { icon: "📄", label: "Document" },
};

const OCRHistory = ({
    history,
    isLoading,
    onSelect,
    onDelete,
}: OCRHistoryProps) => {
    if (isLoading) {
        return (
            <div className="space-y-2" data-testid="ocr-history-loading">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 rounded-xl skeleton" data-testid={`ocr-history-skeleton-${i}`} />
                ))}
            </div>
        );
    }

    // FIX: Ensure history is an array before checking length
    const historyArray = Array.isArray(history) ? history : [];

    if (historyArray.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-16 px-4 rounded-2xl border-2 border-dashed"
                style={{ borderColor: "var(--color-medical-border)" }}
                data-testid="ocr-history-empty"
            >
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                    <FileSearch
                        size={32}
                        className="text-slate-400"
                    />
                </div>
                <h4 className="text-lg font-bold text-navy-900 mb-1">
                    No Documents Scanned
                </h4>
                <p className="text-sm text-slate-400 max-w-xs text-center">
                    Upload your first medical document to start building your health history.
                </p>
                <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                        <FileText size={14} /> Prescriptions
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <ScanLine size={14} /> Lab Reports
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <Upload size={14} /> Medical Records
                    </span>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="space-y-2" data-testid="ocr-history-list">
            <AnimatePresence>
                {historyArray.map((item, index) => {
                    const config = DOC_TYPE_CONFIG[item.documentType] || DOC_TYPE_CONFIG.other;
                    return (
                        <motion.div
                            key={item._id || index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ delay: index * 0.04 }}
                            data-testid={`ocr-history-item-${index}`}
                            className={cn(
                                "flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl border cursor-pointer",
                                "hover:shadow-md transition-all"
                            )}
                            style={{ borderColor: "var(--color-medical-border)", backgroundColor: "white" }}
                            onClick={() => onSelect(item)}
                        >
                            <span className="text-2xl shrink-0" data-testid={`ocr-history-icon-${index}`}>
                                {config.icon}
                            </span>
                            <div className="flex-1 min-w-0">
                                <p
                                    className="text-sm font-semibold truncate"
                                    style={{ color: "var(--color-navy-900)" }}
                                    data-testid={`ocr-history-label-${index}`}
                                >
                                    {config.label}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <Clock size={10} style={{ color: "var(--color-medical-muted)" }} />
                                    <span className="text-xs" style={{ color: "var(--color-medical-muted)" }} data-testid={`ocr-history-time-${index}`}>
                                        {formatRelativeTime(item.createdAt)}
                                    </span>
                                    <span className="text-xs truncate" style={{ color: "var(--color-medical-muted)" }} data-testid={`ocr-history-filename-${index}`}>
                                        • {truncate(item.fileName || "Untitled", 20)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(item._id);
                                    }}
                                    data-testid={`ocr-history-delete-${index}`}
                                    className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                                    style={{ color: "var(--color-medical-muted)" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = "#EF4444")}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-medical-muted)")}
                                >
                                    <Trash2 size={13} />
                                </button>
                                <ChevronRight size={16} style={{ color: "var(--color-medical-muted)" }} />
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

export default OCRHistory;