// Supabase storage host (admin-uploaded gallery/product images) so those can
// also go through the Next image optimizer.
const remotePatterns = [];
try {
  const { hostname } = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
  remotePatterns.push({ protocol: "https", hostname });
} catch {
  // env not set — no remote images configured
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    remotePatterns,
  },
};

export default nextConfig;
