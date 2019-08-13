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
    cy.wait(2500);
    cy.contains("Coinhy.pe").click();
    cy.contains("Balance").should("be.visible");
    cy.contains("Bitcoin").should("be.visible");
    cy.contains("Status").should("be.visible");
    cy.contains("Permission").should("be.visible");
    cy.contains("Last transactions").should("be.visible");
    cy.contains("Transaction rules").should("be.visible");
    cy.get("[data-test=menuItem-transactions]").click();
    cy.url().should("include", "/operator/transactions");
  });
});
