import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface SmoothRevealProps {
    children: ReactNode;
    delay?: number;
    className?: string;
    direction?: "up" | "down" | "left" | "right" | "none";
}

const directionOffset = {
    up: { y: 24 },
    down: { y: -24 },
    left: { x: -24 },
    right: { x: 24 },
    none: {},
};

const SmoothReveal = ({
    children,
    delay = 0,
    className,
    direction = "up",
}: SmoothRevealProps) => {
    const offset = directionOffset[direction];

    return (
        <motion.div
            initial={{ opacity: 0, ...offset }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
                duration: 0.6,
                delay,
                ease: [0.16, 1, 0.3, 1],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default SmoothReveal;
