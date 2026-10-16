"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { addServiceImage, getService, removeServiceImage, type Service } from "@/entities/service";
import { errorMessage } from "@/shared/api";
import { assetUrl } from "@/shared/lib/asset";
import { formatPrice } from "@/shared/lib/price";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { BackLink } from "@/shared/ui/back-link";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ServiceDetails({ shopId, serviceId }: { shopId: string; serviceId: string }) {
  const [service, setService] = useState<Service | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const load = useCallback(async () => {
    setService(await getService(shopId, serviceId));
  }, [shopId, serviceId]);

  useEffect(() => {
    load().catch((err) => setError(errorMessage(err)));
  }, [load]);

  async function onAddImages(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem("images");
    const files = input instanceof HTMLInputElement ? Array.from(input.files ?? []) : [];
    if (files.length === 0) {
      setError("Choose at least one image");
      return;
    }
    if (files.some((file) => !IMAGE_TYPES.includes(file.type))) {
      setError("Images must be JPG, PNG, or WebP");
      return;
    }
    setPending(true);
    setError("");
    try {
      let latest: Service | null = null;
      for (const file of files) {
        latest = await addServiceImage(shopId, serviceId, file, false);
      }
      if (latest) setService(latest);
      event.currentTarget.reset();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setPending(false);
    }
  }

  async function onRemove(imageId: string) {
    setPending(true);
    setError("");
    try {
      setService(await removeServiceImage(shopId, serviceId, imageId));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setPending(false);
    }
  }

  const main = service?.images.find((image) => image.isMain) ?? service?.images[0];

  return (
    <div className="grid gap-4">
      <BackLink href="/dashboard/services" />
      {!service ? <p className="text-sm text-ink-secondary">{error || "Loading service..."}</p> : null}
      {service ? (
        <Card className="shadow-[0_8px_24px_rgba(23,32,51,0.04)]">
          <CardHeader>
            <CardTitle>{service.name}</CardTitle>
            <p className="text-sm text-ink-secondary">
              {service.durationMin} min · {formatPrice(service.price)}
            </p>
          </CardHeader>
          <CardContent className="grid gap-6">
            {main ? (
              <img src={assetUrl(main.url)} alt={service.name} className="max-h-96 max-w-full rounded-xl" />
            ) : (
              <div className="grid h-48 place-items-center rounded-xl bg-primary-soft text-sm text-ink-secondary">No main image</div>
            )}
            <form onSubmit={onAddImages} className="grid gap-3">
              <Label htmlFor="service-images">Add images</Label>
              <Input id="service-images" name="images" type="file" accept="image/jpeg,image/png,image/webp" multiple />
              <Button type="submit" disabled={pending} className="w-fit">
                {pending ? "Saving..." : "Upload"}
              </Button>
            </form>
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            {service.images.length > 0 ? (
              <ul className="grid gap-3 sm:grid-cols-3">
                {service.images.map((image) => (
                  <li key={image.id} className="w-fit overflow-hidden rounded-xl border border-line">
                    <img src={assetUrl(image.url)} alt="" className="max-h-48 max-w-full" />
                    <div className="flex items-center justify-between px-3 py-2 text-xs">
                      <span className="font-semibold text-ink-secondary">{image.isMain ? "Main" : "Gallery"}</span>
                      <button type="button" className="text-danger" disabled={pending} onClick={() => onRemove(image.id)}>
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
