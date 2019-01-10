const orga_name = Cypress.env("workspace");
const API = `${Cypress.env("api_server2")}/${orga_name}`;
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
    cy.route("post", `${API}/onboarding/next`).as("next");
    cy.route("post", `${API}/onboarding/authenticate`).as("authenticate");
    cy.route("get", `${API}/onboarding/challenge`).as("challenge");

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
        cy.get("input").type(orga_name);
        cy.contains("Continue").click();
        cy.wait(1000);
        // First Admin
        cy.contains("add administrator").click();
        cy.get("input[name=username]").type("user1");
        cy.get("input[name=email]").type("user1@user.com");
        cy.get("[role=dialog] [data-test=dialog-button]")
          .contains("Continue")
          .click();
        cy.wait("@authenticate");

        //Edit the First Admin
        cy.contains("Click to edit").click();
        cy.get("input[name=email]").clear();
        cy.get("input[name=email]").type("user1_edit@user.com");
        cy.contains("save").click();

        // Try to register with the same device
        cy.contains("add administrator").click();
        cy.get("input[name=username]").type("user1");
        cy.get("input[name=email]").type("user1@user.com");
        cy.get("[role=dialog] [data-test=dialog-button]")
          .contains("Continue")
          .click();
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
