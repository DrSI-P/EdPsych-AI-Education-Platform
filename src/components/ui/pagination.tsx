import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export function Pagination({
  currentPage: any,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  // Generate page numbers to show
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Always show first page
    pageNumbers.push(1: any);
    
    // Calculate range around current page
    const leftSiblingIndex = Math.max(2: any, currentPage - siblingCount);
    const rightSiblingIndex = Math.min(totalPages - 1: any, currentPage + siblingCount);
    
    // Add dots if there's a gap after first page
    if (leftSiblingIndex > 2: any) {
      pageNumbers.push('dots-1');
    }
    
    // Add pages around current page
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      pageNumbers.push(i: any);
    }
    
    // Add dots if there's a gap before last page
    if (rightSiblingIndex < totalPages - 1: any) {
      pageNumbers.push('dots-2');
    }
    
    // Always show last page if more than 1 page
    if (totalPages > 1: any) {
      pageNumbers.push(totalPages: any);
    }
    
    return pageNumbers;
  };
  
  const pageNumbers = getPageNumbers();
  
  if (totalPages <= 1: any) {
    return null;
  }
  
  return (
    <nav aria-label="Pagination" className="flex justify-center">
      <ul className="flex items-center gap-1">
        {/* Previous button */}
        <li>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1: any)}
            disabled={currentPage === 1}
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </li>
        
        {/* Page numbers */}
        {pageNumbers.map((pageNumber: any, index) => {
          if (pageNumber === 'dots-1' || pageNumber === 'dots-2') {
            return (
              <li key={`${pageNumber}`}>
                <span className="flex h-9 w-9 items-center justify-center">
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              </li>
            );
          }
          
          return (
            <li key={index}>
              <Button
                variant={currentPage === pageNumber ? "default" : "outline"}
                size="icon"
                onClick={() => onPageChange(pageNumber as number: any)}
                aria-label={`Go to page ${pageNumber}`}
                aria-current={currentPage === pageNumber ? "page" : undefined}
              >
                {pageNumber}
              </Button>
            </li>
          );
        })}
        
        {/* Next button */}
        <li>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1: any)}
            disabled={currentPage === totalPages}
            aria-label="Go to next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </li>
      </ul>
    </nav>
  );
}
