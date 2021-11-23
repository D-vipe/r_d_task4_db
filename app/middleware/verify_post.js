const jwt = require("jsonwebtoken");
const User = require("../models.mongo/user.model");

const config = process.env;

const verifyToken = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res
      .status(403)
      .json({ status: "false", error_message: "Необходимо авторизоваться", reload: true });
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    console.log({ action: "checkPost", decoded_jwt: decoded });

    const userData = await User.findOne({
      _id: decoded.user_id,
    }).exec();

    console.log(userData);

    if (decoded.user_id == userData._id) {
      return next();
    } else {
      return res
        .status(403)
        .json({ status: "false", error_message: "Необходимо авторизоваться", reload: true });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(403)
      .json({ status: "false", error_message: "Необходимо авторизоваться", reload: true });
  }
};

module.exports = verifyToken;
