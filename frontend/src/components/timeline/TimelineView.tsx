import { motion } from "framer-motion";
import { Clock, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import type { TimelineEntry as TimelineEntryType } from "../../types";
import TimelineEntry from "./TimelineEntry";

interface TimelineViewProps {
    entries: TimelineEntryType[];
    isLoading: boolean;
    total: number;
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const TimelineView = ({
    entries,
    isLoading,
    total,
    page,
    totalPages,
    onPageChange,
}: TimelineViewProps) => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2
                    size={32}
                    className="animate-spin"
                    style={{ color: "var(--color-navy-900)" }}
                />
                <p className="text-sm" style={{ color: "var(--color-medical-muted)" }}>
                    Loading your health timeline...
                </p>
            </div>
        );
    }

    if (entries.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                    "flex flex-col items-center justify-center py-20",
                    "rounded-2xl border border-dashed"
                )}
                style={{ borderColor: "var(--color-medical-border)" }}
            >
                <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: "var(--color-medical-surface)" }}
                >
                    <Clock size={28} style={{ color: "var(--color-medical-muted)" }} />
                </div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: "var(--color-navy-900)" }}>
                    No entries found
                </h3>
                <p className="text-sm text-center max-w-xs" style={{ color: "var(--color-medical-muted)" }}>
                    Your symptom analyses will appear here as a timeline once you start using the analyzer.
                </p>
            </motion.div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Entry Count */}
            <div className="flex items-center justify-between">
                <p className="text-sm" style={{ color: "var(--color-medical-muted)" }}>
                    Showing{" "}
                    <span className="font-semibold" style={{ color: "var(--color-navy-900)" }}>
                        {entries.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold" style={{ color: "var(--color-navy-900)" }}>
                        {total}
                    </span>{" "}
                    entries
                </p>
            </div>

            {/* Timeline Entries */}
            <div className="relative">
                {entries.map((entry, index) => (
                    <TimelineEntry
                        key={entry._id}
                        entry={entry}
                        index={index}
                        isLast={index === entries.length - 1}
                    />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    <button
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 1}
                        className={cn(
                            "px-4 py-2 text-sm font-medium rounded-xl border",
                            "transition-all duration-200",
                            "disabled:opacity-40 disabled:cursor-not-allowed"
                        )}
                        style={{
                            borderColor: "var(--color-medical-border)",
                            color: "var(--color-medical-muted)",
                        }}
                    >
                        Previous
                    </button>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            const pageNum =
                                totalPages <= 5
                                    ? i + 1
                                    : page <= 3
                                        ? i + 1
                                        : page >= totalPages - 2
                                            ? totalPages - 4 + i
                                            : page - 2 + i;

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => onPageChange(pageNum)}
                                    className={cn(
                                        "w-8 h-8 text-sm font-medium rounded-lg transition-all"
                                    )}
                                    style={{
                                        backgroundColor:
                                            page === pageNum
                                                ? "var(--color-navy-900)"
                                                : "transparent",
                                        color:
                                            page === pageNum
                                                ? "white"
                                                : "var(--color-medical-muted)",
                                    }}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => onPageChange(page + 1)}
                        disabled={page === totalPages}
                        className={cn(
                            "px-4 py-2 text-sm font-medium rounded-xl border",
                            "transition-all duration-200",
                            "disabled:opacity-40 disabled:cursor-not-allowed"
                        )}
                        style={{
                            borderColor: "var(--color-medical-border)",
                            color: "var(--color-medical-muted)",
                        }}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default TimelineView;