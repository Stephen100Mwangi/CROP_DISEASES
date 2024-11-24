// Now imagine of a scenario where you are fetching data from an external resource say Amazon. You do not want a scenario where you hit your endpoint all the time during testing. To achieve this, we can intercept a network request and mock it for our test. This is a very useful feature of Cypress. The below code shows how to do it.

describe ('should implement intercepts', () => {
  it ('should intercept requests made to the server to login a user', () => {
    cy.intercept ('POST', 'http://localhost:5650/auth/login', {
      message: 'Login endpoint successfully intercepted',
    });

    // We can also send back a mock body not just a message. This is achieved using fixtures - Fixture files in Cypress are used to store mock data
    cy.intercept('POST','http://localhost:5650/auth/login',{
        fixture:'login.json'
    })
  });
});
