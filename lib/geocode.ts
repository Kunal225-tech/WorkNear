export async function geocodeLocation(location: string): Promise<[number, number] | null> {
    try {
        const query = encodeURIComponent(location);
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`, {
            headers: {
                // Nominatim requires a User-Agent to avoid blocking
                'User-Agent': 'WorkNearApp/1.0 (contact@worknear.local)'
            }
        });
        
        if (!response.ok) {
            console.error(`Geocoding failed for "${location}" with status: ${response.status}`);
            return null;
        }

        const data = await response.json();
        if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            // GeoJSON format is [longitude, latitude]
            return [lon, lat];
        }

        return null;
    } catch (error) {
        console.error("Error during geocoding:", error);
        return null;
    }
}
