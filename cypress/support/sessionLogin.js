Cypress.Commands.add('signin', () => {
    cy.session('signin', () => {
        cy.visit('/')
        cy.contains('a', ' Sign in ').should('exist').click()
        cy.get('[placeholder="Email"]').click().type(Cypress.env('userEmail'))
        cy.get('[placeholder="Password"]').click().type(Cypress.env('passWord'))
        cy.contains('button', ' Sign in ').click()
        cy.origin('https://qa-task.backbasecloud.com/', () => {
        })
    })
})

