import { motion } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import type { SymptomStats } from "../../types";
import { capitalize } from "../../lib/utils";

interface StatsChartProps {
    stats: SymptomStats;
}

const SEVERITY_COLORS = {
    mild: "#10B981",
    moderate: "#F59E0B",
    severe: "#EF4444",
    emergency: "#7C3AED",
};

const StatsChart = ({ stats }: StatsChartProps) => {
    // Format severity data for pie chart
    const severityData = stats.severityStats.map((item) => ({
        name: capitalize(item._id ?? "unknown"),
        value: item.count,
        color:
            SEVERITY_COLORS[item._id as keyof typeof SEVERITY_COLORS] ?? "#94A3B8",
    }));

    // Format body part data for bar chart
    const bodyPartData = stats.bodyPartStats.map((item) => ({
        name: item._id,
        count: item.count,
    }));

    const CustomTooltip = ({
        active,
        payload,
        label,
    }: {
        active?: boolean;
        payload?: Array<{ value: number; name: string }>;
        label?: string;
    }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border border-medical-border rounded-xl px-3 py-2 shadow-card">
                    <p className="text-xs font-medium text-navy-900">{label}</p>
                    <p className="text-sm font-bold text-navy-900">
                        {payload[0].value}{" "}
                        <span className="text-xs font-normal text-medical-muted">
                            {payload[0].value === 1 ? "case" : "cases"}
                        </span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Severity Distribution — Pie Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="medical-card p-5"
            >
                <h3 className="text-sm font-semibold text-navy-900 mb-4">
                    Severity Distribution
                </h3>
                {severityData.length === 0 ? (
                    <div className="flex items-center justify-center h-48 text-medical-muted text-sm">
                        No data available
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie
                                data={severityData}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={85}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {severityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload as {
                                            name: string;
                                            value: number;
                                            color: string;
                                        };
                                        return (
                                            <div className="bg-white border border-medical-border rounded-xl px-3 py-2 shadow-card">
                                                <p className="text-xs font-medium text-navy-900">
                                                    {data.name}
                                                </p>
                                                <p className="text-sm font-bold text-navy-900">
                                                    {data.value}{" "}
                                                    <span className="text-xs font-normal text-medical-muted">
                                                        {data.value === 1 ? "case" : "cases"}
                                                    </span>
                                                </p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Legend
                                formatter={(value) => (
                                    <span className="text-xs text-medical-muted">{value}</span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </motion.div>

            {/* Body Part Frequency — Bar Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="medical-card p-5"
            >
                <h3 className="text-sm font-semibold text-navy-900 mb-4">
                    Most Affected Body Parts
                </h3>
                {bodyPartData.length === 0 ? (
                    <div className="flex items-center justify-center h-48 text-medical-muted text-sm">
                        No data available
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart
                            data={bodyPartData}
                            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#E2E8F0"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 11, fill: "#64748B" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 11, fill: "#64748B" }}
                                axisLine={false}
                                tickLine={false}
                                allowDecimals={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar
                                dataKey="count"
                                fill="#1E3A5F"
                                radius={[6, 6, 0, 0]}
                                maxBarSize={48}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </motion.div>
        </div>
    );
};

export default StatsChart;