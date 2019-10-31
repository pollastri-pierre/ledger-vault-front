import {
  login,
  logout,
  route,
  successfull_message2,
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
    cy.url().should("include", "/admin/dashboard");
    // Add Anna Wagner
    cy.contains("Anna").click();
    cy.get("[data-test=approve_button]").click();
    successfull_message2();

    // Add Aidan Fisher
    cy.contains("Aidan").click();
    cy.get("[data-test=approve_button]").click();
    successfull_message2();

    // Thomas Lebron
    cy.contains("Thomas").click();
    cy.get("[data-test=approve_button]").click();
    successfull_message2();

    // James Lepic
    cy.contains("James").click();
    cy.get("[data-test=approve_button]").click();
    successfull_message2();

    // John Clark admin
    cy.contains("John").click();
    cy.get("[data-test=approve_button]").click();
    successfull_message2();
  });
});
