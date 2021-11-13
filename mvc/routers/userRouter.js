const express = require("express");
const jsonParser = express.json();
const userController = require("../controllers/userController.js");
const userRouter = express.Router();

userRouter.post("/create", jsonParser, userController.addUser);
userRouter.post("/auth", jsonParser, userController.authUser);
userRouter.post("/getById", jsonParser, userController.getById);
userRouter.patch("/update", jsonParser, userController.update);
userRouter.post("/generateToken", jsonParser, userController.generateToken);
userRouter.patch("/resetToken", jsonParser, userController.resetToken);
userRouter.post("/deleteToken", jsonParser, userController.deleteToken);
userRouter.post("/deleteById", jsonParser, userController.deleteById);
// userRouter.use("/", userController.getUsers);

module.exports = userRouter;
