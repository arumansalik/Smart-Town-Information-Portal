import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
    const data = await req.formData();
    const file = data.get("file") as File;

    if (!file) {
        return Response.json({ error: "No file" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result: any = await new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream({ folder: "shops" }, (err, res) => {
                if (err) reject(err);
                else resolve(res);
            })
            .end(buffer);
    });

    return Response.json({ url: result.secure_url });
}