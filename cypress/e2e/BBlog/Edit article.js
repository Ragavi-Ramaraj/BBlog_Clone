///<reference types="cypress" />

describe('Edit article', () => {

    let input

    beforeEach(() => {
        cy.fixture("inputrepo.json").then((inputrepo) => {
            input = inputrepo})
        cy.signin()
        cy.visit('/')
    })

    it('Edit the Article of authorised user from profile page', () => {
        cy.contains('a', input.userName).click()// Go to author's profile
        cy.url().should('include', '/profile/' + input.userName)
        cy.get('[class="article-preview"]').should('exist').should('have.length', 10)//Verify the articles count inside my posts section
        cy.contains('h1', input.editArticle).should('exist').click()

        cy.url().should('include', input.editArticle)
        cy.url().should('contain', '/article/')
        cy.get('[class="btn btn-sm btn-outline-secondary"]')
            .should('contain', ' Edit Article ').should('have.length', 2).eq(1).click()//Check the edit buttons

        cy.get('[formcontrolname="body"]').invoke('val', input.articleBody2)//Edit the article body
        cy.get('[placeholder="Enter tags"]').invoke('val', input.articleTags)//Add tags
        cy.contains('button', ' Publish Article ').should('be.enabled').click()//Publish article

        cy.get('p').should('include.text', input.articleBody1)//Verify the updated article
    })

    it('Edit article button validation for different author in global feed page', () => {
        cy.contains(' Global Feed ').click().should('exist')
        cy.contains('[class="tag-default tag-pill"]', input.articleTag).click()//Open article of a different author
        cy.contains('[class="btn btn-sm btn-outline-secondary"]', ' Edit Article ').should('not.exist')//Verify if the edit button is not present
    })
})