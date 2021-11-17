const express = require("express");
const jsonParser = express.json();
const userController = require("../controllers/userController.js");
const userRouter = express.Router();

/**
 * @swagger
 * /users/auth:
 *   post:
 *     summary: auth process
 *     description: Auth process
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userEmail:
 *                 type: string
 *                 example: john@doe.ru
 *               userPass:
 *                 type: string
 *                 example: sup3rpass
 *     responses:
 *       200:
 *         description: json answer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: status of the operation
 *                   example: true
 *                 user_id:
 *                   type: integer
 *                   description: authenticated user id
 *                   example: 4
 *       404:
 *        description: user was not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: boolean
 *                  description: status of the response
 *                  example: false
 *                error_message:
 *                  type: string
 *                  description: message explaining what went wrong
 *                  example: Пользователь не найден
 *       400:
 *         description: wrong requestbody params or other mistakes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: status of the response
 *                   example: false
 *                 error_message:
 *                   type: string
 *                   description: message explaining what went wrong
 *                   example: Что-то пошло не так, не удалось добавить пользователя
 */
 userRouter.post("/auth", jsonParser, userController.authUser);


 /**
  * @swagger
  * /users/getById:
  *   post:
  *     summary: auth process
  *     description: Auth process
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               userEmail:
  *                 type: string
  *                 example: john@doe.ru
  *               userPass:
  *                 type: string
  *                 example: sup3rpass
  *     responses:
  *       200:
  *         description: Successful request answer
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 status:
  *                   type: boolean
  *                   description: status of the operation
  *                   example: true
  *                 userData:
  *                   type: object
  *                   properties:
  *                     id:
  *                       type: integer
  *                       example: 4
  *                     name:
  *                       type: string
  *                       example: John Doe
  *                     email:
  *                       type: string
  *                       example: john@email.com
  *                     age:
  *                       type: string
  *                       example: 34
  *                     password:
  *                       type: string
  *                       example: df9aba65b8a732d72481e9fe85db2aee
  *                     token:
  *                       type: array
  *                       items:
  *                         type: object
  *                         properties:
  *                           id:
  *                             type: integer
  *                             example: 4
  *                           token:
  *                             type: string
  *                             example: 6c9803f3-62b0-4c4e-be33-e9fe4dc3e4c7
  *                           userId:
  *                             type: integer
  *                             example: 2
  *                           createdAt:
  *                             type: datetime
  *                             example: 2021-11-15 02:23:31
  *                           updatedAt:
  *                             type: datetime
  *                             example: 2021-11-15 02:23:31
  *       404:
  *        description: User was not found
  *        content:
  *          application/json:
  *            schema:
  *              type: object
  *              properties:
  *                status:
  *                  type: boolean
  *                  description: status of the response
  *                  example: false
  *                error_message:
  *                  type: string
  *                  description: message explaining what went wrong
  *                  example: Пользователь не найден
  *       400:
  *         description: Wrong requestbody params or other mistakes
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 status:
  *                   type: boolean
  *                   description: status of the response
  *                   example: false
  *                 error_message:
  *                   type: string
  *                   description: message explaining what went wrong
  *                   example: Что-то пошло не так, не удалось добавить пользователя
  */
 userRouter.post("/getById", jsonParser, userController.getById);

/**
 * @swagger
 * /users/create:
 *   put:
 *     summary: Create new user
 *     description: Create new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 example: John Doe
 *               userEmail:
 *                 type: string
 *                 example: john@doe.ru
 *               userAge:
 *                 type: string
 *                 example: 34
 *               userPass:
 *                 type: string
 *                 example: sup3rpass
 *     responses:
 *       200:
 *         description: json answer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: status of the operation
 *                   example: true
 *                 error_message:
 *                   type: string
 *                   description: error message in case status is false
 *                   example: "Не удалось выполнить операцию"
 *                 userData:
 *                   type: object
 *                   description: created user data returned to build new table row
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: user id
 *                       example: 10
 *                     name:
 *                       type: string
 *                       description: user name
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       description: user email
 *                       example: john@doe.ru
 *                     age:
 *                       type: string
 *                       description: user age
 *                       example: 34
 *       400:
 *         description: wrong requestbody params
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: status of the response
 *                   example: false
 *                 error_message:
 *                   type: string
 *                   description: message explaining what went wrong
 *                   example: Что-то пошло не так, не удалось добавить пользователя
 */
userRouter.put("/create", jsonParser, userController.addUser);

/**
 * @swagger
 * /users/update:
 *   patch:
 *     summary: Update user data
 *     description: Update user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 example: John Doe
 *               UserAge:
 *                 type: string
 *                 example: 34
 *               userEmail:
 *                 type: string
 *                 example: john@doe.ru
 *               userPass:
 *                 type: string
 *                 example: sup3rpass
 *     responses:
 *       200:
 *         description: Successful request answer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: status of the operation
 *                   example: true
 *                 userData:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 4
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: john@email.com
 *                     age:
 *                       type: string
 *                       example: 34
 *                     password:
 *                       type: string
 *                       example: df9aba65b8a732d72481e9fe85db2aee
 *       400:
 *         description: Wrong requestbody params or other mistakes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: status of the response
 *                   example: false
 *                 error_message:
 *                   type: string
 *                   description: message explaining what went wrong
 *                   example: Что-то пошло не так, не удалось добавить пользователя
 */
userRouter.patch("/update", jsonParser, userController.update);

/**
 * @swagger
 * /users/generateToken:
 *   put:
 *     summary: Generate new user token
 *     description: Generate new user token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 15
 *     responses:
 *       200:
 *         description: Successful request answer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: status of the operation
 *                   example: true
 *                 userData:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 4
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: john@email.com
 *                     age:
 *                       type: string
 *                       example: 34
 *                     password:
 *                       type: string
 *                       example: df9aba65b8a732d72481e9fe85db2aee
 *                     token:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 4
 *                           token:
 *                             type: string
 *                             example: 6c9803f3-62b0-4c4e-be33-e9fe4dc3e4c7
 *                           userId:
 *                             type: integer
 *                             example: 2
 *                           createdAt:
 *                             type: datetime
 *                             example: 2021-11-15 02:23:31
 *                           updatedAt:
 *                             type: datetime
 *                             example: 2021-11-15 02:23:31
 *       404:
 *        description: User was not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: boolean
 *                  description: status of the response
 *                  example: false
 *                error_message:
 *                  type: string
 *                  description: message explaining what went wrong
 *                  example: Пользователь не найден
 *       400:
 *         description: Wrong requestbody params or other mistakes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: status of the response
 *                   example: false
 *                 error_message:
 *                   type: string
 *                   description: message explaining what went wrong
 *                   example: Что-то пошло не так, не удалось добавить пользователя
 */
userRouter.put("/generateToken", jsonParser, userController.generateToken);


/**
 * @swagger
 * /users/resetToken:
 *   patch:
 *     summary: Reset user token
 *     description: Reset user token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 15
 *               tokenId:
 *                 type: integer
 *                 example: 25
 *     responses:
 *       200:
 *         description: Successful request answer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: status of the operation
 *                   example: true
 *                 userData:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 15
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: john@email.com
 *                     age:
 *                       type: string
 *                       example: 34
 *                     password:
 *                       type: string
 *                       example: df9aba65b8a732d72481e9fe85db2aee
 *                     token:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 25
 *                           token:
 *                             type: string
 *                             example: 6c9803f3-62b0-4c4e-be33-e9fe4dc3e4c7
 *                           userId:
 *                             type: integer
 *                             example: 15
 *                           createdAt:
 *                             type: datetime
 *                             example: 2021-11-15 02:23:31
 *                           updatedAt:
 *                             type: datetime
 *                             example: 2021-11-15 02:23:31
 *       404:
 *        description: User was not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: boolean
 *                  description: status of the response
 *                  example: false
 *                error_message:
 *                  type: string
 *                  description: message explaining what went wrong
 *                  example: Пользователь не найден
 *       400:
 *         description: Wrong requestbody params or other mistakes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: status of the response
 *                   example: false
 *                 error_message:
 *                   type: string
 *                   description: message explaining what went wrong
 *                   example: Что-то пошло не так, не удалось добавить пользователя
 */
userRouter.patch("/resetToken", jsonParser, userController.resetToken);

/**
 * @swagger
 * /users/deleteToken:
 *   delete:
 *     summary: Delete user token
 *     description: Delete user token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 15
 *               tokenId:
 *                 type: integer
 *                 example: 25
 *     responses:
 *       200:
 *         description: Successful request answer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: status of the operation
 *                   example: true
 *                 userData:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 15
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: john@email.com
 *                     age:
 *                       type: string
 *                       example: 34
 *                     password:
 *                       type: string
 *                       example: df9aba65b8a732d72481e9fe85db2aee
 *                     token:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 25
 *                           token:
 *                             type: string
 *                             example: 6c9803f3-62b0-4c4e-be33-e9fe4dc3e4c7
 *                           userId:
 *                             type: integer
 *                             example: 15
 *                           createdAt:
 *                             type: datetime
 *                             example: 2021-11-15 02:23:31
 *                           updatedAt:
 *                             type: datetime
 *                             example: 2021-11-15 02:23:31
 *       404:
 *        description: User was not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: boolean
 *                  description: status of the response
 *                  example: false
 *                error_message:
 *                  type: string
 *                  description: message explaining what went wrong
 *                  example: Пользователь не найден
 *       400:
 *         description: Wrong requestbody params or other mistakes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: status of the response
 *                   example: false
 *                 error_message:
 *                   type: string
 *                   description: message explaining what went wrong
 *                   example: Что-то пошло не так, не удалось добавить пользователя
 */
userRouter.delete("/deleteToken", jsonParser, userController.deleteToken);

/**
 * @swagger
 * /users/deleteById:
 *   delete:
 *     summary: Delete user by id
 *     description: Delete user by id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 15
 *     responses:
 *       200:
 *         description: Successful request answer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: status of the operation
 *                   example: true
 *       404:
 *        description: User was not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: boolean
 *                  description: status of the response
 *                  example: false
 *                error_message:
 *                  type: string
 *                  description: message explaining what went wrong
 *                  example: Пользователь не найден
 *       400:
 *         description: Wrong requestbody params or other mistakes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: status of the response
 *                   example: false
 *                 error_message:
 *                   type: string
 *                   description: message explaining what went wrong
 *                   example: Что-то пошло не так, не удалось добавить пользователя
 */
userRouter.delete("/deleteById", jsonParser, userController.deleteById);

module.exports = userRouter;
