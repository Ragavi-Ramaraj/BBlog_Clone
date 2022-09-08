///<reference types="cypress" />

describe('Create article', () => {

    let input

    beforeEach(() => {
        cy.fixture("inputrepo.json").then((inputrepo) => {
            input = inputrepo})
        cy.signin()
        cy.visit('/')
    })

    it('Create Article', () => {
        cy.contains('a', ' Your Feed ').should('exist') //Verify landing page
        cy.get('[class="ion-compose"]').click() //Navigate to article creation section
        cy.url().should('include', '/editor')

        cy.get('[formcontrolname="title"]').type(input.articleTitle)//Write article
        cy.get('[formcontrolname="description"]').type(input.articleDescription)
        cy.get('[formcontrolname="body"]').type(input.articleBody1)
        cy.get('[placeholder="Enter tags"]').type(input.articleTags)
        cy.contains('button', ' Publish Article ').should('be.enabled').click()//Publish article

        cy.url().should('include', '/article/' + input.articleTitle) //Verify if the article is published
        cy.get('h1').should('contain', input.articleTitle)
        cy.get('p').should('contain', input.articleBody1)
    })

    it('Publish empty article', () => {
        cy.get('[class="ion-compose"]').click()
        cy.contains('button', ' Publish Article ').should('be.enabled').click().wait(1000)//Publish article leaving title and description blank
        //Assuming those fields are mandatory, blank article should not be published.
        cy.url().should('not.include','/article/')
    })

    it('Article content limit validation', () => {
        cy.get('[class="ion-compose"]').click()
        cy.get('[formcontrolname="body"]').invoke('val', input.bigArticle) //Publish is not allowed if the article body size is more than 102kB
        cy.contains('button', ' Publish Article ').should('be.enabled').click()
        cy.url().should('not.include', '/article/' + input.articleTitle)
    })

})