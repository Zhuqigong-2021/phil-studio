"use client";

import { LoaderCircle, TriangleAlert, X } from "lucide-react";
import { useEffect, useRef } from "react";

export default function DeleteToolDialog({
  toolName,
  deleting,
  onCancel,
  onConfirm,
}: {
  toolName: string;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }, []);

  useEffect(() => {
    if (deleting) dialogRef.current?.focus();
    else cancelRef.current?.focus();
  }, [deleting]);

  const cancel = () => {
    if (deleting) return;
    const returnTarget = returnFocusRef.current;
    onCancel();
    requestAnimationFrame(() => returnTarget?.focus());
  };

  return (
    <div className="delete-tool-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) cancel();
    }}>
      <div
        ref={dialogRef}
        className="delete-tool-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-tool-title"
        aria-describedby={deleting ? undefined : "delete-tool-description"}
        aria-busy={deleting}
        tabIndex={-1}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            cancel();
            return;
          }
          if (event.key !== "Tab") return;
          const focusable = [...(dialogRef.current?.querySelectorAll<HTMLElement>("button:not(:disabled)") ?? [])];
          if (!focusable.length) {
            event.preventDefault();
            dialogRef.current?.focus();
            return;
          }
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
      >
        {deleting ? (
          <div className="delete-tool-pending" role="status">
            <LoaderCircle className="database-spinner" size={26} aria-hidden="true" />
            <span>Deleting…</span>
          </div>
        ) : (
          <>
            <div className="delete-tool-heading">
              <span className="delete-tool-warning"><TriangleAlert size={19} aria-hidden="true" /></span>
              <div>
                <h2 id="delete-tool-title">Delete {toolName}?</h2>
                <p id="delete-tool-description">This permanently removes the tool from your library. This action cannot be undone.</p>
              </div>
              <button type="button" className="delete-dialog-close" aria-label={`Cancel deleting ${toolName}`} onClick={cancel}><X size={16} aria-hidden="true" /></button>
            </div>
            <div className="delete-tool-actions">
              <button ref={cancelRef} type="button" className="delete-cancel-button" onClick={cancel}>Cancel</button>
              <button type="button" className="delete-confirm-button" onClick={onConfirm}>Delete tool</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
