const mongoose = require("mongoose");
const Log = require("./models/log").Log;
const { LogType } = require("./constants/log");

module.exports.initialize = async function () {
  try {
    await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  } catch (err) {
    await Log.create({
      logOperation: "DB INIT",
      logType: LogType.UNSUCCESSFUL_DB,
      logDetail: err,
      date: new Date(),
    });
    console.log(err);
  }
};
