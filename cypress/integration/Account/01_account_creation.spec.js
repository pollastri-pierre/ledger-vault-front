const orga_name = Cypress.env("workspace");
context("Account creation", () => {
  let polyfill;
  before(() => {
    const polyfillUrl = Cypress.env('polyfillUrl');
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body;
    });
  });
  it("should create a account", () => {
    cy.visit(Cypress.env('api_server'), {
      onBeforeLoad: win => {
        win.fetch = null;
        win.eval(polyfill);
        win.fetch = win.unfetch;
      }
    });
    cy.server();
    cy.route("post", "**/authentications/**").as("authenticate");
    cy.route("post", "**/logout").as("logout");

    cy
      .request("POST", Cypress.env('api_switch_device'), {
        device_number: 4
      })
      .then(() => {
        cy.get("input").type(orga_name);
        cy.contains("continue").click();
        cy.wait("@authenticate");
        cy
          .get(".top-message-body")
          .contains("Welcome to the Ledger Vault platform!")
          .get(".top-message-title")
          .contains("Hello");
        // Creation of a account BTC Testnet
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
        cy.contains("Done").click();
        cy.contains("Approvals").click();

        // We should get a Error if we put 100
        cy.get("input").type(100);
        cy.contains("done").click();
        cy
          .get(".top-message-body")
          .contains("Number of approvals cannot exceed number of members")
        cy.get("input").clear();

        cy.get("input").type(2);
        cy.contains("done").click();

        // go to confirmation tab
        cy.contains("continue").click();

        // click on done to create the account, it will display the authenticate with device modal
        cy.contains("done").click();
        cy.wait("@authenticate");
        cy.wait(2500);

        //We should get a Account request created message
        cy
          .get(".top-message-body")
          .contains("the account request has been successfully created")
          .get(".top-message-title")
          .contains("account request created");

        // Create a account with the same name:
        cy.get(".test-new-account").click();
        cy.contains("Bitcoin Testnet").click();
        cy.get("input").type("BTC Testnet");
        cy.contains("continue").click();
        cy.contains("Members").click();
        cy
          .get(".test-member-row")
          .eq(0)
          .click({ force: true });
        cy
          .get(".test-member-row")
          .eq(1)
          .click({ force: true });
        cy.contains("Done").click();
        cy.contains("Approvals").click();
        cy.get("input").type(2);
        cy.contains("done").click();
        cy.contains("continue").click();
        cy.contains("done").click();
        cy.wait("@authenticate");
        cy
          .get(".top-message-body")
          .contains("Account name already exists in this currency")
          .get(".top-message-title")
          .contains("Error 236");


        // After logout we should get a message
        cy.contains("view profile").click({ force: true });
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
