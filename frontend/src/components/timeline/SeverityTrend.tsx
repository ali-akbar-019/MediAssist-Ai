import React, { useMemo } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { TimelineEntry, TimelineStats } from "../../types";
import { formatDateShort, getSeverityFromScore, cn } from "../../lib/utils";

interface SeverityTrendProps {
    entries: TimelineEntry[];
    stats: TimelineStats;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const entry = payload[0].payload;
        const severityLabel = getSeverityFromScore(entry.severity);
        
        return (
            <div className="glass-panel p-4 rounded-2xl border-white/20 shadow-luxe ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <div className="flex items-center gap-3">
                    <div className="text-2xl font-black text-navy-900">{entry.severity}</div>
                    <div className="flex flex-col">
                        <span className="text-xs font-black uppercase" style={{ color: payload[0].stroke }}>{severityLabel}</span>
                        <span className="text-[10px] text-slate-500 font-medium">{entry.bodyPart} reflection</span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

const SeverityTrend = ({ entries, stats }: SeverityTrendProps) => {
    const chartData = useMemo(() => {
        return [...entries]
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            .map((entry) => ({
                date: entry.createdAt,
                formattedDate: formatDateShort(entry.createdAt),
                severity: entry.severity,
                bodyPart: entry.bodyPart,
            }));
    }, [entries]);

    const trend = useMemo(() => {
        if (chartData.length < 2) return 0;
        const first = chartData[0].severity;
        const last = chartData[chartData.length - 1].severity;
        return last - first;
    }, [chartData]);

    const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
    const trendColor = trend > 0 ? "#EF4444" : trend < 0 ? "#10B981" : "#94A3B8";
    const trendLabel = trend > 0 ? "Worsening trend" : trend < 0 ? "Improving trend" : "Stable intensity";

    return (
        <div className="glass-panel rounded-[2rem] p-8 border-white/20 shadow-luxe ring-1 ring-black/5 overflow-hidden relative">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full -mr-32 -mt-32" />

            <div className="flex items-center justify-between mb-10 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shadow-inner">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-navy-900 tracking-tight">Intensity Analytics</h3>
                        <p className="text-xs text-slate-400 font-medium tracking-wide">Dynamic severity evolution over time</p>
                    </div>
                </div>
                
                {chartData.length >= 2 && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-100 bg-white/50 backdrop-blur-sm shadow-sm" style={{ color: trendColor }}>
                        <TrendIcon size={16} />
                        <span className="text-xs font-black uppercase tracking-wider">{trendLabel}</span>
                    </div>
                )}
            </div>

            <div className="h-[350px] w-full -ml-4 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorSeverity" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis
                            dataKey="formattedDate"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fontWeight: 700, fill: "#94A3B8" }}
                            dy={15}
                        />
                        <YAxis
                            domain={[0, 10]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fontWeight: 700, fill: "#94A3B8" }}
                            ticks={[0, 2, 4, 6, 8, 10]}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#10B981', strokeWidth: 2, strokeDasharray: '5 5' }} />
                        <Area
                            type="monotone"
                            dataKey="severity"
                            stroke="#10B981"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorSeverity)"
                            animationDuration={2000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                {[
                    { label: "Mild Baseline", score: "0-2", color: "#10B981", active: stats.severityDistribution.mild > 0 },
                    { label: "Moderate Alert", score: "3-5", color: "#F59E0B", active: stats.severityDistribution.moderate > 0 },
                    { label: "Critical Range", score: "6-8", color: "#EF4444", active: stats.severityDistribution.severe > 0 },
                    { label: "Clinical Emergency", score: "9-10", color: "#7C3AED", active: stats.severityDistribution.emergency > 0 },
                ].map((range) => (
                    <div 
                        key={range.label} 
                        className={cn(
                            "p-4 rounded-3xl border transition-all duration-500 flex flex-col gap-1",
                            range.active ? "bg-white border-slate-100 shadow-sm" : "bg-slate-50/50 border-transparent opacity-40 grayscale"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: range.color }} />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{range.label}</span>
                        </div>
                        <p className="text-sm font-black text-navy-900">{range.score} Intensity</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SeverityTrend;