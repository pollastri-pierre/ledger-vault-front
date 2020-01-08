import {
  login,
  logout,
  route,
  select_creator_group,
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

  it("Create USDC Token Account and Eth parent account", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    cy.get("[data-test=add-button]").click();
    cy.wait(4500);
    cy.get("#input_crypto")
      .type("USDC", { force: true })
      .type("{enter}");
    cy.contains("Next").click();
    cy.get("[data-test=account_childname]").type("Block.Chain");
    cy.get("[data-test=account_parentname]").type("CryptoC");
    cy.contains("Next").click();

    select_creator_group("South Africa");
    add_approval_step_group(2, "New EMEA");

    cy.contains("Next").click();
    cy.get("[data-test=approve_button]").click();
    success_creation_account();
  });

  it("Approve USDC token Account", () => {
    cy.server();
    route();
    logout();
    login(6);
    cy.url().should("include", "/admin/dashboard");
    cy.contains("Awaiting approval").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    cy.wait(1500);
    successfull_message2();
  });
});
