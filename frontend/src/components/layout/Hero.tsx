import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, ShieldCheck, Zap, Users } from "lucide-react";
import { ROUTES } from "../../constants";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../../components/ui/button";

const trustItems = [
    { icon: ShieldCheck, label: "Military-grade encryption" },
    { icon: Zap, label: "Instant AI analysis" },
    { icon: Users, label: "Trusted by thousands" },
];

const Hero = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();

    return (
        <section className="relative min-h-screen flex overflow-hidden">

            {/* ── LEFT PANEL ── */}
            <div className="relative z-10 flex flex-col justify-center w-full lg:w-[52%] px-8 sm:px-14 lg:px-20 pt-32 pb-20 bg-[#060f1e]">

                {/* Subtle green ambient glow */}
                <div className="pointer-events-none absolute top-1/3 -left-24 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px]" />

                {/* Pill badge */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2.5 self-start mb-10 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/10"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                    </span>
                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-[0.14em]">
                        AI Healthcare Platform
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-5xl sm:text-6xl xl:text-7xl font-extrabold leading-[1.06] tracking-tight text-white mb-6"
                >
                    Wellness,{" "}
                    <br />
                    <span className="text-emerald-400">Reimagined</span>
                    <br />
                    by AI.
                </motion.h1>

                {/* Sub-copy */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-slate-400 text-lg leading-relaxed max-w-md mb-10 font-light"
                >
                    Clinical-grade body analysis and 24/7 AI consultation — accurate,
                    private, and always present.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-wrap gap-4 mb-14"
                >
                    <Button
                        size="lg"
                        onClick={() => navigate(isAuthenticated ? ROUTES.ANALYZER : ROUTES.REGISTER)}
                        className="h-14 px-8 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-base shadow-lg shadow-emerald-500/20 transition-all group"
                    >
                        {isAuthenticated ? "Open Health Suite" : "Get Started Free"}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>

                    <Button
                        size="lg"
                        variant="ghost"
                        onClick={() => navigate(ROUTES.CHAT)}
                        className="h-14 px-8 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 font-medium text-base transition-all"
                    >
                        <MessageCircle className="w-4 h-4 mr-2 opacity-70" />
                        Virtual Consultation
                    </Button>
                </motion.div>

                {/* Trust bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex flex-wrap gap-6"
                >
                    {trustItems.map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center gap-2 text-slate-500 text-sm">
                            <Icon className="w-4 h-4 text-emerald-500/70 flex-shrink-0" />
                            <span>{label}</span>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* ── RIGHT PANEL — Photo ── */}
            <div className="hidden lg:block absolute inset-y-0 right-0 w-[52%]">
                {/* Replace src with your preferred Unsplash photo or local asset */}
                <img
                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&q=85&fit=crop"
                    alt="Doctor reviewing medical scans"
                    className="w-full h-full object-cover"
                />

                {/* Gradient fade from left so text panel bleeds in */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#060f1e] via-[#060f1e]/30 to-transparent" />

                {/* Floating stat card — bottom-left of photo */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.6 }}
                    className="absolute bottom-12 left-8 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-6 py-4"
                >
                    <p className="text-white/50 text-xs font-medium uppercase tracking-widest mb-1">Clinical Accuracy</p>
                    <p className="text-white text-3xl font-extrabold tracking-tight">99.2%</p>
                </motion.div>

                {/* Floating AI badge — top-right of photo */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="absolute top-12 right-10 bg-emerald-500/15 backdrop-blur-md border border-emerald-400/25 rounded-xl px-4 py-3 flex items-center gap-3"
                >
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                    </span>
                    <span className="text-emerald-300 text-sm font-semibold">AI Analysis Active</span>
                </motion.div>
            </div>

        </section>
    );
};

export default Hero;