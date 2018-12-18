const orga_name = Cypress.env("workspace");
context("Operation Creation", () => {
  let polyfill;
  before(() => {
    const polyfillUrl = Cypress.env('polyfillUrl');
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body;
    });
  });
  it("should create a Operation", () => {
    // go to vault homepage and enter orga_name
    cy.server();
    cy.route("post", "**/validation/**").as("validation");
    cy.route("post", "**/authentications/**").as("authenticate");
    cy.route("post", "**/fees").as("fees");
    cy.route("post", "**/logout").as("logout");

    cy.visit(Cypress.env('api_server'), {
      onBeforeLoad: win => {
        win.fetch = null;
        win.eval(polyfill);
        win.fetch = win.unfetch;
      }
    });
    cy
      .request("POST", Cypress.env('api_switch_device'), {
        device_number: 4
      })
      .then(() => {
        cy.get("input").type(orga_name);
        cy.contains("continue").click();
        cy.wait("@authenticate");
        //We should get a Welcome blue message
        cy
          .get(".top-message-body")
          .contains("Welcome to the Ledger Vault platform!")
          .get(".top-message-title")
          .contains("Hello");


        cy.get('[href="/ledger4/dashboard/receive"]').click();
        cy.url().should('include', '/dashboard/receive');
        cy.request("POST", Cypress.env("approve_cancel_device"), {
          approve: true
        });

        cy.get("[data-test=receive-accounts]").click();


        cy.wait(1500);
        // Verify that the QR code and the address is displayed
        cy.contains("Address for account BTC Testnet").should("be.visible");
        cy.get("canvas").should("be.visible");
        cy.contains("Copy address").should("be.visible");
        cy.wait(2500);
        //cy.get("span").should("be.visible");
        // Click to Verify button
        cy.contains("Re-verify").click();
      //  cy.contains("Copy address").click();
      
      });
  });
});
