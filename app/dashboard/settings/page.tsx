"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import DashboardShell from "@/components/app/DashboardShell";
import { Panel, useShopGate } from "@/components/app/Overview";
import { api, errorMessage } from "@/lib/api";
import { Field } from "@/components/auth/LoginForm";

export default function SettingsPage() {
  const { shopId, shopName } = useShopGate();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!shopId) return;
    api.get(`/shops/${shopId}`).then((response) => {
      setName(response.data.name);
      setAddress(response.data.address);
      setPhone(response.data.phone ?? "");
    });
  }, [shopId]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!shopId) return;
    setError("");
    setSaved("");
    try {
      await api.patch(`/shops/${shopId}`, { name, address, phone: phone || undefined });
      setSaved("Saved");
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <DashboardShell shopName={shopName}>
      <Panel title="Setting">
        <form onSubmit={onSubmit} className="max-w-md space-y-3">
          <Field label="Shop name" value={name} onChange={setName} />
          <Field label="Address" value={address} onChange={setAddress} />
          <Field label="Phone" value={phone} onChange={setPhone} />
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          {saved ? <p className="text-sm text-success">{saved}</p> : null}
          <Button type="submit">Save</Button>
        </form>
      </Panel>
    </DashboardShell>
  );
}
