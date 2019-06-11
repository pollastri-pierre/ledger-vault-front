import {
  login,
  logout,
  route,
  create_account,
  successfull_message,
  create_erc20_account,
} from "../../functions/actions";

describe("Test Case for Account", function() {
  beforeEach(function() {
    login(4);
  });

  afterEach(function() {
    logout();
  });

  it("Create Ethereum Account", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    create_account("Ethereum", "Syscoin", "Key accounts Ops", "America Op");
    successfull_message();
  });

  it("Approve Eth Account", () => {
    cy.server();
    route();
    login(6);
    cy.url().should("include", "/admin/dashboard");
    cy.contains("Awaiting approval").click();
    cy.get("[data-test=approve_button]").click();
    cy.wait(5500);
    successfull_message();
    cy.wait(2000);
  });

  it("Create ERC20 Token Account", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    create_erc20_account(
      "USDC",
      "Block.Chain",
      "Syscoin",
      "South Africa",
      "New EMEA",
    );
    successfull_message();
  });

  it("Approve ERC20 Account", () => {
    cy.server();
    route();
    login(6);
    cy.url().should("include", "/admin/dashboard");
    cy.contains("Awaiting approval").click();
    cy.get("[data-test=approve_button]").click();
    cy.wait(5500);
    successfull_message();
  });
  */
});
