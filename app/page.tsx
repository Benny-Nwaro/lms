"use client";

import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Page() {
  const isClient = typeof window !== "undefined"; // Ensure client-side execution

  const [buttonText, setButtonText] = useState(
    isClient && localStorage.getItem("token") ? "Dashboard" : "Log in"
  );
  const [buttonLink, setButtonLink] = useState(
    isClient && localStorage.getItem("token") ? "/dashboard" : "/auth/signin"
  );

  useEffect(() => {
    if (!isClient) return; // Prevent running on the server

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");

    if (token && userId && role) {
      setButtonText("Dashboard");
      setButtonLink("/dashboard");
    }
  }, [isClient]);

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-900 p-4 md:h-52">
        <AcmeLogo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            <strong>Welcome to </strong>
            <strong className="text-blue-500">flexisAf - LearnHub.</strong>
            <span> Your ultimate hub for education.</span>
          </p>
          <div>
            <span className="text-md">Developed by </span>
            <a href="https://benny-nwaro.github.io/myBio/" className="text-blue-500 font-bold">
              Aroh Ebenezer
            </a>
          </div>
          <Link
            href={buttonLink}
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>{buttonText}</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          <Image
            src="/hero-desktop.jpeg"
            width={1000}
            height={760}
            priority // Ensures image loads faster
            className="hidden md:block rounded-lg"
            alt="Screenshots of the dashboard project showing desktop version"
          />
          <Image
            src="/hero-desktop.jpeg"
            width={560}
            height={620}
            priority
            className="block md:hidden rounded-lg"
            alt="Screenshot of the dashboard project showing mobile version"
          />
        </div>
      </div>
    </main>
  );
}
