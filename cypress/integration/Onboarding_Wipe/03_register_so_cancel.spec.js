const orga_name = Cypress.env("workspace");
context("Registration Shared Owners", () => {
  let polyfill;
  before(() => {
    const polyfillUrl = Cypress.env("polyfillUrl");
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body;
    });
  });
  it("should add 3 Shared Owners with one cancel", () => {
    cy.server();
    cy.route(
      "post",
      `${Cypress.env("api_server2")}/${orga_name}/onboarding/next`,
    ).as("next");
    cy.route(
      "post",
      `${Cypress.env("api_server2")}/${orga_name}/onboarding/authenticate`,
    ).as("authenticate");
    cy.route(
      "get",
      `${Cypress.env("api_server2")}/${orga_name}/onboarding/challenge`,
    ).as("challenge");

    cy.request("POST", Cypress.env("api_switch_device"), {
      device_number: 7,
    });
    cy.visit(Cypress.env("api_server"), {
      onBeforeLoad: win => {
        win.fetch = null;
        win.eval(polyfill);
        win.fetch = win.unfetch;
      },
    }).then(() => {
      cy.get("input[type=text]").type(orga_name);
      cy.get("[data-test=continue_button]").click();
      cy.wait(1000);

      cy.get("[data-test=dialog-button]")
        .eq(1)
        .click();
      cy.wait("@next");
      cy.get("[data-test=dialog-button]")
        .eq(1)
        .click();
      cy.wait("@next");
      cy.get("[data-test=dialog-button]")
        .eq(1)
        .click();
      cy.wait("@next");

      // Shared Owner 1
      cy.contains("Add shared-owner").click();
      cy.wait("@authenticate");

      // Shared Owner 2
      cy.request("POST", Cypress.env("api_switch_device"), {
        device_number: 8,
      });
      /*  // Cancel the approval
      cy.request("POST", Cypress.env("approve_cancel_device"), {
        approve: false,
      });
      cy.contains("Add shared-owner").click();
*/
      // approval
      cy.request("POST", Cypress.env("approve_cancel_device"), {
        approve: true,
      });
      cy.contains("Add shared-owner").click();
      cy.wait("@authenticate");

      // Shared Owner 3
      cy.request("POST", Cypress.env("api_switch_device"), {
        device_number: 9,
      });
      cy.contains("Add shared-owner").click();
      cy.wait("@authenticate");

      cy.get("[data-test=dialog-button]")
        .eq(1)
        .click();
      cy.wait("@next");
    });
  });
});
