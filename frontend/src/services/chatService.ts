import api from "./api";
import type { APIResponse, ChatSession, ChatMessage } from "../types";

interface SendMessageResponse {
    message: string;
    sessionId: string;
}

interface SessionListResponse {
    sessions: ChatSession[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

interface CreateSessionResponse {
    sessionId: string;
    chatSession: ChatSession;
}

// Create new chat session
export const createChatSession = async (): Promise<CreateSessionResponse> => {
    const response = await api.post<APIResponse<CreateSessionResponse>>(
        "/api/chat/session"
    );
    return response.data.data;
};

// Send message to AI doctor
export const sendMessage = async (
    message: string,
    sessionId: string
): Promise<SendMessageResponse> => {
    const response = await api.post<APIResponse<SendMessageResponse>>(
        "/api/chat/message",
        {
            message,
            sessionId,
        }
    );
    return response.data.data;
};

// Get all chat sessions
export const getChatSessions = async (
    page: number = 1,
    limit: number = 10
): Promise<SessionListResponse> => {
    const response = await api.get<APIResponse<SessionListResponse>>(
        "/api/chat/sessions",
        {
            params: { page, limit },
        }
    );
    return response.data.data;
};

// Get single chat session by sessionId
export const getChatSessionById = async (
    sessionId: string
): Promise<ChatSession> => {
    const response = await api.get<APIResponse<ChatSession>>(
        `/api/chat/sessions/${sessionId}`
    );
    return response.data.data;
};

// Delete chat session
export const deleteChatSession = async (sessionId: string): Promise<void> => {
    await api.delete(`/api/chat/sessions/${sessionId}`);
};

// Format messages for display
export const formatMessages = (messages: ChatMessage[]): ChatMessage[] => {
    return messages.map((msg) => ({
        ...msg,
        timestamp: msg.timestamp || new Date().toISOString(),
    }));
};