import {
  login,
  logout,
  route,
  add_whitelist,
  add_amount_range,
  success_edit_account,
} from "../../../functions/actions";

describe("Test Case for Account", function () {
  beforeEach(function () {
    login(6);
  });

  afterEach(function () {
    logout();
  });

  it("Edit Select creator", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    // EDIT ACCOUNT NAME: ATM Test
    cy.get("[data-test=name]").eq(3).click();
    cy.get("[data-test=account_details]").click();
    cy.get("[data-test=edit-button]").click();
    cy.get("[data-type=close-bubbles]").eq(0).click();
    cy.get("#input_groups_users")
      .clear()
      .type("South Africa", { force: true })
      .type("{enter}");
    cy.get("[data-test=select-arrow]").click();
    cy.get("[data-test=approve_button]").click();
    add_whitelist(1, "List of 100");
    cy.contains("Next").click();
    cy.get("[data-test=approve_button]").click();
    success_edit_account();
  });

  it("Edit Amount range", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    // EDIT ACCOUNT NAME: Syscoin2
    cy.get("[data-test=name]").eq(10).click();
    cy.get("[data-test=account_details]").click();
    cy.get("[data-test=edit-button]").click();
    add_amount_range("20", "140");
    add_whitelist(0, "List of 100");
    cy.contains("Next").click();
    cy.get("[data-test=approve_button]").click();
    success_edit_account();
  });
});
