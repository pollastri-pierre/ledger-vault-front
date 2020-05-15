import {
  login,
  logout,
  route,
  successfull_message2,
} from "../../../functions/actions";

describe("Test Case for Approve the creation of Groups", function () {
  beforeEach(function () {
    login(5);
  });

  afterEach(function () {
    logout();
  });

  it("Approve Groups", () => {
    cy.server();
    route();
    cy.url().should("include", "/admin/dashboard");

    cy.contains("NORTH Asia").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    successfull_message2();

    cy.contains("EMEA").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    successfull_message2();

    cy.contains("APAC").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    successfull_message2();

    cy.contains("South Africa").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    successfull_message2();
  });
});
