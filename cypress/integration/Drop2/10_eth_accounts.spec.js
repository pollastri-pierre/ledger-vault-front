import {
  login,
  logout,
  route,
  create_account,
  successfull_message,
  error_message,
  create_erc20_account,
} from "../../functions/actions";

describe("Test Case for Account", function() {
  beforeEach(function() {
    login(4);
  });

  afterEach(function() {
    logout();
  });

  it("Create Ethereum Account", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    create_account("Ethereum", "Syscoin", "New EMEA", "South Africa");
    successfull_message();
  });

  it("Approve Eth Account", () => {
    cy.server();
    route();
    login(6);
    cy.url().should("include", "/admin/dashboard");
    cy.contains("Awaiting approval").click();
    cy.get("[data-test=approve_button]").click();
    cy.wait(5500);
    successfull_message();
    cy.wait(2000);
  });

  it("Create ERC20 Token Account", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    create_erc20_account(
      "USDC",
      "Block.Chain",
      "ETH2",
      "South Africa",
      "New EMEA",
    );
    successfull_message();
  });

  it("Create a account with the same name should fail", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    create_account("Bitcoin", "Coinhy.pe", "New EMEA", "APAC");
    error_message("Account name already exists in this currency", "Error 236");
  });

  it("Approve ERC20 Account", () => {
    cy.server();
    route();
    login(6);
    cy.url().should("include", "/admin/dashboard");
    cy.contains("Awaiting approval").click();
    cy.get("[data-test=approve_button]").click();
    cy.wait(5500);
    successfull_message();
  });
});
