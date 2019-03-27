import { route } from "../../functions/actions";

const orga_name = Cypress.env("workspace");
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
      },
    });

    cy.request("POST", DEVICE, { device_number: 7 }).then(() => {
      cy.get("input[type=text]").type(orga_name);
      cy.contains("Continue").click();
      cy.wait(1000);

      cy.contains("Continue").click();
      cy.wait("@next");
      cy.contains("Continue").click();
      cy.wait("@next");
      cy.contains("Continue").click();
      cy.wait("@next");
      cy.wait("@challenge");

      // Shared Owner 1
      cy.contains("Add shared-owner").click();
      cy.wait("@get-public-key");
      cy.wait("@get-attestation");
      cy.wait("@register");
      cy.wait("@authenticate");

      // Use the same device, Should display a error
      cy.contains("Add shared-owner").click();
      cy.wait("@get-public-key");
      cy.wait("@get-attestation");
      cy.wait("@register");
      cy.wait("@authenticate");
      cy.get(".top-message-body")
        .contains("Person already exists")
        .get(".top-message-title")
        .contains("Error");

      // Shared Owner 2
      cy.request("POST", DEVICE, { device_number: 8 }).then(() => {
        cy.contains("Add shared-owner").click();
        cy.wait("@get-public-key");
        cy.wait("@get-attestation");
        cy.wait("@register");
        cy.wait("@authenticate");

        // Shared Owner 3
        cy.request("POST", DEVICE, { device_number: 9 }).then(() => {
          cy.contains("Add shared-owner").click();
          cy.wait("@get-public-key");
          cy.wait("@get-attestation");
          cy.wait("@register");
          cy.wait("@authenticate");

          cy.contains("Continue").click();
          cy.wait("@next");
        });
      });
    });
  });
});
