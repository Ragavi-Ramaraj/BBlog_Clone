///<reference types="cypress" />

describe('Edit article', () => {

    let input

    beforeEach(() => {
        cy.fixture("inputrepo.json").then((inputrepo) => {
            input = inputrepo})
        cy.signin()
        cy.visit('/')
    })

    it('Delete article', () => {
        cy.get('[class="ion-compose"]').click() //Navigate to article creation section
        cy.get('[formcontrolname="title"]').type(input.deleteArticle)//Create article
        cy.contains('button',' Publish Article ').should('be.enabled').click()//Publish
        cy.url().should('include','/article/')

        cy.contains('a', input.userName).click()// Go to author's profile
        cy.get('a[class="preview-link"]').should('be.visible')
        cy.contains('h1', input.deleteArticle).should('exist').click()//Get the article to delete and open the page

        cy.get('[class="btn btn-sm btn-outline-danger"]')
            .should('contain', ' Delete Article ').should('have.length', 2).eq(1).click()//Delete the article

        cy.contains('a', input.userName).click()
        cy.contains('h1', input.deleteArticle).should('not.exist')//Check if the deleted article still exists
    })
})