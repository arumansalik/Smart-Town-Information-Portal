import { connectDB } from "@/lib/db";
import Tourism from "@/models/Tourism";

export default async function TourismPage() {
    await connectDB();

    const data = await Tourism.find();

    return (
        <div className="p-4 space-y-5">

            <h1 className="text-2xl font-bold">
                🌍 Culture & Tourism
            </h1>

            <div className="space-y-5">

                {data.map((item: any) => (
                    <div
                        key={item._id}
                        className="bg-white rounded-3xl shadow overflow-hidden"
                    >

                        {/* IMAGE */}
                        <img
                            src={item.image}
                            className="w-full h-48 object-cover"
                        />

                        {/* CONTENT */}
                        <div className="p-4 space-y-3">

                            <h2 className="text-xl font-bold">
                                {item.title}
                            </h2>

                            <p className="text-sm text-gray-600 line-clamp-3">
                                {item.description}
                            </p>

                            <p className="text-xs text-gray-400">
                                📍 {item.place}
                            </p>

                            {/* 🔥 ACTION BUTTONS */}
                            <div className="flex justify-between items-center pt-2">

                                {/* DIRECTIONS */}
                                <a
                                    href={`https://www.google.com/maps?q=${item.location.latitude},${item.location.longitude}`}
                                    target="_blank"
                                    className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold"
                                >
                                    📍 Get Directions
                                </a>

                            </div>

                        </div>

                    </div>
                ))}

            </div>
        </div>
    );
}