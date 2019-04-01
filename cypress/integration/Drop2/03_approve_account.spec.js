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
      .visit("https://localhost:9000/ledger1/register/e9bb230e-d6c0-4300-8f02-563423abf22e");
    cy.contains("John Clark");
    cy.get("[data-test=dialog-button]").click();

    // James Lepic
    cy
      .visit("https://localhost:9000/ledger1/register/829cb650-ac13-4fb8-a00d-9c630f642e97");
    cy.contains("James Lepic");
    cy.get("[data-test=dialog-button]").click();

    //Thomas Lebron
    cy
      .visit("https://localhost:9000/ledger1/register/d4ca750f-3f43-49a4-84cb-36f3f4fa0302");
    cy.contains("Thomas Lebron");
    cy.get("[data-test=dialog-button]").click();

    //Aidan Fisher
    cy
      .visit("https://localhost:9000/ledger1/register/18a1766f-2968-4d89-889c-4b09d05bf4ca");
    cy.contains("Aidan Fisher");
    cy.get("[data-test=dialog-button]").click();

    //Anna Wagner
    cy
      .visit("https://localhost:9000/ledger1/register/4d4730fd-1c80-45c9-b732-431c26129562");
    cy.contains("Anna Wagner");
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
