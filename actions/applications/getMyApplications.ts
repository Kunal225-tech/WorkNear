import { connectDB } from "@/db/connect";
import { Application } from "@/models/Application";
import "@/models/Job"; // required so Mongoose has the Job schema registered for .populate()

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