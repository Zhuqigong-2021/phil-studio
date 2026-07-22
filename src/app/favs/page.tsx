"use client";

import "@/styles/secondary.css";
import { useFavsPageState } from "@/hooks/useFavsPageState";
import SecondaryPageShell from "@/components/dashboard/SecondaryPageShell";
import FavsContent from "@/components/dashboard/pages/FavsContent";

export default function FavsPage() {
  const state = useFavsPageState();
  return (
    <SecondaryPageShell state={state} active="favs">
      <FavsContent state={state} />
    </SecondaryPageShell>
  );
}
