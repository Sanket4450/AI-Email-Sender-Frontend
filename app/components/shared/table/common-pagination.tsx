import { useMemo } from 'react'
import { Button } from '~/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '~/components/ui/pagination'
import { cn } from '~/lib/utils'

interface CommonPaginationProps {
  currentPage: number
  totalPages: number
  onChange: (page: number) => void
}

export const CommonPagination = ({
  currentPage,
  totalPages,
  onChange,
}: CommonPaginationProps) => {
  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages
  const isOnlyOnePage = totalPages === 1
  const isPreviousDisabled = isFirstPage || isOnlyOnePage
  const isNextDisabled = isLastPage || isOnlyOnePage

  const showablePages = useMemo(
    () =>
      Array.from({ length: totalPages }, (_, index) => index + 1).filter(
        (page) => {
          if (totalPages <= 5) {
            return true
          }
          if (page === 1 || page === totalPages) {
            return true
          }
          if (page >= currentPage - 1 && page <= currentPage + 1) {
            return true
          }
          return false
        }
      ),
    [currentPage, totalPages]
  )

  const handlePreviousPage = () => {
    if (!isPreviousDisabled) onChange(currentPage - 1)
  }

  const handleNextPage = () => {
    if (!isNextDisabled) onChange(currentPage + 1)
  }

  const handlePageChange = (page: number) => {
    onChange(page)
  }

  return (
    <Pagination className="w-auto">
      <PaginationContent className="select-none">
        <PaginationItem>
          <PaginationPrevious
            className={cn(
              isPreviousDisabled
                ? 'hover:cursor-not-allowed opacity-70 hover:bg-transparent'
                : 'hover:cursor-pointer'
            )}
            onClick={handlePreviousPage}
          />
        </PaginationItem>
        {showablePages.map((page) => (
          <PaginationItem key={page}>
            <Button
              variant="outline"
              className={cn(
                currentPage === page && 'bg-accent text-accent-foreground'
              )}
              onClick={() => handlePageChange(page)}>
              {page}
            </Button>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            className={cn(
              isNextDisabled
                ? 'hover:cursor-not-allowed opacity-70 hover:bg-transparent'
                : 'hover:cursor-pointer'
            )}
            onClick={handleNextPage}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
