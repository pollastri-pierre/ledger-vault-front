import {
  login,
  logout,
  route,
  switch_device,
  create_account,
  approve_operation,
  approve,
  create_operation,
} from "../../functions/actions.js";

describe("Operation for ERC20 Token", function() {
  it("Create a erc20 token Operation", () => {
    cy.server();
    route();
    login(4);
    cy.get("[data-test=new-operation]").click();
    cy.get("[data-test=operation-creation-accounts]")
      .contains("Ledger token")
      .click();
    cy.get("[data-test=operation-creation-amount]")
      .find("input")
      .type("40");
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
    approve_operation("Ledger token");
    logout();
    cy.wait(1000);
    login(5);
    approve();
    approve_operation("Ledger token");
  });
});
