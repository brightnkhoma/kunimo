import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    allowedDevOrigins: ['192.168.1.152'],
  images : {
    remotePatterns :[
      {
        protocol: "https",
        hostname: "**"
      }
      ]
  }
  /* config options here */
};

export default nextConfig;
