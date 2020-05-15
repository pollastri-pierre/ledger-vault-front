import { login, logout, route, success_tx } from "../../../functions/actions";

describe("Test on Operator ", function () {
  beforeEach(function () {
    login(11);
  });

  afterEach(function () {
    logout();
  });

  it("Login as operator", () => {
    cy.server();
    route();
    cy.url().should("include", "/operator/dashboard");
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/operator/accounts");
    cy.wait(4500);
    cy.contains("Coinhy.pe").click();
    cy.contains("Balance").should("be.visible");
    cy.contains("Bitcoin").should("be.visible");
    cy.contains("Status").should("be.visible");
    cy.contains("Permission").should("be.visible");
    cy.contains("Last transactions").should("be.visible");
    cy.contains("Transaction rules").should("be.visible");
    cy.get("[data-test=menuItem-transactions]").click();
    cy.url().should("include", "/operator/transactions");
  });

  it("Receive and Send", () => {
    cy.server();
    route();
    // Receive Address
    cy.get("[data-test=menuItem-receive]").click();
    cy.get("#input_account")
      .type("Amanda Wong", { force: true })
      .type("{enter}");

    cy.get("[data-test=Copy_value]").then(($valueAddress) => {
      const ReceiveAddress = $valueAddress.text();
      cy.log(ReceiveAddress);
      cy.get("[data-test=close]").click();

      // SEND
      cy.get("[data-test=menuItem-new-transaction]").click();
      cy.get("#input_account")
        .type("Amanda Wong", { force: true })
        .type("{enter}");
      cy.get("#address").type(ReceiveAddress, { force: true }).type("{enter}");
      cy.get("[data-test=input_amount]")
        .type("0.0006", { force: true })
        .type("{enter}");
      cy.wait(2500);
      cy.contains("Next").click();
      cy.get("[data-test=title_tx]")
        .type("Cypress TX", { force: true })
        .type("{enter}");
      cy.get("[data-test=description_tx]")
        .type("Cypress is the best sending some money love", { force: true })
        .type("{enter}");
      cy.contains("Next").click();
      cy.get("[data-test=note_comments]")
        .contains("Cypress is the best sending some money love")
        .should("be.visible");
      cy.get("[data-test=note_title]")
        .contains("Cypress TX")
        .should("be.visible");
      cy.get("[data-test=approve_button]").click({ force: true });
      success_tx();
    });
  });
});
