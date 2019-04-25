import {
  login,
  logout,
  route,
  revoke_users,
  successfull_message,
} from "../../functions/actions";

describe("Tests Creation Account", function() {
  beforeEach(function() {
    login(4);
  });

  afterEach(function() {
    logout();
  });

  it("Revoke Operator", () => {
    cy.server();
    route();
    revoke_users("Aidan Fisher");
    successfull_message();
  });

  it("Revoke Admin", () => {
    cy.server();
    route();
    revoke_users("user4");
    successfull_message();
  });
});
