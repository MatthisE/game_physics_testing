describe('game screen test', () => {
  it('buttons change text correctly', () => {
    cy.visit('index.html')

    cy.get('#info').should('have.text', 'Versuche: 0 davon 0 erfolgreich');
    cy.get('#resetButton').click({force: true});
    cy.get('#info').should('have.text', 'Versuche: 1 davon 0 erfolgreich');
    cy.get('#resetButton').click({force: true});
    cy.get('#info').should('have.text', 'Versuche: 2 davon 0 erfolgreich');
    cy.get('#newButton').click({force: true});
    cy.get('#info').should('have.text', 'Versuche: 0 davon 0 erfolgreich');
  })
})