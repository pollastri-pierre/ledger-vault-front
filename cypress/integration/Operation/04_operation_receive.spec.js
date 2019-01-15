import {
  login,
  logout,
  route,
  switch_device,
  create_account,
  approve
} from "../../functions/actions.js";

describe("Tests Receive address for account", function() {
  beforeEach(function() {
    login(4);
  });

  afterEach(function() {
    logout();
  });

  it("Get the receive address of a account", () => {
    cy.server();
    route();
    cy.contains("Receive").click();
    cy.url().should("include", "/dashboard/receive");
    approve();

    cy.get("[data-test=receive-accounts] li:first").click();
    cy.wait(1500);
    // Verify that the QR code and the address is displayed
    cy.contains("Address for account BTC Testnet").should("be.visible");
    cy.get("canvas").should("be.visible");
    cy.contains("Copy address").should("be.visible");
    cy.wait(2500);
    // Click to Verify button
    cy.contains("Re-verify").click();
  });
});
