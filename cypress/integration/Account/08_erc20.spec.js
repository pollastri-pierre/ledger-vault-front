import {
  login,
  logout,
  route,
  switch_device,
  approve,
  approve_account,
  create_account
} from "../../functions/actions.js";

describe("Tests Creation Account", function() {

    it("Create ERC20 token", () => {
      cy.server();
      route();
      login(6);
      cy.get(".test-new-account").click();
      cy.wait(1500);
      cy.get("#input_crypto")
        .type("LGC", { force: true })
        .type("{enter}");

      cy.get("[data-test=dialog-button]").click();
      cy.get("input").type("Ledger token");
      cy.get("[data-test=dialog-button]").click();

      cy.contains("Members").click();
      cy.get(".test-member-row")
        .eq(0)
        .click({ force: true });
      cy.get(".test-member-row")
        .eq(1)
        .click({ force: true });
      cy.contains("Done").click();
      cy.contains("Approvals").click();

      cy.get("input").clear();
      cy.get("input").type(2);
      cy.contains("done").click();
      cy.get("[data-test=dialog-button]").click();
      cy.contains("done").click();
      cy.wait(6500);

      approve();
      approve_account("Ledger Coin", "Ledger token", "LGC");
    });

    it("Approve with the a other member", () => {
      cy.server();
      route();
      login(4);
      cy.wait(1000);
      approve();
      approve_account("Ledger Coin", "Ledger token", "LGC");
    });

});
