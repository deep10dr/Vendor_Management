"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);  // ✅ store user fully
  const [userUrl, setUserUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("user"));
    if (userData) {
      setUser(userData); // ✅ store
      getUrl(userData.id);
    } else {
      setLoading(false);
    }

    async function getUrl(id) {
      const { data, error } = await supabase
        .from("franchise_requests")
        .select("image_url")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
      } else {
        setUserUrl(data?.image_url);
      }
      setLoading(false);
    }
  }, []);

  const fallbackUrl =
    "https://cdn-icons-png.flaticon.com/128/4140/4140037.png";

  return (
    <div
      className="relative flex justify-center items-center p-1 cursor-pointer group"
      onClick={() => {
        if (user?.id) {
          router.push(`/account/${user.id}`); // ✅ dynamic push!
        } else {
          router.push("/account");
        }
      }}
    >
      {/* Rotating dashed ring */}
      <div className="absolute w-12 h-12 rounded-full border-2 border-dashed border-[#0D4C5C] opacity-0 group-hover:opacity-100 group-hover:animate-spin-slow"></div>

      {/* Avatar */}
      {loading ? (
        <div className="h-10 w-10 rounded-full bg-gray-300 animate-pulse border-2 border-white"></div>
      ) : (
        <img
          src={userUrl || fallbackUrl}
          alt="User profile avatar"
          className="h-10 w-10 rounded-full object-cover border-2 border-white transition-transform duration-300 group-hover:scale-110"
        />
      )}
    </div>
  );
};

export default Profile;
