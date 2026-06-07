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
} from "lucide-react";
import type { TimelineEntry as TimelineEntryType } from "../../types";
import { formatRelativeTime, formatDate, getSeverityInfo } from "../../lib/utils";
import { cn } from "../../lib/utils";

interface TimelineEntryProps {
    entry: TimelineEntryType;
    index: number;
    isLast: boolean;
}

const TimelineEntry = ({ entry, index, isLast }: TimelineEntryProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const severityInfo = entry.aiAnalysis
        ? getSeverityInfo(entry.aiAnalysis.severity)
        : null;

    const severityColors = {
        mild: { dot: "#10B981", line: "#10B981" },
        moderate: { dot: "#F59E0B", line: "#F59E0B" },
        severe: { dot: "#EF4444", line: "#EF4444" },
        emergency: { dot: "#7C3AED", line: "#7C3AED" },
    };

    const dotColor = entry.aiAnalysis?.severity
        ? severityColors[entry.aiAnalysis.severity].dot
        : "var(--color-navy-900)";

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.06 }}
            className="flex gap-4"
        >
            {/* Timeline Line + Dot */}
            <div className="flex flex-col items-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.06 + 0.2 }}
                    className="w-4 h-4 rounded-full border-2 border-white shadow-md shrink-0 mt-1"
                    style={{ backgroundColor: dotColor }}
                />
                {!isLast && (
                    <div
                        className="w-0.5 flex-1 mt-2"
                        style={{ backgroundColor: "var(--color-medical-border)" }}
                    />
                )}
            </div>

            {/* Entry Card */}
            <div className="flex-1 pb-6">
                <div
                    className={cn(
                        "bg-white rounded-xl border overflow-hidden",
                        "shadow-sm hover:shadow-md transition-shadow"
                    )}
                    style={{ borderColor: "var(--color-medical-border)" }}
                >
                    {/* Card Header */}
                    <button
                        onClick={() => setIsExpanded((prev) => !prev)}
                        className="w-full flex items-start gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                        {/* Body Part Icon */}
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${dotColor}15` }}
                        >
                            <MapPin size={18} style={{ color: dotColor }} />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <h3 className="font-semibold text-sm" style={{ color: "var(--color-navy-900)" }}>
                                        {entry.bodyPart}
                                        <span className="font-normal ml-1.5 text-xs" style={{ color: "var(--color-medical-muted)" }}>
                                            ({entry.bodySide} view)
                                        </span>
                                    </h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <Clock size={11} style={{ color: "var(--color-medical-muted)" }} />
                                        <span className="text-xs" style={{ color: "var(--color-medical-muted)" }}>
                                            {formatRelativeTime(entry.createdAt)}
                                        </span>
                                        <span className="text-xs" style={{ color: "var(--color-medical-muted)" }}>
                                            • {formatDate(entry.createdAt)}
                                        </span>
                                    </div>
                                </div>

                                {severityInfo && (
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span
                                            className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                                            style={{
                                                color: severityInfo.color,
                                                backgroundColor: `${severityInfo.color}15`,
                                            }}
                                        >
                                            {entry.aiAnalysis?.severity}
                                        </span>
                                        <span className="text-sm font-bold" style={{ color: dotColor }}>
                                            {entry.severity}/10
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Symptom Tags */}
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {entry.symptoms.slice(0, 3).map((symptom) => (
                                    <span
                                        key={symptom}
                                        className="px-2 py-0.5 rounded-full text-xs border"
                                        style={{
                                            borderColor: "var(--color-medical-border)",
                                            color: "var(--color-medical-muted)",
                                            backgroundColor: "var(--color-medical-surface)",
                                        }}
                                    >
                                        {symptom}
                                    </span>
                                ))}
                                {entry.symptoms.length > 3 && (
                                    <span
                                        className="px-2 py-0.5 rounded-full text-xs border"
                                        style={{
                                            borderColor: "var(--color-medical-border)",
                                            color: "var(--color-medical-muted)",
                                        }}
                                    >
                                        +{entry.symptoms.length - 3} more
                                    </span>
                                )}
                            </div>
                        </div>

                        {isExpanded ? (
                            <ChevronUp size={16} style={{ color: "var(--color-medical-muted)" }} />
                        ) : (
                            <ChevronDown size={16} style={{ color: "var(--color-medical-muted)" }} />
                        )}
                    </button>

                    {/* Expanded Details */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="border-t"
                                style={{ borderColor: "var(--color-medical-border)" }}
                            >
                                <div className="p-4 space-y-4">
                                    {/* Pain Details */}
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { label: "Pain Type", value: entry.painType },
                                            { label: "Duration", value: `${entry.duration} ${entry.durationUnit}` },
                                            { label: "Worse At", value: entry.worseAt },
                                        ].map((item) => (
                                            <div
                                                key={item.label}
                                                className="p-3 rounded-xl text-center"
                                                style={{ backgroundColor: "var(--color-medical-surface)" }}
                                            >
                                                <p className="text-xs" style={{ color: "var(--color-medical-muted)" }}>
                                                    {item.label}
                                                </p>
                                                <p className="text-sm font-semibold capitalize mt-0.5"
                                                    style={{ color: "var(--color-navy-900)" }}>
                                                    {item.value}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* AI Analysis */}
                                    {entry.aiAnalysis && (
                                        <div className="space-y-3">
                                            {/* Top Condition */}
                                            {entry.aiAnalysis.possibleConditions.length > 0 && (
                                                <div
                                                    className="p-3 rounded-xl border"
                                                    style={{
                                                        borderColor: "var(--color-medical-border)",
                                                        backgroundColor: "var(--color-medical-surface)",
                                                    }}
                                                >
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Activity size={14} style={{ color: "var(--color-emerald-500)" }} />
                                                        <p className="text-xs font-semibold" style={{ color: "var(--color-navy-900)" }}>
                                                            Most Likely Condition
                                                        </p>
                                                    </div>
                                                    <p className="text-sm font-medium" style={{ color: "var(--color-navy-900)" }}>
                                                        {entry.aiAnalysis.possibleConditions[0].name}
                                                    </p>
                                                    <p className="text-xs mt-0.5" style={{ color: "var(--color-medical-muted)" }}>
                                                        {entry.aiAnalysis.possibleConditions[0].description}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Recommendation */}
                                            <div
                                                className="p-3 rounded-xl"
                                                style={{ backgroundColor: `${dotColor}08`, border: `1px solid ${dotColor}20` }}
                                            >
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Stethoscope size={14} style={{ color: dotColor }} />
                                                    <p className="text-xs font-semibold" style={{ color: dotColor }}>
                                                        Recommendation
                                                    </p>
                                                </div>
                                                <p className="text-xs leading-relaxed" style={{ color: "var(--color-medical-muted)" }}>
                                                    {entry.aiAnalysis.recommendation}
                                                </p>
                                            </div>

                                            {/* Home Remedies */}
                                            {entry.aiAnalysis.homeRemedies.length > 0 && (
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Home size={13} style={{ color: "var(--color-medical-muted)" }} />
                                                        <p className="text-xs font-semibold" style={{ color: "var(--color-medical-muted)" }}>
                                                            Home Remedies
                                                        </p>
                                                    </div>
                                                    <ul className="space-y-1">
                                                        {entry.aiAnalysis.homeRemedies.slice(0, 3).map((remedy, i) => (
                                                            <li key={i} className="flex items-start gap-2 text-xs"
                                                                style={{ color: "var(--color-medical-muted)" }}>
                                                                <CheckCircle size={12} className="shrink-0 mt-0.5"
                                                                    style={{ color: "var(--color-emerald-500)" }} />
                                                                {remedy}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* When to See Doctor */}
                                            <div
                                                className="flex items-start gap-2 p-3 rounded-xl"
                                                style={{ backgroundColor: "#FFF8EC", border: "1px solid #F59E0B30" }}
                                            >
                                                <AlertTriangle size={14} className="shrink-0 mt-0.5" style={{ color: "#F59E0B" }} />
                                                <p className="text-xs leading-relaxed" style={{ color: "var(--color-medical-muted)" }}>
                                                    {entry.aiAnalysis.whenToSeeDoctor}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Additional Notes */}
                                    {entry.additionalNotes && (
                                        <div className="p-3 rounded-xl"
                                            style={{ backgroundColor: "var(--color-medical-surface)" }}>
                                            <p className="text-xs font-semibold mb-1" style={{ color: "var(--color-medical-muted)" }}>
                                                Additional Notes
                                            </p>
                                            <p className="text-xs leading-relaxed" style={{ color: "var(--color-medical-muted)" }}>
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