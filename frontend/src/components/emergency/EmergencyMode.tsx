import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    AlertTriangle,
    Phone,
    MapPin,
    MessageCircle,
    X,
    CheckCircle,
    Loader2,
    Navigation,
} from "lucide-react";
import type { EmergencyContact } from "../../types";
import QuickSymptoms from "./QuickSymptoms";
import { logEmergency } from "../../services/emergencyService";
import { cn } from "../../lib/utils";

interface EmergencyModeProps {
    contacts: EmergencyContact[];
    onDeactivate: () => void;
}

const EMERGENCY_NUMBERS = [
    { label: "Rescue", number: "1122", color: "#EF4444" },
    { label: "Ambulance", number: "115", color: "#F59E0B" },
    { label: "Police", number: "15", color: "#1A6B9A" },
    { label: "Edhi", number: "115", color: "#10B981" },
];

const EmergencyMode = ({ contacts, onDeactivate }: EmergencyModeProps) => {
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [location, setLocation] = useState<{
        lat: number;
        lng: number;
        address?: string;
    } | null>(null);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [isLogging, setIsLogging] = useState(false);
    const [isLogged, setIsLogged] = useState(false);
    const [step, setStep] = useState<"symptoms" | "action">("symptoms");

    // Pulse animation for emergency indicator
    const [pulse, setPulse] = useState(true);
    useEffect(() => {
        const interval = setInterval(() => setPulse((p) => !p), 800);
        return () => clearInterval(interval);
    }, []);

    const toggleSymptom = (symptom: string) => {
        setSelectedSymptoms((prev) =>
            prev.includes(symptom)
                ? prev.filter((s) => s !== symptom)
                : [...prev, symptom]
        );
    };

    const getLocation = async () => {
        setIsGettingLocation(true);
        try {
            await new Promise<void>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        setLocation({
                            lat: pos.coords.latitude,
                            lng: pos.coords.longitude,
                        });
                        resolve();
                    },
                    reject,
                    { timeout: 10000 }
                );
            });
        } catch {
            // Location not available
        } finally {
            setIsGettingLocation(false);
        }
    };

    const handleLogEmergency = async () => {
        try {
            setIsLogging(true);
            await logEmergency({
                symptoms: selectedSymptoms,
                location: location ?? undefined,
                contactsNotified: contacts.map((c) => c.name),
            });
            setIsLogged(true);
            setStep("action");
        } catch {
            setStep("action");
        } finally {
            setIsLogging(false);
        }
    };

    const shareLocationViaWhatsApp = (contact: EmergencyContact) => {
        const message = location
            ? `🚨 EMERGENCY! I need help!\nSymptoms: ${selectedSymptoms.join(", ")}\nMy location: https://maps.google.com/?q=${location.lat},${location.lng}`
            : `🚨 EMERGENCY! I need help!\nSymptoms: ${selectedSymptoms.join(", ")}`;
        const phone = contact.phone.replace(/[^0-9]/g, "");
        window.open(`https://wa.me/92${phone}?text=${encodeURIComponent(message)}`, "_blank");
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 overflow-y-auto"
            style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
        >
            <div className="min-h-screen flex flex-col">
                {/* Emergency Header */}
                <div
                    className="sticky top-0 z-10 px-4 py-4 flex items-center justify-between"
                    style={{ backgroundColor: "#EF4444" }}
                >
                    <div className="flex items-center gap-3">
                        <motion.div
                            animate={{ scale: pulse ? 1.2 : 1 }}
                            transition={{ duration: 0.4 }}
                        >
                            <AlertTriangle size={24} color="white" />
                        </motion.div>
                        <div>
                            <h1 className="font-heading font-bold text-white text-lg leading-none">
                                EMERGENCY MODE
                            </h1>
                            <p className="text-red-100 text-xs mt-0.5">
                                Stay calm — help is on the way
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onDeactivate}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-medium transition-colors"
                    >
                        <X size={14} />
                        Deactivate
                    </button>
                </div>

                <div className="flex-1 p-4 space-y-4 max-w-2xl mx-auto w-full pb-8">
                    {/* Emergency Call Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-2 gap-3"
                    >
                        {EMERGENCY_NUMBERS.map((num) => (
                            <motion.a
                                key={num.label}
                                href={`tel:${num.number}`}
                                whileTap={{ scale: 0.97 }}
                                className="flex items-center gap-3 p-4 rounded-2xl text-white font-bold shadow-lg"
                                style={{ backgroundColor: num.color }}
                            >
                                <Phone size={20} />
                                <div>
                                    <p className="text-xs opacity-80">{num.label}</p>
                                    <p className="text-xl font-heading leading-none">
                                        {num.number}
                                    </p>
                                </div>
                            </motion.a>
                        ))}
                    </motion.div>

                    {step === "symptoms" ? (
                        <>
                            {/* Quick Symptoms */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-2xl p-5"
                            >
                                <h2
                                    className="font-heading font-bold text-base mb-4"
                                    style={{ color: "var(--color-navy-900)" }}
                                >
                                    What are your symptoms?
                                </h2>
                                <QuickSymptoms
                                    selectedSymptoms={selectedSymptoms}
                                    onToggle={toggleSymptom}
                                />
                            </motion.div>

                            {/* Location */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="bg-white rounded-2xl p-5"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h2
                                        className="font-heading font-bold text-base"
                                        style={{ color: "var(--color-navy-900)" }}
                                    >
                                        Share Location
                                    </h2>
                                    {location && (
                                        <span className="flex items-center gap-1 text-xs font-medium"
                                            style={{ color: "#10B981" }}>
                                            <CheckCircle size={12} />
                                            Location captured
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={getLocation}
                                    disabled={isGettingLocation || !!location}
                                    className={cn(
                                        "w-full flex items-center justify-center gap-2 py-3 rounded-xl",
                                        "text-sm font-medium border-2 transition-all",
                                        "disabled:opacity-50"
                                    )}
                                    style={{
                                        borderColor: location ? "#10B981" : "var(--color-navy-900)",
                                        color: location ? "#10B981" : "var(--color-navy-900)",
                                        backgroundColor: location ? "#ECFDF5" : "white",
                                    }}
                                >
                                    {isGettingLocation ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <Navigation size={16} />
                                    )}
                                    {location
                                        ? "Location Shared"
                                        : isGettingLocation
                                            ? "Getting Location..."
                                            : "Get My Location"}
                                </button>
                                {location && (
                                    <p className="text-xs mt-2 text-center"
                                        style={{ color: "var(--color-medical-muted)" }}>
                                        {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                                    </p>
                                )}
                            </motion.div>

                            {/* Proceed Button */}
                            <motion.button
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                onClick={handleLogEmergency}
                                disabled={isLogging}
                                className={cn(
                                    "w-full py-4 rounded-2xl text-white font-heading font-bold text-lg",
                                    "flex items-center justify-center gap-2 shadow-lg",
                                    "transition-all disabled:opacity-50"
                                )}
                                style={{ backgroundColor: "#EF4444" }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isLogging ? (
                                    <Loader2 size={20} className="animate-spin" />
                                ) : (
                                    <AlertTriangle size={20} />
                                )}
                                {isLogging ? "Logging Emergency..." : "Log & Notify Contacts"}
                            </motion.button>
                        </>
                    ) : (
                        /* Action Step */
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            {/* Success */}
                            {isLogged && (
                                <div
                                    className="flex items-center gap-3 p-4 rounded-2xl"
                                    style={{ backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0" }}
                                >
                                    <CheckCircle size={20} style={{ color: "#10B981" }} />
                                    <div>
                                        <p className="font-semibold text-sm" style={{ color: "#065F46" }}>
                                            Emergency logged successfully
                                        </p>
                                        <p className="text-xs" style={{ color: "#047857" }}>
                                            Your emergency has been recorded
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Notify Contacts via WhatsApp */}
                            {contacts.length > 0 && (
                                <div className="bg-white rounded-2xl p-5">
                                    <h2
                                        className="font-heading font-bold text-base mb-4"
                                        style={{ color: "var(--color-navy-900)" }}
                                    >
                                        Notify Emergency Contacts
                                    </h2>
                                    <div className="space-y-2">
                                        {contacts.map((contact) => (
                                            <motion.button
                                                key={contact.phone}
                                                whileTap={{ scale: 0.97 }}
                                                onClick={() => shareLocationViaWhatsApp(contact)}
                                                className={cn(
                                                    "w-full flex items-center gap-3 p-3 rounded-xl border",
                                                    "transition-all hover:border-green-400"
                                                )}
                                                style={{ borderColor: "var(--color-medical-border)" }}
                                            >
                                                <div
                                                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                                                    style={{ backgroundColor: "#25D366" }}
                                                >
                                                    {contact.name[0]?.toUpperCase()}
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <p className="text-sm font-semibold"
                                                        style={{ color: "var(--color-navy-900)" }}>
                                                        {contact.name}
                                                    </p>
                                                    <p className="text-xs" style={{ color: "var(--color-medical-muted)" }}>
                                                        {contact.relation} • {contact.phone}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs font-medium"
                                                    style={{ color: "#25D366" }}>
                                                    <MessageCircle size={14} />
                                                    WhatsApp
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Location Share Link */}
                            {location && (
                                <div className="bg-white rounded-2xl p-5">
                                    <h2
                                        className="font-heading font-bold text-base mb-3"
                                        style={{ color: "var(--color-navy-900)" }}
                                    >
                                        Your Location
                                    </h2>
                                    <a
                                        href={`https://maps.google.com/?q=${location.lat},${location.lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm font-medium p-3 rounded-xl border transition-all"
                                        style={{
                                            borderColor: "var(--color-medical-border)",
                                            color: "var(--color-navy-900)",
                                        }}
                                    >
                                        <MapPin size={16} style={{ color: "#EF4444" }} />
                                        Open in Google Maps
                                    </a>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div >
    );
};

export default EmergencyMode;