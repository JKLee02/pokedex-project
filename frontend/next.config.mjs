/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com", // For pokemon images
        pathname: "/**",
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
