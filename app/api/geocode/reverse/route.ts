import { NextRequest } from "next/server";
import { reverseGeocode } from "@/lib/reverse-geocode";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
    try {
        const latParam = req.nextUrl.searchParams.get("lat");
        const lngParam = req.nextUrl.searchParams.get("lng");

        if (!latParam || !lngParam) {
            return errorResponse("Missing lat or lng parameter", 400);
        }

        const lat = parseFloat(latParam);
        const lng = parseFloat(lngParam);

        if (Number.isNaN(lat) || Number.isNaN(lng)) {
            return errorResponse("Invalid lat or lng parameter", 400);
        }

        const placeName = await reverseGeocode(lat, lng);

        return successResponse("Location resolved", { placeName }, 200);
    } catch (error) {
        console.error("Reverse geocode API error:", error);
        return errorResponse("Internal Server Error", 500);
    }
}
