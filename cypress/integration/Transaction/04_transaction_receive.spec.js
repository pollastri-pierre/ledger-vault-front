import { login, logout, route, approve } from "../../functions/actions";

describe("Tests Receive address for account", () => {
  beforeEach(() => {
    login(4);
  });

  afterEach(() => {
    logout();
  });

  it("Get the receive address of a account", () => {
    cy.server();
    route();
    cy.contains("Receive").click();
    cy.url().should("include", "/dashboard/receive");
    approve();

    // cy.get("[data-test=receive-accounts] li:first").click();
    cy.get("[data-test=receive-accounts]")
      .contains("bitcoin_testnet")
      .click();
    cy.wait(4500);
    // Verify that the QR code and the address is displayed
    cy.contains("Address for account BTC Testnet").should("be.visible");
    cy.get("canvas").should("be.visible");
    cy.contains("Copy address").should("be.visible");
    cy.wait(2500);
    // Click to Verify button
    cy.contains("Re-verify").click();
  });
});
