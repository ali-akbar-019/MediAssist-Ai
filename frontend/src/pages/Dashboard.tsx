import { motion } from "framer-motion";
import HealthDashboard from "../components/dashboard/HealthDashboard";

const Dashboard = () => {
    return (
        <div className="medical-mesh min-h-screen pt-32 pb-24">
            <div className="container mx-auto px-6 relative">
                {/* Elite Editorial Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <motion.div 
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy-900/5 border border-navy-900/10 mb-6"
                    >
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-navy-900">
                            Health Intelligence System v4.0
                        </span>
                    </motion.div>
                    
                    <h1 className="text-6xl md:text-8xl font-black text-navy-900 tracking-tighter mb-4">
                        COMMAND<span className="text-emerald-500">.</span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium tracking-tight">
                        Real-time physiological synthesis and diagnostic history. Your health architecture, visualized through clinical-grade AI.
                    </p>
                </motion.div>

                {/* Dashboard Intelligence Console */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <HealthDashboard />
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;