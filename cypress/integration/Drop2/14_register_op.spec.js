import { login, route, switch_device } from "../../functions/actions";

describe("Test the registration of a User", function() {
  beforeEach(function() {
    login(5);
  });

  afterEach(function() {});

  it("Register as Laura Operator", () => {
    cy.server();
    route();
    cy.url().should("include", "/admin/dashboard");
    cy.get("[data-test=menuItem-users]").click();
    cy.url().should("include", "/admin/users");
    cy.wait(500);
    cy.contains("Laura").click();
    cy.get("[data-test=Copy_value]")
      .invoke("text")
      .then(text => {
        cy.visit(text);
        switch_device(17);
        cy.get("[data-test=button_registration]").click();
        cy.wait(1500);
        cy.contains(
          "You've successfully registered to the Ledger Vault.",
        ).should("be.visible");
      });
  });

  it("Register as Sally Operator", () => {
    cy.server();
    route();
    cy.url().should("include", "/admin/dashboard");
    cy.get("[data-test=menuItem-users]").click();
    cy.url().should("include", "/admin/users");
    cy.wait(500);
    cy.contains("Sally").click();
    cy.get("[data-test=Copy_value]")
      .invoke("text")
      .then(text => {
        cy.visit(text);
        switch_device(18);
        cy.get("[data-test=button_registration]").click();
        cy.wait(1500);
        cy.contains(
          "You've successfully registered to the Ledger Vault.",
        ).should("be.visible");
      });
  });

  it("Register as Claudia Operator", () => {
    cy.server();
    route();
    cy.url().should("include", "/admin/dashboard");
    cy.get("[data-test=menuItem-users]").click();
    cy.url().should("include", "/admin/users");
    cy.wait(500);
    cy.contains("Claudia").click();
    cy.get("[data-test=Copy_value]")
      .invoke("text")
      .then(text => {
        cy.visit(text);
        switch_device(19);
        cy.get("[data-test=button_registration]").click();
        cy.wait(1500);
        cy.contains(
          "You've successfully registered to the Ledger Vault.",
        ).should("be.visible");
      });
  });

  it("Register as Allison Operator", () => {
    cy.server();
    route();
    cy.url().should("include", "/admin/dashboard");
    cy.get("[data-test=menuItem-users]").click();
    cy.url().should("include", "/admin/users");
    cy.wait(500);
    cy.contains("Allison").click();
    cy.get("[data-test=Copy_value]")
      .invoke("text")
      .then(text => {
        cy.visit(text);
        switch_device(20);
        cy.get("[data-test=button_registration]").click();
        cy.wait(1500);
        cy.contains(
          "You've successfully registered to the Ledger Vault.",
        ).should("be.visible");
      });
  });

  it("Register as Tyler Operator", () => {
    cy.server();
    route();
    cy.url().should("include", "/admin/dashboard");
    cy.get("[data-test=menuItem-users]").click();
    cy.url().should("include", "/admin/users");
    cy.wait(1500);
    cy.contains("Tyler").click();
    cy.get("[data-test=Copy_value]")
      .invoke("text")
      .then(text => {
        cy.visit(text);
        switch_device(21);
        cy.get("[data-test=button_registration]").click();
        cy.wait(1500);
        cy.contains(
          "You've successfully registered to the Ledger Vault.",
        ).should("be.visible");
      });
  });

  it("Register as Charles Operator", () => {
    cy.server();
    route();
    cy.url().should("include", "/admin/dashboard");
    cy.get("[data-test=menuItem-users]").click();
    cy.url().should("include", "/admin/users");
    cy.wait(500);
    cy.contains("Charles").click();
    cy.get("[data-test=Copy_value]")
      .invoke("text")
      .then(text => {
        cy.visit(text);
        switch_device(22);
        cy.get("[data-test=button_registration]").click();
        cy.wait(1500);
        cy.contains(
          "You've successfully registered to the Ledger Vault.",
        ).should("be.visible");
      });
  });
});
