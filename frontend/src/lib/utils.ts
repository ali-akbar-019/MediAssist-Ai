import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { SeverityLevel, Probability } from "../types/index";
import { SEVERITY_LABELS, PROBABILITY_LABELS } from "../constants";

// shadcn utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


// Format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Format date short (e.g., "Jan 23")
export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};


// Format date with time
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Format relative time
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
};

// Get severity info
export const getSeverityInfo = (severity: SeverityLevel | string) => {
  const info = {
    mild: { color: "#10B981", label: "Mild" },
    moderate: { color: "#F59E0B", label: "Moderate" },
    severe: { color: "#EF4444", label: "Severe" },
    emergency: { color: "#7C3AED", label: "Emergency" },
  };

  // fallback to existing SEVERITY_LABELS if available
  const fallback = typeof SEVERITY_LABELS !== "undefined"
    ? SEVERITY_LABELS[severity as SeverityLevel]
    : null;

  return info[severity as keyof typeof info] ??
    fallback ??
    { color: "#64748B", label: "Unknown" };
};

// Get severity from score
export const getSeverityFromScore = (score: number): SeverityLevel => {
  if (score <= 3) return "mild";
  if (score <= 5) return "moderate";
  if (score <= 8) return "severe";
  return "emergency";
};

// Get probability info
export const getProbabilityInfo = (probability: Probability) => {
  return PROBABILITY_LABELS[probability];
};

// Capitalize first letter
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Truncate text
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Check if emergency symptom
export const isEmergencySymptom = (symptom: string): boolean => {
  const emergencyKeywords = [
    "chest pain",
    "difficulty breathing",
    "shortness of breath",
    "severe bleeding",
    "loss of consciousness",
    "stroke",
    "heart attack",
    "anaphylaxis",
    "seizure",
  ];
  return emergencyKeywords.some((keyword) =>
    symptom.toLowerCase().includes(keyword)
  );
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Debounce function
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Get initials from name
export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

// Get color for severity score
export const getSeverityScoreColor = (score: number): string => {
  if (score <= 3) return "#10B981";
  if (score <= 5) return "#F59E0B";
  if (score <= 8) return "#EF4444";
  return "#7C3AED";
};

// Format duration
export const formatDuration = (duration: string, unit: string): string => {
  return `${duration} ${unit}`;
};

// Sleep utility
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Get greeting based on time
export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  if (hour < 21) return "Good Evening";
  return "Good Night";
};

// Parse error message from API
export const parseErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred";
};