import {route,switch_device } from '../../functions/actions.js';
const orga_name = Cypress.env("workspace");
const API = `${Cypress.env("api_server2")}/${orga_name}`;
const DEVICE = Cypress.env("api_switch_device");

context("Onboarding e2e", () => {
  let polyfill;
  before(() => {
    const polyfillUrl = Cypress.env("polyfillUrl");
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body;
    });
    cy.visit(Cypress.env("api_server"), {
      onBeforeLoad: win => {
        win.fetch = null;
        win.eval(polyfill);
        win.fetch = win.unfetch;
      }
    });
  });

  it("should initialise the 3 Wrapping Key Custodians", () => {
        cy.server();
        route();
        switch_device(1);
        cy.get("input").type(orga_name);
        cy.contains("Continue").click();
        cy.wait(1000);
        cy.contains("Welcome").should("be.visible");
        cy.contains("Get Started").click();
        cy.wait("@next");
        cy.contains("Continue").click();
        cy.wait("@next");
        cy.contains("Continue").click();
        cy.wait("@next");
        cy.contains("Continue").click();
        cy.wait("@next");
        cy.wait("@challenge");
        //First WPK
        cy.get(".fragment")
          .eq(0)
          .find(".fragment-click")
          .click();
        cy.wait("@authenticate");

        // Second WPK
        cy.request("POST", DEVICE, {
          device_number: 2
        }).then(() => {
          cy.get(".fragment")
            .eq(1)
            .find(".fragment-click")
            .click();
          cy.wait("@authenticate");
          cy.wait(1000);

          // Third WPK
          cy.request("POST", DEVICE, {
            device_number: 3
          }).then(() => {
            cy.get(".fragment")
              .eq(2)
              .find(".fragment-click")
              .click();
            cy.wait("@authenticate");
            cy.contains("Continue").click();
            cy.wait("@next");
            cy.contains("Continue")
              .debug()
              .click();
            cy.wait("@next");
            cy.contains("Continue")
              .debug()
              .click();
            cy.wait("@next");
          });
        });
      });

    it("should register admins and define security scheme", () => {
        cy.server();
        route();
        switch_device(4);
        cy.contains("add administrator").click();
        cy.get("input[name=username]").type("user1");
        cy.get("input[name=email]").type("user1@user.com");
        cy.get("[role=dialog] [data-test=dialog-button]")
          .contains("Continue")
          .click();
        cy.wait("@authenticate");

        // Second Admin
        cy.request("POST", DEVICE, {
          device_number: 5
        }).then(() => {
          cy.contains("add administrator").click();
          cy.get("input[name=username]").type("user2");
          cy.get("input[name=email]").type("user2@ledger.fr");
          cy.get("[role=dialog] [data-test=dialog-button]")
            .contains("Continue")
            .click();
          cy.wait("@authenticate");

          // Thrid Admin
          cy.request("POST", DEVICE, {
            device_number: 6
          }).then(() => {
            cy.contains("add administrator").click();
            cy.get("input[name=username]").type("user3");
            cy.get("input[name=email]").type("user3@ledger.fr");
            cy.get("[role=dialog] [data-test=dialog-button]")
              .contains("Continue")
              .click();
            cy.wait("@authenticate");
            cy.contains("Continue").click();
            cy.wait("@next");
            cy.contains("more").click();
            cy.contains("more").click();
            cy.contains("more").click();
            cy.contains("less").click();
            cy.contains("Continue").click();
            cy.wait("@next");
          });
        });
      });

      it("should add 3 Shared Owners", () => {
        cy.server();
        route();
        cy.request("POST", DEVICE, { device_number: 7 }).then(() => {
          cy.contains("Continue").click();
          cy.wait("@next");
          cy.contains("Continue").click();
          cy.wait("@next");
          cy.contains("Continue").click();
          cy.wait("@next");
          // Shared Owner 1
          cy.contains("Add shared-owner").click();
          cy.wait("@authenticate");
          // Shared Owner 2
          cy.request("POST", DEVICE, { device_number: 8 }).then(() => {
            cy.contains("Add shared-owner").click();
            cy.wait("@authenticate");
            // Shared Owner 3
            cy.request("POST", DEVICE, { device_number: 9 }).then(() => {
              cy.contains("Add shared-owner").click();
              cy.wait("@authenticate");

              cy.contains("Continue").click();
              cy.wait("@next");
            });
          });
        });
      });

      it("should sign in with all the admin to approve the Shared Owners", () => {
        cy.server();
        route();
        switch_device(4);
        // First Admin sign in
        cy.get(".test-onboarding-signin").click();
        cy.wait("@authenticate");
        // Second Admin sign in
        switch_device(5);
        cy.get(".test-onboarding-signin").click();
        cy.wait("@authenticate");
        // finish
        cy.contains("Continue").click();
        cy.wait("@next");
      });

      it("should initialize Master Seed scheme and login to the dashboard", () => {
        cy.server();
        route();
        switch_device(7);
        cy.wait(1000);
        // Get Seed 1st Shared Owner
        cy.get(".fragment")
          .eq(0)
          .find(".fragment-click")
          .click();
        cy.wait("@authenticate");
        // Get Seed 2nd Shared Owner
        switch_device(8);
        cy.get(".fragment")
          .eq(1)
          .find(".fragment-click")
          .click();
        cy.wait("@authenticate");
        // Get Seed 3rd Shared Owner
        switch_device(9);
        cy.get(".fragment")
          .eq(2)
          .find(".fragment-click")
          .click();
        cy.wait("@authenticate");
        cy.wait(1000);
        // Complete Onboarding
        cy.contains("Continue").click();
        cy.wait("@next");
        cy.wait(2000);

        cy.contains("3 Shared-Owners").should("be.visible");
        cy.contains("3 Wrapping Keys Custodians").should("be.visible");
        cy.contains("3 Administrators").should("be.visible");
        cy.contains("2/3 administration rule").should("be.visible");

        // login with user1
        switch_device(4);
        cy.contains("Continue").click();
        cy.url().should("include", "/dashboard");
      });

});
