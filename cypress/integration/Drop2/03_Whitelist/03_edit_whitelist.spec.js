import { login, logout, route } from "../../../functions/actions";

describe("Edit whitelists", function() {
  beforeEach(function() {
    login(6);
  });

  afterEach(function() {
    logout();
  });

  it("Edit Whitelist Name", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-whitelists]").click();
    cy.contains("List Apac").click();
    cy.get("[data-test=edit-button]").click({ force: true });
    cy.get("[data-test=whitelist_name]").type("List North ASIA");
    cy.contains("Next").click({ force: true });
    cy.contains("Next").click({ force: true });
    cy.get("[data-test=approve_button]").click();
    cy.wait(500);
    cy.contains("Done").click();
  });

  it("Edit Whitelist Description", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-whitelists]").click();
    cy.contains("List Apac").click();
    cy.get("[data-test=edit-button]").click({ force: true });
    cy.get("[data-test=whitelist_description]")
      .clear()
      .type("Cypress List Edit");
    cy.contains("Next").click({ force: true });
    cy.contains("Next").click({ force: true });
    cy.contains(
      "Editing the description doesn't require the approval from other Administrators or your device",
    );
    cy.get("[data-test=close]").click();
  });

  it("Edit Whitelist Addess", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-whitelists]").click();
    cy.contains("List Apac").click();
    cy.get("[data-test=edit-button]").click({ force: true });
    cy.contains("Next").click({ force: true });
    cy.get("[data-test=delete_edit]")
      .eq(3)
      .click();
    cy.get("[data-test=delete_edit]")
      .eq(1)
      .click();
    cy.contains("Next").click({ force: true });
    cy.get("[data-test=approve_button]").click();
    cy.wait(500);
    cy.contains("Done").click();
  });
});
