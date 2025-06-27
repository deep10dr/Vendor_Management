"use client";

import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userUrl, setUserUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Fetch user and image URL on load
  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("user"));
    if (userData) {
      setUser(userData);
      fetchImageUrl(userData.id);
    } else {
      setLoading(false);
    }
  }, []);

  // ✅ Get image from Supabase table
  const fetchImageUrl = async (id) => {
    const { data, error } = await supabase
      .from("franchise_requests")
      .select("image_url")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching image URL:", error);
    } else {
      setUserUrl(data?.image_url);
    }
    setLoading(false);
  };

  // ✅ Fallback avatar
  const fallbackUrl = "https://cdn-icons-png.flaticon.com/128/4140/4140037.png";
  const imageSrc = userUrl?.startsWith("http") ? userUrl : fallbackUrl;

  return (
    <div
      title="Go to Account"
      className="relative flex justify-center items-center p-1 cursor-pointer group"
      onClick={() =>
        router.push(user?.id ? `/account/${user.id}` : "/account")
      }
    >
      {/* 🔵 Hover Ring */}
      <div className="absolute w-12 h-12 rounded-full border-2 border-dashed border-[#0D4C5C] opacity-0 group-hover:opacity-100 group-hover:animate-spin-slow"></div>

      {/* 👤 Avatar */}
      {loading ? (
        <div className="h-10 w-10 rounded-full bg-gray-300 animate-pulse border-2 border-white"></div>
      ) : (
        <Image
          alt="User Avatar"
          src={imageSrc}
          width={40}
          height={40}
          className="rounded-full border-2 border-white w-10 h-10 object-cover"
        />
      )}
    </div>
  );
};

export default Profile;
