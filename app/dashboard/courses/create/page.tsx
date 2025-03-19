"use client";

import { useState } from "react";

export default function Page() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Retrieve userId and token from localStorage
  const instructorId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!title.trim() || !coursePrice.trim() || !instructorId) {
      setMessage("Title, course price are required, and you must be logged in as a teacher.");
      return;
    }

    if (isNaN(Number(coursePrice)) || Number(coursePrice) <= 0) {
      setMessage("Course price must be a valid positive number.");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Register the Course
      const courseResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          coursePrice: Number(coursePrice),
          instructorId,
        }),
      });

      if (!courseResponse.ok) throw new Error("Failed to register course.");

      const courseData = await courseResponse.json();
      const courseId = courseData.courseId; // Assuming backend returns courseId

      // Step 2: Upload the Image if Selected
      if (image && courseId) {
        const formData = new FormData();
        formData.append("file", image);

        const imageResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/courses/${courseId}/upload-image`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!imageResponse.ok) throw new Error("Failed to upload course image.");
      }

      setMessage("Course registered successfully!");
      setTitle("");
      setDescription("");
      setCoursePrice("");
      setImage(null);
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Register a Course</h2>
      {message && (
        <p
          className={`mb-4 text-sm ${
            message.includes("success") ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700">Course Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Course Price</label>
          <input
            type="text"
            value={coursePrice}
            onChange={(e) => setCoursePrice(e.target.value)}
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Course Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Registering..." : "Register Course"}
        </button>
      </form>
    </div>
  );
}
