"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createAppointment, listBarbers, listDaySlots, listServiceOptions, type BarberOption, type ServiceOption } from "@/entities/appointment";
import { errorMessage } from "@/shared/api";
import { formatPrice } from "@/shared/lib/price";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

function clockOptions(start: string, end: string) {
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);
  const options: string[] = [];
  let cursor = startHour * 60 + startMinute;
  const limit = endHour * 60 + endMinute;
  while (cursor < limit) {
    const hour = Math.floor(cursor / 60);
    const minute = cursor % 60;
    options.push(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
    cursor += 30;
  }
  return options;
}

export function AddAppointmentDialog({
  shopId,
  onCreated,
}: {
  shopId: string;
  onCreated: () => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const [barbers, setBarbers] = useState<BarberOption[]>([]);
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [barberId, setBarberId] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState("");
  const [note, setNote] = useState("");
  const [taken, setTaken] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const barber = barbers.find((item) => item.id === barberId);
  const times = useMemo(
    () => (barber ? clockOptions(barber.workStart, barber.workEnd) : []),
    [barber],
  );

  useEffect(() => {
    if (!open) return;
    Promise.all([listBarbers(shopId), listServiceOptions(shopId)])
      .then(([barberRows, serviceRows]) => {
        setBarbers(barberRows);
        setServices(serviceRows);
        setBarberId((current) => current || barberRows[0]?.id || "");
        setServiceId((current) => current || serviceRows[0]?.id || "");
      })
      .catch((err) => setError(errorMessage(err)));
  }, [open, shopId]);

  useEffect(() => {
    if (!open || !barberId || !date) return;
    listDaySlots(shopId, barberId, date)
      .then((slots) => setTaken(slots.filter((slot) => slot.isBooked).map((slot) => slot.startTime)))
      .catch((err) => setError(errorMessage(err)));
  }, [open, shopId, barberId, date]);

  useEffect(() => {
    if (!times.length) {
      setStartTime("");
      return;
    }
    setStartTime((current) => (current && times.includes(current) && !taken.includes(current) ? current : times.find((time) => !taken.includes(time)) ?? ""));
  }, [times, taken]);

  function reset() {
    setName("");
    setPhone("");
    setNote("");
    setError("");
    setDate(new Date().toISOString().slice(0, 10));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (name.trim().length < 2) {
      setError("Name needs at least 2 characters");
      return;
    }
    if (phone.trim().length < 5) {
      setError("Phone needs at least 5 characters");
      return;
    }
    if (!barberId || !date || !startTime) {
      setError("Pick a barber, date, and time");
      return;
    }
    if (note.trim().length > 500) {
      setError("Note can be 500 characters at most");
      return;
    }

    setPending(true);
    setError("");
    try {
      await createAppointment(shopId, {
        name: name.trim(),
        phone: phone.trim(),
        barberId,
        date,
        startTime,
        serviceId: serviceId || undefined,
        note: note.trim() || undefined,
      });
      await onCreated();
      reset();
      setOpen(false);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>Add appointment</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add an appointment</DialogTitle>
          <DialogDescription>Book a client who is not using the app. Name and phone are enough.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="appointment-name">Client name</Label>
            <Input id="appointment-name" value={name} onChange={(event) => setName(event.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="appointment-phone">Phone</Label>
            <Input id="appointment-phone" value={phone} onChange={(event) => setPhone(event.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="appointment-service">Service</Label>
            <select
              id="appointment-service"
              value={serviceId}
              onChange={(event) => setServiceId(event.target.value)}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            >
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} · {service.durationMin} min · {formatPrice(service.price)}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="appointment-barber">Barber</Label>
            <select
              id="appointment-barber"
              value={barberId}
              onChange={(event) => setBarberId(event.target.value)}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            >
              {barbers.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="appointment-date">Date</Label>
            <Input id="appointment-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="appointment-time">Time</Label>
            <select
              id="appointment-time"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
              required
            >
              {times.length === 0 ? <option value="">No working hours</option> : null}
              {times.map((time) => (
                <option key={time} value={time} disabled={taken.includes(time)}>
                  {time}
                  {taken.includes(time) ? " · booked" : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="appointment-note">Note</Label>
            <textarea
              id="appointment-note"
              value={note}
              maxLength={500}
              onChange={(event) => setNote(event.target.value)}
              className="min-h-24 rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </div>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending || !startTime}>
              {pending ? "Saving..." : "Save appointment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
