const orga_name = "vault14";
context("Onboarding", () => {
  it("redirect to onboarding", () => {
    cy.visit("https://localhost:9000");
    cy.get("input").type(orga_name);
    cy.contains("continue").click();
  });

  it("should see welcome and click on get started", () => {
    cy.contains("Get Started").click();
  });

  it("should see Prerequisites and click on continue", () => {
    cy.contains("continue").click();
  });

  it("should see Backup and click on continue", () => {
    cy.contains("continue").click();
  });

  it("should see Init and click on continue", () => {
    cy.contains("continue").click();
  });

  it("should see Signin and click on signin", () => {
    cy.wait(2000);
    cy.contains("SIGN IN").click();
    cy.wait(2000);
    cy.contains("SIGN IN").click();
    cy.wait(2000);
    cy.contains("SIGN IN").click();
    cy.wait(2000);
    cy.contains("Continue").click();
  });

  it("should see Prerequisites and click on continue", () => {
    cy.contains("continue").click();
  });

  it("should see Initialization and click on continue", () => {
    cy.contains("continue").click();
  });

  it("should see Register and add admin", () => {
    cy.request("POST", "http://localhost:5001/switch-device", {
      device_number: 1
    });
    cy.wait(1000);
    cy.contains("add administrator").click();
    cy.get("input[name=first_name]").type("user1");
    cy.get("input[name=last_name]").type("user1");
    cy.get("input[name=email]").type("user1@user.com");
    cy.contains("Continue").click();

    cy.wait(2000);
    cy.request("POST", "http://localhost:5001/switch-device", {
      device_number: 2
    });
    cy.wait(1000);

    cy.contains("add administrator").click();
    cy.get("input[name=first_name]").type("user2");
    cy.get("input[name=last_name]").type("user2");
    cy.get("input[name=email]").type("user2@ledger.fr");
    cy.contains("Continue").click();

    cy.wait(2000);
    cy.request("POST", "http://localhost:5001/switch-device", {
      device_number: 3
    });
    cy.wait(1000);

    cy.contains("add administrator").click();
    cy.get("input[name=first_name]").type("user3");
    cy.get("input[name=last_name]").type("user3");
    cy.get("input[name=email]").type("user3@ledger.fr");
    cy.contains("Continue").click();

    cy.wait(2000);

    cy.contains("continue").click();
  });

  it("should see administration scheme and click on more", () => {
    cy.contains("more").click();
    cy.contains("more").click();
    cy.contains("more").click();
    cy.contains("less").click();

    cy.contains("continue").click();
  });

  it("should see signin scheme and sign with admins", () => {
    cy.request("POST", "http://localhost:5001/switch-device", {
      device_number: 1
    });
    cy.wait(1000);

    cy.get(".test-onboarding-signin").click();
    cy.wait(2000);

    cy.request("POST", "http://localhost:5001/switch-device", {
      device_number: 2
    });
    cy.wait(1000);

    cy.get(".test-onboarding-signin").click();
    cy.wait(2000);

    cy.request("POST", "http://localhost:5001/switch-device", {
      device_number: 3
    });
    cy.wait(1000);

    cy.get(".test-onboarding-signin").click();
    cy.wait(2000);

    cy.contains("continue").click();
  });
  it("should see Prerequisites scheme and click on more", () => {
    cy.contains("continue").click();
  });

  it("should see Backup scheme and click on more", () => {
    cy.contains("continue").click();
  });

  it("should see Init scheme and click on more", () => {
    cy.contains("continue").click();
  });

  it("should see Masterseed scheme and click on more", () => {
    cy.request("POST", "http://localhost:5001/switch-device", {
      device_number: 1
    });
    cy.wait(1000);

    cy
      .get(".test-onboarding-seed")
      .eq(0)
      .click();
    cy.wait(2000);

    cy.request("POST", "http://localhost:5001/switch-device", {
      device_number: 2
    });
    cy.wait(1000);

    cy
      .get(".test-onboarding-seed")
      .eq(1)
      .click();
    cy.wait(2000);

    cy.request("POST", "http://localhost:5001/switch-device", {
      device_number: 3
    });
    cy.wait(1000);
    cy
      .get(".test-onboarding-seed")
      .eq(0)
      .click();
    cy.wait(2000);

    cy.contains("continue").click();
  });

  it("should see confirmation and click continue", () => {
    cy.contains("continue").click();
  });
});
