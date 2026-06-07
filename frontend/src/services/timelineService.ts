import api from "./api";
import type { TimelineEntry, TimelineStats, TimelineFilter } from "../types";

interface TimelineResponse {
    entries: TimelineEntry[];
    total: number;
    page: number;
    pages: number;
}

export const getTimeline = async (
    page: number = 1,
    limit: number = 10,
    filters?: TimelineFilter
): Promise<TimelineResponse> => {
    const response = await api.get<TimelineResponse>("/api/timeline", {
        params: {
            page,
            limit,
            ...filters,
        },
    });
    // backend wraps payload in { success, data, message }
    return (response.data as any).data;
};

export const getTimelineStats = async (): Promise<TimelineStats> => {
    const response = await api.get("/api/timeline/stats");
    return (response.data as any).data as TimelineStats;
};

export const getTimelineEntry = async (id: string): Promise<TimelineEntry> => {
    const response = await api.get(`/api/timeline/${id}`);
    return (response.data as any).data as TimelineEntry;
};