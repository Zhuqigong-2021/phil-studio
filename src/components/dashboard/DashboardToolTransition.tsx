"use client";

import { useCallback, useEffect, useRef, type ReactNode, type RefObject } from "react";
import { useRouter } from "next/navigation";
import { startToolLibraryTransition } from "@/lib/dashboard/tool-transition";

interface DashboardToolTransitionRenderProps {
  sourceRef: RefObject<HTMLDivElement | null>;
  startTransition: () => void;
}

export default function DashboardToolTransition({
  children,
}: {
  children: (props: DashboardToolTransitionRenderProps) => ReactNode;
}) {
  const router = useRouter();
  const sourceRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const startTransition = useCallback(() => {
    const sourceElement = sourceRef.current;
    if (!sourceElement) return;

    const cleanup = startToolLibraryTransition(sourceElement, router);
    if (cleanup) cleanupRef.current = cleanup;
  }, [router]);

  useEffect(() => {
    router.prefetch("/manage");
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [router]);

  return (
    <>
      {children({ sourceRef, startTransition })}
      <div
        aria-hidden="true"
        data-tool-library-transition-destination
        className="pointer-events-none invisible fixed top-20 right-4 bottom-4 left-4 min-[900px]:left-[276px]"
      />
    </>
  );
}
