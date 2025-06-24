"use client";

import React, { use, useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  HiUser,
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiCurrencyRupee,
  HiBriefcase,
  HiDocumentText,
} from "react-icons/hi";
import { supabase } from "@/lib/supabaseClient";

const FranchiseRequestPage = () => {
  const [user, setUser] = useState({});
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [experience, setExperience] = useState("");
  const [description, setDescription] = useState("");
  const [agree, setAgree] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [userId,setUserId] = useState('');
  

  useEffect(() => {
    const data = sessionStorage.getItem("user");
    if (data) {
      setUser(JSON.parse(data)?.user_metadata || {});
    }
  }, []);
  const check = async () => {
    const {data,error} = await supabase.from("franchise_requests").select("id").eq("id",user.sub).single();
    if(error){
    console.log(error);
    }
    else{
      setUserId(data.id)
    }

  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
    setSelectedAvatar("");
  };

  const handleAvatarSelect = (e) => {
    setSelectedAvatar(e.target.value);
    setProfileImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !(user.name || fullName) ||
      !(user.email || email) ||
      !phone ||
      !location ||
      !budget ||
      !experience ||
      !description ||
      (!profileImage && !selectedAvatar)
    ) {
      Swal.fire(
        "Oops!",
        "Please fill all fields & select/upload an image.",
        "warning"
      );
      return;
    }

    if (!agree) {
      Swal.fire("Hold on!", "Please accept the terms & conditions.", "info");
      return;
    }

    let imageUrl = selectedAvatar;
    if (profileImage) {
      const fileExt = profileImage.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(fileName, profileImage);

      if (uploadError) {
        Swal.fire("Upload Failed", uploadError.message, "error");
        return;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-images").getPublicUrl(fileName);
      imageUrl = publicUrl;
    }

    const { error: insertError } = await supabase
      .from("franchise_requests")
      .insert({
        id: user.sub,
        name: user.name || fullName,
        email: user.email || email,
        phone,
        location,
        budget,
        experience,
        description,
        image_url: imageUrl,
      });

    if (insertError) {
      Swal.fire("Error", insertError.message, "error");
    } else {
      Swal.fire({
        icon: "success",
        title: "Request Submitted",
        text: "Your franchise request has been sent!",
        timer: 2000,
        showConfirmButton: false,
      });

      setFullName("");
      setEmail("");
      setPhone("");
      setLocation("");
      setBudget("");
      setExperience("");
      setDescription("");
      setAgree(false);
      setProfileImage(null);
      setSelectedAvatar("");
    }
  };
 check();
 console.log(userId);

  const imagePreview = profileImage
    ? URL.createObjectURL(profileImage)
    : selectedAvatar;

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-[#0D4C5C] to-[#F76B8A] p-8 relative">
      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8">
        {imagePreview && (
          <div className="absolute -top-6 left-6 transform -translate-x-1/2 z-[100]">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
          </div>
        )}

        <h1 className="text-3xl font-extrabold text-center mb-6 text-[#0D4C5C] mt-12">
          Franchise Request
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Upload Image */}
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-semibold mb-1 text-[#0D4C5C] text-left">
              Upload Custom Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D4C5C] outline-none"
            />
          </div>

          {/* OR Select Avatar */}
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-semibold mb-1 text-[#0D4C5C] text-left">
              Or Select Preset Avatar
            </label>
            <select
              value={selectedAvatar}
              onChange={handleAvatarSelect}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D4C5C] outline-none"
            >
              <option value="">-- Select Avatar --</option>
              <option value="https://cdn-icons-png.flaticon.com/128/4140/4140037.png">
                Avatar 1
              </option>
              <option value="https://cdn-icons-png.flaticon.com/128/6997/6997662.png">
                Avatar 2
              </option>
              <option value="https://cdn-icons-png.flaticon.com/128/2202/2202112.png">
                Avatar 3
              </option>
              <option value="https://cdn-icons-png.flaticon.com/128/1999/1999625.png">
                Avatar 4
              </option>
              <option value="https://cdn-icons-png.flaticon.com/128/4140/4140047.png">
                Avatar 5
              </option>
              <option value="https://cdn-icons-png.flaticon.com/128/236/236832.png">
                Avatar 6
              </option>
            </select>
          </div>

          {/* Name */}
          <div className="relative">
            <HiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Your Name"
              value={user.name || fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={!!user.name}
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D4C5C] outline-none"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <HiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="your@email.com"
              value={user.email || email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!!user.email}
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D4C5C] outline-none"
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <HiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              placeholder="Your Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D4C5C] outline-none"
            />
          </div>

          {/* Location */}
          <div className="relative">
            <HiLocationMarker className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Preferred Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D4C5C] outline-none"
            />
          </div>

          {/* Budget */}
          <div className="relative">
            <HiCurrencyRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              placeholder="Investment Budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D4C5C] outline-none"
            />
          </div>

          {/* Experience */}
          <div className="relative">
            <HiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Business Experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D4C5C] outline-none"
            />
          </div>

          {/* Description */}
          <div className="relative">
            <HiDocumentText className="absolute left-3 top-4 text-gray-400" />
            <textarea
              rows="4"
              placeholder="Tell us more about your plan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D4C5C] outline-none"
            ></textarea>
          </div>

          {/* Agreement */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <label className="text-sm">I accept the terms & conditions.</label>
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-3 bg-[#0D4C5C] text-white rounded-xl font-semibold hover:bg-[#083541] transition"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FranchiseRequestPage;
