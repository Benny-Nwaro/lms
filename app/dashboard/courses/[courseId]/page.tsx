"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Lesson {
  lessonId: string;
  title: string;
  content: string;
  videoUrl: string; // Added video URL
}

export default function CourseLessons() {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    if (!courseId) return;

    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage.");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/lessons/course/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const text = await res.text();
        return text ? JSON.parse(text) : []; // Handle empty response
      })
      .then((data) => setLessons(data))
      .catch((err) => console.error("Error fetching lessons:", err));
  }, [courseId]);

  function getYouTubeVideoId(url: string): string | null {
    const regExp = /^.*(?:youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|watch\?v=|watch\?.+&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[1] ? match[1] : null;
  }
  

  return (
    <div className="mx-auto p-4">
      <h1 className="text-2xl font-bold">Course Lessons</h1>
      {lessons.length > 0 ? (
        <div className="">
        {lessons.map((lesson) => (
          <div 
            key={lesson.lessonId} 
            className="max-w-lg mb-4 p-4 border rounded-lg shadow-lg bg-white"
          >
            <h2 className="text-lg font-semibold">{lesson.title}</h2>
            <p className="text-gray-700">{lesson.content}</p>
      
            {lesson.videoUrl && (
              <div className="mt-2">
                <iframe
                  className="w-full aspect-video rounded-lg"
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(lesson.videoUrl)}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        ))}
      </div>
      
      ) : (
        <p>No lessons found for this course.</p>
      )}
    </div>
  );
}
