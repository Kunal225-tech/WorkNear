"use server";

import { connectDB } from "@/db/connect";
import { User } from "@/models/User";

interface UpdateProfileInput {
    userId: string;
    name?: string;
    phone?: string;
    bio?: string;
    location?: string;
    skills?: string[];
    profileImage?: string;
}

export async function updateUserProfile({
    userId,
    name,
    phone,
    bio,
    location,
    skills,
    profileImage,
}: UpdateProfileInput) {
    await connectDB();

    const updateFields: any = {};
    if (name !== undefined) updateFields.name = name;
    if (phone !== undefined) updateFields.phone = phone;
    if (bio !== undefined) updateFields.bio = bio;
    if (location !== undefined) updateFields.location = location;
    if (skills !== undefined) updateFields.skills = skills;
    if (profileImage !== undefined) updateFields.profileImage = profileImage;

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
        new: true,
        runValidators: true,
    })
        .select("-password")
        .lean();

    if (!updatedUser) {
        throw new Error("User not found");
    }

    return JSON.parse(JSON.stringify(updatedUser));
}
