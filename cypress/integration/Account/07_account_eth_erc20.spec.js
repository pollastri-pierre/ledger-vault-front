import {
  login,
  logout,
  route,
  switch_device,
  approve,
  approve_account,
  create_account
} from "../../functions/actions.js";

describe("Tests Creation Account", function() {
  afterEach(function() {
    logout();
  });

  it("Create/Approve account Ethereum and ETH Ropsten", () => {
    cy.server();
    route();
    login(5)


    create_account("Ethereum Ropsten", "Ethereum Testnet");
    approve();
    approve_account("Ethereum Ropsten", "Ethereum Testnet", "𝚝ETH");

    create_account("Ethereum", "Ethereum Account2");
    approve();
    approve_account("Ethereum", "Ethereum Account2", "ETH");
  });

  it("Approve with the a other member", () => {
    cy.server();
    route();
    login(6);
    cy.wait(1000);
    approve();
    approve_account("Ethereum Ropsten", "Ethereum Testnet", "𝚝ETH");
    approve();
    approve_account("Ethereum", "Ethereum Account2", "ETH");
  });

});
