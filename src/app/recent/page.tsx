"use client";

import "@/styles/secondary.css";
import { useRecentPageState } from "@/hooks/useRecentPageState";
import SecondaryPageShell from "@/components/dashboard/SecondaryPageShell";
import RecentContent from "@/components/dashboard/pages/RecentContent";

export default function RecentPage() {
  const state = useRecentPageState();
  return (
    <SecondaryPageShell state={state} active="recent">
      <RecentContent state={state} />
    </SecondaryPageShell>
  );
}
