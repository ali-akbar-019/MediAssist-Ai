import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Phone, User, Heart, Save, Loader2 } from "lucide-react";
import type { EmergencyContact } from "../../types";
import { cn } from "../../lib/utils";

interface EmergencyContactsProps {
    contacts: EmergencyContact[];
    onSave: (contacts: EmergencyContact[]) => Promise<void>;
    isSaving?: boolean;
}

const RELATION_OPTIONS = [
    "Father",
    "Mother",
    "Spouse",
    "Sibling",
    "Child",
    "Friend",
    "Doctor",
    "Other",
];

const EmergencyContacts = ({
    contacts,
    onSave,
    isSaving = false,
}: EmergencyContactsProps) => {
    const [localContacts, setLocalContacts] =
        useState<EmergencyContact[]>(contacts);
    const [isDirty, setIsDirty] = useState(false);
    const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

    useEffect(() => {
        setLocalContacts(contacts);
        setIsDirty(false);
    }, [contacts]);

    const addContact = () => {
        setLocalContacts((prev) => [
            ...prev,
            { name: "", phone: "", relation: "Father" },
        ]);
        setIsDirty(true);
    };

    const confirmRemove = (index: number) => {
        setDeletingIndex(index);
    };

    const removeContact = () => {
        if (deletingIndex === null) return;
        setLocalContacts((prev) => prev.filter((_, i) => i !== deletingIndex));
        setIsDirty(true);
        setDeletingIndex(null);
    };

    const updateContact = (
        index: number,
        field: keyof EmergencyContact,
        value: string
    ) => {
        setLocalContacts((prev) =>
            prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
        );
        setIsDirty(true);
    };

    const handleSave = async () => {
        const valid = localContacts.filter((c) => c.name && c.phone);
        await onSave(valid);
        setIsDirty(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                        <Heart size={16} className="text-red-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-navy-900 tracking-tight">
                            Emergency Registry
                        </h3>
                        <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">
                            Up to 5 trusted individuals
                        </p>
                    </div>
                </div>
                <button
                    onClick={addContact}
                    disabled={localContacts.length >= 5}
                    className={cn(
                        "flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest",
                        "border-2 transition-all transition-all duration-300",
                        "disabled:opacity-40 disabled:cursor-not-allowed hover:bg-navy-900 hover:text-white"
                    )}
                    style={{
                        borderColor: "var(--color-navy-900)",
                        color: "var(--color-navy-900)",
                    }}
                >
                    <Plus size={14} />
                    Add Entry
                </button>
            </div>

            {/* Contacts List */}
            <AnimatePresence>
                {localContacts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-16 rounded-[2rem] border-2 border-dashed bg-white/20"
                        style={{ borderColor: "rgba(0,0,0,0.05)" }}
                    >
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            <Phone size={24} className="text-slate-400" />
                        </div>
                        <p className="text-sm font-medium text-slate-500">
                            No trusted contacts registered
                        </p>
                        <button
                            onClick={addContact}
                            className="text-xs mt-2 font-bold text-navy-900 hover:underline"
                        >
                            Establish your first contact
                        </button>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {localContacts.map((contact, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={cn(
                                    "relative p-8 rounded-[2.5rem] border bg-white/40 backdrop-blur-md transition-all duration-500 overflow-hidden",
                                    deletingIndex === index ? "ring-2 ring-red-500/50" : "border-slate-100/50 hover:border-navy-900/10 hover:shadow-xl hover:shadow-navy-900/5"
                                )}
                            >
                                {/* Deletion Overlay/Modal */}
                                <AnimatePresence>
                                    {deletingIndex === index && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 z-20 bg-navy-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center"
                                        >
                                            <div className="w-16 h-16 rounded-2xl bg-red-500 flex items-center justify-center mb-6 shadow-2xl shadow-red-500/40">
                                                <Trash2 size={32} className="text-white" />
                                            </div>
                                            <h4 className="text-xl font-black text-white tracking-tighter uppercase mb-2">Delete Protocol?</h4>
                                            <p className="text-sm text-white/60 mb-8 font-medium">Removing this contact will disable their emergency notifications immediately.</p>
                                            <div className="flex gap-3 w-full max-w-xs">
                                                <button
                                                    onClick={() => setDeletingIndex(null)}
                                                    className="flex-1 py-3 rounded-xl bg-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all"
                                                >
                                                    Abort
                                                </button>
                                                <button
                                                    onClick={removeContact}
                                                    className="flex-1 py-3 rounded-xl bg-red-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-500 transition-all shadow-lg"
                                                >
                                                    Confirm
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-navy-900 flex items-center justify-center text-xs font-black text-white shadow-lg">
                                            0{index + 1}
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 block">
                                                Protocol Partner
                                            </span>
                                            <span className="text-[11px] font-bold text-navy-900/40 uppercase tracking-widest">
                                                Level {index + 1} Clearancy
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => confirmRemove(index)}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-red-500/10 text-slate-300 hover:text-red-600 transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Name */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                                            Identity Tag
                                        </label>
                                        <div className="relative group">
                                            <User
                                                size={14}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-navy-900 transition-colors"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Legal Participant Name"
                                                value={contact.name}
                                                onChange={(e) =>
                                                    updateContact(index, "name", e.target.value)
                                                }
                                                className="w-full pl-11 pr-4 py-4 text-sm font-bold rounded-2xl border-2 border-slate-100/50 bg-white/50 focus:bg-white focus:border-navy-900/20 focus:ring-4 focus:ring-navy-900/5 transition-all outline-none text-navy-900 placeholder:text-slate-300"
                                            />
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                                            Communication Vector
                                        </label>
                                        <div className="relative group">
                                            <Phone
                                                size={14}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-navy-900 transition-colors"
                                            />
                                            <input
                                                type="tel"
                                                placeholder="+92 XXXXXXXXXX"
                                                value={contact.phone}
                                                onChange={(e) =>
                                                    updateContact(index, "phone", e.target.value)
                                                }
                                                className="w-full pl-11 pr-4 py-4 text-sm font-bold rounded-2xl border-2 border-slate-100/50 bg-white/50 focus:bg-white focus:border-navy-900/20 focus:ring-4 focus:ring-navy-900/5 transition-all outline-none text-navy-900 placeholder:text-slate-300"
                                            />
                                        </div>
                                    </div>

                                    {/* Relation */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                                            Relational Link
                                        </label>
                                        <div className="relative group">
                                            <Heart
                                                size={14}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-500 transition-colors"
                                            />
                                            <select
                                                value={contact.relation}
                                                onChange={(e) =>
                                                    updateContact(index, "relation", e.target.value)
                                                }
                                                className="w-full pl-11 pr-4 py-4 text-sm font-bold rounded-2xl border-2 border-slate-100/50 bg-white/50 focus:bg-white focus:border-navy-900/20 focus:ring-4 focus:ring-navy-900/5 transition-all outline-none appearance-none cursor-pointer text-navy-900"
                                            >
                                                {RELATION_OPTIONS.map((r) => (
                                                    <option key={r} value={r}>
                                                        {r}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </AnimatePresence>

            {/* Save Button */}
            {isDirty && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-4"
                >
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={cn(
                            "w-full flex items-center justify-center gap-2 py-4 rounded-[1.5rem]",
                            "text-sm font-bold text-white transition-all shadow-navy",
                            "disabled:opacity-50 hover:bg-navy-950"
                        )}
                        style={{ backgroundColor: "var(--color-navy-900)" }}
                    >
                        {isSaving ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <Save size={18} />
                        )}
                        {isSaving ? "Synchronizing..." : "Save Registry Changes"}
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default EmergencyContacts;