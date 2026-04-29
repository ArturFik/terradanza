export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase:
        process.env.NUXT_PUBLIC_API_BASE || "http://109.172.86.71/api/v1",
      mediaBase:
        process.env.NUXT_PUBLIC_MEDIA_BASE || "http://109.172.86.71:9000/terradanza",
    },
  },
  vite: {
    optimizeDeps: {
      include: ["@vue/devtools-core", "@vue/devtools-kit"],
    },
  },
});
