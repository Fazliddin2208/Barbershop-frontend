export function assetUrl(path: string) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";
  return `${base}${path}`;
}
