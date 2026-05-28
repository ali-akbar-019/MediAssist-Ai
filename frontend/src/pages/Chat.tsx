import { motion } from "framer-motion";
import { MessageCircle, Info } from "lucide-react";
import ChatWindow from "../components/chat/ChatWindow";

const Chat = () => {
    return (
        <div className="page-enter">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                <MessageCircle className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-heading font-bold text-navy-900">
                                    AI Doctor Chat
                                </h1>
                                <p className="text-sm text-medical-muted">
                                    Chat with our AI medical assistant for health guidance
                                </p>
                            </div>
                        </div>

                        {/* Disclaimer */}
                        <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-100 rounded-xl">
                            <Info className="w-4 h-4 text-amber-500 shrink-0" />
                            <p className="text-xs text-amber-700">
                                Not a substitute for professional medical advice
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Chat Window */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <ChatWindow />
                </motion.div>
            </div>
        </div>
    );
};

export default Chat;