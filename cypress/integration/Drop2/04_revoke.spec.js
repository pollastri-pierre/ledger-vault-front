import { login, logout, route, create_user, create_group } from "../../functions/actions";

describe("Tests Creation Account", function() {
  beforeEach(function() {
    login(4);
  });

  afterEach(function() {
    logout();
  });

  it("Revoke Operator", () => {
   cy.server();
   route();
   cy.get("[data-test=menuItem-users]").click();
   cy.url().should("include", "/admin/users");
   cy.contains("Anna Wagner").click();
   cy.contains("Revoke").click();
   cy.wait(2500);
   login(5);
   cy.get("[data-test=menuItem-users]").click();
   cy.contains("Anna Wagner").click();
   cy.get("[data-test=approve_button]").click();
   cy.wait(2500);
   login(6);
   cy.get("[data-test=menuItem-users]").click();
   cy.url().should("include", "/admin/users");
   cy.contains("Anna Wagner").click();
   cy.get("[data-test=approve_button]").click();
   cy.wait(2500);
 });

});
