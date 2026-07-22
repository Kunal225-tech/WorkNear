

import { connectDB } from "@/db/connect";
import { Application } from "@/models/Application";

interface CreateApplicationParams {
    job: string;
    applicant: string | undefined;
}

export async function createApplication({
    job,
    applicant,
}: CreateApplicationParams) {
    await connectDB();

    const app = await Application.create({
        job,
        applicant,
    });

    return JSON.parse(JSON.stringify(app));
}