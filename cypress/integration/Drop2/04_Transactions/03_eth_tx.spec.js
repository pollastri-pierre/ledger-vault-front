import { login, logout, route, approve_tx } from "../../../functions/actions";

describe("Test create tx and approve it by Operators", function () {
  beforeEach(function () {
    login(12);
  });

  afterEach(function () {
    logout();
  });

  it("Create a eth ropsten tx", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-new-transaction]").click();
    cy.get("#input_account")
      .type("WPNakamoto", { force: true })
      .type("{enter}");
    cy.get("#address")
      .type("0x435dd233A73Ee0ceCDA57D4402D21eA134D134e2", { force: true })
      .type("{enter}");
    cy.get("[data-test=input_amount]")
      .eq(0)
      .type("0.001", { force: true })
      .type("{enter}");
    cy.get("[data-test=input_amount]")
      .eq(1)
      .type("2", { force: true })
      .type("{enter}");
    cy.get("[data-test=input_amount]").eq(2).type("126000", { force: true });
    cy.wait(2500);
    cy.contains("Next").click();
    cy.get("[data-test=title_tx]").type("Cypress TX for eth rop", {
      force: true,
    });
    cy.get("[data-test=description_tx]").type(
      "Cypress is the best sending some eth rop money love",
      {
        force: true,
      },
    );
    cy.contains("Next").click();
    cy.get("[data-test=note_comments]")
      .contains("Cypress is the best sending some eth rop money love")
      .should("be.visible");
    cy.get("[data-test=note_title]")
      .contains("Cypress TX for eth rop")
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

  it("Approved tx by Sally", () => {
    cy.server();
    route();
    logout();
    login(18);
    approve_tx();
  });

  it("Approved tx by Claudia", () => {
    cy.server();
    route();
    logout();
    login(19);
    approve_tx();
  });
});
