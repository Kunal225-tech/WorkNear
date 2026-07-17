"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, ArrowRight, IndianRupee, MapPin, Calendar } from "lucide-react";
import { createJobSchema } from "@/validators/job.schema";
import { JOB_CATEGORIES } from "@/constants/jobCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateJob, useUpdateJob } from "@/hooks/use-jobs";
import type { Job } from "@/types";

// Client-side schema adapted from createJobSchema for HTML input strings
const jobFormSchema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(1000),
  category: z.enum(JOB_CATEGORIES),
  payment: z.coerce.number().positive("Payment must be greater than 0"),
  location: z.string().trim().min(2, "Location is required").max(100),
  requiredDate: z.string().min(1, "Please select a required completion date"),
});

type JobFormData = z.infer<typeof jobFormSchema>;

interface JobFormProps {
  mode: "create" | "edit";
  initialData?: Job;
}

export function JobForm({ mode, initialData }: JobFormProps) {
  const router = useRouter();
  const createMutation = useCreateJob();
  const updateMutation = useUpdateJob();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format initial requiredDate to YYYY-MM-DD for date input
  const defaultDate = initialData?.requiredDate
    ? new Date(initialData.requiredDate).toISOString().split("T")[0]
    : "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      category: initialData?.category || JOB_CATEGORIES[0],
      payment: initialData?.payment || ("" as any),
      location: initialData?.location || "",
      requiredDate: defaultDate,
    },
  });

  const onSubmit = async (data: JobFormData) => {
    setIsSubmitting(true);
    try {
      if (mode === "create") {
        const newJob = await createMutation.mutateAsync({
          title: data.title,
          description: data.description,
          category: data.category,
          payment: Number(data.payment),
          location: data.location,
          requiredDate: data.requiredDate,
        });
        toast.success("Job posted successfully! Workers can now discover your task.");
        router.push(`/jobs/${newJob._id}`);
      } else if (mode === "edit" && initialData) {
        await updateMutation.mutateAsync({
          id: initialData._id,
          data: {
            title: data.title,
            description: data.description,
            category: data.category,
            payment: Number(data.payment),
            location: data.location,
            requiredDate: data.requiredDate,
          },
        });
        toast.success("Job updated successfully!");
        router.push(`/dashboard/my-jobs`);
      }
    } catch (error: any) {
      toast.error(error.message || `Failed to ${mode} job. Please check input details.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-lg border-border/80">
      <CardContent className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="font-semibold">
              Job Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g. Fix leaky bathroom pipe & check kitchen sink"
              className="h-11 rounded-xl"
              disabled={isSubmitting}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs font-medium text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Category & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="font-semibold">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                id="category"
                className="h-11 rounded-xl"
                disabled={isSubmitting}
                {...register("category")}
              >
                {JOB_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Select>
              {errors.category && (
                <p className="text-xs font-medium text-destructive">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment" className="font-semibold">
                Total Budget (₹) <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="payment"
                  type="number"
                  placeholder="e.g. 1500"
                  className="pl-9 h-11 rounded-xl"
                  disabled={isSubmitting}
                  {...register("payment")}
                />
              </div>
              {errors.payment && (
                <p className="text-xs font-medium text-destructive">{errors.payment.message}</p>
              )}
            </div>
          </div>

          {/* Location & Required Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="font-semibold">
                Location / Neighborhood <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="e.g. Indiranagar, Bangalore"
                  className="pl-9 h-11 rounded-xl"
                  disabled={isSubmitting}
                  {...register("location")}
                />
              </div>
              {errors.location && (
                <p className="text-xs font-medium text-destructive">{errors.location.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="requiredDate" className="font-semibold">
                Required Completion Date <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="requiredDate"
                  type="date"
                  className="pl-9 h-11 rounded-xl"
                  disabled={isSubmitting}
                  {...register("requiredDate")}
                />
              </div>
              {errors.requiredDate && (
                <p className="text-xs font-medium text-destructive">{errors.requiredDate.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="font-semibold">
              Full Job Description & Requirements <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Provide specific details about what needs to be done, required tools, timeframe, and any special notes for the worker..."
              className="min-h-[160px] rounded-xl leading-relaxed"
              disabled={isSubmitting}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs font-medium text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl px-6 h-11"
              disabled={isSubmitting}
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl px-8 h-11 font-semibold gap-2 shadow-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{mode === "create" ? "Posting Job..." : "Saving Changes..."}</span>
                </>
              ) : (
                <>
                  <span>{mode === "create" ? "Post Job Now" : "Update Job"}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
