import { login, logout, route } from "../../../functions/actions";

describe("Test Case for Account", function() {
  beforeEach(function() {
    login(4);
  });

  afterEach(function() {
    logout();
  });

  it("Approve Edit acount", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-dashboard]").click();
    cy.get("[data-test=0]").click();
    cy.get("[data-test=approve_button]").click();
    cy.contains("Done").click();
    cy.wait(100);
    cy.get("[data-test=0]").click();
    cy.get("[data-test=approve_button]").click();
    cy.contains("Done").click();
  });
});
