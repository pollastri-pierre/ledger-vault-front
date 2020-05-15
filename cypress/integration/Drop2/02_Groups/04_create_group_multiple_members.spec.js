import {
  login,
  logout,
  route,
  successfull_message2,
} from "../../../functions/actions";

describe("Test Case for Create Groups with multiple member", function () {
  beforeEach(function () {
    login(4);
  });

  afterEach(function () {
    logout();
  });

  it("Create Group with 10 operators", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-groups]").click();
    cy.url().should("include", "/admin/groups");
    cy.get("[data-test=add-button]").click();
    cy.wait(2000);
    cy.get("[data-test=group_description]").type("Key accounts Ops by cypress");
    cy.get("#input_groups_users").type("Anna", { force: true }).type("{enter}");
    cy.get("#input_groups_users")
      .type("Aidan", { force: true })
      .type("{enter}");
    cy.get("#input_groups_users")
      .type("Thomas", { force: true })
      .type("{enter}");
    cy.get("#input_groups_users")
      .type("James", { force: true })
      .type("{enter}");
    cy.get("#input_groups_users")
      .type("Laura", { force: true })
      .type("{enter}");
    cy.get("#input_groups_users")
      .type("Sally", { force: true })
      .type("{enter}");
    cy.get("#input_groups_users")
      .type("Claudia", { force: true })
      .type("{enter}");
    cy.get("#input_groups_users")
      .type("Allison", { force: true })
      .type("{enter}");
    cy.get("#input_groups_users")
      .type("Tyler", { force: true })
      .type("{enter}");
    cy.get("#input_groups_users")
      .type("Charles", { force: true })
      .type("{enter}");
    cy.get("[data-test=group_name]").type("America Ops");
    cy.contains("Next").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    cy.get("[data-test=success_msg]").should(
      "contain",
      "Group request successfully created!",
    );
    cy.get("[data-test=success_msg]").should(
      "contain",
      "Your request to create a group has been submitted for approval.",
    );

    cy.contains("Done").click();
  });

  it("Approve America Ops Group", () => {
    cy.server();
    route();
    logout();
    login(5);
    cy.url().should("include", "/admin/dashboard");
    cy.get("[data-test=0]").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    successfull_message2();
  });

  it("Create Group with 5 operators", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-groups]").click();
    cy.url().should("include", "/admin/groups");
    cy.get("[data-test=add-button]").click();
    cy.wait(1500);
    cy.get("[data-test=group_description]").type(
      "Key accounts Ops group by cypress",
    );
    cy.get("#input_groups_users")
      .type("Laura", { force: true })
      .type("{enter}");
    cy.get("#input_groups_users")
      .type("Claudia", { force: true })
      .type("{enter}");
    cy.get("#input_groups_users")
      .type("Allison", { force: true })
      .type("{enter}");
    cy.get("#input_groups_users")
      .type("Tyler", { force: true })
      .type("{enter}");
    cy.get("#input_groups_users")
      .type("Charles", { force: true })
      .type("{enter}");
    cy.get("[data-test=group_name]").type("Key accounts Ops");
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
  });

  it("Approve Key accounts Ops group", () => {
    cy.server();
    route();
    logout();
    login(5);
    cy.url().should("include", "/admin/dashboard");
    cy.get("[data-test=0]").click();
    cy.get("[data-test=approve_button]").click({ force: true });
    successfull_message2();
  });
});
