const orga_name = Cypress.env("workspace");
context("Onboarding Part 4", () => {
  let polyfill;
  before(() => {
    const polyfillUrl = Cypress.env('polyfillUrl');
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body;
    });
  });

it("should initialize Master Seed scheme and login to the dashboard", () => {
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
      device_number: 7
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
      cy
        .get(".test-onboarding-seed")
        .eq(0)
        .click();

      cy.wait("@authenticate");
      cy
        .request("POST", Cypress.env('api_switch_device'), {
          device_number: 8
        })
          cy
            .get(".test-onboarding-seed")
            .eq(0)
            .click();
      cy.wait("@authenticate");
      cy
        .request("POST", Cypress.env('api_switch_device'), {
          device_number: 9
        })
      cy
        .get(".test-onboarding-seed")
        .eq(0)
        .click();
      cy.wait("@authenticate");
      cy.contains("continue").click();
      cy.contains("3 Wrapping Keys Custodians").should('be.visible');
      cy.contains("3 shared owners").should('be.visible');
      cy.contains("3 Administrators").should('be.visible');
      cy.contains("2/3 administration scheme").should('be.visible');

      cy.wait("@next");
      cy
        .request("POST", Cypress.env('api_switch_device'), {
          device_number: 4
        })
        cy.contains("continue").click();
        cy.url().should('include', '/dashboard')
    });
  });
});
