const orga_name = Cypress.env("workspace");
context("Create Multi Account", () => {
  let polyfill;
  before(() => {
    const polyfillUrl = "https://unpkg.com/unfetch/dist/unfetch.umd.js";
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body;
    });
  });
  it("should create multi account", () => {
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

    cy
      .request("POST", "http://localhost:5001/switch-device", {
        device_number: 6
      })
      .then(() => {
        cy.get("input").type(orga_name);
        cy.contains("continue").click();
        cy.wait("@authenticate");
        // Acount Litcoin
        cy.get(".test-new-account").click();
        cy.contains("Litecoin").click();
        cy.get("input").type("LTC TEST");
        cy.contains("continue").click();
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
          // Acount Dash
          cy.get(".test-new-account").click();
          cy.contains("Dash").click();
          cy.get("input").type("DASH TEST");
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

            // Dogecoin
            cy.get(".test-new-account").click();
            cy.contains("Dogecoin").click();
            cy.get("input").type("DOGE TEST");
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
            cy
              .get(".test-member-row")
              .eq(2)
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
              //Logout
              cy.contains("view profile").click();
              cy.contains("logout").click();
              cy.wait("@logout");
            });
        });
      });
