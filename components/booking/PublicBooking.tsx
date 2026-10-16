"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { api, errorMessage, getToken } from "@/lib/api";
import { Field } from "@/components/auth/LoginForm";
import { formatPrice } from "@/shared/lib/price";
import { BackLink } from "@/shared/ui/back-link";

type Shop = {
  name: string;
  slug: string;
  address: string;
  phone?: string | null;
  barbers: { id: string; name: string }[];
  services: { id: string; name: string; durationMin: number; price: number }[];
};

type Slot = { id: string; startTime: string; barberId: string };

export default function PublicBooking({ slug }: { slug: string }) {
  const [shop, setShop] = useState<Shop | null>(null);
  const [missing, setMissing] = useState(false);
  const [serviceId, setServiceId] = useState("");
  const [barberId, setBarberId] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [timeSlotId, setTimeSlotId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [pending, setPending] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    if (!getToken()) return;
    api.get("/auth/me").then((response) => setSignedIn(Boolean(response.data.client)));
  }, []);

  useEffect(() => {
    api
      .get(`/public/shops/${slug}`)
      .then((response) => {
        const data = response.data as Shop;
        setShop(data);
        if (data.services[0]) setServiceId(data.services[0].id);
        if (data.barbers[0]) setBarberId(data.barbers[0].id);
      })
      .catch(() => setMissing(true));
  }, [slug]);

  useEffect(() => {
    if (!barberId) return;
    api
      .get(`/public/shops/${slug}/timeslots`, { params: { date, barberId } })
      .then((response) => {
        setSlots(response.data);
        setTimeSlotId("");
      })
      .catch((error) => setError(errorMessage(error)));
  }, [slug, date, barberId]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const { data } = await api.post(`/public/shops/${slug}/bookings`, {
        name: signedIn ? undefined : name,
        phone: signedIn ? undefined : phone,
        timeSlotId,
        serviceId: serviceId || undefined,
        note: note.trim() || undefined,
      });
      setDone(`${data.timeslot.startTime} with ${data.timeslot.barber.name}`);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setPending(false);
    }
  }

  if (missing) {
    return (
      <main className="min-h-screen bg-page p-8">
        <p>This shop was not found.</p>
        <BackLink href="/" />
      </main>
    );
  }

  if (!shop) {
    return <main className="min-h-screen bg-page p-8">Loading...</main>;
  }

  return (
    <main className="min-h-screen bg-page px-4 py-12">
      <div className="mx-auto max-w-xl space-y-6">
        <BackLink href="/" />
        <div>
          <h1 className="text-4xl font-bold">{shop.name}</h1>
          <p className="text-ink-secondary">{shop.address}</p>
          {shop.phone ? <p className="text-ink-secondary">{shop.phone}</p> : null}
        </div>
        {done ? (
          <div className="rounded-2xl bg-surface p-6 shadow-[0_8px_24px_rgba(31,36,48,0.04)]">
            <h2 className="text-xl">You are booked</h2>
            <p>{done}</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4 rounded-2xl bg-surface p-6 shadow-[0_8px_24px_rgba(31,36,48,0.04)]">
            <label className="block space-y-1 text-sm">
              <span>Service</span>
              <select
                value={serviceId}
                onChange={(event) => setServiceId(event.target.value)}
                className="w-full rounded-xl border border-line bg-surface px-3 py-2"
              >
                {shop.services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} · {service.durationMin} min · {formatPrice(service.price)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1 text-sm">
              <span>Barber</span>
              <select
                value={barberId}
                onChange={(event) => setBarberId(event.target.value)}
                className="w-full rounded-xl border border-line bg-surface px-3 py-2"
              >
                {shop.barbers.map((barber) => (
                  <option key={barber.id} value={barber.id}>
                    {barber.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1 text-sm">
              <span>Date</span>
              <input
                type="date"
                required
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="w-full rounded-xl border border-line bg-surface px-3 py-2"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {slots.length === 0 ? (
                <p className="text-sm text-ink-secondary">No open times on this day.</p>
              ) : (
                slots.map((slot) => (
                  <button
                    type="button"
                    key={slot.id}
                    onClick={() => setTimeSlotId(slot.id)}
                    className={`rounded-xl border px-3 py-2 text-sm ${timeSlotId === slot.id ? "border-primary bg-primary text-white" : "border-line"}`}
                  >
                    {slot.startTime}
                  </button>
                ))
              )}
            </div>
            {signedIn ? (
              <p className="text-sm text-ink-secondary">Booking with your client account.</p>
            ) : (
              <>
                <Field label="Your name" value={name} onChange={setName} />
                <Field label="Phone" value={phone} onChange={setPhone} />
              </>
            )}
            <label className="block space-y-1 text-sm">
              <span>Note</span>
              <textarea
                value={note}
                maxLength={500}
                onChange={(event) => setNote(event.target.value)}
                className="min-h-24 w-full rounded-xl border border-line bg-surface px-3 py-2"
              />
            </label>
            {error ? <p className="text-sm text-red-700">{error}</p> : null}
            <Button type="submit" disabled={pending || !timeSlotId}>
              {pending ? "Booking..." : "Confirm booking"}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
