module.exports = {
  // target: 'static',

  // server: {
  //   host: '0'
  // },

  head: {
    title: "BINBUT",
    meta: [
      { name: "screen-orientation", content: "portrait" },
      { charset: "utf-8" },
      { nativeUI: 'true' },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-touch-fullscreen", content: "yes" },
      { name: "apple-mobile-web-app-title", content: "BINBUT" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" },
      { name: "HandheldFriendly", content: "true" },
      { hid: "description", name: "description", content: "Binance Futures API Trader" }
    ],
    //link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  plugins: [
    // .client will only be run client side on initial app load
    '~/plugins/init.client.js'
  ],
  // Nuxt modules
  modules: [
    'nuxt7',
    '@nuxtjs/pwa'
  ],

  // PWA manifest
  // https://github.com/nuxt-community/pwa-module
  manifest: {
    name: 'Binance Futures API Trader',
    short_name: "BINBUT",
    lang: 'en',
    orientation: 'portrait',
    display: 'fullscreen',
    description: 'Neat pwa for binance API futures trading'
  },

  // Framework7 Config
  framework7: {
    // ...
  },

  // Build configuration
  build: {
    // Extract CSS in a separated file
    extractCSS: true,

    // You can extend webpack config here
    extend(config) {
      // ...
    }
  },

  // Additional CSS configuration
  css: [
    'assets/app.css'
  ]
}
