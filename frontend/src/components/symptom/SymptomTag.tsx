import { motion } from "framer-motion";
import { X, Plus } from "lucide-react";
import { cn } from "../../lib/utils";

interface SymptomTagProps {
    symptom: string;
    onRemove: (symptom: string) => void;
    "data-testid"?: string;  // ADDED
}

interface SymptomSuggestionProps {
    suggestions: string[];
    selectedSymptoms: string[];
    onAdd: (symptom: string) => void;
}

export const SymptomTag = ({ symptom, onRemove, "data-testid": testId }: SymptomTagProps) => {  // ADDED
    return (
        <motion.div
            data-testid={testId}  // ADDED
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-900 text-white rounded-full text-sm font-medium"
        >
            <span>{symptom}</span>
            <button
                onClick={() => onRemove(symptom)}
                data-testid={`symptom-tag-remove-${symptom}`}  // ADDED
                className="w-4 h-4 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
                <X className="w-2.5 h-2.5" />
            </button>
        </motion.div>
    );
};

export const SymptomSuggestions = ({
    suggestions,
    selectedSymptoms,
    onAdd,
}: SymptomSuggestionProps) => {
    const availableSuggestions = suggestions.filter(
        (s) => !selectedSymptoms.includes(s)
    );

    if (availableSuggestions.length === 0) return null;

    return (
        <div className="space-y-2" data-testid="symptom-suggestions-container">  {/* ADDED */}
            <p className="text-xs text-medical-muted font-medium">
                Common symptoms — click to add:
            </p>
            <div className="flex flex-wrap gap-2">
                {availableSuggestions.map((symptom) => (
                    <motion.button
                        key={symptom}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onAdd(symptom)}
                        data-testid={`symptom-suggestion-${symptom}`}  // ADDED
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                            "border border-medical-border text-medical-muted",
                            "hover:border-navy-900 hover:text-navy-900 hover:bg-navy-50"
                        )}
                    >
                        <Plus className="w-3 h-3" />
                        {symptom}
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default SymptomTag;