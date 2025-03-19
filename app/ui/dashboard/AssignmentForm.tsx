"use client";

import { useEffect, useState } from "react";

interface Course {
  courseId: string;
  title: string;
}

interface AssignmentFormProps {
  courseId?: string; // Optional courseId (if coming from a lesson)
  onClose: () => void; // Function to close the form (for modal support)
}

const AssignmentForm: React.FC<AssignmentFormProps> = ({ courseId, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState(courseId || "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) {
      const fetchCourses = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/courses`);
          if (!response.ok) throw new Error("Failed to fetch courses");
          const data = await response.json();
          setCourses(data);
        } catch (err: any) {
          setError(err.message);
        }
      };
      fetchCourses();
    }
  }, [courseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedCourseId) {
      setError("Please select a course.");
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setError("Unauthorized: No token found");
      return;
    }

    const assignmentData = { title, description, courseId: selectedCourseId, dueDate };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/assignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(assignmentData),
      });

      if (!response.ok) throw new Error("Failed to create assignment");

      setSuccess("Assignment added successfully!");
      setTitle("");
      setDescription("");
      setDueDate("");
      if (!courseId) setSelectedCourseId(""); 

      setTimeout(() => {
        onClose(); 
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Add Assignment</h2>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        {!courseId && (
          <div>
            <label className="block font-medium">Course</label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.courseId} value={course.courseId}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block font-medium">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="flex justify-between">
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
            Submit
          </button>
          <button type="button" onClick={onClose} className="bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignmentForm;
