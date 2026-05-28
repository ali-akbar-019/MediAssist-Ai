import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import HospitalFinderComponent from "../components/hospital/HospitalFinder";

const HospitalFinder = () => {
    return (
        <div className="page-enter">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 border border-red-100 mb-4">
                        <MapPin className="w-7 h-7 text-red-500" />
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-navy-900 mb-2">
                        Find Nearby Hospitals
                    </h1>
                    <p className="text-medical-muted max-w-xl mx-auto">
                        Locate hospitals, clinics, and pharmacies near you. Get directions
                        and check opening hours instantly.
                    </p>
                </motion.div>

                {/* Hospital Finder Component */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="max-w-4xl mx-auto"
                >
                    <HospitalFinderComponent />
                </motion.div>
            </div>
        </div>
    );
};

export default HospitalFinder;