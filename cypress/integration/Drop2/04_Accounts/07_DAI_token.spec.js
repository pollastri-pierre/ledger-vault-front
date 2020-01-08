import {
  login,
  logout,
  route,
  select_creator_group,
  successfull_message2,
  success_creation_account,
  add_approval_step_operators,
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

    cy.get("[data-test=add-button]").click();
    cy.wait(6500);
    cy.get("#input_crypto")
      .type("DAI", { force: true })
      .type("{enter}");
    cy.get("[data-test=select-arrow]")
      .eq(1)
      .click();
    cy.get("#react-select-3-option-1").type("Syscoin7");
    cy.contains("Next").click();
    cy.get("[data-test=account_childname]").type("Chain2B");
    cy.contains("Next").click();

    // Rule 1
    select_creator_group("America Ops");
    add_approval_step_operators(
      2,
      "James Lepic",
      "Anna Wagner",
      "Aidan Fisher",
    );

    cy.contains("Next").click();
    cy.get("[data-test=approve_button]").click();
    success_creation_account();
  });

  it("Approve DAI token Account", () => {
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

  it("Create the same erc20 account on the same eth account should fail", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    cy.get("[data-test=add-button]").click();
    cy.wait(4500);
    cy.get("#input_crypto")
      .type("DAI", { force: true })
      .type("{enter}");
    cy.contains("Next").click();
    cy.get("[data-test=account_childname]").type("Chain2B");
    cy.contains("Next").click();
    select_creator_group("APAC");
    cy.contains("Next").click();
    cy.get("[data-test=approve_button]").click();
    error_message("Error 236", "Account name already exists in this currency");
  });
});
