import {
  login,
  logout,
  route,
  approve,
  approve_account,
  create_account,
} from "../../functions/actions";

describe("Tests Eth and ETH Ropsten", () => {
  it("Create/Approve account Ethereum and ETH Ropsten", () => {
    cy.server();
    route();
    login(5);
    create_account("Ethereum Ropsten", "Ethereum Testnet");
    approve();
    approve_account("Ethereum Ropsten", "Ethereum Testnet", "𝚝ETH");
    create_account("Ethereum", "Ethereum Account");
    approve();
    approve_account("Ethereum", "Ethereum Account", "ETH");
    logout();
  });

  it("Approve with the a other member", () => {
    cy.server();
    route();
    login(6);
    approve();
    approve_account("Ethereum Ropsten", "Ethereum Testnet", "𝚝ETH");
    approve();
    approve_account("Ethereum", "Ethereum Account", "ETH");
  });
});
