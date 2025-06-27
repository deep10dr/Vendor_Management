/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    domains: [
      "bvpjqeomnaquqawmsrmn.supabase.co", // your Supabase storage domain
      "cdn-icons-png.flaticon.com"        // fallback avatar domain
    ],
  },
};

export default nextConfig;

