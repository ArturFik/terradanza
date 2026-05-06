export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase:
        process.env.NUXT_PUBLIC_API_BASE || "https://terradanza.int.yt/api/v1",
      mediaBase:
        process.env.NUXT_PUBLIC_MEDIA_BASE || "https://terradanza.int.yt/media",
      wsUrl: process.env.NUXT_PUBLIC_WS_URL || "wss://terradanza.int.yt",
    },
  },
  vite: {
    optimizeDeps: {
      include: ["@vue/devtools-core", "@vue/devtools-kit"],
    },
  },
});
