import {
  login,
  logout,
  route,
  switch_device,
  create_account,
} from "../../functions/actions.js";

describe("Tests Creation Account", function() {
  beforeEach(function() {
    login(4);
  });

  afterEach(function() {
    //logout();
  });

  it("Invite new operator", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-users]").click();
    cy.url().should('include', '/admin/users')
    cy.get("[data-test=buttonCreate]").click();
    cy.get('[type="radio"]').check('Operator');
    //Add Anna Wagner
    cy.get("[datatest=username]").type("Anna Wagner")
    cy.get("[datatest=userID]").type(Cypress.env("userId1"));
    cy.get("[data-test=generateLink]").click();
    cy.get("[data-test=close]").click();

    //Add Aidan Fisher
    cy.get("[data-test=buttonCreate]").click();
    cy.get('[type="radio"]').check('Operator');
    cy.get("[datatest=username]").type("Aidan Fisher")
    cy.get("[datatest=userID]").type(Cypress.env("userId2"));
    cy.get("[data-test=generateLink]").click();
    cy.get("[data-test=close]").click();

    //Thomas Lebron
    cy.get("[data-test=buttonCreate]").click();
    cy.get('[type="radio"]').check('Operator');
    cy.get("[datatest=username]").type("Thomas Lebron")
    cy.get("[datatest=userID]").type(Cypress.env("userId3"));
    cy.get("[data-test=generateLink]").click();
    cy.get("[data-test=close]").click();

    //James Lepic
    cy.get("[data-test=buttonCreate]").click();
    cy.get('[type="radio"]').check('Operator');
    cy.get("[datatest=username]").type("James Lepic")
    cy.get("[datatest=userID]").type(Cypress.env("userId4"));
    cy.get("[data-test=generateLink]").click();
    cy.get("[data-test=close]").click();

  });
  it("Invite new admin", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-users]").click();
    cy.url().should('include', '/admin/users')
    cy.get("[data-test=buttonCreate]").click();
    cy.get('[type="radio"]').check('Administrator');
    //Add John Clark
    cy.get("[datatest=username]").type("John Clark")
    cy.get("[datatest=userID]").type(Cypress.env("userId5"));
    cy.get("[data-test=generateLink]").click();
    cy.get("[data-test=close]").click();
  });


  it("Create Group", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-groups]").click();
    cy.url().should('include', '/admin/groups')
    cy.get("[data-test=buttonCreate]").click();
    cy.wait(1000);
    cy.get("[datatest=group-name-input]").type("APAC 1")
    cy.get("[datatest=group-description-input]").type("Group APAC 1");
    cy.get("#input_groups_users")
      .type("Thomas", { force: true })
      .type("{enter}");
    cy.get("#input_groups_users")
      .type("James", { force: true })
      .type("{enter}");
    cy.get("#input_groups_users")
      .type("Anna", { force: true })
      .type("{enter}");
    cy.get("[data-test=dialog-button]").click();
  });

  it("Create Bitcoin Account", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-accounts]").click();
    cy.url().should('include', '/admin/accounts')
    cy.get("[data-test=buttonCreate]").click();
    cy.wait(1000);

    cy.get("#input_crypto")
      .type("Bitcoin Testnet", { force: true })
      .type("{enter}");
    cy.contains("Next").click();
    cy.get("#input_groups_users")
      .type("Anna", { force: true })
      .type("{enter}");
  });


});
