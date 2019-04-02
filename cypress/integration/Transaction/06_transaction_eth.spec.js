import {
  login,
  logout,
  route,
  approve_transaction,
  approve,
} from "../../functions/actions";

describe("Eth Ropsten Transaction", () => {
  it("Create a Eth Ropsten Transaction", () => {
    cy.server();
    route();
    login(4);
    cy.get("[data-test=new-transaction]").click();
    cy.get("[data-test=transaction-creation-accounts]")
      .contains("Ethereum Testnet")
      .click();
    cy.get("[data-test=transaction-creation-amount]")
      .find("input")
      .type("0.3");
    cy.get("[data-test=crypto-address-picker]")
      .find("input")
      .type(Cypress.env("address_eth_rop"));

    cy.wait(6500);
    cy.contains("Continue").click();
    cy.contains("Continue").click();
    cy.get("[data-test=dialog-button]")
      .contains("Confirm")
      .click({ force: true });
    cy.wait(6500);
    approve();
    approve_transaction("Ethereum Testnet");
    logout();
    cy.wait(1000);
    login(5);
    approve();
    approve_transaction("Ethereum Testnet");
  });
});
