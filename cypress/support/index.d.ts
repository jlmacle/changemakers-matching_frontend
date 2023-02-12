/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable<Subject> {      
      getByCyData(value: string): Chainable<any>
    }
  }