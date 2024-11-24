describe('Form tests',()=>{
    beforeEach(()=>{
        cy.visit('http://localhost:5173/login')
    })

    it('should accept only valid emails',()=>{
        cy.contains('Log in Here')
        cy.get("form").find("#email").type("wnjikuhellen@gmail.com")
        cy.get("form").find("#password").type("123@Password")
        cy.get("button").click();
        // cy.get("Toaster").should("be.visible");
    })

    it('should check that no fields are empty',()=>{
        cy.get("form").find("#email").type("wnjikuhellen@gmail.com")
        cy.get("form").find("#password").type("Password");
        cy.get("button").click();
    })
})