const orga_name = Cypress.env("workspace");

import { route } from "../../functions/actions.js";

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
    route();
    cy.request("POST", Cypress.env("api_switch_device"), {
      device_number: 4
    });
    cy.visit(Cypress.env("api_server"), {
      onBeforeLoad: win => {
        win.fetch = null;
        win.eval(polyfill);
        win.fetch = win.unfetch;
      }
    }).then(() => {
      cy.get("input").type(orga_name);
      cy.contains("Continue").click();
      cy.wait(1000);

      // First Admin sign in
      cy.get(".test-onboarding-signin").click();
      cy.wait("@get-public-key");
      cy.wait("@open-session");
      cy.wait("@validate-vault-operation");
      cy.wait("@authenticate");

      //Try to sign in with the same device, Should Display Error
      cy.get(".test-onboarding-signin").click();
      cy.wait("@authenticate");
      cy.get(".top-message-body")
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
      cy.wait("@get-public-key");
      cy.wait("@open-session");
      cy.wait("@validate-vault-operation");
      cy.wait("@authenticate");

      // finish
      cy.contains("Continue").click();
      cy.wait("@next");
    });
  });
});
