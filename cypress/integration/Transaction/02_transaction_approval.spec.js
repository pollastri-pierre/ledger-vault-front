import {
  login,
  logout,
  route,
  approve_transaction,
} from "../../functions/actions";

describe("Tests Approve of a Transaction", () => {
  afterEach(() => {
    logout();
  });

  it("Approve transaction with device 4", () => {
    cy.server();
    route();
    login(4);
    approve_transaction("BTC Testnet");
  });

  it("Approve transaction with device 5", () => {
    cy.server();
    route();
    login(5);
    approve_transaction("BTC Testnet");
  });
});
