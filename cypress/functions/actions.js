// Default way to login. It clears the cache

export function login(id) {
  const orga_name = Cypress.env("workspace");
  cy.visit(Cypress.env("api_server"));
  cy.clearCookies();
  switch_device(id);
  cy.get("input[type=text]").type(orga_name, { delay: 40 });
  cy.get("[data-test=continue_button]").click();
  cy.wait(2500);
  cy.url().should("include", "/dashboard");
}

/**
 * Default way to logout.
 */

export function logout() {
  cy.get("[data-test=logout]").click({ force: true });
  cy.wait(1500);
  cy.get(".top-message-body")
    .contains(
      "You have been successfully logged out. You can now safely close your web browser.",
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
  cy.route("post", "**/accounts?status=**").as("new-account");

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
  cy.route("post", `${API_DEVICE}/u2f-register-data`).as("register-data");
  cy.route("post", `${API_DEVICE}/generate-key-fragments`).as(
    "generate-key-fragments",
  );
  cy.route("post", `${API_DEVICE}/validate-vault-operation`).as(
    "validate-vault-operation",
  );
  cy.route("post", `${API_DEVICE}/meta/store`).as("meta-store");

  // Accounts
  cy.route("post", "**/challenge?account_type=Bitcoin").as("account_Bitcoin");
  cy.route("post", "**/challenge?account_type=Ethereum").as("account_Ethereum");
  cy.route("post", "**/challenge?account_type=Erc20").as("account_ERC20");
  cy.route("post", "**/accounts").as("accounts");
  cy.route("get", "**/accounts/pending").as("pending");
  cy.route("get", "**/accounts?status=ACTIVE&status=VIEW_ONLY").as(
    "approve_acc",
  );
}

/**
 * Default way to switch device.
 */
export function switch_device(id) {
  cy.request("POST", Cypress.env("api_switch_device"), {
    device_number: id,
  });
}

export function approve() {
  cy.request("POST", Cypress.env("approve_cancel_device"), {
    approve: true,
  });
}

export function cancel() {
  cy.request("POST", Cypress.env("approve_cancel_device"), {
    approve: false,
  });
}

/** ****************************************************************************
 ***************************** DROP 2 ******************************************
 **************************************************************************** */

export function create_user(username, userID, role) {
  cy.get("[data-test=add-button]").click();
  cy.get(role).click();
  cy.get("[data-test=username]").type(username);
  cy.get("[data-test=userID]").type(userID);
  cy.contains("Next").click();
  cy.contains("Done").click();
  cy.get("[data-test=success_msg]").should(
    "contain",
    "User invitation request successfully created!",
  );
  cy.get("[data-test=success_msg]").should(
    "contain",
    "You can now share the registration URL with the new user.",
  );
  cy.get("[data-test=close]").click();
}

export function create_group(groupName, description, user1, user2, user3) {
  cy.get("[data-test=add-button]").click();
  cy.wait(2000);
  cy.get("[data-test=group_name]").type(groupName);
  cy.get("#input_groups_users")
    .type(user1, { force: true })
    .type("{enter}");
  cy.get("#input_groups_users")
    .type(user2, { force: true })
    .type("{enter}");
  cy.get("#input_groups_users")
    .type(user3, { force: true })
    .type("{enter}");
  cy.get("[data-test=group_description]").type(description);

  cy.contains("Next").click();
  cy.get("[data-test=approve_button]").click({ force: true });
  cy.wait(2500);
  cy.get("[data-test=success_msg]").should(
    "contain",
    "Group request successfully created!",
  );
  cy.get("[data-test=success_msg]").should(
    "contain",
    "Your request to create a group has been submitted for approval.",
  );

  cy.contains("Done").click();
}

export function successfull_msg_gp() {
  cy.get("[data-test=success_msg]").should(
    "contain",
    "Group request successfully created!",
  );
  cy.get("[data-test=success_msg]").should(
    "contain",
    "Your request to update this group has been submitted for approval.",
  );

  cy.contains("Done").click();
}

export function successfull_message() {
  cy.get(".top-message-body")
    .contains("The request has been successfully created")
    .get(".top-message-title")
    .contains("request created");
}

export function successfull_message2() {
  cy.get("[data-test=successfull_message]").should("contain", "Successfully");
  cy.wait(1000);
  cy.get("[data-test=done_button]").click();
}

export function error_message(title, message) {
  cy.get("[data-test=error-message-title]")
    .contains(title)
    .get("[data-test=error-message-desc]")
    .contains(message);
}

export function success_creation_account() {
  cy.get("[data-test=success_msg]").should(
    "contain",
    "Account request successfully created!",
  );
  cy.get("[data-test=success_msg]").should(
    "contain",
    "Your request to create an account has been submitted for approval.",
  );
  cy.contains("Done").click();
}
export function success_edit_account() {
  cy.get("[data-test=success_msg]").should(
    "contain",
    "Account request successfully created!",
  );
  cy.get("[data-test=success_msg]").should(
    "contain",
    "Your request to edit an account has been submitted for approval.",
  );
  cy.contains("Done").click();
}

export function success_tx() {
  cy.get("[data-test=success_msg]").should(
    "contain",
    "Transaction request successfully created!",
  );
  cy.get("[data-test=success_msg]").should(
    "contain",
    "Your request to create a transaction has been submitted for approval.",
  );
  cy.contains("Done").click();
}

/**
 * Account Transaction Rules creation
 */

export function add_account_name(currency, name) {
  cy.get("[data-test=add-button]").click();
  cy.wait(4500);
  cy.get("#input_crypto")
    .type(currency, { force: true })
    .type("{enter}");
  cy.get("[data-test=account_name]").type(name);
  cy.contains("Next").click();
}

export function select_creator_group(group) {
  cy.get("[data-test=select_tx_rule]")
    .eq(0)
    .click();
  cy.get("#input_groups_users")
    .type(group, { force: true })
    .type("{enter}");
  cy.get("[data-test=select-arrow]").click();
  cy.get("[data-test=approve_button]").click();
}

export function select_creator_operators(operator1, operator2, operator3) {
  cy.get("[data-test=select_tx_rule]")
    .eq(0)
    .click();
  cy.get("#input_groups_users")
    .type(operator1, { force: true })
    .type("{enter}");
  cy.get("#input_groups_users")
    .type(operator2, { force: true })
    .type("{enter}");
  cy.get("#input_groups_users")
    .type(operator3, { force: true })
    .type("{enter}");
  cy.get("[data-test=select-arrow]").click();
  cy.get("[data-test=approve_button]").click();
}

export function add_amount_range(min, max) {
  cy.get("[data-test=select_tx_rule]")
    .eq(0)
    .click();
  cy.get("[data-test=input_amount]")
    .eq(0)
    .type(min, { force: true })
    .type("{enter}");
  cy.get("[data-test=input_amount]")
    .eq(1)
    .type(max, { force: true })
    .type("{enter}");
  cy.get("[data-test=approve_button]").click();
}

export function no_limit() {
  cy.get("[data-test=select_tx_rule]")
    .eq(0)
    .click();
  cy.get('[type="checkbox"]').check();
  cy.get("[data-test=approve_button]").click();
}

export function add_whitelist(id, list) {
  cy.get("[data-test=select_tx_rule]")
    .eq(id)
    .click();
  cy.get("#input_whitelist")
    .type(list, { force: true })
    .type("{enter}");
  cy.get("[data-test=select-arrow]").click();
  cy.get("[data-test=approve_button]").click();
}
export function add_multi_whitelist(id, list1, list2) {
  cy.get("[data-test=select_tx_rule]")
    .eq(id)
    .click();
  cy.get("#input_whitelist")
    .type(list1, { force: true })
    .type("{enter}");
  cy.get("#input_whitelist")
    .type(list2, { force: true })
    .type("{enter}");
  cy.get("[data-test=select-arrow]").click();
  cy.get("[data-test=approve_button]").click();
}

export function add_approval_step_group(id, group) {
  cy.get("[data-test=select_tx_rule]")
    .eq(id)
    .click();
  cy.get("#input_groups_users")
    .type(group, { force: true })
    .type("{enter}");
  cy.get("[data-test=rightANgle]").click({ force: true });
  cy.get("[data-test=approve_button]").click();
}
export function add_approval_step_operators(
  id,
  operator1,
  operator2,
  operator3,
) {
  cy.get("[data-test=select_tx_rule]")
    .eq(id)
    .click();
  cy.get("#input_groups_users")
    .type(operator1, { force: true })
    .type("{enter}");
  cy.get("#input_groups_users")
    .type(operator2, { force: true })
    .type("{enter}");
  cy.get("#input_groups_users")
    .type(operator3, { force: true })
    .type("{enter}");
  cy.get("[data-test=rightANgle]").click({ force: true });
  cy.get("[data-test=approve_button]").click();
}
export function provide_viewonly_rule(name, groups, user1) {
  cy.get("[data-test=view_only_provide_rules]").click();
  cy.wait(5500);
  cy.get("[data-test=account_name]").should("have.value", name);
  cy.contains("Next").click();
  cy.get("#input_groups_users")
    .type(groups, { force: true })
    .type("{enter}");
  cy.get("[data-test=rightANgle]").click();
  cy.contains("Add approval").click();
  cy.get("input#input_groups_users")
    .eq(1)
    .type(user1, { force: true })
    .type("{enter}");
  cy.contains("Next").click();
  cy.get("[data-test=approve_button]").click({ force: true });
  cy.wait(3500);
}

export function approve_tx() {
  cy.url().should("include", "/operator/dashboard");
  cy.get("[data-test=awaiting-approval]").click();
  cy.get("[data-test=approve_button]").click({ force: true });
  cy.wait(4500);
  successfull_message2();
}

export function revoke_users(name) {
  cy.get("[data-test=menuItem-users]").click();
  cy.url().should("include", "/admin/users");
  cy.contains(name).click();
  cy.get("[data-test=approve_button]").click({ force: true });
  cy.get("[data-test=Confirm]").click();
  cy.wait(2500);
  login(5);
  cy.get("[data-test=menuItem-users]").click();
  cy.contains(name).click();
  cy.get("[data-test=approve_button]").click({ force: true });
}

export function add_whitelist_address(currency, name, address) {
  cy.get("[data-test=add_address]").click();
  cy.get("#input_crypto")
    .type(currency, { force: true })
    .type("{enter}");
  cy.get("[data-test=name_address]").type(name);
  cy.get("[data-test=address]").type(address);
  cy.get("[data-test=ok_button]").click();
}
