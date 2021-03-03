const User = require("../models/user").User;
const Log = require("../models/log").Log;
const bcrypt = require('bcrypt');
const { ErrorMessage } = require("../constants/errors");
const { LogType } = require("../constants/log");

/**
 * Performs login for vendor or customer.
 * @param {
  *  userType: "customer" | "vendor",
  *  email: String,
  *  password: String
  * } params
  *
  * @returns {userId | false | userStatus}
  */
 module.exports.login = async (body) => {
   try {
     if (!body.email || !body.password) {
      await Log.create({
        logOperation: "Login",
        logType: LogType.UNSUCCESSFUL_LOGIN,
        logDetail: ErrorMessage.MISSING_PARAMETER,
        date: new Date(),
      });
       return { success: false, code: 400, message: ErrorMessage.MISSING_PARAMETER };
     }
     let user = await User.findOne({
       email: body.email,
     });
     if(!user){
      await Log.create({
        logOperation: "Login",
        logType: LogType.UNSUCCESSFUL_LOGIN,
        logDetail: ErrorMessage.USER_NOT_FOUND,
        date: new Date(),
      });
      return { success: false, code: 404, message: ErrorMessage.USER_NOT_FOUND };
     }

     const valid = bcrypt.compareSync(body.password, user.password);
     console.log(valid);
     if (user && valid) {
      await Log.create({
        logOperation: "Login",
        logType: LogType.SUCCESSFUL_LOGIN,
        logDetail: "Success",
        date: new Date(),
      });
       return { success: true, code: 200, userId: user._id.toString()};
     }
     if (!valid){
      await Log.create({
        logOperation: "Login",
        logType: LogType.UNSUCCESSFUL_LOGIN,
        logDetail: ErrorMessage.WRONG_PASSWORD,
        date: new Date(),
      });
      return { success: false, code: 400, message: ErrorMessage.WRONG_PASSWORD};
     }
   } catch (error) {
    await Log.create({
      logOperation: "Login",
      logType: LogType.UNSUCCESSFUL_LOGIN,
      logDetail: error,
      date: new Date(),
    });
    return { success: false, code: 500, message: ErrorMessage.INTERNAL_SERVER_ERROR };
  }
 };

/**
 * Performs signup for a user.
    */
   module.exports.signup = async (body) => {
     try {
      if (!body.email || !body.password || !body.username) {
        await Log.create({
          logOperation: "Signup",
          logType: LogType.UNSUCCESSFUL_SIGNUP,
          logDetail: ErrorMessage.MISSING_PARAMETER,
          date: new Date(),
        });
        return { success: false, code: 400, message: ErrorMessage.MISSING_PARAMETER };
      }
       let userLog = await User.findOne({ $or: [{email: body.email}, {username: body.username}] });
       if (userLog) {
        await Log.create({
          logOperation: "Signup",
          logType: LogType.UNSUCCESSFUL_SIGNUP,
          logDetail: ErrorMessage.USER_ALREADY_EXISTS,
          date: new Date(),
        });
         return { success: false, code: 400, message: ErrorMessage.USER_ALREADY_EXISTS };
       }
       let user;
       const saltRounds = 10;
       const hashedPassword = bcrypt.hashSync(body.password, saltRounds);
         user = await User.create({
           email: body.email,
           password: hashedPassword,
           username: body.username,
         });
       if (user) {
        await Log.create({
          logOperation: "Signup",
          logType: LogType.SUCCESSFUL_SIGNUP,
          logDetail: "Success",
          date: new Date(),
        });
         return { success: true, code: 200, userId: user._id.toString()};
       }
       await Log.create({
        logOperation: "Signup",
        logType: LogType.UNSUCCESSFUL_SIGNUP,
        logDetail: ErrorMessage.COULD_NOT_CREATE_USER,
        date: new Date(),
      });
       return { success: false, code: 400, message: ErrorMessage.COULD_NOT_CREATE_USER };

     } catch (error) {
      await Log.create({
        logOperation: "Signup",
        logType: LogType.UNSUCCESSFUL_SIGNUP,
        logDetail: error,
        date: new Date(),
      });
       return { success: false, code: 500, message: ErrorMessage.INTERNAL_SERVER_ERROR};
     }
   };