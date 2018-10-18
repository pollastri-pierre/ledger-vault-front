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
    cy.route("get", "**/dashboard").as("dashboard");

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
          //.get(".test-pending-account")
          .get("[data-test=pending-operation]")
          .eq(0)
          .click();
        cy.wait("@pending");
        // We should verify thoses element before to approve:      //
        //   * Name of the Account                                 //
        //   * Status of the Account shuld be 0%                   //
        //   * Currency of the account                             //
        //   * Approvals of the Account                            //
        //   * 3 buttons : close, abort and Approve                //
        //   * Members tab should display the right Members        //
        //   * Status tab should display member on pending state   //
        cy.get('.operation-list').eq(0).contains('status');
        cy.get('.approval-status').contains("Collecting Approvals (0/2)");
        cy.get("[data-test=name]").contains("BTC Testnet");

        cy.get('button').contains('Approve').should('be.visible');
        cy.get('button').contains('Abort');
        cy.get('button').contains('Close');
        cy.wait("@pending");

        // // click on approve to approve, it will display the device modal
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

            cy.get('.approval-status').contains("Collecting Approvals (0/2)");

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
