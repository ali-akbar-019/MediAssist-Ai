import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Pill,
    Search,
    Loader2,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Info,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import type { MedicineInfo as MedicineInfoType } from "../types";
import api from "../services/api";
import { cn } from "../lib/utils";

const COMMON_MEDICINES = [
    "Paracetamol",
    "Ibuprofen",
    "Amoxicillin",
    "Omeprazole",
    "Metformin",
    "Aspirin",
    "Cetirizine",
    "Azithromycin",
];

const MedicineInfo = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [medicine, setMedicine] = useState<MedicineInfoType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedSection, setExpandedSection] = useState<string | null>(
        "uses"
    );

    const handleSearch = async (query: string) => {
        if (!query.trim()) return;
        try {
            setError(null);
            setIsLoading(true);
            setMedicine(null);
            const response = await api.post("/api/medicine/info", {
                medicineName: query.trim(),
            });
            setMedicine(response.data.data);
            setExpandedSection("uses");
        } catch {
            setError(
                "Failed to fetch medicine information. Please check the medicine name and try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSearch(searchQuery);
    };

    const toggleSection = (section: string) => {
        setExpandedSection((prev) => (prev === section ? null : section));
    };

    const sections = medicine
        ? [
            {
                id: "uses",
                title: "Uses & Indications",
                icon: CheckCircle,
                color: "text-emerald-500",
                bg: "bg-emerald-50",
                border: "border-emerald-100",
                items: medicine.uses,
            },
            {
                id: "sideEffects",
                title: "Side Effects",
                icon: AlertTriangle,
                color: "text-amber-500",
                bg: "bg-amber-50",
                border: "border-amber-100",
                items: medicine.sideEffects,
            },
            {
                id: "warnings",
                title: "Warnings & Precautions",
                icon: XCircle,
                color: "text-red-500",
                bg: "bg-red-50",
                border: "border-red-100",
                items: medicine.warnings,
            },
            {
                id: "interactions",
                title: "Drug Interactions",
                icon: Info,
                color: "text-blue-500",
                bg: "bg-blue-50",
                border: "border-blue-100",
                items: medicine.interactions,
            },
        ]
        : [];

    return (
        <div className="medical-mesh min-h-screen pt-32 pb-24 page-enter overflow-x-hidden">
            <div className="container mx-auto px-6 relative">
                {/* Editorial Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-14"
                >
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-navy-900 border border-emerald-500/20 mb-8 shadow-navy"
                    >
                        <Pill className="w-8 h-8 text-emerald-400" />
                    </motion.div>
                    <h1 data-testid="medicine-heading" className="text-5xl md:text-7xl font-bold tracking-tighter text-navy-900 mb-6 leading-none">
                        Medicine <span className="gradient-text-luxe italic">Compass.</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
                        Search medicines for practical guidance on uses, dosage, side effects,
                        warnings, and interactions in the same clinical interface style.
                    </p>
                </motion.div>

                <div className="max-w-4xl mx-auto relative">
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-navy-400/5 rounded-full blur-[100px] pointer-events-none" />

                    {/* Search Console */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.7 }}
                        className="glass-panel p-6 md:p-8 rounded-[3rem] shadow-luxe border-white/20 relative overflow-hidden mb-8"
                    >
                        <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
                            <div className="w-full h-full border-y border-emerald-900 grid grid-cols-6 divide-x divide-emerald-900" />
                        </div>

                        <div className="relative z-10 space-y-6">
                            <div className="text-center">
                                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-700 mb-3">
                                    Pharmacology Lookup
                                </p>
                                <p className="text-sm text-medical-muted max-w-xl mx-auto">
                                    Enter a drug name to surface concise, structured medicine intelligence.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-muted" />
                                    <Input
                                        data-testid="medicine-search-input"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Search medicine name e.g. Paracetamol..."
                                        className="pl-10 h-14 rounded-2xl border-medical-border bg-white/70 text-navy-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/20"
                                    />
                                </div>
                                <Button
                                    data-testid="medicine-search-button"
                                    onClick={() => handleSearch(searchQuery)}
                                    disabled={!searchQuery.trim() || isLoading}
                                    className="h-14 px-7 rounded-2xl bg-navy-900 hover:bg-navy-950 text-white shrink-0 font-semibold shadow-navy"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Search className="w-4 h-4" />
                                    )}
                                    <span className="ml-2 hidden sm:inline">Search</span>
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Common Medicines */}
                    {!medicine && !isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass-panel p-6 rounded-[2.5rem] mb-8"
                            data-testid="common-medicines-container"
                        >
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 text-center">
                                Quick Picks
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {COMMON_MEDICINES.map((med) => (
                                    <button
                                        key={med}
                                        data-testid={`common-medicine-${med.toLowerCase()}`}
                                        onClick={() => {
                                            setSearchQuery(med);
                                            handleSearch(med);
                                        }}
                                        className="px-4 py-2 rounded-full text-sm font-medium border border-medical-border text-medical-muted hover:border-navy-900 hover:text-navy-900 hover:bg-navy-50 transition-all"
                                    >
                                        {med}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Loading */}
                    {isLoading && (
                        <div data-testid="medicine-loading" className="flex flex-col items-center justify-center py-20 gap-3">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                                <Loader2 className="w-10 h-10 text-navy-900" />
                            </motion.div>
                            <p className="text-medical-muted text-sm">
                                Fetching medicine information...
                            </p>
                        </div>
                    )}

                    {/* Error */}
                    {error && !isLoading && (
                        <motion.div
                            data-testid="medicine-error"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="max-w-2xl mx-auto p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600 flex items-start gap-2"
                        >
                            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                            {error}
                        </motion.div>
                    )}

                    {/* Medicine Result */}
                    <AnimatePresence>
                        {medicine && !isLoading && (
                            <motion.div
                                data-testid="medicine-result"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-4"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 }}
                                    className="glass-panel p-6 md:p-8 rounded-[3rem] shadow-luxe border-white/20 relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
                                        <div className="w-full h-full border-y border-emerald-900 grid grid-cols-6 divide-x divide-emerald-900" />
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex items-start gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                                                <Pill className="w-7 h-7 text-amber-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h2 data-testid="medicine-name" className="text-2xl font-heading font-bold text-navy-900">
                                                    {medicine.name}
                                                </h2>
                                                <p data-testid="medicine-generic-name" className="text-sm text-medical-muted mt-0.5">
                                                    Generic name: {" "}
                                                    <span className="font-medium text-medical-text">
                                                        {medicine.genericName}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        <div data-testid="medicine-dosage" className="mt-5 p-4 rounded-2xl bg-navy-50 border border-navy-100">
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-navy-600 mb-2">
                                                General Dosage Information
                                            </p>
                                            <p className="text-sm text-navy-900 leading-relaxed">
                                                {medicine.dosage}
                                            </p>
                                        </div>

                                        <div data-testid="medicine-disclaimer" className="mt-4 flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-2xl">
                                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                            <p className="text-xs text-amber-700 leading-relaxed">
                                                Always consult a doctor or pharmacist before taking any
                                                medication. Dosage may vary based on your condition.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>

                                {sections.map((section, index) => {
                                    const Icon = section.icon;
                                    const isOpen = expandedSection === section.id;

                                    return (
                                        <motion.div
                                            key={section.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 + index * 0.05 }}
                                            className="medical-card overflow-hidden"
                                        >
                                            <button
                                                data-testid={`section-${section.id}`}
                                                onClick={() => toggleSection(section.id)}
                                                className="w-full flex items-center justify-between p-5 text-left hover:bg-medical-surface transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={cn(
                                                            "w-8 h-8 rounded-lg flex items-center justify-center",
                                                            section.bg,
                                                            `border ${section.border}`
                                                        )}
                                                    >
                                                        <Icon
                                                            className={cn("w-4 h-4", section.color)}
                                                        />
                                                    </div>
                                                    <span className="font-medium text-navy-900 text-sm">
                                                        {section.title}
                                                    </span>
                                                    <span className="text-xs text-medical-muted">
                                                        ({section.items.length})
                                                    </span>
                                                </div>
                                                {isOpen ? (
                                                    <ChevronUp className="w-4 h-4 text-medical-muted" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4 text-medical-muted" />
                                                )}
                                            </button>

                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="px-5 pb-5 border-t border-medical-border">
                                                            <ul className="space-y-2 pt-4">
                                                                {section.items.map((item, itemIndex) => (
                                                                    <motion.li
                                                                        key={itemIndex}
                                                                        data-testid={`section-${section.id}-item-${itemIndex}`}
                                                                        initial={{ opacity: 0, x: -10 }}
                                                                        animate={{ opacity: 1, x: 0 }}
                                                                        transition={{ delay: itemIndex * 0.05 }}
                                                                        className="flex items-start gap-2.5 text-sm text-medical-muted"
                                                                    >
                                                                        <Icon
                                                                            className={cn(
                                                                                "w-4 h-4 shrink-0 mt-0.5",
                                                                                section.color
                                                                            )}
                                                                        />
                                                                        {item}
                                                                    </motion.li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    );
                                })}

                                <div className="text-center pt-2">
                                    <button
                                        data-testid="search-another-medicine"
                                        onClick={() => {
                                            setMedicine(null);
                                            setSearchQuery("");
                                        }}
                                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                                    >
                                        Search another medicine
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default MedicineInfo;