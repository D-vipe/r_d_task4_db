const fs = require("fs");
const path = require('path');
const models = require("../../database/models");

const filePath = path.resolve(__dirname + "/../public/users.json");

exports.index = function (req, res) {
  // check if we have user relative cookie

  checkUserAuth(req).then(async (result) => {
    console.log({auth_res: result});
    if ( result == false ) {
      res.render("main_screen", {
        title: "Auth",
        text1: "test text",
      });
    } else {
      let userList = await models.User.findAll();
      res.render("list_screen", {
        title: "Main",
        user: req.session.user,
        usersList: userList
      });
    }
  });

  // if (!checkUserAuth(req)) {

  // } else {



  // }
};

exports.about = function (req, res) {
  res.send("О сайте");
};

async function checkUserAuth(req) {
  // Check session first if no user session, check cookie and set session user
  let session_user = req.session.user;

  console.log({session_user: session_user === undefined, request_cookie: req.cookies.userId == undefined});

  if (session_user === undefined) {

    if (req.cookies.userId === undefined) {
      return false;
    } else {
      let userData = await models.User.findOne({ where: { id: parseInt(req.cookies.userId) } });
      req.session.user = {id: userData.id, is_admin: userData.isAdmin, name: userData.name};
      return true;
    }
  } else {
    return true;
  }
}
