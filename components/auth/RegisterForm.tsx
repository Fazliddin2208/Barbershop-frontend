"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { api, errorMessage, saveSession } from "@/lib/api";
import { Field } from "./LoginForm";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shopName, setShopName] = useState("");
  const [address, setAddress] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
        shopName,
        address,
        slug,
      });
      saveSession(data.accessToken, data.shop.id);
      router.push("/dashboard");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Your name" value={name} onChange={setName} />
      <Field label="Email" type="email" value={email} onChange={setEmail} />
      <Field label="Password" type="password" value={password} onChange={setPassword} />
      <Field
        label="Shop name"
        value={shopName}
        onChange={(value) => {
          setShopName(value);
          if (!slugEdited) setSlug(slugify(value));
        }}
      />
      <Field label="Address" value={address} onChange={setAddress} />
      <Field
        label="Booking link"
        value={slug}
        onChange={(value) => {
          setSlugEdited(true);
          setSlug(slugify(value));
        }}
      />
      <p className="text-sm text-ink-secondary">
        Customers will book at /s/{slug || "your-shop"}
      </p>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Creating shop..." : "Create shop"}
      </Button>
      <p className="text-sm text-ink-secondary">
        Already have a shop?{" "}
        <Link href="/login" className="underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
