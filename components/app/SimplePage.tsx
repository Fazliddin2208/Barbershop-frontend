"use client";

import DashboardShell from "@/components/app/DashboardShell";
import { Panel, useShopGate } from "@/components/app/Overview";

export default function SimplePage({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  const { shopName } = useShopGate();
  return (
    <DashboardShell shopName={shopName}>
      <Panel title={title}>
        <p className="text-sm text-ink-secondary">{body}</p>
      </Panel>
    </DashboardShell>
  );
}
