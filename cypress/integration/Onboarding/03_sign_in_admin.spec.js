const orga_name = Cypress.env("workspace");
context("Onboarding Part 3", () => {
  let polyfill;
  before(() => {
    const polyfillUrl = Cypress.env('polyfillUrl');
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body;
    });
  });
  it("should sign in scheme with admins", () => {
    cy.server();
    cy
      .route("post", `${Cypress.env('api_server2')}/${orga_name}/onboarding/next`)
      .as("next");
    cy
      .route(
        "post",
        `${Cypress.env('api_server2')}/${orga_name}/onboarding/authenticate`
      )
      .as("authenticate");
    cy
      .route("get", `${Cypress.env('api_server2')}/${orga_name}/onboarding/challenge`)
      .as("challenge");
    cy
      .request("POST", Cypress.env('api_switch_device'), {
        device_number: 4
      })
      cy.visit(Cypress.env('api_server'), {
        onBeforeLoad: win => {
          win.fetch = null;
          win.eval(polyfill);
          win.fetch = win.unfetch;
        }
      })
      .then(() => {
        cy.get("input").type(orga_name);
        cy.contains("continue").click();
        cy.wait(1000)
        cy.get(".test-onboarding-signin").click();
        cy.wait("@authenticate");

        //Try to sign in with the same device
        cy.get(".test-onboarding-signin").click();
      //  cy.wait("@authenticate");
        // Should Display Error
        cy
          .get(".top-message-body")
          .contains("This device has already been authenticated")
          .get(".top-message-title")
          .contains("Error");
        cy
          .request("POST", Cypress.env('api_switch_device'), {
            device_number: 5
          })
        cy.get(".test-onboarding-signin").click();
        cy.wait("@authenticate");
        cy
          .request("POST", Cypress.env('api_switch_device'), {
            device_number: 6
          })
        cy.get(".test-onboarding-signin").click();
        cy.wait("@authenticate");
        cy.contains("continue").click();
        cy.wait("@next");

        cy.contains("continue").click();
        cy.wait("@next");

        cy.contains("continue").click();
        cy.wait("@next");

        cy.contains("continue").click();
        cy.wait("@next");
        cy.wait("@challenge");
      });
  });
});
