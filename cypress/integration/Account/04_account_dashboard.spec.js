const orga_name = Cypress.env("workspace");
context("Account From Dashboard", () => {
  let polyfill;
  before(() => {
    const polyfillUrl = Cypress.env('polyfillUrl');
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body;
    });
  });
  it("should get all the account from the dashboard", () => {
    cy.visit(Cypress.env('api_server'), {
      onBeforeLoad: win => {
        win.fetch = null;
        win.eval(polyfill);
        win.fetch = win.unfetch;
      }
    });
    cy.server();
    cy.route("post", "**/authentications/**").as("authenticate");
    cy.route("post", "**/abort").as("abort");
    cy.route("post", "**/logout").as("logout");
    cy.route("get", "**/dashboard").as("dashboard");

    cy
      .request("POST", Cypress.env('api_switch_device'), {
        device_number: 5
      })
      // Login with a wrong workspace name
      .then(() => {
        cy.get("input").type(orga_name);
        cy.contains("continue").click();
        cy.wait("@authenticate");

        cy.contains("dashboard").click();
        cy.contains("Total Balance").should('be.visible');
        cy.contains("Last operations").should('be.visible');
        cy.contains("currencies").should('be.visible');
        cy.contains("pending").should('be.visible');

        //Logout
        cy.contains("view profile").click();
        cy.contains("logout").click();
        cy.wait("@logout");
        });
    });
});
