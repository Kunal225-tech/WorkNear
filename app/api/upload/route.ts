import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getApiAuthUser } from "@/lib/api-auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  // Require authentication before processing any uploads
  const authUser = await getApiAuthUser(request);
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll("file") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    // Process each file sequentially
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to Cloudinary using upload_stream
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "worknear_jobs" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      uploadedUrls.push((uploadResult as any).secure_url);
    }

    return NextResponse.json({ urls: uploadedUrls });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

