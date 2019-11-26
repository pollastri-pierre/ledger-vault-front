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
    login(6);
  });

  afterEach(function() {
    logout();
  });

  it("Create XRP Account", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    add_account_name("XRP", "XRPCoinhome");
    select_creator_group("Key accounts Ops");
    add_approval_step_group(2, "America Ops");
    cy.contains("Next").click();
    cy.get("[data-test=approve_button]").click();
    success_creation_account();

    add_account_name("XRP", "BitStw");
    select_creator_group("APAC");
    add_approval_step_group(2, "America Ops");
    cy.contains("Next").click();
    cy.get("[data-test=approve_button]").click();
    success_creation_account();
  });

  it("Approve XRP Account", () => {
    cy.server();
    route();
    logout();
    login(4);
    cy.url().should("include", "/admin/dashboard");
    cy.get("[data-test=1]").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    cy.wait(2500);
    successfull_message2();
    cy.get("[data-test=0]").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    cy.wait(2500);
    successfull_message2();
  });
});
