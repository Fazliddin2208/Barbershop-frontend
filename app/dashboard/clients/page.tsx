"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/app/DashboardShell";
import { Panel, useShopGate } from "@/components/app/Overview";
import { api, errorMessage } from "@/lib/api";

type Client = { id: string; name: string; phone: string | null };

export default function ClientsPage() {
  const { shopId, shopName } = useShopGate();
  const [items, setItems] = useState<Client[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!shopId) return;
    api
      .get(`/shops/${shopId}/customers`)
      .then((response) => setItems(response.data))
      .catch((err) => setError(errorMessage(err)));
  }, [shopId]);

  return (
    <DashboardShell shopName={shopName}>
      <Panel title="Clients">
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        {items.length === 0 ? <p className="text-sm text-ink-secondary">No clients yet.</p> : null}
        <ul>
          {items.map((client) => (
            <li key={client.id} className="flex justify-between border-b border-line py-3 text-sm last:border-0">
              <span className="font-medium">{client.name}</span>
              <span className="text-ink-secondary">{client.phone ?? "No phone"}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </DashboardShell>
  );
}
