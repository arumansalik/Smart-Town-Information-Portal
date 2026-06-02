import { connectDB } from "@/lib/db";
import Hospital from "@/models/Hospital";

// ✅ GET SINGLE HOSPITAL
export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    await connectDB();

    const { id } = await context.params;

    const hospital = await Hospital.findById(id);

    if (!hospital) {
        return Response.json(
            { message: "Hospital not found" },
            { status: 404 }
        );
    }

    return Response.json(hospital);
}

// ✅ UPDATE HOSPITAL
export async function PUT(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    await connectDB();

    const { id } = await context.params;
    const data = await req.json();

    const updated = await Hospital.findByIdAndUpdate(id, data, {
        new: true,
    });

    return Response.json({
        message: "Hospital updated successfully",
        updated,
    });
}

// ✅ DELETE HOSPITAL
export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    await connectDB();

    const { id } = await context.params;

    await Hospital.findByIdAndDelete(id);

    return Response.json({
        message: "Hospital deleted successfully",
    });
}