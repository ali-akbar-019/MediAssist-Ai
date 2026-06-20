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
            className="medical-mesh min-h-screen pt-24 sm:pt-28 pb-16 sm:pb-24"
            data-testid="ocr-page"  // ADDED
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10 sm:mb-16"
                >
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/10 mb-6"
                    >
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-navy-900">
                            Vision Intelligence Terminal v2.1
                        </span>
                    </motion.div>

                    <h1
                        data-testid="ocr-heading"  // ADDED
                        className="text-4xl sm:text-5xl md:text-7xl font-black text-navy-900 tracking-tighter mb-4 uppercase"
                    >
                        ANALYZE<span className="text-emerald-500">.</span>
                    </h1>
                    <p className="text-sm sm:text-lg text-slate-500 max-w-2xl mx-auto font-medium tracking-tight">
                        Upload prescriptions & clinical reports for instantaneous AI synthesis. Decrypting complexity with medical precision.
                    </p>
                </motion.div>

                {/* Tab Switcher */}
                <div className="flex justify-center mb-8 sm:mb-12" data-testid="ocr-tabs">  {/* ADDED */}
                    <div
                        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1 p-2 sm:p-1.5 rounded-[1.5rem] bg-white/50 backdrop-blur-md border shadow-sm w-full sm:w-auto"
                        style={{ borderColor: "rgba(0,0,0,0.05)" }}
                    >
                        {[
                            { id: "scan", label: "New Scan", icon: ScanLine },
                            { id: "history", label: "Archives", icon: History },
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as "scan" | "history")}
                                    data-testid={`ocr-tab-${tab.id}`}  // ADDED
                                    className={cn(
                                        "flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-2.5 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em]",
                                        "transition-all duration-300"
                                    )}
                                    style={{
                                        backgroundColor:
                                            activeTab === tab.id ? "var(--color-navy-900)" : "transparent",
                                        color:
                                            activeTab === tab.id
                                                ? "white"
                                                : "var(--color-medical-muted)",
                                        boxShadow:
                                            activeTab === tab.id ? "0 10px 15px -3px rgba(30,58,95,0.2)" : "none",
                                    }}
                                >
                                    <Icon size={14} className={activeTab === tab.id ? "text-emerald-400" : ""} />
                                    {tab.label}
                                    {tab.id === "history" && history.length > 0 && (
                                        <span
                                            className={cn(
                                                "ml-1 px-1.5 py-0.5 text-[8px] font-black rounded-full",
                                                activeTab === tab.id ? "bg-white/10 text-white" : "bg-slate-100 text-slate-400"
                                            )}
                                            data-testid={`ocr-history-count`}  // ADDED
                                        >
                                            {history.length}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === "scan" ? (
                        <motion.div
                            key="scan"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            data-testid="ocr-scan-tab"  // ADDED
                        >
                            {currentResult ? (
                                <OCRResultView
                                    result={currentResult}
                                    onReset={handleReset}
                                    onDelete={handleDelete}
                                />
                            ) : (
                                <div
                                    className="glass-panel p-5 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border-white/20 shadow-luxe"
                                    data-testid="ocr-upload-container"  // ADDED
                                >
                                    {/* Info Banner */}
                                    <div
                                        className="flex flex-col sm:flex-row items-start gap-4 p-4 sm:p-5 rounded-[1.5rem] mb-8 sm:mb-10 bg-emerald-500/5 border border-emerald-500/10"
                                        data-testid="ocr-info-banner"  // ADDED
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-navy-900 flex items-center justify-center shrink-0 shadow-sm">
                                            <ScanLine
                                                size={20}
                                                className="text-emerald-400"
                                            />
                                        </div>
                                        <div>
                                            <p
                                                className="text-[10px] font-black uppercase tracking-widest text-emerald-800"
                                            >
                                                System Protocol
                                            </p>
                                            <p
                                                className="text-sm font-medium text-slate-600 mt-1 leading-relaxed"
                                            >
                                                Our vision engine interprets prescriptions and clinical reports. Securely upload any medical documentation for deep contextual analysis and simplified explanations.
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
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="glass-panel p-8 rounded-[3rem] border-white/20 shadow-luxe"
                            data-testid="ocr-history-tab"  // ADDED
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