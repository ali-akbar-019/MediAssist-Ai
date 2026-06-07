import { motion } from "framer-motion";
import { BarChart2, Clock } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import SeverityTrend from "../components/timeline/SeverityTrend";
import TimelineFilters from "../components/timeline/TimelineFilters";
import TimelineView from "../components/timeline/TimelineView";
import { cn } from "../lib/utils";
import { getTimeline, getTimelineStats } from "../services/timelineService";
import type { TimelineEntry, TimelineFilter, TimelineStats } from "../types";

const DEFAULT_FILTERS: TimelineFilter = {
    sortOrder: "desc",
};

const TimelinePage = () => {
    const [entries, setEntries] = useState<TimelineEntry[]>([]);
    const [stats, setStats] = useState<TimelineStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState<TimelineFilter>(DEFAULT_FILTERS);
    const [activeTab, setActiveTab] = useState<"timeline" | "trends">("timeline");

    const fetchTimeline = useCallback(
        async (currentPage: number, currentFilters: TimelineFilter) => {
            try {
                setIsLoading(true);
                const data = await getTimeline(currentPage, 8, currentFilters);
                setEntries(data.entries);
                setTotal(data.total);
                setTotalPages(data.pages);
            } catch {
                // handle error
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    const fetchStats = useCallback(async () => {
        try {
            setIsLoadingStats(true);
            const data = await getTimelineStats();
            setStats(data);
        } catch {
            // handle error
        } finally {
            setIsLoadingStats(false);
        }
    }, []);

    useEffect(() => {
        fetchTimeline(page, filters);
    }, [page, filters, fetchTimeline]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const handleFilterChange = (newFilters: TimelineFilter) => {
        setFilters(newFilters);
        setPage(1);
    };

    const handleReset = () => {
        setFilters(DEFAULT_FILTERS);
        setPage(1);
    };

    return (
        <div
            className="min-h-[calc(100vh-4rem)] py-10"
            style={{ backgroundColor: "var(--color-medical-surface)" }}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div
                            className="w-11 h-11 rounded-2xl flex items-center justify-center"
                            style={{ backgroundColor: "var(--color-navy-900)" }}
                        >
                            <Clock size={22} color="white" />
                        </div>
                        <div>
                            <h1
                                className="font-heading font-bold text-2xl"
                                style={{ color: "var(--color-navy-900)" }}
                            >
                                Health Timeline
                            </h1>
                            <p className="text-sm" style={{ color: "var(--color-medical-muted)" }}>
                                Your complete health history in chronological order
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Tab Switcher */}
                <div
                    className="flex items-center gap-1 p-1 rounded-xl mb-6 w-fit"
                    style={{ backgroundColor: "var(--color-medical-border)" }}
                >
                    {[
                        { id: "timeline", label: "Timeline", icon: Clock },
                        { id: "trends", label: "Trends", icon: BarChart2 },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as "timeline" | "trends")}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium",
                                    "transition-all duration-200"
                                )}
                                style={{
                                    backgroundColor:
                                        activeTab === tab.id ? "white" : "transparent",
                                    color:
                                        activeTab === tab.id
                                            ? "var(--color-navy-900)"
                                            : "var(--color-medical-muted)",
                                    boxShadow:
                                        activeTab === tab.id
                                            ? "0 1px 3px rgba(0,0,0,0.1)"
                                            : "none",
                                }}
                            >
                                <Icon size={15} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {activeTab === "timeline" ? (
                    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                        {/* Filters Sidebar */}
                        <div className="space-y-4">
                            <TimelineFilters
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onReset={handleReset}
                            />

                            {/* Quick Stats */}
                            {stats && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-xl border p-4 space-y-3"
                                    style={{ borderColor: "var(--color-medical-border)" }}
                                >
                                    <h3 className="text-sm font-semibold" style={{ color: "var(--color-navy-900)" }}>
                                        Quick Stats
                                    </h3>
                                    {[
                                        { label: "Total Entries", value: stats.totalEntries },
                                        {
                                            label: "Avg Severity",
                                            value: `${stats.averageSeverity.toFixed(1)}/10`,
                                        },
                                        {
                                            label: "Most Affected",
                                            value: stats.mostAffectedPart || "N/A",
                                        },
                                    ].map((stat) => (
                                        <div key={stat.label} className="flex items-center justify-between">
                                            <span className="text-xs" style={{ color: "var(--color-medical-muted)" }}>
                                                {stat.label}
                                            </span>
                                            <span className="text-sm font-semibold" style={{ color: "var(--color-navy-900)" }}>
                                                {stat.value}
                                            </span>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </div>

                        {/* Timeline */}
                        <TimelineView
                            entries={entries}
                            isLoading={isLoading}
                            total={total}
                            page={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                ) : (
                    /* Trends Tab */
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl border p-6"
                        style={{ borderColor: "var(--color-medical-border)" }}
                    >
                        {isLoadingStats ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin w-8 h-8 border-2 border-t-transparent rounded-full"
                                    style={{ borderColor: "var(--color-navy-900)", borderTopColor: "transparent" }}
                                />
                            </div>
                        ) : stats ? (
                            <SeverityTrend stats={stats} />
                        ) : (
                            <p className="text-center py-10 text-sm" style={{ color: "var(--color-medical-muted)" }}>
                                No trend data available yet
                            </p>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default TimelinePage;