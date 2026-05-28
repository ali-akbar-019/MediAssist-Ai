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
        <div className="space-y-3">
            {/* Quick Suggestions */}
            {showSuggestions && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap gap-2"
                >
                    <span className="text-xs text-medical-muted self-center">
                        Quick:
                    </span>
                    {QUICK_SUGGESTIONS.map((suggestion) => (
                        <button
                            key={suggestion}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-3 py-1 rounded-full text-xs font-medium border border-medical-border text-medical-muted hover:border-navy-900 hover:text-navy-900 hover:bg-navy-50 transition-all"
                        >
                            {suggestion}
                        </button>
                    ))}
                </motion.div>
            )}

            {/* Input Area */}
            <div
                className={cn(
                    "flex items-end gap-3 p-3 rounded-2xl border transition-all",
                    disabled
                        ? "bg-medical-surface border-medical-border"
                        : "bg-white border-medical-border focus-within:border-navy-900 focus-within:ring-2 focus-within:ring-navy-100"
                )}
            >
                {/* Textarea */}
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
                        "flex-1 resize-none bg-transparent text-sm text-medical-text placeholder:text-medical-muted",
                        "focus:outline-none disabled:opacity-50",
                        "min-h-[24px] max-h-[120px]"
                    )}
                />

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                    {/* Mic Button */}
                    <button
                        disabled={disabled || isSending}
                        className="p-2 rounded-xl text-medical-muted hover:text-navy-900 hover:bg-medical-surface transition-colors disabled:opacity-40"
                        title="Voice input (coming soon)"
                    >
                        <Mic className="w-4 h-4" />
                    </button>

                    {/* Send Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSend}
                        disabled={!message.trim() || isSending || disabled}
                        className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center transition-all",
                            message.trim() && !isSending && !disabled
                                ? "bg-navy-900 text-white hover:bg-navy-800 shadow-navy"
                                : "bg-medical-surface text-medical-muted cursor-not-allowed"
                        )}
                    >
                        {isSending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </motion.button>
                </div>
            </div>

            {/* Helper Text */}
            <p className="text-xs text-medical-muted text-center">
                Press{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-medical-surface border border-medical-border text-xs font-mono">
                    Enter
                </kbd>{" "}
                to send,{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-medical-surface border border-medical-border text-xs font-mono">
                    Shift + Enter
                </kbd>{" "}
                for new line
            </p>
        </div>
    );
};

export default ChatInput;