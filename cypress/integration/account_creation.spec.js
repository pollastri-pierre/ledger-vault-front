const orga_name = "vault16";
context("Account creation", () => {
  it("redirect to login", () => {
    // go to vault homepage and enter orga_name
    cy.visit("https://localhost:9000");
    cy.get("input").type(orga_name);
    cy.contains("continue").click();

    // click on the new account button in header
    cy.get(".test-new-account").click();

    // choose Bitcoin Testnet currency for the account
    cy.contains("Bitcoin Testnet").click();

    // enter the name of the account
    cy.get("input").type("BTC Testnet");
    cy.contains("continue").click();

    // open the list of members modal
    cy.contains("Members").click();
    // select 3 members
    cy.wait(500);
    cy
      .get(".test-member-row")
      .eq(0)
      .click({ force: true });
    cy.wait(500);
    cy
      .get(".test-member-row")
      .eq(1)
      .click({ force: true });
    cy.wait(500);
    cy
      .get(".test-member-row")
      .eq(2)
      .click({ force: true });
    cy.wait(500);

    cy.contains("Done").click();
    cy.wait(200);

    // open the approval modal
    cy.contains("Approvals").click();

    // type 100 to trigger an error
    cy.get("input").type(100);
    cy.contains("done").click();
    cy.wait(500);

    // clear the input and type 2
    cy.get("input").clear();
    cy.get("input").type(2);
    cy.wait(100);
    // go back
    cy.contains("done").click();

    cy.wait(100);
    // go to confirmation tab
    cy.contains("continue").click();

    // click on done to create the account, it will display the authenticate with device modal
    cy.contains("done").click();
  });
});
