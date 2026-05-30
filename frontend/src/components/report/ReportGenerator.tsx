import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    Download,
    Loader2,
    CheckCircle,
    AlertTriangle,
    ChevronDown,
    ChevronUp,
    Pill,
} from "lucide-react";
import type { Report } from "../../types";
import { getSeverityInfo, getProbabilityInfo, formatDate } from "../../lib/utils";
import { downloadReportAsPDF } from "../../services/reportService";
import { cn } from "../../lib/utils";

interface ReportGeneratorProps {
    report: Report;
}

const ReportGenerator = ({ report }: ReportGeneratorProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadSuccess, setDownloadSuccess] = useState(false);

    const severityInfo = getSeverityInfo(report.aiAnalysis.severity);

    const handleDownload = async () => {
        try {
            setIsDownloading(true);
            downloadReportAsPDF(report);
            setDownloadSuccess(true);
            setTimeout(() => setDownloadSuccess(false), 3000);
        } catch {
            // Handle error silently
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="medical-card overflow-hidden"
        >
            {/* Report Header */}
            <div className="p-5 border-b border-medical-border">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-navy-50 border border-navy-100 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-navy-900" />
                        </div>
                        <div>
                            <h3 className="font-heading font-semibold text-navy-900 text-sm">
                                {report.title}
                            </h3>
                            <p className="text-xs text-medical-muted mt-0.5">
                                Report ID: {report.reportId}
                            </p>
                            <p className="text-xs text-medical-muted">
                                Generated: {formatDate(report.generatedAt)}
                            </p>
                        </div>
                    </div>

                    {/* Severity Badge */}
                    <span
                        className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium capitalize shrink-0",
                            `severity-${report.aiAnalysis.severity}`
                        )}
                    >
                        {severityInfo.label}
                    </span>
                </div>
            </div>

            {/* Quick Summary */}
            <div className="p-5 space-y-4">
                {/* Patient Info Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: "Patient", value: report.patientInfo.name },
                        {
                            label: "Age",
                            value: report.patientInfo.age?.toString() ?? "N/A",
                        },
                        {
                            label: "Gender",
                            value: report.patientInfo.gender ?? "N/A",
                        },
                        {
                            label: "Blood Group",
                            value: report.patientInfo.bloodGroup ?? "N/A",
                        },
                    ].map((item) => (
                        <div key={item.label} className="space-y-0.5">
                            <p className="text-xs text-medical-muted">{item.label}</p>
                            <p className="text-sm font-medium text-navy-900 capitalize">
                                {item.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Symptom Summary */}
                <div className="p-3 rounded-xl bg-medical-surface border border-medical-border">
                    <div className="grid grid-cols-3 gap-3">
                        <div className="text-center">
                            <p className="text-xs text-medical-muted">Body Part</p>
                            <p className="text-sm font-medium text-navy-900 mt-0.5">
                                {report.symptomDetails.bodyPart}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-medical-muted">Severity</p>
                            <p className="text-sm font-medium text-navy-900 mt-0.5">
                                {report.symptomDetails.severity}/10
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-medical-muted">Duration</p>
                            <p className="text-sm font-medium text-navy-900 mt-0.5">
                                {report.symptomDetails.duration}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Top Condition */}
                {report.aiAnalysis.possibleConditions.length > 0 && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-navy-50 border border-navy-100">
                        <div>
                            <p className="text-xs text-navy-600">Top Possible Condition</p>
                            <p className="text-sm font-semibold text-navy-900 mt-0.5">
                                {report.aiAnalysis.possibleConditions[0].name}
                            </p>
                        </div>
                        <span
                            className={cn(
                                "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                                report.aiAnalysis.possibleConditions[0].probability === "high"
                                    ? "bg-red-50 text-red-600"
                                    : report.aiAnalysis.possibleConditions[0].probability ===
                                        "medium"
                                        ? "bg-amber-50 text-amber-600"
                                        : "bg-emerald-50 text-emerald-600"
                            )}
                        >
                            {
                                getProbabilityInfo(
                                    report.aiAnalysis.possibleConditions[0].probability
                                ).label
                            }{" "}
                            probability
                        </span>
                    </div>
                )}

                {/* Expand/Collapse Button */}
                <button
                    onClick={() => setIsExpanded((prev) => !prev)}
                    className="w-full flex items-center justify-center gap-2 py-2 text-sm text-medical-muted hover:text-navy-900 transition-colors"
                >
                    {isExpanded ? (
                        <>
                            <ChevronUp className="w-4 h-4" />
                            Show Less
                        </>
                    ) : (
                        <>
                            <ChevronDown className="w-4 h-4" />
                            Show Full Report
                        </>
                    )}
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4 overflow-hidden"
                        >
                            {/* All Conditions */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-navy-900">
                                    All Possible Conditions
                                </h4>
                                {report.aiAnalysis.possibleConditions.map(
                                    (condition, index) => (
                                        <div
                                            key={index}
                                            className="p-3 rounded-xl border border-medical-border"
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium text-navy-900">
                                                    {condition.name}
                                                </span>
                                                <span
                                                    className={cn(
                                                        "text-xs font-medium px-2 py-0.5 rounded-full capitalize",
                                                        condition.probability === "high"
                                                            ? "bg-red-50 text-red-600"
                                                            : condition.probability === "medium"
                                                                ? "bg-amber-50 text-amber-600"
                                                                : "bg-emerald-50 text-emerald-600"
                                                    )}
                                                >
                                                    {condition.probability}
                                                </span>
                                            </div>
                                            <p className="text-xs text-medical-muted">
                                                {condition.description}
                                            </p>
                                        </div>
                                    )
                                )}
                            </div>

                            {/* Recommendation */}
                            <div className="p-4 rounded-xl bg-medical-surface border border-medical-border">
                                <h4 className="text-sm font-semibold text-navy-900 mb-2">
                                    Recommendation
                                </h4>
                                <p className="text-sm text-medical-muted leading-relaxed">
                                    {report.aiAnalysis.recommendation}
                                </p>
                            </div>

                            {/* Home Remedies */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-navy-900">
                                    Home Remedies
                                </h4>
                                <ul className="space-y-1.5">
                                    {report.aiAnalysis.homeRemedies.map((remedy, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start gap-2 text-sm text-medical-muted"
                                        >
                                            <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                            {remedy}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {/* Medicines to Consider */}
                            {report.aiAnalysis.medicinesToConsider && report.aiAnalysis.medicinesToConsider.length > 0 && (
                                <div className="p-6 rounded-[2rem] bg-blue-50 border border-blue-100 shadow-soft mt-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                            <Pill className="w-4 h-4 text-white" />
                                        </div>
                                        <h4 className="text-sm font-black text-blue-800 tracking-tight">
                                            Medicines to Consider
                                        </h4>
                                    </div>
                                    <ul className="space-y-3">
                                        {report.aiAnalysis.medicinesToConsider.map((medicine, index) => (
                                            <li
                                                key={index}
                                                className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed"
                                            >
                                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                                                <span>
                                                    <strong>{medicine.name}</strong> ({medicine.type})
                                                    <br />
                                                    {medicine.reason}
                                                    <br />
                                                    <em>{medicine.howToUse}</em>
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* When to See Doctor */}
                            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                                <div className="flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-amber-800">
                                            When to See a Doctor
                                        </p>
                                        <p className="text-xs text-amber-700 mt-1">
                                            {report.aiAnalysis.whenToSeeDoctor}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Specialist */}
                            {report.aiAnalysis.specialistType && (
                                <div className="p-3 rounded-xl bg-navy-50 border border-navy-100">
                                    <p className="text-xs text-navy-600">Recommended Specialist</p>
                                    <p className="text-sm font-medium text-navy-900 mt-0.5">
                                        {report.aiAnalysis.specialistType}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Download Button */}
            <div className="px-5 pb-5">
                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className={cn(
                        "w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all",
                        downloadSuccess
                            ? "bg-emerald-500 text-white"
                            : "bg-navy-900 hover:bg-navy-800 text-white shadow-navy"
                    )}
                >
                    {isDownloading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Generating PDF...
                        </>
                    ) : downloadSuccess ? (
                        <>
                            <CheckCircle className="w-4 h-4" />
                            Downloaded Successfully!
                        </>
                    ) : (
                        <>
                            <Download className="w-4 h-4" />
                            Download PDF Report
                        </>
                    )}
                </motion.button>
            </div>
        </motion.div>
    );
};

export default ReportGenerator;