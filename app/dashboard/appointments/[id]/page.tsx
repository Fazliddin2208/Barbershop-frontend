"use client";

import { useParams } from "next/navigation";
import DashboardShell from "@/components/app/DashboardShell";
import { useShopGate } from "@/components/app/Overview";
import { AppointmentDetails } from "@/widgets/appointment-details";

export default function AppointmentPage() {
  const { shopId, shopName } = useShopGate();
  const params = useParams<{ id: string }>();

  return (
    <DashboardShell shopName={shopName}>
      {shopId && params.id ? (
        <AppointmentDetails shopId={shopId} appointmentId={params.id} />
      ) : (
        <p className="text-sm text-ink-secondary">Loading appointment...</p>
      )}
    </DashboardShell>
  );
}
