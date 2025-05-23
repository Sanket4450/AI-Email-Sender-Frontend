import React from 'react'
import { CommonPagination } from './common-pagination'
import { CONSTANTS } from '~/lib/constants'
import { VALUES } from '~/lib/values'

interface CommonTableFooterProps {
  page: number
  onPageChange: (page: number) => void
  pageSize: number
  dataCount: number
  totalCount: number
}

export const TableFooterSection = ({
  page,
  onPageChange,
  pageSize,
  dataCount,
  totalCount,
}: CommonTableFooterProps) => {
  const totalPages = Math.ceil(totalCount / pageSize)

  const startIndex = (page - 1) * pageSize + 1
  const endIndex =
    (page - 1) * VALUES.COMPANIES_PAGE_SIZE +
    Math.min(dataCount, VALUES.COMPANIES_PAGE_SIZE)

  return (
    <section className="flex justify-between items-center pt-2 px-3">
      <p className="flex-1 text-[13px] text-muted-foreground">
        {CONSTANTS.SHOWING} {startIndex} {CONSTANTS.TO} {endIndex}{' '}
        {CONSTANTS.OF} {totalCount} {CONSTANTS.ENTRIES.toLowerCase()}
      </p>

      {/* Pagination */}
      <CommonPagination
        currentPage={page}
        totalPages={totalPages}
        onChange={onPageChange}
      />
    </section>
  )
}
