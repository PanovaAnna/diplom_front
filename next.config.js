/** @type {import('next').NextConfig} */
const withPlugins = require("next-compose-plugins");
const withImages = require("next-images");

const nextConfig = {
    images : {
        formats : ['image/webp'],
        disableStaticImages: true
    },
    reactStrictMode: false,
    env : {
        API_URL: "https://deliverydubna.tw1.su:5000"
        // API_URL: "http://localhost:5000"
    },
}

module.exports = withPlugins([withImages], nextConfig)
