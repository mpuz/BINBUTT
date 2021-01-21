module.exports = {
  env: {
    ver: require('./package.json').version,
  },
  server: {
    host: '0'
  },

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
    '@nuxtjs/pwa',
    'nuxt-clipboard2',

    // ['nuxt-twa-module', {
    //   defaultUrl: 'https://your-url.com',
    //   hostName: 'your-url.com',
    //   applicationId: 'com.example.example',
    //   launcherName: 'Your app name',
    //   versionCode: 1,
    //   versionName: '1.0',
    //   statusBarColor: blue,
    //   // The sha256Fingerprints by is an array with one SHA-256 key string.
    //   // But if you have multiple you can add them to the array. More information about the website asociation:
    //   // https://developer.android.com/training/app-links/verify-site-associations#web-assoc
    //   sha256Fingerprints: ['/* your SHA-256 keys */'],
    //   /* optional */
    //   /* overwrite default location for icon */
    //   iconPath: '/static/icon.png',
    //   /* Overwrite folder where to put .wellknown */
    //   distFolder: '.nuxt/dist/client',
    // }]

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
    app: {
      theme: 'auto'
    }

  },

  // Build configuration
  build: {
    // Extract CSS in a separated file
    extractCSS: true,

    // You can extend webpack config here
    //extend(config) {
    // ...
    // }
  },

  // Additional CSS configuration
  css: [
    'assets/app.css'
  ]
}
