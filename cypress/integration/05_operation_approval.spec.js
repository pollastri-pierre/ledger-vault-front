const orga_name = Cypress.env("workspace");
context("Account approval", () => {
  let polyfill;
  before(() => {
    const polyfillUrl = "https://unpkg.com/unfetch/dist/unfetch.umd.js";
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body;
    });
  });
  it("redirect to login", () => {
    // go to the vault homepage
    cy.visit("https://localhost:9000", {
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
      .request("POST", "http://localhost:5001/switch-device", {
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
          .get("[data-test=pending-operation]")
          .eq(0)
          .click();

        // click on approve to approve, it will display the device modal
        cy
          .get("[data-test=dialog-button]")
          .contains("Approve")
          .click();
        cy.wait("@approve");

        // // // logout the current user
        cy.get("[data-test=view-profile]").click();
        cy.get("[data-test=logout]").click();
        cy.wait("@logout");

        // set the current device to device 2
        cy
          .request("POST", "http://localhost:5001/switch-device", {
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
              .get("[data-test=pending-operation]")
              .eq(0)
              .click();
            cy
              .get("[data-test=dialog-button]")
              .contains("Approve")
              .click();
            cy.wait("@approve");
          });
      });
  });
});
