const orga_name = Cypress.env("workspace");
context("Operation Creation", () => {
  let polyfill;
  before(() => {
    const polyfillUrl = "https://unpkg.com/unfetch/dist/unfetch.umd.js";
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body;
    });
  });
  it("redirect to login", () => {
    // go to vault homepage and enter orga_name
    cy.server();
    cy.route("post", "**/validation/**").as("validation");
    cy.route("post", "**/authentications/**").as("authenticate");
    cy.route("post", "**/fees").as("fees");
    cy.visit("https://localhost:9000", {
      onBeforeLoad: win => {
        win.fetch = null;
        win.eval(polyfill);
        win.fetch = win.unfetch;
      }
    });

    cy
      .request("POST", "http://localhost:5001/switch-device", {
        device_number: 4
      })
      .then(() => {
        cy.get("input").type(orga_name);
        cy.contains("continue").click();
        cy.wait("@authenticate");
        cy.get("[data-test=new-operation]").click();
        cy
          .get("[data-test=operation-creation-accounts] li:first")
          .click({ force: true });

        cy.get("[data-test=unit-select]").click();
        cy
          .get("[data-test=unit-select-values]")
          .eq(1)
          .debug()
          .click({ force: true });

        cy
          .get("[data-test=crypto-address-picker]")
          .find("input")
          .type("n3xhRagxTgEWB6TP8FnwcgToJJ5f3J7zRD");
        cy
          .get("[data-test=operation-creation-amount]")
          .find("input")
          .type("0.001");

        cy.wait("@fees");
        cy.contains("Continue").click();
        cy.contains("Continue").click();
        cy
          .get("[data-test=dialog-button]")
          .contains("Confirm")
          .click({ force: true });
        cy.wait("@authenticate");
      });
  });
});
