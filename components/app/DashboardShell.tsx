"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  CircleHelp,
  FileText,
  LayoutGrid,
  LogOut,
  MessageSquare,
  Scissors,
  Settings,
  Users,
  BarChart3,
  Bell,
  Search,
} from "lucide-react";
import { clearSession } from "@/lib/api";

const main = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/dashboard/services", label: "Services", icon: Scissors },
  { href: "/dashboard/appointments", label: "Appointment", icon: CalendarDays },
  { href: "/dashboard/invoice", label: "Invoice", icon: FileText },
  { href: "/dashboard/clients", label: "Clients", icon: Users },
  { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
];

const others = [
  { href: "/dashboard/feedback", label: "Feedback", icon: MessageSquare },
  { href: "/dashboard/settings", label: "Setting", icon: Settings },
  { href: "/dashboard/help", label: "Help", icon: CircleHelp },
];

export default function DashboardShell({
  shopName,
  children,
}: {
  shopName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-page text-ink">
      <aside className="flex w-[248px] shrink-0 flex-col bg-surface px-5 py-6">
        <Link href="/dashboard" className="mb-8 flex items-center gap-2 text-lg font-bold text-primary">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-primary-soft text-sm">*</span>
          {shopName}
        </Link>
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
          Main menu
        </p>
        <nav className="space-y-1">
          {main.map((item) => (
            <NavLink key={item.href} {...item} active={isActive(pathname, item.href)} />
          ))}
        </nav>
        <p className="mb-2 mt-8 px-3 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
          Others menu
        </p>
        <nav className="space-y-1">
          {others.map((item) => (
            <NavLink key={item.href} {...item} active={pathname === item.href} />
          ))}
        </nav>
        <button
          className="mt-auto flex items-center gap-3 px-3 py-3 text-sm text-ink-secondary"
          onClick={() => {
            clearSession();
            router.push("/");
          }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="flex h-[72px] items-center justify-between bg-surface px-6">
          <label className="flex h-10 w-[280px] items-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm text-ink-muted">
            <Search size={16} />
            <input
              placeholder="Search"
              className="w-full bg-transparent text-ink outline-none placeholder:text-ink-muted"
            />
          </label>
          <div className="flex items-center gap-4 text-ink-secondary">
            <span className="relative">
              <Bell size={18} />
              <i className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#F04452]" />
            </span>
            <span className="relative">
              <MessageSquare size={18} />
              <i className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#3DDC84]" />
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
              {shopName.slice(0, 1)}
            </span>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium ${
        active ? "bg-primary text-white" : "text-ink-secondary hover:bg-surface-muted hover:text-ink"
      }`}
    >
      <Icon size={18} />
      {label}
    </Link>
  );
}
