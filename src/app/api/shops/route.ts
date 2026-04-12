import { connectDB } from "@/lib/db";
import Shop from "@/models/Shop";

export async function GET() {
    await connectDB();
    const shops = await Shop.find().sort({ createdAt: -1 });
    return Response.json(shops);
}

export async function POST(req: Request) {
    await connectDB();
    const data = await req.json();

    const shop = await Shop.create(data);

    return Response.json({
        message: "Shop added successfully",
        shop,
    });
}