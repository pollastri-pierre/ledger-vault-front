import {route } from '../../functions/actions.js';
const orga_name = Cypress.env("workspace");
const API = `${Cypress.env("api_server2")}/${orga_name}`;
const DEVICE = Cypress.env("api_switch_device");

context("Registration Shared Owners", () => {
  let polyfill;

  before(() => {
    const polyfillUrl = Cypress.env("polyfillUrl");
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body;
    });
  });

  it("should add 3 Shared Owners", () => {
    cy.server();
    route();

    cy.visit(Cypress.env("api_server"), {
      onBeforeLoad: win => {
        win.fetch = null;
        win.eval(polyfill);
        win.fetch = win.unfetch;
      }
    });

    cy.request("POST", DEVICE, { device_number: 7 }).then(() => {
      cy.get("input").type(orga_name);
      cy.contains("Continue").click();
      cy.wait(1000);

      cy.contains("Continue").click();
      cy.wait("@next");
      cy.contains("Continue").click();
      cy.wait("@next");
      cy.contains("Continue").click();
      cy.wait("@next");

      // Shared Owner 1
      cy.contains("Add shared-owner").click();
      cy.wait("@authenticate");

      // Shared Owner 2
      cy.request("POST", DEVICE, { device_number: 8 }).then(() => {
        cy.contains("Add shared-owner").click();
        cy.wait("@authenticate");

        // Shared Owner 3
        cy.request("POST", DEVICE, { device_number: 9 }).then(() => {
          cy.contains("Add shared-owner").click();
          cy.wait("@authenticate");

          cy.contains("Continue").click();
          cy.wait("@next");
        });
      });
    });
  });
});
