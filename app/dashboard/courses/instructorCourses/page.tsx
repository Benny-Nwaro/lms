"use client";

import { Button } from "@/app/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Course {
  courseId: number;
  title: string;
  description: string;
  instructorName: string;
  courseImage?: string;
}

const defaultImage = "/courseimage.jpg"; 

export default function CoursesList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const storedUserId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

    setToken(storedToken);
    setUserId(storedUserId);

    if (!storedToken || !storedUserId) {
      setError("Unauthorized: No token or user ID found");
      return;
    }

    const fetchCourses = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/courses/user/${storedUserId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (response.status === 401) throw new Error("Unauthorized: Token expired or invalid");
        if (response.status === 403) throw new Error("Forbidden: You don't have permission to access this resource");
        if (!response.ok) throw new Error("Failed to fetch courses");

        const data = await response.json();
        setCourses(data);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching courses:", err);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        {courses.length === 0 ? "There are no courses available yet" : "Your Courses"}
      </h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div key={course.courseId} className="bg-white shadow-md rounded-lg p-4 border flex flex-col">
              <Image 
                src={course.courseImage ? `${process.env.NEXT_PUBLIC_API_URL}${course.courseImage}` : defaultImage} 
                alt={course.title} 
                width={300} 
                height={200} 
                className="w-full h-40 object-cover rounded-md"
              />
              <h3 className="text-lg font-semibold mt-2">{course.title}</h3>
              <p className="text-gray-600 mt-1 flex-grow">{course.description}</p>
              <Link           
                className="w-full bg-blue-600 text-white font-medium py-2 px-3 rounded-md hover:bg-blue-700 transition mt-4 text-center"
                href={'/dashboard/lessons/create'}
              >
                Add Lesson
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
