import {login,logout,route,switch_device,create_account,approve_account } from '../../functions/actions.js';

describe("Negatif Test Case", function() {

  beforeEach(function () {
  });

  afterEach(function () {
  });

  it("Login with a wrong workspace name", () => {
    cy.server();
    route();
    cy.visit(Cypress.env('api_server'));
    cy.clearCookies();
    switch_device(4);
    cy.get("input").type("fakeorga", { delay: 40 });
    cy.contains("Continue").click();
    cy
      .get(".top-message-body")
      .contains("Unknown organization domain name")
      .get(".top-message-title")
      .contains("Error");
  });

  it("Login with a wrong device WPK", () => {
    cy.server();
    route();
    cy.visit(Cypress.env('api_server'));
    cy.clearCookies();
    switch_device(2);
    cy.get("input").clear();
    cy.get("input").type(Cypress.env("workspace"));
    cy.contains("Continue").click();
    cy
      .get(".top-message-body")
      .contains("network error")
      .get(".top-message-title")
      .contains("Failed to authenticate");
    cy.contains("cancel").click();
  });

  it("Create a account with a wrong device", () => {
    cy.server();
    route();
    login(4);
    switch_device(3);
    cy.get(".test-new-account").click();
    cy.get(".wrapper").contains("Bitcoin Testnet").click();
    cy.get("input").type("BTC Testnet test");
    cy.contains("Continue").click();
    cy.contains("Members").click();
    cy
      .get(".test-member-row")
      .eq(0)
      .click({ force: true });
    cy
      .get(".test-member-row")
      .eq(1)
      .click({ force: true });
    cy.contains("Done").click();
    cy.contains("Approvals").click();
    cy.get("input").type(1);
    cy.contains("done").click();
    cy.contains("Continue").click();
    cy.contains("done").click();
    cy
      .get(".top-message-body")
      .contains("Person does not exist")
      .get(".top-message-title")
      .contains("Error 701");
  });

});
