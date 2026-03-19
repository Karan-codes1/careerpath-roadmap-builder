/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep the ESLint ignore, but ensure the output is set to 'standalone'
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // ADD THIS LINE
  output: 'standalone', 
};

export default nextConfig;