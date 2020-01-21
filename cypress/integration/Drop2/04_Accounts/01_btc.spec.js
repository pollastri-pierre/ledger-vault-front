import {
  login,
  logout,
  route,
  add_account_name,
  select_creator_group,
  add_amount_range,
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

  it("Create Bitcoin Account", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    add_account_name("Bitcoin", "Coinhy.pe");
    select_creator_group("APAC");
    add_amount_range("0.0000001", "1");
    add_whitelist(0, "List North ASIA");
    add_approval_step_group(0, "Key accounts Ops");
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
    cy.contains("Awaiting approval").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    successfull_message2();
  });
});
