const orga_name = Cypress.env("workspace");
const API = `${Cypress.env("api_server2")}/${orga_name}`;
const DEVICE = Cypress.env("api_switch_device");
const API_DEVICE = Cypress.env("api_device");

import { route } from "../../functions/actions.js";

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
    route();
    cy.visit(Cypress.env("api_server"), {
      onBeforeLoad: win => {
        win.fetch = null;
        win.eval(polyfill);
        win.fetch = win.unfetch;
      }
    }).then(() => {
      cy.request("POST", DEVICE, {
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
        cy.get(".fragment")
          .eq(0)
          .find(".fragment-click")
          .click();
        cy.wait("@get-public-key");
        cy.wait("@get-attestation");
        cy.wait("@open-session");
        cy.wait("@generate-key-fragments");
        cy.wait("@authenticate");

        // Using the same device, should display a error
        cy.get(".fragment")
          .eq(1)
          .find(".fragment-click")
          .click();
        cy.get(".top-message-body")
          .contains("Person already exists")
          .get(".top-message-title")
          .contains("Error");

        // Second WPK
        cy.request("POST", DEVICE, {
          device_number: 2
        }).then(() => {
          cy.get(".fragment")
            .eq(1)
            .find(".fragment-click")
            .click();

          cy.wait("@get-public-key");
          cy.wait("@get-attestation");
          cy.wait("@open-session");
          cy.wait("@generate-key-fragments");
          cy.wait("@authenticate");
          cy.wait(1000);

          // Third WPK
          cy.request("POST", DEVICE, {
            device_number: 3
          }).then(() => {
            cy.get(".fragment")
              .eq(2)
              .find(".fragment-click")
              .click();
            cy.wait("@get-public-key");
            cy.wait("@get-attestation");
            cy.wait("@open-session");
            cy.wait("@generate-key-fragments");
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
    });
  });
});
