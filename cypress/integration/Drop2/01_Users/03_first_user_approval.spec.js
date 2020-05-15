import {
  login,
  logout,
  route,
  successfull_message2,
} from "../../../functions/actions";

describe("Approve User as Operator and Admin with the first admin", function () {
  beforeEach(function () {
    login(5);
  });

  afterEach(function () {
    logout();
  });

  it("Approve new operator and admin", () => {
    cy.server();
    route();

    cy.url().should("include", "/admin/dashboard");

    // Anna Wagner operator
    cy.contains("Anna").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    successfull_message2();

    // Aidan Fisher operator
    cy.contains("Aidan").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    successfull_message2();

    // Thomas Lebron operator
    cy.contains("Thomas").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    successfull_message2();

    // James Lepic operator
    cy.contains("James").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    successfull_message2();

    // John Clark admin
    cy.contains("John").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    successfull_message2();
  });
});
