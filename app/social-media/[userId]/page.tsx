"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

interface SocialMediaProfile {
  id: string;
  platform: string;
  url: string;
}

export default function SocialMediaPage() {
  const [profiles, setProfiles] = useState<SocialMediaProfile[]>([]);
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { userId } = useParams(); // Get userId from URL

  useEffect(() => {
    if (!userId) return;

    const fetchProfiles = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/social-media/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch social media profiles");
        }

        const data: SocialMediaProfile[] = await response.json();
        setProfiles(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [userId]);

  const handleAddProfile = async () => {
    if (!platform || !url) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/social-media/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ platform, url }),
      });

      if (!response.ok) {
        throw new Error("Failed to add social media profile");
      }

      const newProfile: SocialMediaProfile = await response.json();
      setProfiles([...profiles, newProfile]);
      setPlatform("");
      setUrl("");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (loading) return <p>Loading profiles...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Social Media Profiles</h1>

      {/* Form to Add a New Social Media Profile */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Platform (e.g., Twitter)"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Profile URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={handleAddProfile} className="bg-blue-500 text-white px-4 py-2">
          Add Profile
        </button>
      </div>

      {/* Display Social Media Profiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map((profile) => (
          <div key={profile.id} className="border-2 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">{profile.platform}</h2>
            <a href={profile.url} target="_blank" className="text-blue-500">
              {profile.url}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
