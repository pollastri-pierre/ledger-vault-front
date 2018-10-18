const orga_name = Cypress.env("workspace");
context("Operation approval", () => {
  let polyfill;
  before(() => {
    const polyfillUrl = Cypress.env('polyfillUrl');
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body;
    });
  });
  it("should approve a operation", () => {
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
          .get("[data-test=pending-operation]")
          .eq(0)
          .click();

          // Checking Value
          cy.get('.operation-list').eq(0).contains('status');
          cy.get('.approval-status').contains("Collecting Approvals (0/2)");
          cy.get("[data-test=name]").contains("BTC Testnet");

          cy.get('button').contains('Approve').should('be.visible');
          cy.get('button').contains('Abort');
          cy.get('button').contains('Close');

        // click on approve to approve, it will display the device modal
        cy
          .get("[data-test=dialog-button]")
          .contains("Approve")
          .click();
        cy.wait("@approve");

        //We should get a Welcome blue message
        cy
          .get(".top-message-body")
          .contains("the operation request has been successfully approved")
          .get(".top-message-title")
          .contains("operation request approved");

        // // // logout the current user
        cy.get("[data-test=view-profile]").click();
        cy.get("[data-test=logout]").click();
        cy.wait("@logout");
        // Logout succefully message
        cy
          .get(".top-message-body")
          .contains("You have been successfully logged out. You can now safely close your web browser.")
          .get(".top-message-title")
          .contains("See you soon!");

        // set the current device to device 2
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

            //We should get a Welcome blue message
            cy
              .get(".top-message-body")
              .contains("Welcome to the Ledger Vault platform!")
              .get(".top-message-title")
              .contains("Hello");

            cy.contains("Pending").click();

            cy
              .get("[data-test=pending-operation]")
              .eq(0)
              .click();
            cy.get('.approval-status').contains("Collecting Approvals (1/2)");

            cy
              .get("[data-test=dialog-button]")
              .contains("Approve")
              .click();
            cy.wait("@approve");

            cy
              .get(".top-message-body")
              .contains("the operation request has been successfully approved")
              .get(".top-message-title")
              .contains("operation request approved");
          });
      });
  });
});
