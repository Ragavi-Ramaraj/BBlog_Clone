// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

//import { isPlainObject } from "cypress/types/lodash"


//Get SAP Token
Cypress.Commands.add('save_sap_access_token', () => {
    cy.request({
        method: 'POST',
        url: Cypress.env('TOKENURL'),
        form: true,
        body: {
            "client_id": Cypress.env('SAP_CLIENT_ID'),
            "client_secret": Cypress.env('SAP_CLIENT_SECRET'),
            "grant_type": Cypress.env('SAP_GRANT_TYPE'),
            "scope": Cypress.env('SAP_SCOPE'),
            "username": Cypress.env('SAP_USEREMAIL'),
            "password": Cypress.env('SAP_PASSWORD')
        }
    }).then(response => {
        cy.readFile('cypress/fixtures/datarep.json').then((installationDetails) => {
            installationDetails.sapToken = response.body.access_token
            cy.writeFile('cypress/fixtures/datarep.json', installationDetails)
        })
    })
})

//Get CAP Token
Cypress.Commands.add('save_cap_access_token', () => {
    cy.request({
        method: 'POST',
        url: Cypress.env('TOKENURL'),
        form: true,
        body: {
            "client_id": Cypress.env('CLIENT_ID'),
            "client_secret": Cypress.env('CLIENT_SECRET'),
            "grant_type": Cypress.env('GRANT_TYPE'),
            "scope": Cypress.env('SCOPE'),
            "username": Cypress.env('USEREMAIL'),
            "password": Cypress.env('PASSWORD')
        }
    }).then(response => {
        cy.readFile('cypress/fixtures/datarep.json').then((installationDetails) => {
            installationDetails.capToken = response.body.access_token
            cy.writeFile('cypress/fixtures/datarep.json', installationDetails)
        })
    })
})


//Commissioning Login
Cypress.Commands.add('CommissioningLogin', (USEREMAIL, PASSWORD) => {

    cy.visit('/')
    cy.wait(2000)
    cy.document().then(doc => {
        const titleText = doc.title
        cy.log(titleText)
        if (titleText == 'Commissioning | Login' || titleText == 'Log in to larry') {
            cy.get('#Email').type(Cypress.env('USEREMAIL'))
            cy.get('#Password').type(Cypress.env('PASSWORD'))
            cy.get('[type=submit]').click()
            cy.wait(7000)
            cy.contains('button', 'Accept All Cookies').click()
            cy.log("Commissioning application is logged successfully.")
        } else {
            cy.wait(7000);
            cy.contains('button', 'Accept All Cookies').click();
            cy.log("The user is already logged in.")
        }
    })
})

//Check if IQ is online
Cypress.Commands.add('CheckIqState', () => {

    cy.readFile('cypress/fixtures/datarep.json').then((installationDetails) => {

        //Check IQ state
        cy.request({
            method: 'GET',
            url: Cypress.env('SAP_IQ_URL'),
            auth: {
                bearer: installationDetails.sapToken
            }
        }).then(response => {
            if (response.body.items[0].is_online == true) {
                cy.log("IQ is online, No action is required")
            } else if (response.body.items[0].is_online == false) {
                //Reset IQ
                cy.ResetIq()
            }
        })
    })
})

//Create Installation
Cypress.Commands.add('CreateInstallation', () => {

    cy.readFile('cypress/fixtures/datarep.json').then((installationDetails) => {

        cy.request({
            method: 'POST',
            url: Cypress.env('INSTALLATIONSURL'),
            failOnStatusCode: false,
            auth: {
                bearer: installationDetails.capToken
            },
            body: {
                "customer_reference": 'sitename_' + Date.now(),
                "country_code": Cypress.config('country_code'),
                "time_zone": Cypress.config('time_zone'),
                "email": Cypress.config('siteOwnerEmail'),
                "tenant_id": Cypress.config('tenant_id'),
                "business_type": Cypress.config('business_type')
            }
        }).then(response => {
            cy.readFile('cypress/fixtures/datarep.json').then((installationDetails) => {
                installationDetails.siteId = response.body.id
                cy.writeFile('cypress/fixtures/datarep.json', installationDetails)

                cy.visit('/' + 'installations/' + installationDetails.siteId)
            })
        })
    })
})

//Add IQ
Cypress.Commands.add('AddIQ', () => {

    cy.readFile('cypress/fixtures/datarep.json').then((installationDetails) => {

        cy.request({
            method: 'POST',
            url: Cypress.env('INSTALLATIONSURL') + installationDetails.siteId + '/iqs',
            auth: {
                bearer: installationDetails.capToken
            },
            body: {
                "customer_reference": Cypress.config('IQ_customer_reference'),
                "activation_code": Cypress.config('IQ_activation_code'),
                "time_zone": Cypress.config('time_zone')
            }
        })
    })

})

//Add Lock
Cypress.Commands.add('AddLock', () => {

    cy.readFile('cypress/fixtures/datarep.json').then((installationDetails) => {

        cy.request({
            method: 'POST',
            url: Cypress.env('INSTALLATIONSURL') + installationDetails.siteId + '/locks',
            auth: {
                bearer: installationDetails.capToken
            },
            body: {
                "customer_reference": Cypress.config('Lock_customer_reference'),
                "activation_code": Cypress.config('Lock_activation_code')
            }
        }).then(response => {
            cy.readFile('cypress/fixtures/datarep.json').then((installationDetails) => {
                installationDetails.lockId = response.body.id
                cy.writeFile('cypress/fixtures/datarep.json', installationDetails)
            })
        })
    })
})


//Add Repeater
Cypress.Commands.add('AddRepeater', () => {

    cy.readFile('cypress/fixtures/datarep.json').then((installationDetails) => {

        cy.request({
            method: 'POST',
            url: Cypress.env('INSTALLATIONSURL') + installationDetails.siteId + '/repeaters',
            auth: {
                bearer: installationDetails.capToken
            },
            body: {
                "customer_reference": Cypress.config('Rep_customer_reference'),
                "activation_code": Cypress.config('Rep_activation_code')
            }
        }).then(response => {
            cy.readFile('cypress/fixtures/datarep.json').then((installationDetails) => {
                installationDetails.repId = response.body.id
                cy.writeFile('cypress/fixtures/datarep.json', installationDetails)
            })
        })
    })
})

//Attach Lock to IQ
Cypress.Commands.add('AttachLockToIq', {
    "retries": 2
}, () => {

    cy.readFile('cypress/fixtures/datarep.json').then((installationDetails) => {
        cy.request({
            method: 'PUT',
            url: Cypress.env('INSTALLATIONSURL') + installationDetails.siteId + '/iqs/' + installationDetails.iqId + '/tree',
            retryOnStatusCodeFailure: true,
            auth: {
                bearer: installationDetails.capToken
            },
            body: {
                "iq_tree_items": [{
                    "id": installationDetails.lockId,
                    "parent_id": null,
                    "hardware_type": 'lock'
                }]
            }
        })
        cy.wait(10000)
    })
})

//Detach Lock From IQ
Cypress.Commands.add('DetachLockFromIq', () => {

    cy.readFile('cypress/fixtures/datarep.json').then((installationDetails) => {

        cy.request({
            method: 'PATCH',
            url: Cypress.env('INSTALLATIONSURL') + installationDetails.siteId + '/locks/' + installationDetails.lockId + '/detach',
            auth: {
                bearer: installationDetails.capToken
            },
            body: {
                "force": true
            }
        })
        cy.get('button#GenericModalCloseButton').click()
        cy.wait(20000)
    })
})

//CheckIqinSite
Cypress.Commands.add('CheckIqinSite', () => {

    cy.readFile('cypress/fixtures/datarep.json').then((installationDetails) => {

        cy.request({
            method: 'GET',
            url: Cypress.env('INSTALLATIONSURL') + installationDetails.siteId + '/iqs',
            auth: {
                bearer: installationDetails.capToken
            }
        })
    })
})

//CheckLockinSite
Cypress.Commands.add('CheckLockinSite', () => {

    cy.readFile('cypress/fixtures/datarep.json').then((installationDetails) => {

        cy.request({
            method: 'GET',
            url: Cypress.env('INSTALLATIONSURL') + installationDetails.siteId + '/locks',
            auth: {
                bearer: installationDetails.capToken
            }
        })
    })
})

//CheckRepeaterinSite
Cypress.Commands.add('CheckRepeaterinSite', () => {

    cy.readFile('cypress/fixtures/datarep.json').then((installationDetails) => {

        cy.request({
            method: 'GET',
            url: Cypress.env('INSTALLATIONSURL') + installationDetails.siteId + '/repeaters',
            auth: {
                bearer: installationDetails.capToken
            }
        })
    })
})



//CheckTagsinSite
Cypress.Commands.add('CheckTagsinSite', () => {

    cy.readFile('cypress/fixtures/datarep.json').then((installationDetails) => {

        //Get tag number
        cy.request({
            method: 'GET',
            url: Cypress.env('INSTALLATIONSURL') + installationDetails.siteId + '/tags',
            auth: {
                bearer: installationDetails.capToken
            }
        }).then((response) => {
            if (JSON.stringify(response.body.items.length) == '0') {
                cy.Tags()
            }
            else {
                cy.log("Tag 00002820 is successfully registered in the site")
            }
        })
    })
})

//Delete lock from site
Cypress.Commands.add('DeleteLock', () => {

    cy.readFile('cypress/fixtures/datarep.json').then((installationDetails) => {

        //Delete Lock
        cy.request({
            method: 'DELETE',
            url: Cypress.env('INSTALLATIONSURL') + installationDetails.siteId + '/locks',
            auth: {
                bearer: installationDetails.capToken
            },
            body: {
                "lock_ids": [installationDetails.lockId]
            }
        })
    })
})

//Delete repeater from site
Cypress.Commands.add('DeleteRepeater', () => {

    cy.readFile('cypress/fixtures/datarep.json').then((installationDetails) => {

        //Delete Repeater
        cy.request({
            method: 'DELETE',
            url: Cypress.env('INSTALLATIONSURL') + installationDetails.siteId + '/repeaters',
            auth: {
                bearer: installationDetails.capToken
            },
            body: {
                "repeater_ids": [installationDetails.repId]
            }
        })
    })
})

//Decouple the IQ and Release the site
Cypress.Commands.add('DecoupleIqReleaseSite', () => {

    cy.readFile('cypress/fixtures/datarep.json').then((installationDetails) => {

        //Decouple IQ from site
        cy.request({
            method: 'DELETE',
            url: Cypress.env('INSTALLATIONSURL') + installationDetails.siteId + '/iqs/' + installationDetails.iqId,
            auth: {
                bearer: installationDetails.capToken
            }
        })

        //Release site
        cy.request({
            method: 'PUT',
            url: Cypress.env('INSTALLATIONSURL') + installationDetails.siteId + "/release",
            auth: {
                bearer: installationDetails.capToken
            }
        })
    })
})

//Check released site
Cypress.Commands.add('CheckReleasedSite', () => {

    cy.readFile('cypress/fixtures/datarep.json').then((installationDetails) => {

        //Get installations
        cy.request({
            method: 'GET',
            url: Cypress.env('INSTALLATIONSURL') + '?$filter=id eq ' + installationDetails.siteId,
            auth: {
                bearer: installationDetails.capToken
            }
        }).then(response => {
            cy.readFile('cypress/fixtures/datarep.json').then((installationDetails) => {
                installationDetails.siteName = response.body.items[0].site_customer_reference
                cy.log(installationDetails.siteId)
                cy.log(installationDetails.siteName)
                cy.writeFile('cypress/fixtures/datarep.json', installationDetails)
            })
        })
    })
})

//Invite new installer to the company
Cypress.Commands.add('CreateInstaller', () => {

    cy.readFile('cypress/fixtures/datarep.json').then((installationDetails) => {

        cy.request({
            method: 'POST',
            url: Cypress.env('COMPANYSTAFF_URL'),
            auth: {
                bearer: installationDetails.capToken
            },
            body: {
                "role_id": Cypress.config('installer_role_id'),
                "email": 'ragavi_newinstaller' + Date.now() + '@my-clay.com',
            }
        })
    })
})

//Sorting installations
Cypress.Commands.add('SortInstallations', (key) => {
    cy.readFile('cypress/fixtures/datarep.json').then((installationDetails) => {
        cy.get('[data-cy=installation-row]').then(function ($elem) {
            installationDetails[key] = $elem.text()
            cy.writeFile('cypress/fixtures/datarep.json', installationDetails)
        })
    })
})

//Get installer company details
Cypress.Commands.add('InstallerCompanyInfo', () => {
    cy.readFile('cypress/fixtures/datarep.json').then((installationDetails) => {
        cy.request({
            method: 'GET',
            url: Cypress.env('INSTALLERCOMPANY_URL') + Cypress.config('installer_company_id'),
            auth: {
                bearer: installationDetails.capToken
            }
        }).then(response => {
            cy.writeFile(`cypress/fixtures/installercompanyinfo.json`, response.body)
        })
    })
})
