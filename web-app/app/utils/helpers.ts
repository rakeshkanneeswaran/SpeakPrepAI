import platformColors from "@/app/utils/colors";

export const getAccentColor = (
    type: "primary" | "success" | "warning" | "error" = "primary"
) => {
    switch (type) {
        case "success":
            return "#10b981";
        case "warning":
            return "#f59e0b";
        case "error":
            return "#ef4444";
        default:
            return platformColors.borderColor;
    }
};

export const getRatingColor = (rating: string) => {
    switch (rating.toLowerCase()) {
        case "excellent":
            return "text-green-600";
        case "good":
            return "text-blue-600";
        case "average":
            return "text-yellow-600";
        case "poor":
            return "text-red-600";
        default:
            return "text-gray-600";
    }
};
