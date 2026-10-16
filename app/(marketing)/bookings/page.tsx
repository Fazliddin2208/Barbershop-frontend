"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, clearSession, errorMessage, getToken } from "@/lib/api";
import { formatTime } from "@/components/app/Overview";

type Booking = {
  id: string;
  status: string;
  note: string | null;
  service: { name: string } | null;
  timeslot: {
    startTime: string;
    date: string;
    barber: { name: string; barbershop: { name: string; slug: string; phone: string | null; address: string } };
  };
};

export default function BookingsPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Booking[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    api
      .get("/client/bookings")
      .then((response) => setRows(response.data))
      .catch((err) => {
        if (err?.response?.status === 403) {
          setError("This login is a shop account. Open the dashboard to manage the shop.");
          return;
        }
        if (err?.response?.status === 401) {
          clearSession();
          router.replace("/login");
          return;
        }
        setError(errorMessage(err));
      });
  }, [router]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold">My bookings</h1>
      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      <ul className="mt-6 space-y-3">
        {rows.length === 0 && !error ? <p className="text-sm text-ink-secondary">No bookings yet.</p> : null}
        {rows.map((row) => (
          <li key={row.id} className="rounded-2xl bg-surface p-5 shadow-[0_8px_24px_rgba(31,36,48,0.04)]">
            <p className="font-semibold">{row.timeslot.barber.barbershop.name}</p>
            <p className="text-sm text-ink-secondary">
              {formatTime(row.timeslot.startTime)} · {row.timeslot.barber.name}
              {row.service ? ` · ${row.service.name}` : ""}
            </p>
            <p className="text-sm text-ink-secondary">{row.timeslot.barber.barbershop.address}</p>
            {row.timeslot.barber.barbershop.phone ? (
              <p className="text-sm text-ink-secondary">{row.timeslot.barber.barbershop.phone}</p>
            ) : null}
            {row.note ? <p className="mt-2 text-sm">{row.note}</p> : null}
            <p className="mt-2 text-xs font-semibold uppercase text-primary">{row.status}</p>
          </li>
        ))}
      </ul>
      <Link href="/" className="mt-6 inline-block text-sm font-semibold text-primary">Find a shop</Link>
    </main>
  );
}
