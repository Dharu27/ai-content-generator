/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow calls to local Ollama from server-side API route
  serverExternalPackages: [],
};

module.exports = nextConfig;
