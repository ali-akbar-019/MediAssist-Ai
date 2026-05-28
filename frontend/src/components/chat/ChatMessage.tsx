import { motion } from "framer-motion";
import { Stethoscope, User, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { ChatMessage as ChatMessageType } from "../../types";
import { formatRelativeTime } from "../../lib/utils";
import { cn } from "../../lib/utils";

interface ChatMessageProps {
    message: ChatMessageType;
    index: number;
}

const ChatMessage = ({ message, index }: ChatMessageProps) => {
    const isUser = message.role === "user";

    return (
        <motion.div
            initial={{ opacity: 0, x: isUser ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
                duration: 0.6, 
                delay: index * 0.05,
                ease: [0.16, 1, 0.3, 1]
            }}
            className={cn(
                "flex gap-4",
                isUser ? "flex-row-reverse" : "flex-row"
            )}
        >
            {/* Elite Avatar */}
            <div
                className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-1 shadow-luxe",
                    isUser
                        ? "bg-navy-900 border border-white/20"
                        : "bg-emerald-500 border border-emerald-400/50"
                )}
            >
                {isUser ? (
                    <User className="w-5 h-5 text-white" />
                ) : (
                    <Stethoscope className="w-5 h-5 text-white" />
                )}
            </div>

            {/* Message Bubble Container */}
            <div
                className={cn(
                    "flex flex-col max-w-[80%]",
                    isUser ? "items-end" : "items-start"
                )}
            >
                {/* Tactical Label */}
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1.5 px-2">
                    {isUser ? "Authorized Source" : "Intelligence Signal"}
                </span>

                {/* The Bubble */}
                <div
                    className={cn(
                        "px-6 py-4 rounded-[2rem] text-sm leading-relaxed relative overflow-hidden",
                        isUser
                            ? "bg-navy-900 text-white rounded-tr-sm shadow-navy border border-white/10"
                            : "glass-panel border-white/60 text-navy-900 rounded-tl-sm shadow-sm chat-markdown"
                    )}
                >
                    {/* Subtle Internal Glow for AI */}
                    {!isUser && (
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                            <Stethoscope className="w-16 h-16 rotate-12" />
                        </div>
                    )}
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>

                {/* Timestamp Index */}
                <div className={cn(
                    "flex items-center gap-2 mt-2 px-2",
                    isUser ? "flex-row-reverse" : "flex-row"
                )}>
                    <Clock className="w-3 h-3 text-slate-300" />
                    <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">
                        {formatRelativeTime(message.timestamp)}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default ChatMessage;