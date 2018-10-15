const orga_name = Cypress.env("workspace");
context("Onboarding", () => {
  let polyfill;
  before(() => {
    const polyfillUrl = Cypress.env('polyfillUrl');
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body;
    });
  });

  it("should initialise the wrapping keys ", () => {
    cy.server();
    cy
      .route("post", `${Cypress.env('api_server2')}/${orga_name}/onboarding/next`)
      .as("next");
    cy
      .route(
        "post",
        `${Cypress.env('api_server2')}/${orga_name}/onboarding/authenticate`
      )
      .as("authenticate");
    cy
      .route("get", `${Cypress.env('api_server2')}/${orga_name}/onboarding/challenge`)
      .as("challenge");
    cy.visit(Cypress.env('api_server'), {
      onBeforeLoad: win => {
        win.fetch = null;
        win.eval(polyfill);
        win.fetch = win.unfetch;
      }
    });
    cy.get("input").type(orga_name);
    cy.contains("continue").click();

    cy.wait(1000);

    cy.contains("Get Started").click();
    cy.wait("@next");
    cy.contains("continue").click();
    cy.wait("@next");
    cy.contains("continue").click();
    cy.wait("@next");
    cy.contains("continue").click();
    cy.wait("@next");
    cy.wait("@challenge");
    cy
      .request("POST", Cypress.env('api_switch_device'), {
        device_number: 1
      })
      .then(() => {
        cy.contains("SIGN IN").click();
        cy.wait("@authenticate");
        cy
          .request("POST", Cypress.env('api_switch_device'), {
            device_number: 2
          })
          .then(() => {
            cy.contains("SIGN IN").click();
            cy.wait("@authenticate");
            cy
              .request("POST", Cypress.env('api_switch_device'), {
                device_number: 3
              })
              .then(() => {
                cy.contains("SIGN IN").click();
                cy.wait("@authenticate");
                cy.contains("continue").click();
                cy.wait("@next");
              });
          });
      });
  });

  it("should initialise admins and define security scheme", () => {
    cy.server();
    cy
      .route("post", `${Cypress.env('api_server2')}/${orga_name}/onboarding/next`)
      .as("next");
    cy
      .route(
        "post",
        `${Cypress.env('api_server2')}/${orga_name}/onboarding/authenticate`
      )
      .as("authenticate");
    cy
      .route("get", `${Cypress.env('api_server2')}/${orga_name}/onboarding/challenge`)
      .as("challenge");
    cy
      .contains("continue")
      .debug()
      .click();
    cy.wait("@next");
    cy
      .contains("continue")
      .debug()
      .click();
    cy.wait("@next");
    cy.wait("@challenge");
    cy
      .request("POST", Cypress.env('api_switch_device'), {
        device_number: 4
      })
      .then(() => {
        cy.contains("add administrator").click();
        cy.get("input[name=first_name]").type("user1");
        cy.get("input[name=last_name]").type("user1");
        cy.get("input[name=email]").type("user1@user.com");
        cy.contains("Continue").click();
        cy.wait("@authenticate");
        cy
          .request("POST", Cypress.env('api_switch_device'), {
            device_number: 5
          })
          .then(() => {
            cy.contains("add administrator").click();
            cy.get("input[name=first_name]").type("user2");
            cy.get("input[name=last_name]").type("user2");
            cy.get("input[name=email]").type("user2@ledger.fr");
            cy.contains("Continue").click();
            cy.wait("@authenticate");
            cy
              .request("POST", Cypress.env('api_switch_device'), {
                device_number: 6
              })
              .then(() => {
                cy.contains("add administrator").click();
                cy.get("input[name=first_name]").type("user3");
                cy.get("input[name=last_name]").type("user3");
                cy.get("input[name=email]").type("user3@ledger.fr");
                cy.contains("Continue").click();
                cy.wait("@authenticate");

                cy.contains("continue").click();
                cy.wait("@next");
                cy.contains("more").click();
                cy.contains("more").click();
                cy.contains("more").click();
                cy.contains("less").click();
              });
          });
      });
  });

  it("should sign in scheme with admins", () => {
    cy.server();
    cy
      .route("post", `${Cypress.env('api_server2')}/${orga_name}/onboarding/next`)
      .as("next");
    cy
      .route(
        "post",
        `${Cypress.env('api_server2')}/${orga_name}/onboarding/authenticate`
      )
      .as("authenticate");
    cy
      .route("get", `${Cypress.env('api_server2')}/${orga_name}/onboarding/challenge`)
      .as("challenge");
    cy.contains("continue").click();
    cy.wait("@next");
    cy.wait("@challenge");
    cy
      .request("POST", Cypress.env('api_switch_device'), {
        device_number: 4
      })
      .then(() => {
        cy.get(".test-onboarding-signin").click();
        cy.wait("@authenticate");
        cy
          .request("POST", Cypress.env('api_switch_device'), {
            device_number: 5
          })
          .then(() => {
            cy.get(".test-onboarding-signin").click();
            cy.wait("@authenticate");
            cy
              .request("POST", Cypress.env('api_switch_device'), {
                device_number: 6
              })
              .then(() => {
                cy.get(".test-onboarding-signin").click();
                cy.wait("@authenticate");
                cy.contains("continue").click();
                cy.wait("@next");

                cy.contains("continue").click();
                cy.wait("@next");

                cy.contains("continue").click();
                cy.wait("@next");
              });
          });
      });
  });

  it("should initialize Master Seed scheme and login to the dashboard", () => {
    cy.server();
    cy
      .route("post", `${Cypress.env('api_server2')}/${orga_name}/onboarding/next`)
      .as("next");
    cy
      .route(
        "post",
        `${Cypress.env('api_server2')}/${orga_name}/onboarding/authenticate`
      )
      .as("authenticate");
    cy
      .route("get", `${Cypress.env('api_server2')}/${orga_name}/onboarding/challenge`)
      .as("challenge");

    cy.contains("continue").click();
    cy.wait("@next");
    cy.wait("@challenge");
    cy
      .request("POST", Cypress.env('api_switch_device'), {
        device_number: 7
      })
      .then(() => {
        cy
          .get(".test-onboarding-seed")
          .eq(0)
          .click();

        cy.wait("@authenticate");
        cy
          .request("POST", Cypress.env('api_switch_device'), {
            device_number: 8
          })
          .then(() => {
            cy
              .get(".test-onboarding-seed")
              .eq(0)
              .click();

            cy.wait("@authenticate");
            cy
              .request("POST", Cypress.env('api_switch_device'), {
                device_number: 9
              })
              .then(() => {
                cy
                  .get(".test-onboarding-seed")
                  .eq(0)
                  .click();
                cy.wait("@authenticate");
                cy.contains("continue").click();
                cy.wait("@next");
                cy
                  .request("POST", Cypress.env('api_switch_device'), {
                    device_number: 4
                  })
                  .then(() => {
                    cy.contains("continue").click();
                    cy.url().should('include', '/dashboard')
                  });
              });
          });
      });
  });
});
