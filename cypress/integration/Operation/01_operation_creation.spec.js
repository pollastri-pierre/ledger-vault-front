import {
  login,
  logout,
  route,
  switch_device,
  create_account,
  create_operation,
} from "../../functions/actions.js";

describe("Tests Creation of a Operation", function() {
  beforeEach(function() {
    login(4);
  });

  afterEach(function() {
    logout();
  });
  it("Create a Operation", () => {
    cy.server();
    route();
    create_operation("bitcoin_testnet", 1, Cypress.env("address"), "0.001");
  });
});
