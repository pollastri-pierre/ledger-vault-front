import {
  login,
  logout,
  route,
  switch_device,
  approve,
  approve_account,
  create_account
} from "../../functions/actions.js";

describe("ERC20 Token Account", function() {
  it("Create/Approve ERC20 token account", () => {
    cy.server();
    route();
    login(6);
    cy.get(".test-new-account").click();
    cy.wait(2000);
    cy.get("#input_crypto")
      .type("LGC", { force: true })
      .type("{enter}");

    cy.get("[data-test=dialog-button]").click();
    cy.get("input[type=text]").type("Ledger token");
    cy.get("[data-test=dialog-button]").click();

    cy.contains("Members").click();
    cy.get(".test-member-row")
      .eq(0)
      .click({ force: true });
    cy.get(".test-member-row")
      .eq(1)
      .click({ force: true });
    cy.get("[data-test=dialog-button]").click();
    cy.contains("Approvals").click();

    cy.get("input[type=text]").clear();
    cy.get("input[type=text]").type(2);
    cy.get("[data-test=dialog-button]").click();
    cy.get("[data-test=dialog-button]").click();
    cy.get("[data-test=dialog-button]").click();
    cy.wait(8000);

    approve();
    approve_account("Ledger Coin", "Ledger token", "LGC");
    logout();
  });

  it("Approve with the a other member", () => {
    cy.server();
    route();
    login(4);
    cy.wait(2000);
    approve();
    approve_account("Ledger Coin", "Ledger token", "LGC");
  });
});
