  const account = require("../views/account");
  /**
   */
  module.exports.initialize = (app) => {

  app.post("/signup", async (request, response) => {
    const result = await account.signup(request.body);
    if (result.success) {
      response.respond(result.code, "OK", { userId: result.userId});
    } else {
      response.respond(result.code, result.message);
    }
  });

  app.post("/login", async (request, response) => {
    const result = await account.login(request.body);
    if (result.success) {
      response.respond(result.code, "OK", { userId: result.userId});
    } else {
      response.respond(result.code, result.message);
    }
  });

};