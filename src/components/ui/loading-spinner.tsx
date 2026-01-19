import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
    /** Size of the spinner: sm (16px), md (32px), lg (48px), xl (64px) */
    size?: "sm" | "md" | "lg" | "xl";
    /** Additional CSS classes */
    className?: string;
    /** Whether to center the spinner in its container */
    centered?: boolean;
    /** Whether to take up full screen height */
    fullScreen?: boolean;
    /** Optional loading text to display */
    text?: string;
}

const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-4",
    lg: "w-12 h-12 border-4",
    xl: "w-16 h-16 border-4",
};

/**
 * A reusable loading spinner component with consistent styling.
 * 
 * @example
 * // Basic usage
 * <LoadingSpinner />
 * 
 * // Full page loader
 * <LoadingSpinner fullScreen size="lg" text="Loading..." />
 * 
 * // Inline small spinner
 * <LoadingSpinner size="sm" />
 */
export const LoadingSpinner = ({
    size = "md",
    className,
    centered = false,
    fullScreen = false,
    text,
}: LoadingSpinnerProps) => {
    const spinner = (
        <div
            className={cn(
                "border-pfcu-purple border-t-transparent rounded-full animate-spin",
                sizeClasses[size],
                className
            )}
            role="status"
            aria-label="Loading"
        />
    );

    if (fullScreen) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                {spinner}
                {text && <p className="text-gray-600 text-sm">{text}</p>}
            </div>
        );
    }

    if (centered) {
        return (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
                {spinner}
                {text && <p className="text-gray-600 text-sm">{text}</p>}
            </div>
        );
    }

    return spinner;
};

/**
 * A skeleton loader for content placeholders
 */
interface SkeletonProps {
    className?: string;
    /** Width of the skeleton (default: full) */
    width?: string;
    /** Height of the skeleton (default: 4) */
    height?: string;
}

export const Skeleton = ({ className, width = "w-full", height = "h-4" }: SkeletonProps) => {
    return (
        <div
            className={cn(
                "animate-pulse bg-gray-200 rounded",
                width,
                height,
                className
            )}
        />
    );
};

/**
 * Card skeleton for list items
 */
export const CardSkeleton = ({ className }: { className?: string }) => {
    return (
        <div className={cn("bg-white p-4 rounded-lg shadow border border-gray-100", className)}>
            <Skeleton height="h-6" width="w-3/4" className="mb-3" />
            <Skeleton height="h-4" width="w-1/2" className="mb-2" />
            <Skeleton height="h-4" width="w-full" />
        </div>
    );
};

/**
 * Table row skeleton
 */
export const TableRowSkeleton = ({ columns = 4 }: { columns?: number }) => {
    return (
        <tr className="border-b">
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="p-4">
                    <Skeleton height="h-4" width={i === 0 ? "w-3/4" : "w-1/2"} />
                </td>
            ))}
        </tr>
    );
};

export default LoadingSpinner;
