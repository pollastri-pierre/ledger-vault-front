import {
  login,
  logout,
  route,
  successfull_message,
} from "../../../functions/actions";

describe("Test Case for Groups", function() {
  beforeEach(function() {
    login(4);
  });

  afterEach(function() {
    logout();
  });

  it("Edit Group description", () => {
    cy.server();
    route();
    cy.url().should("include", "/admin/dashboard");
    cy.get("[data-test=menuItem-groups]").click();
    cy.url().should("include", "/admin/groups");

    cy.contains("APAC").click();
    cy.wait(1500);
    cy.get("[data-test=edit-button]").click();
    cy.get("[data-test=group_description]").clear();
    cy.get("[data-test=group_description]").type(
      "New descprition Group by Cypress",
    );
    cy.contains("Next").click();
    cy.wait(1500);
    cy.contains(
      "Editing the description doesn't require the approval from other Administrators or your device",
    );
    cy.get("[data-test=edit-desc-button]").click();
    cy.get(".top-message-body")
      .contains("The group's description has been successfully saved")
      .get(".top-message-title")
      .contains("group's description saved");
  });

  it("Edit Group Name", () => {
    cy.server();
    route();
    cy.url().should("include", "/admin/dashboard");
    cy.get("[data-test=menuItem-groups]").click();
    cy.url().should("include", "/admin/groups");

    cy.contains("EMEA").click();
    cy.wait(1500);
    cy.get("[data-test=edit-button]").click();
    cy.get("[data-test=group_name]").clear();
    cy.get("[data-test=group_name]").type("New EMEA");
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
    cy.get("[data-test=edit-button]").click();
    cy.get("#input_groups_users")
      .clear()
      .type("Aidan", { force: true })
      .type("{enter}");
    cy.get("#input_groups_users")
      .clear()
      .type("Anna", { force: true })
      .type("{enter}");
    cy.get("[data-test=group_name]").click();
    cy.contains("Next").click();
    cy.wait(1500);
    cy.get("[data-test=approve_button]").click();
    successfull_message();
  });

  it("Approve Edit Groups", () => {
    cy.server();
    route();
    logout();
    login(6);
    cy.url().should("include", "/admin/dashboard");
    cy.get("[data-test=1]").click();
    cy.wait(1500);
    cy.get("[data-test=approve_button]").click();
    successfull_message();
    cy.wait(1500);
    cy.get("[data-test=0]").click();
    cy.wait(1500);
    cy.get("[data-test=approve_button]").click();
    successfull_message();
  });
});
