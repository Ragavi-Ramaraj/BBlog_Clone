const { defineConfig } = require('cypress')

module.exports = defineConfig({
  chromeWebSecurity: false,
  defaultCommandTimeout: 30000,
  pageLoadTimeout: 150000,
  responseTimeout: 50000,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://candidatex:qa-is-cool@qa-task.backbasecloud.com/',
    experimentalSessionAndOrigin: true,
    specPattern: 'cypress/e2e/BBlog/**'
  },
})