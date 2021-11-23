const { response } = require("express");
const fs = require("fs");
const models = require("../../database/models");
const User = require("../models.mongo/user.model");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const md5 = require("md5");
const validator = require("email-validator");
const jwt = require("jsonwebtoken");
const Validator = require("fastest-validator");

const v = new Validator();

const schemaUser = {
  age: { type: "number", positive: true, integer: true, optional: true },
  name: { type: "string" },
  isAdmin: { type: "boolean", optional: true, default: false },
  password: { type: "string" },
  email: { type: "string" },
  token: { type: "array", items: "object", optional: true },
};

const schemaToken = {
  token: { type: "string" },
  createdAt: { type: "date", optional: true },
  updatedAt: { type: "date", optional: true },
};

const schemaUserId = {
  id: { type: "string" },
};

const schemaTokenId = {
  id: { type: "number", integer: true },
};

const checkUser = v.compile(schemaUser);
const checkToken = v.compile(schemaToken);
const checkTokenId = v.compile(schemaTokenId);
const checkUserId = v.compile(schemaUserId);

const filePath = path.resolve(__dirname + "/../public/users.json");

exports.authUser = async function (req, res) {
  // let formUser = req.body.userEmail ?? "",
  // formPass = req.body.userPass ?? "";

  let { userEmail, userPass } = req.body;

  // validate email
  if (!validator.validate(userEmail)) {
    res
      .status(400)
      .json({ status: false, error_message: "Неверный формат email" });
  } else {
    // const userData = await models.User.findOne({
    //   include: [
    //     {
    //       model: models.Token,
    //       as: "token",
    //     },
    //   ],
    //   where: { email: formUser },
    // });
    const userData = await User.findOne({ email: userEmail }).exec();

    if (userData === null) {
      res
        .status(404)
        .json({ status: false, error_message: "Пользователь не найден" });
    } else {
      if (md5(md5(userPass)) !== userData.password) {
        res
          .status(400)
          .json({ status: false, error_message: "Неверный пароль" });
      } else {
        // create jwt
        const userJwt = jwt.sign(
          {
            user_id: userData._id,
          },
          process.env.TOKEN_KEY,
          { expiresIn: "24h" }
        );

        req.session.user = {
          id: userData._id,
          is_admin: userData.isAdmin,
          name: userData.name,
        };

        res.status(200).json({ status: true, token: userJwt });
      }
    }
  }
};

exports.addUser = async function (req, res) {
  // validate email
  const { userEmail, userName, userAge, userPass } = req.body;

  if (!validator.validate(userEmail)) {
    res
      .status(400)
      .json({ status: false, error_message: "Неверный формат email" });
  } else {
    if (
      !checkUser({
        age: userAge,
        name: userName,
        password: userPass,
        email: userEmail,
      })
    ) {
      res
        .status(400)
        .json({ status: false, error_message: "Неверные параметры запроса" });
    }
    // let existingUser = await models.User.findOne({
    //   include: [
    //     {
    //       model: models.Token,
    //       as: "token",
    //     },
    //   ],
    //   where: { email: req.body.userEmail },
    // });

    let existingUser = await User.findOne(
      { email: userEmail },
      "_id name email age isAdmin"
    ).exec();

    if (existingUser === null) {
      // const newUser = await models.User.create({
      //   name: req.body.userName,
      //   email: req.body.userEmail,
      //   age: req.body.userAge,
      //   password: md5(md5(req.body.userPass)),
      //   isAdmin: false,
      // });

      const newUser = await User.create({
        name: userName,
        email: userEmail,
        age: userAge,
        password: md5(md5(userPass)),
        isAdmin: false,
      });

      if (newUser) {
        res.status(200).json({ status: true, userData: newUser });
      } else {
        res.status(400).json({
          status: false,
          error_message:
            "Что-то пошло не так, не удалось добавить пользователя",
        });
      }
    } else {
      res.status(400).json({
        status: false,
        error_message: "Пользователь с таким email уже существует",
      });
    }
  }
};

exports.getById = async function (req, res) {
  const { userId } = req.body;
  if (!checkUserId({ id: userId })) {
    res
      .status(400)
      .json({ status: false, error_message: "Неверные параметры запроса" });
  }

  if (req.body.userId) {
    // const user = await models.User.findOne({
    //   include: [
    //     {
    //       model: models.Token,
    //       as: "token",
    //     },
    //   ],
    //   where: { id: req.body.userId },
    // });

    const user = await User.findOne(
      {
        _id: userId,
      },
      "id name email age isAdmin token"
    ).exec();

    if (user) {
      res.status(200).json({ status: true, userData: user });
    } else {
      res.status(404).json({
        status: false,
        error_message: "Не удалось найти пользователя",
      });
    }
  } else {
    res.status(400).json({
      status: false,
      error_message: "Ошибка. Не достаточно параметров",
    });
  }
};

exports.update = async function (req, res) {
  let { userId, userEmail, userName, userPass, userAge } = req.body;
  // validate email
  if (validator.validate(userEmail)) {
    // const updatedUser = await models.User.update(
    //   {
    //     name: req.body.userName,
    //     email: req.body.userEmail,
    //     password: req.body.userPass,
    //     age: req.body.userAge,
    //   },
    //   { where: { id: req.body.userId }, returning: true, plain: true }
    // );

    if (
      !checkUser({
        age: parseInt(userAge),
        name: userName,
        password: userPass,
        email: userEmail,
      })
    ) {
      res
        .status(400)
        .json({ status: false, error_message: "Неверные параметры запроса" });
    }

    let updatedUser;
    let fields_to_update;
    if (userPass) {
      fields_to_update = {
        name: userName,
        email: userEmail,
        password: userPass,
        age: userAge,
      };
    } else {
      fields_to_update = {
        name: userName,
        email: userEmail,
        age: userAge,
      };
    }

    try {
      updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        fields_to_update,
        { new: true }
      );
    } catch (_e) {
      res
        .status(400)
        .json({ status: false, error_message: "Не удалось выполнить запрос" });
    }

    if (updatedUser) {
      res.status(200).json({ status: true, userData: updatedUser });
    } else {
      res.status(400).json({
        status: false,
        error_message: "Не удалось обновить пользователя",
      });
    }
  } else {
    res
      .status(400)
      .json({ status: false, error_message: "Неверный формат email" });
  }
};

exports.generateToken = async function (req, res) {
  const { userId } = req.body;
  if (!checkUserId({ id: userId })) {
    res
      .status(400)
      .json({ status: false, error_message: "Неверные параметры запроса" });
  }
  if (userId) {
    // const user = await models.User.findOne({
    //   include: [
    //     {
    //       model: models.Token,
    //       as: "token",
    //     },
    //   ],
    //   where: { id: req.body.userId },
    // });
    const user = await User.findOne(
      {
        _id: userId,
      },
      "id name email age token"
    ).exec();

    if (user) {
      // generate new token
      // const newToken = await models.Token.create({
      //   token: uuidv4(),
      //   userId: user.id,
      // });

      // if (newToken) {
      //   const userData = await models.User.findOne({
      //     include: [
      //       {
      //         model: models.Token,
      //         as: "token",
      //       },
      //     ],
      //     where: { id: req.body.userId },
      //   });
      //   if (userData) {
      //     res.status(200).json({ status: true, userData: userData });
      //   } else {
      //     await models.Token.destroy({ where: { userId: req.body.userId } });
      //     res.status(404).json({
      //       status: false,
      //       error_message: "Пользователя не существует. Перезагрузите страницу",
      //     });
      //   }
      // } else {
      //   res.status(400).json({
      //     status: false,
      //     error_message: "Не удалось сгенерировать токен",
      //   });
      // }

      // const updatedUser = await User.findOneAndUpdate({
      //   { id: req.body.userId },
      //   {$push: {
      //     token: {
      //       token: uuidv4(),
      //       createdAt: new Date(),
      //       updatedAt: new Date(),
      //     },
      //   }},
      //   { new: true }
      // });

      await User.updateOne(
        { _id: userId },
        {
          $push: {
            token: {
              token: uuidv4(),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        }
      );

      const updatedUser = await User.findOne(
        {
          _id: req.body.userId,
        },
        "id name email age token"
      ).exec();

      if (updatedUser) {
        res.status(200).json({ status: true, userData: updatedUser });
      } else {
        res.status(400).json({
          status: false,
          error_message: "Не удалось сгенерировать токен",
        });
      }
    } else {
      res.status(404).json({
        status: false,
        error_message: "Не удалось найти пользователя",
      });
    }
  } else {
    res.status(400).json({
      status: false,
      error_message: "Ошибка. Не достаточно параметров",
    });
  }
};

exports.resetToken = async function (req, res) {
  const { userId, tokenId } = req.body;
  if (userId && tokenId) {
    if (!checkUserId({ id: userId })) {
      res
        .status(400)
        .json({ status: false, error_message: "Неверные параметры запроса" });
    }

    if (!checkTokenId({ id: parseInt(tokenId) })) {
      res
        .status(400)
        .json({ status: false, error_message: "Неверные параметры запроса" });
    }
    // update necessary token
    // const updatedToken = await models.Token.update(
    //   {
    //     token: uuidv4(),
    //   },
    //   { where: { id: req.body.tokenId }, returning: true, plain: true }
    // );

    // if (updatedToken) {
    //   const user = await models.User.findOne({
    //     include: [
    //       {
    //         model: models.Token,
    //         as: "token",
    //         order: ["id", "ASC"],
    //       },
    //     ],
    //     where: { id: req.body.userId },
    //   });

    //   if (user) {
    //     res.status(200).json({ status: true, userData: user });
    //   } else {
    //     // delete all tokens of the deleted user
    //     await models.Token.destroy({ where: { userId: req.body.userId } });

    //     res.status(404).json({
    //       status: false,
    //       error_message:
    //         "Пользователь не найден. Вероятно он был удален ранее. Все токены данного пользователя удалены автоматически",
    //     });
    //   }
    // } else {
    //   res
    //     .status(400)
    //     .json({ status: false, error_message: "Не удалось обновить токен" });
    // }
    const user = await User.findOne(
      { _id: userId },
      "id name email age token"
    ).exec();

    if (user) {
      if (user.token.length > 0) {
        if (user.token[tokenId]) {
          user.token[tokenId] = {
            token: uuidv4(),
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            {
              token: user.token,
            },
            { new: true }
          );
          if (updatedUser) {
            res.status(200).json({ status: true, userData: updatedUser });
          } else {
            res.status(400).json({
              status: true,
              error_message: "Не удалось обновить токен",
            });
          }
        }
      } else {
        res.status(404).json({
          status: false,
          error_message:
            "Не удалось найти ни одного токена. Перезагрузите страницу",
        });
      }
    } else {
      res.status(404).json({
        status: false,
        error_message: "Не удалось найти пользователя",
      });
    }
  } else {
    res.status(400).json({
      status: false,
      error_message: "Ошибка. Не достаточно параметров",
    });
  }
};

exports.deleteToken = async function (req, res) {
  const { userId, tokenId } = req.body;

  if (!checkUserId({ id: userId })) {
    res
      .status(400)
      .json({ status: false, error_message: "Неверные параметры запроса" });
  }

  if (!checkTokenId({ id: parseInt(tokenId) })) {
    res
      .status(400)
      .json({ status: false, error_message: "Неверные параметры запроса" });
  }

  // const deletedToken = await models.Token.destroy({
  //   where: { id: req.body.tokenId },
  // });

  // const updatedUser = await models.User.findOne({
  //   include: [
  //     {
  //       model: models.Token,
  //       as: "token",
  //     },
  //   ],
  //   where: { id: req.body.userId },
  // });

  const user = await User.findOne(
    { _id: userId },
    "id name email age token"
  ).exec();

  if (user) {
    if (user.token.length > 0) {
      if (user.token[tokenId]) {
        let tokenArr = user.token;
        tokenArr.splice(tokenId, 1);

        const updatedUser = await User.findOneAndUpdate(
          { _id: userId },
          {
            token: tokenArr,
          },
          { new: true }
        );
        if (updatedUser) {
          res.status(200).json({ status: true, userData: updatedUser });
        } else {
          res.status(400).json({
            status: true,
            error_message: "Не удалось удалить токен",
          });
        }
      }
    } else {
      res.status(404).json({
        status: false,
        error_message:
          "Не удалось найти ни одного токена. Перезагрузите страницу",
      });
    }
  } else {
    res.status(404).json({
      status: false,
      error_message: "Не удалось найти пользователя",
    });
  }

  //   if (updatedUser) {
  //     res.status(200).json({ status: true, userData: updatedUser });
  //   } else {
  //     // user might have been deleted by another person
  //     // delete all the rest tokens in this case
  //     await models.Token.destroy({ where: { userId: req.body.userId } });
  //     res.status(404).json({
  //       status: false,
  //       error_message:
  //         "Пользователь был удален ранее, все токены данного пользователя автоматически удалены. Перезагрузите страницу",
  //     });
  //   }
  // } else {
  //   res
  //     .status(400)
  //     .json({ status: false, error_message: "Ошибка. Не хватает параметров" });
  // }
};

exports.deleteById = async function (req, res) {
  // check if user is admin
  if (req.session.user.is_admin) {
    if (!checkUserId({ id: req.body.userId })) {
      res
        .status(400)
        .json({ status: false, error_message: "Неверные параметры запроса" });
    }

    // const deletedUser = await models.User.destroy({
    //   where: {
    //     id: req.body.userId,
    //   },
    // });
    const result = await User.remove({ _id: req.body.userId }).exec();
    if (result) {
      res.status(200).json({ status: true });
    } else {
      res
        .status(400)
        .json({ status: false, error_message: "Не удалось удалить токен" });
    }
  } else {
    res.status(400).json({
      status: false,
      error_message:
        "Только пользователь с админ.правами может удалять других пользователей",
    });
  }
};
