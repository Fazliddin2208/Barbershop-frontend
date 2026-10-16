"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Info, Users, UserPlus, Scissors, CalendarDays } from "lucide-react";
import DashboardShell from "@/components/app/DashboardShell";
import { api, clearSession, errorMessage, getShopId, getToken } from "@/lib/api";

type Overview = {
  stats: {
    totalClients: number;
    totalClientsTrend: number;
    newClients: number;
    newClientsTrend: number;
    employees: number;
    employeesTrend: number;
    appointments: number;
    appointmentsTrend: number;
  };
  growth: { label: string; fresh: number; returning: number }[];
  stratification: { label: string; share: number; color: string }[];
};

type Booking = {
  id: string;
  status: string;
  user: { name: string };
  service: { name: string } | null;
  timeslot: { startTime: string; date: string; barber: { name: string } };
};

const colorMap: Record<string, string> = {
  primary: "#4778F5",
  warning: "#F89870",
  "warning-soft": "#F8D0C0",
};

export default function Overview() {
  const router = useRouter();
  const [shopName, setShopName] = useState("Shop");
  const [data, setData] = useState<Overview | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const shopId = getShopId();
    if (!getToken() || !shopId) {
      router.replace("/login");
      return;
    }
    Promise.all([
      api.get(`/shops/${shopId}`),
      api.get(`/shops/${shopId}/overview`),
      api.get(`/shops/${shopId}/bookings`),
    ])
      .then(([shop, overview, list]) => {
        setShopName(shop.data.name);
        setData(overview.data);
        setBookings(list.data);
      })
      .catch((err) => {
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          clearSession();
          router.replace("/login");
          return;
        }
        setError(errorMessage(err));
      });
  }, [router]);

  return (
    <DashboardShell shopName={shopName}>
      {error ? <p className="mb-4 text-sm text-danger">{error}</p> : null}
      {!data ? (
        <p className="text-sm text-ink-secondary">Loading dashboard...</p>
      ) : (
        <div className="space-y-4">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Stat icon={Users} label="Total clients" caption="unique clients served" value={data.stats.totalClients} trend={data.stats.totalClientsTrend} />
            <Stat icon={UserPlus} label="New clients" caption="this month" value={data.stats.newClients} trend={data.stats.newClientsTrend} />
            <Stat icon={Scissors} label="Total employee" caption="this shop" value={data.stats.employees} trend={data.stats.employeesTrend} />
            <Stat icon={CalendarDays} label="Appointment" caption="this month" value={data.stats.appointments} trend={data.stats.appointmentsTrend} />
          </section>
          <section className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
            <Growth points={data.growth} />
            <Donut parts={data.stratification} />
          </section>
          <AppointmentTable rows={bookings.slice(0, 6)} />
        </div>
      )}
    </DashboardShell>
  );
}

function Stat({
  icon: Icon,
  label,
  caption,
  value,
  trend,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  caption: string;
  value: number;
  trend: number;
}) {
  const up = trend >= 0;
  return (
    <article className="rounded-2xl bg-surface p-5 shadow-[0_8px_24px_rgba(31,36,48,0.04)]">
      <div className="mb-4 flex items-start justify-between">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-primary">
          <Icon size={16} />
        </span>
        <Info size={14} className="text-ink-muted" />
      </div>
      <p className="text-sm font-semibold">{label}</p>
      <p className="text-xs text-ink-secondary">{caption}</p>
      <div className="mt-3 flex items-end gap-2">
        <p className="text-[28px] font-bold leading-none">{value}</p>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${up ? "bg-success-soft text-success" : "bg-danger-soft text-danger"}`}>
          {up ? "+" : ""}
          {trend}%
        </span>
      </div>
    </article>
  );
}

function Growth({ points }: { points: { label: string; fresh: number; returning: number }[] }) {
  const max = Math.max(1, ...points.flatMap((point) => [point.fresh, point.returning]));
  const total = points.reduce((sum, point) => sum + point.fresh + point.returning, 0);
  return (
    <article className="rounded-2xl bg-surface p-5 shadow-[0_8px_24px_rgba(31,36,48,0.04)]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold">Clients growth</h2>
        <span className="rounded-xl border border-line px-3 py-1.5 text-xs text-ink-secondary">Weekly</span>
      </div>
      <p className="text-sm text-ink-secondary">Total {total}</p>
      <div className="mb-4 flex gap-4 text-xs text-ink-secondary">
        <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-sm bg-primary" /> New clients</span>
        <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-sm bg-primary-soft" /> Returning clients</span>
      </div>
      <div className="flex h-48 items-end gap-3">
        {points.map((point) => (
          <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-40 items-end gap-1">
              <span className="w-3 rounded-t bg-primary" style={{ height: `${(point.fresh / max) * 100}%` }} />
              <span className="w-3 rounded-t bg-primary-soft" style={{ height: `${(point.returning / max) * 100}%` }} />
            </div>
            <span className="text-xs text-ink-secondary">{point.label}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

function Donut({ parts }: { parts: { label: string; share: number; color: string }[] }) {
  const stops = parts.reduce<{ at: number; color: string }[]>((list, part) => {
    const at = (list.at(-1)?.at ?? 0) + part.share;
    list.push({ at, color: colorMap[part.color] ?? "#4778F5" });
    return list;
  }, []);
  const gradient = stops
    .map((stop, index) => {
      const from = index === 0 ? 0 : stops[index - 1].at;
      return `${stop.color} ${from}% ${stop.at}%`;
    })
    .join(", ");
  const total = parts.reduce((sum, part) => sum + part.share, 0);

  return (
    <article className="rounded-2xl bg-surface p-5 shadow-[0_8px_24px_rgba(31,36,48,0.04)]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold">Customer stratification</h2>
        <span className="rounded-xl border border-line px-3 py-1.5 text-xs text-ink-secondary">All time</span>
      </div>
      <div className="mx-auto grid h-44 w-44 place-items-center rounded-full" style={{ background: total ? `conic-gradient(${gradient})` : "#DCE5F5" }}>
        <div className="grid h-24 w-24 place-items-center rounded-full bg-surface text-xl font-bold">{total ? "100%" : "0%"}</div>
      </div>
      <ul className="mt-4 space-y-2 text-sm">
        {parts.map((part) => (
          <li key={part.label} className="flex items-center justify-between text-ink-secondary">
            <span className="flex items-center gap-2">
              <i className="h-2.5 w-2.5 rounded-sm" style={{ background: colorMap[part.color] }} />
              {part.label}
            </span>
            <span>{part.share}%</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function AppointmentTable({ rows }: { rows: Booking[] }) {
  return (
    <article className="rounded-2xl bg-surface p-5 shadow-[0_8px_24px_rgba(31,36,48,0.04)]">
      <h2 className="mb-4 text-base font-semibold">Service appointment list</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-ink-secondary">No appointments yet.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead className="text-xs font-semibold text-ink-secondary">
            <tr className="border-b border-line">
              <th className="py-3 font-semibold">Start time</th>
              <th>Services</th>
              <th>Client</th>
              <th>Employee</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-line last:border-0">
                <td className="py-4">{formatTime(row.timeslot.startTime)}</td>
                <td>{row.service?.name ?? "—"}</td>
                <td>{row.user.name}</td>
                <td>{row.timeslot.barber.name}</td>
                <td>
                  <Status status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </article>
  );
}

function Status({ status }: { status: string }) {
  const pending = status === "pending";
  const cancelled = status === "cancelled";
  const label = pending ? "Pending" : cancelled ? "Cancelled" : "Paid";
  const tone = pending
    ? "bg-danger-soft text-danger"
    : cancelled
      ? "bg-surface-muted text-ink-secondary"
      : "bg-success-soft text-success";
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>{label}</span>;
}

export function formatTime(value: string) {
  const [hourText, minute] = value.split(":");
  const hour = Number(hourText);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${String(hour12).padStart(2, "0")}:${minute} ${suffix}`;
}

export function useShopGate() {
  const router = useRouter();
  const [shopId, setShopId] = useState<string | null>(null);
  const [shopName, setShopName] = useState("Shop");

  useEffect(() => {
    const id = getShopId();
    if (!getToken() || !id) {
      router.replace("/login");
      return;
    }
    setShopId(id);
    api.get(`/shops/${id}`).then((response) => setShopName(response.data.name)).catch(() => {
      clearSession();
      router.replace("/login");
    });
  }, [router]);

  return { shopId, shopName };
}

export function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-surface p-5 shadow-[0_8px_24px_rgba(31,36,48,0.04)]">
      <h2 className="mb-4 text-base font-semibold">{title}</h2>
      {children}
    </section>
  );
}
