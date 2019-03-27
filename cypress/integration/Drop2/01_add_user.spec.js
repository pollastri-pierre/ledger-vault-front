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
    cy.get('[type="radio"]').check('Operator');
    cy.get("input[type=text]").eq(1).focus().type("Nicky James")
    cy.get("input[type=text]").eq(2).focus().type("02930930393093039303903");
    cy.get("[data-test=generateLink]").click();
    cy.get("[data-test=close]").click();
  });

});
