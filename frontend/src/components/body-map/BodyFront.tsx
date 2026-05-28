import type { SelectedBodyPart } from "../../types";
import { motion } from "framer-motion";

interface BodyFrontProps {
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
    { id: "forehead-front", name: "Forehead", d: "M85,5 C95,2 105,2 115,5 C115,12 85,12 85,5 Z" },
    { id: "eye-right-front", name: "Right Eye", d: "M82,20 C85,18 90,18 93,20 C90,22 85,22 82,20 Z" },
    { id: "eye-left-front", name: "Left Eye", d: "M107,20 C110,18 115,18 118,20 C115,22 110,22 107,20 Z" },
    { id: "nose-front", name: "Nose", d: "M97,20 L103,20 L100,35 Z" },
    { id: "mouth-front", name: "Mouth", d: "M92,45 C95,48 105,48 108,45 C105,42 95,42 92,45 Z" },
    { id: "jaw-front", name: "Jaw/Chin", d: "M80,40 C80,60 100,68 120,40 C115,62 85,62 80,40 Z" },
    { id: "ear-right-front", name: "Right Ear", d: "M75,25 C72,25 70,30 70,35 C70,40 72,45 75,45 Z" },
    { id: "ear-left-front", name: "Left Ear", d: "M125,25 C128,25 130,30 130,35 C130,40 128,45 125,45 Z" },

    // --- Neck ---
    { id: "neck-front", name: "Neck", d: "M90,68 L110,68 L108,82 L92,82 Z" },

    // --- Torso ---
    { id: "shoulder-right-front", name: "Right Shoulder", d: "M40,110 C50,105 60,110 65,115 L50,135 C40,130 35,120 40,110 Z" },
    { id: "shoulder-left-front", name: "Left Shoulder", d: "M160,110 C150,105 140,110 135,115 L150,135 C160,130 165,120 160,110 Z" },
    { id: "chest-upper-right", name: "Right Upper Chest", d: "M65,115 C80,110 100,110 100,115 L100,150 L65,150 Z" },
    { id: "chest-upper-left", name: "Left Upper Chest", d: "M135,115 C120,110 100,110 100,115 L100,150 L135,150 Z" },
    { id: "chest-lower-right", name: "Right Lower Chest", d: "M65,150 L100,150 L100,190 L65,190 Z" },
    { id: "chest-lower-left", name: "Left Lower Chest", d: "M135,150 L100,150 L100,190 L135,190 Z" },
    { id: "abdomen-upper", name: "Upper Abdomen", d: "M70,190 L130,190 L130,230 L70,230 Z" },
    { id: "abdomen-lower", name: "Lower Abdomen", d: "M70,230 L130,230 L130,270 L70,270 Z" },
    { id: "pelvic-front", name: "Pelvic Region", d: "M70,270 C80,310 120,310 130,270 L70,270 Z" },

    // --- Arms ---
    { id: "arm-upper-right", name: "Right Upper Arm", d: "M50,135 L65,135 L62,185 L48,185 Z" },
    { id: "arm-upper-left", name: "Left Upper Arm", d: "M150,135 L135,135 L138,185 L152,185 Z" },
    { id: "elbow-right", name: "Right Elbow", d: "M48,185 L62,185 L62,205 L48,205 Z" },
    { id: "elbow-left", name: "Left Elbow", d: "M152,185 L138,185 L138,205 L152,205 Z" },
    { id: "forearm-right", name: "Right Forearm", d: "M48,205 L62,205 L60,260 L50,260 Z" },
    { id: "forearm-left", name: "Left Forearm", d: "M152,205 L138,205 L140,260 L150,260 Z" },
    { id: "wrist-right", name: "Right Wrist", d: "M50,260 L60,260 L60,275 L50,275 Z" },
    { id: "wrist-left", name: "Left Wrist", d: "M150,260 L140,260 L140,275 L150,275 Z" },
    { id: "hand-right", name: "Right Hand", d: "M45,275 C45,290 65,290 65,275 L45,275 Z" },
    { id: "hand-left", name: "Left Hand", d: "M155,275 C155,290 135,290 135,275 L155,275 Z" },

    // --- Legs ---
    { id: "hip-right", name: "Right Hip", d: "M60,300 C60,320 75,330 85,320 L75,300 Z" },
    { id: "hip-left", name: "Left Hip", d: "M140,300 C140,320 125,330 115,320 L125,300 Z" },
    { id: "thigh-right", name: "Right Thigh", d: "M65,320 L95,320 L95,410 L68,410 Z" },
    { id: "thigh-left", name: "Left Thigh", d: "M135,320 L105,320 L105,410 L132,410 Z" },
    { id: "knee-right", name: "Right Knee", d: "M68,410 L95,410 L95,440 L70,440 Z" },
    { id: "knee-left", name: "Left Knee", d: "M132,410 L105,410 L105,440 L130,440 Z" },
    { id: "leg-lower-right", name: "Right Shin", d: "M70,440 L95,440 L95,520 L75,520 Z" },
    { id: "leg-lower-left", name: "Left Shin", d: "M130,440 L105,440 L105,520 L125,520 Z" },
    { id: "ankle-right", name: "Right Ankle", d: "M75,520 L95,520 L95,535 L76,535 Z" },
    { id: "ankle-left", name: "Left Ankle", d: "M125,520 L105,520 L105,535 L124,535 Z" },
    { id: "foot-right", name: "Right Foot", d: "M76,535 L95,535 L95,560 L60,560 Z" },
    { id: "foot-left", name: "Left Foot", d: "M124,535 L105,535 L105,560 L140,560 Z" },
];

const BodyFront = ({ selectedParts, onPartSelect }: BodyFrontProps) => {
    const handlePartClick = (part: BodyPartPath) => {
        onPartSelect({
            id: part.id,
            name: part.name,
            side: "front",
        });
    };

    const isSelected = (partId: string) => selectedParts.some((p) => p.id === partId);

    return (
        <svg
            viewBox="0 0 200 570"
            className="w-full h-full drop-shadow-sm"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-labelledby="bodyFrontTitle bodyFrontDesc"
        >
            <title id="bodyFrontTitle">Anterior human body map</title>
            <desc id="bodyFrontDesc">Interactive anterior view of a stylized human body for selecting regions.</desc>
            <defs>
                <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#f0fdf4" />
                </linearGradient>
            </defs>

            {/* Detailed Body Outline Background */}
            <path
                d="M100,2 C80,2 70,18 70,35 C70,50 78,65 88,72 L88,85 L60,105 C40,105 30,120 30,150 L30,220 C30,240 35,260 50,270 L50,300 C45,340 55,420 65,420 L68,520 L60,540 L60,560 L140,560 L140,540 L132,520 L135,420 C145,420 155,340 150,300 L150,270 C165,260 170,240 170,220 L170,150 C170,120 160,105 140,105 L112,85 L112,72 C122,65 130,50 130,35 C130,18 120,2 100,2 Z"
                fill="url(#bodyGradient)"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-50"
            />

            {/* Subtle anatomical detail strokes (clavicle, ribs, sternum, navel, lungs/heart) */}
            <g className="anatomy-details" fill="none" stroke="#065f46" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.18">
                {/* Clavicles */}
                <path d="M70,92 C80,86 92,84 100,88" />
                <path d="M130,88 C108,84 120,86 130,92" />

                {/* Sternum */}
                <path d="M100,100 L100,148" />

                {/* Ribs (stylized arcs) */}
                <path d="M75,120 C90,112 110,112 125,120" />
                <path d="M70,135 C90,128 110,128 130,135" />

                {/* Lungs (suggestive shapes) */}
                <path d="M82,110 C90,100 106,100 114,110 C106,128 90,128 82,110 Z" />

                {/* Heart (small mark) */}
                <path d="M98,128 C96,126 95,124 96,122 C98,120 102,120 104,122 C105,124 104,126 102,128 C100,130 99,129 98,128 Z" fill="#10b981" opacity="0.85" />

                {/* Navel */}
                <circle cx="100" cy="205" r="2" fill="#065f46" opacity="0.22" />
            </g>

            {/* Interactive body parts */}
            {bodyParts.map((part) => (
                <motion.path
                    key={part.id}
                    d={part.d}
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

export default BodyFront;
