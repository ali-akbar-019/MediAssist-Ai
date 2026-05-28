import { motion } from "framer-motion";
import { Trash2, FileText, Clock, MapPin, Loader2 } from "lucide-react";
import type { Symptom } from "../../types";
import { formatRelativeTime, getSeverityInfo } from "../../lib/utils";
import { cn } from "../../lib/utils";

interface HistoryCardProps {
    symptom: Symptom;
    index: number;
    onDelete: (id: string) => void;
    onDownloadReport: (id: string) => void;
    isGeneratingReport: boolean;
}

const HistoryCard = ({
    symptom,
    index,
    onDelete,
    onDownloadReport,
    isGeneratingReport,
}: HistoryCardProps) => {
    const severityInfo = symptom.aiAnalysis
        ? getSeverityInfo(symptom.aiAnalysis.severity)
        : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="medical-card p-4 space-y-3"
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    {/* Body Part Icon */}
                    <div className="w-10 h-10 rounded-xl bg-navy-50 border border-navy-100 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-navy-900" />
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-navy-900">
                            {symptom.bodyPart}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-3 h-3 text-medical-muted" />
                            <span className="text-xs text-medical-muted">
                                {formatRelativeTime(symptom.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Severity Badge */}
                {severityInfo && (
                    <span
                        className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-medium capitalize shrink-0",
                            `severity-${symptom.aiAnalysis?.severity}`
                        )}
                    >
                        {severityInfo.label}
                    </span>
                )}
            </div>

            {/* Symptoms List */}
            <div className="flex flex-wrap gap-1.5">
                {symptom.symptoms.slice(0, 4).map((s) => (
                    <span
                        key={s}
                        className="px-2 py-0.5 rounded-full bg-medical-surface border border-medical-border text-xs text-medical-muted"
                    >
                        {s}
                    </span>
                ))}
                {symptom.symptoms.length > 4 && (
                    <span className="px-2 py-0.5 rounded-full bg-medical-surface border border-medical-border text-xs text-medical-muted">
                        +{symptom.symptoms.length - 4} more
                    </span>
                )}
            </div>

            {/* Pain Details */}
            <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 rounded-lg bg-medical-surface">
                    <p className="text-xs text-medical-muted">Pain Type</p>
                    <p className="text-xs font-medium text-navy-900 capitalize mt-0.5">
                        {symptom.painType}
                    </p>
                </div>
                <div className="text-center p-2 rounded-lg bg-medical-surface">
                    <p className="text-xs text-medical-muted">Severity</p>
                    <p className="text-xs font-medium text-navy-900 mt-0.5">
                        {symptom.severity}/10
                    </p>
                </div>
                <div className="text-center p-2 rounded-lg bg-medical-surface">
                    <p className="text-xs text-medical-muted">Duration</p>
                    <p className="text-xs font-medium text-navy-900 mt-0.5">
                        {symptom.duration} {symptom.durationUnit}
                    </p>
                </div>
            </div>

            {/* AI Analysis Preview */}
            {symptom.aiAnalysis && (
                <div className="p-3 rounded-xl bg-medical-surface border border-medical-border">
                    <p className="text-xs font-medium text-navy-900 mb-1">
                        Top Possible Condition
                    </p>
                    <p className="text-xs text-medical-muted">
                        {symptom.aiAnalysis.possibleConditions[0]?.name ?? "N/A"}
                    </p>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
                <button
                    onClick={() => onDownloadReport(symptom._id)}
                    disabled={isGeneratingReport}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border border-navy-900 text-navy-900 text-xs font-medium hover:bg-navy-50 transition-colors disabled:opacity-50"
                >
                    {isGeneratingReport ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                        <FileText className="w-3.5 h-3.5" />
                    )}
                    Download Report
                </button>
                <button
                    onClick={() => onDelete(symptom._id)}
                    className="p-2 rounded-xl border border-medical-border text-medical-muted hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>
        </motion.div>
    );
};

export default HistoryCard;