const orga_name = Cypress.env("workspace");
context("Operation Abort", () => {
  let polyfill;
  before(() => {
    const polyfillUrl = Cypress.env('polyfillUrl');
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body;
    });
  });
  it("should abort a operation", () => {
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
    cy.route("post", "**/abort").as("abort");
    cy.route("post", "**/validation/**").as("validation");
    cy.route("post", "**/fees").as("fees");
    cy.route("get", "**/pending").as("pending");


    cy
      .request("POST", Cypress.env("api_switch_device"), {
        device_number: 4
      })
      .then(() => {
    // Create operation by Device 4 User1
        cy.get("input").type(orga_name);
        cy.contains("continue").click();
        cy.wait("@authenticate");
        cy.get("[data-test=new-operation]").click();
        cy
          .get("[data-test=operation-creation-accounts]")
          .contains('BTC Testnet')
          .click({ force: true });

        cy.get("[data-test=unit-select]").click();
        cy
          .get("[data-test=unit-select-values]")
          .eq(2)
          .debug()
          .click({ force: true });
        cy
          .get("[data-test=crypto-address-picker]")
          .find("input")
          .type("mwhxcyyJQCJouNUw1UG1tJP7YEb7uEki6a");
        cy
          .get("[data-test=operation-creation-amount]")
          .find("input")
          .type("10");

        cy.wait("@fees");
        cy.contains("Continue").click();
        cy.contains("Continue").click();
        cy
          .get("[data-test=dialog-button]")
          .contains("Confirm")
          .click({ force: true });
        cy.wait("@authenticate");

        cy.get("[data-test=view-profile]").click();
        cy.get("[data-test=logout]").click();
        cy.wait("@logout");
    });
    // Device 5 is on read only, we should get a error
    cy
      .request("POST", Cypress.env("api_switch_device"), {
        device_number: 6
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
          .get("[data-test=pending-operation]")
          .eq(0)
          .click();
        cy.wait("@pending");
        cy
          .get("[data-test=dialog-button]")
          .contains("Abort")
          .click({ force: true });
        cy
          .get("button")
          .contains("Abort")
          .click({ force: true });
        cy
          .get(".top-message-body")
          .contains("This person is not a member of this account")
          .get(".top-message-title")
          .contains("Error 205");
        cy.wait("@abort");

        cy.contains("view profile").click();
        cy.contains("logout").click();
        cy.wait("@logout");
        cy
          .get(".top-message-body")
          .contains("You have been successfully logged out. You can now safely close your web browser.")
          .get(".top-message-title")
          .contains("See you soon!");

        cy
          .request("POST", Cypress.env("api_switch_device"), {
            device_number: 5
          })
        cy.get("input").type(orga_name);
        cy.contains("continue").click();
        cy.wait("@authenticate");
        cy.contains("Pending").click();
        cy
          .get("[data-test=pending-operation]")
          .eq(0)
          .click();
        cy
          .get("[data-test=dialog-button]")
          .contains("Abort")
          .click();
        cy
          .get("button")
          .contains("Abort")
          .click();
        cy
          .get(".top-message-body")
          .contains("the operation request has been successfully aborted")
          .get(".top-message-title")
          .contains("operation request aborted");
        cy.wait("@abort");
        // logout
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
