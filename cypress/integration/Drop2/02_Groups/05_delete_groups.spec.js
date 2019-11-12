import {
  login,
  logout,
  route,
  successfull_message2,
} from "../../../functions/actions";

describe("Test Case for Groups", function() {
  beforeEach(function() {
    login(4);
  });

  afterEach(function() {
    logout();
  });

  it("Delete Group", () => {
    cy.server();
    route();
    cy.url().should("include", "/admin/dashboard");
    cy.get("[data-test=menuItem-groups]").click();
    cy.url().should("include", "/admin/groups");

    cy.contains("NORTH Asia").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    cy.get("[data-test=Confirm]").click();
    cy.wait(1500);
  });

  it("Approve the Delete Group", () => {
    cy.server();
    route();
    logout();
    login(6);
    cy.url().should("include", "/admin/dashboard");
    cy.get("[data-test=0]").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    successfull_message2();
  });

  it("Deletion Group", () => {
    cy.server();
    route();
    cy.url().should("include", "/admin/dashboard");
    cy.get("[data-test=menuItem-groups]").click();
    cy.url().should("include", "/admin/groups");

    cy.contains("New EMEA").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    cy.get("[data-test=Confirm]").click();
    cy.wait(1500);
  });

  it("Reject the deletion of the group", () => {
    cy.server();
    route();
    logout();
    login(5);
    cy.url().should("include", "/admin/dashboard");
    cy.get("[data-test=0]").click();
    cy.wait(1500);
    cy.contains("Reject").click();
  });
});
