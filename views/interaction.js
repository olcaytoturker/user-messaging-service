const io = require('socket.io-client');
const socketUrl = "http://127.0.0.1:" + process.env.PORT;
const ObjectId = require("mongoose").Types.ObjectId;
const User = require("../models/user").User;
const Log = require("../models/log").Log;
const Message = require("../models/message").Message;
const { ErrorMessage } = require("../constants/errors");
const { LogType } = require("../constants/log");



   module.exports.sendMessage = async (body, callback) => {
    const socket = io(socketUrl);
    socket.emit('discover', {id: body.senderId}, (response) => {
      socket.emit('message', {senderId: body.senderId, receiverId: body.receiverId, 
        payload: body.payload}, (res) => {
        socket.disconnect();
        callback(res);
      })
    })
   };
   module.exports.ban = async (body) => {
    try {
      if (!body.banningUser || !body.bannedUser) {
        await Log.create({
          logOperation: "Ban",
          logType: LogType.UNSUCCESSFUL_BAN,
          logDetail: ErrorMessage.MISSING_PARAMETER,
          date: new Date(),
        });
        return { success: false, code: 400, message: ErrorMessage.MISSING_PARAMETER };
      }

      let banningUser = await User.findById(ObjectId(body.banningUser));
      let bannedUser = await User.findById(ObjectId(body.bannedUser));

      if (banningUser && bannedUser) {
        banningUser.bannedUsers.push(bannedUser.username);
        if(banningUser.contacts.includes(bannedUser.username)){
          banningUser.contacts = banningUser.contacts.filter((contact) => contact !== bannedUser.username);
          bannedUser.contacts = bannedUser.contacts.filter((contact) => contact !== banningUser.username);
          bannedUser.save();
        }
        banningUser.save();
        await Log.create({
          logOperation: "Ban",
          logType: LogType.SUCCESSFUL_BAN,
          logDetail: "Success",
          date: new Date(),
        });
        return { success: true, code: 200, banneds: banningUser.bannedUsers, contacts: banningUser.contacts};
      }

    } catch (error) {
      await Log.create({
        logOperation: "Ban",
        logType: LogType.UNSUCCESSFUL_BAN,
        logDetail: error,
        date: new Date(),
      });
      return { success: false, code: 404, message: ErrorMessage.USER_NOT_FOUND };
    }
  };
  
  module.exports.addContact = async (body) => {
    try {
      if (!body.addingUser || !body.addedUser) {
        await Log.create({
          logOperation: "Add Contact",
          logType: LogType.UNSUCCESSFUL_ADD,
          logDetail: ErrorMessage.MISSING_PARAMETER,
          date: new Date(),
        });
        return { success: false, code: 400, message: ErrorMessage.MISSING_PARAMETER };
      }
      
      var addingUser = await User.findById(ObjectId(body.addingUser));
      var addedUser = await User.findById(ObjectId(body.addedUser));

      if(addingUser.contacts.includes(addedUser.username)){
        return { success: false, code: 409, message: ErrorMessage.CONTACT_ALREADY_EXISTS };
      }
      if (addingUser && addedUser) {
        addingUser.contacts.push(addedUser.username);
        addedUser.contacts.push(addingUser.username);
        addingUser.save();
        addedUser.save();
        await Log.create({
          logOperation: "Add Contact",
          logType: LogType.SUCCESSFUL_ADD,
          logDetail: "Success",
          date: new Date(),
        });
        return { success: true, code: 200};
      }
    } catch (error) {
      await Log.create({
        logOperation: "Add Contact",
        logType: LogType.UNSUCCESSFUL_ADD,
        logDetail: error,
        date: new Date(),
      });
      return { success: false, code: 404, message: ErrorMessage.USER_NOT_FOUND };
    }
  };

  /**
 * Gets message list for a given user
 *
 */
module.exports.getMessages = async (body) => {
  try {
    if (!body.senderId || !body.receiverId) {
      await Log.create({
        logOperation: "Get Message",
        logType: LogType.UNSUCCESSFUL_GET,
        logDetail: ErrorMessage.MISSING_PARAMETER,
        date: new Date(),
      });
      return { success: false, code: 400, message: ErrorMessage.MISSING_PARAMETER };
    }
    let [sender, receiver] = await Promise.all([
      User.findById(ObjectId(body.senderId)),
      User.findById(ObjectId(body.receiverId)),
    ]);
    
    let messages = await Message.find({
      $or: [
        {
          sender: ObjectId(body.senderId),
          receiver: ObjectId(body.receiverId),
        },
        {
          sender: ObjectId(body.receiverId),
          receiver: ObjectId(body.senderId)
        },
      ],
    }).sort({
      date: "descending",
    });
    messages = messages.map((message) => message.toJSON());

    messages.map((message) => {
      message.id = message._id;

      delete message.senderId;
      delete message.receiverId;
      delete message.__v;
      delete message._id;
    });
    await Log.create({
      logOperation: "Get Message",
      logType: LogType.SUCCESSFUL_GET,
      logDetail: "Success",
      date: new Date(),
    });
    return {
      success: true,
      code: 200,
      messages: messages,
    };
  } catch (error) {
    await Log.create({
      logOperation: "Get Message",
      logType: LogType.UNSUCCESSFUL_GET,
      logDetail: error,
      date: new Date(),
    });
    return { success: false, code: 404, message: ErrorMessage.USER_NOT_FOUND };
  }
};

/**
 * Gets message list for a given user
  */
 module.exports.getAllMessages = async (body) => {
   try {
     if (!body.userId) {
      await Log.create({
        logOperation: "Get All Messages",
        logType: LogType.UNSUCCESSFUL_GET,
        logDetail: ErrorMessage.MISSING_PARAMETER,
        date: new Date(),
      });
       return { success: false, code: 400, message: ErrorMessage.MISSING_PARAMETER };
     }
 
     const messages = await Message.find({
       $or: [
         { sender: ObjectId(body.userId) },
         { receiver: ObjectId(body.userId) },
       ],
     }).sort({
       date: "descending",
     });
     const lastMessages = {};
     const messagesResponse = [];
     await Log.create({
      logOperation: "Get Message",
      logType: LogType.SUCCESSFUL_GET,
      logDetail: "Success",
      date: new Date(),
    });
     return {
       success: true,
       code: 200,
       messages: messages,
     };
   } catch (error) {
    await Log.create({
      logOperation: "Get All Messages",
      logType: LogType.UNSUCCESSFUL_GET,
      logDetail: ErrorMessage.INTERNAL_SERVER_ERROR,
      date: new Date(),
    });
     return { success: false, code: 500, message: ErrorMessage.INTERNAL_SERVER_ERROR };
   }
 };
