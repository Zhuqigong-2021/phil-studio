"use client";

import "@/styles/secondary.css";
import { useManagePageState } from "@/hooks/useManagePageState";
import SecondaryPageShell from "@/components/dashboard/SecondaryPageShell";
import ManageContent from "@/components/dashboard/pages/ManageContent";

export default function ManagePage() {
  const state = useManagePageState();
  return (
    <SecondaryPageShell state={state} active="manage">
      <ManageContent state={state} />
    </SecondaryPageShell>
  );
}
