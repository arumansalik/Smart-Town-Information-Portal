import ShopBrowser from "@/components/ShopBrowser";

export default async function ShopCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  return <ShopBrowser categorySlug={category} />;
}
