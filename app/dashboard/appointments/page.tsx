"use client";

import DashboardShell from "@/components/app/DashboardShell";
import { useShopGate } from "@/components/app/Overview";
import { AppointmentsBoard } from "@/widgets/appointments-board";

export default function AppointmentsPage() {
  const { shopId, shopName } = useShopGate();

  return (
    <DashboardShell shopName={shopName}>
      {shopId ? <AppointmentsBoard shopId={shopId} /> : <p className="text-sm text-ink-secondary">Loading appointments...</p>}
    </DashboardShell>
  );
}
