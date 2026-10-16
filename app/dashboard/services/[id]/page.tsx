"use client";

import { useParams } from "next/navigation";
import DashboardShell from "@/components/app/DashboardShell";
import { useShopGate } from "@/components/app/Overview";
import { ServiceDetails } from "@/widgets/service-details";

export default function ServicePage() {
  const { shopId, shopName } = useShopGate();
  const params = useParams<{ id: string }>();

  return (
    <DashboardShell shopName={shopName}>
      {shopId && params.id ? (
        <ServiceDetails shopId={shopId} serviceId={params.id} />
      ) : (
        <p className="text-sm text-ink-secondary">Loading service...</p>
      )}
    </DashboardShell>
  );
}
