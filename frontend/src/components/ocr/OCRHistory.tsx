import { motion, AnimatePresence } from "framer-motion";
import { Clock, Trash2, ChevronRight, ScanLine } from "lucide-react";
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
            <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 rounded-xl skeleton" />
                ))}
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div
                className="flex flex-col items-center justify-center py-10 rounded-xl border border-dashed"
                style={{ borderColor: "var(--color-medical-border)" }}
            >
                <ScanLine
                    size={24}
                    className="mb-2"
                    style={{ color: "var(--color-medical-muted)" }}
                />
                <p
                    className="text-sm"
                    style={{ color: "var(--color-medical-muted)" }}
                >
                    No scanned documents yet
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <AnimatePresence>
                {history.map((item, index) => {
                    const config = DOC_TYPE_CONFIG[item.documentType];
                    return (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ delay: index * 0.04 }}
                            className={cn(
                                "flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl border cursor-pointer",
                                "hover:shadow-md transition-all"
                            )}
                            style={{ borderColor: "var(--color-medical-border)", backgroundColor: "white" }}
                            onClick={() => onSelect(item)}
                        >
                            <span className="text-2xl shrink-0">{config.icon}</span>
                            <div className="flex-1 min-w-0">
                                <p
                                    className="text-sm font-semibold truncate"
                                    style={{ color: "var(--color-navy-900)" }}
                                >
                                    {config.label}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <Clock size={10} style={{ color: "var(--color-medical-muted)" }} />
                                    <span className="text-xs" style={{ color: "var(--color-medical-muted)" }}>
                                        {formatRelativeTime(item.createdAt)}
                                    </span>
                                    <span className="text-xs truncate" style={{ color: "var(--color-medical-muted)" }}>
                                        • {truncate(item.fileName, 20)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(item._id);
                                    }}
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