import api from "./api";
import type { EmergencyContact, EmergencyLog } from "../types";

// Save emergency contacts
export const saveEmergencyContacts = async (
    contacts: EmergencyContact[]
): Promise<void> => {
    await api.put("/api/emergency/contacts", { contacts });
};

// Get emergency contacts
export const getEmergencyContacts = async (): Promise<EmergencyContact[]> => {
    const response = await api.get<{ data: EmergencyContact[] }>(
        "/api/emergency/contacts"
    );
    return response.data.data;
};

// Log emergency event
export const logEmergency = async (data: {
    symptoms: string[];
    location?: { lat: number; lng: number };
    contactsNotified: string[];
}): Promise<EmergencyLog> => {
    const response = await api.post<{ data: EmergencyLog }>(
        "/api/emergency/log",
        data
    );
    return response.data.data;
};

// Get emergency logs
export const getEmergencyLogs = async (): Promise<EmergencyLog[]> => {
    const response = await api.get<{ data: EmergencyLog[] }>(
        "/api/emergency/logs"
    );
    return response.data.data;
};

// Resolve emergency
export const resolveEmergency = async (id: string): Promise<void> => {
    await api.put(`/api/emergency/logs/${id}/resolve`);
};