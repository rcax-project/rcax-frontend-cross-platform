// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    modules: ['@nuxtjs/tailwindcss'],
    build: {
        postcss: {
            postcssOptions: require("./postcss.config.js"),
        },
    },
    ssr: false,
    publicRuntimeConfig: {
        API_BASE_URL: process.env.API_BASE_URL
    }
})
