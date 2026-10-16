"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";

type Shop = {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string | null;
  services: { name: string }[];
};

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [shops, setShops] = useState<Shop[]>([]);

  function load(q = query) {
    api.get("/public/shops", { params: q ? { q } : {} }).then((response) => setShops(response.data));
  }

  useEffect(() => {
    load("");
  }, []);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    load();
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Find a barbershop</h1>
      <p className="mt-2 text-sm text-ink-secondary">Search by name or address, then book a chair.</p>
      <form onSubmit={onSubmit} className="mt-6 flex gap-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search"
          className="h-10 w-full max-w-md rounded-xl border border-line bg-surface px-3 text-sm outline-none focus:border-primary"
        />
        <button className="h-10 rounded-xl bg-primary px-4 text-sm font-semibold text-white">Search</button>
      </form>
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {shops.length === 0 ? <p className="text-sm text-ink-secondary">No shops match that search.</p> : null}
        {shops.map((shop) => (
          <li key={shop.id} className="rounded-2xl bg-surface p-5 shadow-[0_8px_24px_rgba(31,36,48,0.04)]">
            <h2 className="text-lg font-semibold">{shop.name}</h2>
            <p className="mt-1 text-sm text-ink-secondary">{shop.address}</p>
            {shop.phone ? <p className="text-sm text-ink-secondary">{shop.phone}</p> : null}
            <p className="mt-3 text-xs text-ink-muted">{shop.services.map((service) => service.name).join(" · ") || "No services yet"}</p>
            <Link href={`/s/${shop.slug}`} className="mt-4 inline-block text-sm font-semibold text-primary">
              Book
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
