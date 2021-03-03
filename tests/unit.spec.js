const chai = require("chai"),
  { describe, before, after } = require("mocha"),
    db = require("../init"),
    User = require("../models/user").User,
    Message = require("../models/message").Message,
    Log = require("../models/log").Log,
    account = require("../views/account");
    interaction = require("../views/interaction");
    const mongoose = require("mongoose");
    const uri = "mongodb+srv://olcayto:JUgkXuVTAgjzH1iH@cluster0.fensr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const { ErrorMessage } = require("../constants/errors");

    try {
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    } catch (err) {
    console.log(err);
  }

describe("# Endpoints tests", async function () {
    this.timeout(0);
    let userId;

      describe("function: signup", () => {
        it("should perform a successful customer signup", async () => {
        const result = await account.signup({
            username: "Bob Dylan",
            email: "bobdylan@account.com",
            password: "rolling123"
          });

          chai.expect(result.success).to.be.true;
          chai.expect(result).has.property("userId");
          chai.expect(result.userId).to.be.a("string");

          userId = result.userId;
        });

        it("should fail with existing user", async () => {
          const result = await account.signup({
            username: "Bob Dylan",
            email: "bobdylan@account.com",
            password: "rolling123"
          });
    
          chai.expect(result.success).to.be.false;
          chai.expect(result.message).to.equal(ErrorMessage.USER_ALREADY_EXISTS);
        });

        it("should fail with missing parameter", async () => {
          const result = await account.signup({
            username: "Bob Dylan",
            password: "rolling123"
          });
    
          chai.expect(result.success).to.be.false;
          chai.expect(result.message).to.equal(ErrorMessage.MISSING_PARAMETER);
        });
      });

      describe("function: login", () => {
        it("should perform a successful login", async () => {
        const result = await account.login({
            email: "bobdylan@account.com",
            password: "rolling123"
          });
    
          chai.expect(result.success).to.be.true;
          chai.expect(result).has.property("userId");
          chai.expect(result.userId).to.be.a("string");
        });
    
        it("should fail with user not found error", async () => {
          const result = await account.login({
            email: "bobdydlan@account.com",
            password: "rolling123"
          });
    
          chai.expect(result.success).to.be.false;
          chai.expect(result.message).to.equal(ErrorMessage.USER_NOT_FOUND);
        });

        it("should fail with wrong password", async () => {
          const result = await account.login({
            email: "bobdylan@account.com",
            password: "jaggerrocks"
          });
    
          chai.expect(result.success).to.be.false;
          chai.expect(result.message).to.equal(ErrorMessage.WRONG_PASSWORD);
        });
      });

      const secUser = await User.create({
        email: "kurt@nirvana.com",
        password: "heartshape12",
        username: "cobain94",
      });

      describe("function: add", () => {
        it("should perform a successful add contact", async () => {
        const result = await interaction.addContact({
            addingUser: userId,
            addedUser: secUser._id.toString()
          });
    
          chai.expect(result.success).to.be.true;
          chai.expect(result.code).to.equal(200);
        });

        it("should return missing parameter", async () => {
          const result = await interaction.addContact({
              addedUser: secUser._id.toString()
            });
      
            chai.expect(result.success).to.be.false;
            chai.expect(result.message).to.equal(ErrorMessage.MISSING_PARAMETER);
            chai.expect(result.code).to.equal(400);
          });
        
        it("should return user not found", async () => {
          const result = await interaction.addContact({
              addingUser: "userId",
              addedUser: "secUser._id.toString()"
            });
      
            chai.expect(result.success).to.be.false;
            chai.expect(result.message).to.equal(ErrorMessage.USER_NOT_FOUND);
            chai.expect(result.code).to.equal(404);
          });

      });

    describe("function: ban", () => {
        it("should perform a successful ban other user", async () => {
        const result = await interaction.ban({
            banningUser: userId,
            bannedUser: secUser._id.toString()
          });
    
          chai.expect(result.success).to.be.true;
          chai.expect(result.code).to.equal(200);
        });

        it("should return missing parameter", async () => {
          const result = await interaction.ban({
              banningUser: secUser._id.toString()
            });
      
            chai.expect(result.success).to.be.false;
            chai.expect(result.message).to.equal(ErrorMessage.MISSING_PARAMETER);
            chai.expect(result.code).to.equal(400);
          });

          it("should return user not found", async () => {
            const result = await interaction.ban({
                banningUser: secUser._id.toString(),
                bannedUser: "user"
              });
        
              chai.expect(result.success).to.be.false;
              chai.expect(result.message).to.equal(ErrorMessage.USER_NOT_FOUND);
              chai.expect(result.code).to.equal(404);
            });
      });

      await Message.create({
        sender: userId,
        receiver: secUser._id.toString(),
        senderName: "Bob Dylan",
        receiverName: "cobain94",
        payload: "Hi, Kurt!",
        date: new Date(),
      });

      await Message.create({
        receiver: userId,
        sender: secUser._id.toString(),
        receiverName: "Bob Dylan",
        senderName: "cobain94",
        payload: "Hi, Bob!",
        date: new Date(),
      });

      describe("function: getMessages", () => {
        it("should perform a successful get messages between users", async () => {
          const result = await interaction.getMessages({
              senderId: userId,
              receiverId: secUser._id.toString()
            });
    
          chai.expect(result.success).to.be.true;
          chai.expect(result.code).to.equal(200);
          chai.expect(result).has.property("messages");
        });

        it("should return user not found error", async () => {
          const result = await interaction.getMessages({
              senderId: "userId",
              receiverId: secUser._id.toString()
            });
    
          chai.expect(result.success).to.be.false;
          chai.expect(result.code).to.equal(404);
          chai.expect(result.message).to.equal(ErrorMessage.USER_NOT_FOUND);
        });

        it("should return missing parameter error", async () => {
          const result = await interaction.getMessages({
              receiverId: secUser._id.toString()
            });
    
          chai.expect(result.success).to.be.false;
          chai.expect(result.code).to.equal(400);
          chai.expect(result.message).to.equal(ErrorMessage.MISSING_PARAMETER);
        });

      });

      describe("function: getAllMessages", () => {
        it("should perform a successful get messages between users", async () => {
          const result = await interaction.getAllMessages({
              userId: userId,
            });
    
          chai.expect(result.success).to.be.true;
          chai.expect(result.code).to.equal(200);
          chai.expect(result).has.property("messages");
        });
        it("should perform a missing parameter error", async () => {
          const result = await interaction.getAllMessages({
            });
    
          chai.expect(result.success).to.be.false;
          chai.expect(result.code).to.equal(400);
        });
      });
  after("Delete added documents", async () => {
    await Promise.all([User.deleteMany(), Message.deleteMany(), Log.deleteMany()]);
  });
});

