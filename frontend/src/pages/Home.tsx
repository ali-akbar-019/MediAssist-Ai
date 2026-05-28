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
        title: "Advanced Body Map",
        description:
            "Deeply granular anatomical selection with 100+ points of analysis. Pinpoint your discomfort with medical precision.",
        color: "#064e3b",
        bg: "rgba(16, 185, 129, 0.08)",
    },
    {
        icon: Brain,
        title: "Clinical AI Analysis",
        description:
            "Powered by Google Gemini 1.5 Pro to provide instantaneous, multidimensional insights into your wellness.",
        color: "#10B981",
        bg: "rgba(16, 185, 129, 0.05)",
    },
    {
        icon: MessageCircle,
        title: "Consultative Chat",
        description:
            "A sophisticated virtual healthcare companion available 24/7 for deeply personalized health dialogues.",
        color: "#1e3a8a",
        bg: "rgba(30, 58, 138, 0.05)",
    },
    {
        icon: MapPin,
        title: "Premier Facilities",
        description:
            "Locate world-class healthcare institutions and specialized clinics in your immediate vicinity.",
        color: "#991b1b",
        bg: "rgba(153, 27, 27, 0.05)",
    },
    {
        icon: Shield,
        title: "Privacy First",
        description:
            "Your medical data is encrypted with military-grade protocols. Your privacy is our highest mandate.",
        color: "#15803d",
        bg: "rgba(21, 128, 61, 0.05)",
    },
    {
        icon: Activity,
        title: "Wellness Insights",
        description:
            "Holistic monitoring of your health trajectory with beautifully rendered analytical indices.",
        color: "#0891b2",
        bg: "rgba(8, 145, 178, 0.05)",
    },
];

const stats = [
    { value: "99.2%", label: "Clinical Accuracy", icon: CheckCircle },
    { value: "Instant", label: "Analysis Speed", icon: Zap },
    { value: "Elite", label: "Medical Data", icon: Shield },
    { value: "Global", label: "24/7 Access", icon: Clock },
];

const Home = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();

    return (
        <div className="medical-mesh min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-panel text-emerald-800 text-xs font-bold uppercase tracking-widest mb-10 border border-emerald-100/50"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Elite AI Healthcare Experience
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-navy-900 mb-8 leading-[1.05]"
                        >
                            Wellness, <br />
                            <span className="gradient-text-luxe">Reimagined by AI.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto mb-12 font-light leading-relaxed"
                        >
                            Experience the future of personal health with our premier
                            medical intelligence system. Sophisticated, accurate, and always present.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-6"
                        >
                            <Button
                                size="lg"
                                onClick={() => navigate(isAuthenticated ? ROUTES.ANALYZER : ROUTES.REGISTER)}
                                className="h-16 px-10 rounded-2xl bg-navy-900 text-white text-lg font-semibold hover:bg-navy-950 transition-all shadow-navy group"
                            >
                                {isAuthenticated ? "Enter Analyzer" : "Join the Elite"}
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => navigate(ROUTES.CHAT)}
                                className="h-16 px-10 rounded-2xl border-2 border-emerald-100 glass-panel text-navy-900 text-lg font-semibold hover:bg-emerald-50 transition-all"
                            >
                                <MessageCircle className="w-5 h-5 mr-3" />
                                Virtual Consultation
                            </Button>
                        </motion.div>
                    </div>
                </div>

                {/* Abstract Background Accents */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10 opacity-30">
                    <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-emerald-200/40 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-navy-200/30 rounded-full blur-[100px]" />
                </div>
            </section>

            {/* Stats Section */}
            <section className="pb-32">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-panel p-8 rounded-[2rem] text-center"
                            >
                                <stat.icon className="w-6 h-6 text-emerald-600 mx-auto mb-4" />
                                <div className="text-3xl font-bold text-navy-900 mb-1">{stat.value}</div>
                                <div className="text-xs uppercase tracking-widest font-bold text-slate-400">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-32 relative bg-white/40">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-24">
                        <motion.h2
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-4xl md:text-5xl font-bold text-navy-900 mb-6"
                        >
                            The Pinnacle of <br />
                            <span className="gradient-text-luxe">Digital Wellness.</span>
                        </motion.h2>
                        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light">
                            Crafted for those who demand precision and elegance in their health journey.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group glass-panel p-10 rounded-[2.5rem] hover:bg-emerald-900 hover:text-white transition-all duration-500 hover:-translate-y-2 cursor-default"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-8 group-hover:bg-white/10 group-hover:scale-110 transition-all duration-500">
                                    <feature.icon className="w-8 h-8 text-emerald-600 group-hover:text-emerald-300" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 group-hover:text-white">{feature.title}</h3>
                                <p className="text-slate-500 group-hover:text-emerald-100/70 leading-relaxed font-light">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-40">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto rounded-[3.5rem] bg-navy-900 p-12 lg:p-24 relative overflow-hidden shadow-navy">
                        {/* Decorative Background for CTA */}
                        <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20">
                            <div className="absolute top-[-50%] right-[-10%] w-[800px] h-[800px] bg-emerald-400 rounded-full blur-[150px]" />
                        </div>

                        <div className="relative z-10 max-w-3xl">
                            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8">
                                Embark on your <br />
                                <span className="text-emerald-400">Superior Health Experience.</span>
                            </h2>
                            <p className="text-xl text-emerald-100/60 mb-12 font-light leading-relaxed">
                                Join the vanguard of personalized healthcare. Always available,
                                impeccably private, and profoundly accurate.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6">
                                <Button
                                    size="lg"
                                    onClick={() => navigate(isAuthenticated ? ROUTES.ANALYZER : ROUTES.REGISTER)}
                                    className="h-16 px-12 rounded-2xl bg-emerald-500 text-white text-lg font-bold hover:bg-emerald-400 transition-all shadow-emerald"
                                >
                                    {isAuthenticated ? "Open Health Suite" : "Create Elite Account"}
                                </Button>
                                <p className="text-emerald-500/50 text-xs mt-auto py-2 italic font-medium">
                                    No commitment required. Professional advisory only.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>

    );
};

export default Home;