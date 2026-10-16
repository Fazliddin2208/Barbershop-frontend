export function maskPrice(value: string) {
  const digits = value.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function parsePrice(masked: string) {
  if (!masked.trim()) return Number.NaN;
  return Number(masked.replace(/\s/g, ""));
}

export function formatPrice(value: number) {
  return maskPrice(String(Math.round(value)));
}
