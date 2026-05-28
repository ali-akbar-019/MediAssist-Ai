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
        <div className="min-h-[calc(100vh-4rem)] flex">
            {/* Left Panel — Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-navy-900 flex-col justify-between p-12 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full border border-white"
                            style={{
                                width: `${(i + 1) * 150}px`,
                                height: `${(i + 1) * 150}px`,
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                            }}
                        />
                    ))}
                </div>

                <div className="relative">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                            <Stethoscope className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <span className="text-white font-heading font-bold text-xl leading-none block">
                                MediAssist
                            </span>
                            <span className="text-emerald-400 text-xs font-medium">AI</span>
                        </div>
                    </div>

                    <h1 className="text-4xl font-heading font-bold text-white leading-tight mb-4">
                        Welcome back to your health companion
                    </h1>
                    <p className="text-navy-200 text-lg leading-relaxed">
                        Continue your health journey with AI-powered symptom analysis and
                        personalized medical insights.
                    </p>
                </div>

                {/* Feature Pills */}
                <div className="relative space-y-3">
                    {[
                        "AI-powered symptom analysis",
                        "Real-time doctor chat",
                        "Find nearby hospitals",
                        "Download health reports",
                    ].map((feature, index) => (
                        <motion.div
                            key={feature}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-3 text-navy-200"
                        >
                            <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                            </div>
                            <span className="text-sm">{feature}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Right Panel — Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile Logo */}
                    <div className="flex items-center gap-2 mb-8 lg:hidden">
                        <div className="w-8 h-8 rounded-xl bg-navy-900 flex items-center justify-center">
                            <Stethoscope className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-heading font-bold text-navy-900">
                            MediAssist AI
                        </span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-heading font-bold text-navy-900">
                            Sign in to your account
                        </h2>
                        <p className="text-medical-muted mt-1">
                            Don't have an account?{" "}
                            <Link
                                to={ROUTES.REGISTER}
                                className="text-emerald-600 hover:text-emerald-700 font-medium"
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
                            className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="email"
                                className="text-sm font-medium text-medical-text"
                            >
                                Email address
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-muted" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className={cn(
                                        "pl-9",
                                        validationErrors.email &&
                                        "border-red-300 focus:ring-red-200"
                                    )}
                                    autoComplete="email"
                                />
                            </div>
                            {validationErrors.email && (
                                <p className="text-xs text-red-500">{validationErrors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="password"
                                className="text-sm font-medium text-medical-text"
                            >
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-muted" />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className={cn(
                                        "pl-9 pr-9",
                                        validationErrors.password &&
                                        "border-red-300 focus:ring-red-200"
                                    )}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-medical-muted hover:text-navy-900 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {validationErrors.password && (
                                <p className="text-xs text-red-500">
                                    {validationErrors.password}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-navy-900 hover:bg-navy-800 text-white py-3 rounded-xl font-medium shadow-navy"
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

                    {/* Disclaimer */}
                    <p className="text-xs text-medical-muted text-center mt-8">
                        By signing in, you agree that MediAssist AI is not a substitute for
                        professional medical advice.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;