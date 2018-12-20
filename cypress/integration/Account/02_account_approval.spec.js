import {login,logout,route,switch_device,create_account,approve,cancel,approve_account } from '../../functions/actions.js';

afterEach(function () {
  logout();
});

describe("Tests Approve Account", function() {
  it("Approve a account with first member", () => {
    cy.server();
    route();
    login(6)
    approve();
    approve_account("bitcoin_testnet","BTC Testnet", "BTC");
  });

  it("Approve a account with second member", () => {
    cy.server();
    route();
    login(4);
    approve();
    approve_account("bitcoin_testnet","BTC Testnet", "BTC");
  });
});
