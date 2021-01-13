module.exports = {
  target: 'static',

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
    name: 'binance-buttons',
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
