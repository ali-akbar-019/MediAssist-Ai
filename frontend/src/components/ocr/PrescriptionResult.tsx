import { motion } from "framer-motion";
import {
    AlertTriangle,
    Calendar,
    CheckCircle,
    ChevronRight,
    Clock,
    Pill,
    User,
} from "lucide-react";
import type { OCRResult } from "../../types";

interface PrescriptionResultProps {
    result: OCRResult;
}

const PrescriptionResult = ({ result }: PrescriptionResultProps) => {
    return (
        <div className="space-y-4">
            {/* Header Info */}
            {(result.doctorName || result.patientName || result.date) && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                >
                    {result.doctorName && (
                        <div
                            className="flex items-center gap-2.5 p-3 rounded-xl"
                            style={{
                                backgroundColor: "var(--color-navy-50, #EFF6FF)",
                                border: "1px solid rgba(30,58,95,0.1)",
                            }}
                        >
                            <User size={16} style={{ color: "var(--color-navy-900)" }} />
                            <div>
                                <p
                                    className="text-xs"
                                    style={{ color: "var(--color-medical-muted)" }}
                                >
                                    Doctor
                                </p>
                                <p
                                    className="text-sm font-semibold"
                                    style={{ color: "var(--color-navy-900)" }}
                                >
                                    {result.doctorName}
                                </p>
                            </div>
                        </div>
                    )}
                    {result.patientName && (
                        <div
                            className="flex items-center gap-2.5 p-3 rounded-xl"
                            style={{
                                backgroundColor: "var(--color-navy-50, #EFF6FF)",
                                border: "1px solid rgba(30,58,95,0.1)",
                            }}
                        >
                            <User size={16} style={{ color: "var(--color-navy-900)" }} />
                            <div>
                                <p
                                    className="text-xs"
                                    style={{ color: "var(--color-medical-muted)" }}
                                >
                                    Patient
                                </p>
                                <p
                                    className="text-sm font-semibold"
                                    style={{ color: "var(--color-navy-900)" }}
                                >
                                    {result.patientName}
                                </p>
                            </div>
                        </div>
                    )}
                    {result.date && (
                        <div
                            className="flex items-center gap-2.5 p-3 rounded-xl"
                            style={{
                                backgroundColor: "var(--color-navy-50, #EFF6FF)",
                                border: "1px solid rgba(30,58,95,0.1)",
                            }}
                        >
                            <Calendar
                                size={16}
                                style={{ color: "var(--color-navy-900)" }}
                            />
                            <div>
                                <p
                                    className="text-xs"
                                    style={{ color: "var(--color-medical-muted)" }}
                                >
                                    Date
                                </p>
                                <p
                                    className="text-sm font-semibold"
                                    style={{ color: "var(--color-navy-900)" }}
                                >
                                    {result.date}
                                </p>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}

            {/* Simplified Explanation */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="p-4 rounded-xl"
                style={{
                    backgroundColor: "var(--color-navy-900)",
                    border: "1px solid rgba(255,255,255,0.1)",
                }}
            >
                <p
                    className="text-xs font-semibold uppercase tracking-wider mb-2"
                    style={{ color: "var(--color-emerald-400, #34D399)" }}
                >
                    AI Explanation
                </p>
                <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.85)" }}
                >
                    {result.simplifiedExplanation}
                </p>
            </motion.div>

            {/* Medicines */}
            {result.extractedMedicines.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-xl border overflow-hidden"
                    style={{ borderColor: "var(--color-medical-border)" }}
                >
                    <div
                        className="flex items-center gap-2 px-4 py-3 border-b"
                        style={{
                            borderColor: "var(--color-medical-border)",
                            backgroundColor: "var(--color-medical-surface)",
                        }}
                    >
                        <Pill size={16} style={{ color: "var(--color-navy-900)" }} />
                        <h3
                            className="font-semibold text-sm"
                            style={{ color: "var(--color-navy-900)" }}
                        >
                            Prescribed Medicines
                        </h3>
                        <span
                            className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{
                                backgroundColor: "var(--color-navy-900)",
                                color: "white",
                            }}
                        >
                            {result.extractedMedicines.length}
                        </span>
                    </div>
                    <div className="divide-y" style={{ borderColor: "var(--color-medical-border)" }}>
                        {result.extractedMedicines.map((medicine, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + index * 0.05 }}
                                className="p-4"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3">
                                        <div
                                            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold text-white mt-0.5"
                                            style={{ backgroundColor: "var(--color-navy-900)" }}
                                        >
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p
                                                className="font-semibold text-sm"
                                                style={{ color: "var(--color-navy-900)" }}
                                            >
                                                {medicine.name}
                                            </p>
                                            {medicine.dosage && (
                                                <p
                                                    className="text-xs mt-0.5"
                                                    style={{ color: "var(--color-medical-muted)" }}
                                                >
                                                    Dosage: {medicine.dosage}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-2 ml-11">
                                    {medicine.frequency && (
                                        <div
                                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
                                            style={{
                                                backgroundColor: "var(--color-medical-surface)",
                                                border: "1px solid var(--color-medical-border)",
                                                color: "var(--color-medical-muted)",
                                            }}
                                        >
                                            <Clock size={11} />
                                            {medicine.frequency}
                                        </div>
                                    )}
                                    {medicine.duration && (
                                        <div
                                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
                                            style={{
                                                backgroundColor: "var(--color-medical-surface)",
                                                border: "1px solid var(--color-medical-border)",
                                                color: "var(--color-medical-muted)",
                                            }}
                                        >
                                            <Calendar size={11} />
                                            {medicine.duration}
                                        </div>
                                    )}
                                    {medicine.instructions && (
                                        <p
                                            className="text-xs w-full mt-1"
                                            style={{ color: "var(--color-medical-muted)" }}
                                        >
                                            📝 {medicine.instructions}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Important Notes */}
            {result.importantNotes.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 rounded-xl"
                    style={{
                        backgroundColor: "#FFFBEB",
                        border: "1px solid #FDE68A",
                    }}
                >
                    <p
                        className="text-xs font-semibold uppercase tracking-wider mb-3"
                        style={{ color: "#D97706" }}
                    >
                        Important Notes
                    </p>
                    <ul className="space-y-2">
                        {result.importantNotes.map((note, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                                <ChevronRight
                                    size={14}
                                    className="shrink-0 mt-0.5"
                                    style={{ color: "#D97706" }}
                                />
                                <span style={{ color: "var(--color-medical-muted)" }}>
                                    {note}
                                </span>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            )}

            {/* Warnings */}
            {result.warnings.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="p-4 rounded-xl"
                    style={{ backgroundColor: "#FEF2F2", border: "1px solid #FEE2E2" }}
                >
                    <p
                        className="text-xs font-semibold uppercase tracking-wider mb-3"
                        style={{ color: "#EF4444" }}
                    >
                        Warnings
                    </p>
                    <ul className="space-y-2">
                        {result.warnings.map((warning, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                                <AlertTriangle
                                    size={14}
                                    className="shrink-0 mt-0.5"
                                    style={{ color: "#EF4444" }}
                                />
                                <span style={{ color: "var(--color-medical-muted)" }}>
                                    {warning}
                                </span>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            )}

            {/* Follow Up Actions */}
            {result.followUpActions.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-4 rounded-xl"
                    style={{
                        backgroundColor: "#ECFDF5",
                        border: "1px solid #A7F3D0",
                    }}
                >
                    <p
                        className="text-xs font-semibold uppercase tracking-wider mb-3"
                        style={{ color: "#059669" }}
                    >
                        Follow-up Actions
                    </p>
                    <ul className="space-y-2">
                        {result.followUpActions.map((action, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                                <CheckCircle
                                    size={14}
                                    className="shrink-0 mt-0.5"
                                    style={{ color: "#059669" }}
                                />
                                <span style={{ color: "var(--color-medical-muted)" }}>
                                    {action}
                                </span>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            )}
        </div>
    );
};

export default PrescriptionResult;