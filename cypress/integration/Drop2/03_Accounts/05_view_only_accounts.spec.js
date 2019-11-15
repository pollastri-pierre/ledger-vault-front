import {
  login,
  logout,
  route,
  successfull_message2,
  success_edit_account,
  provide_viewonly_rule,
} from "../../../functions/actions";

describe("Provide transaction rules for View Only account", function() {
  beforeEach(function() {
    login(4);
  });

  afterEach(function() {
    logout();
  });

  it("Provide transaction rules for Eth view only account", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    cy.wait(3500);
    cy.contains("View-only")
      .eq(0)
      .click();
    provide_viewonly_rule("Limecoin", "APAC", "Anna");
    success_edit_account();
  });

  it("Provide transaction rules for Eth view only account", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    cy.wait(3500);
    cy.contains("CryptoC").click();
    cy.wait(1500);
    provide_viewonly_rule("CryptoC", "America Ops", "Laura");
    success_edit_account();
  });

  it("Approve CryptoC/Limecoin eth view only Account", () => {
    cy.server();
    route();
    logout();
    login(6);
    cy.url().should("include", "/admin/dashboard");
    cy.get("[data-test=1]").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    cy.wait(3500);
    successfull_message2();
    cy.get("[data-test=0]").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    cy.wait(2500);
    successfull_message2();
  });
});
