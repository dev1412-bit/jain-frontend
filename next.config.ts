import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gymx.jain.software",
        pathname: "/storage/**",
      },
    ],
  },

  reactStrictMode: true,
};

export default nextConfig;

// import type { NextConfig } from "next";
// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "http",
//         hostname: "localhost",
//         port: "8000",
//         pathname: "/storage/**",
//       },
//       {
//         protocol: "http",
//         hostname: "127.0.0.1",
//         port: "8000",
//         pathname: "/storage/**",
//       },
//     ],
//   },
//   reactStrictMode: true,
// };

// export default nextConfig;