const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res
      .status(403)
      .json({ status: "false", error_message: "Необходимо авторизоваться" });
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    console.log({ action: "checkPost", decoded_jwt: "decoded" });

    const userData = await User.findOne({
      _id: decoded.user_id,
    }).exec();

    if (decoded.user_id == userData._id) {
      return next();
    } else {
      return res.status(403)
      .json({ status: "false", error_message: "Необходимо авторизоваться" });
    }

    return next();
  } catch (err) {
    return res.status(403)
    .json({ status: "false", error_message: "Необходимо авторизоваться" });
  }
};

module.exports = verifyToken;
