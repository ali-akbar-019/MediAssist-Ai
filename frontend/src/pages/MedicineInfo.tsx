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
        <div className="page-enter">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 mb-4">
                        <Pill className="w-7 h-7 text-amber-500" />
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-navy-900 mb-2">
                        Medicine Information
                    </h1>
                    <p className="text-medical-muted max-w-xl mx-auto">
                        Search any medicine to get detailed information about uses, dosage,
                        side effects, warnings, and drug interactions.
                    </p>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="max-w-xl mx-auto mb-6"
                >
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-muted" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Search medicine name e.g. Paracetamol..."
                                className="pl-9"
                            />
                        </div>
                        <Button
                            onClick={() => handleSearch(searchQuery)}
                            disabled={!searchQuery.trim() || isLoading}
                            className="bg-navy-900 hover:bg-navy-800 text-white shrink-0"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Search className="w-4 h-4" />
                            )}
                            <span className="ml-2 hidden sm:inline">Search</span>
                        </Button>
                    </div>
                </motion.div>

                {/* Common Medicines */}
                {!medicine && !isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-xl mx-auto mb-10"
                    >
                        <p className="text-xs text-medical-muted mb-3 text-center">
                            Common medicines — click to search:
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {COMMON_MEDICINES.map((med) => (
                                <button
                                    key={med}
                                    onClick={() => {
                                        setSearchQuery(med);
                                        handleSearch(med);
                                    }}
                                    className="px-3 py-1.5 rounded-full text-sm font-medium border border-medical-border text-medical-muted hover:border-navy-900 hover:text-navy-900 hover:bg-navy-50 transition-all"
                                >
                                    {med}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Loading */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
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
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="max-w-xl mx-auto p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 flex items-start gap-2"
                    >
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        {error}
                    </motion.div>
                )}

                {/* Medicine Result */}
                <AnimatePresence>
                    {medicine && !isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-2xl mx-auto space-y-4"
                        >
                            {/* Medicine Header Card */}
                            <div className="medical-card p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                                        <Pill className="w-6 h-6 text-amber-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-xl font-heading font-bold text-navy-900">
                                            {medicine.name}
                                        </h2>
                                        <p className="text-sm text-medical-muted mt-0.5">
                                            Generic name:{" "}
                                            <span className="font-medium text-medical-text">
                                                {medicine.genericName}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {/* Dosage */}
                                <div className="mt-4 p-4 rounded-xl bg-navy-50 border border-navy-100">
                                    <p className="text-xs font-medium text-navy-600 mb-1">
                                        General Dosage Information
                                    </p>
                                    <p className="text-sm text-navy-900">{medicine.dosage}</p>
                                </div>

                                {/* Disclaimer */}
                                <div className="mt-3 flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                    <p className="text-xs text-amber-700">
                                        Always consult a doctor or pharmacist before taking any
                                        medication. Dosage may vary based on your condition.
                                    </p>
                                </div>
                            </div>

                            {/* Accordion Sections */}
                            {sections.map((section) => {
                                const Icon = section.icon;
                                const isOpen = expandedSection === section.id;

                                return (
                                    <motion.div
                                        key={section.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="medical-card overflow-hidden"
                                    >
                                        <button
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
                                                            {section.items.map((item, index) => (
                                                                <motion.li
                                                                    key={index}
                                                                    initial={{ opacity: 0, x: -10 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{ delay: index * 0.05 }}
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

                            {/* Search Again */}
                            <div className="text-center pt-2">
                                <button
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
    );
};

export default MedicineInfo;