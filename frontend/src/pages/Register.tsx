import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    Stethoscope,
    Loader2,
    Calendar,
    Droplets,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import { useAuth } from "../hooks/useAuth";
import { ROUTES, GENDER_OPTIONS, BLOOD_GROUPS } from "../constants";
import { cn } from "../lib/utils";

const Register = () => {
    const { handleRegister, isLoading, error, clearError } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState<1 | 2>(1);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        age: "",
        gender: "",
        bloodGroup: "",
    });
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const validateStep1 = (): boolean => {
        const errors: Record<string, string> = {};
        if (!formData.name.trim()) {
            errors.name = "Name is required";
        } else if (formData.name.trim().length < 2) {
            errors.name = "Name must be at least 2 characters";
        }
        if (!formData.email) {
            errors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            errors.email = "Please enter a valid email";
        }
        if (!formData.password) {
            errors.password = "Password is required";
        } else if (formData.password.length < 8) {
            errors.password = "Password must be at least 8 characters";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            errors.password =
                "Password must contain uppercase, lowercase, and a number";
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        if (step === 1) {
            if (validateStep1()) setStep(2);
            return;
        }

        const res = await handleRegister({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            age: formData.age ? parseInt(formData.age) : undefined,
            gender: formData.gender as any,
            bloodGroup: formData.bloodGroup || undefined,
        });

        if (!res.success && res.fieldErrors) {
            setValidationErrors(res.fieldErrors);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        if (validationErrors[e.target.name]) {
            setValidationErrors((prev) => ({ ...prev, [e.target.name]: "" }));
        }
    };

    return (
        <div className="medical-mesh min-h-screen pt-32 pb-16 overflow-x-hidden">
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
                                Start your journey
                            </div>

                            <h1 className="text-5xl xl:text-6xl font-black text-navy-900 tracking-tighter leading-none mb-6 max-w-md">
                                Create your account and unlock the full health suite.
                            </h1>
                            <p className="text-lg text-slate-500 max-w-lg leading-relaxed">
                                Set up your profile to get personalized AI symptom analysis,
                                doctor chat, hospital search, and clinical summaries.
                            </p>
                        </div>

                        <div className="relative z-10 space-y-3">
                            {[
                                {
                                    title: "Completely Free",
                                    desc: "No credit card required, ever",
                                },
                                {
                                    title: "Privacy First",
                                    desc: "Your health data stays secure",
                                },
                                {
                                    title: "AI Powered",
                                    desc: "Backed by Google Gemini AI technology",
                                },
                            ].map((item, index) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.08 }}
                                    className="flex items-start gap-3 text-slate-600"
                                >
                                    <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0 mt-0.5">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-navy-900">{item.title}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                                    </div>
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
                                    Account Setup
                                </p>
                                <h2 className="text-3xl font-heading font-bold text-navy-900">
                                    Create your account
                                </h2>
                                <p className="text-medical-muted mt-2 leading-relaxed">
                                    Already have an account?{" "}
                                    <Link
                                        to={ROUTES.LOGIN}
                                        className="text-emerald-600 hover:text-emerald-700 font-semibold"
                                    >
                                        Sign in
                                    </Link>
                                </p>
                            </div>

                            {/* Step Indicator */}
                            <div className="flex items-center gap-3 mb-8">
                                {[1, 2].map((s) => (
                                    <div key={s} className="flex items-center gap-2">
                                        <div
                                            className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                                                step === s
                                                    ? "bg-navy-900 text-white"
                                                    : step > s
                                                        ? "bg-emerald-500 text-white"
                                                        : "bg-medical-surface text-medical-muted border border-medical-border"
                                            )}
                                        >
                                            {step > s ? "✓" : s}
                                        </div>
                                        <span
                                            className={cn(
                                                "text-sm font-medium",
                                                step === s ? "text-navy-900" : "text-medical-muted"
                                            )}
                                        >
                                            {s === 1 ? "Account" : "Profile"}
                                        </span>
                                        {s < 2 && (
                                            <div
                                                className={cn(
                                                    "w-8 h-0.5 mx-1",
                                                    step > s ? "bg-emerald-500" : "bg-medical-border"
                                                )}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Error Alert */}
                            {error && (
                                <motion.div
                                    data-testid="register-error"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <form data-testid="register-form" onSubmit={handleSubmit} className="space-y-5">
                                {step === 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-5"
                                    >
                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-medium text-medical-text">
                                                Full Name
                                            </Label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-muted" />
                                                <Input
                                                    data-testid="register-name"
                                                    name="name"
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="Ali Akbar"
                                                    className={cn(
                                                        "pl-10 h-14 rounded-2xl border-medical-border bg-white/70 text-navy-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/20",
                                                        validationErrors.name && "border-red-300 focus-visible:ring-red-200"
                                                    )}
                                                    autoComplete="name"
                                                />
                                            </div>
                                            {validationErrors.name && (
                                                <p data-testid="register-name-error" className="text-xs text-red-500">{validationErrors.name}</p>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-medium text-medical-text">
                                                Email Address
                                            </Label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-muted" />
                                                <Input
                                                    data-testid="register-email"
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
                                                <p data-testid="register-email-error" className="text-xs text-red-500">{validationErrors.email}</p>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-medium text-medical-text">
                                                Password
                                            </Label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-muted" />
                                                <Input
                                                    data-testid="register-password"
                                                    name="password"
                                                    type={showPassword ? "text" : "password"}
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    placeholder="Min. 8 characters"
                                                    className={cn(
                                                        "pl-10 pr-10 h-14 rounded-2xl border-medical-border bg-white/70 text-navy-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/20",
                                                        validationErrors.password && "border-red-300 focus-visible:ring-red-200"
                                                    )}
                                                    autoComplete="new-password"
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
                                                <p data-testid="register-password-error" className="text-xs text-red-500">{validationErrors.password}</p>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-5"
                                    >
                                        <div className="p-4 bg-navy-50 border border-navy-100 rounded-2xl">
                                            <p className="text-xs text-navy-700 leading-relaxed">
                                                This information helps our AI provide more accurate and personalized health insights. All fields are optional.
                                            </p>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-medium text-medical-text">
                                                Age <span className="text-medical-muted font-normal">(optional)</span>
                                            </Label>
                                            <div className="relative">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-muted" />
                                                <Input
                                                    data-testid="register-age"
                                                    name="age"
                                                    type="number"
                                                    min={1}
                                                    max={120}
                                                    value={formData.age}
                                                    onChange={handleChange}
                                                    placeholder="Your age"
                                                    className="pl-10 h-14 rounded-2xl border-medical-border bg-white/70 text-navy-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/20"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-medium text-medical-text">
                                                Gender <span className="text-medical-muted font-normal">(optional)</span>
                                            </Label>
                                            <Select
                                                value={formData.gender}
                                                onValueChange={(val) =>
                                                    setFormData((prev) => ({ ...prev, gender: val }))
                                                }

                                            >
                                                <SelectTrigger className="h-14 rounded-2xl border-medical-border bg-white/70 text-navy-900" data-testid="gender-trigger">
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white">
                                                    {GENDER_OPTIONS.map((option) => (
                                                        <SelectItem
                                                            key={option.value}
                                                            value={option.value}
                                                            data-testid={`gender-option-${option.label}`}
                                                        >
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-medium text-medical-text">
                                                Blood Group <span className="text-medical-muted font-normal">(optional)</span>
                                            </Label>
                                            <div className="relative">
                                                <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-muted z-10" />
                                                <Select
                                                    value={formData.bloodGroup}
                                                    onValueChange={(val) =>
                                                        setFormData((prev) => ({ ...prev, bloodGroup: val }))
                                                    }
                                                >
                                                    <SelectTrigger className="pl-10 h-14 rounded-2xl border-medical-border bg-white/70 text-navy-900" data-testid="bloodgroup-trigger" >
                                                        <SelectValue placeholder="Select blood group" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white">
                                                        {BLOOD_GROUPS.map((group) => (
                                                            <SelectItem key={group} value={group} data-testid={`bloodgroup-option-${group}`}>
                                                                {group}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                <div className="flex gap-3 pt-2">
                                    {step === 2 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setStep(1)}
                                            data-testid="register-back"
                                            className="flex-1 h-14 rounded-2xl border-medical-border bg-white/70 text-medical-text hover:bg-navy-50"
                                        >
                                            Back
                                        </Button>
                                    )}
                                    <Button
                                        type="submit"
                                        data-testid={step === 1 ? "register-continue" : "register-create"}
                                        disabled={isLoading}
                                        className="flex-1 h-14 bg-navy-900 hover:bg-navy-950 text-white rounded-2xl font-semibold shadow-navy"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Creating account...
                                            </>
                                        ) : step === 1 ? (
                                            "Continue"
                                        ) : (
                                            "Create Account"
                                        )}
                                    </Button>
                                </div>

                                {step === 2 && (
                                    <button
                                        type="button"
                                        data-testid="register-skip-profile"
                                        onClick={() =>
                                            handleRegister({
                                                name: formData.name,
                                                email: formData.email,
                                                password: formData.password,
                                            })
                                        }
                                        className="w-full text-sm text-medical-muted hover:text-navy-900 transition-colors"
                                    >
                                        Skip profile setup for now
                                    </button>
                                )}
                            </form>

                            <p className="text-xs text-medical-muted text-center mt-6 leading-relaxed">
                                By creating an account, you acknowledge that MediAssist AI is not a substitute for professional medical advice.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Register;