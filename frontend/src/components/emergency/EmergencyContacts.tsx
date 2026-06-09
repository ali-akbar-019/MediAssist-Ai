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

    const removeContact = (index: number) => {
        setLocalContacts((prev) => prev.filter((_, i) => i !== index));
        setIsDirty(true);
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
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Heart size={16} style={{ color: "#EF4444" }} />
                    <h3
                        className="font-semibold text-sm"
                        style={{ color: "var(--color-navy-900)" }}
                    >
                        Emergency Contacts
                    </h3>
                </div>
                <button
                    onClick={addContact}
                    disabled={localContacts.length >= 5}
                    className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium",
                        "border transition-all",
                        "disabled:opacity-40 disabled:cursor-not-allowed"
                    )}
                    style={{
                        borderColor: "var(--color-navy-900)",
                        color: "var(--color-navy-900)",
                    }}
                >
                    <Plus size={13} />
                    Add Contact
                </button>
            </div>

            {/* Contacts List */}
            <AnimatePresence>
                {localContacts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-8 rounded-xl border border-dashed"
                        style={{ borderColor: "var(--color-medical-border)" }}
                    >
                        <Phone
                            size={24}
                            className="mb-2"
                            style={{ color: "var(--color-medical-muted)" }}
                        />
                        <p
                            className="text-sm"
                            style={{ color: "var(--color-medical-muted)" }}
                        >
                            No emergency contacts added
                        </p>
                        <button
                            onClick={addContact}
                            className="text-xs mt-2 underline"
                            style={{ color: "var(--color-navy-900)" }}
                        >
                            Add your first contact
                        </button>
                    </motion.div>
                ) : (
                    <div className="space-y-3">
                        {localContacts.map((contact, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className={cn(
                                    "p-4 rounded-xl border space-y-3"
                                )}
                                style={{
                                    borderColor: "var(--color-medical-border)",
                                    backgroundColor: "var(--color-medical-surface)",
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <span
                                        className="text-xs font-semibold uppercase tracking-wider"
                                        style={{ color: "var(--color-medical-muted)" }}
                                    >
                                        Contact {index + 1}
                                    </span>
                                    <button
                                        onClick={() => removeContact(index)}
                                        className="p-1 rounded-lg hover:bg-red-50 transition-colors"
                                        style={{ color: "var(--color-medical-muted)" }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.color = "#EF4444")
                                        }
                                        onMouseLeave={(e) =>
                                        (e.currentTarget.style.color =
                                            "var(--color-medical-muted)")
                                        }
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    {/* Name */}
                                    <div className="relative">
                                        <User
                                            size={14}
                                            className="absolute left-2.5 top-1/2 -translate-y-1/2"
                                            style={{ color: "var(--color-medical-muted)" }}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Full name"
                                            value={contact.name}
                                            onChange={(e) =>
                                                updateContact(index, "name", e.target.value)
                                            }
                                            className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border outline-none transition-colors"
                                            style={{
                                                borderColor: "var(--color-medical-border)",
                                                backgroundColor: "white",
                                                color: "var(--color-medical-text)",
                                            }}
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div className="relative">
                                        <Phone
                                            size={14}
                                            className="absolute left-2.5 top-1/2 -translate-y-1/2"
                                            style={{ color: "var(--color-medical-muted)" }}
                                        />
                                        <input
                                            type="tel"
                                            placeholder="Phone number"
                                            value={contact.phone}
                                            onChange={(e) =>
                                                updateContact(index, "phone", e.target.value)
                                            }
                                            className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border outline-none transition-colors"
                                            style={{
                                                borderColor: "var(--color-medical-border)",
                                                backgroundColor: "white",
                                                color: "var(--color-medical-text)",
                                            }}
                                        />
                                    </div>

                                    {/* Relation */}
                                    <select
                                        value={contact.relation}
                                        onChange={(e) =>
                                            updateContact(index, "relation", e.target.value)
                                        }
                                        className="w-full px-3 py-2 text-sm rounded-lg border outline-none transition-colors appearance-none"
                                        style={{
                                            borderColor: "var(--color-medical-border)",
                                            backgroundColor: "white",
                                            color: "var(--color-medical-text)",
                                        }}
                                    >
                                        {RELATION_OPTIONS.map((r) => (
                                            <option key={r} value={r}>
                                                {r}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </AnimatePresence>

            {/* Save Button */}
            {isDirty && (
                <motion.button
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={handleSave}
                    disabled={isSaving}
                    className={cn(
                        "w-full flex items-center justify-center gap-2 py-3 rounded-xl",
                        "text-sm font-medium text-white transition-all",
                        "disabled:opacity-50"
                    )}
                    style={{ backgroundColor: "var(--color-navy-900)" }}
                >
                    {isSaving ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : (
                        <Save size={16} />
                    )}
                    {isSaving ? "Saving..." : "Save Contacts"}
                </motion.button>
            )}
        </div>
    );
};

export default EmergencyContacts;