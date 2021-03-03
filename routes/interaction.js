const interaction = require("../views/interaction");

  /**
   */
  module.exports.initialize = (app) => {

  app.post("/message", async (request, response) => {
    await interaction.sendMessage(request.body, function(sock_response){
      console.log(sock_response);
      if (sock_response.success) {
        response.respond(sock_response.code, "OK", { message_id: sock_response.payload.id, message: sock_response.payload.message});
      } else {
        response.respond(sock_response.code, sock_response.message);
      }
    });
  });

  app.post("/ban", async (request, response) => {
    const result = await interaction.ban(request.body);
    if (result.success) {
      response.respond(result.code, "OK", {banneds: result.banneds, contacts: result.contacts});
    } else {
      response.respond(result.code, result.message);
    }
  });

  app.post("/add", async (request, response) => {
    const result = await interaction.addContact(request.body);
    if (result.success) {
      response.respond(result.code, "OK");
    } else {
      response.respond(result.code, result.message);
    }
  });

  app.get("/message", async (request, response) => {
    const result = await interaction.getMessages(request.body);
    if (result.success) {
      response.respond(result.code, "OK", {messages: result.messages});
    } else {
      response.respond(result.code, result.message);
    }
  });

  app.get("/messages", async (request, response) => {
    const result = await interaction.getAllMessages(request.body);
    if (result.success) {
      response.respond(result.code, "OK", {messages: result.messages});
    } else {
      response.respond(result.code, result.message);
    }
  });

}; 