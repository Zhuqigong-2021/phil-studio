"use client";

import { Plus } from "lucide-react";
import { AnimatePresence } from "motion/react";
import type { ManagePageState } from "@/hooks/useManagePageState";
import DeleteToolDialog from "../manage/DeleteToolDialog";
import EditableToolRow from "../manage/EditableToolRow";
import ToolLibraryPagination from "../manage/ToolLibraryPagination";

export default function ManageContent({ state }: { state: ManagePageState }) {
  const {
    openAddTool,
    pageRows,
    categories,
    pagination,
    updatingIds,
    deleteTarget,
    deleting,
    loading,
  } = state;

  return (
    <section className="tool-library" aria-labelledby="tool-library-title">
      <header className="tool-library-header">
        <div>
          <h1 id="tool-library-title">Tool Library</h1>
          <p>Edit tools inline. Changes are saved only when you choose Update.</p>
        </div>
        <button type="button" className="tool-library-add" aria-label="Add tool" onClick={openAddTool}>
          <Plus size={18} aria-hidden="true" />
        </button>
      </header>

      <div className="tool-library-table-scroll">
        <table className="tool-library-table">
          <thead>
            <tr>
              <th scope="col">Icon</th>
              <th scope="col">Color</th>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
              <th scope="col">Category</th>
              <th scope="col">Link</th>
              <th scope="col">Pin</th>
              <th scope="col">Favorite</th>
              <th scope="col">Alias</th>
              <th scope="col">Operation</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map(({ tool, draft, aliasInput }) => (
              <EditableToolRow
                key={tool.id}
                tool={tool}
                draft={draft}
                aliasInput={aliasInput}
                categories={categories}
                updating={updatingIds.includes(tool.id)}
                onChange={(partial) => state.updateDraft(tool.id, partial)}
                onAliasInputChange={(value) => state.updateAliasInput(tool.id, value)}
                onSubmit={() => { void state.submitRow(tool.id); }}
                onDelete={() => state.requestDelete(tool.id)}
              />
            ))}
          </tbody>
        </table>
        {!pageRows.length && (
          <div className="tool-library-empty" role="status">
            {loading ? "Loading Tool Library…" : "No tools in this library yet."}
          </div>
        )}
      </div>

      <ToolLibraryPagination
        page={pagination.page}
        pageCount={pagination.pageCount}
        pageSize={state.pageSize}
        start={pagination.start}
        end={pagination.end}
        total={pagination.total}
        onPageChange={state.setPage}
        onPageSizeChange={state.setPageSize}
      />

      <AnimatePresence>
        {deleteTarget && (
          <DeleteToolDialog
            key={deleteTarget.id}
            toolName={deleteTarget.name}
            deleting={deleting}
            onCancel={state.cancelDelete}
            onConfirm={() => { void state.confirmDelete(); }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
