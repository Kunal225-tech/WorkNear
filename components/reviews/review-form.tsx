"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Star } from "lucide-react";
import { StarRating } from "@/components/reviews/star-rating";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useCreateReview } from "@/hooks/use-reviews";

const reviewSchema = z.object({
  comment: z.string().trim().min(5, "Comment must be at least 5 characters").max(500),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  revieweeId: string;
  revieweeName: string;
}

export function ReviewForm({
  open,
  onOpenChange,
  jobId,
  revieweeId,
  revieweeName,
}: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const createReview = useCreateReview();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { comment: "" },
  });

  const onSubmit = async (data: ReviewFormData) => {
    if (rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }
    try {
      await createReview.mutateAsync({
        jobId,
        revieweeId,
        rating,
        comment: data.comment,
      });
      toast.success("Review submitted successfully!");
      reset();
      setRating(5);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit review.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Star size={20} className="text-amber-400 fill-amber-400" />
            Leave a Review
          </DialogTitle>
          <DialogDescription>
            Share your experience working with <span className="font-semibold text-foreground">{revieweeName}</span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-2">
          {/* Star Picker */}
          <div className="space-y-2">
            <Label className="font-semibold">Your Rating</Label>
            <StarRating value={rating} onChange={setRating} size={28} />
            <p className="text-xs text-muted-foreground">
              {rating === 1 && "Poor"}
              {rating === 2 && "Below Average"}
              {rating === 3 && "Average"}
              {rating === 4 && "Good"}
              {rating === 5 && "Excellent!"}
            </p>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment" className="font-semibold">
              Your Review <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="comment"
              placeholder={`Describe your experience with ${revieweeName}...`}
              className="min-h-[120px] rounded-xl"
              disabled={createReview.isPending}
              {...register("comment")}
            />
            {errors.comment && (
              <p className="text-xs font-medium text-destructive">{errors.comment.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => onOpenChange(false)}
              disabled={createReview.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl gap-2 font-semibold"
              disabled={createReview.isPending}
            >
              {createReview.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Star size={16} className="fill-current" />
                  <span>Submit Review</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
