import {
  login,
  logout,
  route,
  create_account,
  success_creation_account,
  successfull_message2,
} from "../../../functions/actions";

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
    create_account("Ethereum", "Syscoin2", "Key accounts Ops", "America Ops");
    success_creation_account();
  });

  it("Approve Eth Account", () => {
    cy.server();
    route();
    logout();
    login(6);
    cy.url().should("include", "/admin/dashboard");
    cy.contains("Awaiting approval").click();
    cy.get("[data-test=approve_button]").click();
    cy.wait(2500);
    successfull_message2();
  });

  it("Create Ethereum Ropsten Account", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    create_account(
      "Ethereum Ropsten",
      "WPNakamoto",
      "Key accounts Ops",
      "South Africa",
    );
    success_creation_account();
  });

  it("Approve Eth Ropsten Account", () => {
    cy.server();
    route();
    logout();
    login(6);
    cy.url().should("include", "/admin/dashboard");
    cy.contains("Awaiting approval").click();
    cy.get("[data-test=approve_button]").click();
    cy.wait(3500);
    successfull_message2();
  });
});
