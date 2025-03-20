'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profileImageUrl?: string; 
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data: User = await response.json();
        setUser(data);

        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", data.id);
        if (data.profileImageUrl) {
          localStorage.setItem("profileImageUrl", data.profileImageUrl);
        }
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchUserData();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p>Loading user data...</p>;

  console.log(user)


  return (
    <div className="flex flex-col  bg-red-900  max-md:w-full rounded-t-lg">
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Welcome, {user.firstName}!</h1>

        <div className=''>
          {user.profileImageUrl ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}${user.profileImageUrl}`} 
              alt="Profile"
              width={48}  
              height={48} 
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-blue-900 font-bold text-lg">
              {user.firstName[0].toUpperCase()}
              {user.lastName[0].toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
