import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { cn } from "../../lib/utils";

interface QuickSymptomsProps {
    selectedSymptoms: string[];
    onToggle: (symptom: string) => void;
}

const EMERGENCY_SYMPTOMS = [
    { label: "Chest Pain", icon: "💔", critical: true },
    { label: "Difficulty Breathing", icon: "😮‍💨", critical: true },
    { label: "Severe Bleeding", icon: "🩸", critical: true },
    { label: "Loss of Consciousness", icon: "😵", critical: true },
    { label: "Stroke Symptoms", icon: "🧠", critical: true },
    { label: "Severe Allergic Reaction", icon: "⚠️", critical: true },
    { label: "Seizure", icon: "⚡", critical: true },
    { label: "Heart Attack", icon: "❤️", critical: true },
    { label: "Severe Head Injury", icon: "🤕", critical: false },
    { label: "High Fever", icon: "🌡️", critical: false },
    { label: "Severe Vomiting", icon: "🤢", critical: false },
    { label: "Severe Abdominal Pain", icon: "🫁", critical: false },
    { label: "Broken Bone", icon: "🦴", critical: false },
    { label: "Burns", icon: "🔥", critical: false },
    { label: "Poisoning", icon: "☠️", critical: false },
    { label: "Drowning", icon: "💧", critical: false },
];

const QuickSymptoms = ({
    selectedSymptoms,
    onToggle,
}: QuickSymptomsProps) => {
    const criticalSymptoms = EMERGENCY_SYMPTOMS.filter((s) => s.critical);
    const otherSymptoms = EMERGENCY_SYMPTOMS.filter((s) => !s.critical);

    const SymptomButton = ({
        symptom,
        index,
    }: {
        symptom: (typeof EMERGENCY_SYMPTOMS)[0];
        index: number;
    }) => {
        const isSelected = selectedSymptoms.includes(symptom.label);
        return (
            <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onToggle(symptom.label)}
                className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium",
                    "transition-all duration-200 text-left"
                )}
                style={{
                    backgroundColor: isSelected
                        ? symptom.critical
                            ? "#EF4444"
                            : "#F59E0B"
                        : "white",
                    borderColor: isSelected
                        ? symptom.critical
                            ? "#EF4444"
                            : "#F59E0B"
                        : symptom.critical
                            ? "#FEE2E2"
                            : "var(--color-medical-border)",
                    color: isSelected ? "white" : "var(--color-medical-text)",
                }}
            >
                <span className="text-base">{symptom.icon}</span>
                <span className="text-xs">{symptom.label}</span>
                {symptom.critical && !isSelected && (
                    <AlertTriangle
                        size={11}
                        className="ml-auto shrink-0"
                        style={{ color: "#EF4444" }}
                    />
                )}
            </motion.button>
        );
    };

    return (
        <div className="space-y-4">
            {/* Critical Symptoms */}
            <div>
                <p
                    className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5"
                    style={{ color: "#EF4444" }}
                >
                    <AlertTriangle size={12} />
                    Critical Symptoms
                </p>
                <div className="grid grid-cols-2 gap-2">
                    {criticalSymptoms.map((symptom, i) => (
                        <SymptomButton key={symptom.label} symptom={symptom} index={i} />
                    ))}
                </div>
            </div>

            {/* Other Symptoms */}
            <div>
                <p
                    className="text-xs font-semibold uppercase tracking-wider mb-2"
                    style={{ color: "var(--color-medical-muted)" }}
                >
                    Other Emergency Symptoms
                </p>
                <div className="grid grid-cols-2 gap-2">
                    {otherSymptoms.map((symptom, i) => (
                        <SymptomButton
                            key={symptom.label}
                            symptom={symptom}
                            index={criticalSymptoms.length + i}
                        />
                    ))}
                </div>
            </div>

            {/* Selected Count */}
            {selectedSymptoms.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-3 rounded-xl"
                    style={{ backgroundColor: "#FEF2F2", border: "1px solid #FEE2E2" }}
                >
                    <span className="text-sm font-medium" style={{ color: "#EF4444" }}>
                        {selectedSymptoms.length} symptom
                        {selectedSymptoms.length > 1 ? "s" : ""} selected
                    </span>
                    <button
                        onClick={() =>
                            selectedSymptoms.forEach((s) => onToggle(s))
                        }
                        className="text-xs underline"
                        style={{ color: "#EF4444" }}
                    >
                        Clear all
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default QuickSymptoms;