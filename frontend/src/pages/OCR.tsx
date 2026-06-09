import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanLine, History } from "lucide-react";
import DocumentUploader from "../components/ocr/DocumentUploader";
import OCRResultView from "../components/ocr/OCRResultView";
import OCRHistory from "../components/ocr/OCRHistory";
import {
    uploadAndAnalyzeDocument,
    getOCRHistory,
    deleteOCRResult,
} from "../services/ocrService";
import type { OCRResult, OCRDocumentType } from "../types";
import { cn } from "../lib/utils";

const OCRPage = () => {
    const [currentResult, setCurrentResult] = useState<OCRResult | null>(null);
    const [history, setHistory] = useState<OCRResult[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [uploadedFileName, setUploadedFileName] = useState<string>("");
    const [activeTab, setActiveTab] = useState<"scan" | "history">("scan");

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getOCRHistory();
                setHistory(data);
            } catch {
                // handle
            } finally {
                setIsLoadingHistory(false);
            }
        };
        fetchHistory();
    }, []);

    const handleFileSelect = async (file: File, type: OCRDocumentType) => {
        try {
            setError(null);
            setIsUploading(true);
            setUploadedFileName(file.name);
            setUploadProgress(0);

            const result = await uploadAndAnalyzeDocument(file, type, (progress) => {
                setUploadProgress(progress);
            });

            setCurrentResult(result);
            setHistory((prev) => [result, ...prev]);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to analyze document. Please try again."
            );
            setUploadedFileName("");
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteOCRResult(id);
            setHistory((prev) => prev.filter((h) => h._id !== id));
            if (currentResult?._id === id) {
                setCurrentResult(null);
            }
        } catch {
            // handle
        }
    };

    const handleReset = () => {
        setCurrentResult(null);
        setUploadedFileName("");
        setError(null);
    };

    return (
        <div
            className="min-h-[calc(100vh-4rem)] py-10"
            style={{ backgroundColor: "var(--color-medical-surface)" }}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 mb-8"
                >
                    <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: "var(--color-navy-900)" }}
                    >
                        <ScanLine size={22} color="white" />
                    </div>
                    <div>
                        <h1
                            className="font-heading font-bold text-2xl"
                            style={{ color: "var(--color-navy-900)" }}
                        >
                            Document Scanner
                        </h1>
                        <p
                            className="text-sm"
                            style={{ color: "var(--color-medical-muted)" }}
                        >
                            Upload prescriptions & lab reports — AI explains everything
                        </p>
                    </div>
                </motion.div>

                {/* Tab Switcher */}
                <div
                    className="flex items-center gap-1 p-1 rounded-xl mb-6 w-fit"
                    style={{ backgroundColor: "var(--color-medical-border)" }}
                >
                    {[
                        { id: "scan", label: "New Scan", icon: ScanLine },
                        { id: "history", label: "History", icon: History },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as "scan" | "history")}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium",
                                    "transition-all duration-200"
                                )}
                                style={{
                                    backgroundColor:
                                        activeTab === tab.id ? "white" : "transparent",
                                    color:
                                        activeTab === tab.id
                                            ? "var(--color-navy-900)"
                                            : "var(--color-medical-muted)",
                                    boxShadow:
                                        activeTab === tab.id ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                                }}
                            >
                                <Icon size={15} />
                                {tab.label}
                                {tab.id === "history" && history.length > 0 && (
                                    <span
                                        className="px-1.5 py-0.5 text-xs font-bold rounded-full"
                                        style={{
                                            backgroundColor:
                                                activeTab === tab.id
                                                    ? "var(--color-navy-900)"
                                                    : "var(--color-medical-muted)",
                                            color: "white",
                                        }}
                                    >
                                        {history.length}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === "scan" ? (
                        <motion.div
                            key="scan"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                        >
                            {currentResult ? (
                                <OCRResultView
                                    result={currentResult}
                                    onReset={handleReset}
                                    onDelete={handleDelete}
                                />
                            ) : (
                                <div
                                    className="bg-white rounded-2xl border p-6 sm:p-8"
                                    style={{ borderColor: "var(--color-medical-border)" }}
                                >
                                    {/* Info Banner */}
                                    <div
                                        className="flex items-start gap-3 p-4 rounded-xl mb-6"
                                        style={{
                                            backgroundColor: "var(--color-navy-50, #EFF6FF)",
                                            border: "1px solid rgba(30,58,95,0.1)",
                                        }}
                                    >
                                        <ScanLine
                                            size={16}
                                            className="shrink-0 mt-0.5"
                                            style={{ color: "var(--color-navy-900)" }}
                                        />
                                        <div>
                                            <p
                                                className="text-sm font-semibold"
                                                style={{ color: "var(--color-navy-900)" }}
                                            >
                                                How it works
                                            </p>
                                            <p
                                                className="text-xs mt-0.5 leading-relaxed"
                                                style={{ color: "var(--color-medical-muted)" }}
                                            >
                                                Upload a photo or PDF of your prescription or lab report.
                                                Our AI will extract the text, identify medicines & test
                                                values, and explain everything in simple language.
                                            </p>
                                        </div>
                                    </div>

                                    <DocumentUploader
                                        onFileSelect={handleFileSelect}
                                        isUploading={isUploading}
                                        uploadProgress={uploadProgress}
                                        error={error}
                                        uploadedFileName={uploadedFileName}
                                        onClear={handleReset}
                                    />
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="history"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="bg-white rounded-2xl border p-5"
                            style={{ borderColor: "var(--color-medical-border)" }}
                        >
                            <OCRHistory
                                history={history}
                                isLoading={isLoadingHistory}
                                onSelect={(result) => {
                                    setCurrentResult(result);
                                    setActiveTab("scan");
                                }}
                                onDelete={handleDelete}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default OCRPage;