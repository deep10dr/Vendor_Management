"use client";

import { useRouter } from "next/navigation";

export default function AlertUser() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Login Required
      </h1>
      <p className="text-gray-600 mb-6">
        Please login if you already have an account or sign up if you are new.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => router.push("/login")}
          className="px-6 py-3 bg-[#0D4C5C] text-white rounded-full hover:bg-[#083541] transition"
        >
          Login
        </button>
        <button
          onClick={() => router.push("/signup")}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
