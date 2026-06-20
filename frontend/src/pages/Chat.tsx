import { motion } from "framer-motion";
import { MessageCircle, Info } from "lucide-react";
import ChatWindow from "../components/chat/ChatWindow";

const Chat = () => {
    return (
        <div className="medical-mesh min-h-screen pt-24 pb-20">
            <div className="container mx-auto px-6 relative">
                {/* Elite Editorial Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-navy-900 border border-emerald-500/20 mb-8 shadow-navy"
                    >
                        <MessageCircle className="w-8 h-8 text-emerald-400" />
                    </motion.div>
                    <h1 data-testid="chat-heading" className="text-5xl md:text-7xl font-bold tracking-tighter text-navy-900 mb-6 leading-none">
                        Clinical <span className="gradient-text-luxe italic">Signal.</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
                        Secure AI diagnostics interface. Discuss symptoms and health
                        indices with our advanced medical intelligence.
                    </p>
                </motion.div>

                {/* Main Chat Interface */}
                <div className="max-w-6xl mx-auto relative">
                    <ChatWindow />

                    {/* Elite Disclaimer Guideline */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-12 flex items-center justify-center gap-6 px-8 py-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm max-w-3xl mx-auto"
                    >
                        <div className="flex items-center gap-3 text-navy-400">
                            <Info className="w-4 h-4 text-emerald-500" />
                            <span className="text-[10px] uppercase tracking-[0.2em] font-black">Advisory Protocol</span>
                        </div>
                        <div className="w-px h-4 bg-white/10 hidden sm:block" />
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic text-center sm:text-left">
                            This signal provides informational clinical insights. It is not a substitute for professional medical advice.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Chat;