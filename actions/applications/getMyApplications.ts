

import { connectDB } from "@/db/connect";
import { Application } from "@/models/Application";

export async function getMyApplications(applicantId: string) {
  await connectDB();

  const apps = await Application.find({
    applicant: applicantId,
  })
    .populate(
      "job",
      "title location payment requiredDate status postedBy"
    )
    .sort({
      createdAt: -1,
    })
    .lean();

  return JSON.parse(JSON.stringify(apps));
}