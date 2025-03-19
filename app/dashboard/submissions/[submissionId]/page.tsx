"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface Submission {
  submissionId: string;
  assignmentId: string;
  studentId: string;
  content: string;
  submittedAt: string;
}

interface Assignment {
  assignmentId: string;
  title: string;
}

export default function SubmissionDetailPage() {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [assignmentTitle, setAssignmentTitle] = useState<string>("Loading...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { submissionId } = useParams(); // Get submissionId from the URL

  useEffect(() => {
    if (!submissionId) return;

    const fetchSubmissionDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch submission details
        const submissionRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/submissions/${submissionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!submissionRes.ok) {
          throw new Error("Failed to fetch submission details");
        }

        const submissionData: Submission = await submissionRes.json();
        setSubmission(submissionData);

        // Fetch assignment title
        const assignmentRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/assignments/${submissionData.assignmentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (assignmentRes.ok) {
          const assignmentData: Assignment = await assignmentRes.json();
          setAssignmentTitle(assignmentData.title);
        } else {
          setAssignmentTitle("Unknown Assignment");
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissionDetails();
  }, [submissionId]);

  if (loading) return <p>Loading submission details...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!submission) return <p className="text-gray-500">Submission not found.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Submission Details</h1>
      <div className="border-2 border-blue-900 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold">{assignmentTitle}</h2>
        <p className="mt-4 text-gray-700">{submission.content}</p>
        <p className="text-sm text-gray-500 mt-2">
          Submitted at: {new Date(submission.submittedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
