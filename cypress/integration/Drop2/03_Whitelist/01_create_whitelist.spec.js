import {
  login,
  logout,
  route,
  add_whitelist_address,
} from "../../../functions/actions";

describe("Create whitelist", function() {
  beforeEach(function() {
    login(4);
  });

  afterEach(function() {
    logout();
  });

  it("Create Whitelist with 5 address", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-whitelists]").click();
    cy.get("[data-test=add-button]").click();
    cy.get("[data-test=whitelist_name]").type("List Apac");
    cy.get("[data-test=whitelist_description]").type("Cypress List Apac");
    cy.contains("Next").click({ force: true });

    add_whitelist_address(
      "Bitcoin",
      "btc 1",
      "36R3kWz9u5q955JBY4MfqhPkDmvGrH4oHX",
    );
    add_whitelist_address(
      "Ethereum",
      "eth 1",
      "0x667F9BE94a42458cb53A3A66511Dca19b397738d",
    );
    add_whitelist_address("XRP", "XRP 1", "rZvBc5e2YR1A9otS3r9DyGh3NDP8XLLp4");
    add_whitelist_address(
      "Bitcoin",
      "btc 2",
      "1Mj9jzHtAyVvM9Y274LCcfLBBBfwRiDK9V",
    );
    add_whitelist_address(
      "Bitcoin",
      "btc segwit 1",
      "bc1q3xu8x4n866xpw83jsg20kawuh6nm70shamtpad",
    );
    add_whitelist_address(
      "Bitcoin",
      "btc segwit 2",
      "bc1qcskd9vxagrhsrqueyf7rs4ppmkug6t2vz3xze7",
    );
    add_whitelist_address(
      "Bitcoin",
      "btc segwit 3",
      "bc1qtpnqcnfmfy6pjsf6wknhvyaswppkax2thmfcnp",
    );
    add_whitelist_address(
      "Ethereum",
      "eth 2",
      "0x6b3493FE181EA283e0335e5D8D768e2122bC6c18",
    );

    cy.contains("Next").click({ force: true });
    cy.get("[data-test=approve_button]").click();
    cy.get("[data-test=success_msg]").should(
      "contain",
      "Whitelist request successfully created!",
    );
    cy.contains("Done").click();
  });
});
