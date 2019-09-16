import {
  login,
  logout,
  route,
  successfull_message,
} from "../../../functions/actions";

describe("Approve User as Operator and Admin with the second Admin", function() {
  beforeEach(function() {
    login(6);
  });

  afterEach(function() {
    logout();
  });

  it("Approve new operator and admin", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-users]").click();
    cy.url().should("include", "/admin/users");
    cy.wait(1500);
    // Add Anna Wagner
    cy.contains("Anna").click();
    cy.get("[data-test=approve_button]").click();
    successfull_message();
    cy.get("[data-test=close]").click();

    // Add Aidan Fisher
    cy.contains("Aidan").click();
    cy.get("[data-test=approve_button]").click();
    successfull_message();
    cy.get("[data-test=close]").click();

    // Thomas Lebron
    cy.contains("Thomas").click();
    cy.get("[data-test=approve_button]").click();
    successfull_message();
    cy.get("[data-test=close]").click();

    // James Lepic
    cy.contains("James").click();
    cy.get("[data-test=approve_button]").click();
    successfull_message();
    cy.get("[data-test=close]").click();

    // John Clark admin
    cy.contains("John").click();
    cy.get("[data-test=approve_button]").click();
    successfull_message();
    cy.get("[data-test=close]").click();
  });
});
