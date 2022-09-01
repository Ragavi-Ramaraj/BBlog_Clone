///<reference types="cypress" />
describe('KS Site Installation', () => {

    let installationDetails

    beforeEach(() => {
        cy.CommissioningLogin(Cypress.env('USEREMAIL'), Cypress.env('PASSWORD'))
        cy.fixture("datarep.json").then((datarep => {
            installationDetails = datarep
        }))
        cy.CheckIqState()
    })

    it('SALTO KS tenant installation', () => {

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
                obj.siteId  = getUrl.split('/')[4]
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

        //Attach lock to IQ
        cy.log("Attaching Lock to IQ")
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

        //Add Tag button check
        cy.log("Add Tags")
        cy.get('a[role="tab"]').contains('Tags').click()
        cy.contains('Add Tags').should('exist').should('not.be.disabled')
        cy.contains('Add Tags').click()

        //Add Tags modal check
        cy.get('#GenericForm').find('span').should('contain', 'Add tags')

        //Enter tag details in the modal
        cy.get('form').within(($form) => {
            cy.get('input[placeholder="Select a lock"]').click()
                .wait(3000)
                .type('{downarrow}')
                .type('{enter}')
            cy.get('input[placeholder="Select a duration"]').click()
                .wait(3000)
                .type('{downarrow}')
                .type('{enter}')
            cy.get('button#ModalButton').click({
                force: true
            })
            cy.wait(5000)
        })

        //Tag register
        cy.log("Tags Registration starts")

        //Present tag and check if it is added
        cy.Tags()

        //Finish Registration
        cy.get('form').within(($form) => {
            cy.get('button').last().click({
                force: true
            })
        })

        //Close Tag modal
        cy.get('form').within(($form) => {
            cy.get('button#ModalButton').contains('Done').click({
                force: true
            })
        })

        //Create Access button check
        cy.log("Creating Access group")
        cy.get('a[role="tab"]').contains('Access').click()
        cy.contains('Create Access').should('exist').should('not.be.disabled')
        cy.contains('Create Access').click()

        //Create Access group modal check
        cy.get('#GenericForm').find('span').should('contain', 'Access group name')

        //Enter details in create access group modal
        cy.get('form').within(($form) => {
            cy.get('input#admin').click().type(installationDetails.accessGroupName)
            cy.get('button#ModalButton').click()
        })
        cy.get('form').within(($form) => {
            cy.get('input[placeholder="Search tags"]').click().type(installationDetails.tagNumber)
            cy.wait(3000)
            cy.get('input[type="checkbox"]').check({
                force: true
            })
            cy.get('button#ModalButton').click()
        })
        cy.get('form').within(($form) => {
            cy.get('input[placeholder="Search locks"]').click().type(installationDetails.lockName)
            cy.wait(3000)
            cy.get('input[type="checkbox"]').check({
                force: true
            })
            cy.get('button#ModalButton').click()
        })
        cy.get('form').within(($form) => {
            cy.contains(installationDetails.accessGroupSchedule).click()
            cy.get('button#ModalButton').click()
        })
        cy.get('form').within(($form) => {
            cy.get('button#ModalButton').click()
            cy.wait(2000)
        })

        //Check if the access group is created
        if (cy.get('table').find('td').should('contain', installationDetails.accessGroupName)) { cy.log("Access group is created in the installation") }

        //Release now button check
        cy.log("Releasing the installation to the site owner")
        cy.get('body').contains('Release now').should('exist').should('not.be.disabled')
        cy.get('body').contains('Release now').click()
        cy.get('form').within(($form) => {
            cy.get('button#ModalButton').contains('Release').click()
        })


        ///Verify if the installation is present in released sites table
        cy.CheckReleasedSite()
        cy.contains('Released').click()
        cy.readFile('cypress/fixtures/datarep.json').then((installationDetails) => {
        cy.get('[data-cy=filter-autocomplete]')
            .click()
            .type(installationDetails.siteName)
        cy.wait(2000)
        })
        if (cy.get('[data-cy=installation-row]')
            .should('have.length', 1)) { cy.log("Installation is released to the site owner successfully") }
    })

})
