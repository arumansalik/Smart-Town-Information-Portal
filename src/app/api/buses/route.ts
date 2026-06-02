import { connectDB } from "@/lib/db";
import Bus from "@/models/Bus";

// 🔥 GET ALL BUSES
export async function GET() {
    await connectDB();

    const buses = await Bus.find().sort({ createdAt: -1 });

    return Response.json(buses);
}

// 🔥 CREATE BUS
export async function POST(req: Request) {
    await connectDB();

    const data = await req.json();

    const bus = await Bus.create(data);

    return Response.json({
        message: "Bus added successfully",
        bus,
    });
}