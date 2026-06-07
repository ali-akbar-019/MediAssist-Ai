import { motion } from "framer-motion";
import { Clock, Activity } from "lucide-react";
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
            <div className="flex flex-col items-center justify-center py-40 gap-4">
                <div className="relative">
                    <div className="w-12 h-12 rounded-2xl border-[3px] border-emerald-500/10 border-t-emerald-500 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Activity size={16} className="text-emerald-500 animate-pulse" />
                    </div>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Synchronizing Timeline</p>
            </div>
        );
    }

    if (entries.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-20 rounded-[3rem] border-white/20 shadow-luxe ring-1 ring-black/5 flex flex-col items-center text-center"
            >
                <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-8 shadow-inner">
                    <Clock size={32} className="text-slate-300" />
                </div>
                <h3 className="text-2xl font-black text-navy-900 mb-3 tracking-tight">Diagnostic Archive Empty</h3>
                <p className="text-sm text-slate-500 max-w-xs font-medium leading-relaxed mb-8">
                    Your longitudinal health data will manifest here once you begin your analysis journey.
                </p>
                <button className="px-8 py-3.5 bg-navy-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-navy hover:scale-105 transition-transform">
                    Initiate First Analysis
                </button>
            </motion.div>
        );
    }

    return (
        <div className="space-y-8">
            {/* List Header */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <p className="text-[10px] font-black text-navy-900 uppercase tracking-[0.2em]">
                        Showing {entries.length} of {total} Diagnostic Events
                    </p>
                </div>
            </div>

            {/* entries list */}
            <div className="space-y-4">
                {entries.map((entry, index) => (
                    <TimelineEntry
                        key={entry._id}
                        entry={entry}
                        index={index}
                        isLast={index === entries.length - 1}
                    />
                ))}
            </div>

            {/* Elite Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-10">
                    <button
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 1}
                        className="px-6 py-3 rounded-2xl border border-slate-100 bg-white shadow-sm text-xs font-black uppercase tracking-widest text-slate-400 hover:text-navy-900 hover:border-slate-200 disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-100 transition-all font-inter"
                    >
                        Previous
                    </button>

                    <div className="flex items-center gap-2 p-1.5 bg-slate-100/50 rounded-[1.5rem] border border-slate-200/30">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            const pageNum =
                                totalPages <= 5
                                    ? i + 1
                                    : page <= 3
                                        ? i + 1
                                        : page >= totalPages - 2
                                            ? totalPages - 4 + i
                                            : page - 2 + i;

                            const active = page === pageNum;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => onPageChange(pageNum)}
                                    className={cn(
                                        "w-10 h-10 rounded-[1.1rem] text-sm font-black transition-all",
                                        active
                                            ? "bg-navy-900 text-white shadow-navy"
                                            : "text-slate-400 hover:text-navy-900 hover:bg-white"
                                    )}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => onPageChange(page + 1)}
                        disabled={page === totalPages}
                        className="px-6 py-3 rounded-2xl border border-slate-100 bg-white shadow-sm text-xs font-black uppercase tracking-widest text-slate-400 hover:text-navy-900 hover:border-slate-200 disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-100 transition-all"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default TimelineView;