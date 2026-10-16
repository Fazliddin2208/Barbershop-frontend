import Link from "next/link";

export default function ClientHeader() {
  return (
    <header className="flex h-[72px] items-center justify-between bg-surface px-8">
      <Link href="/" className="flex items-center gap-2 text-lg font-bold text-primary">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-primary-soft text-sm">*</span>
        Fresh Fades
      </Link>
      <nav className="flex items-center gap-4 text-sm font-medium text-ink-secondary">
        <Link href="/bookings">My bookings</Link>
        <Link href="/login">Log in</Link>
        <Link href="/join" className="rounded-xl bg-primary px-4 py-2 text-white">
          Join
        </Link>
        <Link href="/register">Open a shop</Link>
      </nav>
    </header>
  );
}
