"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

interface Student {
  studentId: string;
  firstName: string;
  lastName: string;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<
    (Submission & { assignmentTitle?: string; studentFirstName?: string; studentLastName?: string })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/submissions`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch submissions");
        }

        const data = await response.json();
        const submissionsData: Submission[] = data.content;

        // Fetch assignment and student details for each submission
        const enrichedSubmissions = await Promise.all(
          submissionsData.map(async (submission) => {
            const [assignmentRes, studentRes] = await Promise.all([
              fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/assignments/${submission.assignmentId}`, {
                headers: { Authorization: `Bearer ${token}` },
              }),
              fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${submission.studentId}`, {
                headers: { Authorization: `Bearer ${token}` },
              }),
            ]);

            const assignment: Assignment = assignmentRes.ok ? await assignmentRes.json() : { title: "Unknown Assignment" };
            const student: Student = studentRes.ok
              ? await studentRes.json()
              : { firstName: "Unknown", lastName: "Student" };

            return {
              ...submission,
              assignmentTitle: assignment.title,
              studentFirstName: student.firstName,
              studentLastName: student.lastName,
            };
          })
        );

        setSubmissions(enrichedSubmissions);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const handleCardClick = (submissionId: string) => {
    router.push(`/submissions/${submissionId}`);
  };

  if (loading) return <p>Loading submissions...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Submissions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {submissions.map((submission) => (
          <button
            key={submission.submissionId}
            onClick={() => handleCardClick(submission.submissionId)}
            className="border-2 border-t-blue-900 p-4 rounded-lg shadow-md cursor-pointer transition transform hover:scale-105 hover:shadow-lg"
          >
            <h2 className="text-lg font-semibold">{submission.assignmentTitle}</h2>
            <p className="text-gray-700">
              Submitted by: <span className="text-sm text-blue-900 font-bold">{`${submission.studentFirstName?.toUpperCase()} ${submission.studentLastName?.toUpperCase()}`}</span>
            </p>
            <p className="mt-2">{submission.content}</p>
            <p className="text-sm text-gray-500 mt-2">Submitted at: {new Date(submission.submittedAt).toLocaleString()}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
