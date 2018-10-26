const orga_name = Cypress.env("workspace");
context("Onboarding Part 1", () => {
  let polyfill;
  before(() => {
    const polyfillUrl = Cypress.env('polyfillUrl');
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body;
    });
  });
  it("should initialise the wrapping keys ", () => {
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
    cy.visit(Cypress.env('api_server'), {
      onBeforeLoad: win => {
        win.fetch = null;
        win.eval(polyfill);
        win.fetch = win.unfetch;
      }
    });

    cy
      .request("POST", Cypress.env('api_switch_device'), {
        device_number: 1
      })
      .then(() => {
        cy.get("input").type(orga_name);
        cy.contains("continue").click();
        cy.wait(1000)
        cy.contains("Welcome").should('be.visible');
        cy.contains("Get Started").click();
        cy.wait("@next");
        cy.contains("continue").click();
        cy.wait("@next");
        cy.contains("continue").click();
        cy.wait("@next");
        cy.contains("continue").click();
        cy.wait("@next");
        cy.wait("@challenge");
        cy.contains("SIGN IN").click();
        cy.wait("@authenticate");
        cy
          .request("POST", Cypress.env('api_switch_device'), {
            device_number: 2
          })
        cy.contains("SIGN IN").click();
        cy.wait("@authenticate");
        cy
            .request("POST", Cypress.env('api_switch_device'), {
              device_number: 3
        })
        cy.contains("SIGN IN").click();
        cy.wait("@authenticate");
        cy.contains("continue").click();
        cy.wait("@next");
        cy
          .contains("continue")
          .debug()
          .click();
        cy.wait("@next");
        cy
          .contains("continue")
          .debug()
          .click();
        cy.wait("@next");
        cy.wait("@challenge");
    });
 });
});
