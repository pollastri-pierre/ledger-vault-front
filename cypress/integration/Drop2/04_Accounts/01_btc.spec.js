import {
  login,
  logout,
  route,
  add_account_name_btc,
  select_creator_group,
  add_whitelist,
  add_approval_step_group,
  successfull_message2,
  success_creation_account,
} from "../../../functions/actions";

describe("Test Case for Account", function() {
  beforeEach(function() {
    login(4);
  });

  afterEach(function() {
    logout();
  });

  it("Create Bitcoin Account Legacy", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    add_account_name_btc("Bitcoin", "Coinhy.pe", "Legacy");
    select_creator_group("APAC");
    add_whitelist(1, "List North ASIA");
    add_approval_step_group(1, "Key accounts Ops");
    cy.contains("Next").click();
    cy.get("[data-test=approve_button]").click();
    success_creation_account();
  });

  it("Create Bitcoin Account Segwit", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    add_account_name_btc("Bitcoin", "UpWit", "Native SegWit");
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

    cy.contains("Coinhy.pe").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    successfull_message2();

    cy.contains("UpWit").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    successfull_message2();
  });
});
