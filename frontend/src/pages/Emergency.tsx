import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    AlertTriangle,
    Phone,
    Shield,
    Clock,
    ChevronRight,
} from "lucide-react";
import EmergencyMode from "../components/emergency/EmergencyMode";
import EmergencyContacts from "../components/emergency/EmergencyContacts";
import {
    getEmergencyContacts,
    saveEmergencyContacts,
    getEmergencyLogs,
    resolveEmergency,
} from "../services/emergencyService";
import type { EmergencyContact, EmergencyLog } from "../types";
import { formatRelativeTime } from "../lib/utils";
import { cn } from "../lib/utils";

const EMERGENCY_NUMBERS = [
    { label: "Rescue (Punjab)", number: "1122", color: "#EF4444", icon: "🚒" },
    { label: "Ambulance", number: "115", color: "#F59E0B", icon: "🚑" },
    { label: "Police", number: "15", color: "#1A6B9A", icon: "🚔" },
    { label: "Edhi Foundation", number: "115", color: "#10B981", icon: "❤️" },
    { label: "Chippa", number: "1020", color: "#7C3AED", icon: "🏥" },
    { label: "Fire Brigade", number: "16", color: "#F97316", icon: "🔥" },
];

const Emergency = () => {
    const [isEmergencyMode, setIsEmergencyMode] = useState(false);
    const [contacts, setContacts] = useState<EmergencyContact[]>([]);
    const [logs, setLogs] = useState<EmergencyLog[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingContacts, setIsLoadingContacts] = useState(true);
    const [activeTab, setActiveTab] = useState<"contacts" | "history">("contacts");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [contactsData, logsData] = await Promise.all([
                    getEmergencyContacts(),
                    getEmergencyLogs(),
                ]);
                setContacts(contactsData);
                setLogs(logsData);
            } catch {
                // handle error
            } finally {
                setIsLoadingContacts(false);
            }
        };
        fetchData();
    }, []);

    const handleSaveContacts = async (newContacts: EmergencyContact[]) => {
        setIsSaving(true);
        try {
            await saveEmergencyContacts(newContacts);
            setContacts(newContacts);
        } finally {
            setIsSaving(false);
        }
    };

    const handleResolve = async (id: string) => {
        try {
            await resolveEmergency(id);
            setLogs((prev) =>
                prev.map((log) =>
                    log._id === id
                        ? { ...log, resolvedAt: new Date().toISOString() }
                        : log
                )
            );
        } catch {
            // handle
        }
    };

    return (
        <>
            {/* Emergency Mode Overlay */}
            <AnimatePresence>
                {isEmergencyMode && (
                    <EmergencyMode
                        contacts={contacts}
                        onDeactivate={() => setIsEmergencyMode(false)}
                    />
                )}
            </AnimatePresence>

            <div
                className="min-h-[calc(100vh-4rem)] py-10"
                style={{ backgroundColor: "var(--color-medical-surface)" }}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-6">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3"
                    >
                        <div
                            className="w-11 h-11 rounded-2xl flex items-center justify-center"
                            style={{ backgroundColor: "#FEF2F2" }}
                        >
                            <AlertTriangle size={22} style={{ color: "#EF4444" }} />
                        </div>
                        <div>
                            <h1
                                className="font-heading font-bold text-2xl"
                                style={{ color: "var(--color-navy-900)" }}
                            >
                                Emergency Center
                            </h1>
                            <p className="text-sm" style={{ color: "var(--color-medical-muted)" }}>
                                Quick access to emergency services and contacts
                            </p>
                        </div>
                    </motion.div>

                    {/* BIG Emergency Button */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsEmergencyMode(true)}
                        className={cn(
                            "w-full py-8 rounded-2xl text-white",
                            "flex flex-col items-center justify-center gap-3",
                            "shadow-xl transition-all"
                        )}
                        style={{ backgroundColor: "#EF4444" }}
                    >
                        <motion.div
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <AlertTriangle size={40} color="white" />
                        </motion.div>
                        <div className="text-center">
                            <p className="font-heading font-bold text-2xl">
                                ACTIVATE EMERGENCY MODE
                            </p>
                            <p className="text-red-100 text-sm mt-1">
                                Tap to call for help, notify contacts, and share location
                            </p>
                        </div>
                    </motion.button>

                    {/* Quick Call Numbers */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-white rounded-2xl border p-5"
                        style={{ borderColor: "var(--color-medical-border)" }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Phone size={16} style={{ color: "var(--color-navy-900)" }} />
                            <h2
                                className="font-heading font-semibold text-base"
                                style={{ color: "var(--color-navy-900)" }}
                            >
                                Emergency Numbers — Pakistan
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {EMERGENCY_NUMBERS.map((num) => (
                                <motion.a
                                    key={num.label}
                                    href={`tel:${num.number}`}
                                    whileTap={{ scale: 0.96 }}
                                    className={cn(
                                        "flex items-center gap-2.5 p-3 rounded-xl border",
                                        "transition-all hover:shadow-md"
                                    )}
                                    style={{ borderColor: `${num.color}30` }}
                                >
                                    <span className="text-xl">{num.icon}</span>
                                    <div className="min-w-0">
                                        <p
                                            className="text-xs truncate"
                                            style={{ color: "var(--color-medical-muted)" }}
                                        >
                                            {num.label}
                                        </p>
                                        <p
                                            className="font-heading font-bold text-lg leading-none"
                                            style={{ color: num.color }}
                                        >
                                            {num.number}
                                        </p>
                                    </div>
                                    <Phone
                                        size={14}
                                        className="ml-auto shrink-0"
                                        style={{ color: num.color }}
                                    />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Contacts & History Tabs */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl border overflow-hidden"
                        style={{ borderColor: "var(--color-medical-border)" }}
                    >
                        {/* Tab Header */}
                        <div
                            className="flex border-b"
                            style={{ borderColor: "var(--color-medical-border)" }}
                        >
                            {[
                                { id: "contacts", label: "Emergency Contacts", icon: Shield },
                                { id: "history", label: "Emergency History", icon: Clock },
                            ].map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() =>
                                            setActiveTab(tab.id as "contacts" | "history")
                                        }
                                        className={cn(
                                            "flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium",
                                            "transition-all border-b-2"
                                        )}
                                        style={{
                                            borderBottomColor:
                                                activeTab === tab.id
                                                    ? "var(--color-navy-900)"
                                                    : "transparent",
                                            color:
                                                activeTab === tab.id
                                                    ? "var(--color-navy-900)"
                                                    : "var(--color-medical-muted)",
                                        }}
                                    >
                                        <Icon size={15} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="p-5">
                            {activeTab === "contacts" ? (
                                isLoadingContacts ? (
                                    <div className="flex justify-center py-8">
                                        <div
                                            className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
                                            style={{
                                                borderColor: "var(--color-navy-900)",
                                                borderTopColor: "transparent",
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <EmergencyContacts
                                        contacts={contacts}
                                        onSave={handleSaveContacts}
                                        isSaving={isSaving}
                                    />
                                )
                            ) : (
                                /* History Tab */
                                <div className="space-y-3">
                                    {logs.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-10">
                                            <Clock
                                                size={28}
                                                className="mb-2"
                                                style={{ color: "var(--color-medical-muted)" }}
                                            />
                                            <p
                                                className="text-sm"
                                                style={{ color: "var(--color-medical-muted)" }}
                                            >
                                                No emergency history
                                            </p>
                                        </div>
                                    ) : (
                                        logs.map((log) => (
                                            <div
                                                key={log._id}
                                                className={cn(
                                                    "p-4 rounded-xl border",
                                                    log.resolvedAt
                                                        ? "opacity-60"
                                                        : ""
                                                )}
                                                style={{
                                                    borderColor: log.resolvedAt
                                                        ? "var(--color-medical-border)"
                                                        : "#FEE2E2",
                                                    backgroundColor: log.resolvedAt
                                                        ? "var(--color-medical-surface)"
                                                        : "#FEF2F2",
                                                }}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span
                                                                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                                                                style={{
                                                                    backgroundColor: log.resolvedAt
                                                                        ? "#ECFDF5"
                                                                        : "#FEE2E2",
                                                                    color: log.resolvedAt
                                                                        ? "#10B981"
                                                                        : "#EF4444",
                                                                }}
                                                            >
                                                                {log.resolvedAt ? "Resolved" : "Active"}
                                                            </span>
                                                            <span
                                                                className="text-xs"
                                                                style={{ color: "var(--color-medical-muted)" }}
                                                            >
                                                                {formatRelativeTime(log.createdAt)}
                                                            </span>
                                                        </div>
                                                        {log.symptoms.length > 0 && (
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {log.symptoms.slice(0, 3).map((s) => (
                                                                    <span
                                                                        key={s}
                                                                        className="text-xs px-2 py-0.5 rounded-full border"
                                                                        style={{
                                                                            borderColor:
                                                                                "var(--color-medical-border)",
                                                                            color: "var(--color-medical-muted)",
                                                                        }}
                                                                    >
                                                                        {s}
                                                                    </span>
                                                                ))}
                                                                {log.symptoms.length > 3 && (
                                                                    <span
                                                                        className="text-xs"
                                                                        style={{
                                                                            color: "var(--color-medical-muted)",
                                                                        }}
                                                                    >
                                                                        +{log.symptoms.length - 3} more
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {!log.resolvedAt && (
                                                        <button
                                                            onClick={() => handleResolve(log._id)}
                                                            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg shrink-0"
                                                            style={{
                                                                backgroundColor: "#ECFDF5",
                                                                color: "#10B981",
                                                            }}
                                                        >
                                                            Mark Resolved
                                                            <ChevronRight size={12} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Disclaimer */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-xs text-center"
                        style={{ color: "var(--color-medical-muted)" }}
                    >
                        MediAssist AI is not a replacement for emergency services.
                        Always call official emergency numbers in life-threatening situations.
                    </motion.p>
                </div>
            </div>
        </>
    );
};

export default Emergency;