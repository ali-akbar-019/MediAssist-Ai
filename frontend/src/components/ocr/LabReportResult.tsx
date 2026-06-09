import { motion } from "framer-motion";
import {
    AlertTriangle,
    CheckCircle,
    ChevronRight,
    Minus,
    TrendingDown,
    TrendingUp,
} from "lucide-react";
import type { LabValue, OCRResult } from "../../types";

interface LabReportResultProps {
    result: OCRResult;
}

const StatusConfig = {
    normal: {
        icon: CheckCircle,
        color: "#10B981",
        bg: "#ECFDF5",
        border: "#A7F3D0",
        label: "Normal",
        trendIcon: Minus,
    },
    high: {
        icon: TrendingUp,
        color: "#EF4444",
        bg: "#FEF2F2",
        border: "#FEE2E2",
        label: "High",
        trendIcon: TrendingUp,
    },
    low: {
        icon: TrendingDown,
        color: "#F59E0B",
        bg: "#FFFBEB",
        border: "#FDE68A",
        label: "Low",
        trendIcon: TrendingDown,
    },
    critical: {
        icon: AlertTriangle,
        color: "#7C3AED",
        bg: "#F5F3FF",
        border: "#DDD6FE",
        label: "Critical",
        trendIcon: AlertTriangle,
    },
};

const LabValueCard = ({
    value,
    index,
}: {
    value: LabValue;
    index: number;
}) => {
    const config = StatusConfig[value.status];
    const TrendIcon = config.trendIcon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="p-4 rounded-xl border"
            style={{
                borderColor: config.border,
                backgroundColor: config.bg,
            }}
        >
            <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                    <p
                        className="font-semibold text-sm"
                        style={{ color: "var(--color-navy-900)" }}
                    >
                        {value.test}
                    </p>
                    {value.normalRange && (
                        <p
                            className="text-xs mt-0.5"
                            style={{ color: "var(--color-medical-muted)" }}
                        >
                            Normal: {value.normalRange}
                        </p>
                    )}
                </div>
                <div className="flex flex-col items-end shrink-0">
                    <div className="flex items-center gap-1.5">
                        <span
                            className="font-heading font-bold text-lg"
                            style={{ color: config.color }}
                        >
                            {value.value}
                        </span>
                        {value.unit && (
                            <span
                                className="text-xs"
                                style={{ color: "var(--color-medical-muted)" }}
                            >
                                {value.unit}
                            </span>
                        )}
                    </div>
                    <div
                        className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full mt-1"
                        style={{ backgroundColor: config.color + "20", color: config.color }}
                    >
                        <TrendIcon size={10} />
                        {config.label}
                    </div>
                </div>
            </div>

            {value.interpretation && (
                <p
                    className="text-xs leading-relaxed mt-2 pt-2 border-t"
                    style={{
                        color: "var(--color-medical-muted)",
                        borderColor: config.border,
                    }}
                >
                    {value.interpretation}
                </p>
            )}
        </motion.div>
    );
};

const LabReportResult = ({ result }: LabReportResultProps) => {
    const abnormalValues = result.labValues.filter(
        (v) => v.status !== "normal"
    );
    const normalValues = result.labValues.filter((v) => v.status === "normal");

    return (
        <div className="space-y-5">
            {/* Summary */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-[2rem] bg-navy-900 border border-white/5 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <CheckCircle className="text-emerald-500" size={80} />
                </div>
                <p
                    className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-emerald-400"
                >
                    Analytical Overview
                </p>
                <p
                    className="text-sm leading-relaxed text-emerald-50/80 relative z-10"
                >
                    {result.simplifiedExplanation}
                </p>
            </motion.div>

            {/* Stats Row */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                {[
                    {
                        label: "Optimal",
                        count: normalValues.length,
                        color: "#10B981",
                        bg: "rgba(16,185,129,0.05)",
                        border: "rgba(16,185,129,0.1)",
                    },
                    {
                        label: "Elevated",
                        count: result.labValues.filter((v) => v.status === "high").length,
                        color: "#EF4444",
                        bg: "rgba(239,68,68,0.05)",
                        border: "rgba(239,68,68,0.1)",
                    },
                    {
                        label: "Deficient",
                        count: result.labValues.filter((v) => v.status === "low").length,
                        color: "#F59E0B",
                        bg: "rgba(245,158,11,0.05)",
                        border: "rgba(245,158,11,0.1)",
                    },
                    {
                        label: "Critical",
                        count: result.labValues.filter((v) => v.status === "critical")
                            .length,
                        color: "#7C3AED",
                        bg: "rgba(124,58,237,0.05)",
                        border: "rgba(124,58,237,0.1)",
                    },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="flex flex-col items-center p-4 rounded-2xl border bg-white/50 backdrop-blur-sm"
                        style={{ backgroundColor: stat.bg, borderColor: stat.border }}
                    >
                        <span
                            className="text-3xl font-black font-heading tracking-tighter"
                            style={{ color: stat.color }}
                        >
                            {stat.count}
                        </span>
                        <span
                            className="text-[10px] font-black uppercase tracking-[0.15em] mt-1 text-slate-400"
                        >
                            {stat.label}
                        </span>
                    </div>
                ))}
            </motion.div>

            {/* Abnormal Values First */}
            {abnormalValues.length > 0 && (
                <div>
                    <p
                        className="text-sm font-semibold mb-3 flex items-center gap-2"
                        style={{ color: "#EF4444" }}
                    >
                        <AlertTriangle size={15} />
                        Requires Attention ({abnormalValues.length})
                    </p>
                    <div className="space-y-2">
                        {abnormalValues.map((value, i) => (
                            <LabValueCard key={value.test} value={value} index={i} />
                        ))}
                    </div>
                </div>
            )}

            {/* Normal Values */}
            {normalValues.length > 0 && (
                <div>
                    <p
                        className="text-sm font-semibold mb-3 flex items-center gap-2"
                        style={{ color: "#10B981" }}
                    >
                        <CheckCircle size={15} />
                        Normal Results ({normalValues.length})
                    </p>
                    <div className="space-y-2">
                        {normalValues.map((value, i) => (
                            <LabValueCard key={value.test} value={value} index={abnormalValues.length + i} />
                        ))}
                    </div>
                </div>
            )}

            {/* Warnings */}
            {result.warnings.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl"
                    style={{ backgroundColor: "#FEF2F2", border: "1px solid #FEE2E2" }}
                >
                    <p className="text-xs font-semibold uppercase tracking-wider mb-3"
                        style={{ color: "#EF4444" }}>
                        Warnings
                    </p>
                    <ul className="space-y-2">
                        {result.warnings.map((warning, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                                <AlertTriangle size={13} className="shrink-0 mt-0.5" style={{ color: "#EF4444" }} />
                                <span style={{ color: "var(--color-medical-muted)" }}>{warning}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            )}

            {/* Follow Up */}
            {result.followUpActions.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl"
                    style={{ backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0" }}
                >
                    <p className="text-xs font-semibold uppercase tracking-wider mb-3"
                        style={{ color: "#059669" }}>
                        Recommended Actions
                    </p>
                    <ul className="space-y-2">
                        {result.followUpActions.map((action, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                                <ChevronRight size={13} className="shrink-0 mt-0.5" style={{ color: "#059669" }} />
                                <span style={{ color: "var(--color-medical-muted)" }}>{action}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            )}
        </div>
    );
};

export default LabReportResult;