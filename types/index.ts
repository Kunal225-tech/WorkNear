import { JOB_CATEGORIES } from "@/constants/jobCategories";
import { JOB_STATUS } from "@/constants/jobStatus";

// ─── User ───────────────────────────────────────────────
export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  location?: string;
  skills?: string[];
  profileImage?: string;
  authProvider?: "credentials" | "google";
  isVerified?: boolean;
  savedJobs?: string[];
  createdAt: string;
  updatedAt?: string;
}

// ─── Review ─────────────────────────────────────────────
export interface Review {
  _id: string;
  job: Job | string;
  reviewer: User | string;
  reviewee: User | string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateReviewInput {
  jobId: string;
  revieweeId: string;
  rating: number;
  comment: string;
}

export interface ToggleSaveResponse {
  saved: boolean;
}

// ─── Job ────────────────────────────────────────────────
export type JobCategory = (typeof JOB_CATEGORIES)[number];
export type JobStatus = (typeof JOB_STATUS)[number];

export interface Job {
  _id: string;
  title: string;
  description: string;
  category: JobCategory;
  payment: number;
  location: string;
  requiredDate: string;
  status: JobStatus;
  postedBy: User | string;
  images?: string[];
  createdAt: string;
  updatedAt?: string;
}

// ─── Application ────────────────────────────────────────
export type ApplicationStatus = "pending" | "accepted" | "rejected" | "withdrawn";

export interface Application {
  _id: string;
  job: Job | string;
  applicant: User | string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt?: string;
}

// ─── API Response Envelope ──────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

// ─── Form Inputs ────────────────────────────────────────
export interface CreateJobInput {
  title: string;
  description: string;
  category: JobCategory;
  payment: number;
  location: string;
  requiredDate: string;
  images?: string[];
}

export interface UpdateJobInput {
  title?: string;
  description?: string;
  category?: JobCategory;
  payment?: number;
  location?: string;
  requiredDate?: string;
  images?: string[];
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

// ─── Helpers ────────────────────────────────────────────
export function getPostedById(postedBy: User | string): string {
  if (typeof postedBy === "object" && postedBy !== null && "_id" in postedBy) {
    return postedBy._id;
  }
  return String(postedBy);
}

export function getPostedByUser(postedBy: User | string): User | null {
  if (typeof postedBy === "object" && postedBy !== null && "_id" in postedBy) {
    return postedBy;
  }
  return null;
}

export function getApplicantUser(applicant: User | string): User | null {
  if (typeof applicant === "object" && applicant !== null && "_id" in applicant) {
    return applicant;
  }
  return null;
}

export function getApplicationJob(job: Job | string): Job | null {
  if (typeof job === "object" && job !== null && "_id" in job) {
    return job;
  }
  return null;
}

export function getReviewerUser(reviewer: User | string): User | null {
  if (typeof reviewer === "object" && reviewer !== null && "_id" in reviewer) {
    return reviewer;
  }
  return null;
}
