"use client";

import { useEffect, useState } from "react";
import AssignmentModal from "@/app/ui/dashboard/AssignmentModal";

interface Assignment {
  assignmentId: string;
  title: string;
  description: string;
  dueDate: string;
  courseId: string;
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Only access localStorage on the client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      const storedToken = localStorage.getItem("token");

      if (storedUserId) setStudentId(storedUserId);
      if (storedToken) setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!token) return; // Ensure token is available before making request

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/assignments`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData?.message || "Failed to fetch assignments.");
        }

        const data: Assignment[] = await response.json();
        setAssignments(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchAssignments();
  }, [token]); // Fetch assignments only when token is available

  // Function to open modal with selected assignment
  const handleAssignmentClick = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setSelectedAssignment(null);
  };

  if (loading) return <p>Loading assignments...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Assignments</h1>

      {assignments.length === 0 ? (
        <p className="text-gray-500">No assignments available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {assignments.map((assignment) => (
            <div
              key={assignment.assignmentId}
              className="border p-4 rounded shadow cursor-pointer transform transition duration-300 hover:scale-105"
              onClick={() => handleAssignmentClick(assignment)}
            >
              <img
                src="https://t3.ftcdn.net/jpg/01/27/17/00/360_F_127170057_T8TeGnPWtYX24uTpSjeIT0500sUxi9M1.jpg"
                alt="Assignment"
                className="w-full h-48 object-cover mb-2"
              />
              <h2 className="text-xl font-semibold">{assignment.title}</h2>
              <p className="text-gray-700">{assignment.description}</p>
              <p className="text-sm text-gray-500">
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Render AssignmentModal when an assignment is selected */}
      {selectedAssignment && studentId && (
        <AssignmentModal studentId={studentId} assignment={selectedAssignment} onClose={handleCloseModal} />
      )}
    </div>
  );
}
