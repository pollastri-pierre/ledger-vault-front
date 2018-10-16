


describe('Logging into the workspace', function(){
  context('Login Page', function(){
    beforeEach(function(){
      const polyfillUrl = Cypress.env("polyfillUrl");
      cy.request(polyfillUrl).then(response => {
        polyfill = response.body;
      });
      cy.visit(Cypress.env('api_server'), {
        onBeforeLoad: win => {
          win.fetch = null;
          win.eval(polyfill);
          win.fetch = win.unfetch;
        }
      })
      cy
        .request("POST", Cypress.env('api_switch_device'), {
          device_number: 4
        })
      cy.server();

      it('Input the workspace name', function(){
        cy.get("input").type(Cypress.env("workspace"));
        cy.contains("continue").click();
        cy.wait("@authenticate");
      })

      it('Clic', ()=> {
      cy.get("[data-test=new-operation]").click();
    })

    })
  });
});
