/** @type {import('next').NextConfig} */
const nextConfig = {
  // We removed the static export so our API routes stay alive in the cloud!
  images: {
    unoptimized: true, 
  },
};

export default nextConfig;