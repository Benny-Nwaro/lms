"use client"; // Ensure this runs only on the client-side

import { useState } from "react";
import { useRouter } from "next/navigation"; // For navigation after signup
import { lusitana } from "@/app/ui/fonts";
import { AtSymbolIcon, KeyIcon, UserIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "./button";
import Link from "next/link";

export default function SignUpForm() {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    dateOfBirth: "",
    role: "",
    gender: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log(response)

      if (!response.ok) {
        throw new Error("Signup failed. Please try again.");
      }

      router.push("/auth/signin");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-1">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-2 pt-2">
        <h1 className={`${lusitana.className} mb-1 text-xl`}>
          Please enter your details.
        </h1>

        {/* First Name */}
        <div>
          <label className="mb-2 block text-xs font-medium text-gray-900">First name</label>
          <div className="relative">
            <input
              type="text"
              name="firstName"
              placeholder="Enter your first name"
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              required
              value={formData.firstName}
              onChange={handleChange}
            />
            <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Last Name */}
        <div>
          <label className="mb-2 block text-xs font-medium text-gray-900">Last name</label>
          <div className="relative">
            <input
              type="text"
              name="lastName"
              placeholder="Enter your last name"
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              required
              value={formData.lastName}
              onChange={handleChange}
            />
            <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="mb-2 block text-xs font-medium text-gray-900">Email</label>
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <AtSymbolIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="mb-2 block text-xs font-medium text-gray-900">Password</label>
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
            />
            <KeyIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className="mb-2 block text-xs font-medium text-gray-900">Phone number</label>
          <div className="relative">
            <input
              type="number"
              name="phoneNumber"
              placeholder="Enter your phone number"
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              required
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            <PhoneIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="mb-2 block text-xs font-medium text-gray-900">Date of birth</label>
          <input
            type="date"
            name="dateOfBirth"
            className="peer block w-full rounded-md border border-gray-200 py-[9px] text-sm outline-2 placeholder:text-gray-500"
            required
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
        </div>

        {/* Role Selection */}
        <div className="flex flex-row items-center gap-4 mt-2">
          <span className="text-sm">Role:</span>
          <label className="flex items-center gap-1 text-sm">
            <input type="radio" name="role" value={'instructor'.toUpperCase()} onChange={handleChange} />
            Instructor
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input type="radio" name="role" value={'student'.toUpperCase()} onChange={handleChange} />
            Student
          </label>
        </div>

        {/* Gender Selection */}
        <div className="flex flex-row items-center gap-4 mt-2">
          <span className="text-sm">Gender:</span>
          <label className="flex items-center gap-1 text-sm">
            <input type="radio" name="gender" value={'male'.toUpperCase()} onChange={handleChange} />
            Male
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input type="radio" name="gender" value={'female'.toUpperCase()} onChange={handleChange} />
            Female
          </label>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="mt-6 w-full" disabled={loading}>
          {loading ? "Signing up..." : "Sign up"}
          <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <p className="text-sm mt-2">
          Already have an account? <Link href="/auth/signin" className="text-blue-500 font-semibold">Sign in</Link>
        </p>
      </div>
    </form>
  );
}
