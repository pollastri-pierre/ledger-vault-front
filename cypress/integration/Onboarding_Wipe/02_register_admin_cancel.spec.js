const orga_name = Cypress.env("workspace");
context("Register the Administrators", () => {
  let polyfill;
  before(() => {
    const polyfillUrl = Cypress.env("polyfillUrl");
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body;
    });
  });
  it("should register admins and define security scheme with one cancel", () => {
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
      "get",
      `${Cypress.env("api_server2")}/${orga_name}/onboarding/challenge`
    ).as("challenge");

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
      cy.get("input[type=text]").type(orga_name);
      cy.contains("continue").click();
      cy.wait(1000);

      // Register Admin 1
      cy.contains("add administrator").click();
      cy.get("input[name=username]").type("user1");
      cy.get("input[name=email]").type("user1@user.com");
      cy.contains("Continue").click();
      cy.wait("@authenticate");

      cy.request("POST", Cypress.env("api_switch_device"), {
        device_number: 5
      });
      // Cancel the approval
      cy.request("POST", Cypress.env("approve_cancel_device"), {
        approve: false
      });
      cy.contains("add administrator").click();
      cy.get("input[name=username]").type("user2");
      cy.get("input[name=email]").type("user2@ledger.fr");
      cy.contains("Continue").click();

      // Approve the registration
      cy.request("POST", Cypress.env("approve_cancel_device"), {
        approve: true
      });
      cy.contains("add administrator").click();
      cy.get("input[name=username]").type("user2");
      cy.get("input[name=email]").type("user2@ledger.fr");
      cy.contains("Continue").click();
      cy.wait("@authenticate");

      cy.request("POST", Cypress.env("api_switch_device"), {
        device_number: 6
      });
      cy.contains("add administrator").click();
      cy.get("input[name=username]").type("user3");
      cy.get("input[name=email]").type("user3@ledger.fr");
      cy.contains("Continue").click();
      cy.wait("@authenticate");

      cy.contains("continue").click();
      cy.wait("@next");
      cy.contains("more").click();
      cy.contains("more").click();
      cy.contains("more").click();
      cy.contains("less").click();
      cy.contains("continue").click();
      cy.wait("@next");
      cy.wait("@challenge");
    });
  });
});
