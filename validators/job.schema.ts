import { z } from "zod";

import { JOB_CATEGORIES } from "@/constants/jobCategories";

export const createJobSchema = z.object({
    title: z
        .string()
        .trim()
        .min(5, "Title must be at least 5 characters")
        .max(100, "Title cannot exceed 100 characters"),

    description: z
        .string()
        .trim()
        .min(10, "Description must be at least 10 characters")
        .max(1000, "Description cannot exceed 1000 characters"),

    category: z.enum(JOB_CATEGORIES),

    payment: z
        .number({
            error: "Payment is required",
        })
        .positive("Payment must be greater than 0"),

    location: z
        .string()
        .trim()
        .min(2, "Location is required")
        .max(100, "Location cannot exceed 100 characters"),

    requiredDate: z.coerce.date({
        error: "Invalid date",
    }),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;