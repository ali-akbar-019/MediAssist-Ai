import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Stethoscope,
    MessageCircle,
    MapPin,
    Pill,
    Shield,
    Zap,
    ArrowRight,
    CheckCircle,
    Activity,
    Brain,
    Clock,
} from "lucide-react";
import { ROUTES } from "../constants";
import { useAuthStore } from "../store/authStore";
import { Button } from "../components/ui/button";

const features = [
    {
        icon: Stethoscope,
        title: "Interactive Body Map",
        description:
            "Click on any body part to pinpoint your pain location. Our intuitive SVG body map makes symptom reporting accurate and easy.",
        color: "#1E3A5F",
        bg: "#EFF6FF",
    },
    {
        icon: Brain,
        title: "AI-Powered Analysis",
        description:
            "Google Gemini AI analyzes your symptoms and provides detailed insights about possible conditions, severity levels, and recommendations.",
        color: "#10B981",
        bg: "#ECFDF5",
    },
    {
        icon: MessageCircle,
        title: "AI Doctor Chat",
        description:
            "Have a real-time conversation with our AI doctor. Ask follow-up questions and get personalized health guidance.",
        color: "#7C3AED",
        bg: "#F5F3FF",
    },
    {
        icon: MapPin,
        title: "Hospital Finder",
        description:
            "Find nearby hospitals and clinics using your location. Get directions and check opening hours instantly.",
        color: "#EF4444",
        bg: "#FEF2F2",
    },
    {
        icon: Pill,
        title: "Medicine Information",
        description:
            "Search any medicine to get detailed information about uses, dosage, side effects, and drug interactions.",
        color: "#F59E0B",
        bg: "#FFFBEB",
    },
    {
        icon: Activity,
        title: "Health Dashboard",
        description:
            "Track your health history with beautiful charts. Download PDF reports to share with your doctor.",
        color: "#06B6D4",
        bg: "#ECFEFF",
    },
];

const stats = [
    { value: "99%", label: "Accuracy Rate", icon: CheckCircle },
    { value: "<3s", label: "Analysis Time", icon: Zap },
    { value: "24/7", label: "Availability", icon: Clock },
    { value: "Free", label: "Always Free", icon: Shield },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const Home = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();

    return (
        <div className="page-enter">
            {/* Hero Section */}
            <section className="relative overflow-hidden hero-pattern">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium mb-8"
                        >
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Powered by Google Gemini AI
                        </motion.div>

                        {/* Heading */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-navy-900 leading-tight mb-6"
                        >
                            Your Smart{" "}
                            <span className="gradient-text">Medical Assistant</span>
                            {" "}is Here
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-medical-muted max-w-2xl mx-auto mb-10 leading-relaxed"
                        >
                            Analyze your symptoms with AI, chat with our virtual doctor, find
                            nearby hospitals, and get instant medicine information — all in
                            one place.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center justify-center gap-4 flex-wrap"
                        >
                            <Button
                                size="lg"
                                onClick={() =>
                                    navigate(
                                        isAuthenticated ? ROUTES.ANALYZER : ROUTES.REGISTER
                                    )
                                }
                                className="bg-navy-900 hover:bg-navy-800 text-white px-8 py-3 rounded-xl shadow-navy text-base font-medium"
                            >
                                {isAuthenticated ? "Analyze Symptoms" : "Get Started Free"}
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => navigate(ROUTES.CHAT)}
                                className="border-medical-border text-navy-900 hover:bg-medical-surface px-8 py-3 rounded-xl text-base font-medium"
                            >
                                <MessageCircle className="w-5 h-5 mr-2" />
                                Chat with AI Doctor
                            </Button>
                        </motion.div>

                        {/* Trust Indicators */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex items-center justify-center gap-6 mt-10 flex-wrap"
                        >
                            {[
                                "No credit card required",
                                "100% free to use",
                                "Privacy protected",
                            ].map((text) => (
                                <div
                                    key={text}
                                    className="flex items-center gap-2 text-sm text-medical-muted"
                                >
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                    {text}
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Floating Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-16 max-w-3xl mx-auto"
                    >
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {stats.map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 + index * 0.1 }}
                                        className="glass-card p-4 text-center"
                                    >
                                        <Icon className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-navy-900">
                                            {stat.value}
                                        </p>
                                        <p className="text-xs text-medical-muted mt-0.5">
                                            {stat.label}
                                        </p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="section bg-medical-surface">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-14"
                    >
                        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-navy-900 mb-4">
                            Everything You Need for{" "}
                            <span className="gradient-text">Better Health</span>
                        </h2>
                        <p className="text-medical-muted max-w-2xl mx-auto text-lg">
                            MediAssist AI combines cutting-edge artificial intelligence with
                            medical knowledge to give you instant health insights.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {features.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={feature.title}
                                    variants={itemVariants}
                                    className="medical-card p-6 group"
                                >
                                    <div
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                                        style={{ backgroundColor: feature.bg }}
                                    >
                                        <Icon
                                            className="w-6 h-6"
                                            style={{ color: feature.color }}
                                        />
                                    </div>
                                    <h3 className="font-heading font-semibold text-navy-900 text-lg mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-medical-muted text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* How It Works */}
            <section className="section">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-14"
                    >
                        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-navy-900 mb-4">
                            How It Works
                        </h2>
                        <p className="text-medical-muted max-w-xl mx-auto">
                            Get your AI-powered health analysis in three simple steps
                        </p>
                    </motion.div>

                    <div className="max-w-3xl mx-auto">
                        {[
                            {
                                step: "01",
                                title: "Select Body Part",
                                description:
                                    "Use our interactive body map to click on the area where you feel pain or discomfort.",
                                icon: Stethoscope,
                                color: "#1E3A5F",
                            },
                            {
                                step: "02",
                                title: "Describe Symptoms",
                                description:
                                    "Add your symptoms, pain type, severity, and duration. The more detail you provide, the better the analysis.",
                                icon: Activity,
                                color: "#10B981",
                            },
                            {
                                step: "03",
                                title: "Get AI Analysis",
                                description:
                                    "Our AI analyzes everything and provides possible conditions, recommendations, and home remedies instantly.",
                                icon: Brain,
                                color: "#7C3AED",
                            },
                        ].map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={step.step}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-start gap-6 mb-10 last:mb-0"
                                >
                                    <div className="flex flex-col items-center">
                                        <div
                                            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                                            style={{ backgroundColor: `${step.color}15` }}
                                        >
                                            <Icon
                                                className="w-6 h-6"
                                                style={{ color: step.color }}
                                            />
                                        </div>
                                        {index < 2 && (
                                            <div className="w-0.5 h-10 bg-medical-border mt-3" />
                                        )}
                                    </div>
                                    <div className="pt-2">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span
                                                className="text-xs font-bold px-2 py-0.5 rounded-full"
                                                style={{
                                                    color: step.color,
                                                    backgroundColor: `${step.color}15`,
                                                }}
                                            >
                                                Step {step.step}
                                            </span>
                                        </div>
                                        <h3 className="font-heading font-semibold text-navy-900 text-lg mb-1">
                                            {step.title}
                                        </h3>
                                        <p className="text-medical-muted text-sm leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section bg-navy-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-2xl mx-auto"
                    >
                        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">
                            Start Your Health Journey Today
                        </h2>
                        <p className="text-navy-200 mb-8 text-lg">
                            Join thousands of users who trust MediAssist AI for their health
                            insights. Free forever, no credit card required.
                        </p>
                        <div className="flex items-center justify-center gap-4 flex-wrap">
                            <Button
                                size="lg"
                                onClick={() =>
                                    navigate(
                                        isAuthenticated ? ROUTES.ANALYZER : ROUTES.REGISTER
                                    )
                                }
                                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl text-base font-medium shadow-emerald"
                            >
                                {isAuthenticated ? "Go to Analyzer" : "Create Free Account"}
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                            {!isAuthenticated && (
                                <Button
                                    size="lg"
                                    variant="ghost"
                                    onClick={() => navigate(ROUTES.LOGIN)}
                                    className="text-navy-200 hover:text-white hover:bg-white/10 px-8 py-3 rounded-xl text-base font-medium"
                                >
                                    Already have an account? Login
                                </Button>
                            )}
                        </div>

                        {/* Disclaimer */}
                        <p className="text-navy-400 text-xs mt-8 max-w-lg mx-auto">
                            MediAssist AI is designed to provide general health information
                            and is not a substitute for professional medical advice, diagnosis,
                            or treatment. Always consult a qualified healthcare professional.
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;