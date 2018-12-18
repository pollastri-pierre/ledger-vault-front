/**
 * Default way to login. It clears the cache.
 */

 export function login(){
   const orga_name = Cypress.env("workspace");
   cy.route("post", "**/authentications/**").as("authenticate");
   cy.visit(Cypress.env('api_server'));
   cy.get("input").type(orga_name, { delay: 40 });
   cy.contains("continue").click();
   //cy.wait("@authenticate");
   cy
     .get(".top-message-body")
     .contains("Welcome to the Ledger Vault platform!")
     .get(".top-message-title")
     .contains("Hello");
   cy.url().should('include', '/dashboard');
 }

 /**
  * Default way to logout.
  */

 export function logout(){
   cy.contains("view profile").click({ force: true });
   cy.contains("logout").click();
   cy.url().should('include', '/logout');
   cy
     .get(".top-message-body")
     .contains("You have been successfully logged out. You can now safely close your web browser.")
     .get(".top-message-title")
     .contains("See you soon!");
 }

 /**
  * All the route
  */
 export function route(){
   cy.route("post", "**/abort").as("abort");
   cy.route("post", "**/logout").as("logout");
   cy.route("get", "**/dashboard").as("dashboard");
 }


 /**
  * Default way to switch device.
  */
 export function switch_device(id){
   cy
     .request("POST", Cypress.env('api_switch_device'), {
       device_number: id
     })
 }


 /**
  * Default way to create a account.
  */
export function create_account(currency,name){
  cy.get(".test-new-account").click();
  cy.contains(currency).click();
  cy.get("input").type(name);
  cy.contains("continue").click();
  cy.contains("Members").click();
  cy
    .get(".test-member-row")
    .eq(0)
    .click({ force: true });
  cy
    .get(".test-member-row")
    .eq(1)
    .click({ force: true });
  cy.contains("Done").click();
  cy.contains("Approvals").click();

  cy.get("input").clear();
  cy.get("input").type(2);
  cy.contains("done").click();
  cy.contains("continue").click();
  cy.contains("done").click();
  cy.wait(5500);

  //We should get a Account request created message
  cy
    .get(".top-message-body")
    .contains("the account request has been successfully created")
    .get(".top-message-title")
    .contains("account request created");
}
