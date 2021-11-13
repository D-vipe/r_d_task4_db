const fs = require("fs");
const path = require('path');

const filePath = path.resolve(__dirname + "/../public/users.json");

exports.index = function (request, response) {
  // check if we have user relative cookie
  console.log({
      'cookie': request.cookies
  });

  if (!checkUserAuth(request.cookies)) {
    response.render("main_screen", {
        title: "Auth",
        text1: "test text",
      });
  } else {
    let userData = getUserDataByToken(request.cookies.userToken)

    response.render("list_screen", {
      title: "Main",
      user: userData,
      usersList: getUsersList()
    });
  }
};

exports.about = function (request, response) {
  response.send("О сайте");
};

function checkUserAuth(cookie) {
  let userToken = cookie.userToken ?? "";

  console.log({
    userToken: userToken
  });

  //TODO add check if token is present in the list

  return userToken != "";
}

function getUserDataByToken(userToken) {
    // read user data
    const content = fs.readFileSync(filePath,"utf8");
    const users = JSON.parse(content);

    let userData = {};

    for (let i = 0; i < Object.keys(users).length; i++) {
        if (users[i]['token'].indexOf(userToken) != -1) {
            userData = {
                'name': users[i]['name'],
                'age': users[i]['age'],
                'id': users[i]['id'],
                'token': users[i]['token']
            }
        }
    }

    return userData;
}

function getUsersList() {
    const content = fs.readFileSync(filePath,"utf8");
    const users = JSON.parse(content);

    return users;
}
