import {
  login,
  logout,
  route,
  switch_device,
  create_account,
  approve,
  create_operation
} from "../../functions/actions.js";

describe("Tests Abort Operation", function() {
  beforeEach(function() {});

  afterEach(function() {
    logout();
  });

  it("Create a operation", () => {
    cy.server();
    route();
    login(4);
    create_operation("bitcoin_testnet",2, Cypress.env("address"), "0.001");
  });

  it("Not a member of the account try to abort a operation", () => {
    cy.server();
    route();
    login(6);
    // Device 6 is on read only, we should get a error
    cy.contains("Pending").click();
    cy.get("[data-test=pending-operation]")
      .eq(0)
      .click();
    cy.get("[data-test=dialog-button]")
      .contains("Abort")
      .click({ force: true });
    cy.get("button")
      .contains("Abort")
      .click({ force: true });
    cy.get(".top-message-body")
      .contains("This person is not a member of this account")
      .get(".top-message-title")
      .contains("Error 205");
  });

  it("Abort a operation", () => {
    cy.server();
    route();
    login(5);
    cy.contains("Pending").click();
    cy.get("[data-test=pending-operation]")
      .eq(0)
      .click();
    cy.get("[data-test=dialog-button]")
      .contains("Abort")
      .click();
    cy.get("button")
      .contains("Abort")
      .click();
    cy.get(".top-message-body")
      .contains("the operation request has been successfully aborted")
      .get(".top-message-title")
      .contains("operation request aborted");
  });
});
