const express = require("express");
const jsonParser = express.json();
const userController = require("../controllers/userController.js");
const userRouter = express.Router();

userRouter.post("/create", jsonParser, userController.addUser);
userRouter.post("/auth", jsonParser, userController.authUser);
userRouter.post("/getById", jsonParser, userController.getById);
userRouter.post("/update", jsonParser, userController.update);
userRouter.post("/generateToken", jsonParser, userController.generateToken);
userRouter.post("/resetToken", jsonParser, userController.resetToken);
userRouter.post("/deleteToken", jsonParser, userController.deleteToken);
userRouter.post("/deleteById", jsonParser, userController.deleteById);

module.exports = userRouter;
