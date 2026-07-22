

import { connectDB } from "@/db/connect";
import { Application } from "@/models/Application";

interface GetApplicationParams {
    job: string;
    applicant: string;
}

export async function getApplication({
    job,
    applicant,
}: GetApplicationParams) {
    await connectDB();

    const app = await Application.findOne({
        job,
        applicant,
    }).lean();

    return app ? JSON.parse(JSON.stringify(app)) : null;
}