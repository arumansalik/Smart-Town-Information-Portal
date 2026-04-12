import { connectDB } from "@/lib/db";
import Job from "@/models/Job";

export async function GET() {
    await connectDB();
    const jobs = await Job.find().sort({ createdAt: -1 });
    return Response.json(jobs);
}

export async function POST(req: Request) {
    await connectDB();
    const data = await req.json();

    const job = await Job.create(data);

    return Response.json({
        message: "Job added successfully",
        job,
    });
}