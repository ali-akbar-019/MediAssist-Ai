import { useState, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronRight,
    ChevronLeft,
    Plus,
    Loader2,
    Activity,
    Shield,
    CheckCircle,
    AlertTriangle,
    Pill,
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
import { cn, isEmergencySymptom } from "../../lib/utils";
import type { SymptomFormData } from "../../types";

const STEPS = [
    { number: 1, label: "Body Part" },
    { number: 2, label: "Symptoms" },
    { number: 3, label: "Details" },
    { number: 4, label: "Analysis" },
];

const SymptomForm = () => {
    const {
        selectedBodyParts,
        formData,
        currentStep,
        isAnalyzing,
        toggleBodyPart,
        removeBodyPart,
        updateFormData,
        nextStep,
        prevStep,
        resetAnalyzer,
    } = useSymptomStore();

    const { handleCreateSymptom, analysisResult } = useSymptoms();
    // console.log("ai analysis result: ", analysisResult);
    const [symptomInput, setSymptomInput] = useState("");
    const [emergencyVisible, setEmergencyVisible] = useState(false);
    const [emergencyTrigger, setEmergencyTrigger] = useState("");

    const currentSuggestions = selectedBodyParts.length > 0
        ? COMMON_SYMPTOMS[selectedBodyParts[0].name] ?? []
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
        if (selectedBodyParts.length === 0 || !formData.symptoms?.length) return;
        await handleCreateSymptom(formData as SymptomFormData);
        nextStep();
    };

    const canProceedStep1 = selectedBodyParts.length > 0;
    const canProceedStep2 = (formData.symptoms?.length ?? 0) > 0;
    const canProceedStep3 =
        !!formData.painType &&
        !!formData.duration &&
        !!formData.durationUnit &&
        !!formData.worseAt;

    return (
        <div className="space-y-12">
            {/* Emergency Alert */}
            <EmergencyAlert
                isVisible={emergencyVisible}
                onClose={() => setEmergencyVisible(false)}
                triggeredBy={emergencyTrigger}
            />

            {/* Clinical Analytics Step Indicator */}
            <div className="relative pt-4">
                <div className="flex items-center justify-between relative z-10">
                    {STEPS.map((step) => {
                        const isCompleted = currentStep > step.number;
                        const isCurrent = currentStep === step.number;

                        return (
                            <div key={step.number} className="flex flex-col items-center group">
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-2xl flex items-center justify-center text-[13px] font-black tracking-tighter transition-all duration-700 border shrink-0 relative",
                                        isCurrent
                                            ? "bg-navy-900 text-white border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-110"
                                            : isCompleted
                                                ? "bg-emerald-500 text-white border-transparent"
                                                : "bg-white/40 text-slate-400 border-white/60"
                                    )}
                                >
                                    {isCompleted ? "✓" : `0${step.number}`}
                                    {isCurrent && (
                                        <div className="absolute -inset-1 rounded-[1.2rem] border border-emerald-500/20 animate-pulse" />
                                    )}
                                </div>
                                <span className={cn(
                                    "text-[9px] uppercase tracking-[0.2em] font-black mt-4 transition-colors duration-500",
                                    isCurrent ? "text-navy-900" : "text-slate-400"
                                )}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
                {/* Connecting Lines with Dynamic Glow */}
                <div className="absolute top-9 left-6 right-6 h-[1.5px] bg-slate-100 z-0">
                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                        className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    />
                </div>
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
                        className="space-y-6"
                    >
                        <div className="text-center">
                            <h3 className="text-xl font-heading font-bold text-navy-900">
                                Where is the discomfort?
                            </h3>
                            <p className="text-sm text-medical-muted mt-1">
                                You can select multiple areas that feel affected
                            </p>
                        </div>
                        <BodyMap
                            selectedParts={selectedBodyParts}
                            onPartToggle={toggleBodyPart}
                            onPartRemove={removeBodyPart}
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
                                    {selectedBodyParts.map((p) => p.name).join(", ")}
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
                                data-testid="symptom-input"
                            />
                            <Button
                                onClick={() => handleAddSymptom(symptomInput)}
                                disabled={!symptomInput.trim()}
                                size="icon"
                                data-testid="symptom-add-btn"
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

                        {/* Severity Slider Module */}
                        <div className="glass-panel p-8 rounded-3xl border-white/40 shadow-sm">
                            <SeveritySlider
                                value={formData.severity ?? 5}
                                onChange={(val) => updateFormData({ severity: val })}
                                data-testid="severity-slider"
                            />
                        </div>

                        {/* Pain Selection Matrix */}
                        <div className="space-y-4">
                            <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-navy-400 ml-1">
                                Physiological Sensation
                            </Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {PAIN_TYPES.map((type) => (
                                    <button
                                        key={type.value}
                                        onClick={() =>
                                            updateFormData({ painType: type.value as never })
                                        }
                                        data-testid={`pain-type-${type.value}`}
                                        className={cn(
                                            "group p-4 rounded-2xl border text-left transition-all duration-500",
                                            formData.painType === type.value
                                                ? "bg-navy-900 border-navy-900 text-white shadow-navy scale-[1.02]"
                                                : "bg-white/40 border-white/60 hover:border-emerald-500/50 hover:bg-emerald-50/10 text-slate-600"
                                        )}
                                    >
                                        <p className="text-sm font-black tracking-tight mb-1">{type.label}</p>
                                        <p
                                            className={cn(
                                                "text-[10px] leading-tight transition-colors",
                                                formData.painType === type.value
                                                    ? "text-emerald-400/80"
                                                    : "text-slate-400 group-hover:text-emerald-600"
                                            )}
                                        >
                                            {type.description}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Temporal Duration */}
                        <div className="space-y-4">
                            <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-navy-400 ml-1">
                                Duration Magnitude
                            </Label>
                            <div className="flex gap-3">
                                <Input
                                    type="number"
                                    min={1}
                                    max={365}
                                    value={formData.duration ?? ""}
                                    onChange={(e) =>
                                        updateFormData({ duration: e.target.value })
                                    }
                                    data-testid="duration-input"
                                    placeholder="Value"
                                    className="flex-1 h-14 bg-white/40 border-white/60 rounded-2xl focus:ring-emerald-500 font-bold"
                                />
                                <Select
                                    value={formData.durationUnit}
                                    onValueChange={(val) =>
                                        updateFormData({ durationUnit: val as never })
                                    }
                                >
                                    <SelectTrigger className="w-40 h-14 bg-white/40 border-white/60 rounded-2xl font-bold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent data-testid="duration-unit" className="glass-panel border-white/20 rounded-2xl shadow-xl">
                                        {DURATION_UNITS.map((unit) => (
                                            <SelectItem data-testid={`duration-option-${unit.value}`} key={unit.value} value={unit.value} className="rounded-xl focus:bg-emerald-50">
                                                {unit.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Diurnal Pattern (Worse At) */}
                        <div className="space-y-4">
                            <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-navy-400 ml-1">
                                Temporal Aggravation
                            </Label>
                            <div className="flex flex-wrap gap-3">
                                {WORSE_AT_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() =>
                                            updateFormData({ worseAt: option.value as never })
                                        }
                                        data-testid={`worse-at-${option.value}`}
                                        className={cn(
                                            "flex items-center gap-3 px-6 py-3 rounded-2xl border text-[13px] font-black tracking-tight transition-all duration-500",
                                            formData.worseAt === option.value
                                                ? "bg-navy-900 border-navy-900 text-white shadow-navy scale-105"
                                                : "bg-white/40 border-white/60 hover:border-emerald-500/50 text-slate-600"
                                        )}
                                    >
                                        <span className="text-lg opacity-80 group-hover:scale-110 transition-transform">{option.icon}</span>
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Clinical Annotations */}
                        <div className="space-y-4">
                            <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-navy-400 ml-1">
                                Clinical Annotations
                            </Label>
                            <div className="relative group">
                                <textarea
                                    value={formData.additionalNotes ?? ""}
                                    onChange={(e) =>
                                        updateFormData({ additionalNotes: e.target.value })
                                    }
                                    placeholder="Optional data insights..."
                                    rows={4}
                                    maxLength={500}
                                    data-testid="clinical-notes"
                                    className="w-full px-6 py-4 rounded-[2rem] bg-white/40 border border-white/60 text-sm text-navy-900 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
                                />
                                <div className="absolute bottom-4 right-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                    {formData.additionalNotes?.length ?? 0} / 500
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Step 4 — Elite AI Signal Analysis */}
                {currentStep === 4 && (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-8"
                    >
                        {isAnalyzing ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-8">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin" />
                                    <div className="absolute inset-4 rounded-full bg-emerald-500/10 animate-pulse flex items-center justify-center">
                                        <Activity className="w-8 h-8 text-emerald-500" />
                                    </div>
                                </div>
                                <div className="text-center space-y-2">
                                    <h4 className="text-xl font-black text-navy-900 tracking-tighter">Initializing Neural Diagnostics</h4>
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-600 font-bold animate-pulse">
                                        Synthesizing Clinical Signal...
                                    </p>
                                </div>
                            </div>
                        ) : analysisResult ? (
                            <div className="space-y-8">
                                <div className="text-center">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy-900 text-white text-[10px] font-bold uppercase tracking-widest mb-6">
                                        Analysis Result Verified
                                    </div>
                                    <h3 className="text-3xl font-black text-navy-900 tracking-tighter">Clinical Summary</h3>
                                </div>

                                {/* Premium Severity Matrix */}
                                <div
                                    data-testid="analysis-severity"
                                    className={cn(
                                        "p-10 rounded-[3rem] text-center border transition-all shadow-luxe relative overflow-hidden",
                                        analysisResult.severity === "emergency" ? "bg-red-500 text-white border-transparent" :
                                            analysisResult.severity === "severe" ? "bg-amber-500 text-white border-transparent" :
                                                "bg-emerald-500 text-white border-transparent"
                                    )}
                                >
                                    <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12">
                                        <Shield className="w-32 h-32" />
                                    </div>
                                    <p className="text-[10px] uppercase tracking-[0.3em] font-black mb-4 opacity-80">
                                        Diagnostic Confidence: High
                                    </p>
                                    <p className="text-5xl font-black capitalize mb-6 italic tracking-tighter">
                                        {analysisResult.severity}
                                    </p>
                                    <div className="h-px bg-white/20 w-24 mx-auto mb-6" />
                                    <p className="text-lg font-medium leading-relaxed max-w-xl mx-auto">
                                        {analysisResult.recommendation}
                                    </p>
                                </div>

                                {/* Possible Conditions - Elite Grid */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-navy-400 ml-1">
                                        Statistical Probabilities
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {analysisResult.possibleConditions.map((condition, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                data-testid={`condition-${index}`}
                                                className="glass-panel p-6 rounded-3xl border-white/60 hover:border-emerald-500/30 transition-all group"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-sm font-black text-navy-900 tracking-tight">
                                                        {condition.name}
                                                    </span>
                                                    <span
                                                        className={cn(
                                                            "text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter",
                                                            condition.probability === "high"
                                                                ? "bg-red-100 text-red-600"
                                                                : condition.probability === "medium"
                                                                    ? "bg-amber-100 text-amber-600"
                                                                    : "bg-emerald-100 text-emerald-600"
                                                        )}
                                                    >
                                                        {condition.probability}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-slate-500 leading-relaxed font-medium group-hover:text-navy-700 transition-colors">
                                                    {condition.description}
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Clinical Guidance */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-navy-400 ml-1">
                                        Clinical Guidance
                                    </h4>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        {/* Recommendation */}
                                        <div className="p-6 rounded-[2rem] bg-white/55 border border-white/70 shadow-soft">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-8 h-8 rounded-xl bg-navy-900 flex items-center justify-center shrink-0">
                                                    <Shield className="w-4 h-4 text-emerald-400" />
                                                </div>
                                                <h4 className="text-sm font-black text-navy-900 tracking-tight">
                                                    Recommendation
                                                </h4>
                                            </div>
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                {analysisResult.recommendation}
                                            </p>
                                        </div>

                                        {/* Home Remedies */}
                                        <div className="p-6 rounded-[2rem] bg-emerald-50 border border-emerald-100 shadow-soft">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                                    <CheckCircle className="w-4 h-4 text-white" />
                                                </div>
                                                <h4 className="text-sm font-black text-emerald-800 tracking-tight">
                                                    Home Remedies
                                                </h4>
                                            </div>
                                            <ul className="space-y-3">
                                                {analysisResult.homeRemedies.map((remedy, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed"
                                                    >
                                                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                                                        <span>{remedy}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                    </div>
                                    {/* Medicines to Consider */}
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
                                            {analysisResult.medicinesToConsider?.map((medicine, index) => (
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
                                    {/* When to See a Doctor */}
                                    <div className="p-6 rounded-[2rem] bg-amber-50 border border-amber-100 shadow-soft">
                                        <div className="flex items-start gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                                                <AlertTriangle className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-black text-amber-800 tracking-tight mb-1">
                                                    When to See a Doctor
                                                </h4>
                                                <p className="text-sm text-amber-900/90 leading-relaxed">
                                                    {analysisResult.whenToSeeDoctor}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Reset Prototype */}
                                <Button
                                    onClick={resetAnalyzer}
                                    variant="outline"
                                    data-testid="analyzer-reset"
                                    className="h-16 rounded-2xl border-navy-900 text-navy-900 font-black text-[13px] uppercase tracking-widest hover:bg-navy-900 hover:text-white transition-all w-full"
                                >
                                    Initiate New Clinical Signal
                                </Button>
                            </div>
                        ) : null}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Elite Navigation Controls */}
            {currentStep < 4 && (
                <div className="pt-8 border-t border-white/60">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-6">
                        <div className="flex-1">
                            <Button
                                variant="ghost"
                                data-testid="analyzer-back"
                                onClick={currentStep === 1 ? resetAnalyzer : prevStep}
                                className="w-full sm:w-auto h-14 sm:h-14 px-6 sm:px-8 rounded-2xl text-[13px] font-black uppercase tracking-widest text-slate-400 hover:text-navy-900 hover:bg-white/60 transition-all"
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                {currentStep === 1 ? "Reset Signal" : "Retrograde"}
                            </Button>
                        </div>

                        <div className="flex-1 sm:flex-none">
                            {currentStep < 3 ? (
                                <Button
                                    onClick={nextStep}
                                    disabled={
                                        (currentStep === 1 && !canProceedStep1) ||
                                        (currentStep === 2 && !canProceedStep2)
                                    }
                                    data-testid="analyzer-continue"
                                    className="w-full h-14 sm:h-16 px-6 sm:px-12 rounded-2xl bg-navy-900 text-white text-[13px] font-black uppercase tracking-widest hover:bg-navy-950 transition-all shadow-navy"
                                >
                                    Continue
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!canProceedStep3 || isAnalyzing}
                                    data-testid="analyzer-submit"
                                    className="w-full h-14 sm:h-16 px-6 sm:px-12 rounded-2xl bg-navy-900 text-white text-[13px] font-black uppercase tracking-widest hover:bg-navy-950 transition-all shadow-navy"
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-3 animate-spin" />
                                            Synthesizing...
                                        </>
                                    ) : (
                                        <>
                                            Verify Analysis
                                            <ChevronRight className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SymptomForm;