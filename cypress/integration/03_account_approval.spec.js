const orga_name = Cypress.env("workspace");
context("Account approval", () => {
  let polyfill;
  before(() => {
    const polyfillUrl = Cypress.env('polyfillUrl');
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body;
    });
  });
  it("should approve account", () => {
    // go to the vault homepage
    cy.visit(Cypress.env('api_server'), {
      onBeforeLoad: win => {
        win.fetch = null;
        win.eval(polyfill);
        win.fetch = win.unfetch;
      }
    });
    cy.server();
    cy.route("post", "**/authentications/**").as("authenticate");
    cy.route("post", "**/approve").as("approve");
    cy.route("post", "**/logout").as("logout");
    cy.route("get", "**/pending").as("pending");

    // set the current device to device 1
    cy
      .request("POST", Cypress.env('api_switch_device'), {
        device_number: 4
      })
      .then(() => {
        cy.get("input").type(orga_name);
        cy
          .get("button")
          .contains("continue")
          .click();
        cy.wait("@authenticate");
        //We should get a Welcome blue message
        cy
          .get(".top-message-body")
          .contains("Welcome to the Ledger Vault platform!")
          .get(".top-message-title")
          .contains("Hello");

        cy.contains("Pending").click();

        cy
          .get('.test-pending-account')
          .eq(0)
          .click();
        cy.wait("@pending");

        // Checking Value
        cy.get("[data-test=balance]").contains("-");
        cy.get("[data-test=status]").contains("Collecting approvals (0%)");
        cy.get("[data-test=requested]").should('be.visible');
        cy.get("[data-test=name]").contains("BTC Testnet");
        cy.get("[data-test=currency]").contains("bitcoin_testnet");
        cy.get('button').contains('Approve').should('be.visible');
        cy.get('button').contains('Abort');
        cy.get('button').contains('Close');
        cy.wait("@pending");

        // // click on approve to approve the account, it will display the device modal
        cy
          .get("button")
          .contains("Approve")
          .click();
        cy.wait("@approve");

        // // logout the current user
        cy.contains("view profile").click();
        cy.contains("logout").click();
        cy.wait("@logout");
        cy
          .get(".top-message-body")
          .contains("You have been successfully logged out. You can now safely close your web browser.")
          .get(".top-message-title")
          .contains("See you soon!");

        // // set the current device to device 2
        cy
          .request("POST", Cypress.env('api_switch_device'), {
            device_number: 5
          })
          .then(() => {
            cy.get("input").type(orga_name);
            cy
              .get("button")
              .contains("continue")
              .click();
            cy.wait("@authenticate");
            cy.contains("Pending").click();

            cy
              .get(".test-pending-account")
              .eq(0)
              .click();
            cy.wait("@pending");
            // Make sure that the approval is 1/2
            cy.get('.approval-status').contains("Collecting approvals (50%)");

            // // click on approve to approve, it will display the device modal
            cy
              .get("button")
              .contains("Approve")
              .click();
            cy.wait("@approve");


            // After logout we should get a message
            cy.contains("view profile").click();
            cy.contains("logout").click();
            cy.wait("@logout");
            cy
              .get(".top-message-body")
              .contains("You have been successfully logged out. You can now safely close your web browser.")
              .get(".top-message-title")
              .contains("See you soon!");
          });
      });
  });
});
