import {
  login,
  logout,
  route,
  successfull_message,
} from "../../functions/actions";

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
    cy.wait(1500);
    cy.get("[data-test=approve_button]").click();
    cy.get("[data-test=Confirm]").click();
    successfull_message();
  });
  it("Approve the Delete Group", () => {
    cy.server();
    route();
    login(6);
    cy.url().should("include", "/admin/dashboard");
    cy.contains("Delete group").click();
    cy.get("[data-test=approve_button]").click();
    successfull_message();
  });

  it("Deletion Group", () => {
    cy.server();
    route();
    cy.url().should("include", "/admin/dashboard");
    cy.get("[data-test=menuItem-groups]").click();
    cy.url().should("include", "/admin/groups");

    cy.contains("EMEA").click();
    cy.wait(1500);
    cy.get("[data-test=approve_button]").click();
    cy.get("[data-test=Confirm]").click();
    successfull_message();
  });

  it("Reject the deletion of the group", () => {
    cy.server();
    route();
    login(6);
    cy.url().should("include", "/admin/dashboard");
    cy.contains("Delete group").click();
    cy.wait(1500);
    cy.contains("Reject").click();
  });
});
