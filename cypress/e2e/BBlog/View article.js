///<reference types="cypress" />

describe('View article', () => {

    let input

    beforeEach(() => {
        cy.fixture("inputrepo.json").then((inputrepo) => {
            input = inputrepo})
        cy.signin()
        cy.visit('/')
    })

     it('Verify links,texts and button of all articles from global feed', () => {
         cy.contains(' Global Feed ').should('be.visible').should('exist').click().wait(2000)
         cy.get('[class="article-preview"]').should('exist').should('have.length',10)//Verify the articles count inside global feed page
         cy.get('[class="author"]').should('exist')//Check the author name
         cy.get('[class="date"]').should('exist')//Check the article date
         cy.get('a[class="preview-link"]').should('exist')//Check the title and description
         cy.get('[class="btn btn-sm btn-outline-primary"]').should('exist')//Check the favorite article button
     })

     it('View specific article from global feed', () => {
        cy.contains(' Global Feed ').click().should('exist')

        cy.get('[class="author"]').eq(2).click()//Click a specific author
        cy.url().should('include','/profile/')//Verify the author profile page
        cy.get('ul>li').should('contain',' My Posts ')
        cy.get('ul>li').should('contain',' Favorited Posts ')

        cy.get('a[class="preview-link"]').eq(1).click()//click a specific article
        cy.get('a[class="author"]').invoke('text').should('have.length.gt',0)//verify author name
        cy.url().should('include','/article/')//Verify the author's article page
        //cy.get('[class="container"]').find('h1').invoke('text').should('have.length.gt',0) //Since empty article is allowed since assertion would fail
        //cy.get('[class="row article-content"]').invoke('text').should('have.length.gt',0) //Since empty article is allowed since assertion would fail
     })

     it('View article by tag', () => {
        cy.contains(' Global Feed ').click()
        cy.get('[class="tag-list"]').should('be.visible')//Verify the tag list
        cy.contains('[class="tag-default tag-pill"]',input.articleTag).should('be.visible').click()//Click a specific tag

        cy.get('[class="article-preview"]').should('exist')//Check the articles for the tag
        cy.get('a[class="nav-link active"]').should('contain',input.articleTag).should('be.visible')//Check the tag name
        cy.get('[class="tag-default tag-pill tag-outline"]').should('contain',input.articleTag)

        cy.get('a[class="preview-link"]').click()//View a specific article
        cy.get('[class="container"]').find('h1').should('contain',input.tagArticleTitle)//Verify article title
        cy.get('[class="row article-content"]').should('contain',input.tagArticleBody)//Verify article description
     })
    })