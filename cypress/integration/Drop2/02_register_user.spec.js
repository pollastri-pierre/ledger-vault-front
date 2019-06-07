import { login, route, switch_device } from "../../functions/actions";

describe("Test the registration of a User", function() {
  beforeEach(function() {
    login(5);
  });

  afterEach(function() {});

  it("Approve Anna operator", () => {
    cy.server();
    route();
    cy.url().should("include", "/admin/dashboard");
    cy.get("[data-test=menuItem-users]").click();
    cy.url().should("include", "/admin/users");
    cy.wait(5500);
    cy.contains("Anna").click();
    cy.get("[data-test=Copy_value]")
      .invoke("text")
      .then(text => {
        cy.visit(text);
        switch_device(10);
        cy.get("[data-test=button_registration]").click();
        cy.wait(6500);
        cy.contains(
          "You've successfully registered to the Ledger Vault.",
        ).should("be.visible");
      });
  });

  it("Approve Aidan operator", () => {
    cy.server();
    route();
    cy.url().should("include", "/admin/dashboard");
    cy.get("[data-test=menuItem-users]").click();
    cy.url().should("include", "/admin/users");
    cy.wait(5500);
    cy.contains("Aidan").click();
    cy.get("[data-test=Copy_value]")
      .invoke("text")
      .then(text => {
        cy.visit(text);
        switch_device(11);
        cy.get("[data-test=button_registration]").click();
        cy.wait(6500);
        cy.contains(
          "You've successfully registered to the Ledger Vault.",
        ).should("be.visible");
      });
  });

  it("Approve Thomas operator", () => {
    cy.server();
    route();
    cy.url().should("include", "/admin/dashboard");
    cy.get("[data-test=menuItem-users]").click();
    cy.url().should("include", "/admin/users");
    cy.wait(5500);
    cy.contains("Thomas").click();
    cy.get("[data-test=Copy_value]")
      .invoke("text")
      .then(text => {
        cy.visit(text);
        switch_device(12);
        cy.get("[data-test=button_registration]").click();
        cy.wait(6500);
        cy.contains(
          "You've successfully registered to the Ledger Vault.",
        ).should("be.visible");
      });
  });

  it("Approve John operator", () => {
    cy.server();
    route();
    cy.url().should("include", "/admin/dashboard");
    cy.get("[data-test=menuItem-users]").click();
    cy.url().should("include", "/admin/users");
    cy.wait(6500);
    cy.contains("John").click();
    cy.get("[data-test=Copy_value]")
      .invoke("text")
      .then(text => {
        cy.visit(text);
        switch_device(13);
        cy.get("[data-test=button_registration]").click();
        cy.wait(6500);
        cy.contains(
          "You've successfully registered to the Ledger Vault.",
        ).should("be.visible");
      });
  });
});
