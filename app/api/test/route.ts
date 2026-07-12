import { NextResponse } from "next/server";
import { connectDB } from "@/db/connect";

export async function GET() {
  await connectDB();

  return NextResponse.json({
    message: "Database Connected Successfully 🚀",
  });
}