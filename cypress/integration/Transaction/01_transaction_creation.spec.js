import {
  login,
  logout,
  route,
  create_transaction,
} from "../../functions/actions";

describe("Tests Creation of a Transaction", () => {
  beforeEach(() => {
    login(4);
  });

  afterEach(() => {
    logout();
  });
  it("Create a Transaction", () => {
    cy.server();
    route();
    create_transaction("bitcoin_testnet", 1, Cypress.env("address"), "0.001");
  });
});
