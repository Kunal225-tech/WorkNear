/**
 * Reverse geocode coordinates to a human-readable place name using Nominatim.
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
            {
                headers: {
                    "User-Agent": "WorkNearApp/1.0 (contact@worknear.local)",
                },
            }
        );

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        const addr = data.address;
        if (!addr) {
            return data.display_name?.split(",")[0]?.trim() ?? null;
        }

        return (
            addr.suburb ||
            addr.neighbourhood ||
            addr.city ||
            addr.town ||
            addr.village ||
            addr.county ||
            data.display_name?.split(",")[0]?.trim() ||
            null
        );
    } catch (error) {
        console.error("Reverse geocoding error:", error);
        return null;
    }
}
