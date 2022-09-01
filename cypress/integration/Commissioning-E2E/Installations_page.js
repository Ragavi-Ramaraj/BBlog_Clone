///<reference types="cypress" />
describe('In progress & Released installations', () => {

    let installationDetails

    beforeEach(() => {
        cy.CommissioningLogin(Cypress.env('USEREMAIL'), Cypress.env('PASSWORD'));
        cy.fixture("datarep.json").then((datarep => {
            installationDetails = datarep
        }))
    })

    it('Current installations table - search validation', () => {

        //Check the in progress installations tab
        cy.contains('In progress').should('exist').should('not.be.disabled')
        cy.get('div').find('h2').should('contain', 'Created by you')
        cy.get('div').find('h2').should('contain', 'Created by your company')

        //Search the in progress installations
        cy.get('[data-cy=filter-autocomplete]')
            .click()
            .type(installationDetails.installerInstallation)
        cy.wait(2000)
        cy.get('[data-cy=installation-row]')
            .should('have.length', 4)

        //Verify the site details in table
        cy.get('[data-cy=installation-row]')
            .should('contain', installationDetails.progressSiteSearchName)
            .should('contain', installationDetails.installationType)
            .should('contain', installationDetails.accessUntil)
            .should('contain', installationDetails.createdDateTime)
            .should('contain', installationDetails.tenantName)
        cy.get('[data-cy=filter-autocomplete]').click()
            .clear()

    })

    it('Current installations table - sort validation', () => {

        //Before sorting
        cy.SortInstallations('beforesort')
        //Sort ascending
        cy.get('h4').contains('Site').click()
        cy.wait(3000)
        cy.SortInstallations('ascendsort')
        //Sort descending
        cy.get('h4').contains('Site').click()
        cy.wait(3000)
        cy.SortInstallations('descendsort')

        //Verify all of the sorted order
        return cy.fixture('datarep').then((installation) => {
            expect(installation.beforesort).to.not.equal(installation.ascendsort) && expect(installation.beforesort).to.not.equal(installation.descendsort) && expect(installation.ascendsort).to.not.equal(installation.descendsort)
        })
        cy.wait(1000)
    })

    it('Current installations table - pagination links validation', () => {

        //Previous page check
        cy.get('ul>li').find('button[aria-label="Go to previous page"]').should('be.disabled')
        //Pages link check
        cy.get('ul>li').find('button[aria-label="page 1"]').should('not.be.disabled')
        cy.get('ul>li').find('button[aria-label="Go to page 2"]').should('not.be.disabled')
        cy.get('ul>li').find('button[aria-label="Go to page 3"]').should('not.be.disabled')
        cy.get('ul>li').find('button[aria-label="Go to page 3"]').click({
            multiple: true
        })
        cy.wait(2000)
        cy.get('[data-cy=installation-row]').invoke('text')
        cy.get('[data-cy=installation-row]').should('have.length', 10)
        //Next page check
        cy.get('ul>li').find('button[aria-label="Go to next page"]').should('not.be.disabled')
        cy.get('ul>li').find('button[aria-label="Go to next page"]').click({
            multiple: true
        })
        cy.wait(2000)
        cy.get('[data-cy=installation-row]').invoke('text')
        cy.get('[data-cy=installation-row]').should('have.length', 10)
        //Previous page check
        cy.get('ul>li').find('button[aria-label="Go to previous page"]').should('not.be.disabled')
        cy.get('ul>li').find('button[aria-label="Go to previous page"]').click({
            multiple: true
        })
        cy.wait(2000)
        cy.get('[data-cy=installation-row]').invoke('text')
        cy.get('[data-cy=installation-row]').should('have.length', 10)
    })

    it('Released installations table - search validation', () => {

        //Check released installations tab
        cy.contains('Released').should('exist').should('not.be.disabled').click()

        //Search the released installations
        cy.get('[data-cy=filter-autocomplete]')
            .click()
            .type(installationDetails.releasedInstallation)
        cy.wait(2000)
        cy.get('[data-cy=installation-row]')
            .should('have.length', 4)

        //Verify the site details in table
        cy.get('[data-cy=installation-row]')
            .should('contain', installationDetails.releasedSiteSearchName)
            .should('contain', installationDetails.installationType)
            .should('contain', installationDetails.releasedSiteDateTime)
            .should('contain', installationDetails.createdBy)
            .should('contain', installationDetails.releasedSiteDateTime)
            .should('contain', installationDetails.releasedTenantName)
        cy.get('[data-cy=filter-autocomplete]').click()
            .clear()
    })

    it('Released installations table - sort validation', () => {

        cy.contains('Released').click()
        cy.wait(2000)
        //Before sorting
        cy.SortInstallations('beforesort')
        //Sort ascending
        cy.get('h4').contains('Created').click()
        cy.wait(3000)
        cy.SortInstallations('ascendsort')
        //Sort descending
        cy.get('h4').contains('Created').click()
        cy.wait(3000)
        cy.SortInstallations('descendsort')

        //Verify all of the sorted order
        return cy.fixture('datarep').then((installation) => {
            expect(installation.beforesort).to.not.equal(installation.ascendsort) && expect(installation.beforesort).to.not.equal(installation.descendsort) && expect(installation.ascendsort).to.not.equal(installation.descendsort)
        })
        cy.wait(1000)
    })

})
