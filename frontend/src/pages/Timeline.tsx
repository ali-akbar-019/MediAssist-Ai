import { motion } from "framer-motion";
import { BarChart2, Clock, Database, Thermometer, Target } from "lucide-react";
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

    const handleFilterChange = useCallback((newFilters: TimelineFilter) => {
        setFilters(newFilters);
        setPage(1);
    }, []);

    const handleReset = useCallback(() => {
        setFilters(DEFAULT_FILTERS);
        setPage(1);
    }, []);

    return (
        <div className="min-h-[calc(100vh-4rem)] pt-32 pb-20 bg-slate-50/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-6 mb-4">
                        <div className="w-16 h-16 rounded-3xl bg-navy-900 flex items-center justify-center shadow-navy relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <Clock size={32} className="text-emerald-400 relative z-10" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-navy-900 tracking-tight mb-2">
                                Health <span className="text-emerald-500 italic">Timeline</span>
                            </h1>
                            <p className="text-slate-500 font-medium tracking-wide">
                                A clinical record of your longitudinal diagnostic journey
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Tab Switcher */}
                <div className="flex items-center gap-1 p-1.5 rounded-[2rem] mb-12 w-fit bg-slate-100/30 border border-white/40 backdrop-blur-md shadow-inner">
                    {[
                        { id: "timeline", label: "History View", icon: Clock },
                        { id: "trends", label: "Intensity Analytics", icon: BarChart2 },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const active = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as "timeline" | "trends")}
                                className={cn(
                                    "flex items-center gap-2.5 px-8 py-3 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all duration-500 relative",
                                    active
                                        ? "text-navy-900"
                                        : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                {active && (
                                    <motion.div
                                        layoutId="active-tab"
                                        className="absolute inset-0 bg-white rounded-[1.5rem] shadow-sm border border-slate-200/50"
                                    />
                                )}
                                <Icon size={14} className={cn("relative z-10", active ? "text-emerald-500" : "text-slate-400")} />
                                <span className="relative z-10">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {activeTab === "timeline" ? (
                    <div className="space-y-10">
                        {/* full width filters */}
                        <TimelineFilters
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onReset={handleReset}
                        />

                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
                            {/* Timeline */}
                            <TimelineView
                                entries={entries}
                                isLoading={isLoading}
                                total={total}
                                page={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                            />

                            {/* Sidebar */}
                            <div className="space-y-8">
                                {/* Quick Stats */}
                                {stats && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="glass-panel rounded-[2rem] p-8 space-y-6 border-white/20 shadow-luxe ring-1 ring-black/5 relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] rotate-12">
                                            <BarChart2 size={120} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                                            <h3 className="text-[11px] font-black text-navy-900 uppercase tracking-[0.2em]">
                                                Core Insights
                    </h3>
                                        </div>
                                        <div className="space-y-4">
                                            {[
                                                { label: "Total Logs", value: stats.totalEntries, icon: Database },
                                                {
                                                    label: "Mean Intensity",
                                                    value: `${stats.averageSeverity.toFixed(1)}/10`,
                                                    icon: Thermometer
                                                },
                                                {
                                                    label: "Peak Vulnerability",
                                                    value: stats.mostAffectedPart || "None",
                                                    icon: Target
                                                },
                                            ].map((stat) => (
                                                <div key={stat.label} className="p-5 rounded-3xl bg-slate-50/50 border border-slate-100 flex items-center justify-between group hover:bg-white transition-all">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                                            {stat.label}
                                                        </span>
                                                        <span className="text-lg font-black text-navy-900">
                                                            {stat.value}
                                                        </span>
                                                    </div>
                                                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-slate-50 group-hover:scale-110 transition-transform">
                                                        <stat.icon size={20} className="text-emerald-500" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Trends Tab */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="animate-in fade-in duration-700"
                    >
                        {isLoadingStats ? (
                            <div className="flex items-center justify-center py-40 glass-panel rounded-[2rem]">
                                <div className="animate-spin w-10 h-10 border-[3px] border-emerald-500/20 border-t-emerald-500 rounded-full" />
                            </div>
                        ) : stats ? (
                            <SeverityTrend stats={stats} entries={entries} />
                        ) : (
                            <div className="glass-panel rounded-[2rem] p-20 text-center">
                                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
                                    Insufficient trend illumination
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default TimelinePage;