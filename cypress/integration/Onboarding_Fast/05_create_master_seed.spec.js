import {route,switch_device } from '../../functions/actions.js';

const orga_name = Cypress.env("workspace");
const API = `${Cypress.env("api_server2")}/${orga_name}`;
const DEVICE = Cypress.env("api_switch_device");

context("Create the Master Seed", () => {
  let polyfill;
  before(() => {
    const polyfillUrl = Cypress.env("polyfillUrl");
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body;
    });
  });

  it("should initialize Master Seed scheme and login to the dashboard", () => {
    cy.server();
    route();
    switch_device(7);
    cy.visit(Cypress.env("api_server"), {
      onBeforeLoad: win => {
        win.fetch = null;
        win.eval(polyfill);
        win.fetch = win.unfetch;
      }
    }).then(() => {
      cy.get("input").type(orga_name);
      cy.contains("Continue").click();
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

      // Complete Onboarding
      cy.contains("Continue").click();
      cy.wait("@next");
      cy.wait(1000);

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
});
