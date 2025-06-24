"use client";

import  { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { HiUser, HiMail, HiLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import { supabase } from "@/lib/supabaseClient";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirm) {
      Swal.fire("Oops!", "Please fill all fields.", "warning");
      return;
    }
    if (!validateEmail(email)) {
      Swal.fire("Error", "Please enter a valid email.", "error");
      return;
    }
    if (password.length < 6) {
      Swal.fire("Error", "Password must be at least 6 characters.", "error");
      return;
    }
    if (password !== confirm) {
      Swal.fire("Error", "Passwords do not match.", "error");
      return;
    }
    if (!terms) {
      Swal.fire("Hold on!", "Please accept terms & conditions.", "info");
      return;
    }

    setLoading(true);

    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      console.error(error);
      Swal.fire("Oops!", error.message, "error");
      setLoading(false);
      return;
    }

    // Instead of waiting, just inform the user to check their email.
    Swal.fire({
      icon: "success",
      title: "Sign Up Successful",
      text: "Check your email and confirm your account!",
      timer: 2500,
      showConfirmButton: false,
    }).then(() => {
      router.push("/");
    });

    setLoading(false);
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-[#0D4C5C] to-[#F76B8A] px-4">
      <div className="w-max p-8 bg-white/90 shadow-2xl rounded-2xl">
        <h1 className="text-4xl text-[#0D4C5C] font-extrabold mb-6 text-center">
          Sign Up
        </h1>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="relative">
            <HiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="User Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D4C5C] transition"
            />
          </div>

          <div className="relative">
            <HiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="usermail@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D4C5C] transition"
            />
          </div>

          <div className="relative">
            <HiLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D4C5C] transition"
            />
            {showPassword ? (
              <HiEyeOff
                onClick={() => setShowPassword(false)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
              />
            ) : (
              <HiEye
                onClick={() => setShowPassword(true)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
              />
            )}
          </div>

          <div className="relative">
            <HiLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D4C5C] transition"
            />
            {showConfirm ? (
              <HiEyeOff
                onClick={() => setShowConfirm(false)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
              />
            ) : (
              <HiEye
                onClick={() => setShowConfirm(true)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
              />
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
            />
            <label className="text-sm">I accept all terms and conditions</label>
          </div>

          <div className="flex justify-center items-center">
            <button
              type="submit"
              disabled={loading}
              className={`w-max px-6 py-2 ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#0D4C5C] hover:bg-[#083541]"
              } text-white rounded-xl font-semibold transition text-lg`}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </div>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-[#0D4C5C] font-bold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
