const { response } = require("express");
const fs = require("fs");
const models = require("../../database/models");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const md5 = require("md5");
const validator = require("email-validator");

const filePath = path.resolve(__dirname + "/../public/users.json");

exports.authUser = async function (req, res) {
  let formUser = req.body.userEmail ?? "",
    formPass = req.body.userPass ?? "";

  // validate email
  if (!validator.validate(formUser)) {
    res
      .status(400)
      .json({ status: false, error_message: "Неверный формат email" });
  } else {
    const userData = await models.User.findOne({
      include: [
        {
          model: models.Token,
          as: "token",
        },
      ],
      where: { email: formUser },
    });

    if (userData === null) {
      res
        .status(404)
        .json({ status: false, error_message: "Пользователь не найден" });
    } else {
      if (md5(md5(formPass)) !== userData.password) {
        res
          .status(400)
          .json({ status: false, error_message: "Неверный пароль" });
      } else {
        req.session.user = {
          id: userData.id,
          is_admin: userData.isAdmin,
          name: userData.name,
        };

        res.status(200).json({ status: true, user_id: userData.id });
      }
    }
  }
};

exports.addUser = async function (req, res) {
  // validate email
  if (!validator.validate(req.body.userEmail)) {
    res
      .status(400)
      .json({ status: false, error_message: "Неверный формат email" });
  } else {
    let existingUser = await models.User.findOne({
      include: [
        {
          model: models.Token,
          as: "token",
        },
      ],
      where: { email: req.body.userEmail },
    });

    if (existingUser === null) {
      const newUser = await models.User.create({
        name: req.body.userName,
        email: req.body.userEmail,
        age: req.body.userAge,
        password: md5(md5(req.body.userPass)),
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
  if (req.body.userId) {
    const user = await models.User.findOne({
      include: [
        {
          model: models.Token,
          as: "token",
        },
      ],
      where: { id: req.body.userId },
    });

    if (user !== null) {
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
  // validate email
  if (validator.validate(req.body.userEmail)) {
    const updatedUser = await models.User.update(
      {
        name: req.body.userName,
        email: req.body.userEmail,
        password: req.body.userPass,
        age: req.body.userAge,
      },
      { where: { id: req.body.userId }, returning: true, plain: true }
    );

    if (updatedUser) {
      res.status(200).json({ status: true, userData: updatedUser[1] });
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
  if (req.body.userId) {
    const user = await models.User.findOne({
      include: [
        {
          model: models.Token,
          as: "token",
        },
      ],
      where: { id: req.body.userId },
    });

    if (user) {
      // generate new token
      const newToken = await models.Token.create({
        token: uuidv4(),
        userId: user.id,
      });

      if (newToken) {
        const userData = await models.User.findOne({
          include: [
            {
              model: models.Token,
              as: "token",
            },
          ],
          where: { id: req.body.userId },
        });
        if (userData) {
          res.status(200).json({ status: true, userData: userData });
        } else {
          await models.Token.destroy({ where: { userId: req.body.userId } });
          res
            .status(404)
            .json({
              status: false,
              error_message:
                "Пользователя не существует. Перезагрузите страницу",
            });
        }
      } else {
        res.status(400).json({
          status: false,
          error_message: "Не удалось сгенерировать токен",
        });
      }
    } else {
      res.status(400).json({
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
  if (req.body.userId && req.body.tokenId) {
    // update necessary token
    const updatedToken = await models.Token.update(
      {
        token: uuidv4(),
      },
      { where: { id: req.body.tokenId }, returning: true, plain: true }
    );

    if (updatedToken) {
      const user = await models.User.findOne({
        include: [
          {
            model: models.Token,
            as: "token",
            order: ['id', 'ASC']
          },
        ],
        where: { id: req.body.userId },
      });

      if (user) {
        res.status(200).json({ status: true, userData: user });
      } else {
        // delete all tokens of the deleted user
        await models.Token.destroy({ where: { userId: req.body.userId } });

        res
          .status(404)
          .json({ status: false, error_message: "Пользователь не найден. Вероятно он был удален ранее. Все токены данного пользователя удалены автоматически" });
      }
    } else {
      res
        .status(400)
        .json({ status: false, error_message: "Не удалось обновить токен" });
    }
  } else {
    res.status(400).json({
      status: false,
      error_message: "Ошибка. Не достаточно параметров",
    });
  }
};

exports.deleteToken = async function (req, res) {
  if (req.body.userId && req.body.tokenId) {
    const deletedToken = await models.Token.destroy({
      where: { id: req.body.tokenId },
    });

    console.log({ deleted_token: deletedToken });

    const updatedUser = await models.User.findOne({
      include: [
        {
          model: models.Token,
          as: "token",
        },
      ],
      where: { id: req.body.userId },
    });

    if (updatedUser) {
      res.status(200).json({ status: true, userData: updatedUser });
    } else {
      // user might have been deleted by another person
      // delete all the rest tokens in this case
      await models.Token.destroy({ where: { userId: req.body.userId } });
      res.status(404).json({ status: false, error_message: 'Пользователь был удален ранее, все токены данного пользователя автоматически удалены. Перезагрузите страницу' });
    }
  } else {
    res
      .status(400)
      .json({ status: false, error_message: "Ошибка. Не хватает параметров" });
  }
};

exports.deleteById = async function (req, res) {
  // check if user is admin
  if (req.session.user.is_admin) {
    if (req.body.userId) {
      const deletedUser = await models.User.destroy({
        where: {
          id: req.body.userId,
        },
      });
      res.status(200).json({ status: true });
    } else {
      res
        .status(400)
        .json({ status: false, error_message: "Не указан id пользователя" });
    }
  } else {
    res.status(400).json({
      status: false,
      error_message:
        "Только пользователь с админ.правами может удалять других пользователей",
    });
  }
};
