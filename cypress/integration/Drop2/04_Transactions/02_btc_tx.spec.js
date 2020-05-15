import { login, logout, route, approve_tx } from "../../../functions/actions";

describe("Test create tx and approve it by Operator", function () {
  beforeEach(function () {
    login(11);
  });

  afterEach(function () {
    logout();
  });

  it("Create a btc tesnet tx", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-new-transaction]").click();
    cy.get("#input_account")
      .type("Amanda Wong", { force: true })
      .type("{enter}");
    cy.get("#address")
      .type("mjCGxN2ncFnUa9Pm3QSoR4B9LkMcPZgxnN", { force: true })
      .type("{enter}");
    cy.get("[data-test=input_amount]")
      .eq(0)
      .type("0.001", { force: true })
      .type("{enter}");
    cy.wait(2500);
    cy.contains("Next").click();
    cy.get("[data-test=title_tx]").type("Cypress TX for btc", { force: true });
    cy.get(
      "[data-test=description_tx]",
    ).type("Cypress is the best sending some btc money love", { force: true });
    cy.contains("Next").click();
    cy.get("[data-test=note_comments]")
      .contains("Cypress is the best sending some btc money love")
      .should("be.visible");
    cy.get("[data-test=note_title]")
      .contains("Cypress TX for btc")
      .should("be.visible");
    cy.get("[data-test=approve_button]").click({ force: true });
    cy.wait(5000);
    cy.get("[data-test=success_msg]").should(
      "contain",
      "Transaction request successfully created!",
    );
    cy.get("[data-test=success_msg]").should(
      "contain",
      "Your request to create a transaction has been submitted for approval.",
    );
    cy.contains("Done").click();
  });

  it("Approved tx by Tyler", () => {
    cy.server();
    route();
    logout();
    login(21);
    approve_tx();
  });

  it("Approved tx by Charles", () => {
    cy.server();
    route();
    logout();
    login(22);
    approve_tx();
  });
});
