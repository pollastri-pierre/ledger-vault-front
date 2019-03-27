import { login, route, switch_device } from "../../functions/actions";

describe("Negatif Test Case", () => {
  beforeEach(() => {});

  afterEach(() => {});

  it("Login with a wrong workspace name", () => {
    cy.server();
    route();
    cy.visit(Cypress.env("api_server"));
    cy.clearCookies();
    switch_device(4);
    cy.get("input[type=text]").type("fakeorga", { delay: 40 });
    cy.contains("Continue").click();
    cy.get(".top-message-body")
      .contains("Team domain unknown")
      .get(".top-message-title")
      .contains("Error");
  });

  it("Login with a wrong device WPK", () => {
    cy.server();
    route();
    cy.visit(Cypress.env("api_server"));
    cy.clearCookies();
    switch_device(2);
    cy.get("input[type=text]").clear();
    cy.get("input[type=text]").type(Cypress.env("workspace"));
    cy.contains("Continue").click();
    cy.get(".top-message-body")
      .contains("Unknown device connected. Please connect an admin device")
      .get(".top-message-title")
      .contains("Unknown device");
    cy.contains("cancel").click();
  });

  it("Create a account with a wrong device", () => {
    cy.server();
    route();
    login(4);
    switch_device(3);
    cy.get(".test-new-account").click();
    cy.get("#input_crypto")
      .type("Bitcoin Testnet", { force: true })
      .type("{enter}");
    cy.get("input[type=text]").type("BTC Testnet test");
    cy.contains("Continue").click();
    cy.contains("Members").click();
    cy.get(".test-member-row")
      .eq(0)
      .click({ force: true });
    cy.get(".test-member-row")
      .eq(1)
      .click({ force: true });
    cy.get("[data-test=dialog-button]").click();
    cy.contains("Approvals").click();
    cy.get("input[type=text]").type(1);
    cy.get("[data-test=dialog-button]").click();
    cy.contains("Continue").click();
    cy.get("[data-test=dialog-button]").click();
    cy.get(".top-message-body")
      .contains("Person does not exist")
      .get(".top-message-title")
      .contains("Error 701");
  });
});
