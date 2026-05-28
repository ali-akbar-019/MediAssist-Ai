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
    const [validationErrors, setValidationErrors] = useState
        <Record<string, string>
        >({});

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
        await handleRegister({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            age: formData.age ? parseInt(formData.age) : undefined,
            gender: formData.gender as "male" | "female" | "other" | undefined,
            bloodGroup: formData.bloodGroup || undefined,
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        if (validationErrors[e.target.name]) {
            setValidationErrors((prev) => ({ ...prev, [e.target.name]: "" }));
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex">
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-navy-900 flex-col justify-between p-12 relative overflow-hidden">
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
                        Start your AI-powered health journey today
                    </h1>
                    <p className="text-navy-200 text-lg leading-relaxed">
                        Create your free account and get instant access to AI symptom
                        analysis, doctor chat, and much more.
                    </p>
                </div>

                <div className="relative space-y-4">
                    {[
                        {
                            title: "Completely Free",
                            desc: "No credit card required, ever",
                        },
                        {
                            title: "Privacy First",
                            desc: "Your health data is secure and private",
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
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-3"
                        >
                            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                            </div>
                            <div>
                                <p className="text-white text-sm font-medium">{item.title}</p>
                                <p className="text-navy-300 text-xs mt-0.5">{item.desc}</p>
                            </div>
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
                            Create your account
                        </h2>
                        <p className="text-medical-muted mt-1">
                            Already have an account?{" "}
                            <Link
                                to={ROUTES.LOGIN}
                                className="text-emerald-600 hover:text-emerald-700 font-medium"
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
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Step 1 — Account Info */}
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-5"
                            >
                                {/* Name */}
                                <div className="space-y-1.5">
                                    <Label className="text-sm font-medium text-medical-text">
                                        Full Name
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-muted" />
                                        <Input
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Ali Akbar"
                                            className={cn(
                                                "pl-9",
                                                validationErrors.name &&
                                                "border-red-300 focus:ring-red-200"
                                            )}
                                            autoComplete="name"
                                        />
                                    </div>
                                    {validationErrors.name && (
                                        <p className="text-xs text-red-500">
                                            {validationErrors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="space-y-1.5">
                                    <Label className="text-sm font-medium text-medical-text">
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-muted" />
                                        <Input
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
                                        <p className="text-xs text-red-500">
                                            {validationErrors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
                                <div className="space-y-1.5">
                                    <Label className="text-sm font-medium text-medical-text">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-muted" />
                                        <Input
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Min. 8 characters"
                                            className={cn(
                                                "pl-9 pr-9",
                                                validationErrors.password &&
                                                "border-red-300 focus:ring-red-200"
                                            )}
                                            autoComplete="new-password"
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
                            </motion.div>
                        )}

                        {/* Step 2 — Health Profile */}
                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-5"
                            >
                                <div className="p-3 bg-navy-50 border border-navy-100 rounded-xl">
                                    <p className="text-xs text-navy-700">
                                        This information helps our AI provide more accurate and
                                        personalized health insights. All fields are optional.
                                    </p>
                                </div>

                                {/* Age */}
                                <div className="space-y-1.5">
                                    <Label className="text-sm font-medium text-medical-text">
                                        Age{" "}
                                        <span className="text-medical-muted font-normal">
                                            (optional)
                                        </span>
                                    </Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-muted" />
                                        <Input
                                            name="age"
                                            type="number"
                                            min={1}
                                            max={120}
                                            value={formData.age}
                                            onChange={handleChange}
                                            placeholder="Your age"
                                            className="pl-9"
                                        />
                                    </div>
                                </div>

                                {/* Gender */}
                                <div className="space-y-1.5">
                                    <Label className="text-sm font-medium text-medical-text">
                                        Gender{" "}
                                        <span className="text-medical-muted font-normal">
                                            (optional)
                                        </span>
                                    </Label>
                                    <Select
                                        value={formData.gender}
                                        onValueChange={(val) =>
                                            setFormData((prev) => ({ ...prev, gender: val }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {GENDER_OPTIONS.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Blood Group */}
                                <div className="space-y-1.5">
                                    <Label className="text-sm font-medium text-medical-text">
                                        Blood Group{" "}
                                        <span className="text-medical-muted font-normal">
                                            (optional)
                                        </span>
                                    </Label>
                                    <div className="relative">
                                        <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-muted z-10" />
                                        <Select
                                            value={formData.bloodGroup}
                                            onValueChange={(val) =>
                                                setFormData((prev) => ({ ...prev, bloodGroup: val }))
                                            }
                                        >
                                            <SelectTrigger className="pl-9">
                                                <SelectValue placeholder="Select blood group" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {BLOOD_GROUPS.map((group) => (
                                                    <SelectItem key={group} value={group}>
                                                        {group}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-3 pt-2">
                            {step === 2 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setStep(1)}
                                    className="flex-1 border-medical-border"
                                >
                                    Back
                                </Button>
                            )}
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 bg-navy-900 hover:bg-navy-800 text-white py-3 rounded-xl font-medium shadow-navy"
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

                    <p className="text-xs text-medical-muted text-center mt-6">
                        By creating an account, you acknowledge that MediAssist AI is not a
                        substitute for professional medical advice.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;