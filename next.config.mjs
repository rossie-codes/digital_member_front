// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;



// // next.config.js
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     compiler: {
//       styledComponents: true,
//     },
//     // ... other Next.js config options
//   };
  
//   export default nextConfig; // Use ES module export syntax
  

// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
      styledComponents: true,
  },
  // Configure experimental features here, if needed
  // Ensure that any experimental feature you enable is supported by Next.js
  // and correctly named as per the Next.js documentation
  // experimental: {
      // Example: Enable React Server Components (if desired and supported)
      // reactRoot: true,
      // Add other experimental features as needed
  // },
  // Add other Next.js configuration options as required
};

export default nextConfig;