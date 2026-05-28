import { motion } from "framer-motion";
import { Stethoscope, Info } from "lucide-react";
import SymptomForm from "../components/symptom/SymptomForm";

const Analyzer = () => {
    return (
        <div className="page-enter">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-navy-50 border border-navy-100 mb-4">
                        <Stethoscope className="w-7 h-7 text-navy-900" />
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-navy-900 mb-2">
                        AI Symptom Analyzer
                    </h1>
                    <p className="text-medical-muted max-w-xl mx-auto">
                        Select the affected body part, describe your symptoms, and let our
                        AI provide you with detailed health insights.
                    </p>
                </motion.div>

                {/* Disclaimer Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl mb-8 max-w-2xl mx-auto"
                >
                    <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-700">
                        This tool provides general health information only and is{" "}
                        <strong>not a substitute</strong> for professional medical advice.
                        Always consult a qualified healthcare professional for medical
                        decisions.
                    </p>
                </motion.div>

                {/* Main Content */}
                <div className="max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="medical-card p-6 sm:p-8"
                    >
                        <SymptomForm />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Analyzer;