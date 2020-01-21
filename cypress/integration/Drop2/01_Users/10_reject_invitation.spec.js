import { login, logout, route } from "../../../functions/actions";

describe("reject invitation", function() {
  beforeEach(function() {
    login(5);
  });

  afterEach(function() {
    logout();
  });

  it("Reject Operator Invitation ", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-users]").click();
    cy.url().should("include", "/admin/users");

    // Reject Operator Invitation
    cy.contains("Nicole Smith").click();
    cy.get("[data-test=reject-button]").click();
    cy.get("[data-test=Confirm]").click();
    cy.get("[data-test=successfull_message]").should(
      "contain",
      "Successfully rejected",
    );
    cy.get("[data-test=done_button]").click();

    // Reject Admin Invitation
    cy.contains("Admin 4").click();
    cy.get("[data-test=reject-button]").click();
    cy.get("[data-test=Confirm]").click();
    cy.get("[data-test=successfull_message]").should(
      "contain",
      "Successfully rejected",
    );
    cy.get("[data-test=done_button]").click();
  });
});
