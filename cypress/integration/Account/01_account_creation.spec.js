import {
  login,
  logout,
  route,
  switch_device,
  create_account
} from "../../functions/actions.js";

describe("Tests Creation Account", function() {
  beforeEach(function() {
    login(4);
  });

  afterEach(function() {
    logout();
  });

  it("Create a account BTC Testnet", () => {
    cy.server();
    route();
    create_account("Bitcoin Testnet", "BTC Testnet");
  });

  it("Create a account with the same name should fail", () => {
    cy.server();
    route();
    cy.get(".test-new-account").click();
    //cy.wait(2000)
    cy.contains("Bitcoin Testnet").click();
    cy.get("input").type("BTC Testnet")
    cy.contains("Continue").click();
    cy.contains("Members").click();
    cy.get(".test-member-row")
      .eq(0)
      .click({ force: true });
    cy.get(".test-member-row")
      .eq(1)
      .click({ force: true });
    cy.contains("Done").click();
    cy.contains("Approvals").click();
    cy.get("input").type(100);
    cy.contains("done").click();
    cy.get(".top-message-body").contains(
      "Number of approvals cannot exceed number of members"
    );
    cy.get("input").clear();

    cy.get("input").type(2);
    cy.contains("done").click();
    cy.contains("Continue").click();
    cy.contains("done").click();
    cy.wait(2500);
    cy.get(".top-message-body")
      .contains("Account name already exists in this currency")
      .get(".top-message-title")
      .contains("Error 236");
  });
});
