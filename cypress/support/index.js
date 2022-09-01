
require('cypress-plugin-retries')

// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
//import 'cypress-plugin-retries'

// Alternatively you can use CommonJS syntax:
// require('./commands')

import './commands'
//import '../integration/apptest_flows/installationsPage'
import './Thinger_CATE_api_calls'

before(() => {
  cy.save_cap_access_token();
  cy.save_sap_access_token();
});

Cypress.on('uncaught:exception', (err, runnable) => {
  // we expect a 3rd party library error with message 'list not defined'
  // and don't want to fail the test so we return false
  if (err.message.includes('list not defined')) {
    return false
  }
  // we still want to ensure there are no other unexpected
  // errors, so we let them fail the test
})
