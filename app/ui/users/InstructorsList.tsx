"use client";

import { useEffect, useState } from "react";
import UserCard from "@/app/ui/users/UserCard"; // Ensure correct import path

interface Instructor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl?: string;
  role?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  [key: string]: string | undefined;
}

export default function InstructorsList() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchInstructors = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token is missing.");

        if (!API_URL) throw new Error("API URL is not defined. Check environment variables.");

        // Fetch instructors list
        const response = await fetch(`${API_URL}/api/v1/users/instructors`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch instructors.");
        }

        const instructorsData: Instructor[] = await response.json();

        // Fetch social media profiles for each instructor
        const instructorsWithSocialMedia = await Promise.all(
          instructorsData.map(async (instructor) => {
            try {
              const socialMediaResponse = await fetch(`${API_URL}/api/v1/social-media/${instructor.id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });

              if (!socialMediaResponse.ok) throw new Error("Failed to fetch social media");

              const socialMediaProfiles = await socialMediaResponse.json();
              
              // Convert array of profiles into an object for easier access
              const socialMediaMap = socialMediaProfiles.reduce(
                (acc: Partial<Instructor>, profile: { platform: string; profileUrl: string }) => {
                  acc[profile.platform.toLowerCase()] = profile.profileUrl;
                  return acc;
                },
                {}
              );

              return { ...instructor, ...socialMediaMap };
            } catch {
              return instructor; // If error occurs, return instructor without social media
            }
          })
        );

        setInstructors(instructorsWithSocialMedia);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  return (
    <div className="lg:p-6 bg-white w-full max-md:px-4">
      <h2 className="text-xl font-bold mb-4">Our Instructors</h2>

      {loading && <p>Loading instructors...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && instructors.length === 0 && <p>No instructors available.</p>}

      {!loading && !error && instructors.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-sm:flex max-sm:flex-col">
          {instructors.map((instructor) => (
            <UserCard
              key={instructor.id}
              user={{
                profileImage: instructor.profileImageUrl ? `${API_URL}${instructor.profileImageUrl}` : undefined,
                name: `${instructor.firstName} ${instructor.lastName}`,
                email: instructor.email,
                role: instructor.role || "Instructor",
                facebook: instructor.facebook,
                twitter: instructor.twitter,
                linkedin: instructor.linkedin,
                instagram: instructor.instagram,
              }}
              onMessageClick={() => alert(`Message sent to ${instructor.email}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
