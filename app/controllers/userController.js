const { response } = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const filePath = path.resolve(__dirname + "/../public/users.json");

exports.authUser = function (request, response) {
  // read user data
  const content = fs.readFileSync(filePath, "utf8");
  const users = JSON.parse(content);

  let formUser = request.body.userName ?? "",
    formPass = request.body.userPass ?? "";

  // check if there is a user with the same name and check pass
  let userMatch = false;
  for (let i = 0; i < Object.keys(users).length; i++) {
    if (users[i]["name"].toLowerCase() == formUser.toLowerCase()) {
      userMatch = true;
      // check pass
      if (users[i]["password"] == formPass) {
        // request.cookie('userToken', users[i]['token'], {signed: true});

        response.json({
          status: "true",
          success_message: "",
          user_token: users[i]["token"],
        });
      } else {
        response.json({
          status: "false",
          error_message: "Неверный логин или пароль!",
        });
      }
    }
  }

  if (!userMatch) {
    response.send(
      JSON.stringify({
        status: "false",
        error_message: "Такого пользователя не существует!",
      })
    );
  }

};

exports.addUser = function (request, response) {
  // read user data
  const content = fs.readFileSync(filePath, "utf8");
  const users = JSON.parse(content);

  // находим максимальный id
  const lastId = Math.max.apply(
    Math,
    users.map(function (o) {
      return o.id;
    })
  );

  // Проверим нет ли пользоателя с таким же именем (не регистрозависимо)
  for (let i = 0; i < Object.keys(users).length; i++) {
    if (request.body.userName == users[i]["name"]) {
      response.json({
        status: "false",
        success_message: "Пользователь с таким именем уже существует!",
        user_data: newUser,
      });
      break;
    }
  }

  if (request.body.userName != "" && request.body.userPass != "") {
    let newUser = {
      id: lastId + 1,
      name: request.body.userName,
      password: request.body.userPass,
      age: request.body.userAge ?? "",
      token: [uuidv4()],
    };

    users.push(newUser);
    data = JSON.stringify(users);
    // перезаписываем файл с новыми данными
    fs.writeFileSync(filePath, data);

    response.json({
      status: "true",
      success_message: "Пользователь успешно добавлен",
      user_data: newUser,
    });
  } else {
    response.json({
      status: "false",
      success_message: "Форма заполнена некорректно",
      user_data: newUser,
    });
  }

  // response.send("Добавление пользователя");
};
// exports.getUsers = function (request, response) {
//   response.send("Список пользователей");
// };

exports.getById = function (req, res) {
  // read user data
  const content = fs.readFileSync(filePath, "utf8");
  const users = JSON.parse(content);

  let userData = {};

  if (req.body.userId != undefined && req.body.userId != "") {
    for (let i = 0; i < Object.keys(users).length; i++) {
      if (req.body.userId == users[i].id.toString()) {
        userData = users[i];
        break;
      }
    }

    if (userData.id != undefined && userData.id != "") {
      res.json({ status: "true", userData: userData });
    } else {
      res.json({ status: "false", error_message: "Пользователь не найден" });
    }
  } else {
    res.json({ status: "false", error_message: "Не указан id пользователя" });
  }
};

exports.update = function (req, res) {
  // read user data
  const content = fs.readFileSync(filePath, "utf8");
  const users = JSON.parse(content);

  if (req.body.userId != undefined && req.body.userId != "") {
    let user;
    for (let i = 0; i < Object.keys(users).length; i++) {
      if (req.body.userId == users[i].id.toString()) {
        user = users[i];
        break;
      }
    }

    if (user) {
      user.age = req.body.userAge;
      user.name = req.body.userName;
      user.password = req.body.userPass;
      data = JSON.stringify(users);
      fs.writeFileSync(filePath, data);

      res.json({ status: "true", userData: user });
    } else {
      res.json({
        status: "false",
        error_message: "Не удалось обновить пользователя!",
      });
    }
  } else {
    res.json({ status: "false", error_message: "Не указан id пользователя!" });
  }
};

exports.generateToken = function (req, res) {
  // read user data
  const content = fs.readFileSync(filePath, "utf8");
  const users = JSON.parse(content);

  if (req.body.userId != undefined && req.body.userId != "") {
    let user;
    for (let i = 0; i < Object.keys(users).length; i++) {
      if (req.body.userId == users[i].id.toString()) {
        user = users[i];
        break;
      }
    }

    if (user) {
      user.token.push(uuidv4());
      data = JSON.stringify(users);
      fs.writeFileSync(filePath, data);

      res.json({ status: "true", userData: user });
    } else {
      res.json({
        status: "false",
        error_message: "Не удалось добавить токен!",
      });
    }
  } else {
    res.json({ status: "false", error_message: "Не указан id пользователя!" });
  }
};

exports.resetToken = function (req, res) {
  // read user data
  const content = fs.readFileSync(filePath, "utf8");
  const users = JSON.parse(content);

  if (req.body.userId != undefined && req.body.userId != "") {
    let user;
    for (let i = 0; i < Object.keys(users).length; i++) {
      if (req.body.userId == users[i].id.toString()) {
        user = users[i];
        break;
      }
    }

    if (user) {
      if (req.body.tokenId != undefined && req.body.tokenId != "") {
        user.token[req.body.tokenId] = uuidv4();
      }
      data = JSON.stringify(users);
      fs.writeFileSync(filePath, data);

      res.json({ status: "true", userData: user });
    } else {
      res.json({
        status: "false",
        error_message: "Не удалось выполнить операцию",
      });
    }
  } else {
    res.json({ status: "false", error_message: "Не указан id пользователя!" });
  }
};

exports.deleteToken = function (req, res) {
  // read user data
  const content = fs.readFileSync(filePath, "utf8");
  const users = JSON.parse(content);

  if (req.body.userId != undefined && req.body.userId != "") {
    let user;
    for (let i = 0; i < Object.keys(users).length; i++) {
      if (req.body.userId == users[i].id.toString()) {
        user = users[i];
        break;
      }
    }

    if (user) {
      if (req.body.tokenId != undefined && req.body.tokenId != "") {
        if (user.token.length > 1) {
          user.token.splice(req.body.tokenId, 1);

          data = JSON.stringify(users);
          fs.writeFileSync(filePath, data);
        } else {
          res.json({
            status: "false",
            error_message: "Невозможно удалить единственный токен.",
          });
        }
      }

      res.json({ status: "true", userData: user });
    } else {
      res.json({
        status: "false",
        error_message: "Не удалось выполнить операцию",
      });
    }
  } else {
    res.json({ status: "false", error_message: "Не указан id пользователя!" });
  }
};

exports.deleteById = function (req, res) {
  // check if user is admin
  let authData = getUserDataByToken(req.cookies.userToken);

  if (authData.name == "Admin") {
    // read user data
    const content = fs.readFileSync(filePath, "utf8");
    const users = JSON.parse(content);

    if (req.body.userId != undefined && req.body.userId != "") {
      let user;
      for (let i = 0; i < Object.keys(users).length; i++) {
        if (req.body.userId == users[i].id.toString()) {
          users.splice(i, 1);
          break;
        }
      }

      data = JSON.stringify(users);
      fs.writeFileSync(filePath, data);

      res.json({ status: "true" });

    } else {
      res.json({
        status: "false",
        error_message: "Не указан id пользователя!",
      });
    }
  } else {
    res.json({
      status: "false",
      error_message:
        "Только пользователь с админ.правами может удалять других пользователей",
    });
  }
};

function getUserDataByToken(userToken) {
  // read user data
  const content = fs.readFileSync(filePath, "utf8");
  const users = JSON.parse(content);

  let userData = {};

  for (let i = 0; i < Object.keys(users).length; i++) {
    if (users[i]["token"].indexOf(userToken) != -1) {
      userData = {
        name: users[i]["name"],
        age: users[i]["age"],
        id: users[i]["id"],
        token: users[i]["token"],
      };
    }
  }

  return userData;
}
