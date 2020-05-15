import { login, logout, route, approve_tx } from "../../../functions/actions";

describe("Test create tx and approve it by Operator", function () {
  beforeEach(function () {
    login(22);
  });

  afterEach(function () {
    logout();
  });

  it("Create a XRP Transaction", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-new-transaction]").click();
    cy.get("#input_account")
      .type("XRPCoinhome", { force: true })
      .type("{enter}");
    cy.get("#address")
      .type("rBSehfcqoVo7cPGCHgHPsC2iasFV8LSYb2", { force: true })
      .type("{enter}");
    cy.get("[data-test=input_amount]")
      .eq(0)
      .type("0.0002", { force: true })
      .type("{enter}");
    cy.wait(3500);
    cy.get("[data-test=tag]").type("98766", { force: true });
    cy.contains("Next").click();
    cy.get("[data-test=title_tx]").type("Cypress TX for XRP", { force: true });
    cy.get(
      "[data-test=description_tx]",
    ).type("Cypress is the best sending some XRP money love", { force: true });
    cy.contains("Next").click();
    cy.get("[data-test=note_comments]")
      .contains("Cypress is the best sending some XRP money love")
      .should("be.visible");
    cy.get("[data-test=note_title]")
      .contains("Cypress TX for XRP")
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

  it("Approved tx by Aidan", () => {
    cy.server();
    route();
    logout();
    login(11);
    approve_tx();
  });

  it("Approved tx by Thomas", () => {
    cy.server();
    route();
    logout();
    login(12);
    approve_tx();
  });
});
