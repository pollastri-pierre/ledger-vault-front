import {
  login,
  logout,
  route,
  successfull_message,
} from "../../functions/actions";

describe("Test Case for Create Groups with multiple member", function() {
  beforeEach(function() {
    login(6);
  });

  afterEach(function() {
    logout();
  });

  it("Create Group with 10 operators", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-groups]").click();
    cy.url().should("include", "/admin/groups");
    cy.get("[data-test=buttonCreate]").click();
    cy.wait(2000);
    cy.get("[data-test=group_name]").type("America Ops");
    cy.get("[data-test=group_description]").type("Key accounts Ops by cypress");
    cy.contains("Next").click();
    cy.wait(1500);
    cy.get("#input_groups_users")
      .type("Anna", { force: true })
      .type("{enter}");
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
    cy.contains("Select group members").click();
    cy.contains("Next").click();
    cy.get("[data-test=approve_button]").click();
    cy.wait(2500);
    successfull_message();
  });

  it("Approve America Ops Group", () => {
    cy.server();
    route();
    login(5);
    cy.url().should("include", "/admin/dashboard");
    cy.get("[data-test=menuItem-groups]").click();
    cy.url().should("include", "/admin/groups");
    cy.wait(2500);
    cy.contains("America Ops").click();
    cy.wait(1500);
    cy.get("[data-test=approve_button]").click();
    successfull_message();
    cy.get("[data-test=close]").click();
  });

  it("Create Group with 5 operators", () => {
    cy.server();
    route();
    cy.get("[data-test=menuItem-groups]").click();
    cy.url().should("include", "/admin/groups");
    cy.get("[data-test=buttonCreate]").click();
    cy.wait(2000);
    cy.get("[data-test=group_name]").type("Key accounts Ops");
    cy.get("[data-test=group_description]").type(
      "America Ops group by cypress",
    );
    cy.contains("Next").click();
    cy.wait(1500);
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
    cy.contains("Next").click();
    cy.get("[data-test=approve_button]").click();
    cy.wait(2500);
    successfull_message();
  });

  it("Approve Key accounts Ops group", () => {
    cy.server();
    route();
    login(5);
    cy.url().should("include", "/admin/dashboard");
    cy.get("[data-test=menuItem-groups]").click();
    cy.url().should("include", "/admin/groups");
    cy.wait(2500);
    cy.contains("Key accounts Ops").click();
    cy.wait(1500);
    cy.get("[data-test=approve_button]").click();
    successfull_message();
    cy.get("[data-test=close]").click();
  });
});
