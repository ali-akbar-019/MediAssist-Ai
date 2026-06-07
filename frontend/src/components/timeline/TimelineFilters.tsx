import { useState } from "react";
import { motion } from "framer-motion";
import { Filter, X, Calendar, SlidersHorizontal } from "lucide-react";
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
    const hasActiveFilters =
        filters.severity || filters.bodyPart || filters.startDate || filters.endDate;

    return (
        <div
            className={cn(
                "rounded-xl border bg-white",
                "shadow-sm overflow-hidden"
            )}
            style={{ borderColor: "var(--color-medical-border)" }}
        >
            {/* Filter Header */}
            <button
                onClick={() => setIsExpanded((prev) => !prev)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <SlidersHorizontal size={16} style={{ color: "var(--color-navy-900)" }} />
                    <span className="text-sm font-medium" style={{ color: "var(--color-navy-900)" }}>
                        Filters
                    </span>
                    {hasActiveFilters && (
                        <span
                            className="px-2 py-0.5 text-xs font-medium rounded-full text-white"
                            style={{ backgroundColor: "var(--color-emerald-500)" }}
                        >
                            Active
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {hasActiveFilters && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onReset();
                            }}
                            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
                        >
                            <X size={12} />
                            Reset
                        </button>
                    )}
                    <Filter
                        size={14}
                        style={{
                            color: "var(--color-medical-muted)",
                            transform: isExpanded ? "rotate(180deg)" : "none",
                            transition: "transform 0.2s",
                        }}
                    />
                </div>
            </button>

            {/* Filter Content */}
            {isExpanded && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t p-4 space-y-4"
                    style={{ borderColor: "var(--color-medical-border)" }}
                >
                    {/* Severity Filter */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-2"
                            style={{ color: "var(--color-medical-muted)" }}>
                            Severity
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {SEVERITY_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() =>
                                        onFilterChange({
                                            ...filters,
                                            severity: filters.severity === opt.value ? undefined : opt.value,
                                        })
                                    }
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                                    style={{
                                        backgroundColor:
                                            filters.severity === opt.value ? opt.color : "white",
                                        color: filters.severity === opt.value ? "white" : opt.color,
                                        borderColor: opt.color,
                                    }}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Body Part Filter */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-2"
                            style={{ color: "var(--color-medical-muted)" }}>
                            Body Part
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {BODY_PARTS.map((part) => (
                                <button
                                    key={part}
                                    onClick={() =>
                                        onFilterChange({
                                            ...filters,
                                            bodyPart: filters.bodyPart === part ? undefined : part,
                                        })
                                    }
                                    className="px-2.5 py-1 rounded-lg text-xs font-medium border transition-all"
                                    style={{
                                        backgroundColor:
                                            filters.bodyPart === part
                                                ? "var(--color-navy-900)"
                                                : "white",
                                        color:
                                            filters.bodyPart === part
                                                ? "white"
                                                : "var(--color-navy-900)",
                                        borderColor:
                                            filters.bodyPart === part
                                                ? "var(--color-navy-900)"
                                                : "var(--color-medical-border)",
                                    }}
                                >
                                    {part}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider mb-2"
                                style={{ color: "var(--color-medical-muted)" }}>
                                From
                            </p>
                            <div className="relative">
                                <Calendar
                                    size={14}
                                    className="absolute left-2.5 top-1/2 -translate-y-1/2"
                                    style={{ color: "var(--color-medical-muted)" }}
                                />
                                <input
                                    type="date"
                                    value={filters.startDate ?? ""}
                                    onChange={(e) =>
                                        onFilterChange({ ...filters, startDate: e.target.value || undefined })
                                    }
                                    className="w-full pl-8 pr-2 py-2 text-xs rounded-lg border outline-none focus:border-blue-500 transition-colors"
                                    style={{
                                        borderColor: "var(--color-medical-border)",
                                        color: "var(--color-medical-text)",
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider mb-2"
                                style={{ color: "var(--color-medical-muted)" }}>
                                To
                            </p>
                            <div className="relative">
                                <Calendar
                                    size={14}
                                    className="absolute left-2.5 top-1/2 -translate-y-1/2"
                                    style={{ color: "var(--color-medical-muted)" }}
                                />
                                <input
                                    type="date"
                                    value={filters.endDate ?? ""}
                                    onChange={(e) =>
                                        onFilterChange({ ...filters, endDate: e.target.value || undefined })
                                    }
                                    className="w-full pl-8 pr-2 py-2 text-xs rounded-lg border outline-none focus:border-blue-500 transition-colors"
                                    style={{
                                        borderColor: "var(--color-medical-border)",
                                        color: "var(--color-medical-text)",
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sort Order */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-2"
                            style={{ color: "var(--color-medical-muted)" }}>
                            Sort Order
                        </p>
                        <div className="flex gap-2">
                            {[
                                { value: "desc", label: "Newest First" },
                                { value: "asc", label: "Oldest First" },
                            ].map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() =>
                                        onFilterChange({
                                            ...filters,
                                            sortOrder: opt.value as "asc" | "desc",
                                        })
                                    }
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                                    style={{
                                        backgroundColor:
                                            (filters.sortOrder ?? "desc") === opt.value
                                                ? "var(--color-navy-900)"
                                                : "white",
                                        color:
                                            (filters.sortOrder ?? "desc") === opt.value
                                                ? "white"
                                                : "var(--color-navy-900)",
                                        borderColor:
                                            (filters.sortOrder ?? "desc") === opt.value
                                                ? "var(--color-navy-900)"
                                                : "var(--color-medical-border)",
                                    }}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default TimelineFilters;