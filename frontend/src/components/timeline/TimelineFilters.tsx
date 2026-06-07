import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Calendar, SlidersHorizontal, ChevronDown } from "lucide-react";
import type { TimelineFilter, SeverityLevel } from "../../types";
import { cn } from "../../lib/utils";

interface TimelineFiltersProps {
    filters: TimelineFilter;
    onFilterChange: (filters: TimelineFilter) => void;
    onReset: () => void;
}

const SEVERITY_OPTIONS: Array<{ value: SeverityLevel; label: string; color: string }> = [
    { value: "mild", label: "Mild", color: "#10B981" },
    { value: "moderate", label: "Moderate", color: "#F59E0B" },
    { value: "severe", label: "Severe", color: "#EF4444" },
    { value: "emergency", label: "Emergency", color: "#7C3AED" },
];

const BODY_PARTS = [
    "Head", "Neck", "Chest", "Abdomen", "Back",
    "Shoulder", "Arm", "Hand", "Thigh", "Knee", "Leg", "Foot",
];

const TimelineFilters = ({
    filters,
    onFilterChange,
    onReset,
}: TimelineFiltersProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters.search || "");

    const filtersRef = useRef(filters);

    // Update ref whenever filters prop changes
    useEffect(() => {
        filtersRef.current = filters;
    }, [filters]);

    const hasActiveFilters =
        filters.severity || filters.bodyPart || filters.startDate || filters.endDate || filters.search;

    // Handle debounced search - isolate from filters dependency to prevent loops
    useEffect(() => {
        const timer = setTimeout(() => {
            // Only trigger if searchTerm has actually changed from what's in the filters
            if (searchTerm !== (filtersRef.current.search || "")) {
                onFilterChange({ ...filtersRef.current, search: searchTerm || undefined });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, onFilterChange]); // Removed 'filters' dependency

    // Sync local search term ONLY when filters.search changes externally (e.g. reset)
    useEffect(() => {
        if ((filters.search || "") !== searchTerm) {
            setSearchTerm(filters.search || "");
        }
    }, [filters.search]);

    return (
        <div className="glass-panel rounded-[2.5rem] border-white/20 shadow-luxe overflow-hidden mb-12 ring-1 ring-black/5">
            {/* Elegant Header / Search Bar */}
            <div className="p-2 flex flex-col lg:flex-row items-center gap-2">
                <div className="flex-1 relative w-full group">
                    <Search
                        size={16}
                        className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"
                    />
                    <input
                        type="text"
                        placeholder="Filter by symptoms, anatomy, or diagnostic keywords..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-14 pl-14 pr-6 rounded-[1.75rem] bg-transparent focus:bg-white transition-all text-[13px] font-bold placeholder:text-slate-400 placeholder:font-medium outline-none"
                    />
                </div>
                
                <div className="flex items-center gap-2 w-full lg:w-auto p-1">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={cn(
                            "flex items-center gap-3 px-8 h-12 rounded-[1.25rem] font-black text-[10px] uppercase tracking-[0.15em] transition-all shrink-0",
                            isExpanded 
                                ? "bg-navy-900 text-white shadow-navy" 
                                : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                        )}
                    >
                        <SlidersHorizontal size={14} />
                        {isExpanded ? "Close Filters" : "Advanced Filters"}
                    </button>

                    {hasActiveFilters && (
                        <button
                            onClick={onReset}
                            className="w-12 h-12 rounded-[1.25rem] bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors shrink-0 group"
                            title="Reset all filters"
                        >
                            <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    )}
                </div>
            </div>

            {/* Advanced Filters Panel */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="px-8 pb-10 space-y-10 border-t border-slate-100/50 pt-10">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                {/* Severity Selection */}
                                <div className="space-y-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Clinical Intensity</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {SEVERITY_OPTIONS.map((opt) => {
                                            const active = filters.severity === opt.value;
                                            return (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => onFilterChange({ ...filters, severity: active ? undefined : opt.value })}
                                                    className={cn(
                                                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all border",
                                                        active 
                                                            ? "shadow-sm" 
                                                            : "bg-white border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-600"
                                                    )}
                                                    style={active ? { backgroundColor: opt.color, borderColor: opt.color, color: 'white' } : {}}
                                                >
                                                    {opt.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Body Focus */}
                                <div className="space-y-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Anatomical Focus</p>
                                    </div>
                                    <div className="relative group">
                                        <select
                                            value={filters.bodyPart || ""}
                                            onChange={(e) => onFilterChange({ ...filters, bodyPart: e.target.value || undefined })}
                                            className="w-full h-11 px-5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-black outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">All Anatomical Areas</option>
                                            {BODY_PARTS.map(part => (
                                                <option key={part} value={part}>{part}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-emerald-500 transition-colors" />
                                    </div>
                                </div>

                                {/* Temporal Window */}
                                <div className="space-y-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date Range</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1 group">
                                            <Calendar size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500" />
                                            <input
                                                type="date"
                                                value={filters.startDate || ""}
                                                onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value || undefined })}
                                                className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                                            />
                                        </div>
                                        <div className="relative flex-1 group">
                                            <Calendar size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500" />
                                            <input
                                                type="date"
                                                value={filters.endDate || ""}
                                                onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value || undefined })}
                                                className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TimelineFilters;