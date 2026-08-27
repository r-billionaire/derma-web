import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Clinic logo + owned assets served through ImageKit.
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/rbillionaire/**",
      },
      // PLACEHOLDER: Unsplash photography, used until the clinic supplies real
      // photos. Remove this pattern once every image is client-owned.
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/photo-**",
      },
    ],
  },
};

export default nextConfig;
