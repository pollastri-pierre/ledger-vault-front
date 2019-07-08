import { route } from "../../functions/actions";

const orga_name = Cypress.env("workspace");
context("Create Wrapping Key", () => {
  let polyfill;
  before(() => {
    const polyfillUrl = Cypress.env("polyfillUrl");
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body;
    });
  });
  it("should initialise the 3 Wrapping Key Custodians with one cancel", () => {
    cy.server();
    route();
    cy.visit(Cypress.env("api_server"), {
      onBeforeLoad: win => {
        win.fetch = null;
        win.eval(polyfill);
        win.fetch = win.unfetch;
      },
    });

    cy.request("POST", Cypress.env("api_switch_device"), {
      device_number: 1,
    }).then(() => {
      cy.get("input[type=text]").type(orga_name);
      cy.get("[data-test=continue_button]").click();
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

      cy.get(".fragment")
        .eq(0)
        .click();
      cy.wait("@get-public-key");
      cy.wait("@get-attestation");
      cy.wait("@open-session");
      cy.wait("@generate-key-fragments");
      cy.wait("@authenticate");

      cy.request("POST", Cypress.env("api_switch_device"), {
        device_number: 2,
      }).then(() => {
        cy.get(".fragment")
          .eq(1)
          .click();
        cy.wait("@get-public-key");
        cy.wait("@get-attestation");
        cy.wait("@open-session");
        cy.wait("@generate-key-fragments");
        cy.wait("@authenticate");

        cy.request("POST", Cypress.env("api_switch_device"), {
          device_number: 3,
        }).then(() => {
          /*    // Cancel the approval
          cy.request("POST", Cypress.env("approve_cancel_device"), {
            approve: false,
          });
          cy.get(".fragment")
            .eq(2)
            .click();
          cy.wait("@get-public-key");
          cy.wait("@get-attestation");
          cy.wait("@open-session");
          cy.wait("@generate-key-fragments");

          */

          // Do the last WPK
          cy.get(".fragment")
            .eq(2)
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
