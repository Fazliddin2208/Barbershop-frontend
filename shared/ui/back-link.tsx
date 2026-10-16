import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function BackLink({ href }: { href: string }) {
  return (
    <Link href={href} className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-ink">
      <ArrowLeft size={16} />
      Back
    </Link>
  );
}
