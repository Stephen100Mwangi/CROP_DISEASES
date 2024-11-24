describe ('Should check for smooth navigation across different pages', () => {
  it ('should navigate to login page only after a button is clicked', () => {
    cy.visit ('http://localhost:5173/');
    cy.location ('pathname').should ('equal', '/');
    cy.get ('button').click ();
    cy.location ('pathname').should ('equal', '/login');
  });

  // Should navigate to home page when correct email and password are provided
  it("Should redirect to home page",()=>{
    cy.visit("http://localhost:5173/login");
    cy.location ('pathname').should ('equal', '/login');
    cy.get("form").find("#email").type("wnjikuhellen@gmail.com");
    cy.get("form").find("#password").type("123@Password");
    cy.get("button").click();
    cy.location ('pathname').should ('equal', '/home');
  })
});
