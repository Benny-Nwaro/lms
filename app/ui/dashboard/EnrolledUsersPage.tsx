"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function EnrolledUsersPage() {
  const { courseId } = useParams();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrolledUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token"); // Get token from local storage
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/enrollments/course/${courseId}/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch enrolled users.");
        }

        const data: User[] = await res.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchEnrolledUsers();
    }
  }, [courseId]);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md  bottom-2 border-b-blue-900">
      <h1 className="text-2xl font-bold mb-4">Enrolled Users</h1>
      {users.length === 0 ? (
        <p>No users enrolled in this course.</p>
      ) : (
        <ul className="space-y-3">
          {users.map((user) => (
            <li
              key={user.id}
              className="p-4 border rounded-md flex items-center gap-4"
            >
              <img
                src={`https://via.placeholder.com/50?text=${user.firstName[0]}${user.lastName[0]}`}
                alt="User"
                className="w-12 h-12 rounded-full bg-gray-300"
              />
              <div>
                <p className="text-lg font-semibold">{`${user.firstName} ${user.lastName}`}</p>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
