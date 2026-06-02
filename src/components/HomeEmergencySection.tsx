import Link from "next/link";

async function getHospitals() {
    const res = await fetch("http://localhost:3000/api/hospitals", {
        cache: "no-store",
    });
    return res.json();
}

export default async function HomeEmergencySection() {
    const hospitals = await getHospitals();

    const topHospitals = hospitals.slice(0, 4);

    return (
        <div className="bg-red-50 rounded-3xl p-5 shadow-md space-y-5">

            {/* 🔥 HEADER */}
            <h2 className="text-xl font-bold text-red-600">
                🚨 Emergency
            </h2>

            {/* 🔥 HERO CARD */}
            <div className="bg-red-600 text-white rounded-2xl p-5 space-y-3 shadow-lg">

                <h3 className="text-lg font-bold">
                    Need Immediate Help?
                </h3>

                <p className="text-sm opacity-90">
                    Call emergency services instantly
                </p>

                <a
                    href="tel:108"
                    className="block bg-white text-red-600 text-center py-3 rounded-xl font-bold mt-2"
                >
                    📞 Call Ambulance (108)
                </a>

            </div>

            {/* 🧱 GRID */}
            <div className="grid grid-cols-2 gap-4">

                {topHospitals.map((h: any) => (
                    <div
                        key={h._id}
                        className="bg-white p-4 rounded-2xl shadow-sm space-y-2"
                    >

                        <h3 className="font-semibold text-sm">
                            {h.name}
                        </h3>

                        <p className="text-xs text-gray-500">
                            {h.type}
                        </p>

                        <a
                            href={`tel:${h.phone}`}
                            className="text-red-600 text-sm font-semibold"
                        >
                            📞 Call
                        </a>

                    </div>
                ))}

            </div>

            {/* VIEW ALL */}
            <Link href="/hospitals" className="block text-center text-red-600 font-medium">
                View all hospitals →
            </Link>

        </div>
    );
}