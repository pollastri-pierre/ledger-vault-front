import { login, logout, route } from "../../../functions/actions";

describe("Approve whitelists", function() {
  beforeEach(function() {
    login(6);
  });

  afterEach(function() {
    logout();
  });

  it("Approve 100 addresse of a Whitelist", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-dashboard]").click();
    cy.get("[data-test=0]").click();
    cy.get("[data-test=approve_button]").click();
    cy.get("[data-test=successfull_message]").should("contain", "Successfully");
    cy.contains("Done").click();
  });
});
