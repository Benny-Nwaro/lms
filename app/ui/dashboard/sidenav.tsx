"use client";
import Link from "next/link";
import NavLinks from "@/app/ui/dashboard/nav-links";
import AcmeLogo from "@/app/ui/acme-logo";
import { PowerIcon, UserIcon } from "@heroicons/react/24/outline";


interface NavLinksProps {
  role: string | null;
  userId: string | null;
}

export default function SideNav({ role, userId }: NavLinksProps) {
  const handleLogOut = () => {
    localStorage.clear();
  };

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-900  md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <AcmeLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2 overflow-x-scroll">
        <NavLinks role={role} userId={userId} />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <Link
          href="/dashboard/user/profile"
          className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
        >
          <UserIcon className="w-6" />
          <div className="hidden md:block">Profile</div>
        </Link>
        <Link
          href="/"
          onClick={handleLogOut}
          className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
        >
          <PowerIcon className="w-6" />
          <div className="hidden md:block">Sign Out</div>
        </Link>
      </div>
    </div>
  );
}
