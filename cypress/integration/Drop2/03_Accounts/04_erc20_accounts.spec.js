import {
  login,
  logout,
  route,
  successfull_message2,
  create_erc20_account_new_eth,
  success_creation_account,
  create_erc20_with_viewonly_eth_account,
  error_message,
} from "../../../functions/actions";

describe("Test Case for Account", function() {
  beforeEach(function() {
    login(4);
  });

  afterEach(function() {
    logout();
  });

  it("Create DAI Token Account", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    create_erc20_account_new_eth("DAI", "Chain2B", "America Ops", "James");
    success_creation_account();
  });

  it("Approve DAI token Account", () => {
    cy.server();
    route();
    logout();
    login(6);
    cy.url().should("include", "/admin/dashboard");
    cy.contains("Awaiting approval").click();
    cy.get("[data-test=approve_button]").click();
    cy.wait(2500);
    successfull_message2();
  });

  it("Create the same erc20 account on the same eth account should fail", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    create_erc20_account_new_eth("DAI", "Chain2B", "America Ops", "James");
    error_message("Error 236", "Account name already exists in this currency");
  });

  it("Create ATM Token Account", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    create_erc20_with_viewonly_eth_account(
      "ATM",
      "ATM Test",
      "Limecoin",
      "APAC",
      "Claudia",
    );
    success_creation_account();
  });

  it("Approve ATM token Account", () => {
    cy.server();
    route();
    logout();
    login(6);
    cy.url().should("include", "/admin/dashboard");
    cy.contains("Awaiting approval").click();
    cy.get("[data-test=approve_button]").click();
    cy.wait(2500);
    successfull_message2();
  });
});
