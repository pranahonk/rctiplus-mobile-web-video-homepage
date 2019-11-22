describe('Sign In Page', () => {
    beforeEach(() => {
        cy.log('Visiting http://localhost:3000/signin');
        cy.visit('/signin');
    });

    it('should have a heading', () => {
        cy.get('.login-box > h3').should('have.length', 1);
        cy.get('#password-feedback').should('not.be.visible');
    });

    it('should display \'Password is incorrect\'', () => {
        cy.get('#email').type('user.test@rctiplus.com');
        cy.get('#password').type('123456');
        cy.get('#login-button').click();
        cy.get('#password-feedback').should('be.visible');
        cy.get('#password-feedback').contains('Password is incorrect');
    });

    it('should authenticated', () => {
        cy.get('#email').type('user.test@rctiplus.com');
        cy.get('#password').type('user.123');
        cy.get('#login-button').click();
    });
});