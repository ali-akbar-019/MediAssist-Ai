import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Stethoscope,
    Plus,
    Trash2,
    MessageCircle,
    Loader2,
    Clock,
} from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { useChat } from "../../hooks/useChat";
import { Button } from "../../components/ui/button";
import { formatRelativeTime, truncate } from "../../lib/utils";
import { cn } from "../../lib/utils";

const ChatWindow = () => {
    const {
        sessions,
        currentSession,
        messages,
        isLoading,
        isSending,
        error,
        handleCreateSession,
        handleSendMessage,
        handleGetSessions,
        handleGetSessionById,
        handleDeleteSession,
    } = useChat();

    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        handleGetSessions();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleNewChat = async () => {
        const sessionId = await handleCreateSession();
        if (sessionId) {
            setCurrentSessionId(sessionId);
        }
    };

    const handleSelectSession = async (sessionId: string) => {
        setCurrentSessionId(sessionId);
        await handleGetSessionById(sessionId);
    };

    const handleSend = async (message: string) => {
        if (!currentSessionId) {
            const sessionId = await handleCreateSession();
            if (!sessionId) return;
            setCurrentSessionId(sessionId);
            await handleSendMessage(message, sessionId);
        } else {
            await handleSendMessage(message, currentSessionId);
        }
    };

    const handleDelete = async (sessionId: string) => {
        await handleDeleteSession(sessionId);
        if (currentSessionId === sessionId) {
            setCurrentSessionId(null);
        }
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] rounded-2xl border border-medical-border overflow-hidden shadow-card">
            {/* Sidebar — Session List */}
            <div className="w-72 border-r border-medical-border bg-medical-surface flex flex-col shrink-0 hidden md:flex">
                {/* Sidebar Header */}
                <div className="p-4 border-b border-medical-border">
                    <Button
                        onClick={handleNewChat}
                        className="w-full bg-navy-900 hover:bg-navy-800 text-white"
                        disabled={isLoading}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Conversation
                    </Button>
                </div>

                {/* Session List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {isLoading && sessions.length === 0 ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-5 h-5 animate-spin text-medical-muted" />
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                            <MessageCircle className="w-8 h-8 text-medical-muted mb-2" />
                            <p className="text-sm text-medical-muted">
                                No conversations yet. Start a new chat!
                            </p>
                        </div>
                    ) : (
                        sessions.map((session) => (
                            <motion.div
                                key={session.sessionId}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={cn(
                                    "group flex items-start justify-between p-3 rounded-xl cursor-pointer transition-all",
                                    currentSessionId === session.sessionId
                                        ? "bg-navy-900 text-white"
                                        : "hover:bg-white text-medical-text"
                                )}
                                onClick={() => handleSelectSession(session.sessionId)}
                            >
                                <div className="flex-1 min-w-0">
                                    <p
                                        className={cn(
                                            "text-sm font-medium truncate",
                                            currentSessionId === session.sessionId
                                                ? "text-white"
                                                : "text-medical-text"
                                        )}
                                    >
                                        {truncate(session.title, 30)}
                                    </p>
                                    <div
                                        className={cn(
                                            "flex items-center gap-1 mt-1",
                                            currentSessionId === session.sessionId
                                                ? "text-navy-200"
                                                : "text-medical-muted"
                                        )}
                                    >
                                        <Clock className="w-3 h-3" />
                                        <span className="text-xs">
                                            {formatRelativeTime(session.updatedAt)}
                                        </span>
                                    </div>
                                </div>

                                {/* Delete Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(session.sessionId);
                                    }}
                                    className={cn(
                                        "p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all",
                                        currentSessionId === session.sessionId
                                            ? "hover:bg-white/20 text-white"
                                            : "hover:bg-red-50 text-red-400"
                                    )}
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-white min-w-0">
                {/* Chat Header */}
                <div className="flex items-center gap-3 p-4 border-b border-medical-border shrink-0">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center">
                        <Stethoscope className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="font-heading font-semibold text-navy-900 text-sm">
                            MediAssist AI Doctor
                        </h2>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs text-medical-muted">
                                Online — Ready to help
                            </span>
                        </div>
                    </div>

                    {/* Mobile New Chat */}
                    <Button
                        onClick={handleNewChat}
                        size="sm"
                        variant="outline"
                        className="ml-auto md:hidden border-medical-border"
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Welcome Message */}
                    {messages.length === 0 && !isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center h-full gap-4 text-center py-8"
                        >
                            <motion.div
                                animate={{ float: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center"
                            >
                                <Stethoscope className="w-8 h-8 text-emerald-500" />
                            </motion.div>
                            <div>
                                <h3 className="font-heading font-semibold text-navy-900 text-lg">
                                    Hello! I am MediAssist AI
                                </h3>
                                <p className="text-medical-muted text-sm mt-1 max-w-sm">
                                    I am here to help you understand your symptoms and provide
                                    general health guidance. How can I help you today?
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
                                {[
                                    "I have a headache",
                                    "Stomach pain advice",
                                    "Fever symptoms",
                                    "Back pain help",
                                ].map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() => handleSend(suggestion)}
                                        className="px-3 py-2 rounded-xl text-xs font-medium border border-medical-border text-medical-muted hover:border-navy-900 hover:text-navy-900 hover:bg-navy-50 transition-all text-left"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Messages */}
                    <AnimatePresence>
                        {messages.map((message, index) => (
                            <ChatMessage
                                key={`${message.timestamp}-${index}`}
                                message={message}
                                index={index}
                            />
                        ))}
                    </AnimatePresence>

                    {/* Sending Indicator */}
                    {isSending && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-3"
                        >
                            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                                <Stethoscope className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-medical-surface border border-medical-border px-4 py-3 rounded-2xl rounded-tl-sm">
                                <div className="flex items-center gap-1">
                                    {[0, 1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ y: [0, -4, 0] }}
                                            transition={{
                                                duration: 0.6,
                                                repeat: Infinity,
                                                delay: i * 0.15,
                                            }}
                                            className="w-1.5 h-1.5 rounded-full bg-medical-muted"
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600"
                        >
                            <span>⚠️</span>
                            <span>{error}</span>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-medical-border shrink-0">
                    <ChatInput
                        onSend={handleSend}
                        isSending={isSending}
                        disabled={false}
                    />
                    <p className="text-xs text-medical-muted text-center mt-2">
                        MediAssist AI is not a substitute for professional medical advice.
                        Always consult a qualified healthcare professional.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;