const orga_name = Cypress.env("workspace");
context("Operation Abort", () => {
  let polyfill;
  before(() => {
    const polyfillUrl = Cypress.env("polyfillUrl");
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body;
    });
  });
  it("redirect to login", () => {
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
    cy.route("post", "**/abort").as("abort");
    cy.route("post", "**/validation/**").as("validation");
    cy.route("post", "**/fees").as("fees");

    cy
      .request("POST", Cypress.env('api_switch_device'), {
        device_number: 4
      })
      .then(() => {
    // Login to the workspace
        cy.get("input").type(orga_name);
        cy.contains("continue").click();
        cy.wait("@authenticate");



      });
  });
});
