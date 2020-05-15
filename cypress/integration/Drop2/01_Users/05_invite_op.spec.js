import { login, logout, route, create_user } from "../../../functions/actions";

describe("Add User as Operator", function () {
  beforeEach(function () {
    login(6);
  });

  afterEach(function () {
    logout();
  });

  it("Invite 6 new operator", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-users]").click();
    cy.url().should("include", "/admin/users");

    // Add Laura Parker
    create_user(
      "Laura Parker",
      Cypress.env("opId17"),
      "[data-test=new_operator]",
    );

    // Add Sally Wilson
    create_user(
      "Sally Wilson",
      Cypress.env("opId18"),
      "[data-test=new_operator]",
    );

    // Claudia Schmitt
    create_user(
      "Claudia Schmitt",
      Cypress.env("opId19"),
      "[data-test=new_operator]",
    );

    // Allison Stowe
    create_user(
      "Allison Stowe",
      Cypress.env("opId20"),
      "[data-test=new_operator]",
    );
    // Tyler Flynn
    create_user(
      "Tyler Flynn",
      Cypress.env("opId21"),
      "[data-test=new_operator]",
    );
    // Charles Burnell
    create_user(
      "Charles Burnell",
      Cypress.env("opId22"),
      "[data-test=new_operator]",
    );
  });
});
