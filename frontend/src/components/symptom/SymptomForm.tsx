import { useState, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronRight,
    ChevronLeft,
    Plus,
    Loader2,
    AlertTriangle,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import { SymptomTag, SymptomSuggestions } from "./SymptomTag";
import SeveritySlider from "./SeveritySlider";
import BodyMap from "../../components/body-map/BodyMap";
import EmergencyAlert from "../../components/emergency/EmergencyAlert";
import { useSymptomStore } from "../../store/symptomStore";
import { useSymptoms } from "../../hooks/useSymptoms";
import {
    PAIN_TYPES,
    DURATION_UNITS,
    WORSE_AT_OPTIONS,
    COMMON_SYMPTOMS,
} from "../../constants";
import { isEmergencySymptom } from "../../lib/utils";
import type { SymptomFormData } from "../../types";

const STEPS = [
    { number: 1, label: "Body Part" },
    { number: 2, label: "Symptoms" },
    { number: 3, label: "Details" },
    { number: 4, label: "Analysis" },
];

const SymptomForm = () => {
    const {
        selectedBodyPart,
        formData,
        currentStep,
        isAnalyzing,
        setSelectedBodyPart,
        updateFormData,
        nextStep,
        prevStep,
        resetAnalyzer,
    } = useSymptomStore();

    const { handleCreateSymptom, analysisResult } = useSymptoms();

    const [symptomInput, setSymptomInput] = useState("");
    const [emergencyVisible, setEmergencyVisible] = useState(false);
    const [emergencyTrigger, setEmergencyTrigger] = useState("");

    const currentSuggestions = selectedBodyPart
        ? COMMON_SYMPTOMS[selectedBodyPart.name] ?? []
        : [];

    const handleAddSymptom = (symptom: string) => {
        const trimmed = symptom.trim();
        if (!trimmed) return;

        // Check for emergency symptoms
        if (isEmergencySymptom(trimmed)) {
            setEmergencyTrigger(trimmed);
            setEmergencyVisible(true);
        }

        const current = formData.symptoms ?? [];
        if (!current.includes(trimmed)) {
            updateFormData({ symptoms: [...current, trimmed] });
        }
        setSymptomInput("");
    };

    const handleRemoveSymptom = (symptom: string) => {
        const current = formData.symptoms ?? [];
        updateFormData({ symptoms: current.filter((s) => s !== symptom) });
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddSymptom(symptomInput);
        }
    };

    const handleSubmit = async () => {
        if (!selectedBodyPart || !formData.symptoms?.length) return;
        await handleCreateSymptom(formData as SymptomFormData);
        nextStep();
    };

    const canProceedStep1 = !!selectedBodyPart;
    const canProceedStep2 = (formData.symptoms?.length ?? 0) > 0;
    const canProceedStep3 =
        !!formData.painType &&
        !!formData.duration &&
        !!formData.durationUnit &&
        !!formData.worseAt;

    return (
        <div className="space-y-6">
            {/* Emergency Alert */}
            <EmergencyAlert
                isVisible={emergencyVisible}
                onClose={() => setEmergencyVisible(false)}
                triggeredBy={emergencyTrigger}
            />

            {/* Step Indicator */}
            <div className="flex items-center justify-between">
                {STEPS.map((step, index) => (
                    <div key={step.number} className="flex items-center">
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${currentStep === step.number
                                    ? "bg-navy-900 text-white"
                                    : currentStep > step.number
                                        ? "bg-emerald-500 text-white"
                                        : "bg-medical-surface text-medical-muted border border-medical-border"
                                    }`}
                            >
                                {currentStep > step.number ? "✓" : step.number}
                            </div>
                            <span className="text-xs text-medical-muted mt-1 hidden sm:block">
                                {step.label}
                            </span>
                        </div>
                        {index < STEPS.length - 1 && (
                            <div
                                className={`flex-1 h-0.5 mx-2 transition-all ${currentStep > step.number
                                    ? "bg-emerald-500"
                                    : "bg-medical-border"
                                    }`}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
                {/* Step 1 — Body Part Selection */}
                {currentStep === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                    >
                        <div className="text-center">
                            <h3 className="text-lg font-heading font-semibold text-navy-900">
                                Where does it hurt?
                            </h3>
                            <p className="text-sm text-medical-muted mt-1">
                                Click on the body part to select it
                            </p>
                        </div>
                        <BodyMap
                            selectedPart={selectedBodyPart}
                            onPartSelect={setSelectedBodyPart}
                        />
                    </motion.div>
                )}

                {/* Step 2 — Symptoms */}
                {currentStep === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-5"
                    >
                        <div>
                            <h3 className="text-lg font-heading font-semibold text-navy-900">
                                What are your symptoms?
                            </h3>
                            <p className="text-sm text-medical-muted mt-1">
                                Add all symptoms you are experiencing in{" "}
                                <span className="font-medium text-navy-900">
                                    {selectedBodyPart?.name}
                                </span>
                            </p>
                        </div>

                        {/* Symptom Input */}
                        <div className="flex gap-2">
                            <Input
                                value={symptomInput}
                                onChange={(e) => setSymptomInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type a symptom and press Enter..."
                                className="flex-1"
                            />
                            <Button
                                onClick={() => handleAddSymptom(symptomInput)}
                                disabled={!symptomInput.trim()}
                                size="icon"
                                className="bg-navy-900 hover:bg-navy-800 text-white shrink-0"
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Selected Symptoms */}
                        <AnimatePresence>
                            {(formData.symptoms?.length ?? 0) > 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-wrap gap-2"
                                >
                                    {formData.symptoms?.map((symptom) => (
                                        <SymptomTag
                                            key={symptom}
                                            symptom={symptom}
                                            onRemove={handleRemoveSymptom}
                                        />
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Suggestions */}
                        <SymptomSuggestions
                            suggestions={currentSuggestions}
                            selectedSymptoms={formData.symptoms ?? []}
                            onAdd={handleAddSymptom}
                        />
                    </motion.div>
                )}

                {/* Step 3 — Pain Details */}
                {currentStep === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-5"
                    >
                        <div>
                            <h3 className="text-lg font-heading font-semibold text-navy-900">
                                Tell us more about your pain
                            </h3>
                            <p className="text-sm text-medical-muted mt-1">
                                These details help our AI give you a more accurate analysis
                            </p>
                        </div>

                        {/* Severity Slider */}
                        <div className="medical-card p-4">
                            <SeveritySlider
                                value={formData.severity ?? 5}
                                onChange={(val) => updateFormData({ severity: val })}
                            />
                        </div>

                        {/* Pain Type */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-medical-text">
                                Pain Type
                            </Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {PAIN_TYPES.map((type) => (
                                    <button
                                        key={type.value}
                                        onClick={() =>
                                            updateFormData({ painType: type.value as never })
                                        }
                                        className={`p-3 rounded-xl border text-left transition-all ${formData.painType === type.value
                                            ? "border-navy-900 bg-navy-900 text-white"
                                            : "border-medical-border hover:border-navy-300 text-medical-text"
                                            }`}
                                    >
                                        <p className="text-sm font-medium">{type.label}</p>
                                        <p
                                            className={`text-xs mt-0.5 ${formData.painType === type.value
                                                ? "text-navy-200"
                                                : "text-medical-muted"
                                                }`}
                                        >
                                            {type.description}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-medical-text">
                                How long have you had this?
                            </Label>
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    min={1}
                                    max={365}
                                    value={formData.duration ?? ""}
                                    onChange={(e) =>
                                        updateFormData({ duration: e.target.value })
                                    }
                                    placeholder="Duration"
                                    className="flex-1"
                                />
                                <Select
                                    value={formData.durationUnit}
                                    onValueChange={(val) =>
                                        updateFormData({ durationUnit: val as never })
                                    }
                                >
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DURATION_UNITS.map((unit) => (
                                            <SelectItem key={unit.value} value={unit.value}>
                                                {unit.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Worse At */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-medical-text">
                                When is it worse?
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {WORSE_AT_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() =>
                                            updateFormData({ worseAt: option.value as never })
                                        }
                                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${formData.worseAt === option.value
                                            ? "border-navy-900 bg-navy-900 text-white"
                                            : "border-medical-border hover:border-navy-300 text-medical-text"
                                            }`}
                                    >
                                        <span>{option.icon}</span>
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Additional Notes */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-medical-text">
                                Additional Notes{" "}
                                <span className="text-medical-muted font-normal">
                                    (optional)
                                </span>
                            </Label>
                            <textarea
                                value={formData.additionalNotes ?? ""}
                                onChange={(e) =>
                                    updateFormData({ additionalNotes: e.target.value })
                                }
                                placeholder="Any other details about your symptoms..."
                                rows={3}
                                maxLength={500}
                                className="w-full px-3 py-2 rounded-xl border border-medical-border text-sm text-medical-text placeholder:text-medical-muted resize-none focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                            />
                            <p className="text-xs text-medical-muted text-right">
                                {formData.additionalNotes?.length ?? 0}/500
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Step 4 — Analysis Result */}
                {currentStep === 4 && (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                    >
                        {isAnalyzing ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-4">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                    <Loader2 className="w-12 h-12 text-navy-900" />
                                </motion.div>
                                <div className="text-center">
                                    <p className="font-medium text-navy-900">
                                        Analyzing your symptoms...
                                    </p>
                                    <p className="text-sm text-medical-muted mt-1">
                                        Our AI is reviewing your information
                                    </p>
                                </div>
                            </div>
                        ) : analysisResult ? (
                            <div className="space-y-4">
                                <div className="text-center">
                                    <h3 className="text-lg font-heading font-semibold text-navy-900">
                                        Analysis Complete
                                    </h3>
                                    <p className="text-sm text-medical-muted">
                                        Based on your symptoms, here is what our AI found
                                    </p>
                                </div>

                                {/* Severity Badge */}
                                <div
                                    className={`p-4 rounded-xl text-center severity-${analysisResult.severity}`}
                                >
                                    <p className="text-xs font-medium uppercase tracking-wider mb-1">
                                        Overall Severity
                                    </p>
                                    <p className="text-2xl font-bold capitalize">
                                        {analysisResult.severity}
                                    </p>
                                    <p className="text-sm mt-1">{analysisResult.recommendation}</p>
                                </div>

                                {/* Possible Conditions */}
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-navy-900">
                                        Possible Conditions
                                    </h4>
                                    {analysisResult.possibleConditions.map((condition, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="medical-card p-3"
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium text-navy-900">
                                                    {condition.name}
                                                </span>
                                                <span
                                                    className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${condition.probability === "high"
                                                        ? "bg-red-50 text-red-600"
                                                        : condition.probability === "medium"
                                                            ? "bg-amber-50 text-amber-600"
                                                            : "bg-emerald-50 text-emerald-600"
                                                        }`}
                                                >
                                                    {condition.probability} probability
                                                </span>
                                            </div>
                                            <p className="text-xs text-medical-muted">
                                                {condition.description}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Home Remedies */}
                                <div className="medical-card p-4 space-y-2">
                                    <h4 className="text-sm font-semibold text-navy-900">
                                        Home Remedies
                                    </h4>
                                    <ul className="space-y-1.5">
                                        {analysisResult.homeRemedies.map((remedy, index) => (
                                            <li
                                                key={index}
                                                className="flex items-start gap-2 text-sm text-medical-muted"
                                            >
                                                <span className="text-emerald-500 mt-0.5">•</span>
                                                {remedy}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* When to See Doctor */}
                                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                                    <div className="flex items-start gap-2">
                                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-amber-800">
                                                When to See a Doctor
                                            </p>
                                            <p className="text-xs text-amber-700 mt-0.5">
                                                {analysisResult.whenToSeeDoctor}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Reset Button */}
                                <Button
                                    onClick={resetAnalyzer}
                                    variant="outline"
                                    className="w-full border-navy-900 text-navy-900 hover:bg-navy-50"
                                >
                                    Start New Analysis
                                </Button>
                            </div>
                        ) : null}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            {currentStep < 4 && (
                <div className="flex items-center justify-between pt-2">
                    <Button
                        variant="ghost"
                        onClick={currentStep === 1 ? resetAnalyzer : prevStep}
                        className="text-medical-muted hover:text-navy-900"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        {currentStep === 1 ? "Reset" : "Back"}
                    </Button>

                    {currentStep < 3 ? (
                        <Button
                            onClick={nextStep}
                            disabled={
                                (currentStep === 1 && !canProceedStep1) ||
                                (currentStep === 2 && !canProceedStep2)
                            }
                            className="bg-navy-900 hover:bg-navy-800 text-white"
                        >
                            Continue
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={!canProceedStep3 || isAnalyzing}
                            className="bg-navy-900 hover:bg-navy-800 text-white"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    Analyze Symptoms
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </>
                            )}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default SymptomForm;