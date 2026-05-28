import { useEffect } from "react";
import { motion } from "framer-motion";
import {
    Activity,
    FileText,
    Clock,
    TrendingUp,
    Stethoscope,
    ArrowRight,
    Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useSymptoms } from "../../hooks/useSymptoms";
import HistoryCard from "./HistoryCard";
import StatsChart from "./StatsChart";
import { ROUTES } from "../../constants";
import { getGreeting, formatRelativeTime } from "../../lib/utils";

const StatCard = ({
    icon: Icon,
    label,
    value,
    color,
    delay,
}: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    color: string;
    delay: number;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="medical-card p-5"
    >
        <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-medical-muted font-medium">{label}</span>
            <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${color}15` }}
            >
                <Icon className="w-5 h-5" style={{ color }} />
            </div>
        </div>
        <p className="text-3xl font-bold text-navy-900">{value}</p>
    </motion.div>
);

const HealthDashboard = () => {
    const { user } = useAuthStore();
    const {
        symptoms,
        isLoadingSymptoms,
        stats,
        isLoadingStats,
        isGeneratingReport,
        handleGetSymptoms,
        handleGetStats,
        handleDeleteSymptom,
        handleDownloadReport,
    } = useSymptoms();

    useEffect(() => {
        handleGetSymptoms(1, 6);
        handleGetStats();
    }, []);

    const greeting = getGreeting();

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start justify-between flex-wrap gap-4"
            >
                <div>
                    <h1 className="text-2xl font-heading font-bold text-navy-900">
                        {greeting}, {user?.name.split(" ")[0]}! 👋
                    </h1>
                    <p className="text-medical-muted mt-1">
                        Here is your health overview and recent activity.
                    </p>
                </div>
                <Link
                    to={ROUTES.ANALYZER}
                    className="flex items-center gap-2 px-4 py-2.5 bg-navy-900 text-white rounded-xl text-sm font-medium hover:bg-navy-800 transition-colors shadow-navy"
                >
                    <Stethoscope className="w-4 h-4" />
                    New Analysis
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </motion.div>

            {/* Stat Cards */}
            {isLoadingStats ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="medical-card p-5 animate-pulse"
                        >
                            <div className="h-4 bg-medical-surface rounded w-2/3 mb-3" />
                            <div className="h-8 bg-medical-surface rounded w-1/3" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        icon={Activity}
                        label="Total Analyses"
                        value={stats?.totalSymptoms ?? 0}
                        color="#1E3A5F"
                        delay={0}
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="This Month"
                        value={
                            symptoms.filter((s) => {
                                const date = new Date(s.createdAt);
                                const now = new Date();
                                return (
                                    date.getMonth() === now.getMonth() &&
                                    date.getFullYear() === now.getFullYear()
                                );
                            }).length
                        }
                        color="#10B981"
                        delay={0.1}
                    />
                    <StatCard
                        icon={FileText}
                        label="Reports Generated"
                        value={stats?.totalSymptoms ?? 0}
                        color="#F59E0B"
                        delay={0.2}
                    />
                    <StatCard
                        icon={Clock}
                        label="Last Analysis"
                        value={
                            symptoms.length > 0
                                ? formatRelativeTime(symptoms[0].createdAt)
                                : "None yet"
                        }
                        color="#7C3AED"
                        delay={0.3}
                    />
                </div>
            )}

            {/* Charts */}
            {stats && !isLoadingStats && <StatsChart stats={stats} />}

            {/* Recent History */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-heading font-semibold text-navy-900">
                        Recent Analyses
                    </h2>
                    <Link
                        to={ROUTES.ANALYZER}
                        className="text-sm text-emerald-500 hover:text-emerald-600 font-medium flex items-center gap-1 transition-colors"
                    >
                        New Analysis
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {isLoadingSymptoms ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-navy-900" />
                    </div>
                ) : symptoms.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-12 text-center medical-card"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-navy-50 flex items-center justify-center mb-4">
                            <Stethoscope className="w-7 h-7 text-navy-900" />
                        </div>
                        <h3 className="font-heading font-semibold text-navy-900 mb-2">
                            No analyses yet
                        </h3>
                        <p className="text-medical-muted text-sm mb-4 max-w-xs">
                            Start by analyzing your symptoms using our interactive body map
                            and AI-powered analysis.
                        </p>
                        <Link
                            to={ROUTES.ANALYZER}
                            className="px-4 py-2 bg-navy-900 text-white rounded-xl text-sm font-medium hover:bg-navy-800 transition-colors"
                        >
                            Start Analysis
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {symptoms.map((symptom, index) => (
                            <HistoryCard
                                key={symptom._id}
                                symptom={symptom}
                                index={index}
                                onDelete={handleDeleteSymptom}
                                onDownloadReport={handleDownloadReport}
                                isGeneratingReport={isGeneratingReport}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Profile Info */}
            {user && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="medical-card p-5"
                >
                    <h2 className="text-sm font-semibold text-navy-900 mb-4">
                        Your Health Profile
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { label: "Age", value: user.age ?? "Not set" },
                            { label: "Gender", value: user.gender ?? "Not set" },
                            { label: "Blood Group", value: user.bloodGroup ?? "Not set" },
                            {
                                label: "Allergies",
                                value:
                                    user.allergies && user.allergies.length > 0
                                        ? user.allergies.join(", ")
                                        : "None",
                            },
                        ].map((item) => (
                            <div key={item.label} className="space-y-1">
                                <p className="text-xs text-medical-muted">{item.label}</p>
                                <p className="text-sm font-medium text-navy-900 capitalize">
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default HealthDashboard;