"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Profile from "@/components/profile";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null); // user object
  const [isDisabled, setIsDisabled] = useState(true); // dashboard button state

  // ✅ Load user from sessionStorage on first render
  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setIsDisabled(false);
    }
  }, []);

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen text-white px-6">
      {/* ✅ Top-right login/signup or avatar */}
      {!user ? (
        <div className="absolute top-6 right-6 flex gap-4">
          <button
            onClick={() => router.push("/login")}
            className="px-5 cursor-pointer py-2 border border-white rounded-md font-medium hover:bg-white hover:text-[#0D4C5C] transition duration-200"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/signup")}
            className="px-5 py-2 cursor-pointer border border-white rounded-md font-medium hover:bg-white hover:text-[#0D4C5C] transition duration-200"
          >
            Sign Up
          </button>
        </div>
      ) : (
        <div className="absolute top-6 right-6 flex items-center gap-2">
          <Profile />
        </div>
      )}

      {/* ✅ Heading */}
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-sm">
          Merchant Hub
        </h1>
        <p className="text-lg md:text-xl font-light mb-10">
          Manage franchise onboarding, vendor status, and revenue — all in one
          secure, intuitive platform.
        </p>
      </div>

      {/* ✅ Action buttons */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Dashboard button */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => router.push("/dashboard")}
            disabled={isDisabled}
            className={`px-8 py-3 border border-white rounded-md font-semibold transition duration-200 w-60 ${
              isDisabled
                ? "bg-white/20 opacity-50 cursor-not-allowed"
                : "bg-white/20 hover:bg-white hover:text-[#0D4C5C]"
            }`}
          >
            Go to Dashboard
          </button>
          {isDisabled && (
            <p className="mt-2 text-xs text-center text-white/90 w-60">
              Dashboard access is enabled after login or sign up.
            </p>
          )}
        </div>

        {/* Franchise request button */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => router.push("/franchise-request")}
            className="px-8 py-3 bg-white/20 border border-white rounded-md font-semibold hover:bg-white hover:text-[#0D4C5C] transition duration-200 w-60"
          >
            Request Franchise
          </button>
          <p className="mt-2 text-xs text-center text-white/90 w-60">
            Submit a request to join our franchise network.
          </p>
        </div>
      </div>
    </main>
  );
}
