const jwt = require("jsonwebtoken");

const config = process.env;

const checkAuth = async (req, res, next) => {
  const session_user = req.session.user;

  if (session_user === undefined) {
    if (req.cookies.token === undefined) {
      res.render("main_screen", {
        title: "Auth",
        text1: "test text",
      });
    } else {
      // let userData = await models.User.findOne({
      //   where: { id: parseInt(req.cookies.userId) },
      // });

      const token = req.cookies.token;

      try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        console.log({ action: "checkAuth", decoded_jwt: decoded });

        const userData = await User.findOne({
          _id: decoded.user_id,
        }).exec();

        // check if user exists

        if (decoded.user_id == userData._id) {
          req.session.user = {
            id: userData._id,
            is_admin: userData.isAdmin,
            name: userData.name,
          };
          return next();
        } else {
          return res.render("main_screen", {
            title: "Auth",
            text1: "test text",
          });
        }

      } catch (err) {
        return res.render("main_screen", {
          title: "Auth",
          text1: "test text",
        });
      }
    }
  } else {
    // logout method destroys cookie
    if (req.cookies.token === undefined) {
      return res.render("main_screen", {
        title: "Auth",
        text1: "test text",
      });
    } else {
      return next();
    }
  }
};

module.exports = checkAuth;
