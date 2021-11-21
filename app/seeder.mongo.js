require("dotenv").config();
const path = require("path");
const mongoose = require("mongoose");
const md5 = require("md5");
const { v4: uuidv4 } = require("uuid");
const User = require(path.join(__dirname, "models.mongo/user.model.js"));

// establish connection & give yourself a message so you know when its complete
const source = process.env.MONGO_DATABASE;

async function seedMongoDb() {
  // establish connection & give yourself a message so you know when its complete
  const source = process.env.MONGO_DATABASE;
  mongoose.connect(source, {});
  const connectionDb = mongoose.connection;
  connectionDb.once("open", () => {
    console.log("DB connected.");
  });

  const AdminUser = new User({
    name: "Admin",
    email: "admin@admin.ru",
    password: md5(md5("gogo123")),
    age: "31",
    isAdmin: true,
    token: [
      {
        token: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        token: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  });
  const User2 = new User({
    name: "Jane Doe",
    email: "test@test.ru",
    password: md5(md5("123456")),
    age: "35",
    isAdmin: false,
    token: [
      {
        token: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  });

  const User3 = new User({
    name: "Jon Doe",
    email: "test2@test.ru",
    password: md5(md5("123456")),
    age: "",
    isAdmin: false,
  });

  const adminExists = await User.exists({email: "admin@admin.ru"});
  const User2Exists = await User.exists({email: "test@test.ru"});
  const User3Exists = await User.exists({email: "test2@test.ru"});

  if (!adminExists) {
    AdminUser.save().then((result) => {
      log(result, "create Admin");
    });
  } else {
    console.log('admin exists');
  }

  if (!User2Exists) {
    User2.save().then((result) => {
      log(result, "create User2");
    });
  } else {
    console.log('user2 exists');
  }

  if (!User3Exists) {
    User3.save().then((result) => {
      log(result, "create User3");
    });
  } else {
    console.log('user3 exists')
  }


}

function log(data, action) {
  console.log({ action: action, data: data });
}

seedMongoDb();
