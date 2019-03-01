const orga_name = Cypress.env("workspace");
const API = `${Cypress.env("api_server2")}/${orga_name}`;
const DEVICE = Cypress.env("api_switch_device");
const API_DEVICE = Cypress.env("api_device");

import { route } from "../../functions/actions.js";

context("Register the Administrators", () => {
  let polyfill;
  before(() => {
    const polyfillUrl = Cypress.env("polyfillUrl");
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body;
    });
  });
  it("should register admins and define security scheme", () => {
    cy.server();
    route();

    cy.request("POST", DEVICE, {
      device_number: 4
    }).then(() => {
      cy.visit(Cypress.env("api_server"), {
        onBeforeLoad: win => {
          win.fetch = null;
          win.eval(polyfill);
          win.fetch = win.unfetch;
        }
      }).then(() => {
        cy.get("input[type=text]").type(orga_name);
        cy.contains("Continue").click();
        cy.wait(1000);
        // First Admin
        cy.contains("add administrator").click();
        cy.get("input[name=username]").type("user1");
        cy.get("input[name=email]").type("user1@user.com");
        cy.get("[role=dialog] [data-test=dialog-button]")
          .contains("Continue")
          .click();
        cy.wait("@get-public-key");
        cy.wait("@get-attestation");
        cy.wait("@register");
        cy.wait("@authenticate");

        // Try to register with the same device
        cy.contains("add administrator").click();
        cy.get("input[name=username]").type("user1");
        cy.get("input[name=email]").type("user1@user.com");
        cy.get("[role=dialog] [data-test=dialog-button]")
          .contains("Continue")
          .click();
        cy.wait("@get-public-key");
        cy.wait("@get-attestation");
        cy.wait("@register");
        //Should display a error
        cy.get(".top-message-body")
          .contains("Device already registered")
          .get(".top-message-title")
          .contains("Error");
        // Second Admin
        cy.request("POST", DEVICE, {
          device_number: 5
        }).then(() => {
          cy.contains("add administrator").click();
          cy.get("input[name=username]").type("user2");
          cy.get("input[name=email]").type("user2@ledger.fr");
          cy.get("[role=dialog] [data-test=dialog-button]")
            .contains("Continue")
            .click();
          cy.wait("@get-public-key");
          cy.wait("@get-attestation");
          cy.wait("@register");
          cy.wait("@authenticate");

          // Thrid Admin
          cy.request("POST", DEVICE, {
            device_number: 6
          }).then(() => {
            cy.contains("add administrator").click();
            cy.get("input[name=username]").type("user3");
            cy.get("input[name=email]").type("user3@ledger.fr");
            cy.get("[role=dialog] [data-test=dialog-button]")
              .contains("Continue")
              .click();
            cy.wait("@get-public-key");
            cy.wait("@get-attestation");
            cy.wait("@register");
            cy.wait("@authenticate");

            cy.contains("Continue").click();
            cy.wait("@next");
            cy.contains("more").click();
            cy.contains("more").click();
            cy.contains("more").click();
            cy.contains("less").click();
            cy.contains("Continue").click();
            cy.wait("@next");
          });
        });
        // cy.wait("@challenge");
      });
    });
  });
});
