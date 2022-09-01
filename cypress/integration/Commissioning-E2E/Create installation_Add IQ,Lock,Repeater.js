///<reference types="cypress" />
describe('Create Installations & Add hardwares', () => {

    let installationDetails

    beforeEach(() => {
        cy.CommissioningLogin(Cypress.env('USEREMAIL'), Cypress.env('PASSWORD'))
        cy.fixture("datarep.json").then((datarep => {
            installationDetails = datarep
        }))
        cy.CheckIqState()
    })

    afterEach(() => {
        cy.ResetIq()
        cy.DecoupleIqReleaseSite()
    })

    it('Create Installation & Add Hardwares validation', () => {
        var sitename = 'sitename_' + Date.now();

        //Check New installation button
        cy.log("Creating New Installation")
        cy.contains('New installation').should('exist').should('not.be.disabled')
        cy.contains('New installation').click()

        //Check New installation Modal
        cy.get('form').within(($form) => {
            cy.get('#GenericModalTitle').should('exist').should('contain', 'Tenant')
        })

        //Enter details in create installation modal
        cy.get('[type="radio"]')
            .check(installationDetails.tenantId, {
                force: true
            })
            .should('be.checked')
        cy.contains('Next').click()
        cy.wait(1000)
        cy.get('#ModalButton').click()

        cy.get('input[name="name"]').click({
            force: true
        }).type(sitename)

        cy.get('form').within(($form) => {
            cy.get('input[placeholder="Select business type"]').click().type(installationDetails.businessType)
                .type('{downarrow}')
                .type('{enter}')
            cy.contains('Next').click()
        })
        cy.get('form').within(($form) => {
            cy.get('input[placeholder="Country"]').click().type(installationDetails.country)
                .type('{downarrow}')
                .type('{enter}')
            cy.get('input[placeholder="Timezone"]').click().type(installationDetails.timeZone)
                .type('{downarrow}')
                .type('{enter}')
            cy.contains('Next').click()
        })
        cy.get('input[name="owner"]').click().type(installationDetails.siteOwnerEmail)
        cy.get('input[name="ownerConfirmation"]').click().type(installationDetails.siteOwnerEmail)
        cy.contains('Next').click()
        cy.contains('Start installation').click()

        //Check the sitename
        cy.get('title').should('contain', sitename)
        if (cy.get('div').find('h2').should('contain', sitename)) { cy.log("New Installation with KS tenant is created: ", +sitename) }

        //Save the site ID to fixtures
        cy.url().then(url => {
            const getUrl = url
            cy.log('Current URL is : ' + getUrl)
            var installationId = getUrl.split('/')[4]
            cy.readFile('cypress/fixtures/datarep.json').then((obj) => {
                obj.siteId = installationId
                cy.writeFile('cypress/fixtures/datarep.json', obj)
            })
        })

        //Check Add IQ button check
        cy.log("Adding IQ")
        cy.contains('Add IQ').should('exist').should('not.be.disabled').click()

        //Add IQ modal check
        cy.get('#GenericForm').find('span').should('contain', 'Add IQ')

        //Enter IQ details in the modal
        cy.get('input[name="iqName"]').click().type(installationDetails.iqName)
        cy.contains('Next').click()
        cy.get('form').within(($form) => {
            cy.get('input[type="text"]').click().type(installationDetails.iqActcode)
            cy.contains('Next').click()
        })
        cy.get('form').within(($form) => {
            cy.contains('Add IQ').click()
            cy.wait(2000)
        })

        //Check if IQ is added
        cy.CheckIqinSite().then((response) => {
            expect(response.body.items[0].mac).to.be.equal(installationDetails.IqMacID)
            expect(response.body.items[0].id).to.be.equal(installationDetails.iqId)
            cy.log("IQ 0B.7E.2B is added in the installation")
        })

        //Add Lock
        cy.log("Adding Lock")
        cy.contains('Add lock').should('exist').should('not.be.disabled').click()

        //Add Lock modal check
        cy.get('#GenericForm').find('span').should('contain', 'Lock name & type')

        //Enter Lock details in the modal
        cy.get('form').within(($form) => {
            cy.get('input[name="name"]').click().type(installationDetails.lockName)
            cy.get('[type="radio"]')
                .check('BLUENet', {
                    force: true
                })
                .should('be.checked')
            cy.contains('Next').click()
        })
        cy.get('form').within(($form) => {
            cy.get('input[type="text"]').click().type(installationDetails.lockActcode)
            cy.contains('Next').click()
        })
        cy.get('form').within(($form) => {
            cy.contains('Add lock').click()
            cy.get('#GenericModalCloseButton').click()
        })
        cy.contains('Yes, cancel').click()
        cy.wait(2000)

        //Check if lock is added
        cy.CheckLockinSite().then((response) => {
            expect(response.body.items[0].mac).to.be.equal(installationDetails.lockActcode)
            expect(response.body.items[0].iq_link_state).to.be.equal('detached')
            cy.log("Lock 0167E70100007F is added in the installation")
        })

        //Add Repeater
        cy.log("Adding Repeater")
        cy.contains('Add repeater').should('exist').should('not.be.disabled').click()

        //Add Repeater modal check
        cy.get('#GenericForm').find('span').should('contain', 'Repeater name & type')

        //Enter Repeater details in the modal
        cy.get('form').within(($form) => {
            cy.get('input[name="name"]').click().type(installationDetails.repeaterName)
            cy.get('[type="radio"]')
                .check('RFnet', {
                    force: true
                })
                .should('be.checked')
            cy.contains('Next').click()
        })
        cy.get('form').within(($form) => {
            cy.get('input[type="text"]').click().type(installationDetails.repeaterActcode)
            cy.contains('Next').click()
        })
        cy.get('form').within(($form) => {
            cy.contains('Add repeater').click()
            cy.wait(2000)
        })

        //Check if repeater is added
        cy.CheckRepeaterinSite().then((response) => {
            expect(response.body.items[0].mac).to.be.equal(installationDetails.repMac)
            cy.log("Repeater 01.CD.27 is added in the installation")
        })

        //Delete lock
        cy.get('[type="button"]').eq(7).click()
        cy.contains("Delete multiple locks").click({ force: true })
        cy.get('form').within(($form) => {
            cy.wait(3000)
            cy.get('input[type="checkbox"]').check({ force: true })
            cy.get('button').eq(1).click()
        })
        cy.get('form').within(($form) => {
            cy.get('button').eq(3).click()
        })

        //Delete repeater
        cy.get('[type="button"]').eq(9).click()
        cy.contains("Delete multiple repeaters").click({ force: true })
        cy.get('form').within(($form) => {
            cy.wait(3000)
            cy.get('input[type="checkbox"]').check({ force: true })
            cy.get('button').eq(1).click()
        })
        cy.get('form').within(($form) => {
            cy.get('button').eq(3).click()
        })

    })




})
