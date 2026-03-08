/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
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
