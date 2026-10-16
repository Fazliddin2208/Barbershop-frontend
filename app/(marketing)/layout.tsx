import ClientHeader from "@/components/app/ClientHeader";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-page">
      <ClientHeader />
      {children}
    </div>
  );
}
