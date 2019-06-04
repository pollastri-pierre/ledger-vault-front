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
    create_account("Bitcoin", "HeyBtcACC ", "APAC 1", "New EMEA");
    successfull_message();
  });

  it("Create Bitcoin Testnet Account", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    create_account(
      "Bitcoin Testnet",
      "HeytestBTC ",
      "South Africa",
      "New EMEA",
    );
    successfull_message();
  });

  it("Create Ethereum Account", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    create_account("Ethereum", "MyETH2", "New EMEA", "South Africa");
    successfull_message();
  });

  it("Create ERC20 Token Account", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    create_erc20_account(
      "USDC",
      "MyErc2002",
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
    create_account("Bitcoin", "HeyBitcoin444", "New EMEA", "APAC 1");
    error_message("Account name already exists in this currency", "Error 236");
  });

  it("approve account", () => {
    cy.server();
    route();
    login(6);
    cy.url().should("include", "/admin/dashboard");
    cy.contains("Create account").click();
    cy.get("[data-test=approve_button]").click();
  });
});
