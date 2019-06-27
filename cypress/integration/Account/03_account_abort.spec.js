import {
  login,
  logout,
  route,
  create_account,
  approve_account,
} from "../../functions/actions";

describe("Tests Abort Account", () => {
  beforeEach(() => {});

  afterEach(() => {
    logout();
  });

  it("Create a account LTC and Abort it", () => {
    cy.server();
    route();
    login(5);
    create_account("Litecoin", "Litecoin TEST");
    cy.contains("Pending").click();
    cy.get("[data-test=name]")
      .contains("Litecoin TEST")
      .click();
    cy.get("button")
      .contains("Abort")
      .click();
    cy.get("button")
      .contains("Abort")
      .click();
    cy.get(".top-message-body")
      .contains("The account request has been successfully aborted")
      .get(".top-message-title")
      .contains("account request aborted");
  });

  it("Create a account and approve it with device 6", () => {
    cy.server();
    route();
    login(6);
    create_account("Litecoin", "LTC TEST");
    cy.wait(1000);
    approve_account("litecoin", "LTC TEST", "LTC");
  });

  it("Abort the account with device 5", () => {
    cy.server();
    route();
    login(4);
    cy.contains("Pending").click();
    cy.wait(1000);
    cy.get("[data-test=name]")
      .contains("LTC TEST")
      .click();
    cy.get("button")
      .contains("Abort")
      .click({ force: true });
    cy.get("button")
      .contains("Abort")
      .click({ force: true });
    cy.get(".top-message-body")
      .contains("The account request has been successfully aborted")
      .get(".top-message-title")
      .contains("account request aborted");
  });
});
