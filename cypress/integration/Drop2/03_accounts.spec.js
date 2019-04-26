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

  it("Create Bitcoin Account", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    create_account("Bitcoin", "HeyBitcoin", "APAC", "James Lepic");
    successfull_message();
  });

  it("Create Ethereum Account", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    create_account("Ethereum", "MyETH", "EMEA", "Thomas");
    successfull_message();
  });

  it("Create ERC20 Token Account", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    create_erc20_account("USDC", "MyErc20", "ETH2", "South Africa", "Anna");
    successfull_message();
  });

  it("Create a account with the same name should fail", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    create_account("Bitcoin", "HeyBitcoin", "EMEA", "James Lepic");
    error_message("Account name already exists in this currency", "Error 236");
  });

  it("approve account", () => {
    cy.server();
    route();
    cy.url().should("include", "/admin/dashboard");
    cy.contains("Create Account").click();
    cy.get("[data-test=dialog-button]")
      .eq(1)
      .click();
  });
});
