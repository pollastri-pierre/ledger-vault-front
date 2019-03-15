import {
  login,
  logout,
  route,
  switch_device,
  create_account,
  approve_account,
} from "../../functions/actions.js";

describe("Tests Account Currency", function() {
  afterEach(function() {
    logout();
  });

  it("Create a account for all the currency", () => {
    cy.server();
    route();
    login(4);
    create_account("Dash", "Dash Acc");
    create_account("Litecoin", "Litecoin Acc");
    create_account("Bitcoin Gold", "Bitcoin Acc");
    create_account("Dogecoin", "Dogecoin Acc");
    create_account("Digibyte", "Digibyte Acc");
    create_account("Komodo", "Komodo Acc");
    create_account("PivX", "PivX Acc");
    create_account("Vertcoin", "Vertcoin Acc");
  });

  it("Accounts to approve with device 5", () => {
    cy.server();
    route();
    login(5);
    approve_account("Dash", "Dash Acc", "DASH");
    approve_account("Litecoin", "Litecoin Acc", "LTC");
    approve_account("Bitcoin Gold", "Bitcoin Acc", "BTG");
    approve_account("Dogecoin", "Dogecoin Acc", "DOGE");
    approve_account("Digibyte", "Digibyte Acc", "DGB");
    approve_account("Komodo", "Komodo Acc", "KMD");
    approve_account("PivX", "PivX Acc", "PIVX");
    approve_account("Vertcoin", "Vertcoin Acc", "VTC");
  });

  it("Accounts to approve with device 6", () => {
    cy.server();
    route();
    login(6);
    approve_account("Dash", "Dash Acc", "DASH");
    approve_account("Litecoin", "Litecoin Acc", "LTC");
    approve_account("Bitcoin Gold", "Bitcoin Acc", "BTG");
    approve_account("Dogecoin", "Dogecoin Acc", "DOGE");
    approve_account("Digibyte", "Digibyte Acc", "DGB");
    approve_account("Komodo", "Komodo Acc", "KMD");
    approve_account("PivX", "PivX Acc", "PIVX");
    approve_account("Vertcoin", "Vertcoin Acc", "VTC");
  });
});
