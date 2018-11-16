const orga_name = Cypress.env("workspace");
context("Onboarding Part 2", () => {
  let polyfill;
  before(() => {
    const polyfillUrl = Cypress.env("polyfillUrl");
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body;
    });
  });
  it("should initialise admins and define security scheme", () => {
    cy.server();
    cy
      .route(
        "post",
        `${Cypress.env("api_server2")}/${orga_name}/onboarding/next`
      )
      .as("next");
    cy
      .route(
        "post",
        `${Cypress.env("api_server2")}/${orga_name}/onboarding/authenticate`
      )
      .as("authenticate");
    cy
      .route(
        "get",
        `${Cypress.env("api_server2")}/${orga_name}/onboarding/challenge`
      )
      .as("challenge");

    cy.request("POST", Cypress.env("api_switch_device"), {
      device_number: 4
    });
    cy
      .visit(Cypress.env("api_server"), {
        onBeforeLoad: win => {
          win.fetch = null;
          win.eval(polyfill);
          win.fetch = win.unfetch;
        }
      })
      .then(() => {
        cy.get("input").type(orga_name);
        cy.contains("continue").click();
        cy.wait(1000);

        cy.contains("add administrator").click();
        cy.get("input[name=username]").type("user1");
        cy.get("input[name=email]").type("user1@user.com");
        cy.contains("Continue").click();
        cy.wait("@authenticate");
        //Edit the admin
        cy.contains("Click to edit").click();
        cy.get("input[name=email]").clear();
        cy.get("input[name=email]").type("user1_edit@user.com");
        cy.contains("save").click();
        // Try to register with the same device
        cy.contains("add administrator").click();
        cy.get("input[name=username]").type("user1");
        cy.get("input[name=email]").type("user1@user.com");
        cy.contains("Continue").click();
        //Should display a error
        cy
          .get(".top-message-body")
          .contains("Device already registered")
          .get(".top-message-title")
          .contains("Error");

        cy.request("POST", Cypress.env("api_switch_device"), {
          device_number: 5
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
