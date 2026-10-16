"use client";

import { FormEvent, useEffect, useState } from "react";
import { addServiceImage, createService } from "@/entities/service";
import { errorMessage } from "@/shared/api";
import { parsePrice } from "@/shared/lib/price";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { PriceInput } from "@/shared/ui/price-input";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function AddServiceDialog({
  shopId,
  onCreated,
}: {
  shopId: string;
  onCreated: () => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [durationMin, setDurationMin] = useState("30");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!image) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  function reset() {
    setName("");
    setDurationMin("30");
    setPrice("");
    setImage(null);
    setError("");
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const minutes = Number(durationMin);
    const amount = parsePrice(price);
    if (name.trim().length < 2) {
      setError("Name needs at least 2 characters");
      return;
    }
    if (!Number.isInteger(minutes) || minutes < 5) {
      setError("Minutes must be a whole number of at least 5");
      return;
    }
    if (!Number.isFinite(amount) || amount < 0) {
      setError("Price must be 0 or more");
      return;
    }
    if (image && !IMAGE_TYPES.includes(image.type)) {
      setError("Main image must be JPG, PNG, or WebP");
      return;
    }

    setPending(true);
    setError("");
    try {
      const created = await createService(shopId, { name: name.trim(), durationMin: minutes, price: amount });
      if (image) {
        await addServiceImage(shopId, created.id, image, true);
      }
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
        <Button>Add service</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add a service</DialogTitle>
          <DialogDescription>Name, length, price, and one main image.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="service-name">Name</Label>
            <Input id="service-name" value={name} onChange={(event) => setName(event.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="service-minutes">Minutes</Label>
            <Input
              id="service-minutes"
              type="number"
              min={5}
              step={1}
              value={durationMin}
              onChange={(event) => setDurationMin(event.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="service-price">Price</Label>
            <PriceInput id="service-price" value={price} onChange={setPrice} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="service-image">Main image</Label>
            <Input
              id="service-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => setImage(event.target.files?.[0] ?? null)}
            />
            {preview ? <img src={preview} alt="" className="max-h-64 max-w-full rounded-xl" /> : null}
          </div>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Save service"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
