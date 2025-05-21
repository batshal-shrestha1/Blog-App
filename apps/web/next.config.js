/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**", // Matches all paths under this hostname
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**", // Matches all paths under this hostname
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        pathname: "/**", // Matches all paths under this hostname
      },
      
      
    ],
    domains: ['example.com'],
  },
};

export default nextConfig; // Correct way to export the configuration
