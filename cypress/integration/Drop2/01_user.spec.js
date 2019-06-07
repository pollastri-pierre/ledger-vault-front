import { login, logout, route, create_user } from "../../functions/actions";

describe("Add User as Operator and Admin", function() {
  beforeEach(function() {
    login(4);
  });

  afterEach(function() {
    logout();
  });

  it("Invite new operator", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-users]").click();
    cy.url().should("include", "/admin/users");

    // Add Anna Wagner
    create_user(
      "Anna Wagner",
      Cypress.env("opId10"),
      "[data-test=new_operator]",
    );

    // Add Aidan Fisher
    create_user(
      "Aidan Fisher",
      Cypress.env("opId11"),
      "[data-test=new_operator]",
    );

    // Thomas Lebron
    create_user(
      "Thomas Lebron",
      Cypress.env("opId12"),
      "[data-test=new_operator]",
    );

    // James Lepic
    create_user(
      "James Lepic",
      Cypress.env("opId13"),
      "[data-test=new_operator]",
    );
  });

  it("Invite new admin", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-users]").click();
    cy.url().should("include", "/admin/users");
    // Add John Clark
    create_user("John Clark", Cypress.env("opId16"), "[data-test=new_admin]");
  });
});
