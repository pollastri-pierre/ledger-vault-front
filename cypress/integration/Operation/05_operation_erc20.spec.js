import {
  login,
  logout,
  route,
  switch_device,
  create_account,
  create_operation
} from "../../functions/actions.js";

describe("Tests Creation of a Operation", function() {
  beforeEach(function() {
    login(4);
  });

  afterEach(function() {
    logout();
  });
  it("Create a Operation", () => {
    cy.server();
    route();
    cy.get("[data-test=new-operation]").click();
    //cy.get("Ledger token").click({
    //  force: true
  //  });
    cy.get('[data-test=operation-creation-accounts]')
      .contains("Ledger token")
      .click();
    //cy.get("[data-test=unit-select]").click();
    //cy.get("[data-test=unit-select-values]")
    //  .eq(40)
    //  .debug()
    //  .click({ force: true });
    cy.get("[data-test=operation-creation-amount]")
      .find("input")
      .type("40");
    cy.get("[data-test=crypto-address-picker]")
      .find("input")
      .type("0x2EaDEDe7034243Bd2E8a574E80aFDD60409AE5c4");

    cy.wait(6500);
    cy.contains("Continue").click();
    cy.contains("Continue").click();
    cy.get("[data-test=dialog-button]")
      .contains("Confirm")
      .click({ force: true });
    cy.wait(2500);
    cy.get(".top-message-body")
      .contains("the operation request has been successfully created")
      .get(".top-message-title")
      .contains("operation request created");
  });
});
