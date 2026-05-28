import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { getSeverityFromScore, getSeverityScoreColor } from "../../lib/utils";

interface SeveritySliderProps {
    value: number;
    onChange: (value: number) => void;
}

const SeveritySlider = ({ value, onChange }: SeveritySliderProps) => {
    const severity = getSeverityFromScore(value);
    const color = getSeverityScoreColor(value);

    const severityLabels = [
        { score: 1, label: "Very Mild" },
        { score: 3, label: "Mild" },
        { score: 5, label: "Moderate" },
        { score: 7, label: "Severe" },
        { score: 9, label: "Very Severe" },
        { score: 10, label: "Emergency" },
    ];

    return (
        <div className="space-y-4">
            {/* Score Display */}
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-medical-muted">
                    Pain Severity
                </span>
                <motion.div
                    key={value}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2"
                >
                    <span
                        className="text-2xl font-bold"
                        style={{ color }}
                    >
                        {value}
                    </span>
                    <span className="text-medical-muted text-sm">/10</span>
                    <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                        style={{
                            color,
                            backgroundColor: `${color}20`,
                        }}
                    >
                        {severity}
                    </span>
                </motion.div>
            </div>

            {/* Slider */}
            <div className="relative">
                <input
                    type="range"
                    min={1}
                    max={10}
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                        background: `linear-gradient(to right, ${color} 0%, ${color} ${(value - 1) * 11.11}%, #E2E8F0 ${(value - 1) * 11.11}%, #E2E8F0 100%)`,
                    }}
                />
            </div>

            {/* Scale Labels */}
            <div className="flex justify-between">
                {severityLabels.map((item) => (
                    <button
                        key={item.score}
                        onClick={() => onChange(item.score)}
                        className={cn(
                            "text-xs transition-colors",
                            value === item.score
                                ? "text-navy-900 font-semibold"
                                : "text-medical-muted hover:text-navy-900"
                        )}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Severity Bar */}
            <div className="flex gap-1">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((score) => (
                    <motion.button
                        key={score}
                        onClick={() => onChange(score)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 h-6 rounded-sm transition-all"
                        style={{
                            backgroundColor:
                                score <= value
                                    ? getSeverityScoreColor(score)
                                    : "#E2E8F0",
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default SeveritySlider;