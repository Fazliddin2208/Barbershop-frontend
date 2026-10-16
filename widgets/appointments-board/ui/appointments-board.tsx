"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { listAppointments, type Appointment } from "@/entities/appointment";
import { AddAppointmentDialog } from "@/features/add-appointment";
import { formatTime } from "@/components/app/Overview";
import { errorMessage } from "@/shared/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { AppointmentStatus } from "@/shared/ui/appointment-status";

function formatDay(value: string) {
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function AppointmentsBoard({ shopId }: { shopId: string }) {
  const [items, setItems] = useState<Appointment[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setItems(await listAppointments(shopId));
  }, [shopId]);

  useEffect(() => {
    load().catch((err) => setError(errorMessage(err)));
  }, [load]);

  return (
    <Card className="shadow-[0_8px_24px_rgba(23,32,51,0.04)]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Appointments</CardTitle>
        <AddAppointmentDialog
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
        {items.length === 0 ? <p className="text-sm text-ink-secondary">No appointments yet.</p> : null}
        <ul>
          {items.map((item) => (
            <li key={item.id} className="border-b border-line last:border-0">
              <Link href={`/dashboard/appointments/${item.id}`} className="flex items-center justify-between gap-4 py-3 text-sm">
                <span className="min-w-0">
                  <span className="block truncate font-medium">{item.user.name}</span>
                  <span className="text-ink-secondary">
                    {formatDay(item.timeslot.date)} · {formatTime(item.timeslot.startTime)} · {item.service?.name ?? "No service"} · {item.timeslot.barber.name}
                  </span>
                </span>
                <AppointmentStatus status={item.status} />
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
