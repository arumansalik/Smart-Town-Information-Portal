import { connectDB } from "@/lib/db";
import Tourism from "@/models/Tourism";

// GET ONE
export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    await connectDB();
    const { id } = await context.params;

    const item = await Tourism.findById(id);

    return Response.json(item);
}

// UPDATE
export async function PUT(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    await connectDB();
    const { id } = await context.params;

    const data = await req.json();

    const updated = await Tourism.findByIdAndUpdate(id, data, {
        new: true,
    });

    return Response.json(updated);
}

// DELETE
export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    await connectDB();
    const { id } = await context.params;

    await Tourism.findByIdAndDelete(id);

    return Response.json({ message: "Deleted successfully" });
}