const mongoose = require("mongoose");

/**
 * Schema of a Customer object in the database, customer documents resides
 * in 'customers' collection.
 */
module.exports.Message = mongoose.model(
  "Message",
  new mongoose.Schema({
    sender: mongoose.Schema.Types.ObjectId,
    receiver: mongoose.Schema.Types.ObjectId,
    senderName: String,
    receiverName: String,
    payload: String,
    date: Date
  }),
  "message"
);