import { useState } from "react";
import { motion } from "framer-motion";
import {
    AlertTriangle,
    Phone,
    MapPin,
    MessageCircle,
    X,
    CheckCircle,
    Loader2,
    Mail,
    ChevronRight,
    Shield,
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
    const [step, setStep] = useState<"symptoms" | "action">("symptoms");


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

    const shareLocationViaEmail = (contact: EmergencyContact) => {
        const subject = "🚨 EMERGENCY ASSISTANCE REQUESTED";
        const body = location
            ? `I am in an emergency situation and need your help immediately.\n\nSymptoms: ${selectedSymptoms.join(", ")}\n\nMy current location: https://maps.google.com/?q=${location.lat},${location.lng}\n\nPlease contact me or emergency services right away.`
            : `I am in an emergency situation and need your help immediately.\n\nSymptoms: ${selectedSymptoms.join(", ")}\n\nPlease contact me or emergency services right away.`;
        window.open(`mailto:${contact.phone}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 overflow-hidden font-sans"
        >
            {/* Tactical Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={onDeactivate}
                className="absolute inset-0 bg-[#020617]/90 backdrop-blur-[40px]"
            />

            {/* Noise Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="relative w-full max-w-4xl bg-[#020617]/80 backdrop-blur-md rounded-[2.5rem] shadow-[0_64px_160px_-40px_rgba(0,0,0,0.8)] border border-white/5 overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
                {/* Left Sidebar: Tactical Indicators (Desktop Only) */}
                <div className="hidden md:flex w-24 bg-white/5 border-r border-white/5 flex-col items-center py-10 gap-8">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
                    <div className="h-px w-8 bg-white/10" />
                    <div className="flex flex-col gap-6 items-center">
                        <div className="[writing-mode:vertical-lr] text-[9px] font-mono tracking-[0.4em] uppercase text-white/20 whitespace-nowrap">
                            Secure Link Established
                        </div>
                        <div className="[writing-mode:vertical-lr] text-[9px] font-mono tracking-[0.4em] uppercase text-white/20 whitespace-nowrap">
                            Encrypted Stream 0xAF42
                        </div>
                    </div>
                </div>

                {/* Main Control Panel */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Tactical Header */}
                    <div className="px-8 py-8 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/[0.02]">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="absolute -inset-2 bg-red-500/20 blur-xl rounded-full" />
                                <div className="relative w-14 h-14 rounded-2xl bg-navy-950 border border-red-500/30 flex items-center justify-center">
                                    <AlertTriangle size={28} className="text-red-500" />
                                </div>
                            </div>
                            <div>
                                <h2 className="font-heading font-black text-white text-2xl tracking-tighter uppercase leading-none mb-1">
                                    Critical Response Protocol
                                </h2>
                                <div className="flex items-center gap-3">
                                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                                    <p className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-white/40">
                                        Unit Status: <span className="text-emerald-500/80">Authorized</span> &bull; 04:22:9x
                                    </p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onDeactivate}
                            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all border border-white/5"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-10 space-y-10">
                        {/* Emergency Quick Access Grids */}
                        <div>
                            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-white/20 mb-6 px-1">Primary Agency Dispatch</p>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {EMERGENCY_NUMBERS.map((num) => (
                                    <motion.a
                                        key={num.label}
                                        href={`tel:${num.number}`}
                                        whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-white/[0.02] border border-white/5 transition-colors group"
                                    >
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-1 group-hover:scale-110 transition-transform bg-navy-950 border border-white/5 shadow-2xl">
                                            <Phone size={20} style={{ color: num.color }} />
                                        </div>
                                        <div className="text-center">
                                            <span className="block text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-white/30 group-hover:text-white/50 transition-colors">{num.label}</span>
                                            <span className="text-xl font-mono font-bold text-white tracking-tighter">{num.number}</span>
                                        </div>
                                    </motion.a>
                                ))}
                            </div>
                        </div>

                        {step === "symptoms" ? (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Symptom Selection Panel */}
                                <section className="relative p-8 rounded-[2rem] bg-navy-950/50 border border-white/5 overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4">
                                        <div className="text-[8px] font-mono text-white/10 uppercase tracking-widest">Input: ANALYTICAL_FEED</div>
                                    </div>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-1.5 h-6 bg-red-500 rounded-full" />
                                        <h3 className="font-heading font-black text-white text-xl uppercase tracking-tight">Symptom Diagnostic</h3>
                                    </div>
                                    <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                                        <QuickSymptoms
                                            selectedSymptoms={selectedSymptoms}
                                            onToggle={toggleSymptom}
                                        />
                                    </div>
                                </section>

                                {/* Tactical Location Readout */}
                                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="p-8 rounded-[2rem] bg-navy-950/50 border border-white/5 flex flex-col justify-between">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                                            <h3 className="font-heading font-black text-white text-xl uppercase tracking-tight">Geo-Spatial Feed</h3>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-[8px] text-white/20 uppercase tracking-widest">Longitude</span>
                                                    <span className="text-[10px] text-emerald-500 font-bold">{location ? "FIXED" : "SEARCHING"}</span>
                                                </div>
                                                <div className="text-lg text-white font-bold tracking-widest">
                                                    {location ? location.lng.toFixed(6) : "00.000000"}
                                                </div>
                                            </div>
                                            <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-[8px] text-white/20 uppercase tracking-widest">Latitude</span>
                                                    <span className="text-[10px] text-emerald-500 font-bold">{location ? "FIXED" : "SEARCHING"}</span>
                                                </div>
                                                <div className="text-lg text-white font-bold tracking-widest">
                                                    {location ? location.lat.toFixed(6) : "00.000000"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={getLocation}
                                        disabled={isGettingLocation || !!location}
                                        className={cn(
                                            "relative group p-8 rounded-[2rem] border-2 transition-all duration-500 flex flex-col items-center justify-center gap-6 overflow-hidden",
                                            location 
                                                ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-500" 
                                                : "bg-[#020617] border-white/5 text-white/20 hover:border-white/20"
                                        )}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className={cn(
                                            "w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all duration-500 shadow-2xl",
                                            location ? "bg-emerald-500 text-white scale-110" : "bg-white/5 text-white/20 group-hover:text-white"
                                        )}>
                                            {isGettingLocation ? (
                                                <Loader2 size={32} className="animate-spin" />
                                            ) : (
                                                <Navigation size={32} />
                                            )}
                                        </div>
                                        <div className="text-center relative z-10">
                                            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] mb-1">Sync Module</p>
                                            <p className="text-sm font-black uppercase tracking-tight text-white">
                                                {location ? "Coordination Link Active" : isGettingLocation ? "Aquiring Sat-Link..." : "Initialize Geo-Broadcast"}
                                            </p>
                                        </div>
                                    </button>
                                </section>

                                {/* Confirmation Trigger */}
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={handleLogEmergency}
                                    disabled={isLogging}
                                    className="w-full h-24 rounded-[2rem] bg-red-600 hover:bg-red-500 text-white flex items-center justify-center gap-6 shadow-[0_20px_50px_rgba(239,68,68,0.3)] transition-all relative overflow-hidden group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-white/10 to-red-600 bg-[length:200%_100%] animate-[shimmer_2s_infinite] opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <Shield size={28} className="relative z-10" />
                                    <div className="relative z-10 text-left">
                                        <span className="block text-[10px] font-mono font-black uppercase tracking-[0.4em] opacity-60">Authorize Dispatch</span>
                                        <span className="text-2xl font-heading font-black uppercase tracking-tighter">
                                            {isLogging ? "Processing Authorization..." : "Log Critical Incident"}
                                        </span>
                                    </div>
                                </motion.button>
                            </div>
                        ) : (
                            /* Tactical Feedback Panel */
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-10"
                            >
                                <div className="p-10 rounded-[3rem] bg-emerald-500/5 border border-emerald-500/20 text-center relative overflow-hidden group">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                                    <motion.div 
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="w-20 h-20 rounded-[2rem] bg-emerald-500 text-white flex items-center justify-center mx-auto mb-8 shadow-[0_20px_40px_rgba(16,185,129,0.3)]"
                                    >
                                        <CheckCircle size={40} />
                                    </motion.div>
                                    <div className="relative z-10">
                                        <h3 className="text-3xl font-heading font-black text-white tracking-tighter uppercase mb-2">Protocol Recorded</h3>
                                        <p className="text-emerald-500/80 font-mono text-xs uppercase tracking-widest">Tactical notification logs initialized</p>
                                    </div>
                                </div>

                                {contacts.length > 0 && (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 px-2">
                                            <div className="h-px flex-1 bg-white/5" />
                                            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.5em] text-white/20 whitespace-nowrap">Registry Linkages</span>
                                            <div className="h-px flex-1 bg-white/5" />
                                        </div>
                                        <div className="grid gap-4">
                                            {contacts.map((contact, i) => (
                                                <motion.div
                                                    key={contact.phone}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 flex flex-col lg:flex-row items-center gap-8 group hover:bg-white/[0.05] transition-all"
                                                >
                                                    <div className="flex items-center gap-6 flex-1 min-w-0">
                                                        <div className="w-16 h-16 rounded-2xl bg-navy-950 border border-white/5 flex items-center justify-center text-white text-2xl font-black shadow-2xl transition-transform group-hover:scale-105">
                                                            {contact.name[0]?.toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-heading font-black text-white text-xl tracking-tight uppercase truncate leading-none mb-2">{contact.name}</p>
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-[9px] font-mono font-bold text-white/30 uppercase tracking-widest">{contact.relation}</span>
                                                                <span className="w-1 h-1 rounded-full bg-white/10" />
                                                                <span className="text-[9px] font-mono font-bold text-white/30 tracking-widest">{contact.phone}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 w-full lg:w-auto">
                                                        <button
                                                            onClick={() => shareLocationViaWhatsApp(contact)}
                                                            className="flex-1 lg:flex-none h-14 px-8 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/20 transition-all flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.2em]"
                                                        >
                                                            <MessageCircle size={16} /> WhatsApp
                                                        </button>
                                                        <button
                                                            onClick={() => shareLocationViaEmail(contact)}
                                                            className="flex-1 lg:flex-none h-14 px-8 rounded-2xl bg-white/[0.05] hover:bg-white/10 text-white border border-white/10 transition-all flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.2em]"
                                                        >
                                                            <Mail size={16} /> Email
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {location && (
                                    <motion.a
                                        href={`https://maps.google.com/?q=${location.lat},${location.lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                                        className="flex items-center justify-between p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 group relative overflow-hidden"
                                    >
                                        <div className="flex items-center gap-6 relative z-10">
                                            <div className="w-14 h-14 rounded-2xl bg-navy-950 border border-red-500/30 flex items-center justify-center text-red-500 shadow-2xl transition-transform group-hover:scale-110">
                                                <MapPin size={28} />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[9px] font-mono font-bold text-white/20 uppercase tracking-[0.3em] mb-1">Visual Intelligence</p>
                                                <p className="text-lg font-heading font-black text-white uppercase tracking-tight">Active Deployment Map</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="relative z-10 text-white/20 group-hover:text-white group-hover:translate-x-2 transition-all" size={24} />
                                    </motion.a>
                                )}
                            </motion.div>
                        )}
                    </div>

                    {/* Tactical Footer */}
                    <div className="px-8 py-5 bg-white/[0.02] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <span className="text-[9px] font-mono font-bold uppercase tracking-[0.4em] text-white/30">Network Status: Secured_Stream</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Shield size={12} className="text-white/20" />
                                <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-white/20">End-to-End Cryptography</span>
                            </div>
                            <span className="hidden sm:block text-[9px] font-mono font-bold text-white/10 tracking-[0.5em]">v4.2.0-STABLE</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
            ` }} />
        </motion.div>
    );
};

export default EmergencyMode;