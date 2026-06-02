import { connectDB } from "@/lib/db";
import Shop from "@/models/Shop";

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    await connectDB();

    const { id } = await context.params; // 🔥 FIX

    const shop = await Shop.findById(id);

    return Response.json(shop);
}

export async function PUT(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    await connectDB();

    const { id } = await context.params; // 🔥 FIX

    const data = await req.json();

    const updated = await Shop.findByIdAndUpdate(id, data, {
        new: true,
    });

    return Response.json(updated);
}

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    await connectDB();

    const { id } = await context.params;

    await Shop.findByIdAndDelete(id);

    return Response.json({ message: "Deleted successfully" });
}