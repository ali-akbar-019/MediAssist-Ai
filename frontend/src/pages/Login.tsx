import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Stethoscope, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../constants";
import { cn } from "../lib/utils";

const Login = () => {
    const { handleLogin, isLoading, error, clearError } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [validationErrors, setValidationErrors] = useState<{
        email?: string;
        password?: string;
    }>({});

    const validate = (): boolean => {
        const errors: { email?: string; password?: string } = {};
        if (!formData.email) {
            errors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            errors.email = "Please enter a valid email";
        }
        if (!formData.password) {
            errors.password = "Password is required";
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        if (!validate()) return;
        await handleLogin(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        if (validationErrors[e.target.name as keyof typeof validationErrors]) {
            setValidationErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
        }
    };

    return (
        <div className="medical-mesh min-h-screen pt-24 pb-16 overflow-x-hidden">
            <div className="container mx-auto px-6 relative">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-stretch">
                    {/* Left Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="hidden lg:flex glass-panel rounded-[3rem] p-10 xl:p-12 flex-col justify-between relative overflow-hidden min-h-180"
                    >
                        <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
                            {[...Array(4)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute rounded-full border border-emerald-900"
                                    style={{
                                        width: `${(i + 1) * 180}px`,
                                        height: `${(i + 1) * 180}px`,
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                    }}
                                />
                            ))}
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-12">
                                <div className="w-11 h-11 rounded-2xl bg-navy-900 flex items-center justify-center shadow-navy">
                                    <Stethoscope className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div>
                                    <span className="text-navy-900 font-heading font-bold text-2xl leading-none block">
                                        MediAssist
                                    </span>
                                    <span className="text-emerald-600 text-xs font-bold uppercase tracking-[0.25em]">
                                        AI Health Suite
                                    </span>
                                </div>
                            </div>

                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                                Secure Access
                            </div>

                            <h1 className="text-5xl xl:text-6xl font-black text-navy-900 tracking-tighter leading-none mb-6 max-w-md">
                                Welcome back to your clinical command center.
                            </h1>
                            <p className="text-lg text-slate-500 max-w-lg leading-relaxed">
                                Continue with AI symptom analysis, doctor chat, hospital search,
                                and the rest of your personalized health workflow.
                            </p>
                        </div>

                        <div className="relative z-10 space-y-3">
                            {[
                                "AI-powered symptom analysis",
                                "Real-time doctor chat",
                                "Nearby hospital search",
                                "Downloadable clinical reports",
                            ].map((feature, index) => (
                                <motion.div
                                    key={feature}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.08 }}
                                    className="flex items-center gap-3 text-slate-600"
                                >
                                    <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    </div>
                                    <span className="text-sm font-medium">{feature}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-panel rounded-[3rem] p-6 sm:p-8 md:p-10 flex items-center justify-center relative overflow-hidden"
                    >
                        <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
                            <div className="w-full h-full border-y border-emerald-900 grid grid-cols-6 divide-x divide-emerald-900" />
                        </div>

                        <div className="relative z-10 w-full max-w-md">
                            <div className="flex items-center gap-2 mb-8 lg:hidden">
                                <div className="w-8 h-8 rounded-xl bg-navy-900 flex items-center justify-center shadow-navy">
                                    <Stethoscope className="w-4 h-4 text-emerald-400" />
                                </div>
                                <span className="font-heading font-bold text-navy-900">
                                    MediAssist AI
                                </span>
                            </div>

                            <div className="mb-8">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-700 mb-3">
                                    Account Login
                                </p>
                                <h2 className="text-3xl font-heading font-bold text-navy-900">
                                    Sign in to your account
                                </h2>
                                <p className="text-medical-muted mt-2 leading-relaxed">
                                    Don't have an account?{" "}
                                    <Link
                                        to={ROUTES.REGISTER}
                                        className="text-emerald-600 hover:text-emerald-700 font-semibold"
                                    >
                                        Create one free
                                    </Link>
                                </p>
                            </div>

                            {/* Error Alert */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-1.5">
                                    <Label htmlFor="email" className="text-sm font-medium text-medical-text">
                                        Email address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-muted" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="you@example.com"
                                            className={cn(
                                                "pl-10 h-14 rounded-2xl border-medical-border bg-white/70 text-navy-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/20",
                                                validationErrors.email && "border-red-300 focus-visible:ring-red-200"
                                            )}
                                            autoComplete="email"
                                        />
                                    </div>
                                    {validationErrors.email && (
                                        <p className="text-xs text-red-500">{validationErrors.email}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="password" className="text-sm font-medium text-medical-text">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-muted" />
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Enter your password"
                                            className={cn(
                                                "pl-10 pr-10 h-14 rounded-2xl border-medical-border bg-white/70 text-navy-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/20",
                                                validationErrors.password && "border-red-300 focus-visible:ring-red-200"
                                            )}
                                            autoComplete="current-password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-medical-muted hover:text-navy-900 transition-colors"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                    {validationErrors.password && (
                                        <p className="text-xs text-red-500">{validationErrors.password}</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-14 bg-navy-900 hover:bg-navy-950 text-white rounded-2xl font-semibold shadow-navy"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Signing in...
                                        </>
                                    ) : (
                                        "Sign In"
                                    )}
                                </Button>
                            </form>

                            <p className="text-xs text-medical-muted text-center mt-8 leading-relaxed">
                                By signing in, you agree that MediAssist AI is not a substitute for professional medical advice.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Login;