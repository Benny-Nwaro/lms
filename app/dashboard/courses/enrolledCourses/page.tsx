"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Course {
  courseId: string;
  title: string;
  description: string;
  imageUrl: string;
}

export default function EnrolledCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Ensure localStorage is accessed only on the client
  useEffect(() => {
      const storedUserId = localStorage.getItem("userId");
      const storedToken = localStorage.getItem("token");
      if (storedUserId) setUserId(storedUserId);
      if (storedToken) setToken(storedToken);
    
  }, []);

  useEffect(() => {
    if (!userId || !token) {
      setLoading(false);
      return;
    }

    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/enrollments/student/${userId}/courses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch enrolled courses.");
        }

        const data: Course[] = await response.json();
        setCourses(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [userId, token]); // Fetch only when userId and token are available

  if (loading) return <p>Loading enrolled courses...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Enrolled Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.length > 0 ? (
          courses.map((course) => (
            <Link key={course.courseId} href={`/dashboard/courses/${course.courseId}`}>
              <div className="p-4 rounded-lg shadow border-2 border-b-blue-900 cursor-pointer transition-transform transform hover:scale-105">
                <img 
                  src={course.imageUrl || "https://www.afterschoolafrica.com/wp-content/uploads/2020/11/After-School-Africa-Top-20-Nigeria-University-Courses-to-Study.jpg"} 
                  alt={course.title} 
                  className="w-full h-48 object-cover rounded"
                />
                <h2 className="text-lg font-semibold mt-2">{course.title}</h2>
                <p className="text-sm text-gray-600">{course.description}</p>
              </div>
            </Link>
          ))
        ) : (
          <p>No courses enrolled yet.</p>
        )}
      </div>
    </div>
  );
}
