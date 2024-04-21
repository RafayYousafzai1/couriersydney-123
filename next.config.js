/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: "AIzaSyBhY9LbIHmQUmjDsSfqYjRORMiiK133u1Y",
  },
  images: {
    domains: [
      "images.unsplash.com",
      "cdn.pixabay.com",
      "images.pexel.com",
      "img.freepik.com",
      "localhost",
      "firebasestorage.googleapis.com",
    ],
  },
  /* config options here */
};

module.exports = nextConfig;
