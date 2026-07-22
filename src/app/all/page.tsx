"use client";

import "@/styles/secondary.css";
import { useAllPageState } from "@/hooks/useAllPageState";
import SecondaryPageShell from "@/components/dashboard/SecondaryPageShell";
import AllContent from "@/components/dashboard/pages/AllContent";

export default function AllPage() {
  const state = useAllPageState();
  return (
    <SecondaryPageShell state={state} active="all">
      <AllContent state={state} />
    </SecondaryPageShell>
  );
}
