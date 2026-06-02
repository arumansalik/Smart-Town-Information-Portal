import { connectDB } from "@/lib/db";
import Shop from "@/models/Shop";
import Job from "@/models/Job";
import Bus from "@/models/Bus";

export async function GET(req: Request) {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (!query) {
        return Response.json({
            shops: [],
            jobs: [],
            buses: [],
        });
    }

    const regex = new RegExp(query, "i"); // 🔥 case-insensitive

    const [shops, jobs, buses] = await Promise.all([
        Shop.find({
            $or: [{ name: regex }, { category: regex }, { address: regex }],
        }).limit(5),

        Job.find({
            $or: [{ role: regex }, { companyName: regex }],
        }).limit(5),

        Bus.find({
            $or: [{ route: regex }, { busName: regex }],
        }).limit(5),
    ]);

    return Response.json({ shops, jobs, buses });
}