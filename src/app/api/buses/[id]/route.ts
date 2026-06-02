import { connectDB } from "@/lib/db";
import Bus from "@/models/Bus";

// 🔥 GET SINGLE BUS
export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    await connectDB();

    const { id } = await context.params;

    const bus = await Bus.findById(id);

    return Response.json(bus);
}

// 🔥 UPDATE BUS
export async function PUT(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    await connectDB();

    const { id } = await context.params;
    const data = await req.json();

    const updated = await Bus.findByIdAndUpdate(id, data, {
        new: true,
    });

    return Response.json({
        message: "Bus updated successfully",
        updated,
    });
}

// 🔥 DELETE BUS
export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    await connectDB();

    const { id } = await context.params;

    await Bus.findByIdAndDelete(id);

    return Response.json({
        message: "Bus deleted successfully",
    });
}