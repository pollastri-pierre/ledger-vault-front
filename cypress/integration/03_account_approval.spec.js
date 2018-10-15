const orga_name = Cypress.env("workspace");
context("Account approval", () => {
  let polyfill;
  before(() => {
    const polyfillUrl = Cypress.env("polyfillUrl");
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body;
    });
  });
  it("Approve Account", () => {
    // go to the vault homepage
    cy.visit(Cypress.env('api_server'), {
      onBeforeLoad: win => {
        win.fetch = null;
        win.eval(polyfill);
        win.fetch = win.unfetch;
      }
    });
    cy.server();
    cy.route("post", "**/authentications/**").as("authenticate");
    cy.route("post", "**/approve").as("approve");
    cy.route("post", "**/logout").as("logout");
    // set the current device to device 1
    cy
      .request("POST", Cypress.env('api_switch_device'), {
        device_number: 4
      })
      .then(() => {
        cy.get("input").type(orga_name);
        cy
          .get("button")
          .contains("continue")
          .click();
        cy.wait("@authenticate");
        cy.contains("Pending").click();

        cy
          .get(".test-pending-account")
          .eq(0)
          .click();

        // // click on approve to approve, it will display the device modal
        cy
          .get("button")
          .contains("Approve")
          .click();
        cy.wait("@approve");

        // // logout the current user
        cy.contains("view profile").click();
        cy.contains("logout").click();
        cy.wait("@logout");

        // // set the current device to device 2
        cy
          .request("POST", Cypress.env('api_switch_device'), {
            device_number: 5
          })
          .then(() => {
            cy.get("input").type(orga_name);
            cy
              .get("button")
              .contains("continue")
              .click();
            cy.wait("@authenticate");
            cy.contains("Pending").click();

            cy
              .get(".test-pending-account")
              .eq(0)
              .click();

            // // click on approve to approve, it will display the device modal
            cy
              .get("button")
              .contains("Approve")
              .click();
            cy.wait("@approve");
          });
      });
  });
});
