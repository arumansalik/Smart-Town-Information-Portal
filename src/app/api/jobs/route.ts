
import { connectDB } from "@/lib/db";
import Job from "@/models/Job";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");

        const query = status ? { status } : {};

        const jobs = await Job.find(query)
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(jobs, {
            status: 200,
            headers: {
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        console.error("GET /api/jobs error:", error);

        return NextResponse.json(
            { message: "Unable to fetch jobs" },
            { status: 500 }
        );
    }
}
