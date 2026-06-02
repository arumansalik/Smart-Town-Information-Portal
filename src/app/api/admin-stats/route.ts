import { connectDB } from "@/lib/db";
import Shop from "@/models/Shop";
import Job from "@/models/Job";
import Bus from "@/models/Bus";
import Hospital from "@/models/Hospital";
import Tourism from "@/models/Tourism";


export async function GET() {
    await connectDB();

    const [shops, jobs, buses, hospitals, tourism, pendingJobs] = await Promise.all([
        Shop.countDocuments(),
        Job.countDocuments(),
        Bus.countDocuments(),
        Hospital.countDocuments(),
        Tourism.countDocuments(),
        Job.countDocuments({ status: "pending" }),
    ]);

    return Response.json({
        shops,
        jobs,
        buses,
        hospitals,
        tourism,
        pendingJobs,
    });
}