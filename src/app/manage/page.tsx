"use client";

import "@/styles/secondary.css";
import { useManagePageState } from "@/hooks/useManagePageState";
import SecondaryPageShell from "@/components/dashboard/SecondaryPageShell";
import ManageContent from "@/components/dashboard/pages/ManageContent";
import EditPanel from "@/components/dashboard/pages/EditPanel";

export default function ManagePage() {
  const state = useManagePageState();
  return (
    <SecondaryPageShell state={state} active="manage">
      <div style={{ flex: 1, minHeight: 0, display: "flex", gap: 16, overflow: "hidden" }}>
        <ManageContent state={state} />
        <EditPanel state={state} />
      </div>
    </SecondaryPageShell>
  );
}
