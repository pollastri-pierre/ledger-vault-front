import {
  login,
  logout,
  route,
  switch_device,
  create_account,
} from "../../functions/actions.js";

describe("Tests Creation Account", function() {
  beforeEach(function() {
    login(5);
  });

  afterEach(function() {
    //logout();
  });

  it("approve user", () => {
    cy.server();
    route();
    // John Clark
    cy
      .visit("https://localhost:9000/ledger1/register/3c1513bc-c4a2-41c0-a6af-da8e130e0a15");
    cy.get("[data-test=dialog-button]").click();

    // James Lepic
    cy
      .visit("https://localhost:9000/ledger1/register/6093e6fb-494f-427a-98f5-3c58c25470f4");
    cy.get("[data-test=dialog-button]").click();

    //Thomas Lebron
    cy
      .visit("https://localhost:9000/ledger1/register/0a38bcd6-123d-4066-95b1-efc507819ff2");
    cy.get("[data-test=dialog-button]").click();

    //Aidan Fisher
    cy
      .visit("https://localhost:9000/ledger1/register/063d93bd-d3e7-4dde-9f4f-f101b9468708");
    cy.get("[data-test=dialog-button]").click();

    //Anna Wagner
    cy
      .visit("https://localhost:9000/ledger1/register/25d99a01-f972-4fed-834d-46b31d4e39f0");
    cy.get("[data-test=dialog-button]").click();


  });

  it("approve group", () => {
    cy.server();
    route();
    cy.url().should('include', '/admin/dashboard')
    cy.contains("Create group").click();
    cy.contains("APAC 1");
    cy.get("[data-test=dialog-button]").eq(1).click();
  });

  it("approve account", () => {
    cy.server();
    route();
    cy.url().should('include', '/admin/dashboard')
    cy.contains("Create Account").click();
    cy.get("[data-test=dialog-button]").eq(1).click();
  });




});
