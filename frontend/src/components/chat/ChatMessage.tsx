import { motion } from "framer-motion";
import { Stethoscope, User } from "lucide-react";
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
                "flex gap-3",
                isUser ? "flex-row-reverse" : "flex-row"
            )}
        >
            {/* Avatar */}
            <div
                className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                    isUser
                        ? "bg-navy-900"
                        : "bg-emerald-500"
                )}
            >
                {isUser ? (
                    <User className="w-4 h-4 text-white" />
                ) : (
                    <Stethoscope className="w-4 h-4 text-white" />
                )}
            </div>

            {/* Message Bubble */}
            <div
                className={cn(
                    "flex flex-col max-w-[75%]",
                    isUser ? "items-end" : "items-start"
                )}
            >
                {/* Sender Label */}
                <span className="text-xs text-medical-muted mb-1 px-1">
                    {isUser ? "You" : "MediAssist AI"}
                </span>

                {/* Bubble */}
                <div
                    className={cn(
                        "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                        isUser
                            ? "bg-navy-900 text-white rounded-tr-sm"
                            : "bg-medical-surface border border-medical-border text-medical-text rounded-tl-sm"
                    )}
                >
                    {/* Render message with line breaks */}
                    {message.content.split("\n").map((line, i) => (
                        <span key={i}>
                            {line}
                            {i < message.content.split("\n").length - 1 && <br />}
                        </span>
                    ))}
                </div>

                {/* Timestamp */}
                <span className="text-xs text-medical-muted mt-1 px-1">
                    {formatRelativeTime(message.timestamp)}
                </span>
            </div>
        </motion.div>
    );
};

export default ChatMessage;