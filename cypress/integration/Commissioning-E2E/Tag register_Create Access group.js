///<reference types="cypress" />
describe('Tag registration & Access group', () => {

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
        cy.AttachLockToIq()
        cy.Mcard()
    })

    it('Tag registration and Access group validation', () => {

        //Add Tag button check
        cy.get('a[role="tab"]').contains('Tags').click()
        cy.contains('Add Tags').should('exist').should('not.be.disabled')
        cy.contains('Add Tags').click()

        //Add Tags modal check
        cy.get('#GenericForm').find('span').should('contain', 'Add tags')

        //Enter tag details in the modal
        cy.get('form').within(($form) => {
            cy.get('input[placeholder="Select a lock"]').click().type(installationDetails.lockName)
                .wait(3000)
                .type('{downarrow}')
                .type('{enter}')
            cy.get('input[placeholder="Select a duration"]').click().type(installationDetails.tagTime)
                .wait(3000)
                .type('{downarrow}')
                .type('{enter}')
            cy.get('button#ModalButton').click({
                force: true
            })
        })

        //Tag register
        cy.log("Tags Registration starts")
        cy.Tags()

        //Check if tag is added
        cy.CheckTagsinSite().then((response) => {
            if (expect(response.body.items[0].number).to.be.equal('00002820')) { cy.log("Tag 00002820 is successfully registered in the site") }
            else { cy.Tags() }
        })

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

        //Create Access group button check
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
        })

        //Check if the access group is created
        cy.get('a[role="tab"]').contains('Access').click()
        cy.wait(2000)
        if (cy.get('table').find('td').should('contain', installationDetails.accessGroupName)) { cy.log("Access group is created in the installation") }

        //Release now button check
        cy.log("Releasing the installation to the site owner")
        cy.get('body').contains('Release now').should('exist').should('not.be.disabled')
        cy.get('body').contains('Release now').click()
        cy.get('form').within(($form) => {
            cy.get('button#ModalButton').contains('Release').click()
        })
        cy.CheckReleasedSite()

        //Verify if the installation is present in released sites table
        cy.contains('Released').click()
        cy.get('[data-cy=filter-autocomplete]')
            .click()
            .type(installationDetails.siteName)
        cy.wait(2000)
        if (cy.get('[data-cy=installation-row]')
            .should('have.length', 1)) { cy.log("Installation is released to the site owner successfully") }

    })

})
