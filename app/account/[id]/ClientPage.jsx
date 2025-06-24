"use client";

import {
  HiUser,
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiCurrencyRupee, 
  HiBriefcase,
  HiCheckCircle,
  HiLockClosed,
  HiLogout,
} from "react-icons/hi";
import { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ClientPage({ data }) {
  const [editableData, setEditableData] = useState({ ...data });
  const [shakeField, setShakeField] = useState("");
  const router = useRouter();

  const handleChange = (field, value) => {
    const lockedFields = ["experience", "status", "phone", "email", "budget"];
    if (lockedFields.includes(field)) {
      setShakeField(field);
      setTimeout(() => setShakeField(""), 500);
    } else {
      setEditableData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = async () => {
    Swal.fire({
      title: "Updating...",
      text: "Please wait while we save your changes.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const { error } = await supabase
      .from("franchise_requests")
      .update(editableData)
      .eq("id", editableData.id);

    if (error) {
      Swal.fire("Error", error.message, "error");
    } else {
      Swal.fire("Saved!", "Your changes have been saved.", "success");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut(); // optional, logs out Supabase session too
    sessionStorage.removeItem("user");
    router.replace("/account");

  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 pt-20">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 pt-28">
        {/* Gradient ring behind image */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-10 bg-gradient-to-br from-[#0D4C5C] to-[#F76B8A] h-32 w-32 md:h-36 md:w-36 rounded-full shadow-xl"></div>

        {/* Profile image */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-20 bg-white rounded-full shadow-lg overflow-hidden">
          <img
            src={editableData.image_url}
            alt="Profile"
            className="h-32 w-32 md:h-36 md:w-36 rounded-full object-cover hover:scale-105 transition"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4 mt-12">
          <LabelInput
            Icon={HiUser}
            value={editableData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />

          <LabelInput
            Icon={HiMail}
            value={editableData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            locked
            shake={shakeField === "email"}
          />

          <LabelInput
            Icon={HiPhone}
            value={editableData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            locked
            shake={shakeField === "phone"}
          />

          <LabelInput
            Icon={HiLocationMarker}
            value={editableData.location}
            onChange={(e) => handleChange("location", e.target.value)}
          />

          <LabelInput
            Icon={HiCurrencyRupee}
            value={editableData.budget}
            type="number"
            onChange={(e) => handleChange("budget", e.target.value)}
            locked
            shake={shakeField === "budget"}
          />

          <LabelInput
            Icon={HiCheckCircle}
            value={editableData.status}
            onChange={(e) => handleChange("status", e.target.value)}
            locked
            shake={shakeField === "status"}
            statusColor={editableData.status}
          />

          <LabelInput
            Icon={HiBriefcase}
            value={editableData.experience}
            onChange={(e) => handleChange("experience", e.target.value)}
            locked
            shake={shakeField === "experience"}
          />

          <div className="flex gap-10 w-full justify-center items-center p-2">
            <button
              onClick={handleSave}
              className=" bg-[#0D4C5C] hover:bg-[#083541] text-white font-semibold py-3 px-6 rounded-full transition self-center"
            >
              Save Changes
            </button>

            {/* 🚀 LOGOUT BUTTON */}
            <button
              onClick={handleLogout}
              className=" flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-full transition self-center"
            >
              <HiLogout /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LabelInput({
  Icon,
  value,
  onChange,
  type = "text",
  locked = false,
  shake = false,
  statusColor,
}) {
  let color = "text-gray-700";
  if (statusColor) {
    if (statusColor.toLowerCase() === "pending") color = "text-yellow-500";
    else if (statusColor.toLowerCase() === "rejected") color = "text-red-500";
    else if (statusColor.toLowerCase() === "accepted") color = "text-green-500";
  }

  return (
    <div className="flex items-center gap-3 border-b border-gray-300 focus-within:border-[#0D4C5C]">
      <Icon className="text-[#0D4C5C] flex-shrink-0" />
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full py-2 bg-transparent focus:outline-none ${statusColor ? color : ""
          }`}
        readOnly={locked}
      />
      {locked && (
        <HiLockClosed
          className={`text-gray-400 flex-shrink-0 ${shake ? "animate-shake" : ""}`}
        />
      )}
    </div>
  );
}
