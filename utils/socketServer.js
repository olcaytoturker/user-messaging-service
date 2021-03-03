const socketIO = require("socket.io");
const User = require("../models/user").User;
const Log = require("../models/log").Log;
const Message = require("../models/message").Message;
const ObjectId = require("mongoose").Types.ObjectId;
const { ErrorMessage } = require("../constants/errors");
const { LogType } = require("../constants/log");

module.exports.initialize = (app) => {
    const io = socketIO(app, {
        cors: {
            origin: "*",
        },
        });
  const userInfo = {};
  io.on("connection", (socket) => {
    socket.on("discover", async (payload, response) => {
      try {
        console.log("discover");
        if (!payload.id) {
          return response({ success: false, code: 400, message: ErrorMessage.MISSING_PARAMETER });
        }
        const user = await User.findById(ObjectId(payload.id));
        if (!user) {
          return response({ success: false, code: 404, message: ErrorMessage.USER_NOT_FOUND });
        }
        userInfo[payload.id] = {
          socket: socket
        };
        response({ success: true, code: 200, message: "Success" });
      } catch (error) {
        response({ success: false, code: 500, message: error });
      }
    });
    socket.on("message", async (payload, response) => {
      try {
        if (!payload.payload) {
          await Log.create({
            logOperation: "Message",
            logType: LogType.UNSUCCESSFUL_SEND,
            logDetail: ErrorMessage.MISSING_PARAMETER,
            date: new Date(),
          });
          return response({ success: false, code: 400, message: ErrorMessage.MISSING_PARAMETER });
        }

        let [sender, receiver] = await Promise.all([
          User.findById(ObjectId(payload.senderId)),
          User.findById(ObjectId(payload.receiverId)),
        ]);

        if (!sender || !receiver) {
          await Log.create({
            logOperation: "Message",
            logType: LogType.UNSUCCESSFUL_SEND,
            logDetail: ErrorMessage.USER_NOT_FOUND,
            date: new Date(),
          });
          return response({ success: false, code: 404, message: ErrorMessage.USER_NOT_FOUND });
        }

        if(sender.bannedUsers.includes(receiver.username) || receiver.bannedUsers.includes(sender.username)){
          await Log.create({
            logOperation: "Message",
            logType: LogType.UNSUCCESSFUL_SEND,
            logDetail: ErrorMessage.FORBIDDEN_REQUEST,
            date: new Date(),
          });
          return response({ success: false, code: 403, message: ErrorMessage.FORBIDDEN_REQUEST});
        }

        if(!sender.contacts.includes(receiver.username)){
          await Log.create({
            logOperation: "Message",
            logType: LogType.UNSUCCESSFUL_SEND,
            logDetail: ErrorMessage.FORBIDDEN_REQUEST,
            date: new Date(),
          });
          return response({ success: false, code: 403, message: ErrorMessage.FORBIDDEN_REQUEST});
        }

        const message = new Message({
          sender: payload.senderId,
          receiver: payload.receiverId,
          senderName: sender.username,
          receiverName: receiver.username,
          payload: payload.payload,
          date: new Date(),
        });

        await message.save();

        if (userInfo[payload.receiverId]) {
          userInfo[payload.receiverId].socket.emit("message", {
            message: payload.message,
            id: message._id.toString(),
            date: new Date()
          });

        }
        await Log.create({
          logOperation: "Message",
          logType: LogType.SUCCESSFUL_SEND,
          logDetail: "Success",
          date: new Date(),
        });
        return response({
          success: true,
          code: 200,
          payload: { message: payload.payload, id: message._id.toString(), date: new Date() },
        });
      } catch (error) {
        await Log.create({
          logOperation: "Message",
          logType: LogType.UNSUCCESSFUL_SEND,
          logDetail: error,
          date: new Date(),
        });
        return response({ success: false, code: 500, message: err });
      }
    });
  });
};
