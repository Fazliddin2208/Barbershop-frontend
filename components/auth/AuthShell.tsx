import { BackLink } from "@/shared/ui/back-link";

export default function AuthShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-page px-4 py-16">
      <div className="mx-auto w-full max-w-md space-y-6">
        <BackLink href="/" />
        <h1 className="text-3xl font-bold">{title}</h1>
        <div className="rounded-2xl bg-surface p-6 shadow-[0_8px_24px_rgba(31,36,48,0.04)]">{children}</div>
      </div>
    </main>
  );
}
