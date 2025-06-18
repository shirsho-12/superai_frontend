
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Status-related utilities
export const getStatusBadgeClass = (status: string): string => {
  switch (status.toLowerCase()) {
    case "new":
      return "status-badge-new";
    case "analysis in progress":
      return "status-badge-progress";
    case "gaps identified":
      return "status-badge-gaps";
    case "completed":
      return "status-badge-completed";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getSeverityBadgeClass = (severity: string): string => {
  switch (severity.toLowerCase()) {
    case "high":
      return "severity-badge-high";
    case "medium":
      return "severity-badge-medium";
    case "low":
      return "severity-badge-low";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getPriorityBorderClass = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case "urgent":
      return "compliance-card-priority-urgent";
    case "high":
      return "compliance-card-priority-high";
    case "medium":
      return "compliance-card-priority-medium";
    case "low":
      return "compliance-card-priority-low";
    default:
      return "border-l-4 border-l-gray-300";
  }
};

// Date utilities
export const calculateDaysUntilDate = (targetDate: string): number => {
  const today = new Date();
  const target = new Date(targetDate);
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

// Analytics utilities
export const calculateCompletionRate = (completed: number, total: number): number => {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
};

export const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 0.9) return "text-green-600";
  if (confidence >= 0.7) return "text-yellow-600";
  return "text-red-600";
};

// Action utilities
export const getActionIcon = (action: string) => {
  // This function returns the appropriate icon class based on action type
  const iconMap: Record<string, string> = {
    "GAP_ACKNOWLEDGED": "check-circle",
    "GAP_DETECTED": "alert-triangle",
    "AMENDMENT_APPROVED": "check-circle",
    "AMENDMENT_REJECTED": "x-circle",
    "TASK_ASSIGNED": "user-plus",
    "REPORT_GENERATED": "file-text",
  };
  
  return iconMap[action] || "activity";
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Role-based access utilities
export const hasPermission = (userRole: string, requiredPermission: string): boolean => {
  const rolePermissions: Record<string, string[]> = {
    "admin": ["*"],
    "chief_compliance_officer": ["view_all", "approve_amendments", "manage_users", "generate_reports"],
    "senior_analyst": ["view_assigned", "analyze_gaps", "create_amendments", "assign_tasks"],
    "junior_analyst": ["view_assigned", "analyze_gaps"],
    "viewer": ["view_assigned"]
  };
  
  const permissions = rolePermissions[userRole.toLowerCase()] || [];
  return permissions.includes("*") || permissions.includes(requiredPermission);
};
