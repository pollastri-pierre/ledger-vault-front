const orga_name = Cypress.env("workspace");
context("Admin Approve the registration of the Shared Owners", () => {
  let polyfill;
  before(() => {
    const polyfillUrl = Cypress.env("polyfillUrl");
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body;
    });
  });
  it("should sign in with all the admin to approve the Shared Owners", () => {
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
        // First Admin sign in
        cy.get(".test-onboarding-signin").click();
        cy.wait("@authenticate");

        //Try to sign in with the same device, Should Display Error
        cy.get(".test-onboarding-signin").click();
        cy
          .get(".top-message-body")
          .contains(
            "This admin already validated the partition, please une another one"
          )
          .get(".top-message-title")
          .contains("Error");

        // Second Admin sign in
        cy.request("POST", Cypress.env("api_switch_device"), {
          device_number: 5
        });

        cy.get(".test-onboarding-signin").click();
        cy.wait("@authenticate");
        cy.wait(1000);
        //Try to sign in with the WPK device
        cy.request("POST", Cypress.env("api_switch_device"), {
            device_number: 1
        });
        cy.get(".test-onboarding-signin").click();
        cy
          .get(".top-message-body")
          .contains(
            "Please connect an Administrator device"
          )
          .get(".top-message-title")
          .contains("Error");
        cy.wait(1000);
        // Thrid Admin sign in
        cy.request("POST", Cypress.env("api_switch_device"), {
          device_number: 6
        });
        cy.get(".test-onboarding-signin").click();
        cy.wait("@authenticate");
        cy.contains("continue").click();
        cy.wait("@next");
      });
  });
});
