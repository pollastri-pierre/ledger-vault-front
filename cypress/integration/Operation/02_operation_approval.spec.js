import {login,logout,route,switch_device,create_account,approve,cancel,approve_account,approve_operation } from '../../functions/actions.js';

describe("Tests Approve of a Operation", function() {

  afterEach(function () {
    logout();
  });


  it("Approve operation with device 4", () => {
    cy.server();
    route();
    login(4);
    approve_operation("BTC Testnet");
  });

  it("Approve operation with device 5", () => {
    cy.server();
    route();
    login(5);
    approve_operation("BTC Testnet");

  });
});
