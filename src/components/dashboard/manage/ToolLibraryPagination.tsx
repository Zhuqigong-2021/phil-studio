"use client";

import { ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { ManagePageSize } from "@/hooks/manage-page-state";

export default function ToolLibraryPagination({
  page,
  pageCount,
  pageSize,
  start,
  end,
  total,
  onPageChange,
  onPageSizeChange,
}: {
  page: number;
  pageCount: number;
  pageSize: ManagePageSize;
  start: number;
  end: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: ManagePageSize) => void;
}) {
  const atStart = page <= 1;
  const atEnd = page >= pageCount;

  return (
    <nav data-manage-entrance-pagination className="tool-library-pagination" data-page-size={pageSize} aria-label="Tool Library pagination">
      <div className="tool-pagination-status">Showing {start}–{end} of {total} tools</div>
      <div className="tool-pagination-controls">
        <label className="tool-page-size">
          <span>Rows per page</span>
          <select value={pageSize} onChange={(event) => onPageSizeChange(Number(event.target.value) as ManagePageSize)}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </label>
        <span className="tool-page-copy">Page {page} of {pageCount}</span>
        <div className="tool-page-buttons">
          <button type="button" aria-label="First page" disabled={atStart} onClick={() => onPageChange(1)}><ChevronsLeft size={16} aria-hidden="true" /></button>
          <button type="button" aria-label="Previous page" disabled={atStart} onClick={() => onPageChange(page - 1)}><ChevronLeft size={16} aria-hidden="true" /></button>
          <button type="button" aria-label="Next page" disabled={atEnd} onClick={() => onPageChange(page + 1)}><ChevronRight size={16} aria-hidden="true" /></button>
          <button type="button" aria-label="Last page" disabled={atEnd} onClick={() => onPageChange(pageCount)}><ChevronsRight size={16} aria-hidden="true" /></button>
        </div>
      </div>
    </nav>
  );
}
