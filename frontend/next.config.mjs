/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
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
