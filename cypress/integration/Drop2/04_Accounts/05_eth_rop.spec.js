import {
  login,
  logout,
  route,
  add_account_name,
  select_creator_group,
  add_amount_range,
  add_whitelist,
  add_approval_step_operators,
  success_creation_account,
  successfull_message2,
} from "../../../functions/actions";

describe("Test Case for Account", function () {
  beforeEach(function () {
    login(4);
  });

  afterEach(function () {
    logout();
  });

  it("Create Ethereum Ropsten Account", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    add_account_name("Ethereum Ropsten", "WPNakamoto");
    //  cy.contains("Next").click();

    // Rule 1
    select_creator_group("Key accounts Ops");

    // Rule 2
    cy.get("[data-test=add-rule]").click();
    select_creator_group("APAC");
    add_amount_range(0, "0.001", "1");
    add_whitelist(0, "List testnet");
    add_approval_step_operators(
      0,
      "Claudia Schmitt",
      "Charles Burnell",
      "Sally Wilson",
    );

    // Rule 3
    cy.get("[data-test=add-rule]").click();
    select_creator_group("America Ops");

    // Rule 4
    cy.get("[data-test=add-rule]").click();
    select_creator_group("South Africa");
    add_whitelist(1, "List testnet");

    cy.contains("Next").click();
    cy.get("[data-test=approve_button]").click();

    success_creation_account();
  });

  it("Approve Eth Ropsten Account", () => {
    cy.server();
    route();
    logout();
    login(6);
    cy.url().should("include", "/admin/dashboard");
    cy.contains("Awaiting approval").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    cy.wait(3500);
    successfull_message2();
  });
});
