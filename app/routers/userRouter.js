const express = require("express");
const jsonParser = express.json();
const userController = require("../controllers/userController.js");
const userRouter = express.Router();

userRouter.put("/create", jsonParser, userController.addUser);
userRouter.post("/auth", jsonParser, userController.authUser);
userRouter.post("/getById", jsonParser, userController.getById);
userRouter.patch("/update", jsonParser, userController.update);
userRouter.put("/generateToken", jsonParser, userController.generateToken);
userRouter.patch("/resetToken", jsonParser, userController.resetToken);
userRouter.delete("/deleteToken", jsonParser, userController.deleteToken);
userRouter.delete("/deleteById", jsonParser, userController.deleteById);

module.exports = userRouter;
