import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload,
    FileText,
    Image,
    X,
    CheckCircle,
    AlertCircle,
    ScanLine,
    Pill,
    Microscope,
    Building2,
    FileSearch,
} from "lucide-react";
import type { OCRDocumentType } from "../../types";
import { cn, formatFileSize } from "../../lib/utils";

interface DocumentUploaderProps {
    onFileSelect: (file: File, type: OCRDocumentType) => void;
    isUploading?: boolean;
    uploadProgress?: number;
    error?: string | null;
    onClear?: () => void;
    uploadedFileName?: string;
}

const DOCUMENT_TYPES: Array<{
    value: OCRDocumentType;
    label: string;
    description: string;
    icon: any;
}> = [
        {
            value: "prescription",
            label: "Prescription",
            description: "Pharmacological orders",
            icon: Pill,
        },
        {
            value: "lab_report",
            label: "Lab Report",
            description: "Biometric analysis data",
            icon: Microscope,
        },
        {
            value: "medical_report",
            label: "Medical Report",
            description: "Clinical diagnostics",
            icon: Building2,
        },
        {
            value: "other",
            label: "General File",
            description: "Miscellaneous clinical documentation",
            icon: FileSearch,
        },
    ];

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const DocumentUploader = ({
    onFileSelect,
    isUploading = false,
    uploadProgress = 0,
    error,
    onClear,
    uploadedFileName,
}: DocumentUploaderProps) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [selectedType, setSelectedType] =
        useState<OCRDocumentType>("prescription");
    const [localError, setLocalError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): string | null => {
        if (!ACCEPTED_TYPES.includes(file.type)) {
            return "Please upload a JPG, PNG, WebP image or PDF file.";
        }
        if (file.size > MAX_SIZE) {
            return "File too large. Maximum size is 10MB.";
        }
        return null;
    };

    const handleFile = useCallback(
        (file: File) => {
            setLocalError(null);
            const validationError = validateFile(file);
            if (validationError) {
                setLocalError(validationError);
                return;
            }
            setSelectedFile(file);
            onFileSelect(file, selectedType);
        },
        [selectedType, onFileSelect]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
        },
        [handleFile]
    );

    const handleClear = () => {
        setSelectedFile(null);
        setLocalError(null);
        if (inputRef.current) inputRef.current.value = "";
        onClear?.();
    };

    const displayError = error ?? localError;
    const isUploaded = !!uploadedFileName && !isUploading;
    const isImage = selectedFile?.type.startsWith("image/");

    return (
        <div className="space-y-5">
            {/* Document Type Selector */}
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-2">
                    Classification Registry
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {DOCUMENT_TYPES.map((type) => {
                        const Icon = type.icon;
                        const isSelected = selectedType === type.value;
                        return (
                            <button
                                key={type.value}
                                onClick={() => setSelectedType(type.value)}
                                className={cn(
                                    "flex flex-col items-center text-center gap-3 p-4 rounded-2xl border transition-all duration-300",
                                    isSelected
                                        ? "bg-navy-900 border-navy-900 shadow-lg scale-[1.02]"
                                        : "bg-white/50 border-slate-100 hover:border-emerald-200"
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                                    isSelected ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-50 text-slate-400"
                                )}>
                                    <Icon size={20} />
                                </div>
                                <div>
                                    <p className={cn(
                                        "text-xs font-bold tracking-tight",
                                        isSelected ? "text-white" : "text-navy-900"
                                    )}>
                                        {type.label}
                                    </p>
                                    <p className={cn(
                                        "text-[9px] font-medium leading-tight mt-1 opacity-60",
                                        isSelected ? "text-emerald-100" : "text-slate-500"
                                    )}>
                                        {type.description}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Upload Zone */}
            <AnimatePresence mode="wait">
                {isUploaded ? (
                    <motion.div
                        key="uploaded"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-4 p-4 rounded-xl border-2"
                        style={{
                            borderColor: "var(--color-emerald-500)",
                            backgroundColor: "var(--color-emerald-50)",
                        }}
                    >
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
                            {isImage ? (
                                <Image size={20} style={{ color: "var(--color-navy-900)" }} />
                            ) : (
                                <FileText
                                    size={20}
                                    style={{ color: "var(--color-navy-900)" }}
                                />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p
                                className="text-sm font-semibold truncate"
                                style={{ color: "var(--color-navy-900)" }}
                            >
                                {uploadedFileName}
                            </p>
                            {selectedFile && (
                                <p
                                    className="text-xs mt-0.5"
                                    style={{ color: "var(--color-medical-muted)" }}
                                >
                                    {formatFileSize(selectedFile.size)}
                                </p>
                            )}
                        </div>
                        <CheckCircle
                            size={20}
                            style={{ color: "var(--color-emerald-500)" }}
                        />
                        <button
                            onClick={handleClear}
                            className="p-1 rounded-lg hover:bg-white/50 transition-colors"
                            style={{ color: "var(--color-medical-muted)" }}
                        >
                            <X size={16} />
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="dropzone"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onDrop={handleDrop}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragOver(true);
                        }}
                        onDragLeave={() => setIsDragOver(false)}
                        onClick={() => !isUploading && inputRef.current?.click()}
                        className={cn(
                            "relative flex flex-col items-center justify-center p-16",
                            "rounded-[2.5rem] border-2 border-dashed cursor-pointer",
                            "transition-all duration-500 group"
                        )}
                        style={{
                            borderColor: isDragOver
                                ? "var(--color-emerald-500)"
                                : displayError
                                    ? "#EF4444"
                                    : "rgba(30,58,95,0.1)",
                            backgroundColor: isDragOver
                                ? "rgba(16,185,129,0.02)"
                                : "rgba(255,255,255,0.3)",
                        }}
                    >
                        <motion.div
                            animate={isDragOver ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
                            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                            style={{
                                backgroundColor: isDragOver
                                    ? "var(--color-navy-900)"
                                    : "white",
                                border: "1px solid var(--color-medical-border)",
                            }}
                        >
                            {isDragOver ? (
                                <Upload size={24} color="white" />
                            ) : (
                                <ScanLine
                                    size={24}
                                    style={{ color: "var(--color-navy-900)" }}
                                />
                            )}
                        </motion.div>

                        <p
                            className="font-semibold text-base mb-1"
                            style={{ color: "var(--color-navy-900)" }}
                        >
                            {isDragOver ? "Drop document here" : "Upload Medical Document"}
                        </p>
                        <p
                            className="text-sm mb-4"
                            style={{ color: "var(--color-medical-muted)" }}
                        >
                            or{" "}
                            <span
                                className="font-medium underline"
                                style={{ color: "var(--color-navy-900)" }}
                            >
                                browse files
                            </span>
                        </p>

                        <div className="flex items-center gap-2 flex-wrap justify-center">
                            {["JPG", "PNG", "PDF", "WebP"].map((fmt) => (
                                <span
                                    key={fmt}
                                    className="px-2 py-0.5 text-xs font-medium rounded-lg border"
                                    style={{
                                        borderColor: "var(--color-medical-border)",
                                        color: "var(--color-medical-muted)",
                                        backgroundColor: "white",
                                    }}
                                >
                                    {fmt}
                                </span>
                            ))}
                            <span
                                className="text-xs"
                                style={{ color: "var(--color-medical-muted)" }}
                            >
                                up to 10MB
                            </span>
                        </div>

                        {/* Upload Progress */}
                        <AnimatePresence>
                            {isUploading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm"
                                >
                                    <div className="w-48 space-y-3">
                                        <p
                                            className="text-sm font-medium text-center"
                                            style={{ color: "var(--color-navy-900)" }}
                                        >
                                            Uploading & Analyzing... {uploadProgress}%
                                        </p>
                                        <div
                                            className="w-full h-2 rounded-full overflow-hidden"
                                            style={{
                                                backgroundColor: "var(--color-medical-border)",
                                            }}
                                        >
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${uploadProgress}%` }}
                                                className="h-full rounded-full"
                                                style={{
                                                    backgroundColor: "var(--color-navy-900)",
                                                }}
                                            />
                                        </div>
                                        <p
                                            className="text-xs text-center"
                                            style={{ color: "var(--color-medical-muted)" }}
                                        >
                                            AI is reading your document...
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
                {displayError && (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                        style={{ backgroundColor: "#FEF2F2", border: "1px solid #FEE2E2" }}
                    >
                        <AlertCircle size={14} style={{ color: "#EF4444" }} />
                        <p className="text-xs font-medium" style={{ color: "#EF4444" }}>
                            {displayError}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                }}
                className="hidden"
            />
        </div>
    );
};

export default DocumentUploader;