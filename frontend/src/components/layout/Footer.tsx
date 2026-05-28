import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Stethoscope,
    Heart,
    Mail,
    MapPin,
    Phone,
    Shield,
    Clock,
    GitBranch,
} from "lucide-react";
import { ROUTES, EMERGENCY_NUMBERS } from "../../constants";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        features: [
            { label: "Symptom Analyzer", href: ROUTES.ANALYZER },
            { label: "AI Doctor Chat", href: ROUTES.CHAT },
            { label: "Health Dashboard", href: ROUTES.DASHBOARD },
            { label: "Medicine Info", href: ROUTES.MEDICINE },
            { label: "Find Hospitals", href: ROUTES.HOSPITALS },
        ],
        account: [
            { label: "Login", href: ROUTES.LOGIN },
            { label: "Register", href: ROUTES.REGISTER },
            { label: "Dashboard", href: ROUTES.DASHBOARD },
        ],
    };

    return (
        <footer className="bg-navy-900 text-white mt-auto">
            {/* Emergency Banner */}
            <div className="bg-red-600 py-2">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center gap-6 flex-wrap text-sm">
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span className="font-medium">
                                Emergency: {EMERGENCY_NUMBERS.PAKISTAN_RESCUE}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span className="font-medium">
                                Ambulance: {EMERGENCY_NUMBERS.PAKISTAN_AMBULANCE}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Available 24/7</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link to={ROUTES.HOME} className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                                <Stethoscope className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <span className="font-heading font-bold text-lg text-white leading-none block">
                                    MediAssist
                                </span>
                                <span className="text-emerald-400 text-xs font-medium leading-none">
                                    AI
                                </span>
                            </div>
                        </Link>
                        <p className="text-navy-200 text-sm leading-relaxed mb-4">
                            Your intelligent medical assistant powered by Google Gemini AI.
                            Get instant health insights and find nearby medical facilities.
                        </p>
                        <div className="flex items-center gap-2 text-navy-200 text-sm">
                            <Shield className="w-4 h-4 text-emerald-400" />
                            <span>Not a substitute for professional medical advice</span>
                        </div>
                    </div>

                    {/* Features */}
                    <div>
                        <h3 className="font-heading font-semibold text-white mb-4">
                            Features
                        </h3>
                        <ul className="space-y-2">
                            {footerLinks.features.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        to={link.href}
                                        className="text-navy-200 hover:text-emerald-400 text-sm transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Account */}
                    <div>
                        <h3 className="font-heading font-semibold text-white mb-4">
                            Account
                        </h3>
                        <ul className="space-y-2">
                            {footerLinks.account.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        to={link.href}
                                        className="text-navy-200 hover:text-emerald-400 text-sm transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-heading font-semibold text-white mb-4">
                            Contact & Info
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 text-navy-200 text-sm">
                                <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                                <span>Rawalpindi, Punjab, Pakistan</span>
                            </li>
                            <li className="flex items-center gap-2 text-navy-200 text-sm">
                                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>mediassist.ai@gmail.com</span>
                            </li>
                            <li className="flex items-center gap-2 text-navy-200 text-sm">
                                <GitBranch className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>github.com/mediassist-ai</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 mt-10 pt-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Copyright */}
                        <p className="text-navy-300 text-sm text-center md:text-left">
                            © {currentYear} MediAssist AI. All rights reserved.
                        </p>

                        {/* Developers */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2 text-sm text-navy-300"
                        >
                            <span>Developed with</span>
                            <Heart className="w-4 h-4 text-red-400 fill-red-400" />
                            <span>by</span>
                            <div className="flex items-center gap-1">
                                <span className="text-emerald-400 font-medium">Ali Akbar</span>
                                <span>,</span>
                                <span className="text-emerald-400 font-medium">Laiba</span>
                                <span>&</span>
                                <span className="text-emerald-400 font-medium">Zainab</span>
                            </div>
                        </motion.div>

                        {/* Disclaimer */}
                        <p className="text-navy-400 text-xs text-center md:text-right max-w-xs">
                            For educational purposes. Always consult a qualified healthcare
                            professional.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;