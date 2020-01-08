import {
  login,
  logout,
  route,
  add_whitelist_address,
} from "../../../functions/actions";

describe("Approve whitelists", function() {
  beforeEach(function() {
    login(6);
  });

  afterEach(function() {
    logout();
  });

  it("Approve Whitelist", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-dashboard]").click();
    cy.get("[data-test=0]").click();
    cy.get("[data-test=approve_button]").click();
    cy.get("[data-test=successfull_message]").should("contain", "Successfully");
    cy.contains("Done").click();
    cy.get("[data-test=0]").click();
    cy.get("[data-test=approve_button]").click();
    cy.get("[data-test=successfull_message]").should("contain", "Successfully");
    cy.contains("Done").click();
  });

  it("Same Name whitelist should fail", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-whitelists]").click();
    cy.get("[data-test=add-button]").click();
    cy.get("[data-test=whitelist_name]").type("List Apac");
    cy.get("[data-test=whitelist_description]").type("Cypress List Apac");
    cy.contains("Next").click({ force: true });

    add_whitelist_address(
      "Bitcoin",
      "btc 1",
      "36R3kWz9u5q955JBY4MfqhPkDmvGrH4oHX",
    );
    cy.contains("Next").click({ force: true });
    cy.get("[data-test=approve_button]").click();
    cy.get("[data-test=error-message-title]").should("contain", "Error 2");
    cy.get("[data-test=error-message-desc]").should(
      "contain",
      "Whitelist with name List Apac already exists",
    );
    cy.get("[data-test=close")
      .eq(1)
      .click();
  });
});
