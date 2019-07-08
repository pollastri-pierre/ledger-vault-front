import {
  login,
  logout,
  route,
  create_account,
  successfull_message,
  error_message,
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
    create_account("Bitcoin", "Coinhy.pe", "APAC", "New EMEA");
    successfull_message();
  });

  it("Approve Btc Account", () => {
    cy.server();
    route();
    logout();
    login(6);
    cy.url().should("include", "/admin/dashboard");
    cy.contains("Awaiting approval").click();
    cy.get("[data-test=approve_button]").click();
    cy.wait(7500);
    successfull_message();
    cy.wait(2000);
  });

  it("Create Bitcoin Testnet Account", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    create_account(
      "Bitcoin Testnet",
      "Amanda Wong",
      "America Ops",
      "Key accounts Ops",
    );
    successfull_message();
  });

  it("Approve Btc Testnet Account", () => {
    cy.server();
    route();
    logout();
    login(6);
    cy.url().should("include", "/admin/dashboard");
    cy.contains("Awaiting approval").click();
    cy.wait(1500);
    cy.get("[data-test=approve_button]").click();
    cy.wait(7500);
    successfull_message();
    cy.wait(2000);
  });

  it("Create a account with the same name should fail", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    create_account("Bitcoin", "Coinhy.pe", "New EMEA", "APAC");
    error_message("Error 236", "Account name already exists in this currency");
  });
});
