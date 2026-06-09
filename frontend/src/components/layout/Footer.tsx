import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Stethoscope,
    Heart,
    Mail,
    MapPin,
    Phone,
    Shield,
} from "lucide-react";
import { ROUTES, EMERGENCY_NUMBERS } from "../../constants";

const Footer = () => {

    const footerLinks = {
        features: [
            { label: "Elite Symptom Analyzer", href: ROUTES.ANALYZER },
            { label: "AI Doctor Dialogues", href: ROUTES.CHAT },
            { label: "Wellness Portfolio", href: ROUTES.DASHBOARD },
            { label: "Pharmacology Suite", href: ROUTES.MEDICINE },
            { label: "Premier Institutions", href: ROUTES.HOSPITALS },
        ],
        account: [
            { label: "Member Login", href: ROUTES.LOGIN },
            { label: "Join the Elite", href: ROUTES.REGISTER },
            { label: "Your Dashboard", href: ROUTES.DASHBOARD },
        ],
    };

    return (
        <footer className="bg-navy-900 pt-24 pb-12 overflow-hidden relative border-t border-white/5 mt-auto">
            {/* Mesh Gradient Background Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
                <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-emerald-500/20 rounded-full blur-[150px]" />
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-navy-800/50 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Emergency Dark Glass Banner */}
                <div className="max-w-4xl mx-auto mb-20">
                    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20 group/emergency transition-all duration-300 hover:bg-red-500/20">
                                <Phone className="w-6 h-6 text-red-500 transition-transform duration-300 group-hover/emergency:scale-110" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-lg leading-none mb-1">Emergency Support</h4>
                                <p className="text-white/50 text-xs uppercase tracking-widest font-bold">Available 24/7 Globally</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-12 flex-wrap justify-center font-bold text-white">
                            <div className="flex flex-col items-center md:items-start gap-1">
                                <span className="text-navy-400 text-[10px] uppercase tracking-tighter">Rescue</span>
                                <span className="text-xl tracking-tight">{EMERGENCY_NUMBERS.PAKISTAN_RESCUE}</span>
                            </div>
                            <div className="flex flex-col items-center md:items-start gap-1 text-emerald-400">
                                <span className="text-emerald-500/50 text-[10px] uppercase tracking-tighter">Ambulance</span>
                                <span className="text-xl tracking-tight">{EMERGENCY_NUMBERS.PAKISTAN_AMBULANCE}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24 text-center lg:text-left">
                    {/* Brand */}
                    <div className="flex flex-col items-center lg:items-start">
                        <Link to={ROUTES.HOME} className="flex items-center gap-3 mb-8 group">
                            <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-emerald-500/10 transition-all duration-500">
                                <Stethoscope className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div className="text-left">
                                <span className="font-bold text-2xl text-white tracking-tighter block leading-none">
                                    MediAssist<span className="text-emerald-500">AI</span>
                                </span>
                                <span className="text-[10px] uppercase tracking-[0.3em] font-black text-emerald-500/50 mt-1 block">
                                    Luxury Terminal
                                </span>
                            </div>
                        </Link>
                        <p className="text-emerald-100/60 text-sm leading-relaxed mb-8 max-w-xs font-light">
                            Pioneering the future of clinical intelligence. We provide elite digital health experiences for the modern world.
                        </p>
                        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-emerald-100/40 text-[10px] font-bold uppercase tracking-widest">
                            <Shield className="w-3.5 h-3.5 text-emerald-500/70" />
                            <span>Clinical Grade Privacy</span>
                        </div>
                    </div>

                    {/* Features */}
                    <div>
                        <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-emerald-500/40 mb-8 pt-2">
                            The Interface
                        </h4>
                        <ul className="space-y-4">
                            {footerLinks.features.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        to={link.href}
                                        className="text-emerald-100/50 hover:text-emerald-400 text-sm font-medium transition-all hover:pl-2 inline-block"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Account */}
                    <div>
                        <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-emerald-500/40 mb-8 pt-2">
                            Access
                        </h4>
                        <ul className="space-y-4">
                            {footerLinks.account.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        to={link.href}
                                        className="text-emerald-100/50 hover:text-emerald-400 text-sm font-medium transition-all hover:pl-2 inline-block"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-emerald-500/40 mb-8 pt-2">
                            Concierge
                        </h4>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4 text-emerald-100/60 text-sm font-light justify-center lg:justify-start">
                                <div className="p-2 rounded-lg bg-white/5">
                                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                                </div>
                                <span className="pt-1">Premier Plaza, Gulberg <br /><span className="text-emerald-500/50 font-bold uppercase text-[10px]">Islamabad, PK</span></span>
                            </li>
                            <li className="flex items-center gap-4 text-emerald-100/60 text-sm font-light justify-center lg:justify-start">
                                <div className="p-2 rounded-lg bg-white/5">
                                    <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                                </div>
                                <span>concierge@mediassist.ai</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Copyright */}
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-[1px] bg-emerald-500/30" />
                        <p className="text-emerald-100/20 text-[10px] uppercase tracking-widest font-black">
                            MediAssist AI &bull; Excellence 2026
                        </p>
                    </div>

                    {/* Developers */}
                    <div className="flex items-center gap-4 px-6 py-2 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-emerald-100/40">
                        <span className="uppercase tracking-[0.2em]">Developed with</span>
                        <motion.div
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Heart className="w-3.5 h-3.5 text-emerald-500/70 fill-emerald-500/70" />
                        </motion.div>
                        <div className="flex items-center gap-2 text-emerald-100/60">
                            <span className="hover:text-emerald-400 cursor-default transition-colors">Ali Akbar</span>
                            <span className="opacity-20">/</span>
                            <span className="hover:text-emerald-400 cursor-default transition-colors">Laiba</span>
                            <span className="opacity-20">/</span>
                            <span className="hover:text-emerald-400 cursor-default transition-colors">Zainab</span>
                        </div>
                    </div>

                    <p className="text-emerald-500/30 text-[9px] uppercase tracking-tighter leading-tight max-w-[200px] text-center md:text-right font-black italic">
                        Not a substitute for professional medical advice. Always consult a physician.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;