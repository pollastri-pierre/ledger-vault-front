import {
  login,
  logout,
  route,
  successfull_message,
} from "../../functions/actions";

describe("Test Case for Approve the creation of Groups", function() {
  beforeEach(function() {
    login(5);
  });

  afterEach(function() {
    logout();
  });

  it("Approve Groups", () => {
    cy.server();
    route();
    cy.url().should("include", "/admin/dashboard");
    cy.get("[data-test=menuItem-groups]").click();
    cy.url().should("include", "/admin/groups");
    cy.wait(3500);
    cy.contains("NORTH Asia").click();
    cy.wait(1500);
    cy.get("[data-test=approve_button]").click();
    successfull_message();
    cy.get("[data-test=close]").click();

    cy.contains("EMEA").click();
    cy.wait(1500);
    cy.get("[data-test=approve_button]").click();
    successfull_message();
    cy.get("[data-test=close]").click();

    cy.contains("APAC").click();
    cy.wait(1500);
    cy.get("[data-test=approve_button]").click();
    successfull_message();
    cy.get("[data-test=close]").click();

    cy.contains("South Africa").click();
    cy.wait(1500);
    cy.get("[data-test=approve_button]").click();
    successfull_message();
  });
});
