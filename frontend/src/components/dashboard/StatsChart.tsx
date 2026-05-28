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
    const severityData = stats.severityStats.map((item) => ({
        name: capitalize(item._id ?? "unknown"),
        value: item.count,
        color: SEVERITY_COLORS[item._id as keyof typeof SEVERITY_COLORS] ?? "#CBD5E1",
    }));

    const bodyPartData = stats.bodyPartStats.map((item) => ({
        name: item._id,
        count: item.count,
    }));

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-panel p-3 border-white/60 shadow-luxe backdrop-blur-xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                        Diagnostic Data
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <p className="text-sm font-black text-navy-900 tracking-tight">
                            {label || payload[0].name}: <span className="text-emerald-600">{payload[0].value}</span>
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Severity Distribution — Elite Pulse */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-8 relative overflow-hidden"
            >
                <div className="flex flex-col mb-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-1">
                        Statistical Analysis
                    </span>
                    <h3 className="text-xl font-black text-navy-900 tracking-tighter">
                        SEVERITY MATRIX<span className="text-emerald-500">.</span>
                    </h3>
                </div>

                {severityData.length === 0 ? (
                    <div className="flex items-center justify-center h-[280px] text-[10px] font-bold uppercase tracking-widest text-slate-300">
                        Zero Data Points Identified
                    </div>
                ) : (
                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={severityData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {severityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} opacity={0.9} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    content={({ payload }) => (
                                        <div className="flex justify-center gap-6 mt-4">
                                            {payload?.map((entry: any, index: number) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <div 
                                                        className="w-2 h-2 rounded-full" 
                                                        style={{ backgroundColor: entry.color }}
                                                    />
                                                    <span className="text-[10px] font-black uppercase tracking-tighter text-slate-500">
                                                        {entry.value}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </motion.div>

            {/* Body Part Frequency — Tactical Bar */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="glass-panel p-8"
            >
                <div className="flex flex-col mb-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-1">
                        Anatomical Trends
                    </span>
                    <h3 className="text-xl font-black text-navy-900 tracking-tighter">
                        HOTSPOT FREQUENCY<span className="text-emerald-500">.</span>
                    </h3>
                </div>

                {bodyPartData.length === 0 ? (
                    <div className="flex items-center justify-center h-[280px] text-[10px] font-bold uppercase tracking-widest text-slate-300">
                        Zero Data Points Identified
                    </div>
                ) : (
                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={bodyPartData}
                                margin={{ top: 20, right: 30, left: -20, bottom: 0 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="4 4"
                                    stroke="#F1F5F9"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 10, fontWeight: 900, fill: "#94A3B8" }}
                                    axisLine={false}
                                    tickLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    tick={{ fontSize: 10, fontWeight: 900, fill: "#94A3B8" }}
                                    axisLine={false}
                                    tickLine={false}
                                    allowDecimals={false}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                                <Bar
                                    dataKey="count"
                                    fill="#1E3A5F"
                                    radius={[8, 8, 0, 0]}
                                    maxBarSize={40}
                                >
                                    {bodyPartData.map((_, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={index === 0 ? "#10B981" : "#1E3A5F"} 
                                            fillOpacity={0.9}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default StatsChart;