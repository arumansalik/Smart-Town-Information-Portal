import { connectDB } from "@/lib/db";
import Shop from "@/models/Shop";
import { Phone, MapPin } from "lucide-react";



export default async function CategoryPage(props: any) {
    await connectDB();

    // ✅ FIX: params is async → await it
    const params = await props.params;

    const rawCategory = params?.category;

    console.log("PARAM:", rawCategory);

    if (!rawCategory) {
        return <div className="p-4">Category not found</div>;
    }

    const formattedCategory = rawCategory
        .replace(/-/g, " ")
        .toLowerCase()
        .trim();

    console.log("FORMATTED:", formattedCategory);

    const shops = await Shop.find({
        category: formattedCategory,
    });

    return (
        <div className="p-4 space-y-5">

            <h1 className="text-2xl font-bold capitalize">
                {formattedCategory} Shops
            </h1>

            {shops.length === 0 && (
                <p className="text-gray-500">No shops found</p>
            )}

            <div className="space-y-6">

                {shops.map((shop: any) => (
                    <div
                        key={shop._id}
                        className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100"
                    >

                        {/* 🔥 CATEGORY TAG */}
                        <div className="absolute z-10 m-3">
        <span className="bg-primary text-white text-xs px-3 py-1 rounded-full shadow">
          {shop.category}
        </span>
                        </div>

                        {/* IMAGE */}
                        <div className="relative">
                            <img
                                src={shop.photo || "/images/shop.jpg"}
                                className="w-full h-56 object-cover"
                            />
                        </div>

                        {/* CONTENT */}
                        <div className="p-5 space-y-3">

                            {/* NAME */}
                            <h2 className="text-2xl font-bold text-dark leading-tight">
                                {shop.name}
                            </h2>

                            {/* ADDRESS */}
                            <p className="text-sm text-gray-500">
                                {shop.address}
                            </p>

                            {/* 🔥 ACTION BUTTONS (LEFT + RIGHT) */}
                            <div className="flex justify-between items-center pt-3">

                                {/* CALL */}
                                <a
                                    href={`tel:${shop.phone}`}
                                    className="flex items-center gap-2 text-primary font-semibold text-sm
            bg-green-50 px-4 py-2 rounded-lg hover:bg-green-100 transition"
                                >
                                    📞 Call
                                </a>

                                {/* MAP */}
                                <a
                                    href={`https://www.google.com/maps?q=${shop.location.latitude},${shop.location.longitude}`}
                                    target="_blank"
                                    className="flex items-center gap-2 text-accent font-semibold text-sm
            bg-orange-50 px-4 py-2 rounded-lg hover:bg-orange-100 transition"
                                >
                                    📍 Directions
                                </a>

                            </div>

                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}