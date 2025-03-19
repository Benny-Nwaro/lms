import { useEffect, useState } from "react";
import UserCard from "@/app/ui/users/UserCard"; // Ensure correct import path

interface Student {
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
  [key: string]: string | undefined; // 👈 Add this line to allow dynamic properties

}

interface StudentsListProps {
  instructorId: string;
}

export default function StudentsList({ instructorId }: StudentsListProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!instructorId) return;

    const fetchStudents = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token is missing.");

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        if (!API_URL) throw new Error("API URL is not defined. Check environment variables.");

        // Fetch students list
        const response = await fetch(`${API_URL}/api/v1/enrollments/instructor/${instructorId}/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch students.");
        }

        const studentsData: Student[] = await response.json();

        // Fetch social media profiles for each student
        const studentsWithSocialMedia = await Promise.all(
          studentsData.map(async (student) => {
            try {
              const socialMediaResponse = await fetch(`${API_URL}/api/v1/social-media/${student.id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });

              if (!socialMediaResponse.ok) throw new Error("Failed to fetch social media");

              const socialMediaProfiles = await socialMediaResponse.json();
              console.log(socialMediaProfiles)


              // Convert array of profiles into an object for easier access
              const socialMediaMap = socialMediaProfiles.reduce(
                (acc: Partial<Student>, profile: { platform: string; profileUrl: string }) => {
                  acc[profile.platform.toLowerCase()] = profile.profileUrl;
                  return acc;
                },
                {}
              );
              console.log(socialMediaMap)


              return { ...student, ...socialMediaMap };
            } catch {
              return student; // If error occurs, return student without social media
            }
          })
        );

        setStudents(studentsWithSocialMedia);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [instructorId]);

  // console.log(students)

  return (
    <div className="lg:p-6 bg-white w-full">
      <h2 className="text-xl font-bold mb-4">Your Students</h2>

      {loading && <p>Loading students...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && students.length === 0 && <p>No students enrolled yet.</p>}

      {!loading && !error && students.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => (
            <UserCard
              key={student.id}
              user={{
                profileImage: student.profileImageUrl ? `${process.env.NEXT_PUBLIC_API_URL}${student.profileImageUrl}` : undefined,
                name: `${student.firstName} ${student.lastName}`,
                email: student.email,
                role: student.role || "Student",
                facebook: student.facebook,
                twitter: student.twitter,
                linkedin: student.linkedin,
                instagram: student.instagram,
              }}
              onMessageClick={() => alert(`Message sent to ${student.email}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
