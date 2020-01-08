import {
  login,
  logout,
  route,
  add_account_name,
  select_creator_group,
  add_approval_step_group,
  success_creation_account,
  successfull_message2,
} from "../../../functions/actions";

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
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    add_account_name("Ethereum", "Syscoin2");
    select_creator_group("Key accounts Ops");
    add_approval_step_group(2, "America Ops");

    cy.contains("Next").click();
    cy.get("[data-test=approve_button]").click();

    success_creation_account();
  });

  it("Approve Eth Account", () => {
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
});
