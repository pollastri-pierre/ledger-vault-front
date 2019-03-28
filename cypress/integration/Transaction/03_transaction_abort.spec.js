import {
  login,
  logout,
  route,
  create_transaction,
} from "../../functions/actions";

describe("Tests Abort Transaction", () => {
  afterEach(() => {
    logout();
  });

  it("Create a transaction", () => {
    cy.server();
    route();
    login(4);
    create_transaction("bitcoin_testnet", 2, Cypress.env("address"), "0.001");
  });

  it("Not a member of the account try to abort a transaction", () => {
    cy.server();
    route();
    login(6);
    // Device 6 is on read only, we should get a error
    cy.contains("Pending").click();
    cy.get("[data-test=pending-transaction]")
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

  it("Abort a transaction", () => {
    cy.server();
    route();
    login(5);
    cy.contains("Pending").click();
    cy.get("[data-test=pending-transaction]")
      .eq(0)
      .click();
    cy.get("[data-test=dialog-button]")
      .contains("Abort")
      .click();
    cy.get("button")
      .contains("Abort")
      .click();
    cy.get(".top-message-body")
      .contains("the transaction request has been successfully aborted")
      .get(".top-message-title")
      .contains("transaction request aborted");
  });
});
