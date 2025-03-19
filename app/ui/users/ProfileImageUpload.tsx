"use client";

import React, { JSX, useEffect, useState } from "react";
import { CameraIcon, CloudArrowUpIcon, BookmarkIcon, PaperAirplaneIcon, UserIcon, PhoneIcon, CalendarIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub, FaGlobe } from "react-icons/fa";
import Link from "next/link";
import AcmeLogo from "../acme-logo";


interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profileBio: string;
  gender: string;
  phoneNumber: string;
  dateOfBirth: string;
  profileImageUrl: string;
}

interface SocialMediaProfile {
  platform: string;
  profileUrl: string;
}


const socialMediaIcons: { [key: string]: JSX.Element } = {
  facebook: <FaFacebook className="w-12 h-12 text-blue-600" />,
  twitter: <FaTwitter className="w-12 h-12 text-blue-400" />,
  instagram: <FaInstagram className="w-12 h-12 text-pink-500" />,
  linkedin: <FaLinkedin className="w-12 h-12 text-blue-700" />,
  github: <FaGithub className="w-12 h-12 text-gray-900" />,
  website: <FaGlobe className="w-12 h-12 text-gray-700" />,
};


export default function UserProfileUpdate() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [token,  setToken] = useState<string | null>(null);
  const [userId,  setUserId] = useState<string | null>(null)
  const [newProfile, setNewProfile] = useState<SocialMediaProfile>({
    platform: "",
    profileUrl: "",
  });
  const [profiles, setProfiles] = useState<SocialMediaProfile[]>([]);


  
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token)
   const userId = localStorage.getItem("userId");
   setUserId(userId)
    if (!token || !userId) {
      setErrorMessage("User authentication required.");
      setLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch user profile.");

        const data: UserProfile = await response.json();
        setUser(data);
      } catch (error) {
        setErrorMessage("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token, userId]);



  useEffect(() => {
    if (!userId || !token) return;
  
    const fetchSocialMediaProfiles = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/social-media/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (!response.ok) throw new Error("Failed to fetch social media profiles.");
  
        const data: SocialMediaProfile[] = await response.json();
        setProfiles(data);
      } catch (error) {
        console.error("Error fetching social media profiles:", error);
      }
    };
  
    fetchSocialMediaProfiles();
  }, [userId, token]);
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (user) {
      setUser({ ...user, [event.target.name]: event.target.value });
    }
  };

  const handleGenderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (user) {
      setUser({ ...user, gender: event.target.value.toUpperCase() }); // Ensure gender is always uppercase
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setPreviewUrl(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !token || !userId) return;

    setUploading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${userId}/uploadProfileImage`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed.");

      const updatedUser = await response.json();
      setUser(updatedUser);
      alert("Profile image updated successfully!");
    } catch (error) {
      setErrorMessage("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !token || !userId) return;

    setSaving(true);
    setErrorMessage(null);

    try {
      const updatedUser = { ...user, gender: user.gender.toUpperCase() }; // Ensure gender is uppercase before sending

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) throw new Error("Failed to update profile.");

      alert("Profile updated successfully!");
    } catch (error) {
      setErrorMessage("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

    // Handle social media profile changes
    const handleSocialMediaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setNewProfile({ ...newProfile, [e.target.name]: e.target.value });
    };

    const handleSocialMediaSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!userId || !token) return;
  
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/social-media/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProfile),
      })
        .then((res) => res.json())
        .then((data) => {
          setNewProfile({ platform: "", profileUrl: "" });
        })
        .catch((err) => console.error("Error adding social media profile:", err));
    };

  if (loading) return <p>Loading profile...</p>;
  if (errorMessage) return <p className="text-red-500">{errorMessage}</p>;

  return (
    <div className="flex-col max-md:mt-16">
         <div style={{maxWidth: "32rem"}} className="h-32 mx-auto -m-4 bg-blue-900 rounded-t-2xl flex flex-col items-center justify-center">
            <AcmeLogo />
            <h4 className="text-white text-center">Update Profile</h4>
          </div>
        <div
            style={{
            maxWidth: "32rem",
            margin: "0 auto",
            padding: "1.5rem",
            backgroundColor: "white",
            borderRadius: "0.5rem",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
            className="border-2 border-blue-900"
        >
          

            {/* Profile Image & Upload */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <div style={{ position: "relative" }}>
                <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${user?.profileImageUrl}`}
                alt="Profile"
                style={{
                    width: "6rem",
                    height: "6rem",
                    borderRadius: "50%",
                    objectFit: "cover",
                }}
                />
            </div>
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} id="fileInput" />
            <label
                htmlFor="fileInput"
                style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                fontWeight: "500",
                transition: "background 0.3s",
                }}
                className="text-blue-900"
            >
                <CameraIcon style={{ width: "2rem", height: "2rem" }} className="text-blue-900" />
                Change Photo
            </label>
            <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                fontWeight: "500",
                // color: "blue",
                backgroundColor: uploading ? "#9ca3af" : "",
                cursor: uploading ? "not-allowed" : "pointer",
                transition: "background 0.3s",
                }}
                className="text-blue-900"
            >
                <CloudArrowUpIcon style={{ width: "2rem", height: "2rem" }} />
                {uploading ? "Uploading..." : "Upload"}
            </button>
            </div>

            {/* Form Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
                { label: "First Name", name: "firstName", type: "text", icon: <UserIcon style={{ width: "1rem", height: "1rem" }} /> },
                { label: "Last Name", name: "lastName", type: "text", icon: <UserIcon style={{ width: "1rem", height: "1rem" }} /> },
                { label: "Email", name: "email", type: "email", icon: <PaperAirplaneIcon style={{ width: "1rem", height: "1rem" }} /> },
                { label: "Profile Bio", name: "profileBio", type: "textarea", icon: <DocumentTextIcon style={{ width: "1rem", height: "1rem" }} /> },
                { label: "Phone Number", name: "phoneNumber", type: "tel", icon: <PhoneIcon style={{ width: "1rem", height: "1rem" }} /> },
                { label: "Date of Birth", name: "dateOfBirth", type: "date", icon: <CalendarIcon style={{ width: "1rem", height: "1rem" }} /> },
            ].map((field) => (
                <div key={field.name} style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <label style={{ fontSize: "0.875rem", fontWeight: "500", color: "#374151", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {field.icon}
                    {field.label}
                </label>
                {field.type === "textarea" ? (
                    <textarea
                    name={field.name}
                    value={user?.[field.name] || ""}
                    onChange={handleInputChange}
                    style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "0.375rem",
                        outline: "none",
                        fontSize: "1rem",
                        transition: "border 0.3s",
                    }}
                    />
                ) : (
                    <input
                    type={field.type}
                    name={field.name}
                    value={user?.[field.name] || ""}
                    onChange={handleInputChange}
                    style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "0.375rem",
                        outline: "none",
                        fontSize: "1rem",
                        transition: "border 0.3s",
                    }}
                    />
                )}
                </div>
            ))}

            {/* Gender Select */}
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", fontWeight: "500", color: "#374151" }}>
                <UserIcon style={{ width: "1rem", height: "1rem" }} />
                Gender
            </label>
            <select
                name="gender"
                value={user?.gender || ""}
                onChange={handleGenderChange}
                style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                outline: "none",
                fontSize: "1rem",
                transition: "border 0.3s",
                }}
            >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
            </select>
            </div>

      <h3 className="text-lg font-medium text-gray-800">Add Social Media Profiles</h3>
      <form onSubmit={handleSocialMediaSubmit} className="space-y-4 mt-4">
        <select
          name="platform"
          value={newProfile.platform}
          onChange={handleSocialMediaChange}
          className="w-full p-2 border rounded-lg"
          required
        >
          <option value="">Select Platform</option>
          <option value="Facebook">Facebook</option>
          <option value="Twitter">Twitter</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="Instagram">Instagram</option>
        </select>

        <input
          type="url"
          name="profileUrl"
          value={newProfile.profileUrl}
          onChange={handleSocialMediaChange}
          placeholder="Profile URL"
          className="w-full p-2 border rounded-lg"
          required
        />

        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded-lg">
          Add Profile
        </button>
      </form>

      {/* Display Social Media Profiles */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Social Media Profiles</h3>
        <div className="flex flex-row justify-between mt-2 ">
          {profiles.map((profile, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Link
                href={profile.profileUrl}
                target="_blank"
                >
                {socialMediaIcons[profile.platform.toLowerCase()] || <FaGlobe className="w-6 h-6 text-gray-700 hover:cursor-pointer" />}
              </Link>
            </div>
          ))}
          </div>
        </div>
            {/* Error Message */}
            {errorMessage && (
            <p style={{ color: "#dc2626", fontSize: "0.875rem", marginTop: "0.5rem", textAlign: "center" }}>
                {errorMessage}
            </p>
            )}

            {/* Save Button */}
            <button
            onClick={handleSaveProfile}
            disabled={saving}
            style={{
                width: "100%",
                marginTop: "1rem",
                padding: "0.75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                borderRadius: "0.375rem",
                fontWeight: "500",
                color: "white",
                backgroundColor: saving ? "#9ca3af" : "#3b82f6",
                cursor: saving ? "not-allowed" : "pointer",
                transition: "background 0.3s",
            }}
            >
              
            <BookmarkIcon style={{ width: "2rem", height: "2rem" }} />
            {saving ? "Saving..." : "Save Changes"}
            </button>
        </div>
        
    </div>
  
  );
}
