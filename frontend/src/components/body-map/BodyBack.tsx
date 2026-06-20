import { motion } from "framer-motion";
import type { SelectedBodyPart } from "../../types";

interface BodyBackProps {
    selectedParts: SelectedBodyPart[];
    onPartSelect: (part: SelectedBodyPart) => void;
}

interface BodyPartPath {
    id: string;
    name: string;
    d: string;
}

const bodyParts: BodyPartPath[] = [
    // --- Head Area ---
    { id: "occipital-back", name: "Back of Head (Occipital)", d: "M100,5 C85,5 75,18 75,35 C75,55 85,68 100,68 C115,68 125,55 125,35 C125,18 115,5 100,5 Z" },

    // --- Neck ---
    { id: "neck-back", name: "Back of Neck", d: "M90,68 L110,68 L108,82 L92,82 Z" },

    // --- Back ---
    { id: "shoulder-right-back", name: "Right Shoulder (Back)", d: "M40,110 C50,105 60,110 65,115 L50,135 C40,130 35,120 40,110 Z" },
    { id: "shoulder-left-back", name: "Left Shoulder (Back)", d: "M160,110 C150,105 140,110 135,115 L150,135 C160,130 165,120 160,110 Z" },
    { id: "back-upper-right", name: "Right Upper Back", d: "M65,115 C80,110 100,110 100,115 L100,160 L65,160 Z" },
    { id: "back-upper-left", name: "Left Upper Back", d: "M135,115 C120,110 100,110 100,115 L100,160 L135,160 Z" },
    { id: "back-middle-right", name: "Right Middle Back", d: "M65,160 L100,160 L100,210 L65,210 Z" },
    { id: "back-middle-left", name: "Left Middle Back", d: "M135,160 L100,160 L100,210 L135,210 Z" },
    { id: "back-lower-right", name: "Right Lower Back/Flank", d: "M65,210 L100,210 L100,260 L65,260 Z" },
    { id: "back-lower-left", name: "Left Lower Back/Flank", d: "M135,210 L100,210 L100,260 L135,260 Z" },
    { id: "buttock-right", name: "Right Buttock", d: "M65,260 C65,300 100,310 100,260 Z" },
    { id: "buttock-left", name: "Left Buttock", d: "M135,260 C135,300 100,310 100,260 Z" },

    // --- Arms ---
    { id: "elbow-right-back", name: "Right Elbow (Back)", d: "M48,185 L62,185 L62,205 L48,205 Z" },
    { id: "elbow-left-back", name: "Left Elbow (Back)", d: "M152,185 L138,185 L138,205 L152,205 Z" },

    // --- Legs ---
    { id: "hamstring-right", name: "Right Hamstring", d: "M65,310 L100,310 L100,410 L68,410 Z" },
    { id: "hamstring-left", name: "Left Hamstring", d: "M135,310 L100,310 L100,410 L132,410 Z" },
    { id: "calf-right", name: "Right Calf", d: "M70,440 L95,440 L95,520 L75,520 Z" },
    { id: "calf-left", name: "Left Calf", d: "M130,440 L105,440 L105,520 L125,520 Z" },
    { id: "heel-right", name: "Right Heel", d: "M75,520 L100,520 L100,550 L75,550 Z" },
    { id: "heel-left", name: "Left Heel", d: "M125,520 L100,520 L100,550 L125,550 Z" },
];

const BodyBack = ({ selectedParts, onPartSelect }: BodyBackProps) => {
    const handlePartClick = (part: BodyPartPath) => {
        onPartSelect({
            id: part.id,
            name: part.name,
            side: "back",
        });
    };

    const isSelected = (partId: string) => selectedParts.some((p) => p.id === partId);

    return (
        <svg
            viewBox="0 0 200 570"
            className="w-full h-full drop-shadow-sm"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-labelledby="bodyBackTitle bodyBackDesc"
            data-testid="body-back-svg"  // ADDED
        >
            <title id="bodyBackTitle">Posterior human body map</title>
            <desc id="bodyBackDesc">Interactive posterior view of a stylized human body for selecting regions.</desc>
            <defs>
                <linearGradient id="bodyGradientBack" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#f0fdf4" />
                </linearGradient>
            </defs>

            {/* Detailed Body Outline Background */}
            <path
                d="M100,2 C80,2 70,18 70,35 C70,50 78,65 88,72 L88,85 L60,105 C40,105 30,120 30,150 L30,220 C30,240 35,260 50,270 L50,300 C45,340 55,420 65,420 L68,520 L60,540 L60,560 L140,560 L140,540 L132,520 L135,420 C145,420 155,340 150,300 L150,270 C165,260 170,240 170,220 L170,150 C170,120 160,105 140,105 L112,85 L112,72 C122,65 130,50 130,35 C130,18 120,2 100,2 Z"
                fill="url(#bodyGradientBack)"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-50"
            />

            {/* Subtle posterior anatomical details (spine, scapula, sacrum, gluteal fold) */}
            <g className="anatomy-details-back" fill="none" stroke="#065f46" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.18">
                {/* Spine centerline */}
                <path d="M100,90 L100,240" />

                {/* Vertebrae markers */}
                <circle cx="100" cy="110" r="1.2" />
                <circle cx="100" cy="130" r="1.2" />
                <circle cx="100" cy="150" r="1.2" />
                <circle cx="100" cy="170" r="1.2" />
                <circle cx="100" cy="190" r="1.2" />

                {/* Scapula outlines (suggestive) */}
                <path d="M70,110 C86,102 94,118 100,122" />
                <path d="M130,110 C114,102 106,118 100,122" />

                {/* Sacrum / gluteal fold */}
                <path d="M90,240 C95,250 105,250 110,240" />
                <path d="M75,270 C90,260 110,260 125,270" />
            </g>

            {/* Interactive body parts */}
            {bodyParts.map((part) => (
                <motion.path
                    key={part.id}
                    d={part.d}
                    data-testid={`body-part-${part.id}`}  // ADDED
                    fill={isSelected(part.id) ? "#10b981" : "transparent"}
                    stroke={isSelected(part.id) ? "#065f46" : "#059669"}
                    strokeWidth={isSelected(part.id) ? "1.5" : "0.5"}
                    strokeDasharray={isSelected(part.id) ? "0" : "2,2"}
                    className="cursor-pointer transition-all duration-300"
                    whileHover={{
                        fill: isSelected(part.id) ? "#10b981" : "rgba(16, 185, 129, 0.15)",
                        strokeWidth: 1.5,
                        strokeDasharray: "0"
                    }}
                    onClick={() => handlePartClick(part)}
                />
            ))}
        </svg>
    );
};

export default BodyBack;