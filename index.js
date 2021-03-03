  const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    db = require("./init"),
    cors = require("cors"),
    server = require("http").createServer(app),
    socket = require("./utils/socketServer"),
    accountRoutes = require("./routes/account"),
    interactionRoutes = require("./routes/interaction");


require("dotenv").config(); 


express.response.respond = function (code, message, data) {
  this.status(code).send({
    status: { code, message },
    data,
  });
};

express.request.extractParams = function () {
  return Object.keys(this.body).length ? this.body : this.query;
};
server.listen(process.env.PORT); // Listen requests from the port.
app.use(bodyParser.json());
app.use(cors());
db.initialize(); // Initialize the database.
accountRoutes.initialize(app); // Start to listen the endpoints.
socket.initialize(server);
interactionRoutes.initialize(app); // Start to listen the endpoints.
module.exports.App = app;
console.log("Server started " + process.env.PORT); 

