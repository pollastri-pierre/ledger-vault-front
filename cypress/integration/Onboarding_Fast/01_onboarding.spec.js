import { route, switch_device } from "../../functions/actions";

const orga_name = Cypress.env("workspace");
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
      },
    });
  });

  it("should initialise the 3 Wrapping Key Custodians", () => {
    cy.server();
    route();
    switch_device(1);
    cy.get("input[type=text]").type(orga_name, { delay: 40 });
    cy.get("[data-test=continue_button]").click();
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
    // First WPK
    cy.get(".fragment")
      .eq(0)
      .click();
    cy.wait("@get-public-key");
    cy.wait("@get-attestation");
    cy.wait("@open-session");
    cy.wait("@generate-key-fragments");
    cy.wait("@authenticate");

    // Second WPK
    cy.request("POST", DEVICE, {
      device_number: 2,
    }).then(() => {
      cy.get(".fragment")
        .eq(1)
        .click();
      cy.wait("@get-public-key");
      cy.wait("@get-attestation");
      cy.wait("@open-session");
      cy.wait("@generate-key-fragments");
      cy.wait("@authenticate");
      cy.wait(3000);

      // Third WPK
      cy.request("POST", DEVICE, {
        device_number: 3,
      }).then(() => {
        cy.get(".fragment")
          .eq(2)
          .click();
        cy.wait("@get-public-key");
        cy.wait("@get-attestation");
        cy.wait("@open-session");
        cy.wait("@generate-key-fragments");
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
    cy.get("[data-test=dialog-button]")
      .eq(2)
      .click();
    cy.wait("@get-public-key");
    cy.wait("@get-attestation");
    cy.wait("@challenge");
    cy.wait("@register");
    cy.wait("@register-data");
    cy.wait("@authenticate");

    // Second Admin
    cy.request("POST", DEVICE, {
      device_number: 5,
    }).then(() => {
      cy.contains("add administrator").click();
      cy.get("input[name=username]").type("user2");
      cy.get("[data-test=dialog-button]")
        .eq(2)
        .click();
      cy.wait("@get-public-key");
      cy.wait("@get-attestation");
      cy.wait("@challenge");
      cy.wait("@register");
      cy.wait("@register-data");
      cy.wait("@authenticate");

      // Thrid Admin
      cy.request("POST", DEVICE, {
        device_number: 6,
      }).then(() => {
        cy.contains("add administrator").click();
        cy.get("input[name=username]").type("user3");
        cy.get("[data-test=dialog-button]")
          .eq(2)
          .click();
        cy.wait("@get-public-key");
        cy.wait("@get-attestation");
        cy.wait("@challenge");
        cy.wait("@register");
        cy.wait("@register-data");
        cy.wait("@authenticate");
        cy.get("[data-test=dialog-button]")
          .eq(1)
          .click();
        cy.wait("@next");
        cy.contains("more").click();
        cy.contains("more").click();
        cy.contains("more").click();
        cy.contains("less").click();
        cy.get("[data-test=dialog-button]")
          .eq(1)
          .click();
        cy.wait("@next");
      });
    });
  });

  it("should add 3 Shared Owners", () => {
    cy.server();
    route();
    cy.request("POST", DEVICE, { device_number: 7 }).then(() => {
      cy.get("[data-test=dialog-button]")
        .eq(1)
        .click();
      cy.wait("@next");
      cy.get("[data-test=dialog-button]")
        .eq(1)
        .click();
      cy.wait("@next");
      cy.get("[data-test=dialog-button]")
        .eq(1)
        .click();
      cy.wait("@next");

      // Shared Owner 1
      cy.contains("Add shared-owner").click();
      cy.wait("@get-public-key");
      cy.wait("@get-attestation");
      cy.wait("@challenge");
      cy.wait("@register");
      cy.wait("@register-data");
      cy.wait("@authenticate");

      // Shared Owner 2
      cy.request("POST", DEVICE, { device_number: 8 }).then(() => {
        cy.contains("Add shared-owner").click();
        cy.wait("@get-public-key");
        cy.wait("@get-attestation");
        cy.wait("@challenge");
        cy.wait("@register");
        cy.wait("@register-data");
        cy.wait("@authenticate");

        // Shared Owner 3
        cy.wait(3000);
        cy.request("POST", DEVICE, { device_number: 9 }).then(() => {
          cy.contains("Add shared-owner").click();
          cy.wait("@get-public-key");
          cy.wait("@get-attestation");
          cy.wait("@challenge");
          cy.wait("@register");
          cy.wait("@register-data");
          cy.wait("@authenticate");

          cy.get("[data-test=dialog-button]")
            .eq(1)
            .click();
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
    cy.wait("@get-public-key");
    cy.wait("@open-session");
    cy.wait("@validate-vault-operation");
    cy.wait("@authenticate");

    // Second Admin sign in
    switch_device(5);
    cy.get(".test-onboarding-signin").click();
    cy.wait("@get-public-key");
    cy.wait("@open-session");
    cy.wait("@validate-vault-operation");
    cy.wait("@authenticate");

    // finish
    cy.get("[data-test=dialog-button]")
      .eq(1)
      .click();
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
      .click();
    cy.wait("@get-public-key");
    cy.wait("@open-session");
    cy.wait("@validate-vault-operation");
    cy.wait("@generate-key-fragments");
    cy.wait("@authenticate");

    // Get Seed 2nd Shared Owner
    switch_device(8);
    cy.get(".fragment")
      .eq(1)
      .click();
    cy.wait("@get-public-key");
    cy.wait("@open-session");
    cy.wait("@validate-vault-operation");
    cy.wait("@generate-key-fragments");
    cy.wait("@authenticate");

    // Get Seed 3rd Shared Owner
    switch_device(9);
    cy.get(".fragment")
      .eq(2)
      .click();
    cy.wait("@get-public-key");
    cy.wait("@open-session");
    cy.wait("@validate-vault-operation");
    cy.wait("@generate-key-fragments");
    cy.wait("@authenticate");
    cy.wait(1000);
    // Complete Onboarding
    cy.get("[data-test=dialog-button]")
      .eq(1)
      .click();
    cy.wait("@next");
    cy.wait(2000);

    cy.contains("3 Shared-Owners").should("be.visible");
    cy.contains("3 Wrapping Keys Custodians").should("be.visible");
    cy.contains("3 Administrators").should("be.visible");
    cy.contains("2/3 admin rule").should("be.visible");

    // login with user1
    switch_device(4);
    cy.contains("Continue").click();
    cy.wait(1000);
    cy.get("input[type=text]").type(orga_name);
    cy.get("[data-test=continue_button]").click();
    cy.wait("@get-public-key");
    cy.wait("@authenticate");
    cy.wait(1000);
    cy.url().should("include", "/dashboard");
  });
});
