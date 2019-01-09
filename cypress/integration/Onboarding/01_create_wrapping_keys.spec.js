const orga_name = Cypress.env("workspace");
context("Create Wrapping Key", () => {
  let polyfill;
  before(() => {
    const polyfillUrl = Cypress.env("polyfillUrl");
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body;
    });
  });
  it("should initialise the 3 Wrapping Key Custodians", () => {
    cy.server();
    cy.route(
      "post",
      `${Cypress.env("api_server2")}/${orga_name}/onboarding/next`
    ).as("next");
    cy.route(
      "post",
      `${Cypress.env("api_server2")}/${orga_name}/onboarding/authenticate`
    ).as("authenticate");
    cy.route(
      "post",
      `${Cypress.env("api_server2")}/${orga_name}/onboarding/challenge`
    ).as("challenge");
    cy.visit(Cypress.env("api_server"), {
      onBeforeLoad: win => {
        win.fetch = null;
        win.eval(polyfill);
        win.fetch = win.unfetch;
      }
    });

    cy.request("POST", Cypress.env("api_switch_device"), {
      device_number: 1
    }).then(() => {
      cy.get("input").type(orga_name);
      cy.contains("Continue").click();
      cy.wait(1000);
      cy.contains("Welcome").should("be.visible");
      cy.contains("Get Started").click();
      cy.wait("@next");
      cy.contains("Continue").click();
      cy.wait("@next");
      cy.contains("Continue").click();
      cy.wait("@next");
      cy.contains("Continue").click();
      cy.wait("@next");
      cy.wait("@challenge");
      //First WPK
      cy.get(":nth-child(1) > .fragment").click();
      cy.wait("@authenticate");

      // Using the same device, should display a error
      cy.get(":nth-child(2) > .fragment").click();
      cy.get(".top-message-body")
        .contains("Person already exists")
        .get(".top-message-title")
        .contains("Error");

      // Second WPK
      cy.request("POST", Cypress.env("api_switch_device"), {
        device_number: 2
      });
      cy.get(":nth-child(2) > .fragment").click();
      cy.wait("@authenticate");
      cy.wait(1000);

      // Third WPK
      cy.request("POST", Cypress.env("api_switch_device"), {
        device_number: 3
      });
      cy.get(":nth-child(3) > .fragment").click();
      cy.wait("@authenticate");
      cy.contains("Continue").click();
      cy.wait("@next");
      cy.contains("Continue")
        .debug()
        .click();
      cy.wait("@next");
      cy.contains("Continue")
        .debug()
        .click();
      cy.wait("@next");
    });
  });
});
