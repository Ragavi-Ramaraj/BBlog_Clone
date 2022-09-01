//Send request to thinger to present maintenance card
Cypress.Commands.add('Mcard', () => {

  //Present maintenance card to the lock
  cy.request({
    method: 'POST',
    url: Cypress.env('MCARD_URL'),
    form: true,
    headers: {
      "Authorization": Cypress.env('AUTHORIZATION')
    },
    body: {
      "in": 4000,
    }
  })
  cy.wait(15000)

  //Check if lock is attached properly to the IQ
  cy.CheckLockinSite().then((response) => {
    if (response.body.items[0].iq_link_state == 'attached') 
    { 
      cy.log("Lock 0167E70100007F is attached to the IQ 0B.7E.2B and online") 
      }
    else {
      cy.Mcard()
    }
  })
})

//Send request to thinger to reset the IQ
Cypress.Commands.add('ResetIq', () => {

  //Reset the IQ
  cy.request({
    method: 'POST',
    url: Cypress.env('RESET_URL'),
    form: true,
    headers: {
      "Authorization": Cypress.env('AUTHORIZATION')
    },
    body: {
      "in": 4000,
    }
  })
  cy.log("Resetting the IQ")
  cy.wait(150000)

  //Check IQ state
  cy.CheckIqState()
})

//Send request to thinger to present tag
Cypress.Commands.add('Tags', () => {

  //Present tag to the lock
  cy.request({
    method: 'POST',
    url: Cypress.env('TAG_URL'),
    form: true,
    headers: {
      "Authorization": Cypress.env('AUTHORIZATION')
    },
    body: {
      "in": 4000,
    }
  })
  cy.wait(5000)

  //Check if tag is added
  cy.CheckTagsinSite()

})
