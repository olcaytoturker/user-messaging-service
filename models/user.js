const mongoose = require("mongoose");

/**
 * Schema of a Customer object in the database, customer documents resides
 * in 'customers' collection.
 */
module.exports.User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    contacts: [String],
    bannedUsers: [String]
  }),
  "user"
);