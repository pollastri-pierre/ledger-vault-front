import { login, logout, route } from "../../../functions/actions";

describe("Test on Operator ", function() {
  beforeEach(function() {
    login(11);
  });

  afterEach(function() {
    logout();
  });

  it("Login as operator", () => {
    cy.server();
    route();
    cy.url().should("include", "/operator/dashboard");
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/operator/accounts");
    cy.contains("Coinhy.pe1").click();
    cy.contains("Balance").should("be.visible");
    cy.contains("Crypto asset / Index").should("be.visible");
    cy.contains("Unit").should("be.visible");
    cy.contains("creation date").should("be.visible");
    cy.wait(5500);
    cy.contains("Last transactions").should("be.visible");
    cy.contains("Wed 15 May").click();
    cy.contains("View in explorer").click();
    cy.get("[data-test=close]").click();

    cy.get("[data-test=menuItem-transactions]").click();
    cy.url().should("include", "/operator/transactions");
  });
});
