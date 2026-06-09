import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    AlertTriangle,
    Phone,
    Shield,
    Clock,
    ChevronRight,
    Truck,
    Ambulance,
    Heart,
    Hospital,
    Flame,
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
    { label: "Rescue (Punjab)", number: "1122", color: "#EF4444", icon: Truck },
    { label: "Ambulance", number: "115", color: "#F59E0B", icon: Ambulance },
    { label: "Police", number: "15", color: "#1A6B9A", icon: Shield },
    { label: "Edhi Foundation", number: "115", color: "#10B981", icon: Heart },
    { label: "Chippa", number: "1020", color: "#7C3AED", icon: Hospital },
    { label: "Fire Brigade", number: "16", color: "#F97316", icon: Flame },
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

            <div className="medical-mesh min-h-screen pt-32 pb-24 overflow-x-hidden">
                <div className="container mx-auto px-6 relative">
                    {/* Header Section */}
                    <div className="max-w-4xl mx-auto mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center text-center space-y-6"
                        >
                            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-red-500/5 border border-red-500/10 backdrop-blur-md">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-red-500/80">
                                    Secure Response Terminal
                                </span>
                            </div>
                            
                            <h1 className="text-6xl md:text-8xl font-black text-navy-900 tracking-tighter leading-none">
                                SYSTEM<span className="text-red-600 block md:inline md:ml-2">CRITICAL</span>
                            </h1>
                            
                            <p className="text-lg md:text-xl text-slate-500 max-w-xl font-medium leading-relaxed tracking-tight">
                                Immediate intervention protocols and medical tactical support. 
                                <span className="text-navy-900/40 block mt-1">Authorized health personnel only.</span>
                            </p>
                        </motion.div>
                    </div>

                    {/* Main Activation Control */}
                    <div className="max-w-5xl mx-auto mb-20 relative">
                        {/* Decorative background aura */}
                        <div className="absolute -inset-20 bg-red-500/5 blur-[120px] rounded-full pointer-events-none" />
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1, duration: 0.8 }}
                            className="relative"
                        >
                            <button
                                onClick={() => setIsEmergencyMode(true)}
                                className="group w-full relative aspect-[21/9] md:aspect-[3/1] rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-700 hover:shadow-red-500/10 active:scale-[0.99]"
                            >
                                <div className="absolute inset-0 bg-navy-900" />
                                
                                {/* Animated scan line */}
                                <motion.div 
                                    animate={{ top: ["-100%", "200%"] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-x-0 h-40 bg-gradient-to-b from-transparent via-red-500/5 to-transparent pointer-events-none z-10"
                                />

                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8">
                                    <div className="relative">
                                        <div className="absolute -inset-8 bg-red-500/20 blur-3xl rounded-full animate-pulse" />
                                        <div className="relative w-24 h-24 rounded-full bg-red-600 flex items-center justify-center border border-red-400/30 group-hover:bg-red-500 transition-colors duration-500">
                                            <AlertTriangle size={48} className="text-white" />
                                        </div>
                                    </div>
                                    
                                    <div className="text-center">
                                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase mb-2">
                                            INITIALIZE PROTOCOL
                                        </h2>
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="h-[1px] w-8 bg-white/20" />
                                            <p className="text-[10px] font-bold text-red-400 uppercase tracking-[0.4em]">
                                                Activate Emergency Override
                                            </p>
                                            <div className="h-[1px] w-8 bg-white/20" />
                                        </div>
                                    </div>
                                </div>

                                {/* Subtle corner accents */}
                                <div className="absolute top-8 left-8 w-12 h-12 border-l-2 border-t-2 border-white/10 rounded-tl-2xl" />
                                <div className="absolute top-8 right-8 w-12 h-12 border-r-2 border-t-2 border-white/10 rounded-tr-2xl" />
                                <div className="absolute bottom-8 left-8 w-12 h-12 border-l-2 border-b-2 border-white/10 rounded-bl-2xl" />
                                <div className="absolute bottom-8 right-8 w-12 h-12 border-r-2 border-b-2 border-white/10 rounded-br-2xl" />
                            </button>
                        </motion.div>
                    </div>

                    <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
                        {/* Side Panels - Emergency Numbers */}
                        <div className="space-y-8">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="glass-panel p-10 rounded-[3rem] border-white/20 relative overflow-hidden"
                            >
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="w-12 h-12 rounded-2xl bg-navy-900 flex items-center justify-center border border-white/10">
                                            <Phone className="w-6 h-6 text-emerald-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-heading font-black text-xl text-navy-900 tracking-tight">
                                                Rapid Support
                                            </h3>
                                            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                                                Direct Dispatch Registry
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        {EMERGENCY_NUMBERS.map((num, i) => {
                                            const Icon = num.icon;
                                            return (
                                                <motion.a
                                                    key={num.label}
                                                    href={`tel:${num.number}`}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.3 + (i * 0.05) }}
                                                    className="group flex items-center justify-between p-6 rounded-2xl bg-white/40 border border-slate-100 hover:border-navy-900/10 hover:bg-white transition-all shadow-sm"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center transition-colors group-hover:bg-navy-900/5">
                                                            <Icon size={18} className="text-slate-400 group-hover:text-navy-900 transition-colors" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                                                                {num.label}
                                                            </p>
                                                            <p className="font-heading font-black text-lg tracking-tighter text-navy-900">
                                                                {num.number}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <ChevronRight size={18} className="text-slate-300 group-hover:text-navy-900 transition-all group-hover:translate-x-1" />
                                                </motion.a>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Main Registry & Logs Panel */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white/40 backdrop-blur-2xl rounded-[3.5rem] border border-white/50 shadow-2xl overflow-hidden"
                        >
                            <div className="flex border-b border-slate-100 bg-white/20">
                                {[
                                    { id: "contacts", label: "Registry", icon: Shield },
                                    { id: "history", label: "Protocol History", icon: Clock },
                                ].map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as "contacts" | "history")}
                                            className={cn(
                                                "flex-1 flex items-center justify-center gap-3 py-8 text-[11px] font-black uppercase tracking-[0.25em] transition-all relative overflow-hidden",
                                                isActive ? "text-navy-900" : "text-slate-400 hover:text-slate-600"
                                            )}
                                        >
                                            <Icon size={14} className={cn(isActive ? "text-red-500" : "text-slate-300")} />
                                            {tab.label}
                                            {isActive && (
                                                <motion.div 
                                                    layoutId="activeTab"
                                                    className="absolute bottom-0 left-0 right-0 h-1 bg-red-500"
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="p-10">
                                {activeTab === "contacts" ? (
                                    isLoadingContacts ? (
                                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                                            <div className="w-10 h-10 border-2 border-navy-900/10 border-t-navy-900 rounded-full animate-spin" />
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Authenticating Registry...</p>
                                        </div>
                                    ) : (
                                        <EmergencyContacts
                                            contacts={contacts}
                                            onSave={handleSaveContacts}
                                            isSaving={isSaving}
                                        />
                                    )
                                ) : (
                                    <div className="space-y-4">
                                        {logs.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                                                    <Clock size={32} className="text-slate-200" />
                                                </div>
                                                <h4 className="font-bold text-navy-900 mb-1">No Active Incidents</h4>
                                                <p className="text-sm text-slate-400 font-medium">Protocol history is currently clear.</p>
                                            </div>
                                        ) : (
                                            logs.map((log, i) => (
                                                <motion.div
                                                    key={log._id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className={cn(
                                                        "p-6 rounded-3xl border transition-all duration-300",
                                                        log.resolvedAt ? "bg-white/40 border-slate-100 opacity-60" : "bg-red-500/5 border-red-500/10"
                                                    )}
                                                >
                                                    <div className="flex items-center justify-between gap-6">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-3 mb-3">
                                                                <div className={cn(
                                                                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                                                    log.resolvedAt ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500 text-white shadow-lg shadow-red-500/20"
                                                                )}>
                                                                    {log.resolvedAt ? "Resolved" : "Incident Active"}
                                                                </div>
                                                                <span className="text-[10px] font-bold text-slate-400">
                                                                    {formatRelativeTime(log.createdAt)}
                                                                </span>
                                                            </div>
                                                            
                                                            {log.symptoms.length > 0 && (
                                                                <div className="flex flex-wrap gap-2">
                                                                    {log.symptoms.map((s) => (
                                                                        <span key={s} className="px-3 py-1 rounded-lg bg-navy-900/5 text-[10px] font-bold text-navy-900/60 uppercase tracking-tighter">
                                                                            {s}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        {!log.resolvedAt && (
                                                            <button
                                                                onClick={() => handleResolve(log._id)}
                                                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-navy-950 transition-all shadow-navy active:scale-95 shrink-0"
                                                            >
                                                                Clear Protocol
                                                            </button>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Security Disclaimer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-24 pt-12 border-t border-slate-200 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 opacity-40 hover:opacity-100 transition-opacity"
                    >
                        <div className="flex items-center gap-3">
                            <Shield size={16} className="text-navy-900" />
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-navy-900">
                                Digital Safety Authority &bull; System 2026
                            </p>
                        </div>
                        <p className="text-[9px] font-bold text-medical-muted text-center md:text-right max-w-xs uppercase leading-loose tracking-tighter">
                            MediAssist AI is a clinical support integration. Not a substitute for primary emergency services.
                        </p>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default Emergency;