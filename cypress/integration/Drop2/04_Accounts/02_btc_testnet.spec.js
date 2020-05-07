import {
  login,
  logout,
  route,
  add_account_name_btc,
  select_creator_group,
  select_creator_operators,
  add_whitelist,
  add_approval_step_group,
  successfull_message2,
  no_limit,
  success_creation_account,
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
    add_account_name_btc("Bitcoin Testnet", "Amanda Wong", "Legacy");
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

  it("Create Bitcoin Account Segwit", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    add_account_name_btc("Bitcoin Testnet", "CrytoSegwit", "Native SegWit");
    select_creator_group("Key accounts Ops");
    add_approval_step_group(2, "America Ops");
    cy.contains("Next").click();
    cy.get("[data-test=approve_button]").click();
    success_creation_account();
  });

  it("Approve Btc Account", () => {
    cy.server();
    route();
    logout();
    login(6);
    cy.url().should("include", "/admin/dashboard");

    cy.contains("CrytoSegwit").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    successfull_message2();

    cy.contains("Amanda Wong").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    successfull_message2();
  });
});
