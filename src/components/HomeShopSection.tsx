"use client";

import Link from "next/link";
import {
    Wrench,
    ShoppingCart,
    Truck,
    Landmark,
    Hotel,
    ArrowRight,
    Store,
} from "lucide-react";

const categories = [
    {
        name: "AC Mechanics",
        icon: Wrench,
        color: "from-blue-100 to-blue-200",
    },
    {
        name: "Super Market",
        icon: ShoppingCart,
        color: "from-green-100 to-green-200",
    },
    {
        name: "Courier",
        icon: Truck,
        color: "from-yellow-100 to-yellow-200",
    },
    {
        name: "ATM",
        icon: Landmark,
        color: "from-purple-100 to-purple-200",
    },
    {
        name: "Hotels",
        icon: Hotel,
        color: "from-orange-100 to-orange-200",
    },
];

export default function HomeShopSection() {
    return (
        <div className="bg-white rounded-3xl p-5 shadow-md space-y-5">

            {/* HEADER */}
            <div className="flex items-center gap-2">
                <Store className="text-primary" />
                <h2 className="text-xl font-bold">Shops</h2>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-2 gap-4">

                {categories.map((cat, i) => {
                    const Icon = cat.icon;

                    const slug = cat.name.toLowerCase().replace(/\s+/g, "-");

                    return (
                        <Link key={i} href={`/shops/${slug}`}>
                            <div
                                className={`rounded-2xl p-5 bg-gradient-to-br ${cat.color}
                flex flex-col items-center justify-center text-center
                shadow-sm hover:shadow-md transition hover:scale-[1.03]`}
                            >
                                <Icon className="w-8 h-8 mb-2 text-dark" />
                                <p className="font-semibold text-sm">{cat.name}</p>
                            </div>
                        </Link>
                    );
                })}

                {/* VIEW MORE */}
                <Link href="/shops">
                    <div className="rounded-2xl p-5 bg-gradient-to-br from-gray-100 to-gray-200
            flex flex-col items-center justify-center text-center
            shadow-sm hover:shadow-md transition hover:scale-[1.03]"
                    >
                        <ArrowRight className="w-8 h-8 mb-2 text-primary" />
                        <p className="font-semibold text-sm">View More</p>
                    </div>
                </Link>

            </div>
        </div>
    );
}