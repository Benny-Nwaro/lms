"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Assignment {
  assignmentId: string;
  title: string;
}

interface Submission {
  assignmentId: string;
  studentId: string;
  content: string;
}

export default function AssignmentModal({
  studentId,
  assignment,
  onClose,
}: {
  studentId: string;
  assignment: Assignment;
  onClose: () => void;
}) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedToken = localStorage.getItem("token");
        if (storedToken) setToken(storedToken);
      } catch (error) {
        console.error("Error accessing localStorage:", error);
      }
    }
  }, []);

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError("Submission content is required");
      return;
    }

    if (!token) {
      setError("Authentication token missing. Please log in again.");
      return;
    }

    setLoading(true);
    setError(null);

    const submission: Submission = {
      assignmentId: assignment.assignmentId,
      studentId,
      content,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submission),
      });

      if (!response.ok) {
        throw new Error("Failed to submit assignment");
      }

      alert("Assignment submitted successfully!");
      router.refresh();
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Submit Assignment</h2>

        <p className="mb-2 font-semibold">Assignment: {assignment.title}</p>

        <label className="block mb-2">Your Submission</label>
        <textarea
          className="w-full border p-2 rounded mb-4 h-32"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your submission here..."
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="flex justify-between">
          <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
