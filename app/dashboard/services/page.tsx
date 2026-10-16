"use client";

import DashboardShell from "@/components/app/DashboardShell";
import { useShopGate } from "@/components/app/Overview";
import { ServicesBoard } from "@/widgets/services-board";

export default function ServicesPage() {
  const { shopId, shopName } = useShopGate();

  return (
    <DashboardShell shopName={shopName}>
      {shopId ? <ServicesBoard shopId={shopId} /> : <p className="text-sm text-ink-secondary">Loading services...</p>}
    </DashboardShell>
  );
}
