const orga_name = Cypress.env("workspace");
context("Use Wrong Device for Account", () => {
  let polyfill;
  before(() => {
    const polyfillUrl = Cypress.env('polyfillUrl');
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body;
    });
  });
  it("should fail with wrong device", () => {
    cy.visit(Cypress.env('api_server'), {
      onBeforeLoad: win => {
        win.fetch = null;
        win.eval(polyfill);
        win.fetch = win.unfetch;
      }
    });
    cy.server();
    cy.route("post", "**/authentications/**").as("authenticate");
    cy.route("post", "**/abort").as("abort");
    cy.route("post", "**/logout").as("logout");
    cy.route("get", "**/dashboard").as("dashboard");

    cy
      .request("POST", Cypress.env('api_switch_device'), {
        device_number: 5
      })
      // Login with a wrong workspace name
      .then(() => {
        cy.get("input").type("fakeorga");
        cy.contains("continue").click();
        cy
          .get(".top-message-body")
          .contains("Unknown organization domain name")
          .get(".top-message-title")
          .contains("Error");
      })
      // Login with a wrong device
      .then(() => {
        cy
          .request("POST", Cypress.env('api_switch_device'), {
            device_number: 2
          })
        cy.get("input").clear();
        cy.get("input").type(Cypress.env("workspace"));
        cy.contains("continue").click();
        cy
          .get(".top-message-body")
          .contains("network error")
          .get(".top-message-title")
          .contains("Failed to authenticate");
        })
        cy.contains("cancel").click();
        cy
          .request("POST", Cypress.env('api_switch_device'), {
            device_number: 5
          })
        // Create a account with a wrong device
        .then(() => {

          cy.get("input").clear();
          cy.get("input").type(orga_name);
          cy.contains("continue").click();
          cy.wait("@authenticate");
            //We should get a Welcome blue message
          cy
            .get(".top-message-body")
            .contains("Welcome to the Ledger Vault platform!")
            .get(".top-message-title")
            .contains("Hello");
          cy
            .request("POST", Cypress.env('api_switch_device'), {
              device_number: 2
            })
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
            cy.get("input").type(1);
            cy.contains("done").click();
            cy.contains("continue").click();
            cy.contains("done").click();
            cy
              .get(".top-message-body")
              .contains("Person does not exist")
              .get(".top-message-title")
              .contains("Error 701");
        });
    });
});
