import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    User,
    Stethoscope,
    Loader2,
    Calendar,
    Droplets,
    HeartPulse,
    AlertCircle,
    Phone,
    Users,
    Save,
    CheckCircle2,
    X,
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
import { useAuthStore } from "../store/authStore";
import { useAuth } from "../hooks/useAuth";
import { getCurrentUser } from "../services/authService";
import { GENDER_OPTIONS, BLOOD_GROUPS } from "../constants";
import { cn } from "../lib/utils";

const Profile = () => {
    const { user, setUser } = useAuthStore();
    const { handleUpdateProfile, isLoading, error, clearError } = useAuth();
    const [success, setSuccess] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "",
        bloodGroup: "",
        allergies: "",
        chronicConditions: "",
        emergencyName: "",
        emergencyPhone: "",
        emergencyRelation: "",
    });

    useEffect(() => {
        const fetchFreshUser = async () => {
            try {
                const freshUser = await getCurrentUser();
                setUser(freshUser);
            } catch {
                // fall through to persisted user
            }
        };
        fetchFreshUser();
    }, [setUser]);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                age: user.age?.toString() || "",
                gender: user.gender || "",
                bloodGroup: user.bloodGroup || "",
                allergies: user.allergies?.join(", ") || "",
                chronicConditions: user.chronicConditions?.join(", ") || "",
                emergencyName: user.emergencyContact?.name || user.emergencyContacts?.[0]?.name || "",
                emergencyPhone: user.emergencyContact?.phone || user.emergencyContacts?.[0]?.phone || "",
                emergencyRelation: user.emergencyContact?.relation || user.emergencyContacts?.[0]?.relation || "",
            });
        }
    }, [user]);

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.name.trim()) {
            errors.name = "Name is required";
        } else if (formData.name.trim().length < 2) {
            errors.name = "Name must be at least 2 characters";
        } else if (!/^[a-zA-Z\s'-]+$/.test(formData.name.trim())) {
            errors.name = "Name can only contain letters, spaces, apostrophes, and hyphens";
        }

        if (formData.age) {
            const ageNum = parseInt(formData.age);
            if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
                errors.age = "Age must be between 1 and 120";
            }
        }

        if (formData.gender && !["male", "female", "other"].includes(formData.gender)) {
            errors.gender = "Invalid gender selection";
        }

        if (formData.bloodGroup && !["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(formData.bloodGroup)) {
            errors.bloodGroup = "Invalid blood group";
        }

        if (formData.allergies.trim()) {
            const items = formData.allergies.split(",").map((s) => s.trim()).filter(Boolean);
            for (const item of items) {
                if (item.length < 2) {
                    errors.allergies = `"${item}" is too short — each allergy must be at least 2 characters`;
                    break;
                }
                if (!/[a-zA-Z]/.test(item)) {
                    errors.allergies = `"${item}" is not a valid allergy — must contain at least one letter`;
                    break;
                }
                if (!/^[a-zA-Z\s\-\(\)\,\.']+$/.test(item)) {
                    errors.allergies = `"${item}" contains invalid characters`;
                    break;
                }
            }
        }

        if (formData.chronicConditions.trim()) {
            const items = formData.chronicConditions.split(",").map((s) => s.trim()).filter(Boolean);
            for (const item of items) {
                if (item.length < 2) {
                    errors.chronicConditions = `"${item}" is too short — each condition must be at least 2 characters`;
                    break;
                }
                if (!/[a-zA-Z]/.test(item)) {
                    errors.chronicConditions = `"${item}" is not a valid condition — must contain at least one letter`;
                    break;
                }
                if (!/^[a-zA-Z\s\-\(\)\,\.']+$/.test(item)) {
                    errors.chronicConditions = `"${item}" contains invalid characters`;
                    break;
                }
            }
        }

        const hasEmergency = formData.emergencyName || formData.emergencyPhone || formData.emergencyRelation;
        if (hasEmergency) {
            if (!formData.emergencyName.trim()) {
                errors.emergencyName = "Emergency contact name is required";
            } else if (formData.emergencyName.trim().length < 2) {
                errors.emergencyName = "Emergency contact name must be at least 2 characters";
            } else if (!/^[a-zA-Z\s'-]+$/.test(formData.emergencyName.trim())) {
                errors.emergencyName = "Emergency contact name can only contain letters, spaces, apostrophes, and hyphens";
            }

            if (!formData.emergencyPhone.trim()) {
                errors.emergencyPhone = "Emergency contact phone is required";
            } else if (!/^[\d\s\-\(\)+]{7,20}$/.test(formData.emergencyPhone.trim())) {
                errors.emergencyPhone = "Please enter a valid phone number";
            }

            if (!formData.emergencyRelation.trim()) {
                errors.emergencyRelation = "Emergency contact relation is required";
            } else if (formData.emergencyRelation.trim().length < 2) {
                errors.emergencyRelation = "Relation must be at least 2 characters";
            } else if (!/^[a-zA-Z\s'-]+$/.test(formData.emergencyRelation.trim())) {
                errors.emergencyRelation = "Relation can only contain letters, spaces, apostrophes, and hyphens";
            }
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        if (validationErrors[e.target.name]) {
            setValidationErrors((prev) => ({ ...prev, [e.target.name]: "" }));
        }
        if (success) setSuccess(false);
        if (error) clearError();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        setSuccess(false);

        if (!validateForm()) return;

        const allergies = formData.allergies
            ? formData.allergies.split(",").map((s) => s.trim()).filter(Boolean)
            : undefined;

        const chronicConditions = formData.chronicConditions
            ? formData.chronicConditions.split(",").map((s) => s.trim()).filter(Boolean)
            : undefined;

        const emergencyContact = formData.emergencyName
            ? {
                name: formData.emergencyName,
                phone: formData.emergencyPhone,
                relation: formData.emergencyRelation,
            }
            : undefined;

        const res = await handleUpdateProfile({
            name: formData.name,
            age: formData.age ? parseInt(formData.age) : undefined,
            gender: formData.gender as any || undefined,
            bloodGroup: formData.bloodGroup || undefined,
            allergies,
            chronicConditions,
            emergencyContact,
        });

        if (res.success) {
            setSuccess(true);
        } else if (res.fieldErrors) {
            setValidationErrors(res.fieldErrors);
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
                                Health Profile
                            </div>

                            <h1 className="text-5xl xl:text-6xl font-black text-navy-900 tracking-tighter leading-none mb-6 max-w-md">
                                Your complete health identity.
                            </h1>
                            <p className="text-lg text-slate-500 max-w-lg leading-relaxed">
                                Keep your medical profile up to date for more accurate AI-powered insights and personalized health recommendations.
                            </p>
                        </div>

                        <div className="relative z-10 space-y-3">
                            {[
                                { title: "Personalized AI", desc: "Better analysis with your health data" },
                                { title: "Emergency Ready", desc: "Critical info available when needed" },
                                { title: "Full Control", desc: "Update or remove data anytime" },
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
                                    Profile Settings
                                </p>
                                <h2 className="text-3xl font-heading font-bold text-navy-900">
                                    Edit your profile
                                </h2>
                                <p className="text-medical-muted mt-2 leading-relaxed">
                                    Update your health information anytime.
                                </p>
                            </div>

                            {/* Success Alert */}
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-sm text-emerald-700 flex items-center gap-3"
                                >
                                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                                    Profile updated successfully
                                </motion.div>
                            )}

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
                                {/* Basic Info */}
                                <div className="space-y-1.5">
                                    <Label className="text-sm font-medium text-medical-text">
                                        Full Name
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-muted" />
                                        <Input
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Your full name"
                                            className={cn(
                                                "pl-10 h-14 rounded-2xl border-medical-border bg-white/70 text-navy-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/20",
                                                validationErrors.name && "border-red-300 focus-visible:ring-red-200"
                                            )}
                                        />
                                    </div>
                                    {validationErrors.name && (
                                        <p className="text-xs text-red-500 mt-1">{validationErrors.name}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-sm font-medium text-medical-text">
                                            Age <span className="text-medical-muted font-normal">(optional)</span>
                                        </Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-muted" />
                                            <Input
                                                name="age"
                                                type="number"
                                                min={1}
                                                max={120}
                                                value={formData.age}
                                                onChange={handleChange}
                                                placeholder="Age"
                                                className={cn(
                                                    "pl-10 h-14 rounded-2xl border-medical-border bg-white/70 text-navy-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/20",
                                                    validationErrors.age && "border-red-300 focus-visible:ring-red-200"
                                                )}
                                            />
                                        </div>
                                        {validationErrors.age && (
                                            <p className="text-xs text-red-500 mt-1">{validationErrors.age}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-sm font-medium text-medical-text">
                                            Gender <span className="text-medical-muted font-normal">(optional)</span>
                                        </Label>
                                        <Select
                                            value={formData.gender}
                                            onValueChange={(val) => {
                                                setFormData((prev) => ({ ...prev, gender: val }));
                                                if (validationErrors.gender) {
                                                    setValidationErrors((prev) => ({ ...prev, gender: "" }));
                                                }
                                            }}
                                        >
                                            <SelectTrigger className={cn(
                                                "h-14 rounded-2xl border-medical-border bg-white/70 text-navy-900",
                                                validationErrors.gender && "border-red-300"
                                            )}>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                {GENDER_OPTIONS.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {validationErrors.gender && (
                                            <p className="text-xs text-red-500">{validationErrors.gender}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-sm font-medium text-medical-text">
                                        Blood Group <span className="text-medical-muted font-normal">(optional)</span>
                                    </Label>
                                    <div className="relative">
                                        <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-muted z-10" />
                                        <Select
                                            value={formData.bloodGroup}
                                            onValueChange={(val) => {
                                                setFormData((prev) => ({ ...prev, bloodGroup: val }));
                                                if (validationErrors.bloodGroup) {
                                                    setValidationErrors((prev) => ({ ...prev, bloodGroup: "" }));
                                                }
                                            }}
                                        >
                                            <SelectTrigger className={cn(
                                                "pl-10 h-14 rounded-2xl border-medical-border bg-white/70 text-navy-900",
                                                validationErrors.bloodGroup && "border-red-300"
                                            )}>
                                                <SelectValue placeholder="Select blood group" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                {BLOOD_GROUPS.map((group) => (
                                                    <SelectItem key={group} value={group}>
                                                        {group}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {validationErrors.bloodGroup && (
                                            <p className="text-xs text-red-500 mt-1">{validationErrors.bloodGroup}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Medical Info */}
                                <div className="pt-4 border-t border-medical-border">
                                    <div className="flex items-center gap-2 mb-4">
                                        <HeartPulse className="w-4 h-4 text-emerald-600" />
                                        <span className="text-xs font-bold uppercase tracking-wider text-medical-muted">
                                            Medical History <span className="font-normal">(optional)</span>
                                        </span>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-medium text-medical-text">
                                                Allergies
                                            </Label>
                                            <div className="relative">
                                                <AlertCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-muted" />
                                                <Input
                                                    name="allergies"
                                                    type="text"
                                                    value={formData.allergies}
                                                    onChange={handleChange}
                                                    placeholder="e.g. Penicillin, Peanuts, Pollen"
                                                    className={cn(
                                                        "pl-10 h-14 rounded-2xl border-medical-border bg-white/70 text-navy-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/20",
                                                        validationErrors.allergies && "border-red-300 focus-visible:ring-red-200"
                                                    )}
                                                />
                                            </div>
                                            {validationErrors.allergies ? (
                                                <p className="text-xs text-red-500 mt-1">{validationErrors.allergies}</p>
                                            ) : (
                                                <p className="text-[10px] text-medical-muted mt-1">Separate with commas</p>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-medium text-medical-text">
                                                Chronic Conditions
                                            </Label>
                                            <div className="relative">
                                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-muted" />
                                                <Input
                                                    name="chronicConditions"
                                                    type="text"
                                                    value={formData.chronicConditions}
                                                    onChange={handleChange}
                                                    placeholder="e.g. Diabetes, Hypertension, Asthma"
                                                    className={cn(
                                                        "pl-10 h-14 rounded-2xl border-medical-border bg-white/70 text-navy-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/20",
                                                        validationErrors.chronicConditions && "border-red-300 focus-visible:ring-red-200"
                                                    )}
                                                />
                                            </div>
                                            {validationErrors.chronicConditions ? (
                                                <p className="text-xs text-red-500 mt-1">{validationErrors.chronicConditions}</p>
                                            ) : (
                                                <p className="text-[10px] text-medical-muted mt-1">Separate with commas</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Emergency Contact */}
                                <div className="pt-4 border-t border-medical-border">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Phone className="w-4 h-4 text-emerald-600" />
                                        <span className="text-xs font-bold uppercase tracking-wider text-medical-muted">
                                            Emergency Contact <span className="font-normal">(optional)</span>
                                        </span>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-medium text-medical-text">
                                                Contact Name
                                            </Label>
                                            <Input
                                                name="emergencyName"
                                                type="text"
                                                value={formData.emergencyName}
                                                onChange={handleChange}
                                                placeholder="Full name"
                                                className={cn(
                                                    "h-14 rounded-2xl border-medical-border bg-white/70 text-navy-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/20",
                                                    validationErrors.emergencyName && "border-red-300 focus-visible:ring-red-200"
                                                )}
                                            />
                                            {validationErrors.emergencyName && (
                                                <p className="text-xs text-red-500 mt-1">{validationErrors.emergencyName}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-sm font-medium text-medical-text">
                                                    Phone
                                                </Label>
                                                <Input
                                                    name="emergencyPhone"
                                                    type="tel"
                                                    value={formData.emergencyPhone}
                                                    onChange={handleChange}
                                                    placeholder="03XX-XXXXXXX"
                                                    className={cn(
                                                        "h-14 rounded-2xl border-medical-border bg-white/70 text-navy-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/20",
                                                        validationErrors.emergencyPhone && "border-red-300 focus-visible:ring-red-200"
                                                    )}
                                                />
                                                {validationErrors.emergencyPhone && (
                                                    <p className="text-xs text-red-500 mt-1">{validationErrors.emergencyPhone}</p>
                                                )}
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-sm font-medium text-medical-text">
                                                    Relation
                                                </Label>
                                                <Input
                                                    name="emergencyRelation"
                                                    type="text"
                                                    value={formData.emergencyRelation}
                                                    onChange={handleChange}
                                                    placeholder="e.g. Spouse"
                                                    className={cn(
                                                        "h-14 rounded-2xl border-medical-border bg-white/70 text-navy-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/20",
                                                        validationErrors.emergencyRelation && "border-red-300 focus-visible:ring-red-200"
                                                    )}
                                                />
                                                {validationErrors.emergencyRelation && (
                                                    <p className="text-xs text-red-500 mt-1">{validationErrors.emergencyRelation}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 h-14 bg-navy-900 hover:bg-navy-950 text-white rounded-2xl font-semibold shadow-navy"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>

                            <p className="text-xs text-medical-muted text-center mt-6 leading-relaxed">
                                Your profile information is used to enhance AI diagnostic accuracy and is never shared without your consent.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
