import {
  login,
  logout,
  route,
  switch_device,
  create_account,
} from "../../functions/actions.js";

describe("Tests Creation Account", function() {
  beforeEach(function() {
    login(4);
  });

  afterEach(function() {
    //logout();
  });

  it("Create Bitcoin Account", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should('include', '/admin/accounts')
    cy.get("[data-test=buttonCreate]").click();
    cy.wait(1000);

    cy.get("#react-select-3-option-0").click();
    cy.get("[datatest=account_name]").type("HeyBitcoin");
    cy.contains("Next").click();
    cy.get("#input_groups_users")
      .type("APAC 1", { force: true })
      .type("{enter}");
    cy.contains("Add approval").click();
    cy.get("#react-select-4-option-1-3").click();
    cy.contains("Next").click();
    cy.get('[data-test=dialog-button]').click();
    cy.wait(2500);
    cy.get(".top-message-body")
      .contains("the request has been successfully created")
      .get(".top-message-title")
      .contains("request created");
  });

  it("Create Ethereum Account", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should('include', '/admin/accounts')
    cy.get("[data-test=buttonCreate]").click();
    cy.wait(1000);

    cy.get("#react-select-3-option-6").click();
    cy.get("[datatest=account_name]").type("MyEth");
    cy.contains("Next").click();
    cy.get("#input_groups_users")
      .type("APAC 1", { force: true })
      .type("{enter}");
    cy.contains("Add approval").click();
    cy.get("#react-select-4-option-1-3").click();
    cy.contains("Next").click();
    cy.get('[data-test=dialog-button]').click();
    cy.wait(2500);
    cy.get(".top-message-body")
      .contains("the request has been successfully created")
      .get(".top-message-title")
      .contains("request created");
  });

  it("Create ERC20 Token Account", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should('include', '/admin/accounts')
    cy.get("[data-test=buttonCreate]").click();
    cy.wait(2500);

    cy.get("#input_crypto")
      .type("USDC", { force: true })
      .type("{enter}");
    cy.contains("Next").click();

    cy.get("[datatest=account_childname]").type("MyErc20");
    cy.get("[datatest=account_parentname]").type("ETH2");

    cy.contains("Next").click();
    cy.get("#input_groups_users")
      .type("APAC 1", { force: true })
      .type("{enter}");
    cy.contains("Add approval").click();
    cy.get("#react-select-4-option-1-3").click();
    cy.contains("Next").click();
    cy.get('[data-test=dialog-button]').click();
    cy.wait(2500);
    cy.get(".top-message-body")
      .contains("the request has been successfully created")
      .get(".top-message-title")
      .contains("request created");
  });

  it("Create a account with the same name should fail", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should('include', '/admin/accounts')
    cy.get("[data-test=buttonCreate]").click();
    cy.wait(1000);

    cy.get("#react-select-3-option-0").click();
    cy.get("[datatest=account_name]").type("HeyBitcoin2");
    cy.contains("Next").click();
    cy.get("#input_groups_users")
      .type("APAC 1", { force: true })
      .type("{enter}");
    cy.contains("Add approval").click();
    cy.get("#react-select-4-option-1-3").click();
    cy.contains("Next").click();
    cy.get('[data-test=dialog-button]').click();
    cy.wait(2500);
    cy.get(".top-message-body")
      .contains("Account name already exists in this currency")
      .get(".top-message-title")
      .contains("Error 236");
  });

});
