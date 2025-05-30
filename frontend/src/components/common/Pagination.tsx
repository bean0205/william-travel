import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const pages = getPaginationItems(currentPage, totalPages);

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>

      <div className="flex items-center gap-1">
        {pages.map((page, i) => (
          <React.Fragment key={i}>
            {page === "..." ? (
              <div className="px-2">...</div>
            ) : (
              <Button
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page as number)}
                className={cn(
                  "min-w-[36px]",
                  page === currentPage && "pointer-events-none"
                )}
              >
                {page}
              </Button>
            )}
          </React.Fragment>
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </div>
  );
}

// Helper function to generate pagination items
function getPaginationItems(currentPage: number, totalPages: number) {
  // Handle simple cases with few pages
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // For more pages, show a window around the current page
  const items: (number | string)[] = [];

  // Always show first page
  items.push(1);

  // Show ellipsis if needed
  if (currentPage > 3) {
    items.push("...");
  }

  // Calculate the start and end of the window
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  // Add window pages
  for (let i = start; i <= end; i++) {
    items.push(i);
  }

  // Show ellipsis if needed
  if (currentPage < totalPages - 2) {
    items.push("...");
  }

  // Always show last page
  items.push(totalPages);

  return items;
}
