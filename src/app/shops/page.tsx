
import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import Shop from "@/models/Shop";
import ShopBrowser from "@/components/ShopBrowser";

export const metadata: Metadata = {
  title: "Shops & Local Services in Tiruppattur | Namma TPR",
  description:
      "Discover local shops and services in Tiruppattur. Find shop addresses, contact numbers, categories and directions with Namma TPR.",
  alternates: {
    canonical: "/shops",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Shops & Local Services in Tiruppattur | Namma TPR",
    description:
        "Explore local shops and services in Tiruppattur. Find contact details, addresses and directions.",
    url: "https://nammatpr.in/shops",
    siteName: "Namma TPR",
    type: "website",
  },
};

export const revalidate = 3600;

export default async function ShopsPage() {
  let shops: any[] = [];

  try {
    await connectDB();

    const results = await Shop.find({})
        .sort({ createdAt: -1 })
        .lean();

    shops = results.map((shop: any) => ({
      _id: shop._id.toString(),
      name: shop.name,
      category: shop.category,
      address: shop.address,
      phone: shop.phone,
      photo: shop.photo || "",
      location: {
        latitude: shop.location?.latitude,
        longitude: shop.location?.longitude,
      },
      createdAt: shop.createdAt
          ? new Date(shop.createdAt).toISOString()
          : "",
    }));
  } catch (error) {
    console.error("Failed to load shops:", error);
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Shops & Local Services in Tiruppattur",
    description:
        "A directory of local shops and services in Tiruppattur, Tamil Nadu.",
    url: "https://nammatpr.in/shops",
    isPartOf: {
      "@id": "https://nammatpr.in/#website",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: shops.length,
      itemListElement: shops.map((shop, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Thing",
          name: shop.name,
          description: `${shop.category} in ${shop.address}`,
        },
      })),
    },
  };

  return (
      <>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
            }}
        />

        <ShopBrowser initialShops={shops} />
      </>
  );
}
