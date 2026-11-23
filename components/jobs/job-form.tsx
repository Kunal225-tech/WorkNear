"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, ArrowRight, IndianRupee, MapPin, Calendar, ImagePlus, X } from "lucide-react";
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
  title: z.string().trim().min(5, "Job title must be at least 5 characters").max(100),
  description: z.string().trim().min(20, "Please provide at least 20 characters describing the work required.").max(1000),
  category: z.enum(JOB_CATEGORIES),
  payment: z.coerce.number().positive("Enter a valid budget greater than ₹0."),
  location: z.string().trim().min(2, "Please enter a location or neighborhood.").max(100),
  requiredDate: z.string().min(1, "Please select a required completion date").refine((val) => {
    const selectedDate = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }, "Completion date cannot be in the past."),
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
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(initialData?.images || []);
  const [isLocating, setIsLocating] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);

      const newPreviewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    const urlToRemove = previewUrls[index];
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    
    if (urlToRemove.startsWith("blob:")) {
        const fileIndex = previewUrls.slice(0, index).filter(url => url.startsWith("blob:")).length;
        setFiles(prev => prev.filter((_, i) => i !== fileIndex));
    }
  };

  // Format initial requiredDate to YYYY-MM-DD for date input
  const defaultDate = initialData?.requiredDate
    ? new Date(initialData.requiredDate).toISOString().split("T")[0]
    : "";

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema) as any,
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      category: initialData?.category || JOB_CATEGORIES[0],
      payment: initialData?.payment || ("" as any),
      location: initialData?.location || "",
      requiredDate: defaultDate,
    },
  });

  // Auto-detect location for new jobs
  useEffect(() => {
    if (mode === "create" && !initialData?.location) {
      if (!navigator.geolocation) return;

      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`, {
              headers: { 'User-Agent': 'WorkNearApp/1.0 (contact@worknear.local)' }
            });
            const data = await res.json();
            if (data && data.display_name) {
              const locationName = data.address?.suburb || data.address?.neighbourhood || data.address?.city || data.address?.town || data.display_name;
              if (!getValues("location")) {
                setValue("location", locationName);
              }
            }
          } catch (err) {
            console.error("Reverse geocoding failed", err);
          } finally {
            setIsLocating(false);
          }
        },
        (err) => {
          console.error("Location access denied", err);
          setIsLocating(false);
        }
      );
    }
  }, [mode, initialData, setValue, getValues]);

  const onSubmit = async (data: JobFormData) => {
    setIsSubmitting(true);
    try {
      let uploadedImageUrls: string[] = initialData?.images || [];

      // Upload new files to Cloudinary via our API route
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => formData.append("file", file));

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Failed to upload images");
        const uploadData = await uploadRes.json();
        
        if (uploadData.urls) {
          // Combine existing images (if we kept them) with newly uploaded ones
          // For simplicity, we just add new ones to whatever previews are left
          const existingPreviews = previewUrls.filter(url => url.startsWith("http"));
          uploadedImageUrls = [...existingPreviews, ...uploadData.urls];
        }
      }

      if (mode === "create") {
        const newJob = await createMutation.mutateAsync({
          title: data.title,
          description: data.description,
          category: data.category,
          payment: Number(data.payment),
          location: data.location,
          requiredDate: data.requiredDate,
          images: uploadedImageUrls.length > 0 ? uploadedImageUrls : undefined,
        } as any);
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
            images: uploadedImageUrls.length > 0 ? uploadedImageUrls : undefined,
          } as any,
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="font-semibold">
                Location / Neighborhood <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder={isLocating ? "Detecting location..." : "e.g. Indiranagar, Bangalore"}
                  className="pl-9 pr-9 h-11 rounded-xl"
                  disabled={isSubmitting || isLocating}
                  {...register("location")}
                />
                {isLocating && (
                  <Loader2 className="absolute right-3 top-3.5 h-4 w-4 animate-spin text-amber-500" />
                )}
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

          {/* Image Upload */}
          <div className="space-y-4 pt-2">
            <Label className="font-semibold">
              Images (Optional)
            </Label>
            
            <div className="flex flex-wrap gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative h-24 w-24 rounded-xl border border-border/80 overflow-hidden bg-muted">
                  <img src={url} alt={`Preview ${index}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 h-6 w-6 rounded-full bg-background/80 flex items-center justify-center text-foreground hover:bg-destructive hover:text-white transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              {previewUrls.length < 5 && (
                <div className="relative h-24 w-24 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer">
                  <ImagePlus size={24} className="text-muted-foreground" />
                  <span className="text-[10px] font-medium text-muted-foreground">Add Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                  />
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">You can upload up to 5 images showing what needs to be done.</p>
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
