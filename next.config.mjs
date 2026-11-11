/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  allowedDevOrigins: ["monitor-spearhead-handcuff.ngrok-free.dev"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "kopi-kita.ab279f80ac155ac28a96d2a9d8b37f96.r2.cloudflarestorage.com",
        pathname: "/kopi-kita/**",
      },
    ],
  },
  reactCompiler: true,
  async headers() {
    return [
      {
        source: "/api/:path*", // Berlaku untuk semua endpoint di dalam folder /api/
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // Mengizinkan semua domain/platform
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
