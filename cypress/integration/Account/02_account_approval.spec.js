import {
  login,
  logout,
  route,
  approve,
  approve_account,
} from "../../functions/actions";

afterEach(() => {
  logout();
});

describe("Tests Approve Account", () => {
  it("Approve a account with first member", () => {
    cy.server();
    route();
    login(6);
    approve();
    approve_account("Bitcoin Testnet", "BTC Testnet", "BTC");
  });

  it("Approve a account with second members", () => {
    cy.server();
    route();
    login(4);
    approve();
    approve_account("Bitcoin Testnet", "BTC Testnet", "BTC");
  });
});
