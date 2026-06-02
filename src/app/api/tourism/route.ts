import { connectDB } from "@/lib/db";
import Tourism from "@/models/Tourism";

export async function GET() {
    await connectDB();

    const data = await Tourism.find();

    return Response.json(data);
}

export async function POST(req: Request) {
    await connectDB();

    const body = await req.json();

    const item = await Tourism.create(body);

    return Response.json(item);
}