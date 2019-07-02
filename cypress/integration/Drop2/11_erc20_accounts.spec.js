import {
  login,
  logout,
  route,
  successfull_message,
  create_erc20_account,
  create_erc20_account_new_eth,
  create_erc20_with_viewonly_eth_account,
  error_message,
} from "../../functions/actions";

describe("Test Case for Account", function() {
  beforeEach(function() {
    login(4);
  });

  afterEach(function() {
    logout();
  });

  it("Create USDC Token Account and Eth parent account", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    create_erc20_account(
      "USDC",
      "Block.Chain 33",
      "Syscoin",
      "South Africa",
      "EMEA",
    );
    successfull_message();
  });

  it("Approve USDC token Account", () => {
    cy.server();
    route();
    logout();
    login(6);
    cy.url().should("include", "/admin/dashboard");
    cy.contains("Awaiting approval").click();
    cy.get("[data-test=approve_button]").click();
    successfull_message();
    cy.wait(2000);
  });

  it("Create DAI Token Account", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    create_erc20_account_new_eth("DAI", "Chain2B", "America Ops", "James");
    successfull_message();
  });

  it("Approve DAI token Account", () => {
    cy.server();
    route();
    logout();
    login(6);
    cy.url().should("include", "/admin/dashboard");
    cy.contains("Awaiting approval").click();
    cy.get("[data-test=approve_button]").click();
    successfull_message();
    cy.wait(2000);
  });

  it("Create the same erc20 account on the same eth account should fail", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    create_erc20_account_new_eth("DAI", "Chain2B", "America Ops", "James");
    error_message(
      "Error 239",
      "You can not have 2 child accounts of the same crypto",
    );
  });

  it("Create ATM Token Account", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    create_erc20_with_viewonly_eth_account(
      "ATM",
      "Chain2B",
      "Limecoin",
      "APAC",
      "Claudia",
    );
    successfull_message();
  });

  it("Approve DAI token Account", () => {
    cy.server();
    route();
    logout();
    login(6);
    cy.url().should("include", "/admin/dashboard");
    cy.contains("Awaiting approval").click();
    cy.get("[data-test=approve_button]").click();
    successfull_message();
    cy.wait(2000);
  });
});
