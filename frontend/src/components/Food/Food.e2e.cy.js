import { food } from "../../../cypress/constants";

describe('Food component', () => {
    it('Food rendered on the page', () => {
        cy.visit('/');
        cy.get(food).should('exist').and('have.ccs', 'top', '20%').and('have.ccs', 'left', '10%');
    });
});
