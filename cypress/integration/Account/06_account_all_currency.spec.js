import {login,logout,route,switch_device,create_account } from '../../functions/actions.js';


context("test function call", () => {
  it("login function test", () => {
    cy.server();
    route();
    switch_device(5);
    login();
    // Creation of a account for all the currency
    create_account("Dash","Dash Acc");
    create_account("Litecoin","Litecoin Acc");
    create_account("Bitcoin Gold","Bitcoin Acc");
    create_account("Dogecoin","Dogecoin Acc");
    create_account("Digibyte","Digibyte Acc");
    create_account("Komodo","Komodo Acc");
    create_account("PivX","PivX Acc");
    create_account("Vertcoin","Vertcoin Acc");
    logout();
  });
});
