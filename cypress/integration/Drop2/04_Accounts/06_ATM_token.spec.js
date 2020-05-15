import {
  login,
  logout,
  route,
  select_creator_operators,
  successfull_message2,
  success_creation_account,
} from "../../../functions/actions";

describe("Test Case for Account", function () {
  beforeEach(function () {
    login(4);
  });

  afterEach(function () {
    logout();
  });

  it("Create ATM Token Account", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    cy.get("[data-test=add-button]").click();
    cy.wait(5500);
    cy.get("#input_crypto").type("ATM", { force: true }).type("{enter}");
    cy.contains("Create a new view-only Ethereum account").click();
    cy.contains("Next").click();
    cy.get("[data-test=account_childname]").type("ATM Test");
    cy.get("[data-test=account_parentname]").type("Limecoin");
    cy.contains("Next").click();

    // Rule 1
    select_creator_operators(
      2,
      "Claudia Schmitt",
      "Anna Wagner",
      "Aidan Fisher",
    );

    cy.contains("Next").click();
    cy.get("[data-test=approve_button]").click();

    success_creation_account();
  });

  it("Approve ATM token Account", () => {
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
