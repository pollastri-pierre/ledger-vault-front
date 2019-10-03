import {
  login,
  logout,
  route,
  successfull_message,
} from "../../../functions/actions";

describe("Approve User as Operator and Admin with the first admin", function() {
  beforeEach(function() {
    login(5);
  });

  afterEach(function() {
    logout();
  });

  it("Approve new operator and admin", () => {
    cy.server();
    route();

    cy.get("[data-test=menuItem-users]").click();
    cy.url().should("include", "/admin/users");

    // Anna Wagner operator
    cy.contains("Anna").click();
    cy.get("[data-test=approve_button]").click();
    successfull_message();
    cy.wait(2500);
    cy.get("[data-test=close]").click();

    // Aidan Fisher operator
    cy.contains("Aidan").click();
    cy.get("[data-test=approve_button]").click();
    successfull_message();
    cy.wait(2500);
    cy.get("[data-test=close]").click();

    // Thomas Lebron operator
    cy.contains("Thomas").click();
    cy.get("[data-test=approve_button]").click();
    successfull_message();
    cy.wait(2500);
    cy.get("[data-test=close]").click();

    // James Lepic operator
    cy.contains("James").click();
    cy.get("[data-test=approve_button]").click();
    successfull_message();
    cy.wait(2500);
    cy.get("[data-test=close]").click();

    // John Clark admin
    cy.contains("John").click();
    cy.get("[data-test=approve_button]").click();
    successfull_message();
    cy.wait(2500);
    cy.get("[data-test=close]").click();
  });
});
