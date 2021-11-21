const fs = require("fs");
const path = require("path");
const User = require("../models.mongo/user.model");
// const models = require("../../database/models");

exports.index = function (req, res) {
  // check if we have user relative cookie

  checkUserAuth(req).then(async (result) => {
    console.log({ auth_res: result });
    if (result == false) {
      res.render("main_screen", {
        title: "Auth",
        text1: "test text",
      });
    } else {
      // let userList = await models.User.findAll({
      //   include: [
      //     {
      //       model: models.Token,
      //       as: "token",
      //     },
      //   ],
      // });
      const userList = await User.find().exec();

      console.log(userList);
      res.render("list_screen", {
        title: "Main",
        user: req.session.user,
        usersList: userList,
      });
    }
  });
};

async function checkUserAuth(req) {
  // Check session first if no user session, check cookie and set session user
  let session_user = req.session.user;

  if (session_user === undefined) {
    if (req.cookies.userId === undefined) {
      return false;
    } else {
      // let userData = await models.User.findOne({
      //   where: { id: parseInt(req.cookies.userId) },
      // });
      const userData = await User.findOne({
        id: req.cookies.userId,
      }).exec();

      req.session.user = {
        id: userData.id,
        is_admin: userData.isAdmin,
        name: userData.name,
      };
      return true;
    }
  } else {
    // logout method destroys cookie
    if (req.cookies.userId === undefined) {
      return false;
    } else {
      return true;
    }
  }
}
