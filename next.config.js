/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable server-side features for Puppeteer
    experimental: {
        serverComponentsExternalPackages: ['puppeteer', '@sparticuz/chromium'],
    },
};

module.exports = nextConfig;
