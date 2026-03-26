export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  ssr: true,

  sourcemap: {
    client: true,
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
});
