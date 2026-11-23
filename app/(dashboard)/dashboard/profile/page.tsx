"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  FileText,
  Wrench,
  ShieldCheck,
  Star,
  Loader2,
  Save,
  Image as ImageIcon,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StarRating } from "@/components/reviews/star-rating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useMyProfile, useUpdateMyProfile } from "@/hooks/use-user";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  phone: z.string().trim().optional(),
  location: z.string().trim().optional(),
  bio: z.string().trim().max(500, "Bio cannot exceed 500 characters").optional(),
  skillsInput: z.string().optional(),
  profileImage: z.string().trim().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileDashboardPage() {
  const { data: profile, isLoading, isError } = useMyProfile();
  const updateMutation = useUpdateMyProfile();
  const [skillInputText, setSkillInputText] = useState("");
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      phone: "",
      location: "",
      bio: "",
      skillsInput: "",
      profileImage: "",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || "",
        phone: profile.phone || "",
        location: profile.location || "",
        bio: profile.bio || "",
        skillsInput: profile.skills ? profile.skills.join(", ") : "",
        profileImage: profile.profileImage || "",
      });
    }
  }, [profile, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    const skills = data.skillsInput
      ? data.skillsInput
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    try {
      let profileImageUrl = data.profileImage;

      // If a new file was selected, upload it
      if (profilePicFile) {
        const formData = new FormData();
        formData.append("file", profilePicFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Failed to upload image");
        const uploadData = await uploadRes.json();

        if (uploadData.urls && uploadData.urls.length > 0) {
          profileImageUrl = uploadData.urls[0];
        }
      }

      await updateMutation.mutateAsync({
        name: data.name,
        phone: data.phone,
        location: data.location,
        bio: data.bio,
        skills,
        profileImage: profileImageUrl,
      });
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile.");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="My Profile" description="Manage your account details and public profile." />
        <div className="h-96 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-8 text-center text-destructive">
        <p className="font-semibold">Failed to load profile information.</p>
      </div>
    );
  }

  const currentSkillsStr = watch("skillsInput") || "";
  const currentSkills = currentSkillsStr
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newSkill = skillInputText.trim().replace(/,/g, "");
      if (newSkill && !currentSkills.some(s => s.toLowerCase() === newSkill.toLowerCase())) {
        const newSkillsList = [...currentSkills, newSkill];
        setValue("skillsInput", newSkillsList.join(", "), { shouldDirty: true });
      }
      setSkillInputText("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const newSkillsList = currentSkills.filter(s => s !== skillToRemove);
    setValue("skillsInput", newSkillsList.join(", "), { shouldDirty: true });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="Update your personal information, skills, and contact details to build trust with local employers and workers."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Public Profile Preview Card */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5" />
            <CardContent className="p-6 pt-0 relative">
              {/* Avatar */}
              <div className="-mt-12 mb-4 flex items-end justify-between">
                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-primary text-2xl font-extrabold text-primary-foreground shadow-md border-4 border-card overflow-hidden">
                  {profile.profileImage ? (
                    <img src={profile.profileImage} alt={profile.name} className="h-full w-full object-cover" />
                  ) : (
                    profile.name ? profile.name.charAt(0).toUpperCase() : "U"
                  )}
                </div>
                {profile.isVerified && (
                  <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    <ShieldCheck size={14} />
                    <span>Verified Member</span>
                  </div>
                )}
              </div>

              {/* Name & Bio */}
              <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{profile.email}</p>

              {/* Rating summary */}
              <div className="mt-4 flex items-center gap-3 rounded-xl bg-muted/40 p-3 border border-border/60">
                <div className="flex items-center gap-1">
                  <Star size={16} className="fill-amber-400 text-amber-400" />
                  <span className="text-sm font-extrabold text-foreground">
                    {profile.averageRating > 0 ? profile.averageRating.toFixed(1) : "N/A"}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  ({profile.reviewCount} review{profile.reviewCount !== 1 ? "s" : ""})
                </span>
              </div>

              {/* Bio */}
              {profile.bio && (
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground border-l-2 border-primary/30 pl-3 italic">
                  &ldquo;{profile.bio}&rdquo;
                </p>
              )}

              {/* Info details */}
              <div className="mt-4 space-y-2.5 text-xs text-muted-foreground pt-4 border-t border-border">
                {profile.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-primary shrink-0" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-primary shrink-0" />
                    <span>{profile.phone}</span>
                  </div>
                )}
              </div>

              {/* Skills tags */}
              {profile.skills && profile.skills.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Skills &amp; Expertise
                  </span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {profile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="lg:col-span-2">
          <Card className="rounded-xl border border-border shadow-sm p-6 sm:p-8">
            <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <UserIcon size={18} className="text-primary" />
              <span>Edit Profile Details</span>
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Profile Image */}
              <div className="space-y-4">
                <Label className="font-semibold">Profile Picture</Label>
                <div className="flex items-center gap-6">
                  <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted hover:border-primary/50 transition-colors">
                    {previewUrl || profile.profileImage ? (
                      <img
                        src={previewUrl || profile.profileImage}
                        alt="Profile Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon size={32} className="text-muted-foreground/50" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 cursor-pointer opacity-0"
                      onChange={handleFileChange}
                      disabled={updateMutation.isPending}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">Upload a new photo</p>
                    <p className="mt-1 text-xs">JPG, GIF or PNG. Max size of 5MB.</p>
                  </div>
                </div>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-semibold">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Kunal Kishore"
                    className="rounded-xl"
                    disabled={updateMutation.isPending}
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-semibold">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    placeholder="+91 98765 43210"
                    className="rounded-xl"
                    disabled={updateMutation.isPending}
                    {...register("phone")}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="font-semibold">
                  City / Neighborhood
                </Label>
                <Input
                  id="location"
                  placeholder="e.g. Indiranagar, Bangalore"
                  className="rounded-xl"
                  disabled={updateMutation.isPending}
                  {...register("location")}
                />
              </div>

              {/* Skills */}
              <div className="space-y-3">
                <Label htmlFor="skillInputText" className="font-semibold flex items-center justify-between">
                  <span>Skills &amp; Services Offered</span>
                  <span className="text-xs font-normal text-muted-foreground">Press Enter to add</span>
                </Label>
                
                {/* Hidden input for react-hook-form to still track the comma-separated string */}
                <input type="hidden" {...register("skillsInput")} />

                <div className="flex flex-wrap gap-2 rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 min-h-11 items-center">
                  {currentSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-0.5 rounded-full p-0.5 hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                        disabled={updateMutation.isPending}
                        aria-label={`Remove ${skill}`}
                      >
                        <span className="sr-only">Remove {skill}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      </button>
                    </span>
                  ))}
                  <input
                    id="skillInputText"
                    value={skillInputText}
                    onChange={(e) => setSkillInputText(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder={currentSkills.length === 0 ? "e.g. Plumbing, Electrical..." : "Add a skill..."}
                    className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-[120px]"
                    disabled={updateMutation.isPending}
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="font-semibold">
                  About You / Bio
                </Label>
                <Textarea
                  id="bio"
                  placeholder="Tell local neighbors about your experience, tools, and background..."
                  className="min-h-[120px] rounded-xl"
                  disabled={updateMutation.isPending}
                  {...register("bio")}
                />
                {errors.bio && (
                  <p className="text-xs text-destructive">{errors.bio.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4 border-t border-border">
                <Button
                  type="submit"
                  size="lg"
                  className="rounded-xl gap-2 shadow-md font-semibold px-8"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>Save Profile Changes</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
