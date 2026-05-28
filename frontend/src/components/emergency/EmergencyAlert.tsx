import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Phone, X, Ambulance } from "lucide-react";
import { EMERGENCY_NUMBERS } from "../../constants";

interface EmergencyAlertProps {
    isVisible: boolean;
    onClose: () => void;
    triggeredBy?: string;
}

const EmergencyAlert = ({
    isVisible,
    onClose,
    triggeredBy,
}: EmergencyAlertProps) => {
    const emergencyContacts = [
        {
            label: "Rescue",
            number: EMERGENCY_NUMBERS.PAKISTAN_RESCUE,
            color: "bg-red-500",
            icon: Phone,
        },
        {
            label: "Ambulance",
            number: EMERGENCY_NUMBERS.PAKISTAN_AMBULANCE,
            color: "bg-orange-500",
            icon: Ambulance,
        },
        {
            label: "Police",
            number: EMERGENCY_NUMBERS.PAKISTAN_POLICE,
            color: "bg-blue-600",
            icon: Phone,
        },
    ];

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Alert Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-white rounded-2xl shadow-elevated w-full max-w-md pointer-events-auto overflow-hidden">
                            {/* Header */}
                            <div className="bg-red-500 p-5 relative">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                                >
                                    <X className="w-4 h-4 text-white" />
                                </button>
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Infinity, duration: 1 }}
                                        className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"
                                    >
                                        <AlertTriangle className="w-6 h-6 text-white" />
                                    </motion.div>
                                    <div>
                                        <h2 className="text-white font-heading font-bold text-xl">
                                            Emergency Alert
                                        </h2>
                                        <p className="text-red-100 text-sm">
                                            Immediate medical attention may be required
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                {triggeredBy && (
                                    <div className="mb-4 p-3 bg-red-50 rounded-xl border border-red-100">
                                        <p className="text-red-700 text-sm font-medium">
                                            Detected symptom:
                                        </p>
                                        <p className="text-red-600 text-sm mt-1">"{triggeredBy}"</p>
                                    </div>
                                )}

                                <p className="text-medical-text text-sm mb-5 leading-relaxed">
                                    Your symptoms suggest a potentially serious medical condition.
                                    Please contact emergency services immediately or have someone
                                    take you to the nearest hospital.
                                </p>

                                {/* Emergency Numbers */}
                                <div className="space-y-3 mb-5">
                                    <p className="text-medical-muted text-xs font-medium uppercase tracking-wider">
                                        Emergency Contacts — Pakistan
                                    </p>
                                    {emergencyContacts.map((contact) => {
                                        const Icon = contact.icon;
                                        return (
                                            <motion.a
                                                key={contact.number}
                                                href={`tel:${contact.number}`}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl ${contact.color} text-white transition-opacity hover:opacity-90`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Icon className="w-5 h-5" />
                                                    <span className="font-medium">{contact.label}</span>
                                                </div>
                                                <span className="font-bold text-lg tracking-wider">
                                                    {contact.number}
                                                </span>
                                            </motion.a>
                                        );
                                    })}
                                </div>

                                {/* Disclaimer */}
                                <p className="text-medical-muted text-xs text-center">
                                    Do not rely solely on AI assessment for emergencies.
                                    Call emergency services immediately if in danger.
                                </p>

                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="mt-4 w-full py-2.5 rounded-xl border border-medical-border text-medical-muted text-sm font-medium hover:bg-medical-surface transition-colors"
                                >
                                    I understand, close this alert
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default EmergencyAlert;