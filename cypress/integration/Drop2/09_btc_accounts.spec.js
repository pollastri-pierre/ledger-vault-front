import {
  login,
  logout,
  route,
  create_account,
  successfull_message,
} from "../../functions/actions";

describe("Test Case for Account", function() {
  beforeEach(function() {
    login(4);
  });

  afterEach(function() {
    logout();
  });

  it("Create Bitcoin Account", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    create_account("Bitcoin", "Coinhy.pe1", "APAC", "New EMEA");
    successfull_message();
  });

  it("Approve Btc Account", () => {
    cy.server();
    route();
    login(6);
    cy.url().should("include", "/admin/dashboard");
    cy.contains("Awaiting approval").click();
    cy.get("[data-test=approve_button]").click();
    cy.wait(6000);
    successfull_message();
    cy.wait(2000);
  });

  it("Create Bitcoin Testnet Account", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    create_account("Bitcoin Testnet", "Amanda Wong1", "APAC", "New EMEA");
    successfull_message();
  });

  it("Approve Btc Testnet Account", () => {
    cy.server();
    route();
    login(6);
    cy.url().should("include", "/admin/dashboard");
    cy.contains("Awaiting approval").click();
    cy.get("[data-test=approve_button]").click();
    cy.wait(6000);
    successfull_message();
    cy.wait(2000);
  });
});
