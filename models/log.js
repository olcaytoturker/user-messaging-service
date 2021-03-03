const mongoose = require("mongoose");

/**
 * Schema of a Customer object in the database, customer documents resides
 * in 'customers' collection.
 */
module.exports.Log = mongoose.model(
  "Log",
  new mongoose.Schema({
    logOperation: String,
    logType: String,
    logDetail: String,
    date: Date
  }),
  "log"
);