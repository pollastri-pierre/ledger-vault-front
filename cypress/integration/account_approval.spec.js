const orga_name = "vault16";
context("Account approval", () => {
  it("redirect to login", () => {
    // set the current device to device 1
    cy.request("POST", "http://localhost:5001/switch-device", {
      device_number: 1
    });
    // go to the vault homepage
    cy.visit("https://localhost:9000");
    cy.get("input").type(orga_name);
    cy.contains("continue").click();

    // click on Pending in the menu
    cy.contains("Pending").click();

    // click on the first pending account to open the pending request modal
    cy
      .get(".test-pending-account")
      .eq(0)
      .click();

    // click on approve to approve, it will display the device modal
    cy.contains("Approve").click();

    // logout the current user
    cy.contains("view profile").click();
    cy.contains("logout").click();

    // set the current device to device 2
    cy.request("POST", "http://localhost:5001/switch-device", {
      device_number: 2
    });
    cy.wait(1000);

    // login with the new user 2
    cy.get("input").type(orga_name);
    cy.contains("continue").click();
    // click on Pending in the menu
    cy.contains("Pending").click();
    // click on first pending account
    cy
      .get(".test-pending-account")
      .eq(0)
      .click();
    // click on approve
    cy.contains("Approve").click();
  });
});
