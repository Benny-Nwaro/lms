import StudentsList from "@/app/ui/dashboard/StudentsList";
import { useEffect, useState } from "react";

export default function TutorDashboard() {
  const [instructorId, setInstructorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("userId");
      setInstructorId(storedUser);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("TutorDashboard mounted");
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-7xl p-6 max-md:w-full max-md:p-1">
      {instructorId ? (
        <StudentsList instructorId={instructorId} />
      ) : (
        <p>No instructor ID found.</p>
      )}
    </div>
  );
}
