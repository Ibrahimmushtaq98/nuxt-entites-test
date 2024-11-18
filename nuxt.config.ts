// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { 
    enabled: true 
  },
  modules: [
    '@sidebase/nuxt-auth'
  ],
  nitro: {
    preset: 'vercel',
  },

  auth:{
    //baseURL: "https://test-auth.laborly.io/api/auth",
    provider:{
      type: 'authjs',
      trustHost: false,
      defaultProvider: 'identityserver',
      addDefaultCallbackUrl:false
    },
    globalAppMiddleware: false
  }
})