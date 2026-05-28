import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, X } from "lucide-react";
import BodyFront from "./BodyFront";
import BodyBack from "./BodyBack";
import type { SelectedBodyPart } from "../../types";
import { cn } from "../../lib/utils";

interface BodyMapProps {
    selectedParts: SelectedBodyPart[];
    onPartToggle: (part: SelectedBodyPart) => void;
    onPartRemove: (id: string) => void;
}

const BodyMap = ({ selectedParts, onPartToggle, onPartRemove }: BodyMapProps) => {
    const [view, setView] = useState<"front" | "back">("front");

    const handleFlip = () => {
        setView((prev) => (prev === "front" ? "back" : "front"));
    };

    return (
        <div className="flex flex-col items-center gap-6">
            {/* View Toggle */}
            {/* View Toggle - Elite Console Style */}
            <div className="flex items-center gap-1 bg-white/40 backdrop-blur-md rounded-2xl p-1 border border-white/50 shadow-soft ring-1 ring-black/5">
                <button
                    onClick={() => setView("front")}
                    className={cn(
                        "px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-500",
                        view === "front"
                            ? "bg-navy-900 text-white shadow-navy"
                            : "text-slate-400 hover:text-navy-900 hover:bg-white/60"
                    )}
                >
                    Anterior
                </button>
                <button
                    onClick={() => setView("back")}
                    className={cn(
                        "px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-500",
                        view === "back"
                            ? "bg-navy-900 text-white shadow-navy"
                            : "text-slate-400 hover:text-navy-900 hover:bg-white/60"
                    )}
                >
                    Posterior
                </button>
            </div>

            {/* Body SVG — Tactical Scanner Interface */}
            <div className="relative w-full max-w-[320px] aspect-[1/2.2] flex items-center justify-center bg-white/30 backdrop-blur-sm rounded-[4rem] border border-white shadow-soft p-10 overflow-hidden group">
                {/* High-Intensity Scanner Animation */}
                <motion.div
                    animate={{
                        top: ["-20%", "120%", "-20%"],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute left-0 right-0 h-[150px] bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent pointer-events-none z-10"
                />
                <motion.div
                    animate={{
                        top: ["-20%", "120%", "-20%"],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute left-0 right-0 h-px bg-emerald-400/40 shadow-[0_0_25px_rgba(16,185,129,0.8)] pointer-events-none z-10"
                />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={view}
                        initial={{ opacity: 0, rotateY: 45, filter: "blur(4px)" }}
                        animate={{ opacity: 1, rotateY: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, rotateY: -45, filter: "blur(4px)" }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full h-full relative"
                    >
                        {view === "front" ? (
                            <BodyFront
                                selectedParts={selectedParts}
                                onPartSelect={(part) => onPartToggle(part)}
                            />
                        ) : (
                            <BodyBack
                                selectedParts={selectedParts}
                                onPartSelect={(part) => onPartToggle(part)}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Tactical Flip Button */}
                <button
                    onClick={handleFlip}
                    className="absolute bottom-6 right-6 p-4 bg-navy-900 border border-white/10 rounded-2xl shadow-navy text-emerald-400 hover:bg-navy-950 transition-all group active:scale-95"
                >
                    <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700 ease-out" />
                </button>
            </div>

            {/* Selected Parts List */}
            <div className="w-full max-w-md space-y-3">
                <div className="flex items-center justify-between px-1">
                    <span className="text-sm font-semibold text-navy-900">
                        Selected Areas ({selectedParts.length})
                    </span>
                    {selectedParts.length > 0 && (
                        <button 
                            onClick={() => {}} // Reset handled in parent
                            className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                            Clear All
                        </button>
                    )}
                </div>
                
                <div className="flex flex-wrap gap-2 min-h-[40px]">
                    <AnimatePresence>
                        {selectedParts.map((part) => (
                            <motion.div
                                key={part.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-sm font-medium pr-1 shadow-sm"
                            >
                                <span>{part.name}</span>
                                <button
                                    onClick={() => onPartRemove(part.id)}
                                    className="p-1 hover:bg-emerald-200 rounded-lg transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {selectedParts.length === 0 && (
                        <p className="text-sm text-medical-muted italic px-1">
                            No parts selected. Click on the body map to start.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BodyMap;