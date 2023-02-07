//https://docs.cypress.io/guides/guides/cross-origin-testing

describe('Avalability of a page not found message.cy', ()=> {
    it('Avalability of a page not found message', () => {
        cy.visit('http://localhost:4200/page-that-doesn-t-exist');
        cy.get('[cy-data="dead-link"]').click();
        cy.origin('http://127.0.0.1:8081/', () => {            
            cy.contains('Whitelabel Error Page');
        });
    })        

})