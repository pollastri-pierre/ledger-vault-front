import {
  login,
  logout,
  route,
  successfull_message,
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

    cy.get("[data-test=menuItem-users]").click();
    cy.url().should("include", "/admin/users");
    cy.wait(2000);

    // Laura operator
    cy.contains("Laura").click();
    cy.get("[data-test=approve_button]").click();
    successfull_message();
    cy.get("[data-test=close]").click();

    // Sally operator
    cy.contains("Sally").click();
    cy.get("[data-test=approve_button]").click();
    successfull_message();
    cy.get("[data-test=close]").click();

    // Claudia operator
    cy.contains("Claudia").click();
    cy.get("[data-test=approve_button]").click();
    successfull_message();
    cy.get("[data-test=close]").click();

    // Allison operator
    cy.contains("Allison").click();
    cy.get("[data-test=approve_button]").click();
    successfull_message();
    cy.get("[data-test=close]").click();

    // Tyler operator
    cy.contains("Tyler").click();
    cy.get("[data-test=approve_button]").click();
    successfull_message();
    cy.get("[data-test=close]").click();

    // Charles operator
    cy.contains("Charles").click();
    cy.get("[data-test=approve_button]").click();
    successfull_message();
    cy.get("[data-test=close]").click();
  });
});
