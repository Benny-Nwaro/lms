"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import PaymentForm from "@/app/ui/dashboard/paymentForm"; 
const defaultImage = "/courseimage.jpg"; // Placeholder image

interface Course {
  courseId: string;
  title: string;
  description: string;
  instructorId: string;
  coursePrice: number;
  courseImage?: string;
}

export default function Page() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Ensure this runs only in the browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
      const storedToken = localStorage.getItem("token") || "";
      const storedUserId = localStorage.getItem("userId");
      const storedEmail = localStorage.getItem("email")

      if (!storedToken || !storedUserId) {
        setError("Unauthorized: No token or user ID found");
        setLoading(false);
        return;
      }

      setToken(storedToken);
      setUserId(storedUserId);
      setUserEmail(storedEmail)
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        setCourses(data);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token]);

  useEffect(() => {
    if (!userId || !token) return;

    const fetchEnrollments = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/enrollments/student/${userId}/courses`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error(`Error fetching enrollments`);
        }

        const enrollments = await response.json();
        const enrolledCourseIds = enrollments.map((enrollment: { courseId: string }) => enrollment.courseId);
        setEnrolledCourses(enrolledCourseIds);
      } catch (err: any) {
        console.error("Error fetching enrollments:", err);
      }
    };

    fetchEnrollments();
  }, [userId, token]);

  if (!isClient) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Available Courses</h1>

      {loading ? (
        <p>Loading courses...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : courses.length === 0 ? (
        <p>No courses available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {courses.map((course) => {
            const isEnrolled = enrolledCourses.includes(course.courseId);

            return (
              <div
                key={course.courseId}
                className="bg-white shadow-md rounded-lg p-4 border flex flex-col"
              >
                <Image
                  src={course.courseImage ? `${process.env.NEXT_PUBLIC_API_URL}${course.courseImage}` : defaultImage}
                  alt={course.title}
                  width={300}
                  height={200}
                  className="w-full h-40 object-cover rounded-md"
                />
                <h2 className="text-lg font-semibold mt-2">{course.title}</h2>
                <p className="text-gray-600 mt-1 flex-grow">{course.description}</p>
                <p className="text-lg font-bold mt-1">Price: ₦ {course.coursePrice}</p>
                <button
                  onClick={() => !isEnrolled && setSelectedCourse(course)}
                  className={`mt-2 px-4 py-2 rounded transition ${
                    isEnrolled ? "bg-gray-400 text-white cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                  disabled={isEnrolled}
                >
                  {isEnrolled ? "Enrolled" : "Enroll"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Payment Modal */}
      {selectedCourse && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          aria-hidden="true"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={() => setSelectedCourse(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
            <PaymentForm course={selectedCourse} email={userEmail || ""} token={token || ""} />
            </div>
        </div>
      )}
    </div>
  );
}
