import { login, logout, route, create_user } from "../../functions/actions";

describe("Tests Creation Account", function() {
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
      Cypress.env("userId1"),
      "[data-test=new_operator]",
    );

    // Add Aidan Fisher
    create_user(
      "Aidan Fisher",
      Cypress.env("userId2"),
      "[data-test=new_operator]",
    );

    // Thomas Lebron
    create_user(
      "Thomas Lebron",
      Cypress.env("userId3"),
      "[data-test=new_operator]",
    );

    // James Lepic
    create_user(
      "James Lepic",
      Cypress.env("userId4"),
      "[data-test=new_operator]",
    );
  });

  it("Invite new admin", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-users]").click();
    cy.url().should("include", "/admin/users");
    // Add John Clark
    create_user("John Clark", Cypress.env("userId5"), "[data-test=new_admin]");
  });
});
