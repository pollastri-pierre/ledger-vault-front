import {
  login,
  logout,
  route,
  successfull_message,
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
    successfull_message();
  });

  it("Approve Limecoin eth view only Account", () => {
    cy.server();
    route();
    logout();
    login(6);
    cy.url().should("include", "/admin/dashboard");
    cy.contains("Awaiting approval").click();
    cy.get("[data-test=approve_button]").click();
    successfull_message();
    cy.wait(2000);
  });

  it("Provide transaction rules for Eth view only account", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    cy.wait(3500);
    cy.contains("Syscoin").click();
    cy.wait(1500);
    provide_viewonly_rule("Syscoin", "America Ops", "Laura");
    successfull_message();
  });

  it("Approve Syscoin eth view only Account", () => {
    cy.server();
    route();
    logout();
    login(6);
    cy.url().should("include", "/admin/dashboard");
    cy.contains("Awaiting approval").click();
    cy.get("[data-test=approve_button]").click();
    successfull_message();
    cy.wait(2000);
  });
});
