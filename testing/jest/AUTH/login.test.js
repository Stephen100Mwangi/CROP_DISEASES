const login = require('server/controllers/auth/Login.ts');

test("check if variables are of right type",(email,password)=>{
    expect(typeof email).toBe("string");

})