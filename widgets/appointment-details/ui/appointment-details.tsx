"use client";

import { useCallback, useEffect, useState } from "react";
import { getAppointment, updateAppointmentStatus, type Appointment } from "@/entities/appointment";
import { formatTime } from "@/components/app/Overview";
import { errorMessage } from "@/shared/api";
import { formatPrice } from "@/shared/lib/price";
import { BackLink } from "@/shared/ui/back-link";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { AppointmentStatus } from "@/shared/ui/appointment-status";

export function AppointmentDetails({ shopId, appointmentId }: { shopId: string; appointmentId: string }) {
  const [item, setItem] = useState<Appointment | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const load = useCallback(async () => {
    setItem(await getAppointment(shopId, appointmentId));
  }, [shopId, appointmentId]);

  useEffect(() => {
    load().catch((err) => setError(errorMessage(err)));
  }, [load]);

  async function setStatus(status: string) {
    setPending(true);
    setError("");
    try {
      setItem(await updateAppointmentStatus(shopId, appointmentId, status));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setPending(false);
    }
  }

  const when = item
    ? new Date(item.timeslot.date).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })
    : "";

  return (
    <div className="grid gap-4">
      <BackLink href="/dashboard/appointments" />
      {!item ? <p className="text-sm text-ink-secondary">{error || "Loading appointment..."}</p> : null}
      {item ? (
        <Card className="shadow-[0_8px_24px_rgba(23,32,51,0.04)]">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>{item.user.name}</CardTitle>
              <p className="text-sm text-ink-secondary">{item.user.phone || "No phone"}</p>
            </div>
            <AppointmentStatus status={item.status} />
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <p>
              <span className="text-ink-secondary">When</span>
              <span className="mt-1 block font-medium">
                {when} · {formatTime(item.timeslot.startTime)}
              </span>
            </p>
            <p>
              <span className="text-ink-secondary">Service</span>
              <span className="mt-1 block font-medium">
                {item.service ? `${item.service.name} · ${item.service.durationMin} min · ${formatPrice(item.service.price)}` : "No service"}
              </span>
            </p>
            <p>
              <span className="text-ink-secondary">Barber</span>
              <span className="mt-1 block font-medium">{item.timeslot.barber.name}</span>
            </p>
            <p>
              <span className="text-ink-secondary">Note</span>
              <span className="mt-1 block whitespace-pre-wrap font-medium">{item.note || "No note"}</span>
            </p>
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            <div className="flex flex-wrap gap-2 pt-2">
              {item.status === "pending" ? (
                <Button disabled={pending} onClick={() => setStatus("confirmed")}>
                  Confirm
                </Button>
              ) : null}
              {item.status === "pending" || item.status === "confirmed" ? (
                <Button variant="outline" disabled={pending} onClick={() => setStatus("completed")}>
                  Complete
                </Button>
              ) : null}
              {item.status !== "cancelled" && item.status !== "completed" ? (
                <Button variant="outline" disabled={pending} onClick={() => setStatus("cancelled")}>
                  Cancel appointment
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
