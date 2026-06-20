import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import HospitalFinderComponent from "../components/hospital/HospitalFinder";

const HospitalFinder = () => {
    return (
        <div
            className="medical-mesh min-h-screen pt-32 pb-24 page-enter overflow-x-hidden"
            data-testid="hospital-page"  // ADDED
        >
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
                        <MapPin className="w-8 h-8 text-emerald-400" />
                    </motion.div>
                    <h1 data-testid="hospital-heading" className="text-5xl md:text-7xl font-bold tracking-tighter text-navy-900 mb-6 leading-none">
                        Hospital <span className="gradient-text-luxe italic">Finder.</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
                        Locate hospitals, clinics, and pharmacies nearby with the same clean,
                        clinical interface used throughout the app.
                    </p>
                </motion.div>

                <div
                    className="max-w-5xl mx-auto relative"
                    data-testid="hospital-container"  // ADDED
                >
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-navy-400/5 rounded-full blur-[100px] pointer-events-none" />

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.7 }}
                        className="glass-panel p-6 md:p-8 rounded-[3rem] shadow-luxe border-white/20 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
                            <div className="w-full h-full border-y border-emerald-900 grid grid-cols-6 divide-x divide-emerald-900" />
                        </div>

                        <div className="relative z-10">
                            <HospitalFinderComponent />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default HospitalFinder;