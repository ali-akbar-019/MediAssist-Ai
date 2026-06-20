import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    FileText,
    ArrowLeft,
    Loader2,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSymptoms } from "../hooks/useSymptoms";
import HistoryCard from "../components/dashboard/HistoryCard";
import { ROUTES } from "../constants";
import { cn } from "../lib/utils";

const Reports = () => {
    const navigate = useNavigate();
    const {
        symptoms,
        isLoadingSymptoms,
        totalSymptoms,
        handleGetSymptoms,
        handleDeleteSymptom,
        handleDownloadReport,
        isGeneratingReport,
    } = useSymptoms();

    const [page, setPage] = useState(1);
    const limit = 9; // 3x3 grid
    const totalPages = Math.ceil(totalSymptoms / limit);

    useEffect(() => {
        handleGetSymptoms(page, limit);
    }, [page]);

    return (
        <div className="medical-mesh min-h-screen pt-32 pb-24" data-testid="reports-page">  {/* ADDED */}
            <div className="container mx-auto px-6 relative">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        <button
                            onClick={() => navigate(ROUTES.DASHBOARD)}
                            data-testid="reports-back-btn"  // ADDED
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-emerald-500 transition-colors group"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Return to Command Center
                        </button>
                        <div className="space-y-2">
                            <h1 data-testid="reports-heading" className="text-5xl font-black text-navy-900 tracking-tighter">
                                CLINICAL <span className="text-emerald-500">REPORTS.</span>
                            </h1>
                            <p className="text-slate-500 font-medium tracking-tight max-w-md" data-testid="reports-subtitle">  {/* ADDED */}
                                A comprehensive indexed repository of all generated diagnostic syntheses and physiological analyses.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                        data-testid="reports-stats"  // ADDED
                    >
                        <div className="glass-panel px-6 py-3 flex items-center gap-4">
                            <div className="flex flex-col items-end">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Total Records</span>
                                <span className="text-xl font-black text-navy-900" data-testid="reports-total-count">{totalSymptoms}</span>  {/* ADDED */}
                            </div>
                            <div className="w-[1px] h-8 bg-slate-100" />
                            <FileText className="text-emerald-500" size={24} />
                        </div>
                    </motion.div>
                </div>

                {/* Reports Grid */}
                <div className="min-h-[600px] relative" data-testid="reports-grid-container">  {/* ADDED */}
                    {isLoadingSymptoms ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4" data-testid="reports-loading">  {/* ADDED */}
                            <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">
                                Retrieving Archival Data
                            </span>
                        </div>
                    ) : symptoms.length === 0 ? (
                        <div className="text-center py-40 glass-panel" data-testid="reports-empty">  {/* ADDED */}
                            <FileText size={48} className="mx-auto text-slate-200 mb-6" />
                            <h2 className="text-2xl font-black text-navy-900 mb-2">No Reports Found</h2>
                            <p className="text-slate-500 mb-8 max-w-xs mx-auto">Your clinical history is currently empty. Initiate an analysis to begin your record.</p>
                        </div>
                    ) : (
                        <div data-testid="reports-grid" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {symptoms.map((symptom, index) => (
                                <motion.div
                                    key={symptom._id}
                                    data-testid={`report-card-${index}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <HistoryCard
                                        symptom={symptom}
                                        index={index}
                                        onDelete={handleDeleteSymptom}
                                        onDownloadReport={handleDownloadReport}
                                        isGeneratingReport={isGeneratingReport}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination Control */}
                {totalPages > 1 && (
                    <motion.div
                        data-testid="reports-pagination"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center gap-4 mt-16"
                    >
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            data-testid="reports-prev-page"  // ADDED
                            className="w-12 h-12 rounded-2xl glass-panel flex items-center justify-center text-navy-900 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-all"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <div className="flex items-center gap-2" data-testid="reports-page-numbers">  // ADDED
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i + 1)}
                                    data-testid={`reports-page-${i + 1}`}  // ADDED
                                    className={cn(
                                        "w-12 h-12 rounded-2xl text-xs font-black transition-all",
                                        page === i + 1
                                            ? "bg-navy-900 text-white shadow-navy"
                                            : "glass-panel text-slate-400 hover:bg-white"
                                    )}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            data-testid="reports-next-page"  // ADDED
                            className="w-12 h-12 rounded-2xl glass-panel flex items-center justify-center text-navy-900 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-all"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Reports;