import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import {
    CartesianGrid,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type { TimelineStats } from "../../types";

interface SeverityTrendProps {
    stats: TimelineStats;
}

const CustomTooltip = ({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: Array<{ value: number; payload: { bodyPart: string } }>;
    label?: string;
}) => {
    if (active && payload && payload.length) {
        const severity = payload[0].value;
        const bodyPart = payload[0].payload.bodyPart;
        const getSeverityLabel = (s: number) => {
            if (s <= 3) return { label: "Mild", color: "#10B981" };
            if (s <= 5) return { label: "Moderate", color: "#F59E0B" };
            if (s <= 8) return { label: "Severe", color: "#EF4444" };
            return { label: "Emergency", color: "#7C3AED" };
        };
        const { label: sevLabel, color } = getSeverityLabel(severity);

        return (
            <div className="bg-white border rounded-xl px-3 py-2 shadow-lg"
                style={{ borderColor: "var(--color-medical-border)" }}>
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p className="text-sm font-semibold" style={{ color: "var(--color-navy-900)" }}>
                    {bodyPart}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-sm font-bold" style={{ color }}>
                        {severity}/10
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                        style={{ color, backgroundColor: `${color}20` }}>
                        {sevLabel}
                    </span>
                </div>
            </div>
        );
    }
    return null;
};

const SeverityTrend = ({ stats }: SeverityTrendProps) => {
    const data = stats.severityTrend.map((item) => ({
        ...item,
        date: new Date(item.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        }),
    }));

    const trend =
        data.length >= 2
            ? data[data.length - 1].severity - data[0].severity
            : 0;

    const TrendIcon =
        trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
    const trendColor =
        trend > 0 ? "#EF4444" : trend < 0 ? "#10B981" : "#64748B";
    const trendLabel =
        trend > 0 ? "Worsening" : trend < 0 ? "Improving" : "Stable";

    const severityDist = stats.severityDistribution;

    return (
        <div className="space-y-4">
            {/* Trend Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h3 className="font-semibold text-base" style={{ color: "var(--color-navy-900)" }}>
                        Severity Trend
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-medical-muted)" }}>
                        Pain severity over time
                    </p>
                </div>
                {data.length >= 2 && (
                    <div
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
                        style={{ backgroundColor: `${trendColor}15`, color: trendColor }}
                    >
                        <TrendIcon size={14} />
                        {trendLabel}
                    </div>
                )}
            </div>

            {/* Line Chart */}
            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 10, fill: "#64748B" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            domain={[0, 10]}
                            tick={{ fontSize: 10, fill: "#64748B" }}
                            axisLine={false}
                            tickLine={false}
                            ticks={[0, 3, 5, 8, 10]}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine y={3} stroke="#10B981" strokeDasharray="4 4" strokeOpacity={0.5} />
                        <ReferenceLine y={5} stroke="#F59E0B" strokeDasharray="4 4" strokeOpacity={0.5} />
                        <ReferenceLine y={8} stroke="#EF4444" strokeDasharray="4 4" strokeOpacity={0.5} />
                        <Line
                            type="monotone"
                            dataKey="severity"
                            stroke="var(--color-navy-900)"
                            strokeWidth={2.5}
                            dot={{ fill: "var(--color-navy-900)", strokeWidth: 0, r: 4 }}
                            activeDot={{ r: 6, fill: "var(--color-emerald-500)" }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-40 rounded-xl border border-dashed"
                    style={{ borderColor: "var(--color-medical-border)" }}>
                    <p className="text-sm" style={{ color: "var(--color-medical-muted)" }}>
                        Not enough data to show trend
                    </p>
                </div>
            )}

            {/* Severity Distribution */}
            <div className="grid grid-cols-4 gap-2">
                {[
                    { label: "Mild", count: severityDist.mild, color: "#10B981" },
                    { label: "Moderate", count: severityDist.moderate, color: "#F59E0B" },
                    { label: "Severe", count: severityDist.severe, color: "#EF4444" },
                    { label: "Emergency", count: severityDist.emergency, color: "#7C3AED" },
                ].map((item) => (
                    <div
                        key={item.label}
                        className="flex flex-col items-center p-3 rounded-xl border"
                        style={{
                            borderColor: `${item.color}30`,
                            backgroundColor: `${item.color}08`,
                        }}
                    >
                        <span className="text-xl font-bold" style={{ color: item.color }}>
                            {item.count}
                        </span>
                        <span className="text-xs mt-0.5" style={{ color: "var(--color-medical-muted)" }}>
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SeverityTrend;