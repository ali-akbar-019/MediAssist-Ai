import { useCallback, useState } from "react";
import { parseErrorMessage } from "../lib/utils";
import {
    createChatSession,
    deleteChatSession,
    getChatSessionById,
    getChatSessions,
    sendMessage,
} from "../services/chatService";
import type { ChatMessage, ChatSession } from "../types";

export const useChat = () => {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalSessions, setTotalSessions] = useState(0);

    const handleCreateSession = useCallback(async (): Promise<string | null> => {
        try {
            setError(null);
            setIsLoading(true);
            const data = await createChatSession();
            setCurrentSession(data.chatSession);
            setMessages([]);
            return data.sessionId;
        } catch (err) {
            setError(parseErrorMessage(err));
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSendMessage = useCallback(
        async (message: string, sessionId: string): Promise<boolean> => {
            try {
                setError(null);
                setIsSending(true);

                // Optimistically add user message
                const userMessage: ChatMessage = {
                    role: "user",
                    content: message,
                    timestamp: new Date().toISOString(),
                };
                setMessages((prev) => [...prev, userMessage]);

                const data = await sendMessage(message, sessionId);

                // Add AI response
                const aiMessage: ChatMessage = {
                    role: "assistant",
                    content: data.message,
                    timestamp: new Date().toISOString(),
                };
                setMessages((prev) => [...prev, aiMessage]);

                return true;
            } catch (err) {
                // Remove optimistic message on error
                setMessages((prev) => prev.slice(0, -1));
                setError(parseErrorMessage(err));
                return false;
            } finally {
                setIsSending(false);
            }
        },
        []
    );

    const handleGetSessions = useCallback(
        async (page: number = 1, limit: number = 10): Promise<void> => {
            try {
                setError(null);
                setIsLoading(true);
                const data = await getChatSessions(page, limit);
                setSessions(data.sessions);
                setTotalSessions(data.pagination.total);
            } catch (err) {
                setError(parseErrorMessage(err));
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    const handleGetSessionById = useCallback(
        async (sessionId: string): Promise<void> => {
            try {
                setError(null);
                setIsLoading(true);
                const session = await getChatSessionById(sessionId);
                setCurrentSession(session);
                setMessages(session.messages);
            } catch (err) {
                setError(parseErrorMessage(err));
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    const handleDeleteSession = useCallback(
        async (sessionId: string): Promise<boolean> => {
            try {
                setError(null);
                await deleteChatSession(sessionId);
                setSessions((prev) =>
                    prev.filter((s) => s.sessionId !== sessionId)
                );
                if (currentSession?.sessionId === sessionId) {
                    setCurrentSession(null);
                    setMessages([]);
                }
                return true;
            } catch (err) {
                setError(parseErrorMessage(err));
                return false;
            }
        },
        [currentSession]
    );

    const clearError = () => setError(null);

    const resetChat = useCallback(() => {
        setCurrentSession(null);
        setMessages([]);
        setError(null);
    }, []);

    return {
        sessions,
        currentSession,
        messages,
        isLoading,
        isSending,
        error,
        totalSessions,
        clearError,
        resetChat,
        handleCreateSession,
        handleSendMessage,
        handleGetSessions,
        handleGetSessionById,
        handleDeleteSession,
    };
};