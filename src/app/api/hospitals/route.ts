import { connectDB } from "@/lib/db";
import Hospital from "@/models/Hospital";

export async function GET() {
    await connectDB();
    const hospitals = await Hospital.find().sort({ createdAt: -1 });
    return Response.json(hospitals);
}

export async function POST(req: Request) {
    await connectDB();
    const data = await req.json();

    const hospital = await Hospital.create(data);

    return Response.json({
        message: "Hospital added successfully",
        hospital,
    });
}