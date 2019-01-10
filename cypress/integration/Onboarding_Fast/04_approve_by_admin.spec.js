import {route,switch_device } from '../../functions/actions.js';
const orga_name = Cypress.env("workspace");
context("Admin Approve the registration of the Shared Owners", () => {
  let polyfill;
  before(() => {
    const polyfillUrl = Cypress.env("polyfillUrl");
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body;
    });
  });
  it("should sign in with all the admin to approve the Shared Owners", () => {
    cy.server();
    route();
    switch_device(4);
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
  });
});
