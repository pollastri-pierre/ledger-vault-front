import {
  login,
  logout,
  route,
  successfull_message,
} from "../../../functions/actions";

describe("Revoke by a Admin", function() {
  beforeEach(function() {
    login(5);
  });

  afterEach(function() {
    logout();
  });

  it("Revoke a operator", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-users]").click();
    cy.url().should("include", "/admin/users");
    cy.wait(2500);
    // Revoke Operator active
    cy.contains("Sally Wilson").click();
    cy.get("[data-test=approve_button]").click();
    cy.contains("Are you sure you want to revoke this user?").should(
      "be.visible",
    );
    cy.get("[data-test=Confirm]").click();
    successfull_message();
    cy.get("[data-test=close]").click();
  });
  it("Approve the revocation", () => {
    cy.server();
    route();
    logout();
    login(6);
    cy.get("[data-test=awaiting-approval]").click();
    cy.get("[data-test=approve_button]").click();
    successfull_message();
  });
});
