describe('Ally-test_cypress-axe.cy.ts', () => {
  it('Ally test with cypress-axe', () => {
    cy.visit('http://localhost:4200'); 
    cy.injectAxe();
    cy.checkA11y();   
  })
})