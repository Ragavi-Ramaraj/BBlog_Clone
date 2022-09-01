///<reference types="cypress" />
describe('Installers', () => {

    let installationDetails

    beforeEach(() => {
        cy.CommissioningLogin(Cypress.env('USEREMAIL'), Cypress.env('PASSWORD'))
        cy.fixture("datarep.json").then((datarep => {
            installationDetails = datarep
        }))
        cy.CreateInstaller()
    })

    it('Installers validation', () => {

        //Search Installer
        cy.get('[type="button"]').eq(0).click()
        cy.get('ul>li').find('h2').contains('Installers').click()
        cy.wait(2000)
        cy.get('input[type="text"]').eq(0).click().type(installationDetails.newInstaller)
        cy.wait(3000)
        cy.get('div').find('p').contains(installationDetails.newInstaller).should('exist').click()

        //Update role - Installer basic
        cy.contains('Change role').click()
        cy.get('form').within(($form) => {
            cy.get('[role="radiogroup"]').contains('Installer basic').click({
                force: true
            })
            cy.get('button#ModalButton').click()
        })

        //Update role - Installer basic
        cy.contains('Change role').click()
        cy.get('form').within(($form) => {
            cy.get('[role="radiogroup"]').contains('Installer admin').click({
                force: true
            })
            cy.get('button#ModalButton').click()
        })
        //Verify the snackbar message
        cy.get('#client-snackbar').should('exist')
        cy.wait(4000)

        //Resend invite for registration
        cy.contains('Resend invitation link').click()
        //Verify the snackbar message
        cy.get('#client-snackbar').should('exist')


        //Delete installer
        cy.contains('Delete Installer').click()
        cy.get('form').within(($form) => {
            cy.get('button#ModalButton').contains('Yes, remove').click()
            cy.wait(2000)
        })

        //Check if the installer is deleted
        cy.get('input[type="text"]').eq(0).click().type(installationDetails.newInstaller)
        cy.wait(3000)
        cy.get('table').contains('No installers found.').should('exist')
    })
})
