/**
 * Default way to login. It clears the cache.
 */

export function login(id) {
  const orga_name = Cypress.env("workspace");
  cy.visit(Cypress.env("api_server"));
  cy.clearCookies();
  switch_device(id);
  cy.get("input[type=text]").type(orga_name, { delay: 40 });
  cy.contains("Continue").click();
  cy.wait(2000);
  cy.get(".top-message-body")
    .contains("Welcome to the Ledger Vault platform!")
    .get(".top-message-title")
    .contains("Hello");
  cy.url().should("include", "/dashboard");
}

/**
 * Default way to logout.
 */

export function logout() {
  //cy.contains("view profile").click({ force: true });
  cy.get("[data-test=view-profile]").click({ force: true });
  cy.contains("Logout").click();
  //cy.wait("@logout");
  cy.wait(2000);
  cy.get(".top-message-body")
    .contains(
      "You have been successfully logged out. You can now safely close your web browser."
    )
    .get(".top-message-title")
    .contains("See you soon!");
}

/**
 * All the route
 */
export function route() {
  // workspace
  cy.route("post", "**/authentications/logout").as("logout");
  cy.route("post", "**/abort").as("abort");
  cy.route("get", "**/dashboard").as("dashboard");
  cy.route("get", "**/pending").as("pending");
  cy.route("post", "**/approve").as("approve");
  cy.route("post", "**/authentications/**").as("authenticate");
  cy.route("post", "**/validation/**").as("validation");
  cy.route("post", "**/fees").as("fees");
  cy.route("post", "**/people").as("people");
  cy.route("post", "**/organization").as("organization");
  cy.route("post", "**/accounts/status/**").as("new-account");

  // onboarding
  const orga_name = Cypress.env("workspace");
  const API = `${Cypress.env("api_server2")}/${orga_name}`;
  cy.route("post", `${API}/onboarding/next`).as("next");
  cy.route("post", `${API}/onboarding/authenticate`).as("authenticate");
  cy.route("post", `${API}/onboarding/challenge`).as("challenge");

  // Device
  const API_DEVICE = Cypress.env("api_device");
  cy.route("post", `${API_DEVICE}/get-public-key`).as("get-public-key");
  cy.route("get", `${API_DEVICE}/get-attestation`).as("get-attestation");
  cy.route("post", `${API_DEVICE}/open-session`).as("open-session");
  cy.route("post", `${API_DEVICE}/register`).as("register");
  cy.route("post", `${API_DEVICE}/generate-key-fragments`).as(
    "generate-key-fragments"
  );
  cy.route("post", `${API_DEVICE}/validate-vault-operation`).as(
    "validate-vault-operation"
  );
  cy.route("post", `${API_DEVICE}/meta/store`).as("meta-store");

  // Accounts
  cy.route("post", "**/challenge?account_type=Bitcoin").as("account_Bitcoin");
  cy.route("post", "**/challenge?account_type=Ethereum").as("account_Ethereum");
  cy.route("post", "**/challenge?account_type=ERC20").as("account_ERC20");
  cy.route("post", "**/accounts").as("accounts");
  cy.route("get", "**/accounts/pending").as("pending");
  cy.route("get", "**/accounts/status/APPROVED,VIEW_ONLY").as("approve_acc");
}

/**
 * Default way to switch device.
 */
export function switch_device(id) {
  cy.request("POST", Cypress.env("api_switch_device"), {
    device_number: id
  });
}

export function approve() {
  cy.request("POST", Cypress.env("approve_cancel_device"), {
    approve: true
  });
}

export function cancel() {
  cy.request("POST", Cypress.env("approve_cancel_device"), {
    approve: false
  });
}

/**
 * Default way to create a account.
 */
export function create_account(currency, name) {
  cy.get(".test-new-account").click();
  cy.get("#input_crypto")
    .type(currency, { force: true })
    .type("{enter}");
  cy.get("input[type=text]").type(name);
  cy.get("[data-test=dialog-button]").click();
  cy.contains("Members").click();
  cy.get(".test-member-row")
    .eq(0)
    .click({ force: true });
  cy.get(".test-member-row")
    .eq(1)
    .click({ force: true });
  cy.get("[data-test=dialog-button]").click();
  cy.contains("Approvals").click();

  cy.get("input[type=text]").clear();
  cy.get("input[type=text]").type(2);
  cy.contains("done").click();
  cy.get("[data-test=dialog-button]").click();
  cy.contains("done").click();
  cy.wait(8000);

  //We should get a Account request created message
  cy.get(".top-message-body")
    .contains("the account request has been successfully created")
    .get(".top-message-title")
    .contains("account request created");
}

/**
 * Default way to create approve a account.
 */
export function approve_account(currency, name, fiat) {
  cy.contains("Pending").click();
  cy.url().should("include", "/pending");
  cy.wait(2000);
  cy.get("[data-test=name]")
    .contains(name)
    .click();

  // Checking Value
  cy.get("[data-test=balance]").contains(fiat);
  //cy.get("[data-test=balance]").contains("USD");
  cy.get("[data-test=requested]").should("be.visible");
  cy.get("[data-test=name]").contains(name);
  cy.get("[data-test=currency]").contains(currency);
  cy.get("button")
    .contains("Approve")
    .should("be.visible");
  cy.get("button")
    .contains("Abort")
    .should("be.visible");
  cy.get("button")
    .contains("Close")
    .should("be.visible");
  cy.get("button")
    .contains("Approve")
    .click();
  cy.wait(2500);
  cy.get(".top-message-body")
    .contains("the account request has been successfully approved")
    .get(".top-message-title")
    .contains("account request approved");
}

/**
 * Default way to create a operation.
 */
export function create_operation(name, id, address, amount) {
  cy.get("[data-test=new-operation]").click();
  cy.get("[data-test=operation-creation-accounts]")
    .contains(name)
    .click();
  cy.get("[data-test=crypto-address-picker]")
    .find("input")
    .type(address);
  cy.get("[data-test=operation-creation-amount]")
    .find("input")
    .type(amount);
  cy.wait(6000);
  cy.contains("Continue").click();
  cy.contains("Continue").click();
  cy.get("[data-test=dialog-button]")
    .contains("Confirm")
    .click({ force: true });
  cy.wait(6500);
  cy.get(".top-message-body")
    .contains("the operation request has been successfully created")
    .get(".top-message-title")
    .contains("operation request created");
}

/**
 * Default way to approve a operation.
 */
export function approve_operation(name) {
  cy.contains("Pending").click();
  cy.url().should("include", "/pending");
  cy.wait(2000);
  cy.get("[data-test=pending-operation]")
    .eq(0)
    .click();
  cy.get("[data-test=name]").contains(name);

  cy.get("button")
    .contains("Approve")
    .should("be.visible");
  cy.get("button").contains("Abort");
  cy.get("button").contains("Close");
  cy.get("[data-test=dialog-button]")
    .contains("Approve")
    .click({ force: true });
  cy.wait(2000);
  cy.get(".top-message-body")
    .contains("the operation request has been successfully approved")
    .get(".top-message-title")
    .contains("operation request approved");
}
