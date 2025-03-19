"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AssignmentForm from "@/app/ui/dashboard/AssignmentForm";

interface Lesson {
  lessonId: string;
  title: string;
  content: string;
  videoUrl?: string;
  courseId: string;
}

const LessonDetail = () => {
  const params = useParams();
  const lessonId = params?.lessonId as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAssignmentForm, setShowAssignmentForm] = useState<boolean>(false);
  const [showAssignmentButton, setShowAssignmentButton] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
      const storedRole = localStorage.getItem("role");
      setRole(storedRole);
    
  }, []);

  useEffect(() => {
    if (!lessonId) {
      setError("Lesson ID not found.");
      setLoading(false);
      return;
    }

    const token =  localStorage.getItem("token") 
    if (!token) {
      setError("Unauthorized: No token found.");
      setLoading(false);
      return;
    }

    const fetchLesson = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/lessons/${lessonId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) throw new Error("Unauthorized: Token expired or invalid.");
        if (!response.ok) throw new Error(`Failed to fetch lesson. Status: ${response.status}`);

        const data = await response.json();
        setLesson(data);
        setLoading(false);
        setShowAssignmentButton(role !== "INSTRUCTOR"); // Fix here
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId, role]); // Add `role` as a dependency

  const getYouTubeVideoId = (url: string): string | null => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : null;
  };

  if (loading) return <p className="text-gray-600">Loading lesson...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">{lesson?.title}</h2>

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

      <p className="text-gray-700 mt-4">{lesson?.content}</p>

      {/* Create Assignment Button */}
      {!showAssignmentButton && (
        <button
          onClick={() => setShowAssignmentForm(true)}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Add Assignment
        </button>
      )}

      {/* Assignment Form Modal */}
      {showAssignmentForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">Create Assignment</h3>
            <AssignmentForm courseId={lesson?.courseId} onClose={() => setShowAssignmentForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonDetail;
