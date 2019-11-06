import { login, logout, route, approve_tx } from "../../../functions/actions";

describe("Approve tx by different Operator ", function() {
  beforeEach(function() {
    login(12);
  });

  afterEach(function() {
    logout();
  });

  it("Approved tx by Thomas", () => {
    cy.server();
    route();
    approve_tx();
  });
  it("Approved tx by James", () => {
    cy.server();
    route();
    logout();
    login(13);
    approve_tx();
  });
  it("Approved tx by Tyler", () => {
    cy.server();
    route();
    logout();
    login(20);
    approve_tx();
  });
});
