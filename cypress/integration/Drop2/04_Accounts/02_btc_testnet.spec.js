import {
  login,
  logout,
  route,
  add_account_name,
  select_creator_group,
  select_creator_operators,
  add_whitelist,
  add_approval_step_group,
  successfull_message2,
  no_limit,
  success_creation_account,
  error_message,
} from "../../../functions/actions";

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
    add_account_name("Bitcoin Testnet", "Amanda Wong");
    // Rule 1
    select_creator_group("America Ops");
    no_limit();
    add_approval_step_group(1, "Key accounts Ops");

    // 2 Rules
    cy.get("[data-test=add-rule]").click();
    select_creator_operators("Thomas Lebron", "Sally Wilson", "Laura Parker");
    add_whitelist(1, "List testnet");

    cy.contains("Next").click();
    cy.get("[data-test=approve_button]").click();
    success_creation_account();
  });

  it("Approve Btc Testnet Account", () => {
    cy.server();
    route();
    logout();
    login(6);
    cy.url().should("include", "/admin/dashboard");
    cy.contains("Awaiting approval").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    cy.wait(2500);
    successfull_message2();
  });

  it("Create Bitcoin Account with the same name should fail", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    add_account_name("Bitcoin", "Coinhy.pe");
    select_creator_group("APAC");

    cy.contains("Next").click();
    cy.get("[data-test=approve_button]").click();
    error_message("Error 236", "Account name already exists in this currency");
  });
});
