import { connectDB } from "@/lib/db";
import Shop from "@/models/Shop";
import { Phone, MapPin } from "lucide-react";

export default async function ShopList({ category }: any) {
    await connectDB();

    const shops = await Shop.find({
        category: category.toLowerCase(),
    });

    return (
        <div className="p-4 space-y-5">

            <h1 className="text-2xl font-bold capitalize">
                {category} Shops
            </h1>

            <div className="space-y-4">

                {shops.map((shop: any) => (
                    <div
                        key={shop._id}
                        className="bg-white rounded-3xl shadow-md overflow-hidden"
                    >

                        {/* IMAGE */}
                        <img
                            src={shop.photo}
                            className="w-full h-48 object-cover"
                        />

                        {/* CONTENT */}
                        <div className="p-4">

                            <h2 className="text-xl font-bold">
                                {shop.name}
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                {shop.address}
                            </p>

                            {/* ACTIONS */}
                            <div className="flex justify-between mt-4">

                                {/* CALL */}
                                <a
                                    href={`tel:${shop.phone}`}
                                    className="flex items-center gap-2 text-primary font-medium"
                                >
                                    <Phone size={18} />
                                    Call
                                </a>

                                {/* MAP */}
                                <a
                                    href={`https://www.google.com/maps?q=${shop.location.latitude},${shop.location.longitude}`}
                                    target="_blank"
                                    className="flex items-center gap-2 text-accent font-medium"
                                >
                                    <MapPin size={18} />
                                    Directions
                                </a>

                            </div>

                        </div>

                    </div>
                ))}

            </div>

        </div>
    );
}