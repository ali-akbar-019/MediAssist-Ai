import { motion } from "framer-motion";
import { Stethoscope, Info } from "lucide-react";
import SymptomForm from "../components/symptom/SymptomForm";

const Analyzer = () => {
    return (
        <div className="medical-mesh min-h-screen pt-32 pb-24">
            <div className="container mx-auto px-6 relative">
                {/* Elite Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <motion.div 
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-navy-900 border border-emerald-500/20 mb-8 shadow-navy"
                    >
                        <Stethoscope className="w-8 h-8 text-emerald-400" />
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-navy-900 mb-6 leading-none">
                        Clinical <span className="gradient-text-luxe italic">Analyzer.</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
                        Precision diagnostics powered by elite medical intelligence. 
                        Select your indices and begin the analysis.
                    </p>
                </motion.div>

                {/* Main Analyzer Container */}
                <div className="max-w-4xl mx-auto relative">
                    {/* Background Decorative Glow */}
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-navy-400/5 rounded-full blur-[100px] pointer-events-none" />

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="glass-panel p-8 md:p-12 rounded-[3.5rem] shadow-luxe border-white/20 relative overflow-hidden"
                    >
                        {/* Subtle Scanner Line Background */}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
                            <div className="w-full h-full border-y-[1px] border-emerald-900 grid grid-cols-6 divide-x divide-emerald-900" />
                        </div>
                        
                        <div className="relative z-10">
                            <SymptomForm />
                        </div>
                    </motion.div>

                    {/* Elite Disclaimer Guideline */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-12 flex items-center justify-center gap-6 px-8 py-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm max-w-3xl mx-auto"
                    >
                        <div className="flex items-center gap-3 text-navy-400">
                            <Info className="w-4 h-4 text-emerald-500" />
                            <span className="text-[10px] uppercase tracking-[0.2em] font-black">Advisory Protocol</span>
                        </div>
                        <div className="w-px h-4 bg-white/10 hidden sm:block" />
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic text-center sm:text-left">
                            This terminal provides informational clinical indices. It is not a substitute for a licensed medical professional.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Analyzer;