///<reference types="cypress" />

describe('Installations & Lock actions', () => {

    let installationDetails

    beforeEach(() => {
        cy.CommissioningLogin(Cypress.env('USEREMAIL'), Cypress.env('PASSWORD'));
        cy.fixture("datarep.json").then((datarep => {
            installationDetails = datarep
        }))
        cy.CheckIqState()
        cy.CreateInstallation()
        cy.AddIQ()
        cy.AddLock()
        cy.AddRepeater()
    })

    afterEach(() => {
        cy.DeleteLock()
        cy.DeleteRepeater()
        cy.ResetIq()
        cy.DecoupleIqReleaseSite()
    })

    it('Attach lock from detached section & Clean IQ tree validation', () => {

        cy.wait(4000)

        //Attach lock to IQ
        cy.log("Attaching Lock to IQ from detach section")
        cy.get('[type="button"]').eq(7).click()
        cy.contains("View all & edit locks").click({
            force: true
        })
        cy.get('form').within(($form) => {
            cy.get('input[placeholder="Search on lock name or mac"]').click().type(installationDetails.lockName)
            cy.wait(3000)
            cy.get('[type="button"]').eq(1).click()

        })
        cy.get('ul>li').contains('Attach').should('exist').should('not.be.disabled').click({
            force: true
        })

        cy.get('form').within(($form) => {
            cy.get('input[placeholder="Search on IQ name or mac"]').click().type(installationDetails.iqName)
                .type('{downarrow}')
                .type('{enter}')
            cy.wait(3000)
            cy.get('[type=submit]').click()
        })

        cy.get('form').within(($form) => {
            cy.get('button#GenericModalCloseButton').click({
                force: true
            })
        })
        cy.get('[type="button"]')
        cy.log("Lock is added to the IQ tree")
        cy.wait(2000)

        //Present maintenance card to the lock
        cy.log("Presenting Maintenance card")
        cy.Mcard()

        //Check if lock is attached
        cy.CheckLockinSite().then((response) => {
            expect(response.body.items[0].mac).to.be.equal(installationDetails.lockActcode)
            expect(response.body.items[0].iq_link_state).to.be.equal('attached')
            cy.log("Lock 0167E70100007F is attached to the IQ 0B.7E.2B and online")

        })

        //Clean IQ tree
        cy.log("Detach all hardware from IQ")
        cy.get('path').eq(16).click()
        cy.get('[type="button"]').eq(10).click()
        cy.wait(2000)
        cy.get('[type="button"]').eq(11).click()
        cy.get('ul>li').find('p').contains('Detach all hardware').click({
            force: true
        })
        cy.get('form').within(($form) => {
            cy.get('button#ModalButton').contains('Yes, detach').click()
            cy.wait(30000)

            //Check if lock is detached
            cy.CheckLockinSite().then((response) => {
                expect(response.body.items[0].iq_link_state).to.be.equal('detached')
                cy.log("Lock 0167E70100007F is detached from the IQ 0B.7E.2B")
            })
        })
    })

    it('Add lock to IQ & Detach lock from IQ directly validation', () => {

        //Add lock to IQ tree
        cy.DeleteLock()
        cy.wait(4000)

        cy.log("Adding the Lock to the IQ tree")
        cy.get('[type="button"]').eq(11).click()
        cy.get('ul>li').find('p').contains('Attach lock').should('exist').should('not.be.disabled').click({
            force: true
        })
        cy.get('form').within(($form) => {
            cy.get('input[name="name"]').click().type(installationDetails.lockName)
            cy.wait(3000)
            cy.get('[role="radiogroup"]').contains('BLUENet').click({
                force: true
            })
            cy.contains('Next').click()
        })
        cy.get('form').within(($form) => {
            cy.get('input[type="text"]').click().type(installationDetails.lockActcode)
            cy.contains('Next').click()
        })
        cy.get('form').within(($form) => {
            cy.contains('Attach lock').click()
            cy.wait(4000)
            cy.get('#GenericModalCloseButton').click()
        })
        cy.get('#ModalPopperAccept').click()
        cy.wait(4000)

        //Present maintenance card to the lock
        cy.log("Presenting Maintenance card")
        cy.Mcard()

        //Check if lock is attached
        cy.CheckLockinSite().then((response) => {

            expect(response.body.items[0].mac).to.be.equal(installationDetails.lockActcode)
            expect(response.body.items[0].iq_link_state).to.be.equal('attached')
            cy.log("Lock 0167E70100007F is attached to the IQ 0B.7E.2B and online")

            //Save lock id
            cy.readFile('cypress/fixtures/datarep.json').then((installationDetails) => {
                installationDetails.lockId = response.body.items[0].id
                cy.writeFile('cypress/fixtures/datarep.json', installationDetails)
            })
        })

        // Detach lock from IQ
        cy.log("Detach lock from IQ")
        cy.get('[type="button"]').eq(10).click({
            force: true
        })
        cy.get('[title="Expand"]').click({
            force: true
        })
        cy.wait(2000)
        cy.get('[type="button"]').eq(12).click({
            force: true
        })
        cy.wait(4000)
        cy.get('form').within(($form) => {
            cy.get('button').eq(1).contains('Detach lock').click()
        })
        cy.get('form').then(($form) => {
            cy.get('button').contains('Yes, detach lock').click()
            cy.wait(30000)
        })

        //Check detach state of locks and retry force detach if failed before
        cy.CheckLockinSite().then((response) => {
            if (response.body.items[0].iq_link_state == 'detached_pending') {
                cy.get('form').then(($form) => {
                    cy.get('#GenericModalCloseButton').click()
                })

                cy.get('[type="button"]').eq(10).click()
                cy.get('[type="button"]').eq(12).click()
                cy.wait(2000)
                cy.get('form').within(($form) => {
                    cy.get('button').eq(1).contains('Detach lock').click()
                })
                cy.get('button').contains('Force detaching').click({
                    force: true
                })
                cy.get('form').then(($form) => {
                    cy.get('button').contains('Force detach').click({
                        force: true
                    })
                })
                cy.wait(10000)
            }
            else if (response.body.items[0].iq_link_state == 'detached') {
                cy.log("Lock is detached successfully")
            }
        })

    })
})
