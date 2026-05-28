import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, CheckCircle } from "lucide-react";
import BodyFront from "./BodyFront";
import BodyBack from "./BodyBack";
import type { SelectedBodyPart } from "../../types";
import { cn } from "../../lib/utils";

interface BodyMapProps {
    selectedPart: SelectedBodyPart | null;
    onPartSelect: (part: SelectedBodyPart) => void;
}

const BodyMap = ({ selectedPart, onPartSelect }: BodyMapProps) => {
    const [view, setView] = useState<"front" | "back">("front");

    const handleFlip = () => {
        setView((prev) => (prev === "front" ? "back" : "front"));
    };

    return (
        <div className="flex flex-col items-center gap-4">
            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-medical-surface rounded-xl p-1 border border-medical-border">
                <button
                    onClick={() => setView("front")}
                    className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        view === "front"
                            ? "bg-navy-900 text-white shadow-sm"
                            : "text-medical-muted hover:text-navy-900"
                    )}
                >
                    Front View
                </button>
                <button
                    onClick={() => setView("back")}
                    className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        view === "back"
                            ? "bg-navy-900 text-white shadow-sm"
                            : "text-medical-muted hover:text-navy-900"
                    )}
                >
                    Back View
                </button>
            </div>

            {/* Body SVG */}
            <div className="relative w-48 h-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={view}
                        initial={{ opacity: 0, rotateY: 90 }}
                        animate={{ opacity: 1, rotateY: 0 }}
                        exit={{ opacity: 0, rotateY: -90 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                    >
                        {view === "front" ? (
                            <BodyFront
                                selectedPart={selectedPart}
                                onPartSelect={onPartSelect}
                            />
                        ) : (
                            <BodyBack
                                selectedPart={selectedPart}
                                onPartSelect={onPartSelect}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Selected Part Info */}
            <AnimatePresence>
                {selectedPart && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex items-center gap-2 px-4 py-2 bg-navy-900 text-white rounded-xl text-sm font-medium"
                    >
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span>{selectedPart.name}</span>
                        <span className="text-navy-300 text-xs">
                            ({selectedPart.side} view)
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Flip Button */}
            <button
                onClick={handleFlip}
                className="flex items-center gap-2 text-sm text-medical-muted hover:text-navy-900 transition-colors"
            >
                <RotateCcw className="w-4 h-4" />
                Flip to {view === "front" ? "back" : "front"} view
            </button>

            {/* Instructions */}
            {!selectedPart && (
                <p className="text-xs text-medical-muted text-center max-w-40">
                    Click on the body part where you are experiencing pain or discomfort
                </p>
            )}
        </div>
    );
};

export default BodyMap;