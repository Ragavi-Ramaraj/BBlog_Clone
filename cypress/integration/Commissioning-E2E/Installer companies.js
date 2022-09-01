///<reference types="cypress" />
describe('Installer companies', () => {

    let installationDetails

    beforeEach(() => {
        cy.CommissioningLogin(Cypress.env('USEREMAIL'), Cypress.env('PASSWORD'))
        cy.fixture("datarep.json").then((datarep => {
            installationDetails = datarep
        }))
    })

    it('Edit company info', () => {

        //Check the company page button
        cy.get('[type="button"]').eq(0).click()
        cy.contains('Company Information').should('exist').should('not.be.disabled').click()

        //Check the edit details button
        cy.contains('Edit details').should('exist').should('not.be.disabled').click()

        //Update company profile details
        cy.get('form').within(($form) => {
            cy.get('input[name="customerReference"]').click().clear().type(installationDetails.installerCompanyName)
            cy.get('input[name="phoneNumber"]').click().clear().type(installationDetails.installerCompanyPhone)
            cy.get('input[name="email"]').click().clear().type(installationDetails.installerCompanyEmail)
            cy.get('input[name="websiteUrl"]').click().clear().type(installationDetails.installerCompanyWebsite)
            cy.get('button').contains('Save changes').click()
            cy.wait(2000)
        })

        cy.InstallerCompanyInfo()
        return cy.fixture('installercompanyinfo').then((companyData) => {
            //Verify if the new communication info is saved
            expect(companyData.customer_reference).to.be.equal(installationDetails.installerCompanyName)
            expect(companyData.email).to.be.equal(installationDetails.installerCompanyEmail)
            expect(companyData.phone_number).to.be.equal(installationDetails.installerCompanyPhone)
            expect(companyData.website_url).to.be.equal(installationDetails.installerCompanyWebsite)
        })

    })

    it('Edit company address', () => {

        cy.get('[type="button"]').eq(0).click()
        cy.contains('Company Information').click()

        //Check the edit address button
        cy.contains('Edit address').should('exist').should('not.be.disabled').click()

        //Update address
        cy.get('form').within(($form) => {
            cy.get('input[name="street"]').click().clear().type(installationDetails.installerCompanyStreet)
            cy.get('input[name="postCode"]').click().clear().type(installationDetails.installerCompanyPostalcode)
            cy.get('input[name="city"]').click().clear().type(installationDetails.installerCompanyCity)
            cy.get('input[placeholder="Country"]').click().clear().type(installationDetails.installerCompanyCountry)
                .type('{downarrow}').type('{enter}')
            cy.get('button').contains('Save changes').click()
            cy.wait(5000)
        })

        cy.InstallerCompanyInfo()
        return cy.fixture('installercompanyinfo').then((companyData) => {
            //Verify if the new address is saved
            expect(companyData.street).to.be.equal(installationDetails.installerCompanyStreet)
            expect(companyData.post_code).to.be.equal(installationDetails.installerCompanyPostalcode)
            expect(companyData.city).to.be.equal(installationDetails.installerCompanyCity)
            expect(companyData.country.name).to.be.equal(installationDetails.installerCompanyCountry)
        })
    })

    it('Edit main contact', () => {

        //Update company contact person
        cy.get('[type="button"]').eq(0).click()
        cy.contains('Company Information').click()
        cy.contains('Change').should('exist').click()
        cy.get('form').within(($form) => {
            cy.get('input[placeholder="Select the main contact person"]').click()
            cy.get('button[title="Clear"]').click()
            cy.get('input[placeholder="Select the main contact person"]').click().type(installationDetails.companyContact1).type('{downarrow}')
                .type('{enter}')
            cy.get('button').contains('Save changes').click()
        })

        cy.InstallerCompanyInfo()
        return cy.fixture('installercompanyinfo').then((companyData) => {
            //Verify if the new contact is saved
            expect(companyData.contact.email).to.be.equal(installationDetails.companyContact1)
        })
    })
})
