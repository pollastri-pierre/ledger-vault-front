import {
  login,
  logout,
  route,
  successfull_message2,
  select_creator_group,
  add_approval_step_operators,
  success_edit_account,
} from "../../../functions/actions";

describe("Provide transaction rules for View Only account", function() {
  beforeEach(function() {
    login(4);
  });

  afterEach(function() {
    logout();
  });

  it("Provide transaction rules for Eth view only account", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    cy.wait(3500);
    cy.contains("Limecoin").click();
    cy.get("[data-test=view_only_provide_rules]").click();
    cy.wait(5500);
    cy.get("[data-test=account_name]").should("have.value", "Limecoin");
    cy.contains("Next").click();
    select_creator_group("America Ops");
    cy.contains("Next").click();
    cy.get("[data-test=approve_button]").click();
    success_edit_account();
  });

  it("Provide transaction rules for Eth view only account", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should("include", "/admin/accounts");
    cy.wait(3500);
    cy.contains("CryptoC").click();
    cy.get("[data-test=view_only_provide_rules]").click();
    cy.wait(5500);
    cy.get("[data-test=account_name]").should("have.value", "CryptoC");
    cy.contains("Next").click();
    select_creator_group("America Ops");
    add_approval_step_operators(
      2,
      "James Lepic",
      "Anna Wagner",
      "Aidan Fisher",
    );

    cy.contains("Next").click();
    cy.get("[data-test=approve_button]").click();
    success_edit_account();
  });

  it("Approve CryptoC/Limecoin eth view only Account", () => {
    cy.server();
    route();
    logout();
    login(6);
    cy.url().should("include", "/admin/dashboard");
    cy.get("[data-test=1]").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    cy.wait(3500);
    successfull_message2();
    cy.get("[data-test=0]").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    cy.wait(2500);
    successfull_message2();
  });
});
