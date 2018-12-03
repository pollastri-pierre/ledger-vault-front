const orga_name = Cypress.env("workspace");
context("Admin Approve the registration of the Shared Owners", () => {
  let polyfill;
  before(() => {
    const polyfillUrl = Cypress.env("polyfillUrl");
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body;
    });
  });
  it("should create a wipe and redirect you to admin registration", () => {
    cy.server();
    cy
      .route(
        "post",
        `${Cypress.env("api_server2")}/${orga_name}/onboarding/next`
      )
      .as("next");
    cy
      .route(
        "post",
        `${Cypress.env("api_server2")}/${orga_name}/onboarding/authenticate`
      )
      .as("authenticate");
    cy
      .route(
        "get",
        `${Cypress.env("api_server2")}/${orga_name}/onboarding/challenge`
      )
      .as("challenge");
    cy.request("POST", Cypress.env("api_switch_device"), {
      device_number: 4
    });
    cy
      .visit(Cypress.env("api_server"), {
        onBeforeLoad: win => {
          win.fetch = null;
          win.eval(polyfill);
          win.fetch = win.unfetch;
        }
      })
      .then(() => {
        cy.get("input").type(orga_name);
        cy.contains("continue").click();
        cy.wait(1000);
        cy.get(".test-onboarding-signin").click();
        cy.wait("@authenticate");

        cy.request("POST", Cypress.env("api_switch_device"), {
          device_number: 5
        });

        // Cancel on the device
        cy.request("POST", Cypress.env("approve_cancel_device"), {
          approve: false
        });
        cy.get(".test-onboarding-signin").click();
        cy
          .contains("Shared-Owners registration confirmation")
          .should("be.visible");
        //  Choose the first option go back
        cy
          .contains("Oops! you clicked by mistake...")
          .click()
        cy.contains("Go back").click();

        // choose to register shared owner again
        cy.request("POST", Cypress.env("approve_cancel_device"), {
          approve: false
        });
        cy.get(".test-onboarding-signin").click();
        cy
          .contains("You've made a mistake when registering ")
          .click();
        cy.contains("Register Shared-Owners again").click();
        //
        cy.contains("Prerequisites").should("be.visible");
        cy.contains("continue").click();
        cy.wait("@next");
        cy.contains("continue").click();
        cy.wait("@next");

      });
  });
});
