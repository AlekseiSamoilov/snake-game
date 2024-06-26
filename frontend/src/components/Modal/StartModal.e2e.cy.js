
import { food, nameInput, palyerName, startBtn, startModal, url } from "../../../cypress/constants";


describe('Start Modal', () => {
    it('Start modal rendered on the page', () => {
        cy.visit(url);
        cy.get(startModal).should('exist');
    });
    it('Enter name display correctly and game starts after press start btn', () => {
        cy.visit(url);
        cy.get(startModal);
        cy.get(nameInput).type('Player 1');
        cy.get(startBtn).click();
        cy.get(food).should('exist');
        cy.get(palyerName).should('contain', 'Player 1');
    })
});
