const orga_name = Cypress.env("workspace");
context("Account creation", () => {
  let polyfill;
  before(() => {
    const polyfillUrl = Cypress.env("polyfillUrl");
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body;
    });
  });
  it("Account creation", () => {
    // go to vault homepage and enter orga_name
    cy.visit(Cypress.env('api_server'), {
      onBeforeLoad: win => {
        win.fetch = null;
        win.eval(polyfill);
        win.fetch = win.unfetch;
      }
    });
    cy.server();
    cy.route("post", "**/authentications/**").as("authenticate");

    cy
      .request("POST", Cypress.env('api_switch_device'), {
        device_number: 4
      })
      .then(() => {
        cy.get("input").type(orga_name);
        cy.contains("continue").click();
        cy.wait("@authenticate");
        cy.get(".test-new-account").click();
        cy.contains("Bitcoin Testnet").click();
        cy.get("input").type("BTC Testnet");
        cy.contains("continue").click();
        // open the list of members modal
        cy.contains("Members").click();
        // select 3 members
        cy
          .get(".test-member-row")
          .eq(0)
          .click({ force: true });
        cy
          .get(".test-member-row")
          .eq(1)
          .click({ force: true });
        cy
          .get(".test-member-row")
          .eq(1)
          .click({ force: true });
        cy
          .get(".test-member-row")
          .eq(1)
          .click({ force: true });
        cy
          .get(".test-member-row")
          .eq(2)
          .click({ force: true });
        cy.contains("Done").click();
        cy.contains("Approvals").click();
        cy.get("input").type(100);
        cy.contains("done").click();
        cy.get("input").clear();
        cy.get("input").type(2);
        cy.contains("done").click();

        // go to confirmation tab
        cy.contains("continue").click();

        // click on done to create the account, it will display the authenticate with device modal
        cy.contains("done").click();
        cy.wait("@authenticate");
      });
  });
});
