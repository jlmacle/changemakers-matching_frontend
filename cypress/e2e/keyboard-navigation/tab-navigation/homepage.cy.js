// Installed cypress-plugin-tab
// https://github.com/kuceb/cypress-plugin-tab
// To remove for production code
// 📖 AppSecurity: Limiter les composants logiciels tiers (Limit third-party software components), Anssi: R61

describe('Tab navigation on home page', () => {
  it('passes', () => {
    cy.visit('/www/index.html')

    // Starting at button
    cy.get('#newAccountOrLogin-button').focus()

    // Next is homepage link
    cy.tab()
    // .then(($focusedElement) => {
    //   // Log the focused element for inspection
    //   console.log($focusedElement);
    //   // Example: Log the id attribute of the focused element
    //   console.log('Focused element ID:', $focusedElement.attr('id'));  
    // })   

    // Wrong code for memory
    //cy.focused().its('id').should("equal","homePageTitle-link")
    // ⬆️ issue: cy.its() waited for the specified property id to exist, but it never did.
    
    // Code that succeed: This assertion waits for an element to be focused 
    // and then directly checks its id, providing a clearer error message if it fails.
    cy.focused().should($el => {
      expect($el).to.have.id("homePageTitle-link"); 
    })

    // Next is testimonies
    cy.tab()
    cy.focused().should($el => {
      expect($el).to.have.id("testimonies");
    })

    // Next is about link
    cy.tab()
    cy.focused().should($el => {
      expect($el => {
        expect($el).to.have.id('about-link')
      })
    })

    // Next is privacy link
    cy.tab()
    cy.focused().should( $el => {
      expect($el).to.have.id('privacy-link')
    })



    
  
  })   

})