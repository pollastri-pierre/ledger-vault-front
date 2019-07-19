import {
  login,
  logout,
  route,
  create_group,
  successfull_message,
  error_message,
} from "../../../functions/actions";

describe("Test Case for Create Groups", function() {
  beforeEach(function() {
    login(4);
  });

  afterEach(function() {
    logout();
  });

  it("Create Groups", () => {
    cy.server();
    route();

    cy.get("[data-test=menuItem-groups]").click();
    cy.url().should("include", "/admin/groups");

    create_group("APAC", "Group for APAC", "Thomas", "Anna", "Aidan");
    successfull_message();

    create_group("EMEA", "Group for EMEA", "James", "Laura", "Sally");
    successfull_message();

    create_group(
      "NORTH Asia",
      "Group for NORTH Asia",
      "Claudia",
      "Allison",
      "Tyler",
    );
    successfull_message();
    cy.wait(1500);

    create_group(
      "South Africa",
      "Group for South Africa",
      "Charles",
      "Anna",
      "Laura",
    );
    successfull_message();
  });

  it("Create Group with the same name", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-groups]").click();
    cy.url().should("include", "/admin/groups");
    create_group("EMEA", "Group for EMEA", "Aidan", "Anna", "James");
    error_message("Error 10202", "Group already exists");
    cy.get("[data-test=close]")
      .eq(1)
      .click();
    cy.get("[data-test=close]")
      .eq(0)
      .click();
  });
});
