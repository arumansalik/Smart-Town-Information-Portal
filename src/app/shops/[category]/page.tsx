
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Shop from "@/models/Shop";
import ShopBrowser from "@/components/ShopBrowser";

type Props = {
  params: Promise<{
    category: string;
  }>;
};

type ShopData = {
  _id: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  photo?: string;
  location?: {
    latitude?: number;
    longitude?: number;
  };
  createdAt?: string;
};

function slugify(value: string) {
  return value
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
}

function titleCase(value: string) {
  return value
      .replace(/-/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
      .replace(/\bAc\b/g, "AC")
      .replace(/\bAtm\b/g, "ATM");
}

async function getCategoryShops(
    categorySlug: string
): Promise<ShopData[]> {
  await connectDB();

  const results = await Shop.find({})
      .sort({ createdAt: -1 })
      .lean();

  return results
      .filter(
          (shop: any) =>
              slugify(shop.category || "") === categorySlug
      )
      .map((shop: any) => ({
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
}

export async function generateMetadata({
                                         params,
                                       }: Props): Promise<Metadata> {
  const { category } = await params;
  const categoryName = titleCase(category);

  try {
    const shops = await getCategoryShops(category);

    if (shops.length === 0) {
      return {
        title: `${categoryName} in Tiruppattur | Namma TPR`,
        robots: {
          index: false,
          follow: true,
        },
      };
    }

    return {
      title: `${categoryName} in Tiruppattur | Local Shops & Services`,
      description: `Find ${categoryName.toLowerCase()} in Tiruppattur. Explore ${shops.length} local listings, addresses and contact details on Namma TPR.`,
      alternates: {
        canonical: `/shops/${category}`,
      },
      robots: {
        index: true,
        follow: true,
      },
      openGraph: {
        title: `${categoryName} in Tiruppattur | Namma TPR`,
        description: `Discover local ${categoryName.toLowerCase()} in Tiruppattur with contact details and directions.`,
        url: `https://nammatpr.in/shops/${category}`,
        siteName: "Namma TPR",
        type: "website",
      },
    };
  } catch (error) {
    console.error("Category metadata error:", error);

    return {
      title: `${categoryName} in Tiruppattur | Namma TPR`,
      robots: {
        index: false,
        follow: true,
      },
    };
  }
}

export const revalidate = 3600;

export default async function ShopCategoryPage({
                                                 params,
                                               }: Props) {
  const { category } = await params;

  let shops: ShopData[];

  try {
    shops = await getCategoryShops(category);
  } catch (error) {
    console.error("Failed to load category shops:", error);
    throw error;
  }

  if (shops.length === 0) {
    notFound();
  }

  const categoryName = shops[0].category;
  const pageUrl = `https://nammatpr.in/shops/${category}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${categoryName} in Tiruppattur`,
    description: `Find local ${categoryName.toLowerCase()} in Tiruppattur, Tamil Nadu.`,
    url: pageUrl,
    isPartOf: {
      "@id": "https://nammatpr.in/#website",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://nammatpr.in",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Shops",
          item: "https://nammatpr.in/shops",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: categoryName,
          item: pageUrl,
        },
      ],
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
              __html: JSON.stringify(structuredData).replace(
                  /</g,
                  "\\u003c"
              ),
            }}
        />

        <ShopBrowser
            categorySlug={category}
            initialShops={shops}
        />
      </>
  );
}
