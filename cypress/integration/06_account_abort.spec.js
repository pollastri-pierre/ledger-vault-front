const orga_name = Cypress.env("workspace");
context("Account Abort", () => {
  let polyfill;
  before(() => {
    const polyfillUrl = Cypress.env('polyfillUrl');
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body;
    });
  });
  it("should abort a account", () => {
    // go to vault homepage and enter orga_name
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

    cy
      .request("POST", Cypress.env('api_switch_device'), {
        device_number: 5
      })
      .then(() => {
        cy.get("input").type(orga_name);
        cy.contains("continue").click();
        cy.wait("@authenticate");
        cy.get(".test-new-account").click();
        cy.contains("Litecoin").click();
        cy.get("input").type("LTC TEST");
        cy.contains("continue").click();
        // open the list of members modal
        cy.contains("Members").click();
        // select 2 members
        cy
          .get(".test-member-row")
          .eq(0)
          .click({ force: true });
        cy
          .get(".test-member-row")
          .eq(1)
          .click({ force: true });
          cy.contains("Done").click();
          cy.contains("Approvals").click();
          cy.get("input").clear();
          cy.get("input").type(1);
          cy.contains("done").click();
          // go to confirmation tab
          cy.contains("continue").click();

          // click on done to create the account, it will display the authenticate with device modal
          cy.contains("done").click();
          cy.wait("@authenticate");
          // Abort the account
          cy.contains("Pending").click();
          cy
            .get(".test-pending-account")
            .eq(0)
            .click();

          // // click 2 times on abort to abort
          cy
            .get("button")
            .contains("Abort")
            .click();
          cy
            .get("button")
            .contains("Abort")
            .click();
          cy.wait("@abort");

          // // logout the current user
          cy.contains("view profile").click();
          cy.contains("logout").click();
          cy.wait("@logout");


        });
    });
});
