import {
  login,
  logout,
  route,
  switch_device,
  approve,
  approve_account,
  create_account
} from "../../functions/actions.js";

describe("Tests Eth and ETH Ropsten", function() {
  afterEach(function() {
    logout();
    cy.wait(1000);
  });

  it("Create/Approve account Ethereum and ETH Ropsten", () => {
    cy.server();
    route();
    login(5)
    create_account("Ethereum Ropsten", "Ethereum Testnet2");
    approve();
    approve_account("Ethereum Ropsten", "Ethereum Testnet2", "𝚝ETH");
    create_account("Ethereum", "Ethereum Account2");
    approve();
    approve_account("Ethereum", "Ethereum Account2", "ETH");
  });

  it("Approve with the a other member", () => {
    cy.server();
    route();
    login(6);
    approve();
    approve_account("Ethereum Ropsten", "Ethereum Testnet2", "𝚝ETH");
    approve();
    approve_account("Ethereum", "Ethereum Account2", "ETH");
  });

});
