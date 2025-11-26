/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    domains: ["raw.githubusercontent.com"], // external domain for the pokemon image
  },
  reactCompiler: true,
};

export default nextConfig;
