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

  it("Create Whitelist with 8 address testnet", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-whitelists]").click();
    cy.get("[data-test=add-button]").click();
    cy.get("[data-test=whitelist_name]").type("List testnet");
    cy.get("[data-test=whitelist_description]").type("Cypress List testnet");
    cy.contains("Next").click({ force: true });

    add_whitelist_address(
      "Ethereum Ropsten",
      "eth rop 1",
      "0x687422eEA2cB73B5d3e242bA5456b782919AFc85",
    );
    add_whitelist_address(
      "Ethereum Ropsten",
      "eth rop 2",
      "0x285C9BCAEB9F6323ee9afB3Bf21be24f12509c38",
    );
    add_whitelist_address(
      "Ethereum Ropsten",
      "eth rop 3",
      "0x7198a905344D9C5160D5651030Cf40c5c4E82C20",
    );
    add_whitelist_address(
      "Ethereum Ropsten",
      "eth rop 4",
      "0xCD6dc124860D9ED67f4B7Cb408A55445b89246B4",
    );
    add_whitelist_address(
      "Bitcoin Testnet",
      "btc testnet 1",
      "mv4rnyY3Su5gjcDNzbMLKBQkBicCtHUtFB",
    );
    add_whitelist_address(
      "Bitcoin Testnet",
      "btc testnet 2",
      "mhqfUrHGnt4d9LA7Nxw82k32tUddJKHLmt",
    );
    add_whitelist_address(
      "Bitcoin Testnet",
      "btc testnet 3",
      "mrEsBqxWjpuSYsuJigsFLYpsV5nmmzfDAn",
    );
    add_whitelist_address(
      "Bitcoin Testnet",
      "btc testnet 4",
      "n1RVXgabmBNSVXJhbP8GttniwHaem2Br6y",
    );

    cy.contains("Next").click({ force: true });
    cy.get("[data-test=approve_button]").click();
    cy.get("[data-test=success_msg]").should(
      "contain",
      "Whitelist Request was successfully created!",
    );
    cy.contains("Done").click();
  });
});
