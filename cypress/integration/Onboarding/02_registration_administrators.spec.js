import { route } from "../../functions/actions";

const orga_name = Cypress.env("workspace");
const DEVICE = Cypress.env("api_switch_device");

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
      device_number: 4,
    }).then(() => {
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
        // First Admin
        cy.contains("add administrator").click();
        cy.get("input[name=username]").type("user1");
        cy.get("[data-test=dialog-button]")
          .contains("Continue")
          .click();
        cy.wait("@get-public-key");
        cy.wait("@get-attestation");
        cy.wait("@challenge");
        cy.wait("@register");
        cy.wait("@register-data");
        cy.wait("@authenticate");

        // Try to register with the same device
        cy.contains("add administrator").click();
        cy.get("input[name=username]").type("user1");
        cy.get("[data-test=dialog-button]")
          .contains("Continue")
          .click();
        cy.wait("@get-public-key");
        cy.wait("@get-attestation");
        cy.wait("@challenge");
        // Should display a error
        cy.wait(1000);

        cy.get("[data-test=error-message-desc]").contains(
          "Administrator already registered with this device",
        );
        cy.get("[data-test=close]").click();

        // Second Admin
        cy.request("POST", DEVICE, {
          device_number: 5,
        }).then(() => {
          cy.get("input[name=username]").clear();
          cy.get("input[name=username]").type("user2");
          cy.get("[data-test=dialog-button]")
            .contains("Continue")
            .click();
          cy.wait("@get-public-key");
          cy.wait("@get-attestation");
          cy.wait("@challenge");
          cy.wait("@register");
          cy.wait("@register-data");
          cy.wait("@authenticate");

          // Thrid Admin
          cy.request("POST", DEVICE, {
            device_number: 6,
          }).then(() => {
            cy.contains("add administrator").click();
            cy.get("input[name=username]").type("user3");
            cy.get("[data-test=dialog-button]")
              .contains("Continue")
              .click();
            cy.wait("@get-public-key");
            cy.wait("@get-attestation");
            cy.wait("@challenge");
            cy.wait("@register");
            cy.wait("@register-data");
            cy.wait("@authenticate");

            cy.contains("Continue").click();
            cy.wait("@next");
            cy.contains("Continue").click();
            cy.wait("@next");
          });
        });
        // cy.wait("@challenge");
      });
    });
  });
});
