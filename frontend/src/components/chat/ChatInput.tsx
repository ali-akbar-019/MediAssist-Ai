import { useState, type KeyboardEvent, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, Mic } from "lucide-react";
import { cn } from "../../lib/utils";

interface ChatInputProps {
    onSend: (message: string) => void;
    isSending: boolean;
    disabled?: boolean;
    placeholder?: string;
}

const QUICK_SUGGESTIONS = [
    "I have a headache",
    "My stomach hurts",
    "I feel feverish",
    "I have chest pain",
    "I feel dizzy",
    "I have back pain",
];

const ChatInput = ({
    onSend,
    isSending,
    disabled = false,
    placeholder = "Describe your symptoms or ask a health question...",
}: ChatInputProps) => {
    const [message, setMessage] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(true);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSend = () => {
        const trimmed = message.trim();
        if (!trimmed || isSending || disabled) return;
        onSend(trimmed);
        setMessage("");
        setShowSuggestions(false);
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleInput = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    };

    const handleSuggestionClick = (suggestion: string) => {
        setMessage(suggestion);
        setShowSuggestions(false);
        textareaRef.current?.focus();
    };

    return (
        <div className="space-y-4">
            {/* Quick Suggestions — Elite Chips */}
            {showSuggestions && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap gap-2 px-2"
                >
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 self-center mr-2">
                        Common Signal:
                    </span>
                    {QUICK_SUGGESTIONS.map((suggestion) => (
                        <button
                            key={suggestion}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-4 py-1.5 rounded-full text-[11px] font-bold border border-white/60 bg-white/40 text-slate-500 hover:border-emerald-500/50 hover:text-emerald-600 hover:bg-white transiton-all duration-300"
                        >
                            {suggestion}
                        </button>
                    ))}
                </motion.div>
            )}

            {/* Input Area — Luxury Glass Interface */}
            <div
                className={cn(
                    "flex items-end gap-4 p-4 rounded-[1.8rem] border transition-all duration-500",
                    disabled
                        ? "bg-white/10 border-white/10"
                        : "glass-panel border-white/60 focus-within:border-emerald-500/50 focus-within:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                )}
            >
                {/* Textarea — Precision Input */}
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onInput={handleInput}
                    placeholder={placeholder}
                    disabled={disabled || isSending}
                    rows={1}
                    className={cn(
                        "flex-1 resize-none bg-transparent text-sm text-navy-900 placeholder:text-slate-400",
                        "focus:outline-none disabled:opacity-50",
                        "min-h-[24px] max-h-[120px] pt-1 font-medium"
                    )}
                />

                {/* Tactical Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        disabled={disabled || isSending}
                        className="p-2.5 rounded-2xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all duration-300 disabled:opacity-40"
                        title="Voice Analysis"
                    >
                        <Mic className="w-5 h-5" />
                    </button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSend}
                        disabled={!message.trim() || isSending || disabled}
                        className={cn(
                            "w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500",
                            message.trim() && !isSending && !disabled
                                ? "bg-navy-900 text-white hover:bg-navy-950 shadow-navy"
                                : "bg-white/40 text-slate-300 cursor-not-allowed border border-white/60"
                        )}
                    >
                        {isSending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </motion.button>
                </div>
            </div>

            {/* Signal Protocol Info */}
            <div className="flex items-center justify-center gap-4 py-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-emerald-500" />
                    Protocol: Secure Signal Area
                </p>
                <div className="w-1 h-1 rounded-full bg-slate-200" />
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Press <span className="text-navy-900">Return</span> to Transmit
                </p>
            </div>
        </div>
    );
};

export default ChatInput;