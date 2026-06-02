import { connectDB } from "@/lib/db";
import Job from "@/models/Job";

// ✅ GET SINGLE JOB
export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    await connectDB();

    const { id } = await context.params;

    const job = await Job.findById(id);

    if (!job) {
        return Response.json({ message: "Job not found" }, { status: 404 });
    }

    return Response.json(job);
}

// ✅ UPDATE JOB
export async function PUT(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    await connectDB();

    const { id } = await context.params;
    const data = await req.json();

    const updated = await Job.findByIdAndUpdate(id, data, {
        new: true,
    });

    return Response.json({
        message: "Job updated successfully",
        updated,
    });
}

// ✅ DELETE JOB
export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    await connectDB();

    const { id } = await context.params;

    await Job.findByIdAndDelete(id);

    return Response.json({
        message: "Job deleted successfully",
    });
}