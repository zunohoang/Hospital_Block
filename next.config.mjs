/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: function (config, options) {
    config.experiments = {
      asyncWebAssembly: true,
      ...config.experiments,
      layers: true,
    };
    return config;
  }
};
export default nextConfig;
