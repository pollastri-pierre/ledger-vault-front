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

  it("Invite new user operator", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-users]").click();
    cy.url().should('include', '/admin/users')
    cy.get("[data-test=buttonCreate]").click();
  });


});
