describe ('AI-Driven Crop Diseases detection App', () => {
  it ('should display correct Hero page content', () => {
    cy.visit ('http://localhost:5173/');
    cy.contains ('CropGuard');
    cy.contains ('Healthy Crops, Happy Harvests');
    cy.contains (
      'Take the guesswork out of farming! With CropGuard, you can detect and prevent crop diseases before they spread. Our powerful AI-driven tool keeps you a step ahead, ensuring your fields stay vibrant and productive. Protect your investment and maximize your yield effortlessly.'
    );
  });

  it ('should navigate to login page when the button is clicked', () => {
    cy.visit('/')
    cy.location ('pathname').should ('equal', '/');
    cy.get ('button').click ();
    cy.location ('pathname').should ('equal', '/login');
  });

  it ('should contain the login title', () => {
    cy.visit ('/login');
    cy.get ('form').get ('[data-test="loginTitle"').contains (/Log in Here/i);
  });

});
