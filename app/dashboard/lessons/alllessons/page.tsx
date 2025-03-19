"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Lesson {
  lessonId: string;
  title: string;
  content: string;
  videoUrl?: string;
}

const page = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      setError("Unauthorized: No token found");
      return;
    }

    const fetchLessons = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/lessons`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) throw new Error("Unauthorized: Token expired or invalid");
        if (!response.ok) throw new Error("Failed to fetch lessons");

        const data = await response.json();
        setLessons(data);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching lessons:", err);
      }
    };

    fetchLessons();
  }, []);

  const getYouTubeVideoId = (url: string): string | null =>{
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/)([^&?#]*))/
    );
    return match ? match[1] : null;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        {lessons.length === 0 ? "No Lessons Available" : "All Lessons"}
      </h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.map((lesson) => (
            <div
              key={lesson.lessonId}
              onClick={() => router.push(`/dashboard/lessons/${lesson.lessonId}`)}
              className="cursor-pointer bg-white shadow-md rounded-lg p-4 border transition-transform transform hover:scale-105"
            >
          {lesson?.videoUrl ? (
            lesson.videoUrl.includes("youtube.com") || lesson.videoUrl.includes("youtu.be") ? (
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeVideoId(lesson.videoUrl)}`}
                className="w-full h-60 rounded-md"
                allowFullScreen
              />
            ) : (
              <video controls className="w-full h-60 object-cover rounded-md">
                <source src={lesson.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )
          ) : (
            <div className="w-full h-60 flex items-center justify-center bg-gray-200 rounded-md">
              <p className="text-gray-500">No Video Available</p>
            </div>
          )}

              <div className="mt-3 text-center">
                <h3 className="text-lg font-semibold break-words">{lesson.title}</h3>
                <p className="text-gray-600 truncate">{lesson.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default page;
