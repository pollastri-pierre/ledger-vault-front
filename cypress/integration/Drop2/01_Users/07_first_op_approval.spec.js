import {
  login,
  logout,
  route,
  successfull_message2,
} from "../../../functions/actions";

describe("Approve User as Operator with the first admin", function() {
  beforeEach(function() {
    login(4);
  });

  afterEach(function() {
    logout();
  });

  it("Approve 6 new operator", () => {
    cy.server();
    route();
    cy.url().should("include", "/admin/dashboard");

    // Laura operator
    cy.contains("Laura").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    successfull_message2();

    // Sally operator
    cy.contains("Sally").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    successfull_message2();

    // Claudia operator
    cy.contains("Claudia").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    successfull_message2();

    // Allison operator
    cy.contains("Allison").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    successfull_message2();

    // Tyler operator
    cy.contains("Tyler").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    successfull_message2();

    // Charles operator
    cy.contains("Charles").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    successfull_message2();
  });
});
