import {
  login,
  logout,
  route,
  successfull_message,
  success_creation_account,
  create_erc20_account,
} from "../../../functions/actions";

describe("Test Case for Account", function() {
  beforeEach(function() {
    login(4);
  });

  afterEach(function() {
    logout();
  });

  it("Create USDC Token Account and Eth parent account", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    create_erc20_account(
      "USDC",
      "Block.Chain 33",
      "CryptoC",
      "South Africa",
      "EMEA",
    );
    success_creation_account();
  });

  it("Approve USDC token Account", () => {
    cy.server();
    route();
    logout();
    login(6);
    cy.url().should("include", "/admin/dashboard");
    cy.contains("Awaiting approval").click();
    cy.wait(1500);
    cy.get("[data-test=approve_button]").click();
    cy.wait(2500);
    successfull_message();
  });
});
