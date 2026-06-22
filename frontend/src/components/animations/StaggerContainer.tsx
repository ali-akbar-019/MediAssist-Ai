import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface StaggerContainerProps {
    children: ReactNode;
    className?: string;
    staggerDelay?: number;
}

const StaggerContainer = ({
    children,
    className,
    staggerDelay = 0.05,
}: StaggerContainerProps) => {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

const staggerItemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

export const StaggerItem = ({ children, className }: { children: ReactNode; className?: string }) => {
    return (
        <motion.div variants={staggerItemVariants} className={className}>
            {children}
        </motion.div>
    );
};

export default StaggerContainer;
