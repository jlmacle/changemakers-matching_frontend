describe('Back-end-data-loaded.cy.ts', () => {
  it('Back-end-data-loaded', () => {
    cy.visit('http://localhost:4200').contains('test project')
    // cy.mount()
  })
})