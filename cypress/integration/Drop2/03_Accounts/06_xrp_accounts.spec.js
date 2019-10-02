import {
  login,
  logout,
  route,
  create_account,
  success_creation_account,
  successfull_message,
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
    create_account("XRP", "XRPCoinhome", "America Ops", "Charles Burnell");
    success_creation_account();
    create_account("XRP", "BitStw", "APAC", "Laura");
    success_creation_account();
  });

  it("Approve XRP Account", () => {
    cy.server();
    route();
    logout();
    login(4);
    cy.url().should("include", "/admin/dashboard");
    cy.get("[data-test=1]").click();
    cy.wait(2000);
    cy.get("[data-test=approve_button]").click();
    cy.wait(7500);
    successfull_message();
    cy.wait(2000);
    cy.get("[data-test=0]").click();
    cy.wait(2000);
    cy.get("[data-test=approve_button]").click();
    cy.wait(7500);
    successfull_message();
    cy.wait(2000);
  });
});
