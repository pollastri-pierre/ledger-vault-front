import { login, route } from "../../functions/actions";

describe("Test the registration of a User", function() {
  beforeEach(function() {
    login(5);
  });

  afterEach(function() {
    // logout();
  });

  it("Copy Paste", () => {
    cy.server();
    route();
    cy.url().should("include", "/admin/dashboard");
    cy.get("[data-test=menuItem-users]").click();
    cy.url().should("include", "/admin/users");
    cy.contains("pending registration").click();
    cy.contains("Copy").click();
    cy.url().type("{ctrl}V");
  });

  it("approve user", () => {
    cy.server();
    route();
    // John Clark
    cy.visit(
      "https://localhost:9000/ledger1/register/739007ec-97ca-4371-a7da-01e0da53c4b8",
    );
    cy.contains("John Clark");
    cy.get("[data-test=dialog-button]").click();

    // James Lepic
    cy.visit(
      "https://localhost:9000/ledger1/register/27198d02-3497-4d28-aecb-3258e933ae76",
    );
    cy.contains("James Lepic");
    cy.get("[data-test=dialog-button]").click();

    // Thomas Lebron
    cy.visit(
      "https://localhost:9000/ledger1/register/1c0e9ff9-78a0-4449-b554-03839f86cc74",
    );
    cy.contains("Thomas Lebron");
    cy.get("[data-test=dialog-button]").click();

    // Aidan Fisher
    cy.visit(
      "https://localhost:9000/ledger1/register/6553022c-cd18-499f-86fa-f989071a02f7",
    );
    cy.contains("Aidan Fisher");
    cy.get("[data-test=dialog-button]").click();

    // Anna Wagner
    cy.visit(
      "https://localhost:9000/ledger1/register/a15d6ad3-da65-423f-9c09-e0d308db47f2",
    );
    cy.contains("Anna Wagner");
    cy.get("[data-test=dialog-button]").click();
  });
});
