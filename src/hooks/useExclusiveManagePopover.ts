"use client";

import { useCallback, useEffect, useId, useState } from "react";

const MANAGE_POPOVER_OPEN_EVENT = "phil-studio:manage-popover-open";

export function useExclusiveManagePopover() {
  const id = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const closeForAnotherPopover = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== id) setOpen(false);
    };
    document.addEventListener(MANAGE_POPOVER_OPEN_EVENT, closeForAnotherPopover);
    return () => document.removeEventListener(MANAGE_POPOVER_OPEN_EVENT, closeForAnotherPopover);
  }, [id]);

  const toggle = useCallback(() => {
    if (!open) document.dispatchEvent(new CustomEvent(MANAGE_POPOVER_OPEN_EVENT, { detail: id }));
    setOpen(!open);
  }, [id, open]);

  return { open, toggle, close: useCallback(() => setOpen(false), []) };
}
