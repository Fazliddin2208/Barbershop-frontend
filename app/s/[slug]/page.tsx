import PublicBooking from "@/components/booking/PublicBooking";

export default async function ShopPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PublicBooking slug={slug} />;
}
