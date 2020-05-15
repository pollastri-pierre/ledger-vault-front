import {
  login,
  logout,
  route,
  create_group,
  error_message,
} from "../../../functions/actions";

describe("Test Case for Create Groups", function () {
  beforeEach(function () {
    login(4);
  });

  afterEach(function () {
    logout();
  });

  it("Create Groups", () => {
    cy.server();
    route();

    cy.get("[data-test=menuItem-groups]").click();
    cy.url().should("include", "/admin/groups");

    create_group("APAC", "Group for APAC", "Thomas", "Anna", "Aidan");

    create_group("EMEA", "Group for EMEA", "James", "Laura", "Sally");

    create_group(
      "NORTH Asia",
      "Group for NORTH Asia",
      "Claudia",
      "Allison",
      "Tyler",
    );
    cy.wait(1500);

    create_group(
      "South Africa",
      "Group for South Africa",
      "Charles",
      "Anna",
      "Laura",
    );
  });

  it("Create Group with the same name", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-groups]").click();
    cy.url().should("include", "/admin/groups");
    cy.get("[data-test=add-button]").click();
    cy.wait(2000);
    cy.get("[data-test=group_name]").type("EMEA");
    cy.get("#input_groups_users")
      .type("Aidan", { force: true })
      .type("{enter}");
    cy.get("#input_groups_users").type("Anna", { force: true }).type("{enter}");
    cy.get("#input_groups_users")
      .type("James", { force: true })
      .type("{enter}");
    cy.get("[data-test=group_description]").type("Group for EMEA");
    cy.contains("Next").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    cy.wait(1500);

    error_message("Error 10202", "Group already exists");
    cy.get("[data-test=close]").eq(1).click();
    cy.get("[data-test=close]").eq(0).click();
  });
});
