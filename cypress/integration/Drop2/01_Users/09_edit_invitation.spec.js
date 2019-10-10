import { login, logout, route, create_user } from "../../../functions/actions";

describe("Edit invitation", function() {
  beforeEach(function() {
    login(6);
  });

  afterEach(function() {
    logout();
  });

  it("Edit Operator Invitation ", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-users]").click();
    cy.url().should("include", "/admin/users");

    // Add Test Smith
    create_user("Test Smith", "85A6F315CDB1EFCY", "[data-test=new_operator]");
    // Edit the username
    cy.contains("Test Smith").click();
    cy.get("[data-test=edit-icon]")
      .eq(0)
      .click();
    cy.get("[data-test=type-edit]")
      .clear()
      .type("Nicole Smith");
    cy.get("[data-test=save-button]").click();

    cy.get(".top-message-body")
      .contains("The invite user has been successfully updated")
      .get(".top-message-title")
      .contains("invite user updated");
    cy.get("[data-test=close]").click();
    // Edit the User Id
    cy.contains("Nicole Smith").click();
    cy.get("[data-test=edit-icon]")
      .eq(1)
      .click();
    cy.get("[data-test=type-edit]")
      .clear()
      .type("1353F315CDB1EFCY");
    cy.get("[data-test=save-button]").click();
    cy.get(".top-message-body")
      .contains("The invite user has been successfully updated")
      .get(".top-message-title")
      .contains("invite user updated");
  });

  it("Edit Admin Invitation ", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-users]").click();
    cy.url().should("include", "/admin/users");

    // Add Admin 8
    create_user("Admin 8", "05A6F885CDB1EFC3", "[data-test=new_admin]");
    // Edit the username
    cy.contains("Admin 8").click();
    cy.get("[data-test=edit-icon]")
      .eq(0)
      .click();
    cy.get("[data-test=type-edit]")
      .clear()
      .type("Admin 4");
    cy.get("[data-test=save-button]").click();
    cy.get(".top-message-body")
      .contains("The invite user has been successfully updated")
      .get(".top-message-title")
      .contains("invite user updated");
    cy.get("[data-test=close]").click();
    // Edit the User Id
    cy.contains("Admin 4").click();
    cy.get("[data-test=edit-icon]")
      .eq(1)
      .click();
    cy.get("[data-test=type-edit]")
      .clear()
      .type("4353F315CDB1EFC4");
    cy.get("[data-test=save-button]").click();
    cy.get(".top-message-body")
      .contains("The invite user has been successfully updated")
      .get(".top-message-title")
      .contains("invite user updated");
  });
});
