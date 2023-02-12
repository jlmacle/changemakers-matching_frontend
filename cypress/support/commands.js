/// <reference types="cypress" />

Cypress.Commands.add('getByCyData', (value) =>
    {
        return cy.get(`[cy-data=${value}]`);
    }
)
