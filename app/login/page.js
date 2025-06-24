"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import { supabase } from "@/lib/supabaseClient"; // ✅ make sure you have this

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill in both email and password.",
      });
      return;
    }

    if (!validateEmail(email)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Please enter a valid email address.",
      });
      return;
    }

    if (password.length < 6) {
      Swal.fire({
        icon: "error",
        title: "Weak Password",
        text: "Password must be at least 6 characters.",
      });
      return;
    }

    setLoading(true);

    // ✅ Perform actual login with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message,
      });
      setLoading(false);
      return;
    }

    // ✅ Store user info in sessionStorage as requested
    sessionStorage.setItem("user", JSON.stringify(data.user));

    Swal.fire({
      icon: "success",
      title: "Login Successful",
      text: "Welcome back!",
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      router.push("/");
    });

    setLoading(false);
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0D4C5C] to-[#F76B8A] px-4">
      <div className="bg-white/90 backdrop-blur-md p-10 rounded-xl shadow-2xl w-max">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-[#0D4C5C]">
          Login
        </h1>
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div className="relative">
            <label className="block text-sm font-semibold text-[#0D4C5C] mb-1">Email</label>
            <HiMail className="absolute left-3 top-[50px] transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D4C5C] transition"
              required
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <label className="block text-sm font-semibold text-[#0D4C5C] mb-1">Password</label>
            <HiLockClosed className="absolute left-3 top-[50px] transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D4C5C] transition"
              required
            />
            {showPassword ? (
              <HiEyeOff
                onClick={() => setShowPassword(false)}
                className="absolute right-3 top-[50px] transform -translate-y-1/2 text-gray-400 cursor-pointer"
              />
            ) : (
              <HiEye
                onClick={() => setShowPassword(true)}
                className="absolute right-3 top-[50px] transform -translate-y-1/2 text-gray-400 cursor-pointer"
              />
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center items-center w-full">
            <button
              type="submit"
              disabled={loading}
              className={`w-max px-6 py-2 ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#0D4C5C] hover:bg-[#083541]"
              } text-white rounded-lg font-semibold transition text-lg`}
            >
              {loading ? "Logging In..." : "Log In"}
            </button>
          </div>
        </form>

        <p className="text-sm text-center mt-6 text-gray-700">
          Don't have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-[#0D4C5C] font-bold cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </div>
    </main>
  );
}
