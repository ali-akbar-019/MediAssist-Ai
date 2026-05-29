import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Stethoscope,
    Plus,
    Trash2,
    MessageCircle,
    Loader2,
    Clock,
    AlertTriangle,
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

    const getSessionTitle = (session: (typeof sessions)[number]) => {
        if (session.title && session.title !== "New Conversation") {
            return session.title;
        }

        const firstUserMessage = session.messages?.find(
            (message) => message.role === "user" && message.content.trim()
        );
        const fallbackText = firstUserMessage?.content ?? session.messages?.[0]?.content ?? "New Conversation";

        const normalizedTitle = fallbackText.trim().replace(/\s+/g, " ");
        if (!normalizedTitle) {
            return "New Conversation";
        }

        return normalizedTitle.length > 30
            ? `${normalizedTitle.substring(0, 30)}...`
            : normalizedTitle;
    };

    useEffect(() => {
        handleGetSessions();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
        <div className="flex h-[850px] glass-panel rounded-[2.5rem] border-white/20 overflow-hidden shadow-luxe relative">
            {/* Sidebar — Session List */}
            <div className="w-80 border-r border-white/10 bg-white/20 backdrop-blur-md flex flex-col shrink-0 hidden md:flex">
                {/* Sidebar Header */}
                <div className="p-6 border-b border-white/10">
                    <Button
                        onClick={handleNewChat}
                        className="w-full h-14 rounded-2xl bg-navy-900 hover:bg-navy-950 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-navy transition-all active:scale-95"
                        disabled={isLoading}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Initiate Signal
                    </Button>
                </div>

                {/* Session List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {isLoading && sessions.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin text-emerald-500/50" />
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                            <div className="w-12 h-12 rounded-2xl bg-white/40 flex items-center justify-center mb-4">
                                <MessageCircle className="w-6 h-6 text-slate-400" />
                            </div>
                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                                Quiet Signal
                            </p>
                        </div>
                    ) : (
                        sessions.map((session) => (
                            <motion.div
                                key={session.sessionId}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={cn(
                                    "group flex items-start justify-between p-4 rounded-2xl cursor-pointer transition-all duration-500 border",
                                    currentSessionId === session.sessionId
                                        ? "bg-navy-900 border-navy-900 text-white shadow-navy scale-[1.02]"
                                        : "bg-white/40 border-white/60 hover:border-emerald-500/50 text-slate-600 hover:bg-white"
                                )}
                                onClick={() => handleSelectSession(session.sessionId)}
                            >
                                <div className="flex-1 min-w-0">
                                    <p
                                        className={cn(
                                            "text-xs font-black tracking-tight truncate",
                                            currentSessionId === session.sessionId
                                                ? "text-white"
                                                : "text-navy-900"
                                        )}
                                    >
                                        {truncate(getSessionTitle(session), 30)}
                                    </p>
                                    <div
                                        className={cn(
                                            "flex items-center gap-1.5 mt-1",
                                            currentSessionId === session.sessionId
                                                ? "text-emerald-400/80"
                                                : "text-slate-400"
                                        )}
                                    >
                                        <Clock className="w-3 h-3" />
                                        <span className="text-[10px] font-bold uppercase tracking-tighter">
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
                                        "p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all active:scale-90",
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
            <div className="flex-1 flex flex-col bg-white/30 min-w-0 backdrop-blur-sm">
                {/* Chat Header */}
                <div className="flex items-center gap-4 p-5 border-b border-white/10 bg-white/40 shrink-0">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                        <Stethoscope className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-[13px] font-black tracking-tight text-navy-900 uppercase">
                            Clinical Intelligence Unit
                        </h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600">
                                Neural Signal Active
                            </span>
                        </div>
                    </div>

                    {/* Mobile New Chat */}
                    <Button
                        onClick={handleNewChat}
                        size="icon"
                        variant="ghost"
                        className="ml-auto md:hidden w-10 h-10 rounded-xl bg-navy-900 text-white"
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Welcome HUD */}
                    {messages.length === 0 && !isLoading && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center h-full gap-8 text-center py-12"
                        >
                            <motion.div
                                animate={{
                                    y: [0, -15, 0],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="w-24 h-24 rounded-3xl bg-navy-900 border border-emerald-500/30 flex items-center justify-center shadow-navy relative group"
                            >
                                <div className="absolute inset-0 bg-emerald-500/10 rounded-3xl animate-pulse blur-xl" />
                                <Stethoscope className="w-10 h-10 text-emerald-400 relative z-10" />
                            </motion.div>

                            <div className="space-y-3">
                                <h3 className="text-3xl font-black text-navy-900 tracking-tighter">
                                    Initiating <span className="italic">Analysis.</span>
                                </h3>
                                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-600 animate-pulse">
                                    Awaiting Clinical Signal
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl px-4">
                                {[
                                    "Persistent migraine analysis",
                                    "Acute inflammatory response",
                                    "Cardiovascular stress indices",
                                    "Digestive signal evaluation",
                                ].map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() => handleSend(suggestion)}
                                        className="group p-4 rounded-2xl bg-white/40 border border-white/60 text-left transition-all duration-500 hover:border-emerald-500/50 hover:bg-white hover:shadow-luxe"
                                    >
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-600 mb-1">Inquiry</p>
                                        <p className="text-sm font-bold text-navy-900 tracking-tight">{suggestion}</p>
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
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-4"
                        >
                            <div className="w-10 h-10 rounded-2xl bg-navy-900 flex items-center justify-center shrink-0 shadow-navy">
                                <Stethoscope className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div className="glass-panel border-white/60 px-5 py-4 rounded-3xl rounded-tl-sm">
                                <div className="flex items-center gap-1.5">
                                    {[0, 1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            animate={{
                                                scale: [1, 1.5, 1],
                                                opacity: [0.3, 1, 0.3]
                                            }}
                                            transition={{
                                                duration: 1,
                                                repeat: Infinity,
                                                delay: i * 0.2,
                                            }}
                                            className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-3 p-4 bg-red-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl max-w-md mx-auto"
                        >
                            <AlertTriangle className="w-4 h-4" />
                            <span>Signal Interrupted: {error}</span>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white/40 border-t border-white/10 backdrop-blur-md shrink-0">
                    <ChatInput
                        onSend={handleSend}
                        isSending={isSending}
                        disabled={false}
                    />
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] text-center mt-4 opacity-60">
                        Operational Guideline: AI Signal requires clinical verification for acute diagnostics.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;