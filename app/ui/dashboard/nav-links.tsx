"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import {
  HomeIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  AcademicCapIcon,
  ArrowUpTrayIcon,
  BookOpenIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

interface NavLinksProps {
  role: string | null;
  userId: string | null;
}

export default function NavLinks({ role, userId }: NavLinksProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const links =
    role === "INSTRUCTOR"
      ? [
          { name: "Home", href: "/dashboard", icon: HomeIcon },
          {
            name: "Courses",
            href: "/dashboard/courses",
            icon: AcademicCapIcon,
            sublinks: [
              { name: "Create Course", href: "/dashboard/courses/create", icon: PlusIcon },
              { name: "View Courses", href: "/dashboard/courses/instructorCourses", icon: AcademicCapIcon },
            ],
          },
          {
            name: "Assignments",
            href: "/dashboard/assignments",
            icon: DocumentTextIcon,
            sublinks: [{ name: "View Assignment", href: "/dashboard/assignments/allassignments", icon: DocumentTextIcon }],
          },
          { name: "Lessons", href: "/dashboard/lessons/alllessons", icon: BookOpenIcon },
          { name: "Submissions", href: "/dashboard/submissions", icon: ArrowUpTrayIcon },
        ]
      : [
          { name: "Home", href: "/dashboard", icon: HomeIcon },
          {
            name: "Courses",
            href: "/dashboard/courses",
            icon: AcademicCapIcon,
            sublinks: [
              { name: "View Courses", href: "/dashboard/courses/allcourses", icon: AcademicCapIcon },
              { name: "Enrolled Courses", href: "/dashboard/courses/enrolledCourses", icon: UserPlusIcon },
            ],
          },
          {
            name: "Assignments",
            href: "/dashboard/assignments",
            icon: DocumentTextIcon,
            sublinks: [{ name: "View Assignment", href: "/dashboard/assignments/allassignments", icon: DocumentTextIcon }],
          },
          { name: "Lessons", href: "/dashboard/lessons/alllessons", icon: BookOpenIcon },
          userId && {
            name: "Submissions",
            href: `/dashboard/students/${userId}/submissions/`,
            icon: ArrowUpTrayIcon,
          },
        ].filter(Boolean); // Remove null items if userId is missing

  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  if (!role) return null;

  return (
    <>
      {links.map((link) => {
        if (!link) return null;
        const LinkIcon = link.icon;
        const isActive = pathname === link.href;
        const isDropdownOpen = openDropdown === link.name;

        return (
          <div key={link.name} className="w-full">
            <button
              onClick={(e) => {
                if (link.sublinks) {
                  e.preventDefault();
                  toggleDropdown(link.name);
                } else {
                  router.push(link.href);
                }
              }}
              className={clsx(
                "flex w-full items-center gap-2 p-3 text-sm font-medium rounded-md bg-gray-50 hover:bg-sky-100 hover:text-blue-600 md:px-3",
                {
                  "bg-sky-100 border-b-2 border-b-blue-900 text-blue-600": isActive,
                }
              )}
            >
              <LinkIcon className="w-6" />
              <p className="hidden md:block">{link.name}</p>
              {link.sublinks && (
                <span className="ml-auto">
                  {isDropdownOpen ? <ChevronDownIcon className="w-5" /> : <ChevronRightIcon className="w-5" />}
                </span>
              )}
            </button>

            {/* Dropdown Submenu */}
            {isDropdownOpen && link.sublinks && (
              <div className="ml-6 mt-1 space-y-1">
                {link.sublinks.map((sublink) => {
                  const SublinkIcon = sublink.icon;
                  const isSublinkActive = pathname === sublink.href;

                  return (
                    <Link
                      key={sublink.name}
                      href={sublink.href}
                      className={clsx(
                        "flex items-center gap-2 p-2 pl-4 text-sm font-medium text-gray-700 rounded-md hover:bg-sky-100 hover:text-blue-600 max-md:text-xs max-md:text-nowrap",
                        { "text-blue-600 bg-sky-100": isSublinkActive }
                      )}
                    >
                      <SublinkIcon className="w-4" />
                      {sublink.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
