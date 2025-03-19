"use client"
import SideNav from '@/app/ui/dashboard/sidenav';
import { useEffect, useState } from 'react';
import Chat from '../ui/chat/Chat';
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';
import Home from '../ui/dashboard/home';



interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profileImageUrl?: string; 
}
export default function Layout({ children }: { children: React.ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
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
        localStorage.setItem("email", data.email)
        if (data.profileImageUrl) {
          localStorage.setItem("profileImageUrl", data.profileImageUrl);
        }
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchUserData();
  }, []);


  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("role");
      setRole(storedRole);
    }
  });

  return (
    <div className="flex h-screen flex-col md:flex-row lg:overflow-hidden">
      <div className="w-full flex-none md:w-64 max-md:sticky max-md:top-0 max-md:z-50">
        <SideNav role={role} userId={localStorage.getItem("userId")} />
      </div>
      <div className='flex-col lg:overflow-auto lg:w-full '>
        <div className='max-w-6xl lg:mx-16 mt-4 sticky top-4 max-md:top-40 z-50 max-md:w-full max-md:px-4'>
            <Home/>
        </div>
        <div className="flex-grow max-w-7xl p-4 md:overflow-y-auto md:p-12 overflow-scroll">
          {children}
        </div>

        {/* Role Display */}
        <span className="lg:absolute max-md:sticky max-md:left-1/4 bottom-4 left-1/2 transform -translate-x-1/2 text-blue-900 font-bold">
          {role} Dashboard
        </span>

        {/* Floating Chat Button & Tooltip */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end ">
          {isChatOpen && (
            <div className="mb-2 w-80 bg-white border rounded-t-3xl rounded-bl-3xl shadow-lg p-3 relative border-blue-900 mr-12 z-50">
              <Chat />
            </div>
          )}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="bg-blue-900 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all"
          >
            <ChatBubbleOvalLeftEllipsisIcon className="h-10 w-10" />
          </button>
        </div>
      </div>
    </div>
  );
}
