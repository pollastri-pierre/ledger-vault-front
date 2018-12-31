import {login,logout,route,switch_device,create_account,approve_account } from '../../functions/actions.js';

describe("Tests Dashboard", function() {

  beforeEach(function () {
    login(4);
  });

  afterEach(function () {
    logout();
  });

  it("Dashboard Test cases", () => {
    cy.server();
    route();

    cy.contains("dashboard").click();
    cy.contains("Total Balance").should('be.visible');
    cy.contains("Last operations").should('be.visible');
    cy.contains("currencies").should('be.visible');
    cy.contains("pending").should('be.visible');

  });
});
