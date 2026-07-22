import mongoose from "mongoose";
import { connectDB } from "../db/connect";
import { Job } from "../models/Job";

// A simple delay function to respect Nominatim's rate limit (1 request per second)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function geocodeLocation(location: string): Promise<[number, number] | null> {
    try {
        const query = encodeURIComponent(location);
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`, {
            headers: {
                'User-Agent': 'WorkNearApp/1.0-Migration (contact@worknear.local)'
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
            return [lon, lat]; // GeoJSON format
        }

        return null;
    } catch (error) {
        console.error("Error during geocoding:", error);
        return null;
    }
}

async function runMigration() {
    console.log("Starting Geocoding Migration...");
    
    try {
        await connectDB();
        
        // Find jobs that don't have the locationCoordinates field yet
        const jobsToMigrate = await Job.find({ locationCoordinates: { $exists: false } });
        
        console.log(`Found ${jobsToMigrate.length} jobs to migrate.`);

        let successCount = 0;
        let failCount = 0;

        for (const job of jobsToMigrate) {
            console.log(`Processing Job ${job._id} - Location: "${job.location}"`);
            
            const coords = await geocodeLocation(job.location);
            
            if (coords) {
                job.locationCoordinates = {
                    type: 'Point',
                    coordinates: coords
                };
                
                await job.save();
                console.log(`✅ Successfully geocoded and saved Job ${job._id} [${coords}]`);
                successCount++;
            } else {
                console.log(`❌ Failed to geocode Job ${job._id} - Location: "${job.location}"`);
                failCount++;
            }
            
            // Wait 1.5 seconds between requests to avoid rate limiting from Nominatim
            await delay(1500);
        }

        console.log("\n--- Migration Complete ---");
        console.log(`Total processed: ${jobsToMigrate.length}`);
        console.log(`Success: ${successCount}`);
        console.log(`Failed: ${failCount}`);

    } catch (error) {
        console.error("Migration script error:", error);
    } finally {
        // Disconnect from MongoDB if the script is run standalone
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
            console.log("Disconnected from MongoDB.");
        }
        process.exit(0);
    }
}

// Run if executed directly
if (require.main === module) {
    runMigration();
}

export default runMigration;
