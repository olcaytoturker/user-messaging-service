## This project is an user messaging service written using NodeJs

**Technologies used:**

[Express](https://expressjs.com/)

[Node.js](https://nodejs.org/en/)

[Socket.io](https://socket.io/)

[Docker](https://www.docker.com/)

[Docker-compose](https://docs.docker.com/compose/)

[Mocha](https://mochajs.org/)

[Chai](https://www.chaijs.com/)

[Mongoose](https://mongoosejs.com/)

## For running the project

 run `docker-compose build`

 run `docker-compose up`

 run `docker-compose down` for terminating the run.
## For running unit tests

 run `npm i && npm test`

## ENDPOINTS

 **Base URL: http://localhost:8080/**

## Signup

Executes sign up operation with username, email address and password. Username and password must be unique.

**Endpoint:** `/signup` \
**Method:** `POST` \
**Body:** {"username": "olcayto",
            "password": "trkr1234",
            "email": "olcayto@account.com"}

**Response:** {
    "status": {
        "code": 200,
        "message": "OK"
    },
    "data": {
        "userId": "603f856d010d240012357a38"
    }
}

## Login

Executes login operation with email and password.

**Endpoint:** `/login` \
**Method:** `POST` \
**Body:** {"password": "trkr1234",
            "email": "olcayto@account.com"}

**Response:**
{
    "status": {
        "code": 200,
        "message": "OK"
    },
    "data": {
        "userId": "603f856d010d240012357a38"
    }
}

## Add Contact

Adds two users to each other's contact list. User must add the contact before sending or receiving any message.

**Endpoint:** `/add` \
**Method:** `POST` \
**Body:** {"addingUser": "603f8589010d240012357a3b"(addingUserId),
            "addedUser": "603f856d010d240012357a38"(addedUserId)}

**Response:**
{
    "status": {
        "code": 200,
        "message": "OK"
    }
}

## Ban User

Bannes a user from messaging with the other user. 

**Endpoint:** `/ban` \
**Method:** `POST` \
**Body:** {"banningUser": "603f8589010d240012357a3b",
        "bannedUser": "603f856d010d240012357a38"}

**Response:**

{
    "status": {
        "code": 200,
        "message": "OK"
    }
}

## Send Message

Sends a message from one user to another. These users must be in their contact names for sending message.

**Endpoint:** `/message` \
**Method:** `POST` \
**Body:** {"senderId": "603f8589010d240012357a3b",
            "receiverId": "603f856d010d240012357a38",
            "payload": "message"}

**Response:**
{
    "status": {
        "code": 200,
        "message": "OK"
    },
    "data": {
        "message_id": "603f866c010d240012357a41",
        "message": "message"
    }
}

## Get Messages Between Users

Gets messages between specific two users. 

**Endpoint:** `/message` \
**Method:** `GET` \
**Body:** {"senderId": "603f8589010d240012357a3b",
            "receiverId": "603f856d010d240012357a38"}
**Response:**

{
    "status": {
        "code": 200,
        "message": "OK"
    },
    "data": {
        "messages": [
            {
                "sender": "603f8589010d240012357a3b",
                "receiver": "603f856d010d240012357a38",
                "senderName": "olcaytot",
                "receiverName": "olcayto",
                "payload": "message",
                "date": "2021-03-03T12:51:56.739Z",
                "id": "603f866c010d240012357a41"
            }
        ]
    }
}

## Get Messages of a Specific User

Gets all messages of a user.

**Endpoint:** `/messages` \
**Method:** `GET` \
**Body:** {"userId": "603f8589010d240012357a3b"}

**Response:**
{
    "status": {
        "code": 200,
        "message": "OK"
    },
    "data": {
        "messages": [
            {
                "_id": "603f866c010d240012357a41",
                "sender": "603f8589010d240012357a3b",
                "receiver": "603f856d010d240012357a38",
                "senderName": "olcaytot",
                "receiverName": "olcayto",
                "payload": "ddsds",
                "date": "2021-03-03T12:51:56.739Z",
                "__v": 0
            }
        ]
    }
}