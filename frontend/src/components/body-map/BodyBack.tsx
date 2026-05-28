import { motion } from "framer-motion";
import type { SelectedBodyPart } from "../../types";

interface BodyBackProps {
    selectedPart: SelectedBodyPart | null;
    onPartSelect: (part: SelectedBodyPart) => void;
}

interface BodyPartPath {
    id: string;
    name: string;
    d: string;
}

const bodyParts: BodyPartPath[] = [
    {
        id: "head-back",
        name: "Head",
        d: "M100,20 C75,20 55,40 55,65 C55,90 75,110 100,110 C125,110 145,90 145,65 C145,40 125,20 100,20 Z",
    },
    {
        id: "neck-back",
        name: "Neck",
        d: "M85,110 L85,135 L115,135 L115,110 Z",
    },
    {
        id: "right-shoulder-back",
        name: "Right Shoulder",
        d: "M115,135 C130,130 155,130 165,145 C170,155 165,170 155,175 L135,165 L115,155 Z",
    },
    {
        id: "left-shoulder-back",
        name: "Left Shoulder",
        d: "M85,135 C70,130 45,130 35,145 C30,155 35,170 45,175 L65,165 L85,155 Z",
    },
    {
        id: "upper-back",
        name: "Upper Back",
        d: "M85,135 L85,200 L115,200 L115,135 Z",
    },
    {
        id: "right-arm-back",
        name: "Right Arm",
        d: "M155,175 C165,180 175,195 175,215 C175,230 170,245 160,250 L145,240 L140,210 L150,185 Z",
    },
    {
        id: "left-arm-back",
        name: "Left Arm",
        d: "M45,175 C35,180 25,195 25,215 C25,230 30,245 40,250 L55,240 L60,210 L50,185 Z",
    },
    {
        id: "right-forearm-back",
        name: "Right Forearm",
        d: "M160,250 C165,260 170,275 168,295 C166,310 158,320 150,322 L140,305 L138,275 L148,252 Z",
    },
    {
        id: "left-forearm-back",
        name: "Left Forearm",
        d: "M40,250 C35,260 30,275 32,295 C34,310 42,320 50,322 L60,305 L62,275 L52,252 Z",
    },
    {
        id: "right-hand-back",
        name: "Right Hand",
        d: "M148,322 C148,330 152,345 155,355 C158,362 162,365 160,370 C157,375 150,372 147,365 C145,372 138,375 136,368 C134,375 127,375 126,368 C124,373 118,372 118,365 C115,355 118,340 120,330 L135,322 Z",
    },
    {
        id: "left-hand-back",
        name: "Left Hand",
        d: "M52,322 C52,330 48,345 45,355 C42,362 38,365 40,370 C43,375 50,372 53,365 C55,372 62,375 64,368 C66,375 73,375 74,368 C76,373 82,372 82,365 C85,355 82,340 80,330 L65,322 Z",
    },
    {
        id: "lower-back",
        name: "Lower Back",
        d: "M85,200 L85,270 L115,270 L115,200 Z",
    },
    {
        id: "buttocks",
        name: "Buttocks",
        d: "M75,270 C70,280 68,295 70,310 C75,325 90,332 100,332 C110,332 125,325 130,310 C132,295 130,280 125,270 Z",
    },
    {
        id: "right-thigh-back",
        name: "Right Thigh",
        d: "M105,332 L110,332 L118,400 L105,408 L95,400 Z",
    },
    {
        id: "left-thigh-back",
        name: "Left Thigh",
        d: "M95,332 L90,332 L82,400 L95,408 L105,400 Z",
    },
    {
        id: "right-knee-back",
        name: "Right Knee",
        d: "M105,408 C112,408 118,415 118,425 C118,435 112,442 105,442 C98,442 92,435 92,425 C92,415 98,408 105,408 Z",
    },
    {
        id: "left-knee-back",
        name: "Left Knee",
        d: "M95,408 C88,408 82,415 82,425 C82,435 88,442 95,442 C102,442 108,435 108,425 C108,415 102,408 95,408 Z",
    },
    {
        id: "right-calf",
        name: "Right Calf",
        d: "M105,442 L110,442 L112,510 L98,510 L92,442 Z",
    },
    {
        id: "left-calf",
        name: "Left Calf",
        d: "M95,442 L90,442 L88,510 L102,510 L108,442 Z",
    },
    {
        id: "right-foot-back",
        name: "Right Foot",
        d: "M98,510 L112,510 L118,525 L118,535 C118,540 112,545 105,545 C98,545 92,542 90,537 L90,525 Z",
    },
    {
        id: "left-foot-back",
        name: "Left Foot",
        d: "M102,510 L88,510 L82,525 L82,535 C82,540 88,545 95,545 C102,545 108,542 110,537 L110,525 Z",
    },
];

const BodyBack = ({ selectedPart, onPartSelect }: BodyBackProps) => {
    const handlePartClick = (part: BodyPartPath) => {
        onPartSelect({
            id: part.id,
            name: part.name,
            side: "back",
        });
    };

    const isSelected = (partId: string) => selectedPart?.id === partId;

    return (
        <svg
            viewBox="0 0 200 570"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Body outline background */}
            <ellipse cx="100" cy="65" rx="48" ry="47" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />
            <rect x="84" y="110" width="32" height="28" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />
            <path d="M84,135 L60,145 L45,175 L55,240 L65,240 L75,175 L84,155 Z" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />
            <path d="M116,135 L140,145 L155,175 L145,240 L135,240 L125,175 L116,155 Z" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />
            <rect x="84" y="135" width="32" height="200" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />
            <path d="M84,330 L72,400 L72,450 L88,450 L92,400 L100,340 L108,400 L112,450 L128,450 L128,400 L116,330 Z" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />
            <rect x="72" y="450" width="16" height="65" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />
            <rect x="112" y="450" width="16" height="65" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />

            {/* Interactive body parts */}
            {bodyParts.map((part) => (
                <motion.path
                    key={part.id}
                    d={part.d}
                    fill={isSelected(part.id) ? "#1E3A5F" : "transparent"}
                    stroke={isSelected(part.id) ? "#1E3A5F" : "transparent"}
                    strokeWidth="1"
                    className="cursor-pointer"
                    whileHover={{ fill: isSelected(part.id) ? "#1E3A5F" : "#1E3A5F33" }}
                    onClick={() => handlePartClick(part)}
                />
            ))}
        </svg>
    );
};

export default BodyBack;