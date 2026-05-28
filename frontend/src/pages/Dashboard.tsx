import { motion } from "framer-motion";
import { LayoutDashboard } from "lucide-react";
import HealthDashboard from "../components/dashboard/HealthDashboard";

const Dashboard = () => {
    return (
        <div className="page-enter">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 mb-8"
                >
                    <div className="w-11 h-11 rounded-2xl bg-navy-50 border border-navy-100 flex items-center justify-center">
                        <LayoutDashboard className="w-6 h-6 text-navy-900" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-heading font-bold text-navy-900">
                            Health Dashboard
                        </h1>
                        <p className="text-sm text-medical-muted">
                            Track your health history and insights
                        </p>
                    </div>
                </motion.div>

                {/* Dashboard Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <HealthDashboard />
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;