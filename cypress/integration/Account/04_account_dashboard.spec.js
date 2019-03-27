import { login, logout, route } from "../../functions/actions";

describe("Tests Dashboard", () => {
  beforeEach(() => {
    login(4);
  });

  afterEach(() => {
    logout();
  });

  it("Dashboard Test cases", () => {
    cy.server();
    route();

    cy.contains("dashboard").click();
    cy.contains("Total Balance").should("be.visible");
    cy.contains("Last transactions").should("be.visible");
    cy.contains("currencies").should("be.visible");
    cy.contains("pending").should("be.visible");
  });
});
