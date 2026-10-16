"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/auth/LoginForm";
import { api, errorMessage, saveSession } from "@/lib/api";

export default function JoinPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const { data } = await api.post("/auth/register/client", { name, email, password, phone });
      saveSession(data.accessToken, "");
      router.push("/bookings");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <h1 className="text-3xl font-bold">Create a client account</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-2xl bg-surface p-6 shadow-[0_8px_24px_rgba(31,36,48,0.04)]">
        <Field label="Name" value={name} onChange={setName} />
        <Field label="Email" type="email" value={email} onChange={setEmail} />
        <Field label="Phone" value={phone} onChange={setPhone} />
        <Field label="Password" type="password" value={password} onChange={setPassword} />
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Creating..." : "Join"}
        </Button>
        <p className="text-sm text-ink-secondary">
          Already joined? <Link href="/login" className="text-primary">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
