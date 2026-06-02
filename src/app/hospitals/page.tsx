import { connectDB } from "@/lib/db";
import Hospital from "@/models/Hospital";

export default async function HospitalsPage() {
    await connectDB();

    const hospitals = await Hospital.find();

    return (
        <div className="p-4 space-y-6">

            <h1 className="text-3xl font-bold text-red-600">
                🚨 Hospitals
            </h1>

            <div className="space-y-6">

                {hospitals.map((h: any) => (
                    <div
                        key={h._id}
                        className="bg-white rounded-3xl shadow-lg overflow-hidden"
                    >

                        {/* IMAGE */}
                        <img
                            src={h.photo || "/images/hospital.jpg"}
                            className="w-full h-52 object-cover"
                        />

                        <div className="p-5 space-y-3">

                            {/* NAME */}
                            <h2 className="text-xl font-bold">
                                {h.name}
                            </h2>

                            {/* TYPE */}
                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">
                {h.type}
              </span>

                            {/* ADDRESS */}
                            <p className="text-sm text-gray-500">
                                {h.address}
                            </p>

                            {/* ACTIONS */}
                            <div className="flex justify-between pt-3">

                                <a
                                    href={`tel:${h.phone}`}
                                    className="text-red-600 font-semibold"
                                >
                                    📞 Call
                                </a>

                                <a
                                    href={`https://www.google.com/maps?q=${h.location.latitude},${h.location.longitude}`}
                                    target="_blank"
                                    className="text-primary font-semibold"
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