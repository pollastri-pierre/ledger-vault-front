import {
  login,
  logout,
  route,
  successfull_message,
} from "../../../functions/actions";

describe("Test Edit Admin Rule", function() {
  beforeEach(function() {
    login(4);
  });

  afterEach(function() {
    logout();
  });

  it("Edit the admin rule", () => {
    cy.server();
    route();
    cy.url().should("include", "/admin/dashboard");
    cy.wait(1500);
    cy.get("[data-test=edit-admin-rule]").click();
    cy.get("[data-test=edit-admin-rule_more]").click();
    cy.get("[data-test=approve_button]").click();
    successfull_message();
  });
});
