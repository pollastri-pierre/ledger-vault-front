import {
  login,
  logout,
  route,
  create_group,
  successfull_message,
  error_message,
} from "../../functions/actions";

describe("Tests Creation Account", function() {
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

    create_group("APAC", "Group for APAC 1", "Thomas", "Anna", "James");
    successfull_message();

    create_group("EMEA", "Group for EMEA", "James", "Aidan", "Thomas");
    successfull_message();

    create_group("EMEA", "Group for EMEA", "Aidan", "Anna", "James");
    error_message("Group already exists", "Error 10202");
    cy.get("[data-test=close]").click();

    create_group(
      "NORTH Asia",
      "Group for NORTH Asia",
      "Aidan",
      "James",
      "Thomas",
    );
    successfull_message();
    cy.wait(1500);

    create_group(
      "South Africa",
      "Group for South Africa",
      "Aidan",
      "James",
      "Thomas",
    );
    successfull_message();
  });

  it("Approve Groups", () => {
    cy.server();
    route();
    login(5);
    cy.url().should("include", "/admin/dashboard");
    cy.get("[data-test=menuItem-groups]").click();
    cy.url().should("include", "/admin/groups");

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

  it("Edit Group desc", () => {
    cy.server();
    route();
    cy.url().should("include", "/admin/dashboard");
    cy.get("[data-test=menuItem-groups]").click();
    cy.url().should("include", "/admin/groups");

    cy.contains("APAC").click();
    cy.wait(1500);
    cy.get("[data-test=group_edit_button]").click();
    cy.get("[data-test=group_description]").clear();
    cy.get("[data-test=group_description]").type("New descprition Group");
    cy.contains("Next").click();
    cy.contains("Next").click();
    cy.wait(1500);
    cy.get("[data-test=update-description]").click();
    cy.contains(
      "You only updated the description. It doesn't requre HSM/Device validation",
    );
    cy.get("[data-test=close]").click();
  });

  it("Edit Group Name", () => {
    cy.server();
    route();
    cy.url().should("include", "/admin/dashboard");
    cy.get("[data-test=menuItem-groups]").click();
    cy.url().should("include", "/admin/groups");

    cy.contains("EMEA").click();
    cy.wait(1500);
    cy.get("[data-test=group_edit_button]").click();
    cy.get("[data-test=group_name]").clear();
    cy.get("[data-test=group_name]").type("New EMEA");
    cy.contains("Next").click();
    cy.contains("Next").click();
    cy.wait(1500);
    cy.get("[data-test=approve_button]").click();
    successfull_message();
  });

  it("Edit Group Member", () => {
    cy.server();
    route();
    cy.url().should("include", "/admin/dashboard");
    cy.get("[data-test=menuItem-groups]").click();
    cy.url().should("include", "/admin/groups");
    cy.contains("NORTH Asia").click();
    cy.wait(1500);
    cy.get("[data-test=group_edit_button]").click();
    cy.contains("Next").click();
    cy.get("#input_groups_users")
      .clear()
      .type("Aidan", { force: true })
      .type("{enter}");
    cy.get("#input_groups_users")
      .clear()
      .type("Anna", { force: true })
      .type("{enter}");
    cy.contains("Next").click();
    cy.wait(1500);
    cy.get("[data-test=approve_button]").click();
    successfull_message();
  });

  it("Approve Edit Groups", () => {
    cy.server();
    route();
    login(6);
    cy.url().should("include", "/admin/dashboard");
    cy.contains("Edit group").click();
    cy.wait(1500);
    cy.get("[data-test=approve_button]").click();
    cy.wait(2500);

    cy.contains("Edit group").click();
    cy.wait(1500);
    cy.get("[data-test=approve_button]").click();
    successfull_message();
    cy.wait(2500);
  });

  it("Delete Group", () => {
    cy.server();
    route();
    cy.url().should("include", "/admin/dashboard");
    cy.get("[data-test=menuItem-groups]").click();
    cy.url().should("include", "/admin/groups");

    cy.contains("NORTH Asia").click();
    cy.wait(1500);
    cy.get("[data-test=approve_button]").click();
    cy.get("[data-test=Confirm]").click();
    successfull_message();
    login(6);
    cy.url().should("include", "/admin/dashboard");
    cy.contains("Delete group").click();
    cy.wait(1500);
    cy.get("[data-test=approve_button]").click();
    successfull_message();
  });

  it("Reject Deletion Group", () => {
    cy.server();
    route();
    cy.url().should("include", "/admin/dashboard");
    cy.get("[data-test=menuItem-groups]").click();
    cy.url().should("include", "/admin/groups");

    cy.contains("EMEA").click();
    cy.wait(1500);
    cy.get("[data-test=approve_button]").click();
    cy.get("[data-test=Confirm]").click();
    successfull_message();
    login(6);
    cy.url().should("include", "/admin/dashboard");
    cy.contains("Delete group").click();
    cy.wait(1500);
    cy.contains("Reject").click();
    successfull_message();
  });
});
