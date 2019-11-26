import {
  login,
  logout,
  route,
  add_whitelist_address,
} from "../../../functions/actions";

describe("Create whitelists", function() {
  beforeEach(function() {
    login(4);
  });

  afterEach(function() {
    logout();
  });

  it("Create Whitelist with 100 ", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-whitelists]").click();
    cy.get("[data-test=add-button]").click();
    cy.get("[data-test=whitelist_name]").type("List of 100");
    cy.get("[data-test=whitelist_description]").type("Cypress List 100");
    cy.contains("Next").click({ force: true });
    add_whitelist_address(
      "Bitcoin",
      "a1",
      "1Kz3tavs8BDVRsxFZcT29BN7HvqhsQZjmZ",
    );
    add_whitelist_address(
      "Bitcoin",
      "a2",
      "1H4C6zyNx14evZwo3JNgDzayz8qM7zSuW8",
    );
    add_whitelist_address(
      "Bitcoin",
      "a3",
      "193wwD9yr7t14GPxoHXNorzDvY1Pyc7ML9",
    );
    add_whitelist_address(
      "Ethereum",
      "eth1",
      "0x279364b789d700810A59351F46Ec7082c364363A",
    );
    add_whitelist_address(
      "Ethereum",
      "eth2",
      "0x2E69741B74add481780b7cE2E2b171109f241Ab7",
    );
    add_whitelist_address(
      "Ethereum",
      "eth3",
      "0xDBf89572c93fB9d096c67C7C08D17Fc0289Df1e9",
    );
    add_whitelist_address(
      "Ethereum",
      "eth4",
      "0xeb5476A683BA287A13614e073e1E761A65ac1aD0",
    );
    add_whitelist_address(
      "Ethereum",
      "eth5",
      "0xd694E4511F7C41176911f9395A6b73529e143690",
    );
    add_whitelist_address(
      "Bitcoin",
      "a4",
      "1C5gfE859y4aJwwX4cfx2XPwoBbnQMp6kk",
    );
    add_whitelist_address(
      "Bitcoin",
      "a5",
      "1LpFGYWHLPxcZmazpQboKATTzzJ5zuTCFV",
    );
    add_whitelist_address(
      "Bitcoin",
      "a6",
      "1HxwAQNhozpiC8Hz1EfP8DFQaKopxxd9VA",
    );
    add_whitelist_address(
      "Bitcoin",
      "a7",
      "1MR8MKMa48SSe1piTRAAcBKAqHnViVAk5i",
    );
    add_whitelist_address(
      "Bitcoin",
      "a8",
      "1AT1vvAtyVzUJrJ4b5JZqfVupvbXdxkdzr",
    );
    add_whitelist_address(
      "Bitcoin",
      "a9",
      "1H3LjxxThTSv3cVh4Qwq2HjZvdLYMZLcsX",
    );
    add_whitelist_address(
      "Bitcoin",
      "a10",
      "17jr4t1vHsLBPnramCepJwLsyTbgtgbduP",
    );
    add_whitelist_address(
      "Bitcoin",
      "a11",
      "1LVEiYfoLVxwRsJ9ADgKeKQJyusC4fiUzc",
    );
    add_whitelist_address(
      "Ethereum",
      "eth6",
      "0x854351b2E736370D64AE8E403b2E8B8947FD2c44",
    );
    add_whitelist_address(
      "Ethereum",
      "eth7",
      "0x3513e70029D635E6eeF15F6eb0de7C6C73aE6Da5",
    );
    add_whitelist_address(
      "Ethereum",
      "eth8",
      "0xAB2C616EF06c2729A82A8e169fCC907e1039927d",
    );
    add_whitelist_address(
      "Ethereum",
      "eth9",
      "0x201Ec1f48dea191aF2A203aEb90befB6388F37ee",
    );
    add_whitelist_address(
      "Ethereum",
      "eth10",
      "0xEC20C1cCE1a31048f62335854FCB761Cc46cD4d7",
    );
    add_whitelist_address("XRP", "xrp1", "rE2cojHqViz4Wdwphszmgeit6YGrbdqukq");
    add_whitelist_address("XRP", "xrp2", "rPkL9NoG3myvzGAEAk1yy6AGD1UtUxBtFq");
    add_whitelist_address("XRP", "xrp3", "rGjRHJ6twbh7iopqgAoiGrxY9RzQ4idHsP");
    add_whitelist_address("XRP", "xrp4", "rwswA6f1P61Y5GWifsijsx88dxT6HKAs2k");
    add_whitelist_address("XRP", "xrp5", "rBX7QfPE1EnktH73cjT83SkVFcmigo3cKX");
    add_whitelist_address("XRP", "xrp6", "rGt1A7KHDjq3UGmED9rgx6pU2ntn2nH2fw");
    add_whitelist_address("XRP", "xrp7", "r3F7H7qcRwWt3qBXMNCWM6ACt2EtR6aNYz");
    add_whitelist_address("XRP", "xrp8", "rageXHB6Q4VbvvWdTzKANwjeCT4HXFCKX7");
    add_whitelist_address("XRP", "xrp12", "rhZUtgKbFe9okpnSNKA3kK6XebFXjoJMzE");
    add_whitelist_address("XRP", "xrp13", "raZbwHuDm2HPPrVaeVWEFGdsM5YHrHUhjc");
    add_whitelist_address("XRP", "xrp14", "rQLhuQJVNBKYjwrdstWgUDDpT8Cjq3FCiH");
    add_whitelist_address("XRP", "xrp15", "rGXH6niPQdC4dmDMFEB9dVBuFP9UzUjPuE");
    add_whitelist_address("XRP", "xrp16", "rnzymRueV567sbUdu9fGijTQhHfULi9wup");
    add_whitelist_address("XRP", "xrp17", "rfHR5Nrt6zszarjLX5gm7eFtwDUbGJXpKU");
    add_whitelist_address("XRP", "xrp18", "rnryL4EiDzuqY94dW1ugjJJ1Aej4ir5LAG");
    add_whitelist_address("XRP", "xrp19", "rKEFXhcMaS54idLzfJNdgBzgR7eANtM6VR");
    add_whitelist_address("XRP", "xrp20", "rKxSPAL3dg1qv96EPNNyL3eJNYAxFD4DS5");
    add_whitelist_address("XRP", "xrp21", "rhGii17Hp7cHuHiBVNGHvvkqHTW5XnXezB");
    add_whitelist_address("XRP", "xrp22", "r4QzErj8t2VREt7dD82DJAWjASeGDh9orW");
    add_whitelist_address("XRP", "xrp23", "rLLMmvw6XENDkYqDxsKPRt2MEVRaVHTLMK");
    add_whitelist_address("XRP", "xrp24", "rfiF7nxNzNxkVWSWkdXkMcatnYyZmfCK5G");
    add_whitelist_address("DASH", "d1", "XvDwP5DtXR3RbV7pioFzgmQfbD7QeQ1JaG");
    add_whitelist_address("DASH", "d2", "XdAtXsoVL5aW7pKU3bhmKxsH4Gb8zS6HgC");
    add_whitelist_address("DASH", "d3", "Xvf5LwDtsva6zy9TUQC39sQTidS8sZQVb2");
    add_whitelist_address("DASH", "d4", "XxLxXQwRwVDKeH92FRe8WBCbzqy6nnKEWK");
    add_whitelist_address("DASH", "d5", "XfmPGLGTsUxJA8xDdmmmtmpcm2aUQ7ErnH");
    add_whitelist_address("DASH", "d6", "XyH9uxmiLvmX5MV4eV86BsP5YEVsugV5ZE");
    add_whitelist_address("DASH", "d7", "XdeP7fakg39y38jXPpZHVN3LtCVYF6ciLD");
    add_whitelist_address("DASH", "d8", "XekwEqbD6i8rVoGJpWMUdyGETCzkcSdaiH");
    add_whitelist_address("DASH", "d9", "XrJprnKh5vam9pBE1Z9YbYmYVaTPJgpLb5");
    add_whitelist_address("DASH", "d10", "XrodRf4rDpjtcgPRgQ7fc38YyXrpAaAFAA");
    add_whitelist_address("DASH", "d11", "XpWDHBreKXA8FouLxoDCshPv3rovnUUe9f");
    add_whitelist_address("DASH", "d12", "XwVifXGniRyf5a96PN7xKdaMammsZgUVv1");
    add_whitelist_address("DASH", "d13", "Xde1HY3sTcgRgsiAK16vDqXDfRPk6RrWB4");
    add_whitelist_address("DASH", "d14", "XmukwEdfFbc7XGMwDJqCpQM64u5XJJAceD");
    add_whitelist_address("DASH", "d15", "XnpVz7MN8X7bLQD2FpGzzoGvKthB6hadVw");
    add_whitelist_address("DASH", "d16", "XkQUpYeQZoZULTZ7FJFtCdnAqsrPbRUnAR");
    add_whitelist_address("DASH", "d17", "Xj3rHSaoQjJNveyv44eMgHAUay2yWe4oXu");
    add_whitelist_address("DASH", "d18", "Xu9Zyzxiy3cm2LGSTWkZzNmQk1cd6NfNPZ");
    add_whitelist_address("DASH", "d19", "XhvFpe99UnH6ZKw4VhPes1BSxEmissSJd2");
    add_whitelist_address("DASH", "d20", "XwusftEKTnvHoeXgy8FGoRxDxvvpSDAbuJ");
    add_whitelist_address("VTC", "v1", "Vr1eKA82WUYj193YZiPK13F6FrhpoKYAeT");
    add_whitelist_address("VTC", "v2", "VihZLWkSduar9dCDfdgXgUdLdu5QSyfPsF");
    add_whitelist_address("VTC", "v3", "VevEzrhat4iHEaGKJZLiKUjCzBsw8A28Sj");
    add_whitelist_address("VTC", "v4", "VucZ4xj5CCLUQb5wGaJfoXY1waTwHnDXsr");
    add_whitelist_address("VTC", "v5", "VaUVaxPByjR36B2vkSdZpEGhZZqo5b6Awk");
    add_whitelist_address("VTC", "v6", "VdDwKkooUNCLKy4ynuTrDh1ErihtJsU7Z2");
    add_whitelist_address("VTC", "v7", "VaxEvmVrAxL4xgNtXp6Yngo7KZ8fJ8FTpw");
    add_whitelist_address("VTC", "v8", "VbdHf163NmJyahLYz3vYQRLZ4BWTGKEau9");
    add_whitelist_address("VTC", "v9", "Vmy7EgVqAKJbfGQqHP2ovUTwhsijD9jqsx");
    add_whitelist_address("VTC", "v10", "VbKjDNFSNGc7uQvDjFTYkjzgZDNtiZJ6Cn");
    add_whitelist_address("VTC", "v11", "VfZce2oAAxNSJoBMn3iFXAnDs9gZdr7o5F");
    add_whitelist_address("VTC", "v12", "Vg75kx3RHARAa2PnrCr1W8vh6sH31ETEjJ");
    add_whitelist_address("VTC", "v13", "VrhWpCZRahW3RJHKu9Ndh5RTFGp4SdEHRa");
    add_whitelist_address("VTC", "v14", "Vv9pPXg8qcDYJBKiCH6iHZ7yos1FD1eQVp");
    add_whitelist_address("VTC", "v15", "VimkxvjnAhJwTmsQ3XEwfPyfahAobWJT8P");
    add_whitelist_address("VTC", "v16", "Vv6WchKNp5rynoGCuQRLcjnRGsXKM8VuBd");
    add_whitelist_address("VTC", "v17", "VreNDZAKWEMQE26joJ7B4EogBgtoPKmGwh");
    add_whitelist_address("VTC", "v18", "VfdTbxB4GuEhSF95GmwE1HQZPo8UaMbXme");
    add_whitelist_address("VTC", "v19", "VoYDYC6SmCu1TQShV6d3NCT8dQS6MKvyvj");
    add_whitelist_address("VTC", "v20", "VaDJpRG9QRJmupHZMGbdteDRUuaTp538DA");
    add_whitelist_address(
      "Bitcoin Testnet",
      "t3",
      "n4WsmEQ2Vtr3PEmCJUeGvJMPGAbeK43V5v",
    );
    add_whitelist_address(
      "BCH",
      "bch 1",
      "bitcoincash:qz9qh2h2xgfydfx8e3p4x2pmez6r33vapve045gfju",
    );
    add_whitelist_address(
      "Bitcoin Testnet",
      "btc t1",
      "mi25jGm2r23FCjVv58m3X3M69gwtg3JDdq",
    );
    add_whitelist_address(
      "Bitcoin Testnet",
      "btc t2",
      "my3fazJ8gs8gZunPHdGRwLe99KbZ7sNdJU",
    );
    add_whitelist_address(
      "DOGE",
      "doge1",
      "DTUQCFwJsugdnUAsn4Ep8X4hssagepJYxQ",
    );
    add_whitelist_address(
      "Ethereum Ropsten",
      "eth rop 1",
      "0xFB20dD015146DA5303A476cc70c91F236E734AE1",
    );
    add_whitelist_address(
      "Ethereum Ropsten",
      "eth rop 2",
      "0x61DB4d4D5102807c3c931B93b69fEc2A454ab402",
    );
    add_whitelist_address(
      "Ethereum Ropsten",
      "eth rop 3",
      "0xE8A2403EA32E414Ab6b81C90184027D64B1a3468",
    );
    add_whitelist_address("LTC", "ltc1", "LRGN2cDM2hpNZuH8VEyg67ksPjLdUsRZxy");
    add_whitelist_address(
      "PIVX",
      "PIVX1",
      "D5KFoSTYmJ6dnDjxFhJ5ECDX8CKvo4THxy",
    );
    add_whitelist_address("VIA", "VIA1", "VbA7PEhGCJWKCiJ3y8ooiKqjQ1LNfrCg9k");
    add_whitelist_address("KMD", "KMD 2", "RUC4rqH3QxmhhNZZwTTp2PWgHB9VED82Hr");
    add_whitelist_address("KMD", "KMD1", "RPFsSVtrcGRFGQqGsZSrEBD1rnojrD9zJr");
    add_whitelist_address("DGB", "dgb1", "D5AdK4LBNWEyVBeUtxjZr4UqeLTT9Suh3b");
    add_whitelist_address("KMD", "kmd 3", "RPJUvuWZhoiG31qoeBAtFNER6H7iYHqFqt");
    add_whitelist_address("KMD", "kmd 4", "RGRv6PsbUNJSrDtmqHjwceWwMS5YukAbbK");
    add_whitelist_address("KMD", "kmd 5", "R9KkNuVBMaT7CuUcZg3EC7Q1q9Fr1ibYcb");
    cy.contains("Next").click({ force: true });
    cy.get("[data-test=approve_button]").click();
    cy.get("[data-test=success_msg]").should(
      "contain",
      "Whitelist Request was successfully created!",
    );
    cy.get("[data-test=close]")
      .eq(1)
      .click();
  });
});
