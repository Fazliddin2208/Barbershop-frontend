"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { listServices, type Service } from "@/entities/service";
import { AddServiceDialog } from "@/features/add-service";
import { errorMessage } from "@/shared/api";
import { assetUrl } from "@/shared/lib/asset";
import { formatPrice } from "@/shared/lib/price";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

export function ServicesBoard({ shopId }: { shopId: string }) {
  const [items, setItems] = useState<Service[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const data = await listServices(shopId);
    setItems(data);
  }, [shopId]);

  useEffect(() => {
    load().catch((err) => setError(errorMessage(err)));
  }, [load]);

  return (
    <Card className="shadow-[0_8px_24px_rgba(23,32,51,0.04)]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Services</CardTitle>
        <AddServiceDialog
          shopId={shopId}
          onCreated={async () => {
            try {
              await load();
            } catch (err) {
              setError(errorMessage(err));
            }
          }}
        />
      </CardHeader>
      <CardContent>
        {error ? <p className="mb-3 text-sm text-danger">{error}</p> : null}
        {items.length === 0 ? <p className="text-sm text-ink-secondary">No services yet.</p> : null}
        <ul>
          {items.map((service) => {
            const main = service.images?.find((image) => image.isMain) ?? service.images?.[0];
            return (
              <li key={service.id} className="border-b border-line last:border-0">
                <Link href={`/dashboard/services/${service.id}`} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <span className="flex min-w-0 items-center gap-3">
                    {main ? (
                      <img src={assetUrl(main.url)} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    ) : (
                      <span className="h-10 w-10 rounded-lg bg-primary-soft" />
                    )}
                    <span className="truncate font-medium">{service.name}</span>
                  </span>
                  <span className="shrink-0 text-ink-secondary">
                    {service.durationMin} min · {formatPrice(service.price)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
